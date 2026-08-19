db.invoice.aggregate([
  {
    $group: {
      _id: "$PaymentMode",
      total: { $sum: "$AmountDue" },
      count: { $sum: 1 }
    }
  }
]);
