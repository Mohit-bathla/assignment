const express=require('express');
//app init 
const app=express();
const port=8000;
//database connection
const fileController=require('./controllers/file_controller');
const homeController=require('./controllers/home_controller');
const db=require('./config/mongoose.js');
const path = require('path');
const multer=require('multer');
const file_path=path.join('/uploads');
const csvModel = require('./models/expenses');
const csv = require('csvtojson');
const bodyParser = require('body-parser');
app.use(express.urlencoded());
app.set('view engine','ejs');
app.set('views','./views');

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,file_path));
    },
    filename: function (req, file, cb) {
      //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.originalname); 
    }
})
const uploads = multer({ storage: storage });

//initiate page
app.get('/',homeController.homepage)
//post --user uploads a file and that is stored
app.post('/',uploads.single('csv'),homeController.csvUpload);
app.get("/details", fileController.details);
app.post('/insert',fileController.insert);
app.post('/edit',fileController.edit);
app.post('/del',fileController.del);
app.get('/insertion',function(req,res){
res.render('insertion');

})
app.get('/deletion',function(req,res){
res.render('deletion');

})
app.get('/edition',function(req,res){
res.render('edition');

})
app.listen(port,function(err){
if(err){
    console.log(`Error ${err}`);
}
console.log(`server is running on ${port}`)
});