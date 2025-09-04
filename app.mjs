import express from "express";
import connectionPool from "./utils/db.mjs";

const app = express();
const port = 4000;

app.use(express.json());

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

app.get("/test2", async (req, res) => {
  try {
    const result = await connectionPool.query("SELECT count(*) FROM public.answer_votes");
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});


app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
