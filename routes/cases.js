const express = require("express");
const router = express.Router();

const {create, casesById, resolve, list} = require('../controllers/cases')

router.post("/cases/create", create);
router.get("/cases/resolve/:caseId", resolve)
router.get("/cases", list);
router.param("caseId", casesById);

module.exports = router;