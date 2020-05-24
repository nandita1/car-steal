const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const policeSchema = new mongoose.Schema(
    {
        name: String,
        currentCase: {
            type: ObjectId,
            ref: "Cases",
            default: undefined
        }
    }
)
module.exports = mongoose.model("Police", policeSchema);