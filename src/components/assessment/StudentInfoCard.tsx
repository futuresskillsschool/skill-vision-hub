
import React from "react";
import { motion } from "framer-motion";
import { User, BookOpen, School } from "lucide-react";

export interface StudentDetails {
  id: string;
  name: string;
  class: string;
  section: string;
  school: string;
}

interface StudentInfoCardProps {
  studentDetails: StudentDetails | null;
}

const StudentInfoCard = ({ studentDetails }: StudentInfoCardProps) => {
  if (!studentDetails) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-brand-purple/10 rounded-xl p-6 mb-8"
    >
      <h2 className="text-xl font-semibold mb-3 text-brand-purple">Student Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center">
          <User className="h-5 w-5 text-brand-purple mr-2" />
          <div>
            <p className="text-sm text-gray-600">Name</p>
            <p className="font-medium">{studentDetails.name}</p>
          </div>
        </div>
        <div className="flex items-center">
          <BookOpen className="h-5 w-5 text-brand-purple mr-2" />
          <div>
            <p className="text-sm text-gray-600">Class & Section</p>
            <p className="font-medium">{studentDetails.class} - {studentDetails.section}</p>
          </div>
        </div>
        <div className="flex items-center md:col-span-2">
          <School className="h-5 w-5 text-brand-purple mr-2" />
          <div>
            <p className="text-sm text-gray-600">School</p>
            <p className="font-medium">{studentDetails.school}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StudentInfoCard;
