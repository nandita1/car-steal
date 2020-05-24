const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const unassignedSchema = new mongoose.Schema(
    {
        case: {
            type: ObjectId,
            ref: "Cases"
        }
    }
)
module.exports = mongoose.model("Unassigned", unassignedSchema);