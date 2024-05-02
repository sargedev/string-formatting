// tests go here; this will not be compiled when this package is used as an extension.

let result;
let method;

function testFormat(str: string, params: string[], expected: string) {
    result = text.format(str, params);
    new tests.AssertEqual(result, expected);
}

function testSingle() {
    testFormat("Foo {}", ["bar"], "Foo bar");
}

function testMultiple() {
    testFormat("Foo {} {}", ["bar", "baz"], "Foo bar baz");
}

function testInvalidField() {
    testFormat("Foo {.}", ["bar"], "Foo {.}");
}

function testInvalidValidField() {
    testFormat("Foo {.} {}", ["bar"], "Foo {.} bar");
}

function testValidInvalidField() {
    testFormat("Foo {} {.}", ["bar"], "Foo bar {.}");
}

function testUnclosedBracket() {
    testFormat("Foo {", ["bar"], "Foo {")
}

function testNoRequiredParams() {
    testFormat("Foo", ["bar"], "Foo")
}

function testNoParams() {
    testFormat("Foo", [], "Foo");
}

function testFewParams() {
    method = () => text.format("Foo {}", []);
    new tests.AssertRaises(method, "Expected 1 param(s) (got 0)")
}

// Run tests
testSingle();
testMultiple();
testInvalidField();
testInvalidValidField();
testValidInvalidField();
testUnclosedBracket();
testNoRequiredParams();
testNoParams();
testFewParams();