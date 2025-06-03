import { GetStaticProps } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

interface AboutPageProps {
    copyrightYear: number;
}

export default function AboutPage({ copyrightYear }: AboutPageProps) {
    return (
        <motion.div
            className="container mx-auto px-4 py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center">About Blog Web</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                        <p className="text-gray-600">
                            Blog Web is a platform dedicated to sharing knowledge, stories, and ideas. 
                            We believe in the power of written expression and the impact it can have on 
                            individuals and communities worldwide.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-600">
                            <li>A modern, user-friendly blogging platform</li>
                            <li>Secure authentication and user management</li>
                            <li>Rich text editing capabilities</li>
                            <li>Real-time updates and notifications</li>
                            <li>Community engagement through comments</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Technology Stack</h2>
                        <p className="text-gray-600">
                            Built with modern technologies including Next.js, TypeScript, and Tailwind CSS, 
                            Blog Web offers a fast, responsive, and secure experience for both writers and readers.
                        </p>
                    </section>

                    <div className="text-sm text-gray-500 text-center border-t pt-4">
                        © {copyrightYear} Blog Web. All rights reserved.
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

export const getStaticProps: GetStaticProps<AboutPageProps> = async () => {
    return {
        props: {
            copyrightYear: new Date().getFullYear()
        }
    };
}; 