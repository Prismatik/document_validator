var assert = require('assert');
var fs = require('fs');
var specimen = JSON.parse(fs.readFileSync('./test/example_transaction.json'));
var schema = JSON.parse(fs.readFileSync('./test/example_schema.json'));

var validator = require('../index.js')(schema);

describe('validator', function(){
  it('should validate a valid document', function(done) {
    validator('transaction', specimen, {href: '/transaction', method: 'POST'}, function(err) {
      assert.deepEqual(err, null);
      done();
    });
  });

  it("shouldn't validate an invalid document", function(done) {
    validator('transaction', {whatever: 'whatever'}, {href: '/transaction', method: 'POST'}, function(err) {
      assert.deepEqual(err, new Error("Document is invalid"))
      done();
    });
  })

  it("shouldn't validate a document with a context that doesn't exist or is invalid", function(done) {
    validator('transaction', specimen, {href: '/transaction', method: 'GET'}, function(err) {
      assert.deepEqual(err, new Error("Context is invalid"));
      done();
    });
  })

  it("shouldn't validate a document that does not include the required fields", function(done) {
    var invalid = JSON.parse(JSON.stringify(specimen));
    delete invalid.order_id;
    validator('transaction', invalid, {href: '/transaction', method: 'POST'}, function(err) {
      assert.deepEqual(err, new Error("Document is invalid"))
      done();
    });
  });

  it("shouldn't validate a blank object", function(done) {
    validator('transaction', {}, {href: '/transaction', method: 'POST'}, function(err) {
      assert.deepEqual(err, new Error("Document is invalid"))
      done();
    });
  });
});
