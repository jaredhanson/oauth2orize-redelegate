module.exports = function(options, issue) {
  if (typeof options == 'function') {
    issue = options;
    options = undefined;
  }
  options = options || {};
  
  if (!issue) { throw new TypeError('clientAssociation exchange requires an issue callback'); }
  
  var userProperty = options.userProperty || 'user';
  
  return function redelegate(req, res, next) {
  };
};
