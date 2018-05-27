const Sample = require("./sample.model");

exports.sampleAction = (req, res) => {
    Sample.findOne()
        .where()
        .exec();

    res.json();
};
