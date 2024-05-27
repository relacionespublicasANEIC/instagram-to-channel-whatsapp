export default class WhatsAppClient {
    constructor (authKey) {
        this.authKey = authKey;
    }

    async makeRequest(url, init = {}) {
        let headers = {
            "accept": "application/json",
            "content-type": "application/json",
            "authorization": "Bearer " + this.authKey
        }

        let n = Object.assign({ headers }, init);
        let a = await fetch(url, n);
        let b = await a.json();
        return b;
    }

    async checkAlive() {
        let d = await this.makeRequest("https://gate.whapi.cloud/health?wakeup=true&channel_type=web");
        return (d.status.text === "AUTH");
    }

    async sendTextMessage(to, message) {
        let info = { to, body: message, no_link_preview: false };
        let res = await this.makeRequest("https://gate.whapi.cloud/messages/text", { method: "POST", body: JSON.stringify(info) });
        return res.sent;
    }

    async sendMessageWithURLImage(to, message, imageURL) {
        let info = { to, caption: message, media: imageURL };
        let res = await this.makeRequest("https://gate.whapi.cloud/messages/image", { method: "POST", body: JSON.stringify(info) });
        return res.sent;
    }

}