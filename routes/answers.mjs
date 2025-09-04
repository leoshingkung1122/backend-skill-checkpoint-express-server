import express from "express";
import connectionPool from "../utils/db.mjs";

const router = express.Router();

// Create an answer for a question
router.post("/:questionId/answers", async (req, res) => {
  try {
    const { questionId } = req.params;
    const { content } = req.body;

    // Validate required fields
    if (!content?.trim()) {
      return res.status(400).json({ message: "Invalid request data." });
    }

    // Validate content length (max 300 characters)
    if (content.length > 300) {
      return res.status(400).json({ message: "Answer content must not exceed 300 characters." });
    }

    // Check if question exists
    const checkQuery = "SELECT id FROM questions WHERE id = $1";
    const checkResult = await connectionPool.query(checkQuery, [questionId]);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: "Question not found." });
    }

    const insertQuery = `
      INSERT INTO answers (question_id, content)
      VALUES ($1, $2)
    `;
    
    await connectionPool.query(insertQuery, [questionId, content]);
    
    res.status(201).json({ message: "Answer created successfully." });
  } catch (error) {
    console.error("Error creating answer:", error);
    res.status(500).json({ message: "Unable to create answers." });
  }
});

// Get answers for a question
router.get("/:questionId/answers", async (req, res) => {
  try {
    const { questionId } = req.params;

    // Check if question exists
    const checkQuery = "SELECT id FROM questions WHERE id = $1";
    const checkResult = await connectionPool.query(checkQuery, [questionId]);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: "Question not found." });
    }

    const query = `
      SELECT id, content 
      FROM answers 
      WHERE question_id = $1 
      ORDER BY id
    `;
    
    const result = await connectionPool.query(query, [questionId]);
    
    res.status(200).json({ data: result.rows });
  } catch (error) {
    console.error("Error fetching answers:", error);
    res.status(500).json({ message: "Unable to fetch answers." });
  }
});

// Delete all answers for a question
router.delete("/:questionId/answers", async (req, res) => {
  try {
    const { questionId } = req.params;

    // Check if question exists
    const checkQuery = "SELECT id FROM questions WHERE id = $1";
    const checkResult = await connectionPool.query(checkQuery, [questionId]);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: "Question not found." });
    }

    const deleteQuery = "DELETE FROM answers WHERE question_id = $1";
    await connectionPool.query(deleteQuery, [questionId]);
    
    res.status(200).json({ message: "All answers for the question have been deleted successfully." });
  } catch (error) {
    console.error("Error deleting answers:", error);
    res.status(500).json({ message: "Unable to delete answers." });
  }
});

export default router;
