"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import  useAuth  from '@/hooks/useAuth';
import { BACKEND_URL } from '@/app/config';
import axios from 'axios';

export default function RoomPage() {
    const [roomName, setRoomName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { token, isAuthenticated, loading: authLoading } = useAuth();

    // Redirect if not authenticated
    if (!authLoading && !isAuthenticated) {
        router.push('/');
        return null;
    }

    const handleCreateRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post(
                `${BACKEND_URL}/room`,
                { name: roomName },
                {
                    headers: {
                        Authorization: `${token}`
                    }
                }
            );

            if (response.data.roomId) {
                router.push(`/room/${roomName}`);
            }
        } catch (error: any) {
            setError(error.response?.data?.message || 'Failed to create room. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-3xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Create a Room
                        </h1>
                        <p className="text-gray-600">
                            Start a new conversation with others
                        </p>
                    </div>

                    <form onSubmit={handleCreateRoom} className="space-y-6">
                        <div className="group">
                            <label htmlFor="roomName" className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-cyan-600 transition-colors">
                                Room Name
                            </label>
                            <input
                                id="roomName"
                                type="text"
                                value={roomName}
                                onChange={(e) => setRoomName(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 
                                focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 
                                transition-all duration-200"
                                placeholder="Enter room name"
                                required
                                minLength={3}
                                maxLength={20}
                            />
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-cyan-500 via-cyan-400 to-cyan-600 
                            text-white py-4 px-6 rounded-xl font-medium 
                            hover:from-cyan-400 hover:via-cyan-300 hover:to-cyan-500
                            hover:shadow-lg hover:shadow-cyan-500/40 
                            focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 
                            transition-all duration-300 transform hover:-translate-y-0.5
                            disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Creating..." : "Create Room"}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600">
                            Want to join an existing room?{' '}
                            <button
                                onClick={() => router.push(`/room/join`)}
                                className="text-cyan-600 hover:text-cyan-500 font-medium 
                                hover:underline decoration-2 underline-offset-4 transition-all duration-200"
                            >
                                Join Room
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
} 