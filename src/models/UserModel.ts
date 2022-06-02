import mongoose, { Model } from "mongoose";
import jsonwebtoken from 'jsonwebtoken'
import { UserDto, userMethods } from "../dto/UserDto";

const userSchema = new mongoose.Schema<UserDto,Model<UserDto,{},userMethods>>({
    name:{
        type:String,
        required:[true,'Enter a valid name']
    },
    email:{
        type:String,
        unique:true,
        required:[true,'Please Enter a valid email']
    },
    password:{
        type:String,
        required:[true,'Please enter correct or valid password'],
        select:false
    }
},{timestamps:true})

userSchema.methods.generateToken = function(){
    return jsonwebtoken.sign({id:this._id},process.env.JWT_SECRET as string);
}

export const User = mongoose.model<UserDto,Model<UserDto,{},userMethods>>('User',userSchema)