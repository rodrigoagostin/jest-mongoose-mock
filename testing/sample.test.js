const MockModel = require("..");
jest.mock("./sample.model.js", () => new MockModel());
jest.mock("./anotherSample.model.js", () => new MockModel());
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
});
