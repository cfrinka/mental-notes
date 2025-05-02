"use client";
import { useUserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Home = () => {
  const { userData } = useUserContext();
  const router = useRouter();
  useEffect(() => {
    console.log("userData", userData);
    if (userData && userData.role === "therapist") {
      router.push("/home/therapist");
    } else if (userData && userData.role === "patient") {
      router.push("/home/patient");
    } else {
      router.push("/");
    }
  }, [userData]);

  return <div>Redirect based on role</div>;
};

export default Home;
