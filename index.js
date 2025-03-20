const express = require("express");
const app = express();
const dbConnect = require('./config/db');
const path = require("path")
const indexRoute = require("./routes/index");
const userRoute = require("./routes/userRoute"); 
const bookRoute = require("./routes/bookRoute")

require('dotenv').config()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'public')));
dbConnect(process.env.DATABASE)



app.use('/',indexRoute);
app.use('/users',userRoute);
app.use("/books", bookRoute);



app.listen(process.env.PORT,()=>{
    console.log(`Server running at ${process.env.PORT}`)
  });
