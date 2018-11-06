const MockModel = require("..");


jest.mock("./sample.model.js", () => {
    return new MockModel();
});
jest.mock("./anotherSample.model.js", () => {
    return new MockModel();
});

const sampleController = require("./sample.controller");
const Sample = require("./sample.model");
const AnotherSample = require("./anotherSample.model");

describe("MockModel", () => {
    let req, res;
    beforeEach(() => {
        jest.clearAllMocks();
        req = {
            body: {}
        };
        res = {
            json: jest.fn()
        };
    });

    it("Allows chaining of commands", () => {
        sampleController.sampleAction(req, res);
        const methods = ["findOne", "where", "exec"];
        for (let method of methods) {
            expect(Sample[method].mock.calls.length).toBe(1);
        }
    });
    it("Works with multiple models in same test", () => {
        sampleController.sampleAction(req, res);
        const methods = ["findOne", "where", "exec"];
        for (let method of methods) {
            expect(AnotherSample[method].mock.calls.length).toBe(0);
        }
    });

    it("Allows use of promises", () => {
        sampleController.sampleWithPromise(req, res);
        const methods = ["findOne", "exec", "then"];
        for (let method of methods) {
            expect(Sample[method]).toHaveBeenCalled();
        }
    });


    it("Test the findOne mechanism", () => {
        const model = new MockModel();

        model._setMockData([
            {
                id: 1,
                name: 'hello'
            },
            {
                id: 5,
                name: 'Test'
            }
        ]);

        model
        .findOne({id: 1})
        .exec()
        .then((result) => {
            expect(result.id).toEqual(1);
        })
    });


    it("Test the find mechanism", () => {
        const model = new MockModel();

        model._setMockData([
            {
                id: 1,
                name: 'hello'
            },
            {
                id: 3,
                name: 'Test'
            }
        ]);

        model
        .find({id: 1})
        .then((result) => {
            expect(result.length).toEqual(1);
            expect(result[0].id).toEqual(1);
            expect(result[0].name).toEqual('hello');
        })
    });


    it("Test the Model catch mechanism", (done) => {
        const model = new MockModel();

        model._setMockData([
            {
                id: 1,
                name: 'hello'
            },
            {
                id: 3,
                name: 'Test'
            }
        ]);

        model
        .find({id: 1})
        .populate('a')
        .then(() => {
            return Promise.reject();
        })
        .catch(() => {
            expect(true).toEqual(true);
            done();
        });
    });
});
