import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import db from "../db/connection.js";

const router = express.Router();

// This section will help you get a list of all the records.
router.get("/", async (req: Request, res: Response) => {
  try {
    const collection = await db.collection("records");
    const results = await collection.find({}).toArray();
    res.status(200).send(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching records");
  }
});

// This section will help you get a single record by id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const collection = await db.collection("records");
    const query = { _id: new ObjectId(req.params.id) };
    const result = await collection.findOne(query);

    if (!result) {
      res.status(404).send("Not found");
    } else {
      res.status(200).send(result);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching record");
  }
});

// This section will help you create a new record.
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, code, tags, RSVP, bringing, carpooling, polls, notes } =
      req.body;
    const newDocument = {
      name,
      code,
      tags,
      RSVP,
      bringing,
      carpooling,
      polls,
      notes,
    };

    const collection = await db.collection("Parties");
    const result = await collection.insertOne(newDocument);
    res.status(201).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding record");
  }
});

// This section will help you update a record by id.
router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        name: req.body.name,
        position: req.body.position,
        level: req.body.level,
      },
    };

    const collection = await db.collection("Parties");
    const result = await collection.updateOne(query, updates);
    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating record");
  }
});

// This section will help you delete a record
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };

    const collection = await db.collection("records");
    const result = await collection.deleteOne(query);

    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting record");
  }
});

export default router;
