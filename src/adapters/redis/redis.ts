import { createClient } from "redis";
import {json} from "express";

class RedisAdapter {
    private _dbInstance: any;

    public get dbInstance() {
        return this._dbInstance;
    }

    constructor({ url }: { url: string }) {
        this._dbInstance = createClient({
            url,
        });
    }

    public async connect() {
        try {
            await this.dbInstance.connect();
        } catch (error) {
            throw new Error(`Redis connection error: ${error.message}`);
        }
    }

    public async readStream({ quizStartTime }: { quizStartTime: string }) {
        try {
            const results = await this.dbInstance.xRevRange("socket.io", "+", quizStartTime);
            const messagesFilter = results.filter((result: any) => result.message.type === "3");
            for (const result of messagesFilter) {
                const data = JSON.parse(result.message.data);
                console.log(`Stream result: ${data.opts.rooms[0]}`);
            }
        } catch (error) {
            throw new Error(`Error reading stream: ${error.message}`);
        }
    }
}

export default RedisAdapter;
