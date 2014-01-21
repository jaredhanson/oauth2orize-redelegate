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
  
  describe('issuing an access token based on scope', function() {
    var response, err;

    before(function(done) {
      function issue(client, token, scope, done) {
        if (client.id == 'c123' && token == 'shh' && scope.length == 1 && scope[0] == 'read') {
          return done(null, 's3cr1t')
        }
        return done(new Error('something is wrong'));
      }
      
      chai.connect.use(redelegate(issue))
        .req(function(req) {
          req.user = { id: 'c123' };
          req.body = { token: 'shh', scope: 'read' };
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
  
  describe('issuing an access token based on array of scopes', function() {
    var response, err;

    before(function(done) {
      function issue(client, token, scope, done) {
        if (client.id == 'c123' && token == 'shh' && scope.length == 2 && scope[0] == 'read' && scope[1] == 'write') {
          return done(null, 's3cr1t')
        }
        return done(new Error('something is wrong'));
      }
      
      chai.connect.use(redelegate(issue))
        .req(function(req) {
          req.user = { id: 'c123' };
          req.body = { token: 'shh', scope: 'read write' };
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
  
  describe('not issuing an access token', function() {
    var err;

    before(function(done) {
      function issue(client, token, done) {
        return done(null, false)
      }
      
      chai.connect.use(redelegate(issue))
        .req(function(req) {
          req.user = { id: 'c123' };
          req.body = { token: 'shh' };
        })
        .next(function(e) {
          err = e;
          done();
        })
        .dispatch();
    });
    
    it('should error', function() {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.constructor.name).to.equal('TokenError');
      expect(err.message).to.equal('Invalid token');
      expect(err.code).to.equal('invalid_grant');
      expect(err.status).to.equal(403);
    });
  });
  
  describe('handling a request without a token', function() {
    var err;

    before(function(done) {
      function issue(client, token, done) {
        return done(null, false)
      }
      
      chai.connect.use(redelegate(issue))
        .req(function(req) {
          req.user = { id: 'c123' };
          req.body = {};
        })
        .next(function(e) {
          err = e;
          done();
        })
        .dispatch();
    });
    
    it('should error', function() {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.constructor.name).to.equal('TokenError');
      expect(err.message).to.equal('Missing required parameter: token');
      expect(err.code).to.equal('invalid_request');
      expect(err.status).to.equal(400);
    });
  });
  
  describe('encountering an error while issuing an access token', function() {
    var err;

    before(function(done) {
      function issue(client, token, done) {
        return done(new Error('something went wrong'));
      }
      
      chai.connect.use(redelegate(issue))
        .req(function(req) {
          req.user = { id: 'c123' };
          req.body = { token: 'shh' };
        })
        .next(function(e) {
          err = e;
          done();
        })
        .dispatch();
    });
    
    it('should error', function() {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.message).to.equal('something went wrong');
    });
  });
  
  describe('throwing an exception while issuing an access token', function() {
    var err;

    before(function(done) {
      function issue(client, token, done) {
        throw new Error('something went horribly wrong');
      }
      
      chai.connect.use(redelegate(issue))
        .req(function(req) {
          req.user = { id: 'c123' };
          req.body = { token: 'shh' };
        })
        .next(function(e) {
          err = e;
          done();
        })
        .dispatch();
    });
    
    it('should error', function() {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.message).to.equal('something went horribly wrong');
    });
  });
  
  describe('handling a request in which the body was not parsed', function() {
    var err;

    before(function(done) {
      function issue(client, token, done) {
        return done(null, false)
      }
      
      chai.connect.use(redelegate(issue))
        .req(function(req) {
          req.user = { id: 'c123' };
        })
        .next(function(e) {
          err = e;
          done();
        })
        .dispatch();
    });
    
    it('should error', function() {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.message).to.equal('OAuth2orize requires body parsing. Did you forget app.use(express.bodyParser())?');
    });
  });
  
});
