const mongoose = require('mongoose');

const uri = "mongodb+srv://schoolingsocial5_db_user:G4tWSx9jVRXF50mt@schooling.zofwimm.mongodb.net/Schooling?retryWrites=true&w=majority";

mongoose.connect(uri)
  .then(async () => {
    console.log('Connected to Schooling DB');
    const Company = mongoose.model('Company', new mongoose.Schema({}, { strict: false }));
    const company = await Company.findOne({});
    console.log('Current Company:', company);
    if (company && company.get('allowSignUp') === false) {
      await Company.updateOne({_id: company._id}, {$set: {allowSignUp: true}});
      console.log('Updated allowSignUp to true!');
    } else if (!company) {
      await Company.create({ allowSignUp: true });
      console.log('Created Company with allowSignUp: true!');
    } else {
      console.log('allowSignUp is already true or not false.');
    }
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
