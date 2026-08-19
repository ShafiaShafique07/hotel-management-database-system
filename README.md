# Hotel Management System — Database Project

A complete database design and implementation project for a **Hotel Management System**, built for the Database Systems course at **COMSATS University Islamabad**.

The project models a real-world hotel operation — rooms, guests, bookings, staff, housekeeping, and billing — using **EER (Enhanced Entity Relationship) modeling**, implements it in both a **relational database (Oracle SQL)** and a **NoSQL database (MongoDB)**, and wraps it with a **GUI application** that performs full CRUD operations.


---

## Table of Contents

- [Overview](#-overview)
- [EER Design Highlights](#-eer-design-highlights)
- [Entities & Relationships](#-entities--relationships)
- [Tech Stack](#-tech-stack)
- [Repository Structure](#-repository-structure)
- [Relational Schema (Oracle SQL)](#-relational-schema-oracle-sql)
- [NoSQL Schema (MongoDB)](#-nosql-schema-mongodb)
- [Sample Queries](#-sample-queries)
- [GUI & CRUD Operations](#-gui--crud-operations)
- [How to Run](#-how-to-run)
- [Screenshots](#-screenshots)
- [Authors](#-authors)

---

## Overview

This system manages the core operations of a hotel:

- **Room management** — room types (Single, Double, Suite), pricing, status tracking, and status history
- **Guest management** — walk-in guests vs. registered members
- **Booking & billing** — reservations, room assignment, and invoicing
- **Staff management** — Housekeeping, Front Desk, and Maintenance roles, each with specialized attributes
- **Housekeeping workflow** — task assignment and tracking per room

The design was first modeled as a hand-drawn **EER diagram**, translated into a **relational schema**, implemented in **Oracle SQL** (Part I), then re-implemented as **document collections in MongoDB** (Parts II–V) with an accompanying **desktop GUI** for CRUD operations and aggregation queries.

---

## EER Design Highlights

The design deliberately uses advanced EER constructs so the schema mirrors real-world hotel operations rather than a flat, over-simplified model:

| Concept | Example in this project |
|---|---|
| **Specialization (disjoint, `d`)** | `ROOM` → `SingleRoom`, `DoubleRoom`, `Suite` |
| **Specialization (disjoint, `d`)** | `GUEST` → `WalkingGuest`, `MemberGuest` |
| **Specialization (disjoint, `d`)** | `STAFF` → `HousekeepingStaff`, `FrontDeskStaff`, `MaintenanceStaff` |
| **Weak entity** | `RoomStatusLog` (partial key `LogID`, identifying relationship with `ROOM`) |
| **Composite attributes** | `Guest.Name` (First/Last), `Hotel.Address` (City/Country), `Room.RoomLocation` (Building/Wing) |
| **Multivalued attributes** | `Hotel.Phone`, `Guest.Phone`, `Staff.Phone` |
| **Derived attributes** | `Hotel.Occupancy`, `Guest.Age`, `MemberGuest.PointsEarned` |
| **M:N relationships** | `ROOM` ↔ `AMENITY` (via `Has_Amenity`), `STAFF` ↔ `HousekeepingTask` (via `Performs_Task`) |
| **1:1 relationship** | `STAFF` ↔ `StaffProfile` (partial participation on `STAFF`, total on `StaffProfile`) |

---

## Entities & Relationships

**Core entities:** `HOTEL`, `ROOM`, `AMENITY`, `RoomStatusLog`, `GUEST`, `BOOKING`, `INVOICE`, `STAFF`, `StaffProfile`, `HousekeepingTask`

**Relationship summary:**

- `HOTEL` — `ROOM` → 1:N
- `ROOM` — `AMENITY` → M:N (`Has_Amenity`)
- `ROOM` — `RoomStatusLog` → 1:N (identifying/weak)
- `GUEST` — `BOOKING` → 1:N (total participation on `GUEST`)
- `BOOKING` — `ROOM` → M:N (`Assign_Room`)
- `BOOKING` — `INVOICE` → 1:1
- `HousekeepingStaff` — `HousekeepingTask` → M:N (`Performs_Task`)
- `MaintenanceStaff` — `ROOM` → M:N (`MaintainsRoom`)
- `FrontDeskStaff` — `BOOKING` → 1:N

---

## Tech Stack

| Layer | Technology |
|---|---|
| Relational Database | Oracle SQL (Oracle SQL Developer) |
| NoSQL Database | MongoDB (MongoDB Compass) |
| GUI / CRUD Application | Java Swing (desktop app) |
| Data files | JSON (MongoDB import), SQL (Oracle DDL/DML) |
| Documentation | EER diagram, relational schema, project report (PDF) |

---

## Repository Structure

Here's the structure I'd recommend for your repo — it keeps the SQL side, the Mongo side, the GUI, and the write-up cleanly separated so a visitor (or your instructor) can navigate straight to what they want:

```
hotel-management-database-system/
│
├── README.md
├── LICENSE
├── .gitignore
│
├── Documentation/                     ← full project report (EER diagram, schema, all queries)
│
├── SQL Screenshots/                   ← Oracle SQL Developer screenshots (table creation, query results)
├── MongoDB Screenshots/               ← Compass screenshots (collections, documents, aggregations)
├── GUI Screenshots/                   ← GUI screenshots (insert/update/delete flows)
│
├── sql/
│   ├── schema_and_seed_data.sql       ← full DDL + DML (Oracle) — table creation & inserts
│   └── queries/
│       ├── 01_join_guest_booking.sql
│       ├── 02_subquery_hotel_avg_price.sql
│       └── 03_union_member_walking_guest.sql
│
└── mongodb/
    ├── json/                          ← one JSON file per collection, generated from the SQL seed data
    │   ├── hotel.json
    │   ├── room.json
    │   ├── amenity.json
    │   ├── guest.json
    │   ├── booking.json
    │   ├── staff.json
    │   ├── staff_profile.json
    │   └── ... (25 total)
    └── aggregations/
        ├── total_amount_due.js              ← $group: sum of AmountDue
        ├── group_invoices_by_payment_mode.js← $group by PaymentMode with count
        └── join_staff_with_hotel.js         ← $lookup joining staff → hotels
```

---

## Relational Schema (Oracle SQL)

The relational schema (from `sql/PROJECT_SQL.sql`) includes the following tables:

`Hotel`, `Hotel_Phone`, `Room`, `Amenity`, `Has_Amenity`, `RoomStatusLog`, `SingleRoom`, `DoubleRoom`, `Suit`, `MaintainsRoom`, `Guest`, `Guest_Phone`, `Member_Guest`, `Walking_Guest`, `Staff`, `Booking`, `Assign_Room`, `Invoice`, `Staff_Phone`, `Staff_Profile`, `Housekeep_Staff`, `MaintenanceStaff`, `FrontDeskStaff`, `HouseKeepingTask`, `Performs_Task`

Key constraints implemented:
- `CHECK` constraints (e.g. `StarRating BETWEEN 1 AND 5`, `Room.Status IN ('Available','Occupied','Maintenance')`, `Salary > 2000`)
- Composite primary keys for all multivalued-attribute tables (`Hotel_Phone`, `Guest_Phone`, `Staff_Phone`) and associative/weak entities (`Has_Amenity`, `RoomStatusLog`, `Assign_Room`, `Performs_Task`, `MaintainsRoom`)
- Foreign keys enforcing every 1:N and M:N relationship described in the EER diagram

---

## NoSQL Schema (MongoDB)

Database: **`hotel_management`**

Collections (mirroring the relational tables as documents): `hotel`, `hotel_phone`, `room`, `amenity`, `has_amnety`, `single_room`, `double_room`, `suit`, `roomstatuslog`, `maintainsroom`, `guest`, `guest_phone`, `member_guest`, `walking_guest`, `staff`, `staff_phone`, `staff_profile`, `house_keeping_staff`, `maintenance_Staff`, `frontdesk_staff`, `housekeeping_task`, `perform_task`, `booking`, `invoice`

---

## Sample Queries

### SQL — Join
Show guest name with their booking details:
```sql
SELECT G.GUESTID, G.FIRST_NAME, G.LAST_NAME,
       B.BOOKINGID, B.STATUS, B.CHECK_DATE, B.CHECKOUT_DATE
FROM GUEST G
JOIN BOOKING B ON G.GUESTID = B.GUESTID;
```

### SQL — Subquery
Find hotels whose average room price is higher than the overall average room price:
```sql
SELECT HotelID, HotelName
FROM HOTEL
WHERE HotelID IN (
    SELECT HotelID
    FROM ROOM
    GROUP BY HotelID
    HAVING AVG(PricePerNight) > (SELECT AVG(PricePerNight) FROM ROOM)
);
```

### SQL — Set Operator
Find guests who are in both `MEMBER_GUEST` and `WALKING_GUEST` tables:
```sql
SELECT GUESTID FROM MEMBER_GUEST
UNION
SELECT GUESTID FROM WALKING_GUEST;
```

### MongoDB — Aggregation
Total amount due across all invoices:
```js
db.invoice.aggregate([
  { $group: { _id: null, total: { $sum: "$AmountDue" } } }
]);
```

Group invoices by payment mode:
```js
db.invoice.aggregate([
  { $group: { _id: "$PaymentMode", total: { $sum: "$AmountDue" }, count: { $sum: 1 } } }
]);
```

### MongoDB — $lookup (Join)
Join `staff` with `hotels`, matching on `hotelid`:
```js
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
```

---

## GUI & CRUD Operations

A Java Swing desktop app (`Hotel Management System`) connects directly to MongoDB and provides a sidebar of every collection (Guest, Booking, Invoice, Staff, Hotel, Room, Amenity, Member Guest, Walking Guest, Suit, Housekeeping Task, Maintenance Staff, Front Desk Staff, Staff Profile, Maintains Room, Hotel Phone) with **Insert / Update / Delete / Refresh** buttons, giving full CRUD coverage over the live database.

---

## How to Run

### Oracle SQL side
1. Open **Oracle SQL Developer** and connect to your database.
2. Run `sql/PROJECT_SQL.sql` to create all tables and seed data.
3. Explore the queries in `sql/queries/`.

### MongoDB side
1. Install **MongoDB Community Server** + **MongoDB Compass**.
2. Create a database named `hotel_management`.
3. Import each collection:
   ```bash
   mongoimport --db hotel_management --collection guest --file mongodb/json/guest.json --jsonArray
   ```
   (repeat for each file in `mongodb/json/`)
4. Run the aggregation scripts in `mongodb/aggregations/` from the Compass Aggregation tab or `mongosh`.

### GUI
1. Open the project in your Java IDE (or run the packaged `.jar`).
2. Ensure MongoDB is running locally on `localhost:27017`.
3. Launch the app — it should show **"Connected"** in the top-right corner.

---

## Screenshots

See the [`screenshots/`](./screenshots) folder for the full set:
- **`screenshots/sql/`** — table creation, join/subquery/set-operator results
- **`screenshots/mongodb/`** — collection creation, sample documents, `$group` and `$lookup` aggregation results
- **`screenshots/gui/`** — insert, update, and delete flows shown end-to-end (GUI → live MongoDB update)

Full write-up with every screenshot inline is in [`docs/DB_PROJECT_final1.pdf`](./docs/DB_PROJECT_final1.pdf).

---

## Authors

| Name |
|---|
| Shafia Shafique | 

Course project — Database Systems, **COMSATS University Islamabad**

---

## License

This project is submitted for academic purposes. Feel free to use it as a reference for your own EER/SQL/NoSQL coursework — just don't submit it as your own. 🙂
