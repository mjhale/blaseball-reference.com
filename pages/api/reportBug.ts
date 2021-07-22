import faunadb from "faunadb";

import { VercelRequest, VercelResponse } from "@vercel/node";

export default function reportBugApi(
  request: VercelRequest,
  response: VercelResponse
) {
  if (request.method !== "POST") {
    return response.status(405).json({
      status: 405,
      message: `Error: Method ${request.method} not allowed.`,
    });
  }

  const { bugDescription, page } = request.body;

  if (!bugDescription || !page) {
    return response.status(400).json({
      status: 400,
      message:
        "Error: Request body missing required `bugDescription` and `page` keys.",
    });
  }

  const client = new faunadb.Client({
    secret: process.env.FAUNA_SECRET,
  });
  const query = faunadb.query;

  client
    .query(
      query.Create(query.Collection("bug_reports"), {
        data: { bugDescription, page },
      })
    )
    .then(() => {
      return response
        .status(200)
        .json({ status: 200, message: "Bug report submitted." });
    })
    .catch(() => {
      return response.status(500).json({
        status: 500,
        message: "Error: Unable to submit bug report due to database response.",
      });
    });
}
