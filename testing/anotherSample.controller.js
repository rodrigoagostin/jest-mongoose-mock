const AnotherSample = require("./anotherSample.model");

exports.sampleAction = (req, res) => {
    AnotherSample.findOne()
        .where()
        .exec();

    res.json();
};
