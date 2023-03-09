import express from 'express'
import dotenv from "dotenv";
import morgan from 'morgan'
import Auth from './app/auth.js'
import ResponseService from "./lambdas/response.js";
import cookieParser from "cookie-parser";



async function startServer(){
    dotenv.config()
    const app =express()
    const port = process.env.PORT
    app.use(express.static('public'));
    app.use(express.urlencoded({extended: true}))
    app.use(express.json())

    app.use(cookieParser())

    app.use('/auth', Auth)


    app.use(morgan('dev'))

    const responseService = new ResponseService()
    app.use((err, _req, res) => {
        if(err.name == "UnauthorizedError"){
            return responseService.unauthorizedResponse(res, err.message);
        }
    });

    app.listen(port, () => {
        console.log('***************** ***************** *****************')
        console.log('***************** ***************** *****************')
        console.log('********** 서버가 정상적으로 실행되고 있습니다 **********')
        console.log('***************** ***************** *****************')
        console.log('***************** ***************** *****************')
    })

}
startServer()