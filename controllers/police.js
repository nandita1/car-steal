const Police = require("../models/police");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.create = (req, res) => {
    const police = new Police(req.body);
    police.save((err, police) => {
        if(err){
            //console.log(err)
            return res.status(400).json({
                error: errorHandler(err) || err.message,
            });
        }
        return res.json(police)
    })
}