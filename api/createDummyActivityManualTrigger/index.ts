import { Context, HttpRequest } from "@azure/functions";
import createDummyActivity from "../createDummyActivity";
import { buildResponseContext } from "../lib/context";

export default async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    const auth = req.headers["authorization"];
    if (!auth) throw new Error();

    const creds = Buffer.from(auth.split(" ")[1], "base64")
      .toString()
      .split(":");
    const username = creds[0];
    const password = creds[1];

    if (username !== process.env.cronUser && password !== process.env.cronPass)
      throw new Error();
  } catch (error) {
    context.res = buildResponseContext({ status: 401, message: error.message });
    return;
  }

  createDummyActivity(context);

  context.res = buildResponseContext({ data: { jobStarted: true } });
}
