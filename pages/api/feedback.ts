import faunadb from "faunadb";

import { NowRequest, NowResponse } from "@vercel/node";

export default (request: NowRequest, response: NowResponse) => {
  if (request.method !== "POST") {
    return response.status(405).json({
      status: 405,
      message: `Error: Method ${request.method} not allowed.`,
    });
  }

  const { emoji, emojiId, page } = request.body;

  if (!emoji || !emojiId || !page) {
    return response.status(400).json({
      status: 400,
      message:
        "Error: Request body missing required `emoji`, `emojiId`, and `page` keys.",
    });
  }

  const client = new faunadb.Client({
    secret: process.env.FAUNA_SECRET,
  });
  const query = faunadb.query;

  client
    .query(
      query.Create(query.Collection("feedback"), {
        data: { emoji, emojiId, page },
      })
    )
    .then(() => {
      return response
        .status(200)
        .json({ status: 200, message: "Feedback submitted." });
    })
    .catch(() => {
      return response.status(500).json({
        status: 500,
        message: "Error: Unable to submit feedback due to database response.",
      });
    });
};
