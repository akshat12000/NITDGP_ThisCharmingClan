const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const doctorSchema = new Schema({
    email: {
        type: String,
        required: true
      },
      password: {
        type: String,
        required: true
      },
    name: {
        type: String,
        // required: [true, "Doctor's name required"]
    },
    qualifications: {
        type: String
    },
    patientId: {
        type: String
    }
});


module.exports = mongoose.model('Doctor', doctorSchema);