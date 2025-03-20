const mongoose = require('mongoose');

const dbConnect = async (dbURI) => {
    try {
        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to the database");
    } catch (error) {
        console.error("Database connection error:", error);
    }
};

module.exports = dbConnect;