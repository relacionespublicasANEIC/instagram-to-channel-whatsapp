import { createURLWithParams } from "./lib/_utils.js";
const { INSTAGRAM_CLIENT_ID, BASE_URL } = process.env;
export async function GET() {
    return new Response(createURLWithParams("https://api.instagram.com/oauth/authorize", {
        client_id: INSTAGRAM_CLIENT_ID,
        redirect_uri: `https://${BASE_URL}/api/v1/auth`,
        scope: "user_profile,user_media",
        response_type: "code"
    }));
};