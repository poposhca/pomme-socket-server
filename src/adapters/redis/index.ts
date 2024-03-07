import { createClient } from "redis";

class RedisAdapter {
    private _dbInstance: any;

    public get dbInstance() {
        return this._dbInstance;
    }

    constructor({ url }: { url: string }) {
        console.log(`URL: ${url}`);
        const newClient = createClient({
            url,
        });
        newClient.on('connect', () => console.log('Redis Client Connected'))
            .on('ready', () => console.log('Redis Client Ready'))
            .on('error', err => console.log(`Redis Client Error ${err}`))
            .on('reconnecting', () => console.log('Redis Client Reconnecting'));
        this._dbInstance = newClient;
    }

    public async connect() {
        try {
            await this.dbInstance.connect();
        } catch (error) {
            throw new Error(`Redis connection error: ${error.message}`);
        }
    }

    public async writeStream({ streamKey, id, positionMessage }: { streamKey: string, id: string, positionMessage: string }) {
        try {
            const position = { position: positionMessage }
            await this.dbInstance.xAdd(streamKey, '*', position);
        } catch (error) {
            throw new Error(`Error writing to stream: ${error}`);
        }
    }

    public async readStreamLatestEntry({ streamName, quizId, adminId }: { streamName: string, quizId: string, adminId: string }) : Promise<number> {
        try {
            const results = await this.dbInstance.xRevRange(streamName, '+', '-', 'LIMIT', 0, 1);
            if(results.length === 0) {
                return 0;
            }
            const topResult = results[0];
            return topResult.message.position;
        } catch (error) {
            throw new Error(`Error reading stream: ${error}`);
        }
    }
}

export default RedisAdapter;
