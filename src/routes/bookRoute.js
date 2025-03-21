const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/checkAuth");
const { createBook, getBook} = require('../controllers/bookController')

router.get("/", function (req, res) {
    res.send("hey")
})

router.post("/createBook", checkAuth, createBook )

router.get("/getBook",checkAuth, getBook )


module.exports = router;