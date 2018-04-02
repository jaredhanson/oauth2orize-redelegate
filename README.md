# oauth2orize-redelegate

Token redelegation and chaining exchange for [OAuth2orize](https://github.com/jaredhanson/oauth2orize).

This exchange is used by a resource server to exchange an access token it has
recieved from a client for a derivative token for use with another resource
server.  This scenario facilitiates service chaining, in which one service needs
to communicate with another service in order to fulfill the original request.

Status:
[![Version](https://img.shields.io/npm/v/oauth2orize-redelegate.svg?label=version)](https://www.npmjs.com/package/oauth2orize-redelegate)
[![Build](https://img.shields.io/travis/jaredhanson/oauth2orize-redelegate.svg)](https://travis-ci.org/jaredhanson/oauth2orize-redelegate)
[![Quality](https://img.shields.io/codeclimate/github/jaredhanson/oauth2orize-redelegate.svg?label=quality)](https://codeclimate.com/github/jaredhanson/oauth2orize-redelegate)
[![Coverage](https://img.shields.io/coveralls/jaredhanson/oauth2orize-redelegate.svg)](https://coveralls.io/r/jaredhanson/oauth2orize-redelegate)
[![Dependencies](https://img.shields.io/david/jaredhanson/oauth2orize-redelegate.svg)](https://david-dm.org/jaredhanson/oauth2orize-redelegate)


## Sponsorship

OAuth2orize is open source software.  Ongoing development is made possible by
generous contributions from [individuals and corporations](https://github.com/jaredhanson/oauth2orize/blob/master/SPONSORS.md).
To learn more about how you can help keep this project financially sustainable,
please visit Jared Hanson's page on [Patreon](https://www.patreon.com/jaredhanson).

## Install

```bash
$ npm install oauth2orize-redelegate
```

## Usage

#### Register Exchange

Register the exchange with a `Server` instance and implement the `issue`
callback:

```js
var redelegate = require('oauth2orize-redelegate').exchange.redelegate;

server.exchange('urn:ietf:params:oauth:grant_type:redelegate', redelegate(function(client, token, scope, done) {
  // TODO:
  // 1. Verify the access token.
  // 2. Ensure that the token is being exchanged by a resource server for which
  //    it is intended.
  // 3. Issue a deriviative token with equal or lesser scope.
});
```

## Considerations

#### Specification

This module is implemented based on [A Method of Bearer Token Redelegation and Chaining for OAuth 2](https://tools.ietf.org/html/draft-richer-oauth-chain-00),
draft version 00.  As a draft, the specification remains a work-in-progress and
is *not* final.  The specification is under discussion within the [OAuth Working Group](https://datatracker.ietf.org/wg/oauth/about/)
of the [IETF](https://www.ietf.org/).  Implementers are encouraged to track the
progress of this specification and update implementations as necessary.
Furthermore, the implications of relying on non-final specifications should be
understood prior to deployment.

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2014-2018 Jared Hanson <[http://jaredhanson.net/](http://jaredhanson.net/)>
