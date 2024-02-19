import RedisAdapter from "./redis/redis";

const adapters = {
    dbAdapter: new RedisAdapter({
        url: "redis://localhost:6379",
    }),
};

export default adapters;
