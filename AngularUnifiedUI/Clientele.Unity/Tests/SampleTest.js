/// <reference path="jasmine.js"/>
/// <reference path="~/Tests/Math.js"/>

describe("Math.Add", function() {
    it("Can Add Two Numbers", function() {
        var result = new Math.add(2, 4);
        expect(result).toBe(6);
    });
});