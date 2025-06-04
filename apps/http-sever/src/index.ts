import {createUserSchema,signinSchema,createRoomSchema} from "@repo/common/types"
import {JWT_SECRET} from "@repo/backend-common/config"
import jwt, { JwtPayload } from "jsonwebtoken"
import {prismaClient} from "@repo/db/db"
import express from "express"
import bcryptjs from "bcryptjs"
import { authenticate } from "./authmiddleware"
import cors from "cors"

const app = express()
app.use(express.json())
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))

app.post('/signup',async(req,res)=>{
    const data = createUserSchema.safeParse(req.body)
    if(!data.success){
        res.status(400).json({
            message:"Invalid Inputs"
        })
        return
    }
    const salt = (await bcryptjs.genSalt(11)).toString()
    const password = data.data?.password
    if (typeof password !== "string") {
        res.status(400).json({
            message: "Password is required"
        })
        return
    }
    const hashedPassword = await bcryptjs.hash(password, salt)
    try {
        const user = await prismaClient.user.create({
            data:{
                username: data.data!.username.toString(),
                password: hashedPassword,
                name: data.data!.name.toString()
            }
        })
        const token = jwt.sign({
            userId: user.id
        }, JWT_SECRET)
        res.json({
            token,
            message: "User created successfully"
        })
    } catch (error) {
        res.status(400).json({
            message:"Username already exists"
        })
    }
})

app.post('/signin',async(req,res)=>{
    const data = signinSchema.safeParse(req.body);
    if(!data.success){
        res.status(400).json({
            message: "Invalid inputs"
        })
        return
    }
    const user = await prismaClient.user.findFirst({
        where: {
            username: (data.data?.username)?.toString()
        }
    })
    if (!user || typeof user.password !== "string" || typeof data.data?.password !== "string") {
        res.status(401).json({
            message: "Invalid username or password"
        });
        return;
    }
    const compare = await bcryptjs.compare(data.data.password, user.password);
    if(!compare){
        res.status(401).json({
            message: "Invalid credentials"
        })
        return
    }
    const token = jwt.sign({
        userId: user.id
    },JWT_SECRET)
    res.json({
        token
    })
})

app.post('/room', authenticate ,async(req,res)=>{
    const data = createRoomSchema.safeParse(req.body);
    if(!data){
        res.json({
            message: "Incorrect input"
        })
        return;
    }
    const userId = (req as JwtPayload).userId
    try {
        const room = await prismaClient.room.create({
            data: {
                slug: (data.data?.name ?? "").toString(),
                adminId: userId
            }
        })
        res.json({
            roomId: room.id
        })
    } catch (error) {
        res.status(411).json({
            message:"Room already exists with this name"
        })
    }
})

app.get("/chats/:roomId", async (req, res) => {
    try {
        const roomId = Number(req.params.roomId);
        console.log(req.params.roomId);
        const messages = await prismaClient.chat.findMany({
            where: {
                roomId: roomId
            },
            orderBy: {
                id: "desc"
            },
            take: 50
        });

        res.json({
            messages
        })
    } catch(e) {
        console.log(e);
        res.json({
            messages: []
        })
    }
    
})

app.get("/room/:slug", async (req, res) => {
    const slug = req.params.slug;
    const room = await prismaClient.room.findFirst({
        where: {
            slug
        }
    });

    res.json({
        room
    })
})


app.listen(3001)