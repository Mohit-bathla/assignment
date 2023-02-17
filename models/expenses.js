const mongoose=require('mongoose');
const csvSchema = new mongoose.Schema({  
    date:{  
        type:Date 
    },  
    description:{  
        type:String  
    },  
    amount:{  
        type:String  
    },  
    currency:{  
        type:String 
    }, 
    inr:{
        type:String
    }
});
module.exports = mongoose.model('expenses',csvSchema); 