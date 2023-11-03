const mongoose = require('mongoose');
const dotenv = require("dotenv")
dotenv.config()
mongoose.connect(process.env.DATABASEURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log(`Database connection successful`);
}).catch((e) => {
    console.log(`Database not connected`);
});
