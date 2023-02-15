const mongoose=require('mongoose');
const csvSchema = new mongoose.Schema({  
    date:{  
        type:String  
    },  
    description:{  
        type:String  
    },  
    amount:{  
        type:String  
    },  
    currency:{  
        type:String 
    } 
});
module.exports = mongoose.model('expenses',csvSchema); 