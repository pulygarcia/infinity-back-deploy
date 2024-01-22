import {createTransport} from '../config/nodemailer.js'

export async function sendNewAppointmentEmail({date, selectedHour}){
    //Create transporter
    const transporter = createTransport(process.env.MAILTRAP_HOST, process.env.MAILTRAP_PORT, process.env.MAILTRAP_USER, process.env.MAILTRAP_PASS);

    //Send email
    await transporter.sendMail({
        from: "infinity@gmail.com",
        to: 'admin@appsalon.com',
        subject: "APP INFINITY",
        text: "Nuevo turno",
        html: `<p>Han reservado un turno</p>
            <p>Día del turno : ${date}</p>
            <p>Horario reservado : ${selectedHour}</p>
        `
    });
}

export async function sendUpdatedAppointmentEmail({date, selectedHour}){
    //Create transporter
    const transporter = createTransport(process.env.MAILTRAP_HOST, process.env.MAILTRAP_PORT, process.env.MAILTRAP_USER, process.env.MAILTRAP_PASS);

    //Send email
    await transporter.sendMail({
        from: "infinity@gmail.com",
        to: 'admin@appsalon.com',
        subject: "APP INFINITY",
        text: "Turno modificado",
        html: `<p>Han modificado un turno</p>
            <p>Nueva fecha : ${date}</p>
            <p>Nuevo horario reservado : ${selectedHour}</p>
        `
    });
}

export async function sendCanceledAppointmentEmail({date, selectedHour}){
    //Create transporter
    const transporter = createTransport(process.env.MAILTRAP_HOST, process.env.MAILTRAP_PORT, process.env.MAILTRAP_USER, process.env.MAILTRAP_PASS);

    //Send email
    await transporter.sendMail({
        from: "infinity@gmail.com",
        to: 'admin@appsalon.com',
        subject: "APP INFINITY",
        text: "Turno cancelado",
        html: `<p>Han cancelado un turno</p>
            <p>El turno del día ${date} a las ${selectedHour} fué cancelado</p>
        `
    });
}