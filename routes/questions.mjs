import express from "express";
import connectionPool from "../utils/db.mjs";

const router = express.Router();

// Create a new question
router.post("/", async (req, res) => {
  try {
    const { title, description, category } = req.body;

    // Validate required fields
    if (!title?.trim() || !description?.trim() || !category?.trim()) {
      return res.status(400).json({ message: "Invalid request data." });
    }

    const query = `
      INSERT INTO questions (title, description, category)
      VALUES ($1, $2, $3)
      RETURNING id
    `;
    
    const result = await connectionPool.query(query, [title, description, category]);
    
    res.status(201).json({ message: "Question created successfully." });
  } catch (error) {
    console.error("Error creating question:", error);
    res.status(500).json({ message: "Unable to create question." });
  }
});

// Get all questions
router.get("/", async (req, res) => {
  try {
    const query = "SELECT * FROM questions ORDER BY id";
    const result = await connectionPool.query(query);
    
    res.status(200).json({ data: result.rows });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Unable to fetch questions." });
  }
});

// Search questions by title or category
router.get("/search", async (req, res) => {
  try {
    const { title, category } = req.query;

    // Validate search parameters
    if (!title && !category) {
      return res.status(400).json({ message: "Invalid search parameters." });
    }

    let query = "SELECT * FROM questions WHERE 1=1";
    const params = [];
    let paramCount = 0;

    if (title) {
      paramCount++;
      query += ` AND title ILIKE $${paramCount}`;
      params.push(`%${title}%`);
    }

    if (category) {
      paramCount++;
      query += ` AND category ILIKE $${paramCount}`;
      params.push(`%${category}%`);
    }

    query += " ORDER BY id";

    const result = await connectionPool.query(query, params);
    
    res.status(200).json({ data: result.rows });
  } catch (error) {
    console.error("Error searching questions:", error);
    res.status(500).json({ message: "Unable to fetch questions." });
  }
});

// Get a question by ID
router.get("/:questionId", async (req, res) => {
  try {
    const { questionId } = req.params;
    
    const query = "SELECT * FROM questions WHERE id = $1";
    const result = await connectionPool.query(query, [questionId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Question not found." });
    }
    
    res.status(200).json({ data: result.rows[0] });
  } catch (error) {
    console.error("Error fetching question:", error);
    res.status(500).json({ message: "Unable to fetch questions." });
  }
});

// Update a question by ID
router.put("/:questionId", async (req, res) => {
  try {
    const { questionId } = req.params;
    const { title, description, category } = req.body;

    // Validate required fields
    if (!title?.trim() || !description?.trim() || !category?.trim()) {
      return res.status(400).json({ message: "Invalid request data." });
    }

    // Check if question exists
    const checkQuery = "SELECT id FROM questions WHERE id = $1";
    const checkResult = await connectionPool.query(checkQuery, [questionId]);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: "Question not found." });
    }

    const updateQuery = `
      UPDATE questions 
      SET title = $1, description = $2, category = $3
      WHERE id = $4
    `;
    
    await connectionPool.query(updateQuery, [title, description, category, questionId]);
    
    res.status(200).json({ message: "Question updated successfully." });
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).json({ message: "Unable to fetch questions." });
  }
});

// Delete a question by ID
router.delete("/:questionId", async (req, res) => {
  try {
    const { questionId } = req.params;

    // Check if question exists
    const checkQuery = "SELECT id FROM questions WHERE id = $1";
    const checkResult = await connectionPool.query(checkQuery, [questionId]);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: "Question not found." });
    }

    // Delete question (answers will be deleted by CASCADE)
    const deleteQuery = "DELETE FROM questions WHERE id = $1";
    await connectionPool.query(deleteQuery, [questionId]);
    
    res.status(200).json({ message: "Question post has been deleted successfully." });
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).json({ message: "Unable to delete question." });
  }
});

export default router;
