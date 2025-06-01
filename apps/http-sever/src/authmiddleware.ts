import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

export function authenticate(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"] ?? "";
    console.log(authHeader)
    if (!authHeader) {
        res.status(401).json({ message: "No token provided" });
        return;
    }
    
    const decoded = jwt.verify(authHeader,JWT_SECRET)
    console.log(decoded)
    if(decoded){
        //@ts-ignore
        req.userId = decoded.userId;
        next();
    }else{
        res.status(403).json({
            message:"Unauthorized"
        })
    }
}