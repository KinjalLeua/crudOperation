const  express = require("express");
const CryptoJS = require("crypto-js");
const { verify } = require("jsonwebtoken");
const mongoose = require('mongoose');
const Token = require("../model/token")
const User = require("../model/user");

const checkAuth =  async (req, res, next) => {
    try {
      if (!req.headers.authorization) {
        return res.send("Unauthorized user")
      } else {
        const bearer = req.headers.authorization.split(" ");
        const bearerToken = bearer[1];

        Token.findOne({ tokenable_id: bearerToken })
          .then((data) => {
           console.log(data);
           
            if (!data) {
              return res.send("Invalid Access Token")
            } else {
              const key = CryptoJS.enc.Hex.parse(data.key);
              const iv = CryptoJS.enc.Hex.parse(data.iv);
              const decrypted = CryptoJS.AES.decrypt(data.token, key, {
                iv: iv,
              });
              const token = decrypted.toString(CryptoJS.enc.Utf8);
              console.log("token",token);
              
              verify(
                token,
                `${process.env.JWT_KEY}`,

                (err, jwt_payload) => {
                  console.log("jwt_payload",jwt_payload);
                  
                  if (err) {
                    res.json({msg:"no token authorized"});
                  } else {
                    User.findOne({
                      _id: new mongoose.Types.ObjectId(jwt_payload.id),
                    })
                      .then((user) => {
                        if (!user) {
                          res.json({msg:"invalid access authorized"});
                        } else {
                          req.token = bearerToken;
                          req.id = user._id;
                          next();
                        }
                      })
                      .catch((err) => {
                      console.log("Error",err);
                      
                      });
                  }
                }
              );
            }
          })
          .catch((err) => {
          console.log("error here",err);
          
          });
      }
    } catch (err) {
     console.log("errrrrrr");
     
    }
  };


module.exports = checkAuth

