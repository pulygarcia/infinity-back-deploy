import mongoose from "mongoose";

const appointmentSchema = mongoose.Schema({
    services: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Services'
        }
    ],
    date: {
        type: Date
    },
    selectedHour: {
        type: String
    },
    totalToPay: {
        type: Number
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
})


const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment
