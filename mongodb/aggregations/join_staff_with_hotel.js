db.staff.aggregate([
  {
    $lookup: {
      from: "hotels",
      localField: "hotelid",
      foreignField: "hotelid",
      as: "hotel_info"
    }
  }
]);
