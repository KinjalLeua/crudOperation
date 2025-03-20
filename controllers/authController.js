const userModel = require("../model/user");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generateToken")
const CryptoJS = require("crypto-js");
const Token = require("../model/token");

const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone, dob, gender, picture, address, city, state, country } = req.body;

     
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ msg: "User already exists" });
        }

      
        bcrypt.genSalt(10, async (err, salt) => {
            if (err) {
                return res.status(500).json({ msg: "Error generating salt", error: err.message });
            }

            bcrypt.hash(password, salt, async (err, hash) => {
                if (err) {
                    return res.status(500).json({ msg: "Error hashing password", error: err.message });
                }

                try {
                    const newUser = await userModel.create({
                        name,
                        email,
                        password: hash,
                        phone,
                        dob,
                        gender,
                        picture,
                        address,
                        city,
                        state,
                        country,
                    });

                    const token = generateToken(newUser);

            
                    const key = CryptoJS.lib.WordArray.random(32);
                    const iv = CryptoJS.lib.WordArray.random(16);

                 
                    const encryptedToken = CryptoJS.AES.encrypt(token, key, { iv: iv }).toString();
                    const msg = encryptedToken.toString();
                  
                    await Token.create({
                        tokenable_type: "jwt",
                        tokenable_id: encryptedToken,
                        name: "bearer",
                        token: msg,
                        key: key,
                        iv: iv, 
                    });

                    res.status(201).json({ token, user: newUser });
                } catch (error) {
                    return res.status(500).json({ msg: "Error saving user", error: error.message });
                }
            });
        });
    } catch (error) {
        console.error("Registration Error:", error.message);
        return res.status(500).json({ msg: "Server error", error: error.message });
    }
};


const loginUser = async function (req, res) {
    let { email, password } = req.body;
    let user = await userModel.findOne({ email: email })
    if (!user) {
        res.json({msg: "Email and Password incorrect"} );
    } else {
        bcrypt.compare(password, user.password, function (err, result) {
            if (result) {
                res.json("User logged in successfully")

            } else {
                res.json("error", "Email and Password incorrect");
            }
        })
    }
}

const updateUser = async function (req, res) {
    try {
       const user =  await userModel.findByIdAndUpdate(
        req.id,
        req.body,
        { new: true }
        )
            .then((updateDetails) => {
                if (!updateDetails) {
                    res.send("User not update")
                } else {
                    res.send("User updated successfully")
                }
            })
            .catch((err) => {
                console.log(err);

            });


    } catch (err) {
        console.log(err.message);

    }
}

const deleteUser = async function (req, res) {
    try {
        const userDetails = await userModel.findByIdAndDelete(req.id);
        
            if(userDetails){
                res.json("user Deleted successfully")
            }else{
                res.json(
                    "error while delete user"
                )
            }


    } catch (err) {
        console.log(err.message);

    }
}


const logoutUser = async function (req, res) {
    res.cookie("token", "");
    return res.redirect("/")
}

module.exports = { registerUser, loginUser, updateUser, deleteUser, logoutUser }


