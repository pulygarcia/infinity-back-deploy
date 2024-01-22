import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import { db } from './config/db.js';
import cors from 'cors';
import servicesRoutes from './routes/servicesRoutes.js';
import authRoutes from './routes/authRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import userRoutes from './routes/userRoutes.js';

//Habilitar variables de entorno
dotenv.config();

//Set up the app
const app = express();

//Read data via body
app.use(express.json());

//connect DB
db();

//Config cors

const whiteList = process.argv[2] === '--postman' ? [process.env.FRONTEND_URL, undefined] : [process.env.FRONTEND_URL];

const corsOptions = {
    origin : function(origin, callback){
        if(whiteList.includes(origin)){
            //allow the connection
            callback(null, true); //this callback need two params. An error msg (not in this case because there is a if), and true or false to allow or dont allow access
        }else{
            //dont allow
            callback(new Error('Error de CORS'), false)
        }
    }
}

app.use(cors(corsOptions))

//define routes
app.use('/api/services', servicesRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/appointments', appointmentRoutes)
app.use('/api/users', userRoutes)


//define port
const PORT = process.env.PORT || 4000;

//start app
app.listen(PORT, () => {
    console.log(colors.blue('Starting app in port ' + PORT));
})