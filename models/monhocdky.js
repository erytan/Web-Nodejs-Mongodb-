const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var monhocdangkySchema = new mongoose.Schema({
    tgmonhoc: {
        type: String,
        required: true,
        unique: true,
    },
    mamonhoc: {
        type: String,
        required: true,
        unique: true,
    },
    sinhviendky: {
        type: Array,
        default: []
    },
    tenmonhoc: {
        type: String,
        required: true,
        unique: true,
    },
}, {
    timestamps: true
});

//Export the model
module.exports = mongoose.model('MonhocDky', monhocdangkySchema);   