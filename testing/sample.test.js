const MockModel = require("..");

jest.mock("./sample.model.js", () => {
    const MockModel = require("..");
    return new MockModel();
});

const sampleController = require("./sample.controller");
const Sample = require("./sample.model");

describe("Model Unit Tests", () => {
    let req, res, model;
    beforeEach(() => {
        jest.clearAllMocks();
        req = {
            body: {}
        };
        res = {
            json: jest.fn()
        };
        model = new MockModel();
    });

    it("Allows chaining of commands", () => {
        model
            .findOne()
            .where()
            .exec()
            .then();
        const methods = ["findOne", "where", "exec", "then"];
        for (let method of methods) {
            expect(model[method].mock.calls.length).toBe(1);
        }
    });
    it("Passes data to to find, findOne, and then callbacks", () => {
        const mockData = [{ id: 1 }];
        model._setMockData(mockData);
        const cb1 = jest.fn();
        const cb2 = jest.fn();
        const cb3 = jest.fn();
        const cb4 = jest.fn();
        model.find({}, cb1);
        model.findOne({}, cb2);
        model.findOne({}).then(cb3);
        model.findOne({}).exec(cb4);
        expect(cb1).lastCalledWith(mockData);
        expect(cb2).lastCalledWith(mockData[0]);
        expect(cb3).lastCalledWith(mockData[0]);
        expect(cb4).lastCalledWith(mockData[0]);
    });

    it("findOne Mechanism works", () => {
        const model = new MockModel();
        expect.assertions(2);
        model._setMockData([
            {
                id: 1,
                name: "hello"
            },
            {
                id: 5,
                name: "Test"
            }
        ]);
        model
            .findOne({ id: 1 })
            .exec()
            .then(result => {
                expect(result.id).toEqual(1);
            });
        model
            .findOne({ id: 100 })
            .exec()
            .then(result => {
                expect(result).toBeNull();
            });
    });

    it("find mechanism works", () => {
        const model = new MockModel();

        model._setMockData([
            {
                id: 1,
                name: "hello"
            },
            {
                id: 3,
                name: "Test"
            }
        ]);

        model.find({}).then(result => {
            expect(result.length).toEqual(2);
            expect(result[0].id).toEqual(1);
            expect(result[1].name).toEqual("Test");
        });
    });

    it("catch mechanism called when model throws", done => {
        const model = new MockModel();
        model._setMockData([
            {
                id: 1,
                name: "hello"
            },
            {
                id: 3,
                name: "Test"
            }
        ]);
        expect.assertions(1);
        model
            .find({ id: 1 })
            .populate("a")
            .then(() => {
                return Promise.reject();
            })
            .catch(() => {
                expect(true).toEqual(true);
                done();
            });
    });

    it("set and clear mock data works", () => {
        model._setMockData(["test"]);
        expect(model.dbRows).toEqual(["test"]);
        model._clearMockData();
        expect(model.dbRows).toEqual([]);
    });
});

describe("Controller Integration", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        Sample._clearMockData();
        req = {
            body: {}
        };
        res = {
            json: jest.fn()
        };
    });
    it("Mock data set on model passed to res.json", () => {
        Sample._setMockData([
            {
                id: 1,
                name: "Austin"
            },
            {
                id: 2,
                name: "Daniel"
            }
        ]);
        req.body = { id: 1 };
        sampleController.findOne(req, res);
        expect(res.json).lastCalledWith({ id: 1, name: "Austin" });
        expect(Sample.findOne.mock.calls.length).toBe(1);
        req.body = {};
        sampleController.find(req, res);
        expect(res.json).lastCalledWith([
            {
                id: 1,
                name: "Austin"
            },
            {
                id: 2,
                name: "Daniel"
            }
        ]);
    });
    it("Calls correct methods on controller call", () => {
        sampleController.chainActions(req, res);
        expect(Sample.findOne).toHaveBeenCalled();
        expect(Sample.then).toHaveBeenCalled();
    });
});
