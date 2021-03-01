import faunadb from "faunadb";

import { NowRequest, NowResponse } from "@vercel/node";

export default (request: NowRequest, response: NowResponse) => {
  const { emoji, emojiId, page } = request.body;

  if (!emoji || !emojiId || !page) {
    return response
      .status(400)
      .send(
        "Error: Request body missing required `emoji`, `emojiId`, and `page` keys."
      );
  }

  const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET,
  });
  const query = faunadb.query;

  client
    .query(
      query.Create(query.Collection("feedback"), {
        data: { emoji, emojiId, page },
      })
    )
    .catch(function (err) {
      console.log(err);
    });

  response.status(200).send("Feedback submitted.");
};
