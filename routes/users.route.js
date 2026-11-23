// routes/users.route.js
import express from "express";
import { ObjectId } from "mongodb";
import { usersCollection } from "../lib/connectDB.js";

const router = express.Router();

// ==== get all users =====
router.get("/", async (req, res) => {
  try {
    const users = await usersCollection.find({}).toArray();
    res.send(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send({ success: false, message: "Failed to fetch users." });
  }
});

// ==== get user by ID =====
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res
      .status(400)
      .send({ success: false, message: "Invalid user ID." });
  }

  const user = await usersCollection.findOne({ _id: new ObjectId(id) });

  if (!user) {
    return res.status(404).send({ success: false, message: "User not found." });
  }

  res.send(user);
});

// ==== post user =====
router.post("/", async (req, res) => {
  const newUser = req.body;

  try {
    const result = await usersCollection.insertOne(newUser);
    res.status(201).send({
      success: true,
      message: "User created successfully.",
      user: { _id: result.insertedId, ...newUser },
    });
    console.log("New user created:", newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send({ success: false, message: "Failed to create user." });
  }
});

// ==== patch user =====
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  if (!ObjectId.isValid(id)) {
    return res
      .status(400)
      .send({ success: false, message: "Invalid user ID." });
  }

  try {
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData },
    );

    if (result.matchedCount === 0) {
      return res
        .status(404)
        .send({ success: false, message: "User not found." });
    }

    res.send({ success: true, message: "User updated successfully." });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send({ success: false, message: "Failed to update user." });
  }
});

// ==== delete user =====
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res
      .status(400)
      .send({ success: false, message: "Invalid user ID." });
  }

  try {
    const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .send({ success: false, message: "User not found." });
    }

    res.send({ success: true, message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send({ success: false, message: "Failed to delete user." });
  }
});

export default router;
