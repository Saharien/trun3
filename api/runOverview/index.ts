import { Context, HttpRequest } from "@azure/functions";
import { initDBConnection } from "../lib/azure-cosmosdb-mongodb";
import { Model as Run } from "../lib/run.model";
import { verifyToken } from "../lib/jwt";
import { buildResponseContext } from "../lib/context";

const tRunYear: number =
  parseInt(process.env.TRunYear) || new Date().getFullYear();

export default async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    await verifyToken(req);
  } catch (error) {
    context.res = buildResponseContext({ status: 401, message: error.message });
    return;
  }
  try {
    await initDBConnection();
  } catch (error) {
    context.res = buildResponseContext({ status: 500, message: error.message });
    return;
  }

  const runOverview = await Run.aggregate([
    {
      $match: {
        date: {
          $gte: new Date(`${tRunYear}-04-01`),
          $lt: new Date(`${tRunYear}-07-01`),
        },
      },
    },

    {
      $group: {
        _id: { month: { $month: "$date" } },
        totalAmount: { $sum: "$distance" },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.month": 1 } },
  ]);

  context.res = buildResponseContext({ data: runOverview });
}
