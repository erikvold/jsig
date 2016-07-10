'use strict';

var JSIGSnippet = require('../lib/jsig-snippet.js');

JSIGSnippet.test('can export a string', {
    snippet: function m() {/*
        var foo = '';

        module.exports = foo;
    */},
    header: function h() {/*
        foo : String
    */}
}, function t(snippet, assert) {
    var meta = snippet.compileAndCheck(assert);
    var exported = meta.serializeType(meta.moduleExportsType);

    assert.equal(exported, 'String');

    assert.end();
});

JSIGSnippet.test('can export an object', {
    snippet: function m() {/*
        var foo = { a: '' };

        module.exports = foo;
    */},
    header: function h() {/*
        foo : { a: String }
    */}
}, function t(snippet, assert) {
    var meta = snippet.compileAndCheck(assert);
    var exported = meta.serializeType(meta.moduleExportsType);

    assert.equal(exported, '{ a: String }');

    assert.end();
});

JSIGSnippet.test('can export an anonymous string', {
    snippet: function m() {/*
        var foo = '';

        module.exports = foo;
    */},
    header: function h() {/*
        export default String
    */}
}, function t(snippet, assert) {
    var meta = snippet.compileAndCheck(assert);
    var exported = meta.serializeType(meta.moduleExportsType);

    assert.equal(exported, 'String');

    assert.end();
});

JSIGSnippet.test('catches mis-export error', {
    snippet: function m() {/*
        var foo = '';

        module.exports = foo;
    */},
    header: function h() {/*
        export default Number
    */}
}, function t(snippet, assert) {
    var meta = snippet.compile(assert);
    var exported = meta.serializeType(meta.moduleExportsType);

    assert.equal(exported, 'Number');
    assert.equal(meta.errors.length, 1, 'expected one error');

    var err = meta.errors[0];
    assert.equal(err.type, 'jsig.sub-type.type-class-mismatch');
    assert.equal(err.expected, 'Number');
    assert.equal(err.actual, 'String');
    assert.equal(err.line, 3);

    assert.end();
});

JSIGSnippet.test('can export an anonymous string literal', {
    snippet: function m() {/*
        module.exports = '';
    */},
    header: function h() {/*
        export default String
    */}
}, function t(snippet, assert) {
    var meta = snippet.compileAndCheck(assert);
    var exported = meta.serializeType(meta.moduleExportsType);

    assert.equal(exported, 'String');

    assert.end();
});

JSIGSnippet.test('catches mis-export error for literal', {
    snippet: function m() {/*
        module.exports = '';
    */},
    header: function h() {/*
        export default Number
    */}
}, function t(snippet, assert) {
    var meta = snippet.compile(assert);
    var exported = meta.serializeType(meta.moduleExportsType);

    assert.equal(exported, 'Number');
    assert.equal(meta.errors.length, 1, 'expected one error');

    var err = meta.errors[0];
    assert.equal(err.type, 'jsig.sub-type.type-class-mismatch');
    assert.equal(err.expected, 'Number');
    assert.equal(err.actual, 'String');
    assert.equal(err.line, 1);

    assert.end();
});

JSIGSnippet.test('Export must exist', {
    snippet: function m() {/*
        var foo = 4;
    */},
    header: function h() {/*
        export default Number
    */}
}, function t(snippet, assert) {
    var meta = snippet.compile(assert);
    var exported = meta.serializeType(meta.moduleExportsType);

    assert.equal(exported, 'Number');
    assert.equal(meta.errors.length, 1, 'expected one error');

    var err = meta.errors[0];
    assert.equal(err.type, 'jsig.verify.missing-exports');
    assert.equal(err.expected, 'Number');
    assert.equal(err.actual, '<MissingType>');
    assert.equal(err.fileName, 'snippet.js');

    assert.end();
});

JSIGSnippet.test('can export an anonymous object', {
    snippet: function m() {/*
        module.exports = { a: '' };
    */},
    header: function h() {/*
        export default { a: String }
    */}
}, function t(snippet, assert) {
    var meta = snippet.compileAndCheck(assert);
    var exported = meta.serializeType(meta.moduleExportsType);

    assert.equal(exported, '{ a: String }');

    assert.end();
});

JSIGSnippet.test('can use exports.foo', {
    snippet: function m() {/*
        exports.a = '';
    */},
    header: function h() {/*
        export default { a: String }
    */}
}, function t(snippet, assert) {
    var meta = snippet.compileAndCheck(assert);
    var exported = meta.serializeType(meta.moduleExportsType);

    assert.equal(exported, '{ a: String }');

    assert.end();
});

JSIGSnippet.test('assigning exports field to non-object', {
    snippet: function m() {/*
        exports.a = '';
    */},
    header: function h() {/*
        export default Number
    */}
}, function t(snippet, assert) {
    var meta = snippet.compile(assert);
    var exported = meta.serializeType(meta.moduleExportsType);

    assert.equal(exported, 'Number');
    assert.equal(meta.errors.length, 2, 'found two errors');

    var err1 = meta.errors[0];
    assert.equal(err1.type, 'jsig.verify.accessing-field-on-non-object');
    assert.equal(err1.fieldName, 'a');
    assert.equal(err1.nonObjectType, 'Number');
    assert.equal(err1.line, 1);

    var err2 = meta.errors[1];
    assert.equal(err2.type, 'jsig.verify.missing-exports');
    assert.equal(err2.expected, 'Number');
    assert.equal(err2.actual, '<MissingType>');

    assert.end();
});

// TODO: not assiging exports.foo at all
// TODO: adding the wrong field to exports
// TODO: assigning a subset of exports fields
