db.orders.aggregate([
  {
    $lookup: {
      from: "warehouse",
      let: { order_item: "$item", order_qty: "ordered" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$stock_item", "$$order_item"] },
                { $gte: ["$instock", "$$order_qty"] },
              ],
            },
          },
        },
        {
          $project: {
            stock_item: 0,
            _id: 0,
          },
        },
      ],
      as: "stockdata",
    },
  },
]);
