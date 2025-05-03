"use client";

import React from "react";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/UserContext";

const Header = () => {
  const router = useRouter();
  const { clearUserData } = useUserContext();
  const handleLogout = async () => {
    try {
      await signOut(auth);
      clearUserData();
      router.push("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
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
