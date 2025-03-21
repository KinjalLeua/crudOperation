const  express = require("express");
const CryptoJS = require("crypto-js");
const { verify } = require("jsonwebtoken");
const mongoose = require('mongoose');
const Token = require("../model/token")
const User = require("../model/user");
const constants = require("../utils/constants");


const checkAuth =  async function(req, res, next){
    try {
      if (!req.headers.authorization) {
        throw {
          statusCode: constants.code.unAuthorized,
          msg: constants.message.reqAccessToken,
        };
      } else {
        const bearer = req.headers.authorization.split(" ");
        const bearerToken = bearer[1];

       

        Token.findOne({ token: bearerToken })
          .then((data) => {
                     
            if (!data) {
              throw {
                statusCode: constants.code.unAuthorized,
                msg: constants.message.invalidAccessToken,
              };
            } else {
              const key = CryptoJS.enc.Hex.parse(data.key);
              const iv = CryptoJS.enc.Hex.parse(data.iv);
              const decrypted = CryptoJS.AES.decrypt(data.token, key, {
                iv: iv,
              });
              const token = decrypted.toString(CryptoJS.enc.Utf8);
        
              verify(
                token,
                `${process.env.JWT_SECRET}`,
                {
                  issuer: process.env.JWT_ISSUER,
                },
                (err, jwt_payload) => {
                  if (err) {
                    throw {
                      statusCode: constants.code.unAuthorized,
                      msg: err.message,
                    };
                  } else {
                    User.findOne({
                      _id: new mongoose.Types.ObjectId(jwt_payload.id),
                      status: true,
                    })
                      .then((user) => {
                        if (!user) {
                          throw {
                            statusCode: constants.code.unAuthorized,
                            msg: constants.message.invalidAccessToken,
                          };
                        } else {
                          req.token = bearerToken;
                          req.id = user._id;
                          req.status = user.status;
                          next();
                        }
                      })
                      .catch((err) => {
                        res.status(err.statusCode).json({
                          status: constants.status.statusFalse,
                          userStatus: constants.status.statusFalse,
                          message: err.msg,
                        });
                      });
                  }
                }
              );
            }
          })
          .catch((err) => {
            res.status(err.statusCode).json({
              status: constants.status.statusFalse,
              userStatus: constants.status.statusFalse,
              message: err.msg,
            });
          });
      }
    } catch (err) {
      res.status(err.statusCode).json({
        status: constants.status.statusFalse,
        userStatus: constants.status.statusFalse,
        message: err.msg,
      });
    }
  };



module.exports = checkAuth

