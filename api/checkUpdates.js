import { kv as database } from "@vercel/kv";
import WhatsAppClient from "whapi-cloud-client";
import InstagramClient from "./lib/_InstagramClient.js";
const { WHAPI_CLOUD_API_KEY, WHATSAPP_CHANNEL_ID, DATABASE_HASHNAME } = process.env;

export default async function handler(req, res) {
    let allUsers = Object.entries(await database.hgetall(DATABASE_HASHNAME));
    let report = {};

    for (let [key, { token, lastMedia }] of allUsers) {
        let userMedia = await new InstagramClient(key).getUserMedia();
        let currLastMedia = userMedia.find((e) => e.media_type === "IMAGE" || e.media_type === "CAROUSEL_ALBUM");
        if (currLastMedia.id === lastMedia.id) { report[key] = false; continue; };

        // There is a new post in the instagram account.
        let whatsappClient = new WhatsAppClient(WHAPI_CLOUD_API_KEY);
        await whatsappClient.sendMessageWithURLImage(WHATSAPP_CHANNEL_ID, currLastMedia?.caption, currLastMedia.media_url);
        await database.hset(DATABASE_HASHNAME, { [key]: { token, lastMedia: currLastMedia } });
        report[key] = true;
    }

    return res.send(report);
}
