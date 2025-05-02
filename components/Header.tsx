"use client"; // Marking this as a Client Component

import React from "react";
import Image from "next/image";
import logo from "@/assets/logo.png";

const Header = () => {
  const handleLogout = () => {
    console.log("User logged out");
  };

  return (
    <div className="w-full bg-[#FDC768] flex justify-between items-center p-6 shadow-lg rounded-b-lg">
      <div className="flex items-center gap-6">
        <Image src={logo} alt={"logo"} width={120} height={120} />
        <p className="text-4xl text-[#8A8ADF] font-bold">Diário Mental</p>
      </div>

      <button
        onClick={handleLogout}
        className="bg-[#8A8ADF] text-white py-2 px-6 rounded-lg hover:bg-[#6b6dbf] transition-all duration-200"
      >
        Sair
      </button>
    </div>
  );
};

export default Header;
