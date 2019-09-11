let mongoose = require('mongoose');

let taskSchema = mongoose.Schema({

   _id: mongoose.Schema.Types.ObjectId,
   name : {
       type: String,
       
   },
    due:{
       type: Date,
        
    },
    status:{
       type: String,
        validate: {
           validator: function(statusVal){
               return statusVal === "Complete" || statusVal === "InProgress";
           }
        },
        
    },
    description:{
      type: String,
      
    },
    assignto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Developer'
    }
});

module.exports = mongoose.model('Task', taskSchema);


// Task name
// Assign to (the ID of the developer’s document)
// Due date (should be in date datatype, not a string)
// Task status (either InProgress or Complete)
// Task Description
