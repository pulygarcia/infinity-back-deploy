import jwt from 'jsonwebtoken'
import User from '../models/User.model.js';

const authMiddleware = async (req, res, next) => {
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){ //There is some (and its not undefined cause it starts with Bearer)
        try {
            const token = req.headers.authorization.split(' ')[1];  //read jwt. (.split generete an array of texts that are separated by a ' ' on this case for get the jwt.

            const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
            //console.log(decoded);

            req.user = await User.findById(decoded.id).select(
                "-password -verified -token -__v"
            );
            //console.log(req.user);

            next();

        } catch {
            const error = new Error('Token no válido');
            res.status(403).json({
                msg: error.message
            })
        }
    }else{
        const error = new Error('Token inexistente o no válido');
        res.status(403).json({
            msg: error.message
        })
    }
}

export default authMiddleware