import { Context, HttpRequest } from "@azure/functions";
import { initDBConnection } from "../lib/azure-cosmosdb-mongodb";
import { Model as Bike } from "../lib/bike.model";
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

  const month = req.query.timeSpan;
  let monthInt: number;
  let nextMonthInt: number;

  if (month == "S") {
    monthInt = 4;
    nextMonthInt = 7;
  } else {
    monthInt = parseInt(month);
    nextMonthInt = monthInt + 1;
  }
  const monthString = monthInt.toString().padStart(2, "0");
  const nextMonthString = nextMonthInt.toString().padStart(2, "0");

  const rides = await Bike.aggregate([
    {
      $match: {
        date: {
          $gte: new Date(`${tRunYear}-${monthString}-01`),
          $lt: new Date(`${tRunYear}-${nextMonthString}-01`),
        },
      },
    },

    {
      $group: {
        _id: { name: "$name", url: "$url" },
        totalAmount: { $sum: "$distance" },
        //totalAmount: { $sum: { $round: [ "$distance", 2 ] } }, (rundet die Einzelzahlen, wenn dann das Endergebnis runden)
        elevgain: { $sum: "$elevgain" },
        count: { $sum: 1 },
      },
    },
    { $sort: { totalAmount: -1 } },
  ]);

  context.res = buildResponseContext({ data: rides });
}
