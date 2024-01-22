import Services from '../models/Services.model.js'
import { validateId, serviceNotFound } from '../helpers/index.js';

const createService = async (req, res) => {
    if(Object.values(req.body).includes('')){
        const error = new Error('No se permiten campos vacíos');

        return res.status(400).json({
            msg : error.message
        })
    }

    try {
        const service = new Services(req.body);
        await service.save(); //Save service in the DB with ( .save() )
        
        res.json({
            msg: 'El servicio fué agregado'
        });

    } catch (error) {
        console.log(error);
    }
}


const getAllServices = async (req, res) => {
    try {
        const services = await Services.find();
        res.json(services);
        
    } catch (error) {
        console.log(error);
    }
}

const getServiceById = async (req, res) => {
    const {id} = req.params;
    
    //Check type ObjectId
    if(validateId(id, res)){
        return;
    }

    //Check if exist
    const service = await Services.findById(id);
    if(serviceNotFound(service, res)){
        return;
    }

    //If exist, show it
    res.json(service);
}


const updateService = async (req, res) => {
    //Validation again
    const {id} = req.params;

    if(validateId(id, res)){
        return;
    }

    //Check if exist
    const service = await Services.findById(id);
    if(serviceNotFound(service, res)){
        return;
    }

    //Type in the service object the new values, or if there arent changes, keep the values.
    service.name = req.body.name || service.name;
    service.price = req.body.price || service.price;

    try {
        await service.save();

        res.json({
            msg: 'El servicio fué actualizado'
        })
    } catch (error) {
        console.log(error);
    }
}


const deleteService = async (req, res) => {
    //Same validations
    const {id} = req.params;
    if(validateId(id, res)){
        return;
    }

    const service = await Services.findById(id);
    if(serviceNotFound(service, res)){
        return;
    }

    //If it's ok...
    try {
        await service.deleteOne();

        res.json({
            msg: 'El servicio fué eliminado'
        })
    } catch (error) {
        console.log(error);
    }
}


export {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService
}