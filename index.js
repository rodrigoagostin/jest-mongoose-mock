const MODEL_METHODS = require("./methods");

class MockModel {
    constructor() {
        for (let method of methods) {
            this[method] = jest.fn();
        }
    }
}

module.exports = MockModel;
