const MODEL_METHODS = require("./methods");

class MockModel {
    constructor() {
        for (let method of MODEL_METHODS) {
            this[method] = jest.fn();
        }
    }
}

module.exports = MockModel;
