import express from 'express'
import { PrismaClient } from "@prisma/client"
import bodyParser from "body-parser"
import bcrypt from "bcrypt"
import { GoogleGenerativeAI } from '@google/generative-ai'
import cors from 'cors'

const PrismaClientSigleton = () => {
    return new PrismaClient();
};

const genAi = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)
const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma ?? PrismaClientSigleton();

if(process.env.NODE_ENV != "production") globalForPrisma.prisma = prisma;

const app = express()
app.use(bodyParser.json())
app.use(cors())

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
        if(req.body.salary){
            const repeatable = await prisma.Repeatable.create({
                type:req.body.frecuency,
            })
            const movement = await prisma.Movement.create({
                data:{
                    type:'G',
                    quantity:req.body.salary,
                    isGoal:false,
                    idRepeatable:repeatable.idRepeatable,
                    idLoseType:null,
                    idProfile:user.idProfile
                }
            })
        }
        res.json(user);
    }catch(err){
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
        const movements = await prisma.Movement.findMany({
            include:{
                Repeatable:true,
                LoseType:true,
            }
        })
        const initPromt="Para esta query toma en cuenta que se tienen estos datos, que representan toda mi información financiera, toma en cuenta que en repetible las M son de mensual"+JSON.stringify(movements)+"toma en cuenta que estas siendo utilizada en una app para gestión de finanzas y lo que quiero es un consejo personalizado enfocado en lo que se te solicite, puedes acceder a todos los datos del JSON que te proporcioné, por lo que apegate a ello, considera como prioridades la vida de la persona, su casa, comida, entre otras necesidades básicas, además no utilices letras en negritas ni csímbolos de ese tipo, para evitar suciedad en la salida de texto"
        const model = genAi.getGenerativeModel({model: "gemini-1.5-flash"})
        const prompt= req.body.text
        const result = await model.generateContent(initPromt+prompt);
        const response = result.response;
        const text = response.text();
        res.json(text)
    }catch(err){
        console.error('Error reading data', err)
        return res.status(500).send("Error")
    }
    
})

app.post("/movement", async(req, res) => {
    try{
        if(req.body.idRepeatable){
            const repeatable = await prisma.Repeatable.create({
                data:{
                    type:req.body.typeRepeatable,
                    everyDate:req.body.everyDate,
                }
            })
        }
        const movement = await prisma.Movement.create({
            data:{
                type:req.body.type,
                quantity:parseFloat(req.body.queantity),
                isGoal:req.body.isGoal,
                idRepeatable:(parseInt(req.body.idRepeatable)||null),
                idLoseType:(parseInt(req.body.idLoseType)),
                idProfile:(parseInt(req.body.idProfile))
            }
        })
        
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