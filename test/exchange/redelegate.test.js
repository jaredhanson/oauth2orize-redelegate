var chai = require('chai')
  , redelegate = require('../../lib/exchange/redelegate');


describe('exchange.redelegate', function() {
  
  it('should be named redelegate', function() {
    expect(redelegate(function(){}).name).to.equal('redelegate');
  });
  
  it('should throw if constructed without an issue callback', function() {
    expect(function() {
      redelegate();
    }).to.throw(TypeError, 'oauth2orize-redelegate exchange requires an issue callback');
  });
  
  describe('issuing an access token', function() {
    var response, err;

    before(function(done) {
      function issue(client, token, done) {
        if (client.id == 'c123' && token == 'shh') {
          return done(null, 's3cr1t')
        }
        return done(new Error('something is wrong'));
      }
      
      chai.connect.use(redelegate(issue))
        .req(function(req) {
          req.user = { id: 'c123' };
          req.body = { token: 'shh' };
        })
        .end(function(res) {
          response = res;
          done();
        })
        .dispatch();
    });
    
    it('should respond with headers', function() {
      expect(response.getHeader('Content-Type')).to.equal('application/json');
      expect(response.getHeader('Cache-Control')).to.equal('no-store');
      expect(response.getHeader('Pragma')).to.equal('no-cache');
    });
    
    it('should respond with body', function() {
      expect(response.body).to.equal('{"access_token":"s3cr1t","token_type":"Bearer"}');
    });
  });
  
  describe('issuing an access token and params', function() {
    var response, err;

    before(function(done) {
      function issue(client, token, done) {
        if (client.id == 'c123' && token == 'shh') {
          return done(null, 's3cr1t', { 'expires_in': 3600 })
        }
        return done(new Error('something is wrong'));
      }
      
      chai.connect.use(redelegate(issue))
        .req(function(req) {
          req.user = { id: 'c123' };
          req.body = { token: 'shh' };
        })
        .end(function(res) {
          response = res;
          done();
        })
        .dispatch();
    });
    
    it('should respond with headers', function() {
      expect(response.getHeader('Content-Type')).to.equal('application/json');
      expect(response.getHeader('Cache-Control')).to.equal('no-store');
      expect(response.getHeader('Pragma')).to.equal('no-cache');
    });
    
    it('should respond with body', function() {
      expect(response.body).to.equal('{"access_token":"s3cr1t","expires_in":3600,"token_type":"Bearer"}');
    });
  });
  
  describe('issuing an access token and params with token type', function() {
    var response, err;

    before(function(done) {
      function issue(client, token, done) {
        if (client.id == 'c123' && token == 'shh') {
          return done(null, 's3cr1t', { 'token_type': 'foo', 'expires_in': 3600 })
        }
        return done(new Error('something is wrong'));
      }
      
      chai.connect.use(redelegate(issue))
        .req(function(req) {
          req.user = { id: 'c123' };
          req.body = { token: 'shh' };
        })
        .end(function(res) {
          response = res;
          done();
        })
        .dispatch();
    });
    
    it('should respond with headers', function() {
      expect(response.getHeader('Content-Type')).to.equal('application/json');
      expect(response.getHeader('Cache-Control')).to.equal('no-store');
      expect(response.getHeader('Pragma')).to.equal('no-cache');
    });
    
    it('should respond with body', function() {
      expect(response.body).to.equal('{"access_token":"s3cr1t","token_type":"foo","expires_in":3600}');
    });
  });
  
});
