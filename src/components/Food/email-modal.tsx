// 'use client';

// import { useState } from "react";
// import { X, Mail } from "lucide-react";
// import { toast } from "sonner";
// import axios, { isAxiosError } from "axios";

// interface EmailProps {
//     onClose: () => void;
// }

// export const EmailModal = ({ onClose }: EmailProps) => {
//     const [email, setEmail] = useState("");
//     const [loading, setLoading] = useState(false);

//     const handleSendMail = async () => {
//         const token = localStorage.getItem('token');

//         try {
//             setLoading(true);

//             const res = await axios.post(`https://foodorder-api-29b9.onrender.com/api/v1/send-mail`, { email },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 }
//             );
//             console.log(res.data);

//         } catch (error) {
//             console.log('error-resp', error);
            
//             let err = "Failed to delete item";

//             if (isAxiosError(error)) {
//                 err = error.response?.data?.message || err;
//             }

//             toast.error(err);
//         } finally {
//             setLoading(false);
//         }
//     }

//     return (
//         <div className="fixed inset-0 z-9999 bg-black/40 flex items-center justify-center">
//             <div className="relative bg-white p-6 rounded-2xl shadow-xl w-[90%] max-w-md">
//                 <button
//                     onClick={onClose}
//                     className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
//                 >
//                     <X size={18} />
//                 </button>

//                 <div className="flex items-center gap-2 mb-4">
//                     <Mail className="text-sky-600" />
//                     <h2 className="text-lg font-semibold">
//                         Send Email
//                     </h2>
//                 </div>

//                 <input
//                     type="email"
//                     placeholder="Enter email address"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="w-full border rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-sky-500"
//                 />

//                 <button
//                     onClick={handleSendMail}
//                     disabled={loading || !email}
//                     className="flex-1 bg-sky-600 text-white py-2 px-3 rounded-lg hover:bg-sky-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
//                 >
//                     {loading ? (
//                         <>
//                             <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                             </svg>
//                             Sending...
//                         </>
//                     ) : (
//                         'Send Email'
//                     )}
//                 </button>
//             </div>
//         </div>
//     );
// };
