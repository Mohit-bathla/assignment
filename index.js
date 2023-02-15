const express=require('express');
const app=express();
const port=8000;
const db=require('./config/mongoose.js');
app.use(express.urlencoded());
app.set('view engine','ejs');
app.set('views','./views');