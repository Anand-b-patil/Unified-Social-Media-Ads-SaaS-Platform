/**
 * Authentication Middleware
 */

const { verifyJWT } = require('../utils/jwt');

async function authMiddleware(req, env) {
  const authHeader = req.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  const payload = await verifyJWT(token, env.JWT_SECRET || 'dev-secret');

  if (!payload) {
    return null;
  }

  return {
    userId: payload.userId,
    email: payload.email,
  };
}

function requireAuth(handler) {
  return async (req, env, ctx) => {
    const user = await authMiddleware(req, env);

    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Unauthorized',
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    req.user = user;
    return handler(req, env, ctx);
  };
}

module.exports = {
  authMiddleware,
  requireAuth,
};
