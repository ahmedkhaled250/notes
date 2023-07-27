import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,unique:true,required:true},
    password:{type:String,required:true},
    phone:String,
    role:{type:String,default:"User" ,enum: ["User","Hr", "Admin"]},
    profilePic:String,
    confirmEmail:{type:Boolean,default:false},
    notes:[{type: mongoose.Schema.Types.ObjectId,ref:"Note"}],
},{
    timestamps:true
})
const userModel = mongoose.model('User',userSchema)
export default userModel