const mongoose = require('mongoose');

const userModel = mongoose.Schema({
    name: { type: String },
    email: { type: String },
    password: { type: String },
    phone: { type: Number },
    dob:  { type: Date },
    gender: { type: String ,enum:["Male","Female","Other"] },
    picture: { type: String },
    address:  { type: String },
    city:  { type: String },
    state: { type: String },
    country:  { type: String },
    status:  { type: Boolean, default: true },
 

},
{ timestamps: true })

const user = mongoose.model('user',userModel);
module.exports = user;