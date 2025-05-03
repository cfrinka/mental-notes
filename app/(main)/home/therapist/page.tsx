"use client";
import PatientFeed from "@/components/PatientFeed";
import PatientList from "@/components/PatientList";
import { useUserContext } from "@/context/UserContext";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { PostType } from "../patient/page";

type Patient = {
  email: string;
  name: string;
};

const TherapistHome = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null
  );
  const [selectedPatientPosts, setSelectedPatientPosts] = useState<PostType[]>(
    []
  );
  const { userData } = useUserContext();

  useEffect(() => {
    if (!userData) return;
    const fetchPatients = async () => {
      try {
        const patientsRef = collection(db, "patients");
        const q = query(
          patientsRef,
          where("therapistId", "==", userData?.therapistId?.toString())
        );
        const querySnapshot = await getDocs(q);

        const data = querySnapshot.docs.map((doc) => ({
          email: doc.data().email,
          name: doc.data().name,
        }));
        setPatients(data);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, [userData]);

  useEffect(() => {
    if (!selectedPatientId) return;

    const fetchPosts = async () => {
      try {
        const postsRef = collection(db, "posts");
        const q = query(postsRef, where("patient", "==", selectedPatientId));
        const querySnapshot = await getDocs(q);

        const data: PostType[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as PostType[];

        setSelectedPatientPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [selectedPatientId]);

  return (
    <div className="w-full flex flex-col md:flex-row gap-4 p-4">
      <div className="w-full md:w-1/4 bg-[#EE7B82] p-4 rounded-xl shadow-lg flex flex-col gap-4">
        <h2 className="font-bold text-2xl text-[#fff]">
          Meu ID: {userData?.therapistId}
        </h2>
        {patients && (
          <PatientList
            onSelectPatient={setSelectedPatientId}
            patients={patients}
          />
        )}
      </div>

      <div className="w-full md:flex-1 bg-[#EE7B82] p-4 rounded-xl shadow-lg flex flex-col gap-4">
        <h2 className="font-bold text-2xl text-[#fff] mb-2">
          Feed de Paciente
        </h2>
        <PatientFeed posts={selectedPatientPosts} />
      </div>
    </div>
  );
};

export default TherapistHome;
