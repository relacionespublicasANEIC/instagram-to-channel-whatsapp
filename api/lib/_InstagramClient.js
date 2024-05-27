import { jsonFetch, createURLWithParams } from "./_utils.js";

export default class InstagramClient {
    constructor (token) {
        this.token = token;
    }

    async getUserMedia() {
        let res = await jsonFetch(createURLWithParams("https://graph.instagram.com/v20.0/me/media", {
            fields: "id,media,media_type,timestamp,media_url,caption",
            access_token: this.token
        }));

        return res.data;
    }

    async refreshToken() {
        let { access_token } = await jsonFetch(createURLWithParams("https://graph.instagram.com/refresh_access_token", {
            grant_type: "ig_refresh_token",
            access_token: this.token
        }));

        return access_token;
    }
}
