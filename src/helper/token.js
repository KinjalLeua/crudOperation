const {sign,verify} = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const mongoose = require('mongoose');

const Token = require("../model/token");
const { randomKey, randomiv, randomToken } = require("./helper");
const constants = require("../utils/constants");
const userModel = require("../model/user");;

const createToken = async (payload) => {
  try {
    const token = sign(payload, `${process.env.JWT_SECRET}`, {
      expiresIn: process.env.JWT_EXPIRE_TIME,
      issuer: process.env.JWT_ISSUER,
    });

    const key = await randomKey();
    const iv = await randomiv();
    const newToken = await randomToken();

    const encrypted = CryptoJS.AES.encrypt(token, key, { iv: iv });
    const msg = encrypted.toString();

    await Token.create({
      tokenable_type: "jwt",
      tokenable_id: newToken,
      name: "bearer",
      token: msg,
      key: key,
      iv: iv,
    }).catch((err) => {
      console.log(err);
    });


    return newToken;
    
  } catch (err) {
    console.log(err);
  }
};



const deleteToken = async (token) => {
  try {
    Token.deleteMany({ tokenable_id: token }).then((data) => {
      if (!data) {
        throw constants.message.dataNotFound;
      } else {
        return true;
      }
    });
  } catch (err) {
    console.log(err);
  }
};

const deleteAllToken = async (token) => {
  try {
    Token.findOne({ tokenable_id: token })
      .then((data) => {
        if (!data) {
          throw constants.message.dataNotFound;
        } else {
          const key = CryptoJS.enc.Hex.parse(data.key);
          const iv = CryptoJS.enc.Hex.parse(data.iv);
          const decrypted = CryptoJS.AES.decrypt(data.token, key, { iv: iv });
          const decryptedToken = decrypted.toString(CryptoJS.enc.Utf8);

          verify(
            decryptedToken,
            `${process.env.JWT_SECRET}`,
            {
              issuer: process.env.JWT_ISSUER,
            },
            async (err, jwt_payload) => {
              if (err) {
                throw err.message;
              } else {
                User.findById({
                  _id: new mongoose.Types.ObjectId(jwt_payload.id),
                })
                  .then(async (user) => {
                    if (!user) {
                      throw constants.message.dataNotFound;
                    } else {
                      const Tokens = await Token.find().then((data) => {
                        return data;
                      });

                      if (Tokens.length > 0) {
                        for (let i = 0; i < Tokens.length; i++) {
                          const key = CryptoJS.enc.Hex.parse(Tokens[i].key);
                          const iv = CryptoJS.enc.Hex.parse(Tokens[i].iv);
                          const decrypted = CryptoJS.AES.decrypt(
                            Tokens[i].token,
                            key,
                            {
                              iv: iv,
                            }
                          );
                          const decryptedToken = decrypted.toString(
                            CryptoJS.enc.Utf8
                          );

                          verify(
                            decryptedToken,
                            `${process.env.JWT_SECRET}`,
                            {
                              issuer: process.env.JWT_ISSUER,
                            },
                            async (err, users) => {
                              if (err) {
                                return;
                              } else {
                                if (user?._id?.toString() === users.id) {
                                  Token.deleteOne({
                                    tokenable_id: Tokens[i].tokenable_id,
                                  })
                                    .then((data) => {
                                      if (!data) {
                                        throw constants.message.dataNotFound;
                                      }
                                    })
                                    .catch((err) => {
                                      console.log(err);
                                    });
                                }
                              }
                            }
                          );
                        }
                      }
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }
            }
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
};

module.exports =  { createToken, deleteToken, deleteAllToken };
