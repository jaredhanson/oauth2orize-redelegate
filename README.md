# oauth2orize-redelegate

[![Build](https://travis-ci.org/jaredhanson/oauth2orize-redelegate.png)](https://travis-ci.org/jaredhanson/oauth2orize-redelegate)
[![Coverage](https://coveralls.io/repos/jaredhanson/oauth2orize-redelegate/badge.png)](https://coveralls.io/r/jaredhanson/oauth2orize-redelegate)
[![Quality](https://codeclimate.com/github/jaredhanson/oauth2orize-redelegate.png)](https://codeclimate.com/github/jaredhanson/oauth2orize-redelegate)
[![Dependencies](https://david-dm.org/jaredhanson/oauth2orize-redelegate.png)](https://david-dm.org/jaredhanson/oauth2orize-redelegate)
[![Tips](http://img.shields.io/gittip/jaredhanson.png)](https://www.gittip.com/jaredhanson/)


Token redelegation exchange for [OAuth2orize](https://github.com/jaredhanson/oauth2orize).

This exchange is used by a resource server to exchange an access token it has
recieved from a client for a derivative token for use with another resource
server.  This scenario facilitiates service chaining, in which one service needs
to communicate with another service in order to fulfill the original request.

## Install

    $ npm install oauth2orize-redelegate

## Usage

#### Register Exchange

Register the exchange with an OAuth 2.0 server.

```javascript
var redelegate = require('oauth2orize-redelegate').exchange.redelegate;

server.exchange('urn:ietf:params:oauth:grant_type:redelegate', redelegate(function(client, token, scope, done) {
  AccessToken.verify(token, function(err, t) {
    if (err) { return done(err); }

    var random = utils.uid(256);
    var at = new AccessToken(random, t.userId, client.id, t.scope);
    at.save(function(err) {
      if (err) { return done(err); }
      return done(null, random);
    });
  });
});
```

## Implementation

This module is implemented based on [A Method of Bearer Token Redelegation and Chaining for OAuth 2](http://tools.ietf.org/html/draft-richer-oauth-chain-00),
Draft 00.  Implementers are encouraged to track the progress of this
specification and update update their implementations as necessary.
Furthermore, the implications of relying on a non-final draft specification
should be understood prior to deployment.

## Related Modules

- [oauth2orize-chain](https://github.com/jaredhanson/oauth2orize-chain) — chained token exchange

## Tests

    $ npm install
    $ npm test

## Credits

  - [Jared Hanson](http://github.com/jaredhanson)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2014 Jared Hanson <[http://jaredhanson.net/](http://jaredhanson.net/)>
