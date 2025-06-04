"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import  useAuth  from '@/hooks/useAuth';
import { BACKEND_URL } from '@/app/config';
import axios from 'axios';

export function AuthPage({isSignin}: {
    isSignin: boolean
}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const endpoint = isSignin ? '/signin' : '/signup';
            const response = await axios.post(`${BACKEND_URL}${endpoint}`, {
                username,
                password,
                ...(isSignin ? {} : { name })
            });

            if (response.data.token) {
                await login(response.data.token);
            } else {
                setError('Authentication failed. Please try again.');
            }
        } catch (error: any) {
            setError(error.response?.data?.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
            <div className="w-full max-w-md transform hover:scale-[1.02] transition-all duration-300">
                <div className="bg-black rounded-3xl shadow-2xl p-8 relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500 rounded-full opacity-20 blur-3xl"></div>
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-400 rounded-full opacity-20 blur-3xl"></div>
                    
                    <div className="relative">
                        <div className="text-center mb-8">
                            <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
                                {isSignin ? "Welcome Back" : "Create Account"}
                            </h1>
                            <p className="text-gray-300 text-lg">
                                {isSignin ? "Sign in to your account" : "Sign up for a new account"}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {!isSignin && (
                                <div className="group">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2 group-hover:text-cyan-400 transition-colors">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="name"
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-700 bg-gray-800/50 text-white placeholder-gray-400 
                                            focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200
                                            hover:border-gray-600"
                                            placeholder="Enter your full name"
                                            required={!isSignin}
                                            minLength={3}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="group">
                                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2 group-hover:text-cyan-400 transition-colors">
                                    Username
                                </label>
                                <div className="relative">
                                    <input
                                        id="username"
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-700 bg-gray-800/50 text-white placeholder-gray-400 
                                        focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200
                                        hover:border-gray-600"
                                        placeholder="Enter your username"
                                        required
                                        minLength={3}
                                        maxLength={20}
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2 group-hover:text-cyan-400 transition-colors">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-700 bg-gray-800/50 text-white placeholder-gray-400 
                                        focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200
                                        hover:border-gray-600"
                                        placeholder="Enter your password"
                                        required
                                        maxLength={10}
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="text-red-500 text-sm text-center bg-red-500/10 p-3 rounded-lg">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-cyan-500 via-cyan-400 to-cyan-600 
                                text-white py-4 px-4 rounded-xl font-medium 
                                hover:from-cyan-400 hover:via-cyan-300 hover:to-cyan-500
                                hover:shadow-lg hover:shadow-cyan-500/40 
                                focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 
                                transition-all duration-300 transform hover:-translate-y-0.5
                                relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="relative z-10">
                                    {loading ? "Please wait..." : (isSignin ? "Sign In" : "Sign Up")}
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-white/20 to-cyan-400/0 
                                translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-sm text-gray-300">
                                {isSignin ? "Don't have an account? " : "Already have an account? "}
                                <a
                                    href={isSignin ? "/signup" : "/signin"}
                                    className="text-cyan-400 hover:text-cyan-300 font-medium 
                                    hover:underline decoration-2 underline-offset-4 transition-all duration-200"
                                >
                                    {isSignin ? "Sign up" : "Sign in"}
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}