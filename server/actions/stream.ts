"use server";

import { redis, streamClient } from "@/utils/stream-client";

export async function CreateUserAndToken(userId: string, name: string) {
  const user = await streamClient.upsertUsers([
    {
      id: userId,
      name,
    },
  ]);
  console.log("user generated", user);
  const token = streamClient.generateUserToken({
    user_id: userId,
    validity_in_seconds: 60 * 60 * 24 * 30, // 30 day
  });
  await redis.set(`${userId}`, token);
  return { user, token };
}

export async function GetToken(userId: string) {
//   await CreateUserAndToken(userId, userId);
  const token = await redis.get(`${userId}`);
  return token as string;
}
