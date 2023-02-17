const csvModel = require('../models/expenses');
const path = require('path');

function dateToString(date){
    var d = new Date(date);
    stringDate = [
        d.getFullYear(),
        ('0' + (d.getMonth() + 1)).slice(-2),
        ('0' + d.getDate()).slice(-2)
    ].join('-');
    return stringDate;
}
async function usdToInr(amount,date){
    var myHeaders = new Headers();
    myHeaders.append("apikey", "QtRRUHOWwBU1NTNpm6jAd2rR990V6gyx");

    var requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: myHeaders
    };

    let response=await fetch(`https://api.apilayer.com/exchangerates_data/convert?to=inr&from=usd&amount=${amount}&date=${date}`, requestOptions)
    let responseJson = await response.json()
    let inrValue = responseJson.result;

    return inrValue;

}

module.exports.details=function (req, res) {
    
    csvModel.find({}, function (err,Details) {
        if (err) {
            console.log(err);
            res.redirect('back');
        } else {
            res.render("details", { data:Details })
        }
    });
    usdToInr('10','2002-01-04')
}
module.exports.insert=function(req,res){
    const data = new csvModel({
        date: req.body.Date,
        description: req.body.Description,
        amount: req.body.Amount,
        currency: req.body.Currency
    })
    data.save();
    return res.render('inserted')
 }
 module.exports.edit=function(req,res){
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
            return res.redirect('back');
        }
        else{
            res.render('edited');
        }
    });

 }
 module.exports.del=function(req,res){
    var prevDate=req.body.Date;
    var prevDescription=req.body.Description;
    var prevAmount=req.body.Amount;
    var prevCurrency=req.body.Currency;

    csvModel.findOneAndDelete({ description: prevDescription, date: prevDate, amount: prevAmount, currency: prevCurrency }, function(err) {
        if (err) {
            console.log("Error in deletion",err);
            res.redirect('back')
        }
        else {
            return res.render('deleted')
        }
    });
    //res.send("SEARCH COMPLETED");
    //res.render('deleted.ejs');

 }