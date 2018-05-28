const Sample = require("./sample.model");

exports.sampleAction = (req, res) => {
    Sample.findOne()
        .where()
        .exec();

    res.json();
};

exports.sampleWithPromise = (req, res) => {
    Sample.findOne()
        .exec()
        .then(result => {
            console.log("result");
        })
        .catch(e => {
            console.log("ERROR");
        });
};
