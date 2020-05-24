const express = require("express");
const router = express.Router();

const {create} = require('../controllers/police')

router.post("/police/create", create);

module.exports = router;