import mongoose from 'mongoose';

//Defines how data points are organized
const servicesSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        trim: true
    }
})

//Declarate as a model
const services = mongoose.model('Services', servicesSchema);

export default services;