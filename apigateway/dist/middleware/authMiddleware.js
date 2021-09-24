"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const access_token_1 = require("../config/access_token");
const jwt_1 = require("./jwt");
const EexpirtationStatus_1 = require("../models/EexpirtationStatus");
/**
 * Express middleware, checks for a valid JSON Web Token and returns 401 Unauthorized if one isn't found.
 */
function authMiddleware(request, response, next) {
    const unauthorized = (message) => response.status(401).json({
        ok: false,
        status: 401,
        message: message,
    });
    const requestHeader = "X-JWT-Token";
    const responseHeader = "X-Renewed-JWT-Token";
    const header = request.header(requestHeader);
    if (!header) {
        unauthorized(`Required ${requestHeader} header not found.`);
        return;
    }
    const decodedSession = (0, jwt_1.decodeSession)(access_token_1.accessTokenSecret, header);
    if (decodedSession.type === "integrity-error" || decodedSession.type === "invalid-token") {
        unauthorized(`Failed to decode or validate authorization token. Reason: ${decodedSession.type}.`);
        return;
    }
    const expiration = (0, jwt_1.checkExpirationStatus)(decodedSession.session);
    if (expiration === EexpirtationStatus_1.EexpirationStatus.expired) {
        unauthorized(`Authorization token has expired. Please create a new authorization token.`);
        return;
    }
    let session;
    if (expiration === EexpirtationStatus_1.EexpirationStatus.grace) {
        // Automatically renew the session and send it back with the response
        const { token, expires, issued } = (0, jwt_1.encodeSession)(access_token_1.accessTokenSecret, decodedSession.session);
        session = Object.assign(Object.assign({}, decodedSession.session), { expires: expires, issued: issued });
        response.setHeader(responseHeader, token);
    }
    else {
        session = decodedSession.session;
    }
    // Set the session on response.locals object for routes to access
    response.locals = Object.assign(Object.assign({}, response.locals), { session: session });
    // Request has a valid or renewed session. Call next to continue to the authenticated route handler
    next();
}
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=authMiddleware.js.map