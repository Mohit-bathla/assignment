const csvModel = require('../models/expenses');
const csv = require('csvtojson');

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
module.exports.csvUpload=function(req,res){
    csv().fromFile(req.file.path).then(function(jsonObject){
    
        var userData=[];
        for(var x=0;x<jsonObject.length;x++){
            userData.push({
                date:converter(jsonObject[x].Date),
                description:jsonObject[x].Description,
                amount:jsonObject[x].Amount,
                currency:jsonObject[x].Currency

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
