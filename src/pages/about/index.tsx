import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import Image from "next/image";
import { teamMembersService } from "@/services/teamMembersService";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { TeamMember } from "@/api/models/TeamMember";

interface AboutPageProps {
  teamMembers: TeamMember[];
}

export default function AboutPage({ teamMembers }: AboutPageProps) {
  const router = useRouter();
  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 py-12 space-y-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero section */}
      <section className="text-center space-y-4">
        <motion.h1
          className="text-5xl font-extrabold text-gray-800"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          About Blog Web
        </motion.h1>
        <motion.p
          className="text-xl text-gray-600 max-w-3xl mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Sharing knowledge, stories, and ideas with the world
        </motion.p>
      </section>

      {/* About section with cards */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Mission Card */}
        <motion.div
          whileHover={{ y: -5 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="h-full shadow-lg border-0 overflow-hidden bg-white">
            <div className="h-2 bg-gray-800"></div>
            <CardHeader>
              <CardTitle className="text-2xl text-gray-800">
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Blog Web is a platform dedicated to sharing knowledge, stories,
                and ideas. We believe in the power of written expression and the
                impact it can have on individuals and communities worldwide.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* What We Offer Card */}
        <motion.div
          whileHover={{ y: -5 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="h-full shadow-lg border-0 overflow-hidden bg-white">
            <div className="h-2 bg-gray-700"></div>
            <CardHeader>
              <CardTitle className="text-2xl text-gray-800">
                What We Offer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Our platform provides everything you need to create and share
                your ideas:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                  <p className="font-medium text-gray-800">
                    User-friendly Platform
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                  <p className="font-medium text-gray-800">
                    Secure Authentication
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                  <p className="font-medium text-gray-800">Rich Text Editing</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                  <p className="font-medium text-gray-800">Real-time Updates</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Technology Stack Card */}
        <motion.div
          whileHover={{ y: -5 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="h-full shadow-lg border-0 overflow-hidden bg-white">
            <div className="h-2 bg-gray-600"></div>
            <CardHeader>
              <CardTitle className="text-2xl text-gray-800">
                Technology Stack
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Built with modern technologies for a fast, responsive, and
                secure experience.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Next.js",
                  "TypeScript",
                  "Tailwind CSS",
                  "React",
                  "Node.js",
                ].map((tech) => (
                  <span
                    key={tech}
                    className="bg-gray-100 text-gray-800 rounded-full px-3 py-1 text-sm border border-gray-200 hover:bg-gray-200 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Team section */}
      <section>
        <div className="text-center mb-12">
          <motion.h2
            className="text-4xl font-bold mb-4 text-gray-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            Our Team
          </motion.h2>
          <motion.div
            className="h-1 w-24 bg-gray-400 mx-auto mb-4"
            initial={{ width: 0 }}
            animate={{ width: "6rem" }}
            transition={{ duration: 0.7 }}
          ></motion.div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Meet the talented individuals behind Blog Web
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member: TeamMember) => (
            <motion.div
              key={member._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card
                className="p-0 pb-2 rounded-t-xl border-0 shadow-lg h-full hover:shadow-xl transition-shadow duration-300"
                onClick={() => router.push(`/about/${member._id}`)}
              >
                <div className="relative h-64 w-full rounded-t-xl bg-gray-100">
                  {member.imageUrl && (
                    <Image
                      src={member.imageUrl}
                      alt={member.name}
                      fill
                      className="object-cover rounded-t-xl"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <h3 className="font-bold text-xl">{member.name}</h3>
                    <p className="text-gray-200">{member.role}</p>
                  </div>
                </div>
                <CardContent className="py-1 bg-white">
                  <p className="text-gray-600 line-clamp-2">{member.bio}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}

export const getStaticProps: GetStaticProps<AboutPageProps> = async () => {
  const teamMembers = await teamMembersService.getAll();
  return {
    props: {
      teamMembers: teamMembers || [],
    },
  };
};
