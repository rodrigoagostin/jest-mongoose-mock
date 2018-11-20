const Sample = require("./sample.model");

exports.findOne = (req, res) => {
    Sample.findOne()
        .where(req.body)
        .then(result => res.json(result));
};

exports.chainActions = (req, res) => {
    Sample.findOne()
        .where()
        .exec()
        .then(result => res.json(result));
};

exports.find = (req, res) => {
    Sample.find(req.body)
        .exec()
        .then(result => res.json(result));
};
