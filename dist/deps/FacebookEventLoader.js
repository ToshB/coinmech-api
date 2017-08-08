"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = require("node-fetch");
class FacebookEventLoader {
    constructor(config) {
        this.accessToken = `${config.facebook.appId}|${config.facebook.secret}`;
    }
    loadEvents() {
        return node_fetch_1.default(`https://graph.facebook.com/v2.9/oslopinball/events?access_token=${this.accessToken}`)
            .then((result) => {
            return result.json()
                .then(data => {
                if (!result.ok) {
                    console.error(data);
                    throw new Error(`${result.status} - ${result.statusText}`);
                }
                return data;
            });
        }, (err) => {
            console.error(err);
            throw new Error(`Error getting events: ${err.message}`);
        });
    }
}
exports.default = FacebookEventLoader;
//# sourceMappingURL=FacebookEventLoader.js.map