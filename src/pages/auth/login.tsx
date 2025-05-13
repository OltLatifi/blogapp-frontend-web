import { getCsrfToken, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SignIn({ csrfToken }: { csrfToken: string }) {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);
        
        try {
            const res = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });
            
            if (res?.error) {
                setError(res.error);
            } else if (res?.url) {
                router.push("/");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleSignIn = () => {
        setIsSubmitting(true);
        signIn("google", { callbackUrl: "/" });
    };

    return (
            <div className="max-w-md mx-auto py-12 min-h-screen">
                <Card>
                    <CardHeader>
                        <h2 className="text-2xl font-semibold text-gray-100">Login</h2>
                    </CardHeader>
                    
                    <CardContent>
                        {error && (
                            <div className="bg-red-900/30 border border-red-700 text-red-200 p-3 mb-4 rounded">
                                {error}
                            </div>
                        )}
                        
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 text-gray-100 placeholder-gray-400"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <input
                                        type="password"
                                        placeholder="Fjalëkalimi"
                                        value={password}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 text-gray-100 placeholder-gray-400"
                                        required
                                    />
                                </div>
                                
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full"
                                >
                                    {isSubmitting ? "Duke u kyçur..." : "Kyçu"}
                                </Button>
                            </div>
                        </form>
                        
                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-600"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span>
                                </div>
                            </div>
                            
                            <button
                                onClick={handleGoogleSignIn}
                                disabled={isSubmitting}
                                className="mt-4 w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-gray-100 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20">
                                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                                    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                                </svg>
                                Login with Google
                            </button>
                        </div>
                    </CardContent>
                    
                    <CardFooter>
                        <div className="text-center text-gray-300">
                            Don't have an account? <Link href="/auth/register" className="text-blue-400 hover:underline">Register</Link>
                        </div>
                    </CardFooter>
                </Card>
            </div>
    );
}

SignIn.getInitialProps = async (context: any) => {
    return {
        csrfToken: await getCsrfToken(context),
    };
};

SignIn.displayName = "Sign In | My Application";