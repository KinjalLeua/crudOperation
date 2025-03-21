const userModel = require("../model/user");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
const {createToken} = require("../helper/token")
const CryptoJS = require("crypto-js");
const Token = require("../model/token");
const {checkPassword,toLowerCase,hashPassword} = require("../helper/helper")
const constants = require("../utils/constants")

const registerUser = async (req, res) => {
    try {
      const { name, email, password, phone, dob, gender, picture, address, city, state, country } = req.body;
  
    
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return res.status(409).json({
          status: constants.status.statusFalse,
          userStatus: constants.status.statusFalse,
          message: constants.message.userAlreadyExists,
        });
      }
  

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
     
      const newUser = await userModel.create({
        name,
        email,
        password: hashedPassword,
        phone,
        dob,
        gender,
        picture,
        address,
        city,
        state,
        country,
      });
  
   
      const payload = { id: newUser._id };
      const token = await createToken(payload);
  
     
      
      res.status(constants.code.success).json({
        status: constants.status.statusTrue,
        message: constants.message.userSuccess,
        token: token,  
        userStatus: newUser.status,  
        data: newUser,
      });
  
    } catch (err) {
      return res.status(constants.code.preconditionFailed).json({
        status: constants.status.statusFalse,
        userStatus: constants.status.statusFalse,
        message: err.msg || err.message || "Server error during registration.",
      });
    }
  };
  
  const loginUser = async (req, res) => {
    try {
      const email = await toLowerCase(req.body.email); 
  
      userModel.findOne({ email })
        .then(async (data) => {
          if (!data) {
            throw {
              statusCode: constants.code.preconditionFailed,
              msg: constants.message.invalidEmail,
            };
          } else if ((await checkPassword(req.body.password, data.password)) !== true) {
            throw {
              statusCode: constants.code.preconditionFailed,
              msg: constants.message.invalidPassword,
            };
          } else if (!data.status) {
            throw {
              statusCode: constants.code.preconditionFailed,
              msg: constants.message.userInactive,
            };
          } else {
            return res.status(constants.code.success).json({
              status: constants.status.statusTrue,
              userStatus: data.status,
              message: constants.message.success,
              data: await data,  
            });
          }
        })
        .catch((err) => {
            console.log("errr",err);
            
          res.status(constants.code.dataNotFound).json({
            status: constants.status.statusFalse,
            userStatus: constants.status.statusFalse,
            message: err.msg,
          });
        });
    } catch (err) {
        console.log(err);
        
      res.status(constants.code.preconditionFailed).json({
        status: constants.status.statusFalse,
        userStatus: constants.status.statusFalse,
        message: err.msg || err,
      });
    }
  };
  
const getDetail = async (req, res) => {
    try {
        userModel.findOne({
        _id: new mongoose.Types.ObjectId(req.id),
        status: true,
      })
        .then(async (data) => {
          if (!data) {
            throw {
              statusCode: constants.code.dataNotFound,
              msg: constants.message.dataNotFound,
            };
          } else {
            res.status(constants.code.success).json({
              status: constants.status.statusTrue,
              userStatus: req.status,
              message: constants.message.userDetail,
              data: await data,
            });
          }
        })
        .catch((err) => {
          res.status(err.statusCode).json({
            status: constants.status.statusFalse,
            userStatus: req.status,
            message: err.msg,
          });
        });
    } catch (err) {
        console.log(err);
        
      res.status(constants.code.internalServerError).json({
        status: constants.status.statusFalse,
        userStatus: req.status,
        message: err,
      });
    }
  };
  
  const updateDetail = async (req, res) => {
    try {
      userModel.exists({ _id: req.id })
        .then(async (userData) => {
          if (!userData) {
            throw {
              statusCode: constants.code.dataNotFound,
              message: constants.message.dataNotFound,
            };
          } else {
           
            userModel.findOneAndUpdate(
              {
                _id: new mongoose.Types.ObjectId(req.id),
                status: true,
              },
              {
                name: req.body.name,
                email:req.body.email,
                password: await hashPassword(req.body.new_password),
                phone:req.body.phone,
                dob: req.body.dob,
                gender: req.body.gender,
                picture: req.body.picture,
                address : req.body.address,
                city : req.body.city,
                state: req.body.state,
                country: req.body.country
              },
              { new: true }
            )
              .then(async (data) => {
                if (!data) {
                  throw {
                    statusCode: constants.code.dataNotFound,
                    msg: constants.message.dataNotFound,
                  };
                } else {
                  res.status(constants.code.success).json({
                    status: constants.status.statusTrue,
                    userStatus: req.status,
                    message: constants.message.userUpdate,
                  });
                }
              })
              .catch((err) => {
                res.status(err.statusCode).json({
                  status: constants.status.statusFalse,
                  userStatus: req.status,
                  message: err.msg,
                });
              });
          }
        })
        .catch((err) => {

          res.status(constants.code.dataNotFound).json({
            statusCode: constants.status.statusFalse,
            userStatus: req.status,
            message: err.message,
          });
        });
    } catch (err) {
      res.status(constants.code.internalServerError).json({
        status: constants.status.statusFalse,
        userStatus: req.status,
        message: err,
      });
    }
  };
  

  const deleteUser = async (req, res) => {
    try {
      const userExists = await userModel.exists({ _id: req.id });
      
      if (!userExists) {
        throw {
          statusCode: constants.code.dataNotFound,
          message: constants.message.dataNotFound,
        };
      } else {
       
        userModel.findByIdAndDelete(req.id)
          .then((deletedUser) => {
            if (!deletedUser) {
              throw {
                statusCode: constants.code.dataNotFound,
                message: constants.message.userDeleted,
              };
            } else {
              res.status(constants.code.success).json({
                status: constants.status.statusTrue,
                message: constants.message.userDeleted,
              });
            }
          })
          .catch((err) => {
            res.status(constants.code.internalServerError).json({
              status: constants.status.statusFalse,
              userStatus: req.status,
              message: err.message,
            });
          });
      }
    } catch (err) {
      res.status(constants.code.internalServerError).json({
        status: constants.status.statusFalse,
        userStatus: req.status,
        message: err.message,
      });
    }
  };
  


const logoutUser = async function (req, res) {
    res.cookie("token", "");
    return res.redirect("/")
}

module.exports = { registerUser, loginUser, getDetail, updateDetail, deleteUser, logoutUser }


