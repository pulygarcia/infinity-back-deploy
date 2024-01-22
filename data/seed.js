import dotenv from 'dotenv';
import colors from 'colors'
import { db } from '../config/db.js';
import Services from '../models/Services.model.js'; //Service model
import { services } from './beautyServices.js'; //array with data

//use enviornment varibales
dotenv.config();

//Connect db
await db();

async function seedDb(){
    try {
        await Services.insertMany(services);
        console.log(colors.green.bold('Los datos se agregaron correctamente'));
        process.exit();

    } catch (error) {
        console.log(colors.bgRed(error));
        process.exit(1);
    }
}

async function clearDB(){
    try {
        await Services.deleteMany();
        console.log(colors.red.bold('Los datos se eliminaron'));
        process.exit();
    } catch (error) {
        console.log(colors.bgRed(error));
        process.exit(1);
    }
}

if(process.argv[2] == "--import"){
    seedDb();
}else{
    clearDB();
}