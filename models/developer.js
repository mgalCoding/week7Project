let mongoose = require('mongoose');

let developerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name:{
        firstName: {
            type: String,
            required: true}
        ,
        surname: String,
    },
    level : {
        type: String,
        validate:{
            validator: function (levelVal) {
                return levelVal === "EXPERT" || levelVal === "BEGINNER";
            }
        },
    },
    address:{
        state: String,
        suburb: String,
        street:String,
        unit: String,
        }
    }
);

module.exports = mongoose.model('Developer', developerSchema);


// name: an object has
// -first name  (required)
// -last name
// Level: String and can be either ‘Beginner or Expert’. (required and should be saved in all caps)
// Address: Object has
// -State
// -Suburb
// -Street
// -Unit
