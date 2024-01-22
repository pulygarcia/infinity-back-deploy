import mongoose from 'mongoose';
import bcrypt from 'bcrypt'
import { userToken } from '../helpers/index.js';

const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    password:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    token:{
        type: String,
        default: () => userToken()
    },
    verified:{
        type: Boolean,
        default: false
    },
    admin:{
        type: Boolean,
        default: false
    }
})

//.PRE method => it means the code is gonna execute previous to the indicated action, in this case: "save". Its gonna check and hash, and then, save.
userSchema.pre('save', async function(next){
    if(!this.isModified('password')){  //If the password is already hashed, dont do nothing and continue.
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

//Create a method for compare passwords
userSchema.methods.checkPassword = async function(inputPassword) {
    return await bcrypt.compare(inputPassword, this.password)
}


const User = mongoose.model('User' ,userSchema);

export default User;