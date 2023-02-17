const csvModel = require('../models/expenses');
const csv = require('csvtojson');

function reverseDate(date){
    var parts=date.split('-');
    var myDate=(parts[2])+'-'+(parts[1])+'-'+(parts[0]);
    return myDate;

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

var converter=function(date){
    var parts=date.split('-');
    var myDate=new Date((parts[2])+'-'+(parts[1])+'-'+(parts[0]));
    return myDate;
}


module.exports.homepage=function(req,res){
    csvModel.find({},function(err,data){
        if(err){
            console.log("error in loading page",err);
            return;
        }
        res.render('index',{data:data});

        
        
    })
}
module.exports.csvUpload=async function(req,res){

    csv().fromFile(req.file.path).then(async function(jsonObject){
    
        var userData=[];

        for(var x=0;x<jsonObject.length;x++){
            userData.push({
                inr: await usdToInr(jsonObject[x].Amount,reverseDate(jsonObject[x].Date)),
                date:converter(jsonObject[x].Date),
                description:jsonObject[x].Description,
                amount:jsonObject[x].Amount,
                currency:jsonObject[x].Currency,

            })

        }
     
        csvModel.insertMany(userData, function(err, data){
            if (err) {
                console.log("error in uploading",err);
            } else {
                res.redirect('/');
            }
        });
    });
}
