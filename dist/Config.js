"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Config {
    constructor() {
        this.port = process.env.PORT || '4000';
        this.facebook = {
            appId: process.env.FACEBOOK_APPID,
            secret: process.env.FACEBOOK_SECRET
        };
        this.google = {
            clientId: process.env.GOOGLE_CLIENTID,
            clientSecret: process.env.GOOGLE_CLIENTSECRET
        };
    }
}
exports.default = Config;
//# sourceMappingURL=Config.js.map