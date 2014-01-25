/**
 * Module dependencies.
 */
var utils = require('../utils')
  , TokenError = require('../errors/tokenerror');


/**
 *
 * References:
 *  - [A Method of Bearer Token Redelegation and Chaining for OAuth 2](http://tools.ietf.org/html/draft-richer-oauth-chain-00)
 *  - [OAuth Service Chaining](http://www.ietf.org/mail-archive/web/oauth/current/msg09859.html)
 *  - [review: draft-richer-oauth-chain-00.txt](http://www.ietf.org/mail-archive/web/oauth/current/msg10185.html)
 *
 */
module.exports = function(options, issue) {
  if (typeof options == 'function') {
    issue = options;
    options = undefined;
  }
  options = options || {};
  
  if (!issue) { throw new TypeError('oauth2orize-redelegate exchange requires an issue callback'); }
  
  var userProperty = options.userProperty || 'user';
  
  // For maximum flexibility, multiple scope spearators can optionally be
  // allowed.  This allows the server to accept clients that separate scope
  // with either space or comma (' ', ',').  This violates the specification,
  // but achieves compatibility with existing client libraries that are already
  // deployed.
  var separators = options.scopeSeparator || ' ';
  if (!Array.isArray(separators)) {
    separators = [ separators ];
  }
  
  return function redelegate(req, res, next) {
    if (!req.body) { return next(new Error('OAuth2orize requires body parsing. Did you forget app.use(express.bodyParser())?')); }
    
    // The 'user' property of `req` holds the authenticated user.  In the case
    // of the token endpoint, the property will contain the OAuth 2.0 client.
    var client = req[userProperty]
      , token = req.body.token
      , scope = req.body.scope;
      
    if (!token) { return next(new TokenError('Missing required parameter: token', 'invalid_request')); }
  
    if (scope) {
      for (var i = 0, len = separators.length; i < len; i++) {
        var separated = scope.split(separators[i]);
        // only separate on the first matching separator.  this allows for a sort
        // of separator "priority" (ie, favor spaces then fallback to commas)
        if (separated.length > 1) {
          scope = separated;
          break;
        }
      }
      if (!Array.isArray(scope)) { scope = [ scope ]; }
    }
    
    function issued(err, accessToken, params) {
      if (err) { return next(err); }
      if (!accessToken) { return next(new TokenError('Invalid token', 'invalid_grant')); }
      
      var tok = {};
      tok.access_token = accessToken;
      if (params) { utils.merge(tok, params); }
      tok.token_type = tok.token_type || 'Bearer';
      
      var json = JSON.stringify(tok);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'no-store');
      res.setHeader('Pragma', 'no-cache');
      res.end(json);
    }
    
    try {
      var arity = issue.length;
      if (arity == 4) {
        issue(client, token, scope, issued);
      } else { // arity == 3
        issue(client, token, issued);
      }
    } catch (ex) {
      return next(ex);
    }
  };
};
