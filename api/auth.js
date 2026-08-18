const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

// CLERK_JWKS_URL set as Railway env var:
// https://workable-anemone-3877.clerk.accounts.dev/.well-known/jwks.json
const JWKS_URI = process.env.CLERK_JWKS_URL;

let client;
function getClient() {
  if (!client && JWKS_URI) {
    client = jwksClient({ jwksUri: JWKS_URI, cache: true, rateLimit: true });
  }
  return client;
}

function getKey(header, callback) {
  const c = getClient();
  if (!c) return callback(new Error('JWKS client not configured'));
  c.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err);
    callback(null, key.getPublicKey());
  });
}

function requireAuth(req, res, next) {
  // Skip auth if CLERK_JWKS_URL not configured (local dev without auth)
  if (!JWKS_URI) return next();

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.slice(7);
  jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
    if (err) {
      console.warn('JWT verify failed:', err.message);
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
}

module.exports = { requireAuth };
