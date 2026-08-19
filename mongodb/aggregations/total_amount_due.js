db.invoice.aggregate([
  {
    $group: {
      _id: null,
      total: { $sum: "$AmountDue" }
    }
  }
]);
