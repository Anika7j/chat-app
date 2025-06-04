'use client'

import { useState } from "react"
import { useRouter } from "next/navigation";

export function JoinRoom() {
    const [room, setRoom] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleJoinRoom = () => {
        if (!room.trim()) {
            setError("Room name cannot be empty");
            return;
        }
        if (room.length < 3) {
            setError("Room name must be at least 3 characters long");
            return;
        }
        if (room.length > 20) {
            setError("Room name must be less than 20 characters");
            return;
        }
        setError("");
        router.push(`/room/${room}`);
    };

    return (
        <div className="min-h-screen w-full flex justify-center items-center bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="w-full max-w-md p-8 bg-black rounded-3xl shadow-2xl">
                <h1 className="text-3xl font-bold text-white mb-6 text-center">Join a Room</h1>
                
                <div className="space-y-4">
                    <div>
                        <input 
                            type="text" 
                            placeholder="Enter room name" 
                            value={room}
                            onChange={(e) => {
                                setRoom(e.target.value);
                                setError("");
                            }}
                            onKeyPress={(e) => e.key === 'Enter' && handleJoinRoom()}
                            className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border-2 border-gray-700 
                            focus:border-cyan-500 focus:outline-none transition-colors"
                        />
                        {error && (
                            <p className="mt-2 text-red-500 text-sm">{error}</p>
                        )}
                    </div>

                    <button 
                        onClick={handleJoinRoom}
                        className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 via-cyan-400 to-cyan-600 
                        text-white rounded-xl font-medium hover:from-cyan-400 hover:via-cyan-300 hover:to-cyan-500
                        hover:shadow-lg hover:shadow-cyan-500/40 transition-all duration-300"
                    >
                        Join Room
                    </button>
                </div>
            </div>
        </div>
    );
}