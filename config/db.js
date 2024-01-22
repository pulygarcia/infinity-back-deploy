import mongoose from 'mongoose';
import colors from 'colors'

export const db = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGO_URI);

        console.log(colors.cyan(`MongoDB conectado: ${db.connection.host} : ${db.connection.port}`));
    } catch (error) {
        console.log(colors.bgRed(`Error: ${error.message}`));
        process.exit(1); //Stop program
    }
}