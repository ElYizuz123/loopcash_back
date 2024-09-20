import express from 'express'
import { PrismaClient } from "@prisma/client"
import bodyParser from "body-parser"
import bcrypt from "bcrypt"

const PrismaClientSigleton = () => {
    return new PrismaClient();
};

const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma ?? PrismaClientSigleton();

if(process.env.NODE_ENV != "production") globalForPrisma.prisma = prisma;

const app = express()
app.use(bodyParser.json())

const port = process.env.PORT || 3000

app.get("/", (req, res) =>{
    const htmlResponse = 
    `<html>
        <head>
            <tittle>Back server</tittle>
        </head>
        <body>
            <h1> Back server </h1>
        </body>
    </html>`
    res.send(htmlResponse)
})

app.post("/user", async (req, res) =>{
    try{
        const password = await bcrypt.hash(req.body.password, 10)
        const user = await prisma.Profile.create({
            data:{
                user:req.body.user,
                name:req.body.name,
                password: password,
                total: 0.0
            }
        })
        res.json(user);
    }catch(e){
        console.error('Error reading data', err)
        return res.status(500).send("Error")
    }
})



app.listen(port, ()=>{
    console.log(`Server is running in ${port}`)
})