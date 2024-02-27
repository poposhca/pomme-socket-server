import RedisAdapter from "./redis/redis";
import { REDIS_URL } from "../config";

const adapters = {
    dbAdapter: new RedisAdapter({
        url: REDIS_URL
    }),
};

export default adapters;
