import Appointment from '../models/Appointment.model.js'
import {parse, formatISO, startOfDay, endOfDay, isValid, format} from 'date-fns';
import es from 'date-fns/locale/es/index.js';
import { validateId, serviceNotFound } from '../helpers/index.js';
import {sendNewAppointmentEmail, sendUpdatedAppointmentEmail, sendCanceledAppointmentEmail} from '../email/appointmentsEmailServices.js'

const createAppointment = async (req, res) => {
    const appointment = req.body;
    appointment.user = req.user._id.toString();   //user is returned from middleware in the req, so you can get it by there
    //console.log(appointment);

    try {
        const newAppointment = new Appointment(appointment);
        const result = await newAppointment.save();

        await sendNewAppointmentEmail({
            date: format(result.date, 'PPPP', {locale: es}),
            selectedHour: result.selectedHour
        });

        res.json({
            msg: 'Tu turno fué guardado'
        })

    } catch (error) {
        console.log(error);
    }
}


const getAppointmentByDate = async (req, res) => {
    //console.log(req.query); => Getting string date, mongo needs ISO type, no string
    const { date } = req.query;

    const newDate = parse(date, 'dd/MM/yyyy', new Date());

    //Validate if the date was send in req is valid
    if(!isValid(newDate)){
        const error = new Error('La fecha que ingresaste no es válida');
        res.status(400).json({
            msg: error.message
        })
    }

    const isoDate = formatISO(newDate);

    //console.log(date);
    //console.log(isoDate);

    try {
        const data = await Appointment.find({date: {
            $gte: startOfDay(new Date(isoDate)), // => $gte is a query operator in noSQL databases that gets values that are >= than the parameter
            $lte: endOfDay(new Date(isoDate)) // => $lte its the same but it means <= parameter
        }}).select('selectedHour')

        res.json(
            data
        );

    } catch (error) {
        console.log(error);
    }
}

const getAppointmentById = async (req, res) => {
    //console.log(req.params.id);
    const id = req.params.id;
    if(validateId(id, res)){
        return;
    }

    const appointment = await Appointment.findById(id).populate('services'); //services in this object only have service id, populate return all service object
    if(!appointment){
        return res.status(403).json({
            msg: 'El turno no existe'
        })
    }

    if(appointment.user.toString() !== req.user.id.toString()){  //If the user that want to get the appointment is not the user that created the appointment
        const error = new Error('No tienes permiso para obtener la cita');
        res.status(403).json({
            msg: error.message
        })
    }

    res.json(appointment);
}

const updateAppointment = async (req, res) => {
    //console.log('Updating');
    const id = req.params.id;

    if(validateId(id, res)){
        return;
    }

    const appointment = await Appointment.findById(id); //services in this object only have service id, populate return all service object
    if(!appointment){
        return res.status(403).json({
            msg: 'No es posible editar el turno'
        })
    }

    if(appointment.user.toString() !== req.user.id.toString()){  //If the user that want to get the appointment is not the user that created the appointment
        const error = new Error('No tienes permiso para editar el turno');
        res.status(403).json({
            msg: error.message
        })
    }

    //make changes
    appointment.date = req.body.date;
    appointment.selectedHour = req.body.selectedHour;
    appointment.services = req.body.services;
    appointment.totalToPay = req.body.totalToPay;

    try {
        const updatedAppointment = await appointment.save();

        await sendUpdatedAppointmentEmail({
            date: format(updatedAppointment.date, 'PPPP', {locale: es}),
            selectedHour: updatedAppointment.selectedHour
        })

        res.json({
            msg: 'El turno se editó correctamente'
        })

    } catch {
        const error = new Error('El turno no se pudo editar');
        res.status(403).json({
            msg: error.message
        })
    }
}

const cancelAppointment = async (req, res) => {
    const id = req.params.id;

    if(validateId(id, res)){
        return;
    }

    const appointment = await Appointment.findById(id);
    if(!appointment){
        return res.status(403).json({
            msg: 'No es posible cancelar el turno'
        })
    }

    if(appointment.user.toString() !== req.user.id.toString()){
        const error = new Error('No tienes permiso para cancelar el turno');
        res.status(403).json({
            msg: error.message
        })
    }

    try {
        await appointment.deleteOne()

        await sendCanceledAppointmentEmail({
            date:  format(appointment.date, 'PPPP', {locale: es}),
            selectedHour: appointment.selectedHour
        })

        res.json({
            msg: 'El turno se canceló correctamente'
        })

    } catch {
        const error = new Error('El turno no se pudo cancelar');
        res.status(403).json({
            msg: error.message
        })
    }
}

export{
    createAppointment,
    getAppointmentByDate,
    getAppointmentById,
    updateAppointment,
    cancelAppointment
}