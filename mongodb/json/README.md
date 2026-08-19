# MongoDB Collection Exports

This folder is where your **exported MongoDB collections** go, so anyone
who clones the repo can rebuild your exact `hotel_management` database
locally with `mongoimport`.

## How to export from MongoDB Compass

For each collection listed below:

1. Open the collection in Compass.
2. Click **Export Data** → **Export Full Collection** → format **JSON** → **Array**.
3. Save it into this folder using the exact file name listed.

| Collection (in Compass) | Export as |
|---|---|
| hotel | `hotel.json` |
| hotel_phone | `hotel_phone.json` |
| room | `room.json` |
| single_room | `single_room.json` |
| double_room | `double_room.json` |
| suit | `suit.json` |
| amenity | `amenity.json` |
| has_amnety | `has_amnety.json` |
| roomstatuslog | `roomstatuslog.json` |
| maintainsroom | `maintainsroom.json` |
| guest | `guest.json` |
| guest_phone | `guest_phone.json` |
| member_guest | `member_guest.json` |
| walking_guest | `walking_guest.json` |
| staff | `staff.json` |
| staff_phone | `staff_phone.json` |
| staff_profile | `staff_profile.json` |
| house_keeping_staff | `house_keeping_staff.json` |
| maintenance_staff | `maintenance_staff.json` |
| frontdesk_staff | `frontdesk_staff.json` |
| housekeeping_task | `housekeeping_task.json` |
| perform_task | `perform_task.json` |
| booking | `booking.json` |
| invoice | `invoice.json` |

> ⚠️ Before exporting, rename any inconsistently-cased collection in
> Compass (e.g. `maintenance_Staff` → `maintenance_staff`) so the file
> name and the collection name match exactly — this matters for
> `mongoimport` and for anyone reading the repo later.

## How to re-import

```bash
mongoimport --db hotel_management --collection guest --file guest.json --jsonArray
```

Repeat for every file in this folder (a small shell loop works too):

```bash
for f in *.json; do
  collection="${f%.json}"
  mongoimport --db hotel_management --collection "$collection" --file "$f" --jsonArray
done
```
