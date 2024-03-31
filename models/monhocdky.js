const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
const monhocdangkySchema = new mongoose.Schema({
    tgmonhoc: {
        type: String,
        required: true,
        unique: false, // Giữ nguyên nếu bạn muốn giữ tính duy nhất của trường này
    },
    mamonhoc: {
        type: String,
        // Không cần unique ở đây nếu bạn muốn cho phép trùng lặp
    },
    sinhviendky: {
        type: Array,
        default: [[]]
    },
    tenmonhoc: {
        type: String,
        // Không cần unique ở đây nếu bạn muốn cho phép trùng lặp
    },
}, {
    timestamps: true
});

// Export the model
module.exports = mongoose.model('MonhocDky', monhocdangkySchema);
