const express = require("express");
const router = express.Router()
const checkAuth = require("../middleware/checkAuth");

router.get("/",function(req,res){
 res.send("hey")
})


module.exports = router;