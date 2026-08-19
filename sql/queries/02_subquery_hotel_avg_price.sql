SELECT HotelID, HotelName
FROM HOTEL
WHERE HotelID IN (
    SELECT HotelID
    FROM ROOM
    GROUP BY HotelID
    HAVING AVG(PricePerNight) >
        (SELECT AVG(PricePerNight) FROM ROOM)
);
