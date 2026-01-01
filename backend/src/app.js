import express from "express";
import cors from "cors";
import router from "./routes.js";

const app = express();
app.use(cors());
app.use(express.json());

// Ruta base
app.get("/", async (req, res) => {
  res.send("Hello World!");
});

// usar rutas modulares
app.use("/", router);

app.listen(3000, () => console.log("API running on port 3000"));
