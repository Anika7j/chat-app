import {createUserSchema,signinSchema,createRoomSchema} from "@repo/common/types"
import {JWT_SECRET} from "@repo/backend-common/config"
import jwt, { JwtPayload } from "jsonwebtoken"
import {prismaClient} from "@repo/db/db"
import express from "express"
import bcryptjs from "bcryptjs"
import { authenticate } from "./authmiddleware"

const app = express()
app.use(express.json())

app.post('/signup',async(req,res)=>{
    const data = createUserSchema.safeParse(req.body)
    if(!data){
        res.json({
            message:"Invalid Inputs"
        })
        return
    }
    const salt = (await bcryptjs.genSalt(11)).toString()
    const password = data.data?.password
    if (typeof password !== "string") {
        res.json({
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
        res.json({
            message: "User created"
        })
    } catch (error) {
        res.json({
            message:"Invalid data"
        })
    }


})
app.post('/signin',async(req,res)=>{
    const data = signinSchema.safeParse(req.body);
    if(!data){
        res.json({
            message: "Invalid inputs"
        })
    }
    const user = await prismaClient.user.findFirst({
        where: {
            username: (data.data?.username)?.toString()
        }
    })
    if (!user || typeof user.password !== "string" || typeof data.data?.password !== "string") {
        res.json({
            message: "Invalid username or password"
        });
        return;
    }
    const compare = await bcryptjs.compare(data.data.password, user.password);
    if(!compare){
        res.json({
            message: "Invalid credentials"
        })
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


app.listen(3001)