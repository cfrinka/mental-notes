"use client";
import { useUserContext } from "@/context/UserContext";
import React, { useState } from "react";

type Patient = {
  email: string;
  name: string;
};

type PatientListProps = {
  patients: Patient[];
  onSelectPatient: (email: string | null) => void;
};

const PatientList: React.FC<PatientListProps> = ({
  onSelectPatient,
  patients,
}) => {
  const [selectedId, setSelectedPatient] = useState<string | null>(null);
  const { userData } = useUserContext();

  const handleSelect = (email: string) => {
    setSelectedPatient(email);
    onSelectPatient(email);
  };

  return (
    <div className="bg-[#FDC768] p-4 rounded-xl shadow space-y-4 min-h-[510px]">
      <h2 className="text-lg font-semibold text-[#8A8ADF]">
        Pacientes de <span className="text-[#EE7B82]">{userData?.name}</span>
      </h2>

      {/* Mobile View: Dropdown */}
      <select
        className="block md:hidden w-full p-2 border border-[#EE7B82] rounded bg-white text-[#8A8ADF]"
        onChange={(e) => handleSelect(e.target.value)}
        defaultValue=""
      >
        <option value="" disabled>
          Selecione um paciente
        </option>
        {patients.map((patient) => (
          <option key={patient.email} value={patient.email}>
            {patient.name}
          </option>
        ))}
      </select>

      {/* Desktop View: List */}
      <ul className="hidden md:block space-y-2">
        {patients.map((patient) => (
          <li
            key={patient.email}
            className={`cursor-pointer bg-white hover:bg-[#EE7B82] hover:text-white p-3 rounded-lg transition-colors text-[#8A8ADF] ${
              selectedId === patient.email ? "bg-[#8A8ADF] text-[#EE7B82]" : ""
            }`}
            onClick={() => handleSelect(patient.email)}
          >
            {patient.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PatientList;
