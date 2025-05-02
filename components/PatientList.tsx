"use client";
import React, { useState } from "react";

type Patient = {
  id: number;
  name: string;
};

type PatientListProps = {
  onSelectPatient: (id: number | null) => void;
};

const PatientList: React.FC<PatientListProps> = ({ onSelectPatient }) => {
  const [therapist] = useState("Test Therapist");
  const [patients] = useState<Patient[]>([
    { id: 1, name: "Patient Name 1" },
    { id: 2, name: "Patient Name 2" },
    { id: 3, name: "Patient Name 3" },
  ]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleSelect = (id: number) => {
    setSelectedId(id);
    onSelectPatient(id);
  };

  return (
    <div className="bg-[#FDC768] p-4 rounded-xl shadow space-y-4">
      <h2 className="text-lg font-semibold text-[#8A8ADF]">
        Pacientes de <span className="text-[#EE7B82]">{therapist}</span>
      </h2>

      {/* Mobile View: Dropdown */}
      <select
        className="block md:hidden w-full p-2 border border-[#EE7B82] rounded bg-white text-[#8A8ADF]"
        onChange={(e) => handleSelect(Number(e.target.value))}
        defaultValue=""
      >
        <option value="" disabled>
          Selecione um paciente
        </option>
        {patients.map((patient) => (
          <option key={patient.id} value={patient.id}>
            {patient.name}
          </option>
        ))}
      </select>

      {/* Desktop View: List */}
      <ul className="hidden md:block space-y-2">
        {patients.map((patient) => (
          <li
            key={patient.id}
            className={`cursor-pointer bg-white hover:bg-[#EE7B82] hover:text-white p-3 rounded-lg transition-colors text-[#8A8ADF] ${
              selectedId === patient.id ? "bg-[#8A8ADF] text-[#EE7B82]" : ""
            }`}
            onClick={() => handleSelect(patient.id)}
          >
            {patient.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PatientList;
