
// import { useState, useEffect } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import Navbar from '@/components/Navbar';
// import Footer from '@/components/Footer';
// import StudentDetailsForm from '@/components/assessment/StudentDetailsForm';
// import { useAuth } from '@/contexts/AuthContext';
// import { supabase } from '@/integrations/supabase/client';

// const StudentDetailsPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { id } = useParams<{ id: string }>();
//   const { user } = useAuth();
//   const [loading, setLoading] = useState(true);
  
//   // Check if we have results data from the previous page
//   const resultsData = location.state;
  
//   useEffect(() => {
//     // Redirect to the assessment page if no results data
//     if (!resultsData) {
//       console.log("No results data, redirecting to assessment page");
//       navigate(`/assessment/${id || 'scct'}`);
//       return;
//     }
    
//     // If user is logged in, bypass the student details form
//     const checkForExistingDetails = async () => {
//       if (user) {
//         try {
//           setLoading(true);
          
//           // Check if the user already has student details
//           const { data, error } = await supabase
//             .from('student_details')
//             .select('*')
//             .eq('user_id', user.id)
//             .order('created_at', { ascending: false })
//             .limit(1);
            
//           if (error) {
//             console.error('Error fetching user details:', error);
//             setLoading(false);
//             return;
//           }
          
//           // If the user has existing details, use the latest one
//           if (data && data.length > 0) {
//             console.log('Found existing student details:', data[0]);
            
//             const assessmentType = id || resultsData.assessmentType || 'scct';
            
//             // Navigate directly to results page with the student ID
//             navigate(`/assessment/${assessmentType}/results`, {
//               state: {
//                 ...resultsData,
//                 studentId: data[0].id
//               }
//             });
//           } else {
//             // No existing details, show the form
//             setLoading(false);
//           }
//         } catch (error) {
//           console.error('Error checking for existing details:', error);
//           setLoading(false);
//         }
//       } else {
//         // Not logged in, show the form
//         setLoading(false);
//       }
//     };
    
//     checkForExistingDetails();
//   }, [resultsData, navigate, id, user]);
  
//   // Determine which assessment type based on the URL or the results data
//   let assessmentType = id || resultsData?.assessmentType || 'scct';
  
//   console.log("StudentDetailsPage - Assessment type:", assessmentType);
//   console.log("StudentDetailsPage - Results data:", resultsData);
  
//   const handleSubmitSuccess = (studentId: string) => {
//     console.log("Student details submitted, navigating to results page with:", { ...resultsData, studentId });
    
//     // Navigate to the results page with the results data
//     navigate(`/assessment/${assessmentType}/results`, {
//       state: {
//         ...resultsData,
//         studentId
//       }
//     });
//   };
  
//   // If loading or redirecting, show minimal content
//   if (loading || !resultsData) {
//     return (
//       <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-orange-50 to-amber-50">
//         <Navbar />
//         <main className="flex-grow pt-24 pb-16 px-4 flex items-center justify-center">
//           <div className="animate-pulse flex space-x-4">
//             <div className="rounded-full bg-slate-200 h-10 w-10"></div>
//             <div className="flex-1 space-y-6 py-1">
//               <div className="h-2 bg-slate-200 rounded"></div>
//               <div className="space-y-3">
//                 <div className="grid grid-cols-3 gap-4">
//                   <div className="h-2 bg-slate-200 rounded col-span-2"></div>
//                   <div className="h-2 bg-slate-200 rounded col-span-1"></div>
//                 </div>
//                 <div className="h-2 bg-slate-200 rounded"></div>
//               </div>
//             </div>
//           </div>
//         </main>
//         <Footer />
//       </div>
//     );
//   }
  
//   return (
//     <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-orange-50 to-amber-50">
//       <Navbar />
      
//       <main className="flex-grow pt-24 pb-16 px-4">
//         <div className="container mx-auto">
//           <StudentDetailsForm 
//             assessmentType={assessmentType}
//             resultsData={resultsData}
//             onSubmitSuccess={handleSubmitSuccess}
//           />
//         </div>
//       </main>
      
//       <Footer />
//     </div>
//   );
// };

// export default StudentDetailsPage;
