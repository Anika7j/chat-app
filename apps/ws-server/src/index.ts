import { WebSocket, WebSocketServer } from 'ws';
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from '@repo/backend-common/config';
import { prismaClient } from "@repo/db/db";

const wss = new WebSocketServer({ port: 8080 });

interface User {
    ws: WebSocket;
    rooms: Set<string>;
    userId: string;
}

const users = new Map<WebSocket, User>();

function checkUser(token: string): string | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (typeof decoded === "string" || !decoded || !decoded.userId) {
            return null;
        }
        return decoded.userId;
    } catch(e) {
        return null;
    }
}

wss.on('connection', (ws, request) => {
    const url = request.url;
    if (!url) {
        ws.close();
        return;
    }

    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token') || "";
    const userId = checkUser(token);

    if (!userId) {
        ws.close();
        return;
    }

    // Initialize user with empty rooms set
    users.set(ws, {
        ws,
        rooms: new Set<string>(),
        userId
    });

    console.log('Client connected');

    ws.on('message', async (message) => {
        console.log('message received');
        const parsedData = JSON.parse(message.toString());
        console.log(parsedData);

        const user = users.get(ws);
        if (!user) return;

        if (parsedData.type === "join_room") {
            const roomId = parsedData.roomId;
            user.rooms.add(roomId);
            console.log(`User ${userId} joined room ${roomId}`);
        }

        if (parsedData.type === "leave_room") {
            const roomId = parsedData.room;
            user.rooms.delete(roomId);
            console.log(`User ${userId} left room ${roomId}`);
        }

        if (parsedData.type === "chat") {
            const roomId = parsedData.roomId;
            const message = parsedData.message;

            try {
                // First check if room exists
                const room = await prismaClient.room.findUnique({
                    where: { id: roomId }
                });

                if (!room) {
                    ws.send(JSON.stringify({
                        type: "error",
                        message: "Room not found"
                    }));
                    return;
                }

                // Create chat message with room relation
                await prismaClient.chat.create({
                    data: {
                        message: message,
                        room: {
                            connect: {
                                id: roomId
                            }
                        },
                        user: {
                            connect: {
                                id: userId
                            }
                        }
                    }
                });

                // Broadcast message to all users in the room, including sender
                users.forEach((user) => {
                    if (user.ws.readyState === WebSocket.OPEN && // Check if connection is open
                        user.rooms.has(roomId)) { // Check if user is in the room
                        user.ws.send(JSON.stringify({
                            type: "chat",
                            message: message
                        }));
                    }
                });
            } catch (error) {
                console.error('Error creating chat:', error);
                ws.send(JSON.stringify({
                    type: "error",
                    message: "Failed to send message"
                }));
            }
        }
    });

    ws.on('close', () => {
        const user = users.get(ws);
        if (user) {
            console.log(`User ${user.userId} disconnected`);
            users.delete(ws);
        }
    });
});