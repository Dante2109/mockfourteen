const mongoose=require("mongoose");
const ledgerSchema=mongoose.Schema({
    userId:String,
    type:String,
    title:String,
    amount:Number
})

const LedgerModel=mongoose.model("ledger",ledgerSchema)

module.exports={
    LedgerModel
}