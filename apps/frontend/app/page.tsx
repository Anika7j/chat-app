"use client";

import { useRouter } from "next/navigation";

export default function Dashboard() {
    const router = useRouter();
  

    
       

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
            <div className="w-full max-w-4xl">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">
                        Welcome to Chat App
                    </h1>
                    <p className="text-xl text-gray-600">
                        Join the conversation and connect with others
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Sign In Card */}
                    <div className="bg-white rounded-3xl shadow-xl p-8 transform hover:scale-[1.02] transition-all duration-300">
                        <div className="text-center mb-6">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                Sign In
                            </h2>
                            <p className="text-gray-600">
                                Already have an account? Sign in to continue
                            </p>
                        </div>
                        <button
                            onClick={() => router.push("/signin")}
                            className="w-full bg-gradient-to-r from-cyan-500 via-cyan-400 to-cyan-600 
                            text-white py-4 px-6 rounded-xl font-medium 
                            hover:from-cyan-400 hover:via-cyan-300 hover:to-cyan-500
                            hover:shadow-lg hover:shadow-cyan-500/40 
                            focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 
                            transition-all duration-300 transform hover:-translate-y-0.5"
                        >
                            Sign In
                        </button>
                    </div>

                    {/* Sign Up Card */}
                    <div className="bg-white rounded-3xl shadow-xl p-8 transform hover:scale-[1.02] transition-all duration-300">
                        <div className="text-center mb-6">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                Sign Up
                            </h2>
                            <p className="text-gray-600">
                                New to Chat App? Create an account to get started
                            </p>
                        </div>
                        <button
                            onClick={() => router.push("/signup")}
                            className="w-full bg-gradient-to-r from-cyan-500 via-cyan-400 to-cyan-600 
                            text-white py-4 px-6 rounded-xl font-medium 
                            hover:from-cyan-400 hover:via-cyan-300 hover:to-cyan-500
                            hover:shadow-lg hover:shadow-cyan-500/40 
                            focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 
                            transition-all duration-300 transform hover:-translate-y-0.5"
                        >
                            Sign Up
                        </button>
                    </div>
                </div>

                {/* Features Section */}
                <div className="mt-16 grid md:grid-cols-3 gap-8">
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                        <div className="text-cyan-500 text-2xl mb-4">💬</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Chat</h3>
                        <p className="text-gray-600">Instant messaging with real-time updates</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                        <div className="text-cyan-500 text-2xl mb-4">👥</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Join Rooms</h3>
                        <p className="text-gray-600">Create or join chat rooms with others</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                        <div className="text-cyan-500 text-2xl mb-4">🔒</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure</h3>
                        <p className="text-gray-600">End-to-end encrypted conversations</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
