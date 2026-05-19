export type Tweet = {
  id: string;
  text: string;
  createdAt: string;
  likeCount: number;
  retweetCount: number;
  replyCount: number;
};

export type NotableTweet = {
  text: string;
  reason: string;
};

export type Sentiment = "positive" | "neutral" | "negative" | "mixed";

export type TwitterDigestResult = {
  username: string;
  tweetCount: number;
  summary: string;
  mainTopics: string[];
  writingStyle: string;
  sentiment: Sentiment;
  engagementInsight: string;
  notableTweets: NotableTweet[];
};
