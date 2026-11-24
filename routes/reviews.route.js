// routes/reviews.route.js
import express from "express";
import { ObjectId } from "mongodb";
import { reviewsCollection } from "../lib/connectDB.js";

const router = express.Router();

// ==== get all reviews =====
router.get("/", async (req, res) => {
  try {
    const reviews = await reviewsCollection.find({}).toArray();
    res.send(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res
      .status(500)
      .send({ success: false, message: "Failed to fetch reviews." });
  }
});

// ==== get review by ID =====
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res
      .status(400)
      .send({ success: false, message: "Invalid review ID." });
  }

  try {
    const review = await reviewsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!review) {
      return res
        .status(404)
        .send({ success: false, message: "Review not found." });
    }

    res.send(review);
  } catch (error) {
    console.error("Error fetching review:", error);
    res
      .status(500)
      .send({ success: false, message: "Failed to fetch review." });
  }
});

// ==== post review =====
router.post("/", async (req, res) => {
  const newReview = req.body;

  try {
    const result = await reviewsCollection.insertOne(newReview);

    res.status(201).send({
      success: true,
      message: "Review created successfully.",
      review: { _id: result.insertedId, ...newReview },
    });

    console.log("New review created:", newReview);
  } catch (error) {
    console.error("Error creating review:", error);
    res
      .status(500)
      .send({ success: false, message: "Failed to create review." });
  }
});

// ==== patch review =====
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  if (!ObjectId.isValid(id)) {
    return res
      .status(400)
      .send({ success: false, message: "Invalid review ID." });
  }

  try {
    const result = await reviewsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData },
    );

    if (result.matchedCount === 0) {
      return res
        .status(404)
        .send({ success: false, message: "Review not found." });
    }

    res.send({ success: true, message: "Review updated successfully." });
  } catch (error) {
    console.error("Error updating review:", error);
    res
      .status(500)
      .send({ success: false, message: "Failed to update review." });
  }
});

// ==== delete review =====
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res
      .status(400)
      .send({ success: false, message: "Invalid review ID." });
  }

  try {
    const result = await reviewsCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .send({ success: false, message: "Review not found." });
    }

    res.send({ success: true, message: "Review deleted successfully." });
  } catch (error) {
    console.error("Error deleting review:", error);
    res
      .status(500)
      .send({ success: false, message: "Failed to delete review." });
  }
});

export default router;