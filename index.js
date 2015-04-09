var jsen = require('jsen');

// **
// * validator
// **
// type: the document type in schema
// candidate: the document to check against
// ctx: the context of the check
// {
//    href: the endpoint to hit, eg '/transaction'
//    method: the method, eg 'POST'
// }
// cb(err): callback with err = null on success.
// **

module.exports = function(outer_schema) {
  return function(type, candidate, ctx, cb) {
    var schema = JSON.parse(JSON.stringify(outer_schema));

    // Get required properties from the schema - GROSS
    if (ctx) {
      var links = schema.definitions[type].links.filter(function(link) {
        return (link.href === ctx.href && link.method === ctx.method)
      });

      if (links.length === 0) return cb(new Error("Context is invalid"));

      // Add required properties for the context to the schema
      schema.definitions[type].required = links[0].schema.required;
    }

    var validator = jsen(schema);

    var doc = {};
    doc[type] = candidate;

    if (validator(doc)) {
      cb(null);
    } else {
      cb(new Error("Document is invalid"));
    }
  };
};
