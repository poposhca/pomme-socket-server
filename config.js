"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CORS_ORIGIN = exports.PORT = void 0;
exports.PORT = Number(process.env.PORT) || 8080;
exports.CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
