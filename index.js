import express from 'express'
import { PrismaClient } from "@prisma/client"
import bodyParser from "body-parser"
import bcrypt from "bcrypt"
import { verifyKey } from './middlewares/auth.js' 
import { GoogleGenerativeAI } from '@google/generative-ai'

const PrismaClientSigleton = () => {
    return new PrismaClient();
};

const genAi = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)
const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma ?? PrismaClientSigleton();

if(process.env.NODE_ENV != "production") globalForPrisma.prisma = prisma;

const app = express()
app.use(bodyParser.json())
app.use(verifyKey)

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

app.post("/check/user", async (req, res) => {
    try{
        const user = await prisma.Profile.findUnique({
            where:{
                user:req.body.user
            }
        })
        if(!user) return res.status(404).send("No valid user") 

        const matchPassword = await bcrypt.compare(req.body.password,user.password)

        if(!matchPassword) res.status(404).send("No valid password") 
        res.json(user.idUser)
    }catch(ex){
        console.error('Error reading data', err)
        return res.status(500).send("Error")
    }
})


app.post("/porkash", async(req, res) =>{
    try{
        const model = genAi.getGenerativeModel({model: "gemini-1.5-flash"})
        const prompt= req.body.text
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        res.json(text)
    }catch(err){
        console.error('Error reading data', err)
        return res.status(500).send("Error")
    }
    
})

app.get('/invest', async(req, res) =>{
    try{
        const response = await fetch(`https://api.finage.co.uk/agg/stock/AAPL/1/month/2020-02-05/2021-02-07?apikey=
            ${process.env.MARKET_API_KEY}`)
        const data = await response.json()
        res.json(data)
    }catch(err){
        console.error('Error reading data', err)
        return res.status(500).send("Error")
    }
})





app.listen(port, ()=>{
    console.log(`Server is running in ${port}`)
})