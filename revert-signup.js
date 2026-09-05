const mongoose = require('mongoose');

const uri = "mongodb+srv://schoolingsocial5_db_user:G4tWSx9jVRXF50mt@schooling.zofwimm.mongodb.net/Schooling?retryWrites=true&w=majority";

mongoose.connect(uri)
  .then(async () => {
    console.log('Connected to Schooling DB');
    const Company = mongoose.model('Company', new mongoose.Schema({}, { strict: false }));
    const company = await Company.findOne({});
    if (company && company.get('allowSignUp') === true) {
      await Company.updateOne({_id: company._id}, {$set: {allowSignUp: false}});
      console.log('Reverted allowSignUp back to false!');
    } else {
      console.log('allowSignUp is already false or not true.');
    }
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
