const mongoose = require('mongoose');

const { MONGO_URI } = process.env;

exports.connect = () => {
    // Connect to DB
    mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(() => {
            console.log("Successfully connected to DB.")
        }).catch((error) => {
            console.log("Unable to connect to DB", error)
            process.exit(1)
        })
};