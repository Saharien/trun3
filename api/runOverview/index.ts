import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { initDBConnection } from "../lib/azure-cosmosdb-mongodb";
import { Model as Run } from "../lib/run.model";
import { verifyToken } from "../lib/jwt";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    await verifyToken(req.headers.authorization);
  } catch (error) {
    context.res = { status: 401, body: { message: error.message } };
    return;
  }
  await initDBConnection();

  const runOverview = await Run.aggregate([
    {
      $match: {
        date: {
          $gte: new Date("2021-04-01"),
          $lt: new Date("2021-07-01"),
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

  context.res = {
    body: {
      code: 0,
      data: runOverview,
    },
    headers: {
      "content-type": "application/json",
    },
  };
};

export default httpTrigger;
