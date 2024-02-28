# Use the latest version of Redis
FROM redis:7

# Expose Redis port
EXPOSE 6379

WORKDIR /redis

# Run Redis server
CMD ["sh", "-c", "echo 'requirepass mypassword' >> /redis/redis.conf && redis-server /redis/redis.conf"]
