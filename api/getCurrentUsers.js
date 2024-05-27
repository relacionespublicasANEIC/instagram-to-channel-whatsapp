import { kv as database } from "@vercel/kv";
const { DATABASE_HASHNAME } = process.env;
export default async function handler(req, res) {
    return res.send(await database.hgetall(DATABASE_HASHNAME));
};