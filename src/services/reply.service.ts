import { Tweet } from "@prisma/client";
import { HttpError } from "../errors/http.error";
import { CreateReply } from "../dtos/create-reply.dto";
import { TweetUser } from "../dtos/tweetUser.dto";
import prismaConnection from "../database/prisma.connection";

export class ReplyService {
  public async createReply(input: CreateReply): Promise<Tweet> {
    const tweetFound = await prismaConnection.tweet.findFirst({
      where: { id: input.tweetId },
    });

    if (!tweetFound) throw new HttpError("Tweet não encontrado", 404);

    const createTweetReply = await prismaConnection.tweet.create({
      data: {
        userId: input.userId,
        content: input.content,
        type: "R",
      },
    });

    await prismaConnection.reply.create({
      data: {
        tweetOriginalId: input.tweetId,
        tweetReplyId: createTweetReply.id,
      },
    });

    return createTweetReply;
  }

  public async getReplyById(input: TweetUser): Promise<Tweet> {
    const replyFound = await prismaConnection.tweet.findFirst({
      where: { userId: input.userId, id: input.tweetId, type: "R" },
    });

    if (!replyFound) throw new HttpError("Reply não encontrado", 404);

    return replyFound;
  }

  public async deleteReply(input: TweetUser): Promise<Tweet> {
  const replyRelation = await prismaConnection.reply.findFirst({
    where: {
      OR: [
        { id: input.tweetId },
        { tweetReplyId: input.tweetId },
      ],
    },
  });

  if (!replyRelation) {
    throw new HttpError("Reply não encontrado", 404);
  }

  const replyTweet = await prismaConnection.tweet.findFirst({
    where: {
      id: replyRelation.tweetReplyId,
      userId: input.userId,
      type: "R",
    },
  });

  if (!replyTweet) {
    throw new HttpError("Reply não encontrado", 404);
  }

  await prismaConnection.reply.deleteMany({
    where: {
      OR: [
        { id: replyRelation.id },
        { tweetReplyId: replyRelation.tweetReplyId },
        { tweetOriginalId: replyRelation.tweetReplyId },
      ],
    },
  });

  await prismaConnection.like.deleteMany({
    where: {
      tweetId: replyRelation.tweetReplyId,
    },
  });

  const replyDeleted = await prismaConnection.tweet.delete({
    where: {
      id: replyRelation.tweetReplyId,
    },
  });

  return replyDeleted;
}
}
