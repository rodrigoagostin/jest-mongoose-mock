const MODEL_METHODS = require("./methods");
const _ = require("underscore");

class MockModel {
    constructor() {
        this.dbRows = [];
        this.queryResult = null;

        for (let method of MODEL_METHODS) {
            const isFindOneOperation = method.indexOf("findOne") !== -1;
            const isFindOperation =
                method.indexOf("find") !== -1 && !isFindOneOperation;

            this[method] = jest.fn((query, cb) => {
                if (isFindOneOperation) {
                    this.queryResult = _.findWhere(this.dbRows, query);
                }

                if (isFindOperation) {
                    this.queryResult = _.where(this.dbRows, query);
                }

                // Mongoose find operations return null, not undefined
                if (this.queryResult === undefined) {
                    this.queryResult = null;
                }

                // If cb supplied to method, return a call to it, otherwise
                // return the model instance
                if (cb) {
                    return Promise.resolve(cb(this.queryResult));
                }

                return this;
            });

            this.then = jest.fn(cb => {
                if (cb) {
                    return Promise.resolve(cb(this.queryResult));
                }
            });

            this.exec = jest.fn(cb => {
                // If a callback is supplied to exec, call it, otherwise it is
                // being used as a Promise, so we return the Mocked model to be
                // used in .then and .catch
                if (cb) {
                    return Promise.resolve(cb(this.queryResult));
                }

                return this;
            });
        }
    }

    _setMockData(results) {
        this.dbRows = results;
    }

    _clearMockData() {
        this.dbRows = [];
    }
}

module.exports = MockModel;
