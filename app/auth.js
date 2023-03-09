import express from "express";
import cors from 'cors'
import jwt from 'jsonwebtoken'

const corsOptions = {
    origin : process.env.ORIGIN,
    optionsSuccessStatus : 200
}

const app = express()

app.use(cors({
    origin:true,
    credentials: true
}))

app.use(function(_req, res, next) {
    res.header(
        "Access-Control-Allow-Tabletheaders",
        "x-access-token, Origin, Content-Type, Accept",
        "Access-Control-Allow-Origin", "*"
    );
    next();
});

const access_jwt_secret= process.env.ACCESS_SECRET_KEY


app.post('',cors(corsOptions),(req,res)=>{
    const ADMIN_ID = process.env.ADMIN_ID
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
    const data = req.body
    const authId = data.authId
    const password = data.password

    if(authId !== ADMIN_ID){
        res.status(400).send('Auth ID Wrong...')
    }else{
        if(password !== ADMIN_PASSWORD){
            res.status(400).send('Auth Password Wrong...')
        }else {
            const authSignToken = jwt.sign({ authInfo:'Success' },access_jwt_secret,{expiresIn: '60m'})
            res.cookie('authSignToken',authSignToken,{
                secure:false,
                httpOnly:true
            })
            res.status(200).send('Login Success')
        }
    }

})

app.get('/logout',cors(corsOptions),(req,res)=>{
    try {
        res.clearCookie('authSignToken','')
        res.status(200).send('Auth Logout Success')
    }catch (err){
        res.status(400).send(err)
    }

})


app.get('/authCheck',cors(corsOptions),(req,res)=>{
    try {
        const token = req.cookies.authSignToken

        jwt.verify(token,access_jwt_secret,(err)=>{
            if(err){
                res.status(400).json({message:'Auth Fail...'})
            }else{
                res.status(200).send('Auth Login Success')
            }
        })

    }catch (e){
        if(e.name === 'TokenExpiredError'){
            res.status(500).send('Authentication time expired...')
        }
    }


})


export default app