// routes/destinations.route.j

import express from "express";
import { ObjectId } from "mongodb";
import { destinationsCollection } from "../lib/connectDB.js";
import { generateSlug } from "../helper/destinations.js";

const router = express.Router();

// ==== get all destinations =====
router.get("/", async (req, res) => {
  try {
    const destinations = await destinationsCollection.find({}).toArray();
    res.send(destinations);
  } catch (error) {
    console.error("Error fetching destinations:", error);
    res.status(500).send({
      success: false,
      message: "Failed to fetch destinations.",
    });
  }
});

// ==== get destination by Slug =====
router.get("/:slug", async (req, res) => {
  const { slug } = req.params;

  try {
    const destination = await destinationsCollection.findOne({ slug });

    if (!destination) {
      return res.status(404).send({
        success: false,
        message: "Destination not found.",
      });
    }

    res.send(destination);
  } catch (error) {
    console.error("Error fetching destination by slug:", error);
    res.status(500).send({
      success: false,
      message: "Failed to fetch destination.",
    });
  }
});

// ==== post destination =====
router.post("/", async (req, res) => {
  const { name, ...rest } = req.body;
  const slug = generateSlug(name);
  const newDestination = { name, slug, ...rest };

  try {
    const result = await destinationsCollection.insertOne(newDestination);

    res.status(201).send({
      success: true,
      message: "Destination created successfully.",
      destination: {
        _id: result.insertedId,
        ...newDestination,
      },
    });

    console.log("New destination created:", newDestination);
  } catch (error) {
    console.error("Error creating destination:", error);
    res.status(500).send({
      success: false,
      message: "Failed to create destination.",
    });
  }
});


// ==== patch destination by ID =====
router.patch("/:id", async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id) || id.length !== 24) {
    return res.status(400).send({
      success: false,
      message: "Invalid destination ID.",
    });
  }

  const allowedFields = [
    "name",
    "slug",
    "country",
    "city",
    "description",
    "category",
    "averageCost",
    "image",
  ];

  const updateData = Object.fromEntries(
    Object.entries(req.body).filter(([key]) => allowedFields.includes(key)),
  );

  if (Object.keys(updateData).length === 0) {
    return res.status(400).send({
      success: false,
      message: "No valid fields provided for update.",
    });
  }

  try {
    const result = await destinationsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData },
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({
        success: false,
        message: "Destination not found.",
      });
    }

    res.send({
      success: true,
      message: "Destination updated successfully.",
    });
  } catch (error) {
    console.error("Error updating destination:", error);
    res.status(500).send({
      success: false,
      message: "Failed to update destination.",
    });
  }
});

// ==== delete destination by ID =====
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id) || id.length !== 24) {
    return res.status(400).send({
      success: false,
      message: "Invalid destination ID.",
    });
  }

  try {
    const result = await destinationsCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).send({
        success: false,
        message: "Destination not found.",
      });
    }

    res.send({
      success: true,
      message: "Destination deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting destination:", error);
    res.status(500).send({
      success: false,
      message: "Failed to delete destination.",
    });
  }
});

export default router;
