import { sendVerificationEmail, sendForgotPasswordEmail } from '../email/authEmailService.js';
import User from '../models/User.model.js'
import { generateJWT, userToken } from '../helpers/index.js';

const register = async (req, res) => {
    //Valid the fields
    if(Object.values(req.body).includes('')){
        const error = new Error('No se permiten campos vacíos');

        return res.status(400).json({
            msg : error.message
        })
    }

    //Avoid duplicates
    const {email, password, name} = req.body;
    const userExists = await User.findOne({email: email}) //check in db
    if(userExists){
        const error = new Error('Usuario ya registrado');

        return res.status(400).json({
            msg : error.message
        })
    }

    //Validate password extention
    const MIN_PASSWORD_LENGTH = 8;
    if(password.trim().length < MIN_PASSWORD_LENGTH){
        const error = new Error('La contraseña debe tener 8 o más caractéres');

        return res.status(400).json({
            msg : error.message
        })
    }

    try {
        const user = new User(req.body);

        const result = await user.save() //save in DB

        const {name, email, token} = result;
        sendVerificationEmail({
            name: name,
            email: email,
            token: token
        });

        //feedback
        res.json({
            msg: "El usuario fue creado correctamente"
        })

    } catch (error) {
        console.log(error);
    }
}

const verifyUser = async (req, res) => {
    console.log(req.params.token); //get token from url

    const user = await User.findOne({token: req.params.token});

    //If NO valid token
    if(!user){
        const error = new Error('Usuario no válido');

        return res.status(401).json({
            msg : error.message
        })
    }

    //valid token, confirm account
    try {
        user.verified = true;
        user.token = ''; //the unique token won't be available again. The token only has one use.
        await user.save();

        return res.json({
            msg : "Cuenta verificada correctamente"
        });

    } catch (error) {
        console.log(error);
    }
}

const login = async (req, res) => {
    //console.log(req.body);

    //Check if email exists in DB
    const user = await User.findOne({email: req.body.email});
    if(!user){
        const error = new Error('Email incorrecto');

        return res.status(401).json({
            msg : error.message
        })
    }

    //Check if is verified
    if(!user.verified){
        const error = new Error('Cuenta no verificada');

        return res.status(401).json({
            msg : error.message
        })
    }
    
    //Compare the password with the hashed one
    if(await user.checkPassword(req.body.password)){
        //Give JWT
        const jsonWebToken = generateJWT(user._id);

        //return JWT for save in LocalStorage
        res.json({
            jsonWebToken
        })
    }else{
        const error = new Error('Contraseña incorrecta');

        return res.status(401).json({
            msg : error.message
        })
    }
}

const forgotPassword = async (req, res) => {
    //Check if user exists in DB
    const user = await User.findOne({email: req.body.email});
    if(!user){
        const error = new Error('El usuario no existe');

        return res.status(404).json({
            msg : error.message
        })
    }

    //Generate token to user
    try {
        user.token = userToken();

        const result = await user.save();
        
        await sendForgotPasswordEmail({
            name: result.name,
            email: result.email,
            token: result.token
        });

        res.json({
            msg: 'Hemos enviado un email con las instrucciones'
        })

    } catch (error) {
        console.log(error);
    }
}

const verifyResetPasswordToken = async (req, res) => {
    //console.log('Verify token');
    const isValidToken = await User.findOne({token: req.params.token});
    //If NO valid token
    if(!isValidToken){
        const error = new Error('Error, Token no válido');

        return res.status(401).json({
            msg : error.message
        })
    }

    res.json({
        msg: 'Token válido'
    })
}

const updatePassword = async (req, res) => {
    const user = await User.findOne({token: req.params.token});
    //If NO valid token
    if(!user){
        const error = new Error('Error, Token no válido');

        return res.status(400).json({
            msg : error.message
        })
    }

    try {
        user.token = ''; //remove the token that was given when user forgot password
        user.password = req.body.password;
        await user.save();

        res.json({
            msg : "La contraseña fué cambiada"
        });

    } catch {
        const error = new Error('No se pudo modificar la contraseña');

        return res.status(400).json({
            msg : error.message
        })
    }
}

const user = async (req, res) => {
    //console.log(req.user);   //Getting req.user from middleware and returning it
    res.json(
        req.user
    )
}

const admin = async (req, res) => {
    //console.log(req.user);
    if(!req.user.admin){
        const error = new Error('Acción no válida');
        return res.status(403).json({
            msg: error.message
        })
    }

    res.json(
        req.user
    )
}

export{
    register,
    verifyUser,
    login,
    forgotPassword,
    verifyResetPasswordToken,
    updatePassword,
    user,
    admin
}