import mongoose from "mongoose";

const notesSchema = new mongoose.Schema({
    noteBody:{type:String,required:true},
    createdBy:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    picture:String
},{
    timestamps:true
})
const notesModel = mongoose.model('Note',notesSchema)
export default notesModel