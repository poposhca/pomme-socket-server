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

    public async readStream({ quizStartTime }: { quizStartTime: number }) {
        try {
            const results = await this.dbInstance.xRevRange("socket.io", "+", "-");
            for (const result of results) {
                console.log(`Stream result: ${JSON.stringify(result)}`);
            }
        } catch (error) {
            throw new Error(`Error reading stream: ${error.message}`);
        }
    }
}

export default RedisAdapter;
