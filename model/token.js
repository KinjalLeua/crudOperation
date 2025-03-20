const mongoose = require('mongoose');


const tokenSchema = mongoose.Schema(
  {
    tokenable_type: {
      type: String,
      required: true,
    },
    tokenable_id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    key: {
      type: String,
      required: true,
    },
    iv: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Token = mongoose.model("token", tokenSchema);
module.exports = Token;
