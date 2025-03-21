const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/checkAuth");
const {registerUser,loginUser, logoutUser, updateDetail, deleteUser, getDetail} = require('../controllers/authController')

router.get("/", function (req, res) {
    res.send("hey")
})

router.post("/register", registerUser)

router.post("/login", checkAuth, loginUser)

router.get("/getDetail", checkAuth, getDetail)

router.put("/update",checkAuth, updateDetail)

router.delete("/delete",checkAuth, deleteUser)

router.get("/logout", logoutUser)

module.exports = router;