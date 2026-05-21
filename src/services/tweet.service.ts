import { Tweet } from "@prisma/client";
import { ListTweetDTO } from "../dtos/list-tweet.dto";
import { updateTweetDTO } from "../dtos/update-tweet.dto";
import { HttpError } from "../errors/http.error";
import { TweetUser } from "../dtos/tweetUser.dto";
import { CreateTweet } from "../dtos/create-tweet.dto";
import prismaConnection from "../database/prisma.connection";

export class TweetService {
  public async createTweet(input: CreateTweet): Promise<Tweet> {
    const data = await prismaConnection.tweet.create({
      data: {
        userId: input.userId,
        content: input.content,
      },
    });

    return data;
  }

  public async listTweets(input: ListTweetDTO): Promise<any> {
    let limitDefault = 10;
    let pageDefault = 1;

    if (input.limit) {
      limitDefault = Number(input.limit);
    }

    if (input.page) {
      pageDefault = Number(input.page);
    }

    const filter = {
  type: "N" as const,
  OR: [
    {
      userId: input.userId,
    },
    {
      user: {
        following: {
          some: {
            followerId: input.userId,
          },
        },
      },
    },
  ],
};

    const tweets = await prismaConnection.tweet.findMany({
      skip: limitDefault * (pageDefault - 1),
      take: limitDefault,
      orderBy: {
        createdAt: "desc",
      },
      where: filter,
      include: {
        user: true,
        like: true,
        reply: {
          include: {
            reply: {
              include: {
                user: true,
                like: true,
              },
            },
          },
        },
        _count: {
          select: {
            like: true,
            reply: true,
          },
        },
      },
    });

    const count = await prismaConnection.tweet.count({
      where: filter,
    });

    return {
      tweets: tweets,
      pagination: {
        limit: limitDefault,
        page: pageDefault,
        count: count,
        totalPages: Math.ceil(count / limitDefault),
      },
    };
  }

  public async updateTweets(
    input: updateTweetDTO
  ): Promise<Tweet> {
    const tweetBelongsUser =
      await prismaConnection.tweet.findFirst({
        where: {
          id: input.tweetId,
          userId: input.userId,
        },
      });

    if (!tweetBelongsUser) {
      throw new HttpError("Tweet não encontrado", 404);
    }

    const data = await prismaConnection.tweet.update({
      where: {
        id: input.tweetId,
      },
      data: {
        content: input.content,
      },
    });

    return data;
  }

 public async deleteTweets(input: TweetUser): Promise<Tweet> {
  const tweetBelongsUser = await prismaConnection.tweet.findFirst({
    where: {
      id: input.tweetId,
      userId: input.userId,
    },
  });

  if (!tweetBelongsUser) {
    throw new HttpError("Tweet não encontrado", 404);
  }

  await prismaConnection.like.deleteMany({
    where: {
      tweetId: input.tweetId,
    },
  });

  const replies = await prismaConnection.reply.findMany({
    where: {
      tweetOriginalId: input.tweetId,
    },
  });

  for (const reply of replies) {
    await prismaConnection.like.deleteMany({
      where: {
        tweetId: reply.tweetReplyId,
      },
    });

    await prismaConnection.reply.deleteMany({
      where: {
        OR: [
          { tweetReplyId: reply.tweetReplyId },
          { tweetOriginalId: reply.tweetReplyId },
        ],
      },
    });

    await prismaConnection.tweet.deleteMany({
      where: {
        id: reply.tweetReplyId,
      },
    });
  }

  await prismaConnection.reply.deleteMany({
    where: {
      OR: [
        { tweetOriginalId: input.tweetId },
        { tweetReplyId: input.tweetId },
      ],
    },
  });

  const data = await prismaConnection.tweet.delete({
    where: {
      id: input.tweetId,
    },
  });

  return data;
}
}