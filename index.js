const express=require('express');
//app init 
const app=express();
const port=8000;
//databse connection
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
      cb(null, file.fieldname + '-' + Date.now()); 
    }
})
const uploads = multer({ storage: storage });
//initiate page
app.get('/',function(req,res){
    csvModel.find({},function(err,data){
        if(err){
            console.log("error in loading page",err);
            return;
        }
        
        res.render('index',{data:data});
        
    })
})
//post --user uploads a file and that is stored
var userData=[];
app.post('/',uploads.single('csv'),function(req,res){
    csv().fromFile(req.file.path).then(function(jsonObject){
        for(var x=0;x<jsonObject.length;x++){
            userData.push({
                date:jsonObject[x].Date,
                description:jsonObject[x].Description,
                amount:jsonObject[x].Amount,
                currency:jsonObject[x].Currency

            })

        }
        console.log(userData[0]);
        csvModel.insertMany(userData, function(err, data){
            if (err) {
                console.log("error in uploading",err);
            } else {
                res.redirect('/');
            }
        });
    });
})
app.get("/details", function (req, res) {
    csvModel.find({}, function (err,Details) {
        if (err) {
            console.log(err);
            res.redirect('back');
        } else {
            res.render("details", { data:Details })
        }
    });
});
app.listen(port,function(err){
    if(err){
        console.log(`Error ${err}`);
    }
    console.log(`server is running on ${port}`)
 });
 app.post('/insert',function(req,res){
    const data = new csvModel({
        date: req.body.Date,
        description: req.body.Description,
        amount: req.body.Amount,
        currency: req.body.Currency
    })
    data.save();
    return res.render('inserted')
 })
 app.post('/edit',function(req,res){
    var prevDate=req.body.Date;
    var prevDescription=req.body.Description;
    var prevAmount=req.body.Amount;
    var prevCurrency=req.body.Currency;

    var newDate=req.body.Datenew;
    var newDescription=req.body.Descriptionnew;
    var newAmount=req.body.Amountnew;
    var newCurrency=req.body.Currencynew;
    
    csvModel.findOneAndReplace({date:prevDate ,description:prevDescription, amount:prevAmount, currency:prevCurrency},{date:newDate ,description:newDescription, amount:newAmount, currency:newCurrency},{ returnOriginal: false },function(err,data){
        if(err){
            console.log('error in edition',err);
            res.redirect('back');
        }
        else{
            console.log("sup");
            return res.render('edited');
        }
    });

 })
 app.get('/insertion',function(req,res){
    res.render('insertion');

 })
 app.get('/deletion',function(req,res){
    res.render('deletion');

 })
 app.get('/edition',function(req,res){
    res.render('edition');

 })