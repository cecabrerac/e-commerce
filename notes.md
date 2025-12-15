Arquitectura general del proyecto
Tu aplicación tendrá 4 capas:

- Frontend (HTML, CSS, JavaScript)
- Interfaz del usuario
- Carrito, catálogo, login, etc.
- Backend (Node.js + Express)
- API REST
- Manejo de sesiones, autenticación, lógica de negocio
- Validación de datos
- Base de datos (PostgreSQL)
- Productos
- Usuarios
- Órdenes
- Carrito persistente (opcional)
- Infraestructura (opcional pero recomendado)
- Docker para backend + base de datos
- Scripts para levantar todo rápido

Estructura recomendada del proyecto
ecommerce/
│
├── backend/
│ ├── src/
│ │ ├── app.js
│ │ ├── routes/
│ │ ├── controllers/
│ │ ├── models/
│ │ └── db.js
│ ├── package.json
│ └── Dockerfile
│
├── frontend/
│ ├── index.html
│ ├── styles/
│ ├── scripts/
│ └── assets/
│
└── docker-compose.yml

🛢️ Base de datos PostgreSQL
Un esquema básico para un e‑commerce:
Tabla users

- id (PK)
- name
- email (único)
- password_hash
- created_at
  Tabla products
- id (PK)
- name
- description
- price
- stock
- image_url
  Tabla orders
- id (PK)
- user_id (FK)
- total
- created_at
  Tabla order_items
- id (PK)
- order_id (FK)
- product_id (FK)
- quantity
- price

⚙️ Backend con Node.js + Express

1. Inicializar proyecto
   mkdir backend
   cd backend
   npm init -y
   npm install express pg bcrypt jsonwebtoken cors dotenv

2. Conexión a PostgreSQL (db.js)
   import pkg from 'pg';
   const { Pool } = pkg;

export const pool = new Pool({
user: process.env.DB_USER,
host: process.env.DB_HOST,
database: process.env.DB_NAME,
password: process.env.DB_PASS,
port: 5432
});

3. Servidor Express básico (app.js)
   import express from 'express';
   import cors from 'cors';
   import { pool } from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/products', async (req, res) => {
const result = await pool.query('SELECT \* FROM products');
res.json(result.rows);
});

app.listen(3000, () => console.log('API running on port 3000'));

🎨 Frontend (HTML, CSS, JS)
Ejemplo de consumo de la API desde el frontend
async function loadProducts() {
const res = await fetch('http://localhost:3000/products');
const products = await res.json();

const container = document.getElementById('products');
container.innerHTML = products.map(p => `    <div class="product">
      <img src="${p.image_url}">
      <h3>${p.name}</h3>
      <p>$${p.price}</p>
      <button onclick="addToCart(${p.id})">Agregar</button>
    </div>
 `).join('');
}

loadProducts();

🐳 Docker (opcional pero muy recomendado)
docker-compose.yml
version: '3.9'
services:
db:
image: postgres:15
environment:
POSTGRES_USER: admin
POSTGRES_PASSWORD: admin
POSTGRES_DB: ecommerce
ports: - "5432:5432"
volumes: - db_data:/var/lib/postgresql/data

backend:
build: ./backend
ports: - "3000:3000"
environment:
DB_HOST: db
DB_USER: admin
DB_PASS: admin
DB_NAME: ecommerce
depends_on: - db

volumes:
db_data:
