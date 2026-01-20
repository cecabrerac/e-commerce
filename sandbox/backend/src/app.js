import express from "express";
import cors from "cors";

import productsRoutes from "./routes/products.routes.js";

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// rutas
app.use("/products", productsRoutes);

// ruta de prueba
app.get("/", (req, res) => {
  res.json({ status: "API funcionando" });
});

// levantar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
