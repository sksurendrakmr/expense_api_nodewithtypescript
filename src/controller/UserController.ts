import Joi from "joi";
import bcrypt from 'bcrypt'
import { Response } from "express";
import { CustomReq } from "../config/CustomReq";
import { AuthMiddlewareReq, UserDto, UserForLoginDto } from "../dto/UserDto";
import { User } from "../models/UserModel";

export const registerUser = async(req:CustomReq<UserDto>,res:Response)=>{
    const {error} = validateUserForRegister(req.body);
    if(error) return res.status(400).json({message:error.details[0].message})
    
    const user = await User.findOne({email:req.body.email});
    if(user) return res.status(400).json({message:'User is already exists'});

    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(req.body.password,salt);

    const savedUser = await User.create({
        name:req.body.name,
        email:req.body.email,
        password:hashedPassword
    });

    const token = savedUser.generateToken();

    res.status(201).json({user:savedUser,token});

}

export const loginUser = async(req:CustomReq<UserForLoginDto>,res:Response) => {
    const {error} = validateUserForLogin(req.body);
    if(error) return res.status(400).json({message:error.details[0].message});

    const user = await User.findOne({email:req.body.email}).select('+password');
    if(!user) return res.status(400).json({message:'Enter a valid email id'});

    const isPasswordMatched= await bcrypt.compare(req.body.password,user.password);
    if(!isPasswordMatched) return res.status(400).json({message:'Password is incorrect'});

    const token = user.generateToken();
    res.status(200).json({token});
}

export const getUserDetails = async(req:AuthMiddlewareReq,res:Response)=>{
    res.status(200).json(req.user)
}


const validateUserForRegister = (user:UserDto) =>{
    const schema = Joi.object({
        name:Joi.string().required(),
        email:Joi.string().email().required(),
        password:Joi.string().required()
    })
    return schema.validate(user);
}

const validateUserForLogin = (user:UserForLoginDto) => {
    const schema = Joi.object({
        email:Joi.string().email().required(),
        password:Joi.string().required()
    })

    return schema.validate(user);
}