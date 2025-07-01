// tokenUtils.js
const jwt = require('jsonwebtoken');

// Lista negra: almacena tokens que han sido revocados
// IMPORTANTE: En producción, usa una solución persistente (por ejemplo, Redis)
const tokenBlacklist = new Set();

/**
 * Calcula el tiempo que le queda de validez a un token en segundos.
 * Asume que el token tiene el campo "exp" (expiración) en su payload.
 *
 * @param {string} token - El JWT token.
 * @returns {number} - Tiempo en segundos hasta que el token expire.
 */
function getTokenTTL(token) {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) {
      return 0;
    }
    const currentTime = Math.floor(Date.now() / 1000);
    const ttl = decoded.exp - currentTime;
    return ttl > 0 ? ttl : 0;
  } catch (error) {
    return 0;
  }
}

module.exports = { tokenBlacklist, getTokenTTL };
