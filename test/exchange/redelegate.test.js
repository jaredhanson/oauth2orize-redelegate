var chai = require('chai')
  , redelegate = require('../../lib/exchange/redelegate');


describe('exchange.redelegate', function() {
  
  it('should be named redelegate', function() {
    expect(redelegate(function(){}).name).to.equal('redelegate');
  });
  
  it('should throw if constructed without an issue callback', function() {
    expect(function() {
      redelegate();
    }).to.throw(TypeError, 'redelegate exchange requires an issue callback');
  });
  
});
