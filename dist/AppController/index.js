"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const google = require("googleapis");
const plus = google.plus('v1');
const OAuth2 = google.auth.OAuth2;
class ApiRouter {
    constructor(deps) {
        this.router = express_1.Router();
        this.oauth2Client = new OAuth2(deps.config.google.clientId, deps.config.google.clientSecret, 'http://localhost:4000/oauth2callback');
        const scopes = [
            'openid', 'profile', 'email'
        ];
        this.router.get('/', (_req, res) => {
            res.render('index', { title: 'Login', message: 'Login' });
        });
        this.router.get('/auth', (_req, res) => {
            const url = this.oauth2Client.generateAuthUrl({
                scope: scopes
            });
            res.redirect(url);
        });
        this.router.get('/oauth2callback', (req, res) => {
            const code = req.query.code;
            this.oauth2Client.getToken(code, (err, tokens) => {
                if (err) {
                    console.error(err);
                    return res.send({ error: err });
                }
                this.oauth2Client.setCredentials(tokens);
                return plus.people.get({
                    userId: 'me',
                    auth: this.oauth2Client
                }, (err, data) => {
                    if (err) {
                        console.error(err);
                        return res.send({ error: err });
                    }
                    return res.send({
                        query: req.query,
                        tokens: tokens,
                        data
                    });
                });
            });
        });
    }
}
exports.default = ApiRouter;
//# sourceMappingURL=index.js.map