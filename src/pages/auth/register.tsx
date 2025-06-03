import useFetch from "@/hooks/useFetch";
import { useState } from "react";
import { useRouter } from "next/router";
import { User } from "@/api/models/User";
import Link from "next/link";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export default function SignUp() {
    const router = useRouter();
    const [user, setUser] = useState({
        name: "", 
        email: "", 
        password: ""
    });
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { create } = useFetch<User>("/api/auth/register");
    
    function validateForm() {
        if (!user.name.trim()) {
            setError("Emri është i detyrueshëm");
            return false;
        }
        
        if (!user.email.trim()) {
            setError("Email-i është i detyrueshëm");
            return false;
        }
        
        if (!user.password) {
            setError("Fjalëkalimi është i detyrueshëm");
            return false;
        }
        
        if (user.password.length < 6) {
            setError("Fjalëkalimi duhet të ketë të paktën 6 karaktere");
            return false;
        }
        
        return true;
    }
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        
        if (!validateForm()) {
            return;
        }
        
        setIsSubmitting(true);
        try {
            const res = await create(user);
            
            if (res?.error) {
                setError(res.error);
            } else {
                router.push("/auth/login");
            }
        } catch {
            setError("There was an error during registration. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleInputChange = (field: keyof typeof user) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser({
            ...user,
            [field]: e.target.value
        });
    };

    const handleGoogleSignIn = () => {
        setIsSubmitting(true);
        signIn("google", { callbackUrl: "/" });
    };
    
    return (
        <div className="max-w-md mx-auto py-12 min-h-screen">
            <Card>
                <CardHeader>
                    <h2 className="text-2xl font-semibold ">
                        Regjistrohu
                    </h2>
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
                                    type="text"
                                    placeholder="Emri"
                                    value={user.name}
                                    onChange={handleInputChange('name')}
                                    className="w-full px-4 py-2  border  rounded focus:ring-blue-500 focus:border-blue-500  placeholder-gray-400"
                                />
                            </div>
                            
                            <div>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={user.email}
                                    onChange={handleInputChange('email')}
                                    className="w-full px-4 py-2  border  rounded focus:ring-blue-500 focus:border-blue-500  placeholder-gray-400"
                                />
                            </div>
                            
                            <div>
                                <input
                                    type="password"
                                    placeholder="Fjalëkalimi"
                                    value={user.password}
                                    onChange={handleInputChange('password')}
                                    className="w-full px-4 py-2  border  rounded focus:ring-blue-500 focus:border-blue-500  placeholder-gray-400"
                                />
                            </div>
                            
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full"
                            >
                                {isSubmitting ? 'Duke u regjistruar...' : 'Regjistrohu'}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t "></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-gray-800 text-gray-400">Ose vazhdo me</span>
                            </div>
                        </div>
                        
                        <button
                            onClick={handleGoogleSignIn}
                            disabled={isSubmitting}
                            className="mt-4 w-full flex items-center justify-center gap-3 px-4 py-2 border  rounded-md shadow-sm   hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20">
                                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                            </svg>
                            Regjistrohu me Google
                        </button>
                    </div>
                </CardContent>
                
                <CardFooter>
                    <div className="text-center text-gray-300">
                        Keni një llogari? <Link href="/auth/login" className="text-blue-400 hover:underline">Identifikohu</Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}

SignUp.displayName = "Sign Up | My Application";