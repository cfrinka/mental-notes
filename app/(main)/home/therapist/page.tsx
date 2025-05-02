"use client";
import PatientFeed from "@/components/PatientFeed";
import PatientList from "@/components/PatientList";
import { useUserContext } from "@/context/UserContext";
import React, { useEffect, useState } from "react";

const TherapistHome = () => {
  const { userData } = useUserContext();
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(
    null
  );

  useEffect(() => {
    console.log("therapist", userData);
  }, [userData]);

  return (
    <div className="w-full flex flex-col md:flex-row gap-4 p-4">
      <div className="w-full md:w-1/4 bg-[#EE7B82] p-4 rounded-xl shadow-lg flex flex-col gap-4">
        <h2 className="font-bold text-2xl text-[#fff]">Meu Painel</h2>
        <PatientList onSelectPatient={setSelectedPatientId} />
      </div>

      <div className="w-full md:flex-1 bg-[#EE7B82] p-4 rounded-xl shadow-lg flex flex-col gap-4">
        <h2 className="font-bold text-2xl text-[#fff] mb-2">
          Feed de Paciente
        </h2>
        <PatientFeed selectedPatientId={selectedPatientId} />
      </div>
    </div>
  );
};

export default TherapistHome;
