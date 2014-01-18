/* global describe, it, expect */

var redelegate = require('..');

describe('oauth2orize-redelegate', function() {
  
  it('should export exchanges', function() {
    expect(redelegate.exchange).to.be.an('object');
    expect(redelegate.exchange.redelegate).to.be.a('function');
  });
  
});
