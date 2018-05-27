const mongoose = require("mongoose");

let schema = mongoose.Schema({
    name: String,
    type: String,
    other: [String]
});

Sample = mongoose.model("Sample", schema);
