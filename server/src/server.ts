import express from "express";
import cors from "cors";
import records from "../routes/record";
import authentication from "../routes/authRouter";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/login", (req, res) => {
  res.send({
    token: "test12321",
  });
});
app.use("/record", records);
app.use(authentication);

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
