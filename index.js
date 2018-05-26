const MODEL_METHODS = require("methods");

let mockModel = {};

for (let method of MODEL_METHODS) {
    mockedJobs[method] = jest.fn();
}

module.exports = mockModel;
