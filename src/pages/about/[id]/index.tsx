import { teamMembersService } from "@/services/teamMembersService";
import Image from "next/image";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import type { TeamMember } from "@/api/models/TeamMember";
import { useFormatDate } from "@/hooks/useFormatData";
import {
  ArrowLeft,
  Calendar,
  Contact,
  Lightbulb,
  TriangleAlert,
  User,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function TeamMemberDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { formatDate } = useFormatDate();

  const {
    data: member,
    isLoading,
    isError,
  } = useQuery<TeamMember>({
    queryKey: ["teamMember", id],
    queryFn: () => teamMembersService.getById(id as string),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-gray-500">Loading team member profile...</p>
        </div>
      </div>
    );
  }
  if (isError || !member) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center min-">
        <div className="bg-red-50 p-8 rounded-lg shadow-sm inline-block">
          <TriangleAlert className="h-12 w-12 text-red-600 mb-4 mx-auto" />
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Team Member Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The requested team member information couldnt be found.
          </p>
          <Link
            href="/about"
            className="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Return to Team Page
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-white to-gray-50">
      <motion.div
        className="max-w-7xl mx-auto px-4 py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Link
          href="/about"
          className="inline-flex items-center mb-8 text-gray-800 hover:text-black transition-colors font-medium"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Team
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <motion.div
            className="md:col-span-4 lg:col-span-5"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative h-[28rem] md:h-[32rem] rounded-xl overflow-hidden shadow-xl">
              {member?.imageUrl ? (
                <Image
                  src={member.imageUrl}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center">
                  <span className="text-6xl text-blue-600 font-bold">
                    {member?.name.charAt(0)}
                  </span>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent h-32"></div>
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <h1 className="text-3xl font-bold mb-1">{member?.name}</h1>
                <h2 className="text-xl text-blue-200">{member?.role}</h2>
              </div>
            </div>

            {member?.contact &&
              Object.values(member.contact).some((value) => value) && (
                <motion.div
                  className="mt-8 bg-white shadow-lg rounded-xl p-6"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h3 className="text-xl font-bold mb-5 text-gray-800 flex items-center">
                    <Contact className="mr-2" />
                    Contact
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {member.contact.email && (
                      <a
                        href={`mailto:${member.contact.email}`}
                        className="flex items-center bg-gray-50  p-3 rounded-lg text-gray-700 hover:text-blue-600 transition-colors group"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 mr-2 text-gray-400 group-hover:text-blue-500 transition-colors"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <span>Email</span>
                      </a>
                    )}
                    {member.contact.linkedin && (
                      <a
                        href={member.contact.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center bg-gray-50 p-3 rounded-lg text-gray-700 hover:text-blue-600 transition-colors group"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 mr-2 text-gray-400 group-hover:text-blue-500 transition-colors"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                        <span>LinkedIn</span>
                      </a>
                    )}
                    {member.contact.twitter && (
                      <a
                        href={member.contact.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center bg-gray-50 p-3 rounded-lg text-gray-700 hover:text-blue-600 transition-colors group"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 mr-2 text-gray-400 group-hover:text-blue-500 transition-colors"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                        </svg>
                        <span>Twitter</span>
                      </a>
                    )}
                  </div>
                </motion.div>
              )}
          </motion.div>

          <div className="md:col-span-8 lg:col-span-7">
            <motion.div
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.7 }}
            >
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <User />
                  Biography
                </h2>
                <ReactMarkdown>{member.bio}</ReactMarkdown>
              </div>

              {member?.skills && member.skills.length > 0 && (
                <motion.div
                  className="bg-white rounded-xl shadow-lg p-8 mb-8"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Lightbulb />
                    Skills & Expertise
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {member.skills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-gray-100 text-gray-900 rounded-full px-4 py-2 text-sm font-medium border border-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {member?.createdAt && (
                <motion.div
                  className="bg-gray-50 rounded-lg p-4 inline-block"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <p className="text-gray-600 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 " />
                    <span className="font-medium">Joined:</span>
                    <span className="ml-2">{formatDate(member.createdAt)}</span>
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
