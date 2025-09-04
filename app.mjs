import express from "express";
import connectionPool from "./utils/db.mjs";
import questionsRouter from "./routes/questions.mjs";
import answersRouter from "./routes/answers.mjs";


const app = express();
const port = 4000;

app.use(express.json());

// Test endpoint
app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

// Database test endpoint
app.get("/test2", async (req, res) => {
  try {
    const result = await connectionPool.query("SELECT count(*) FROM public.answer_votes");
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// API Routes
app.use("/questions", questionsRouter);
app.use("/questions", answersRouter); 


app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
