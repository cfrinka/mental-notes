import React from "react";

interface ButtonProps {
  label: string;
  onClick?: () => void;
  type: "primary" | "secondary";
  size: "small" | "medium" | "large";
}

const Button: React.FC<ButtonProps> = ({ label, onClick, type, size }) => {
  const sizeClasses = {
    small: "w-24",
    medium: "w-48",
    large: "w-full",
  };

  return (
    <button
      onClick={onClick}
      className={`rounded-md transition-all duration-200 text-white ${
        type === "primary"
          ? "bg-[#8A8ADF] hover:bg-[#7a7bde] focus:outline-none"
          : "bg-[#EE7B82] hover:bg-[#e57375] focus:outline-none"
      } ${sizeClasses[size]} py-2 text-base`}
    >
      {label}
    </button>
  );
};

export default Button;
