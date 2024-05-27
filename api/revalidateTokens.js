import { kv as database } from "@vercel/kv";
import InstagramClient from "./lib/_InstagramClient";
const { DATABASE_HASHNAME } = process.env;

function elapsedDays(ISODateStart, ISODateEnd) {
    const start = new Date(ISODateStart);
    const end = new Date(ISODateEnd);
    return Math.trunc((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
};

export default async function handler(req, res) {
    let allUsers = Object.entries(await database.hgetall(DATABASE_HASHNAME));
    let report = [];

    for (let [key, { token, lastMedia }] of allUsers) {
        const now = new Date().toISOString();
        if (elapsedDays(token.creationDate, now) < 50) { report.push(false); continue };

        let access_token = await new InstagramClient(token).refreshToken();
        let newInfo = { token: { access_token, creationDate: now }, lastMedia };
        await database.hdel(DATABASE_HASHNAME, key);
        await database.hset(DATABASE_HASHNAME, { [access_token]: newInfo })
        report.push(true);
    }

    return res.send(report);
}
