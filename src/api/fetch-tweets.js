import { useWorkspace } from "@/composables";
import { Tweet } from "@/models";
import * as bs58 from "bs58";

const DISCRIMINATOR_LENGTH = 8;
const PUBLIC_KEY_LENGTH = 32;
const TIMESTAMP_LENGTH = 8;
const STRING_LENGTH_PREFIX = 4;

export const authorFilter = (base58AuthorPublicKey) => ({
  memcmp: {
    offset: DISCRIMINATOR_LENGTH,
    bytes: base58AuthorPublicKey,
  },
});

export const topicFilter = (topic) => ({
  memcmp: {
    offset:
      DISCRIMINATOR_LENGTH +
      PUBLIC_KEY_LENGTH +
      TIMESTAMP_LENGTH +
      STRING_LENGTH_PREFIX,
    bytes: bs58.encode(Buffer.from(topic)),
  },
});

export const fetchTweets = async (filters = []) => {
  const { program } = useWorkspace();
  const tweets = await program.value.account.tweet.all(filters);
  return tweets.map((tweet) => {
    return new Tweet(tweet.publicKey, tweet.account);
  });
};
