const mongoose=require("mongoose");
const userSchema=mongoose.Schema({
    name:{type:String,required:[true,"Fill all the details"]},
    gender:{type:String,required:[true,"Fill all the details"]},
    dob:{type:String,required:true},
    email:{type:String,required:[true,"Fill all the details"]},
    mobile:{type:Number,required:[true,"Fill all the details"]},
    balance:{type:Number,required:[true,"Fill all the details"]},
    adhar:{type:Number,required:[true,"Fill all the details"]},
    pan:{type:String,required:[true,"Fill all the details"]}
},{
    versionKey:false
})

const UserModel=mongoose.model("user",userSchema)

module.exports={
    UserModel
}