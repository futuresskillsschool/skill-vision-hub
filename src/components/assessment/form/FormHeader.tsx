
import React from "react";
import { motion } from "framer-motion";

interface FormHeaderProps {
  title: string;
  description: string;
}

const FormHeader = ({ title, description }: FormHeaderProps) => {
  return (
    <div className="text-center mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default FormHeader;
