const formidable = require("formidable");
const Police = require("../models/police");
const Cases = require("../models/cases");
const Unassigned = require("../models/unassigned")
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.casesById = (req, res, next, id) => {
    Cases.findById(id).exec((err, cases) => {
        if (err || !cases) {
            return res.status(400).json({
                error: "car not found",
            });
        }
        req.case = cases;
        next();
    });
};

exports.list = (req, res) => {
    Cases.find({}).populate("OfficerAssigned").exec((err, result)=>{
        if (err)
                return res.status(400).json({
                    error: errorHandler(err),
                });
        return res.json(result)
    })
}

exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.parse(req, (err, fields)=>{
        if (err)
            return res.status(400).json({
                error: "form could not be submitted",
            });
        let cases = new Cases(fields);
        const { CarNo, Model, OwnerName, OwnerContact } = fields;
        if (!OwnerContact || !CarNo || !Model || !OwnerName) {
            return res.status(400).json({
                error: "All fields are required",
            });
        }
        Police.find({}).exec((err, polices)=>{
            var unassigned = true;
            for(police of polices){
                if(!police.currentCase){
                    var pol = police._id;
                    cases.OfficerAssigned = police._id;
                    cases.status = 'assigned';
                    unassigned = false;
                    break;
                }
            }
            if(unassigned){
                cases.status = 'unassigned';
            }
            cases.save((err, result)=>{
                if(unassigned){
                    const unassignedCase = new Unassigned({case: result._id})
                    unassignedCase.save((err, result)=>{
                        console.log(result)
                    })
                }
                else{
                    console.log(pol)
                    Police.findByIdAndUpdate(pol,{
                        currentCase: result._id
                    }).exec((err, result)=>{
                        if(err)
                            console.log(err)
                        console.log(result)
                    })
                }
                return res.json(result)
            })
        })
    })
    //res.json({message: "Submitted"})
}

exports.resolve = (req, res) => {
    console.log(req.case)
    const cases = req.case;
    cases.status = 'resolved';
    cases.save((err, result) =>{
        Unassigned.find({}).exec((err, unassigned) =>{
            console.log(unassigned)
            if(unassigned.length){
                Police.findByIdAndUpdate(result.OfficerAssigned,{
                    currentCase: unassigned[0].case
                }).exec((err, police)=>{
                    Cases.findByIdAndUpdate(unassigned[0].case,{status: 'assigned', OfficerAssigned: police._id}).exec((err, out)=>{
                        if(err)
                            console.log(err)
                        console.log(out)
                        unassigned[0].remove((err, deletedCase) => {
                            if (err)
                            return res.status(400).json({
                                error: errorHandler(err),
                            });
                            res.json({
                            message: "Case resolved",
                            });
                        })
                    })
                })
            }
            else{
                Police.findByIdAndUpdate(result.OfficerAssigned,{
                    currentCase: undefined
                }).exec((err, police)=>{
                    if(err)
                        console.log(err)
                    console.log(police)
                    res.json({
                        message: "Case resolved",
                    });
                })
            }
        })
    })
}