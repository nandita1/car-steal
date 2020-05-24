const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const casesSchema = new mongoose.Schema(
    {
        CarNo: String,
        Model: String,
        OwnerName: String,
        OwnerContact: Number,
        status: String,
        OfficerAssigned: {
            type: ObjectId,
            ref: "Police",
            default: undefined
        }
    }
)
module.exports = mongoose.model("Cases", casesSchema);