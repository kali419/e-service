const mongoose = require('mongoose');


const serviceSchema = new mongoose.Schema({

  profilePicture: { type: String, required:true },
  brandName: { type: String,  required:true},
  email: { type: String, required:true },
  phoneNumber: { type: Number, required:true },
  service: { type: String, required:true },
  certificate: { type: String, required:true },
  location: { type: String, required: true },
  specialization:{type:String, required:true}
});

const serviceProvider = mongoose.model('serviceProvider', serviceSchema);

module.exports = serviceProvider;
