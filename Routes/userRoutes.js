const express=require("express");
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
const { UserModel } = require("../Models/userModel");
const { LedgerModel } = require("../Models/ledgerModel");
const { authenticate } = require("../Middleware/authenticate");

const userRouter=express.Router();

userRouter.get("/use",async(req,res)=>{
    try {
        let data=await UserModel.find();
        res.send(data)
    } catch (error) {
        res.send(error)
    }
})
userRouter.post("/",async(req,res)=>{
    console.log("jads")
    let body=req.body;
    try {
        let data=await UserModel.find({email:body.email})
        if(!data.length){
            bcrypt.hash(body.pan,5,async(err,hash)=>{
                if(hash){
                    let user=new UserModel({...body,pan:hash})
                    await user.save();
                    res.status(200).send({msg:"Successfully created account with the following details",data:body})

                }else{
                    res.status(401).send({msg:"Error occured"})
                }
            })
        }else{
            bcrypt.compare(body.pan,data[0].pan,(err,result)=>{
                if(result){
                    const token=jwt.sign({userId:data[0]._id},"shh")
                    res.status(200).send({msg:"User has been successfully Signed in",token,data:data[0]})
                }else{
                    res.status(406).send({msg:"Use a different email"})
                }
            })
        }

    } catch (error) {
        res.send(error)
    }
})

userRouter.use(authenticate)

userRouter.patch("/update",async(req,res)=>{
    let body=req.body;
    try {
        let data=await UserModel.findByIdAndUpdate({_id:body.user},body)
        res.status(200).send({msg:"Updated Successfully"})
    } catch (error) {
        res.send(error)
    }
})

userRouter.patch("/deposit",async(req,res)=>{
    let body=req.body;
    try {
        let data=await UserModel.findById(body.user)
        let data1=await UserModel.findByIdAndUpdate({_id:body.user},{balance:(+data.balance)+(+body.amount)})
        let ledger=new LedgerModel({title:"Deposited",userId:body.user,type:"Debit",amount:body.amount})
        await ledger.save()
        res.send({msg:"Balance has been updated"})
    } catch (error) {
        res.send(error)
    }
})
userRouter.patch("/withdraw",async(req,res)=>{
    let body=req.body;
    try {
        let data=await UserModel.findById(body.user)
        if(data.balance-body.amount>=0){
        let data1=await UserModel.findByIdAndUpdate({_id:body.user},{balance:(+data.balance)-(+body.amount)})
        let ledger=new LedgerModel({title:"Withdrawn",userId:body.user,type:"Debit",amount:body.amount})
        await ledger.save()
        res.send({msg:"Balance has been updated"})
        }else{
            res.status(401).send({msg:"Insufficient Balance"})
        }
    } catch (error) {
        res.send(error)
    }
})
userRouter.patch("/transfer",async(req,res)=>{
    let body=req.body;
    try {
        let data=await UserModel.findById(body.user)
        let data2=await UserModel.find({email:body.email})
        if(data2.length){
            if(data.balance-body.amount>=0){
                let data1=await UserModel.findByIdAndUpdate({_id:body.user},{balance:(+data.balance)-(+body.amount)})
                let ledger=new LedgerModel({title:"Transfered",userId:body.user,type:"Debit",amount:body.amount})
                await ledger.save()
                let data3=await UserModel.findByIdAndUpdate({_id:data2[0]._id},{balance:(+data2[0].balance)+(+body.amount)})
                let ledger1=new LedgerModel({title:"Recieved from",userId:data2[0]._id,type:"Debit",amount:body.amount})
                await ledger1.save()
                res.send({msg:"Money transered Successfully"})
            }else{
                res.status(401).send({msg:"Insufficient Balance"})
            }
        }else{
            res.status(401).send({msg:"No account exists with these details"})
        }
    } catch (error) {
        res.send(error)
    }
})

userRouter.get("/",async(req,res)=>{
    let body=req.body
    try {
        let data=await LedgerModel.find({userId:body.user})
        res.send(data);
    } catch (error) {
        res.send(error)
    }
})

userRouter.delete("/",async(req,res)=>{
    let body=req.body;
    try {
        let data=await UserModel.findByIdAndDelete({_id:body.user})
        res.send("Account has been successfully deleted")
    } catch (error) {
        res.send(error)
    }
})
module.exports={
    userRouter
}