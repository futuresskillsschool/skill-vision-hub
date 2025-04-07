
import React from "react";
import { motion } from "framer-motion";

interface FormHeaderProps {
  title: string;
  description: string;
}

const FormHeader = ({ title, description }: FormHeaderProps) => {
  return (
    <motion.div 
      className="text-center mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

export default FormHeader;
