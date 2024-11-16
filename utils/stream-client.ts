import { StreamClient } from '@stream-io/node-sdk';
import { Redis } from '@upstash/redis'


const apiKey = '5m92fha6xquy';
const secret = 'bdd2wv8vdp7arkzfbarqcknw9v3fftjncrrtuvnqznp4z4uc4cs8639pas83zdf8';
export const streamClient = new StreamClient(apiKey, secret);


export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!
})