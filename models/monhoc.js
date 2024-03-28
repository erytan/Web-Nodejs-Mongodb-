const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var monhocSchema = new mongoose.Schema({
    tgmonhoc: {
        type: Array,
        default: []
    },
    mamonhoc: {
        type: String,
        required: true,
        unique: true,
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
module.exports = mongoose.model('Monhoc', monhocSchema);   