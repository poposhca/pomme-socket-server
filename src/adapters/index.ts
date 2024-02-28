import RedisAdapter from "./redis/redis";
import { REDIS_HOST, REDIS_PORT, REDIS_USER, REDIS_PASSWORD } from "../config";

const adapters = {
    dbAdapter: new RedisAdapter({
        url: `redis://${REDIS_USER}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`,
    }),
};

export default adapters;
