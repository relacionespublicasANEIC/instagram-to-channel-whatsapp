import { postFetch, createURLWithParams, jsonFetch } from "./lib/_utils.js";
import { kv as database } from "@vercel/kv";
import InstagramClient from "./lib/_InstagramClient.js";
const { INSTAGRAM_CLIENT_ID, INSTAGRAM_CLIENT_SECRET, BASE_URL, DATABASE_HASHNAME } = process.env;

async function getLongLivedAccessTokenFromAuthorizationCode(authCode) {
    //First, get short live access token.
    let shortLive = await postFetch("https://api.instagram.com/oauth/access_token", {
        client_id: INSTAGRAM_CLIENT_ID,
        client_secret: INSTAGRAM_CLIENT_SECRET,
        grant_type: "authorization_code",
        redirect_uri: `https://${BASE_URL}/api/v1/auth`,
        code: authCode
    });

    //Second, get long live access token.
    let longLive = await jsonFetch(createURLWithParams("https://graph.instagram.com/access_token", {
        grant_type: "ig_exchange_token",
        client_secret: INSTAGRAM_CLIENT_SECRET,
        access_token: shortLive.access_token
    }));

    return longLive;
};

export default async function handler(req, res) {
    let { access_token } = await getLongLivedAccessTokenFromAuthorizationCode(req.query.code);
    let data = await new InstagramClient(access_token).getUserMedia();
    let lastMedia = data.find((e) => (e.media_type === "IMAGE" || e.media_type === "CAROUSEL_ALBUM"));
    let userInfo = { token: { access_token, creationDate: new Date().toISOString() }, lastMedia };
    await database.hset(DATABASE_HASHNAME, { [access_token]: userInfo });
    return res.send(userInfo);
};