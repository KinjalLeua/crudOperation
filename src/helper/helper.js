
const CryptoJS = require("crypto-js");
const {hashSync, compareSync} = require("bcrypt")

const randomKey = async () => {
    const str = Array.from({ length: 64 }, () =>
      "0123456789abcdef".charAt(Math.floor(Math.random() * 16))
    ).join("");
    const key = CryptoJS.enc.Hex.parse(str);
    return key;
  };
  
  const randomiv = async () => {
    const str = Array.from({ length: 32 }, () =>
      "0123456789abcdef".charAt(Math.floor(Math.random() * 16))
    ).join("");
    const iv = CryptoJS.enc.Hex.parse(str);
    return iv;
  };
  
  const randomToken = async () => {
    const str = Array.from({ length: 48 }, () =>
      "0123456789aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ".charAt(
        Math.floor(Math.random() * 62)
      )
    ).join("");
  
    return str;
  };


  const checkPassword = async (password, hash) => {
    return compareSync(password, hash);
  };

  const hashPassword = async (password) => {
    const saltRounds = 15;
    return hashSync(password, saltRounds);
  };
  

  const toLowerCase = async (text) => {
    return text.toLowerCase();
  };

  module.exports = {
    randomKey,
    randomiv,
    randomToken,
    checkPassword,
    hashPassword,
    toLowerCase
  }