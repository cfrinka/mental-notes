"use client";
import React, { useState } from "react";
import logo from "@/assets/logo.png";
import Image from "next/image";
import { auth, db } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  doc,
  setDoc,
  where,
} from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import Button from "./Button";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/UserContext";

const LoginRegister = () => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    therapistId: "",
    role: "patient",
  });
  const [errorMessage, setErrorMessage] = useState<string>("");

  const router = useRouter();
  const { setUserData } = useUserContext();

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData((prev) => ({ ...prev, role: e.target.value }));
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous error messages

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginData.email,
        loginData.password
      );

      const user = userCredential.user;

      // Search for the user in the 'therapists' collection using email
      const therapistsQuery = query(
        collection(db, "therapists"),
        where("email", "==", user.email)
      );
      const therapistsSnapshot = await getDocs(therapistsQuery);

      // Search for the user in the 'patients' collection using email
      const patientsQuery = query(
        collection(db, "patients"),
        where("email", "==", user.email)
      );
      const patientsSnapshot = await getDocs(patientsQuery);

      let userData;
      let role;

      if (!therapistsSnapshot.empty) {
        userData = therapistsSnapshot.docs[0].data();
        role = "therapist";
      } else if (!patientsSnapshot.empty) {
        userData = patientsSnapshot.docs[0].data();
        role = "patient";
      } else {
        setErrorMessage("User data not found.");
        return;
      }

      const userDataFormattedForContext = {
        uid: user.uid,
        email: user.email,
        name: userData.name,
        role,
        therapistId: userData.therapistId || null,
      };

      setUserData(userDataFormattedForContext);

      // Redirect the user based on their role
      if (role === "therapist") {
        router.push("/home/therapist");
      } else {
        router.push("/home/patient");
      }
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        setErrorMessage(error.message);
        console.error("Firebase error code:", error.code);
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
        console.error("Generic error:", error.message);
      }
    }
  };

  const getNextTherapistId = async () => {
    const q = query(
      collection(db, "therapists"),
      orderBy("therapistId", "desc"),
      limit(1)
    );
    const snapshot = await getDocs(q);
    const lastId = snapshot.docs[0]?.data()?.therapistId || 0;
    return lastId + 1;
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { name, email, password, role, therapistId } = registerData;
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCred.user.uid;

      const userData = { uid, name, email, role, therapistId };

      if (role === "therapist") {
        const nextId = await getNextTherapistId();
        await setDoc(doc(db, "therapists", uid), {
          name,
          email,
          therapistId: nextId,
        });
      } else {
        await setDoc(doc(db, "patients", uid), {
          name,
          email,
          therapistId: role === "patient" ? therapistId : null,
        });
      }

      setUserData(userData);

      alert("User registered successfully");
      router.push("/home");
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        setErrorMessage(error.message);
        console.error("Firebase error code:", error.code);
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
        console.error("Generic error:", error.message);
      }
    }
  };

  return (
    <div className="w-full flex flex-col justify-center items-center min-h-screen bg-slate-300 gap-4">
      <Image src={logo} alt="logo" width={150} />
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
        <div className="flex justify-between mb-6 gap-2">
          <button
            onClick={() => setActiveTab("login")}
            className={`w-full py-2 rounded-t-xl text-white ${
              activeTab === "login" ? "bg-[#EE7B82]" : "bg-[#8A8ADF]"
            }`}
          >
            Entrar
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`w-full py-2 rounded-t-xl text-white ${
              activeTab === "register" ? "bg-[#EE7B82]" : "bg-[#8A8ADF]"
            }`}
          >
            Cadastrar
          </button>
        </div>

        {errorMessage && (
          <div className="text-red-500 mb-4">{errorMessage}</div>
        )}

        {activeTab === "login" ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <h2 className="font-bold text-2xl text-[#8A8ADF] mb-4">Entrar</h2>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={loginData.email}
              onChange={handleLoginChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <input
              type="password"
              name="password"
              placeholder="Senha"
              value={loginData.password}
              onChange={handleLoginChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <Button label="Entrar" type="primary" size="small" />
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <h2 className="font-bold text-2xl text-[#8A8ADF] mb-4">
              Cadastrar
            </h2>
            <input
              type="text"
              name="name"
              placeholder="Nome Completo"
              value={registerData.name}
              onChange={handleRegisterChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={registerData.email}
              onChange={handleRegisterChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <input
              type="password"
              name="password"
              placeholder="Senha"
              value={registerData.password}
              onChange={handleRegisterChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="patient"
                  checked={registerData.role === "patient"}
                  onChange={handleRoleChange}
                  className="mr-2"
                />
                Paciente
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="therapist"
                  checked={registerData.role === "therapist"}
                  onChange={handleRoleChange}
                  className="mr-2"
                />
                Terapeuta
              </label>
            </div>
            {registerData.role === "patient" && (
              <input
                type="text"
                name="therapistId"
                placeholder="ID Terapeuta"
                value={registerData.therapistId}
                onChange={handleRegisterChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            )}
            <Button label="Cadastrar" type="primary" size="small" />
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginRegister;
