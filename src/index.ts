import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes";

const port = process.env.PORT || 3000;
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

routes(app);

app.listen(port, () => {
  console.warn(`Server is running on port ${port}`);
});
