"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Config {
    constructor() {
        this.port = process.env.PORT || '4000';
        this.facebook = {
            appId: process.env.FACEBOOK_APPID,
            secret: process.env.FACEBOOK_SECRET
        };
    }
}
exports.default = Config;
//# sourceMappingURL=Config.js.map