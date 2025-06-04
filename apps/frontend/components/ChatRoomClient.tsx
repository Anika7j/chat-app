"use client";

import { useEffect, useState } from "react";
import { useSocket } from "@/hooks/useSocket";

export function ChatRoomClient({messages,id}:{
    messages: {messages: string}[];
    id: string;
}) {
    const [chats, setChats] = useState(messages);
    const [currentMessage, setCurrentMessage] = useState("");
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const { socket, loading } = useSocket({ token: token || '' });

    useEffect(()=>{
        if(socket && !loading){
            socket.send(JSON.stringify({
                type:"join_room",
                roomId: id
            }));

            socket.onmessage = (event: MessageEvent) => {
                const parsedData = JSON.parse(event.data);
                if(parsedData.type === "chat") {
                    setChats(c => [...c, {messages: parsedData.message}]);
                }
            };

            return () => {
                socket.send(JSON.stringify({
                    type: "leave_room",
                    room: id
                }));
            };
        }
    },[socket, loading, id]);

    const sendMessage = () => {
        if (!currentMessage.trim()) return;
        
        socket?.send(JSON.stringify({
            type: "chat",
            roomId: id,
            message: currentMessage
        }));
        setCurrentMessage("");
    };

    return (
        <div className="flex flex-col h-screen p-4">
            <div className="flex-1 overflow-y-auto mb-4 space-y-2">
                {chats.map((m, index) => (
                    <div key={index} className="bg-gray-800 p-3 rounded-lg text-white">
                        {m.messages}
                    </div>
                ))}
            </div>
            <div className="flex gap-2">
                <input 
                    type="text" 
                    value={currentMessage} 
                    onChange={e => setCurrentMessage(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && sendMessage()}
                    className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-cyan-500 focus:outline-none"
                    placeholder="Type your message..."
                />
                <button 
                    onClick={sendMessage}
                    className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition-colors"
                >
                    Send
                </button>
            </div>
        </div>
    );
}