const mongoose = require('mongoose');
module.exports = async function connectDb(uri){
  await mongoose.connect(uri, { useNewUrlParser:true, useUnifiedTopology:true });
  console.log('MongoDB connected');
};
