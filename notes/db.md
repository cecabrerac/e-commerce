Vamos a diseñar una base de datos sólida, escalable y limpia para tu e‑commerce usando PostgreSQL. Te voy guiando paso a paso, con explicaciones claras y decisiones de diseño bien justificadas.

🧱 1. Diseño del modelo de datos
Un e‑commerce típico necesita manejar:

- Usuarios
- Productos
- Carrito (opcional, puede ser temporal o persistente)
- Órdenes
- Items dentro de cada orden
- (Opcional) Categorías, inventario, auditoría, etc.
  Para empezar con una base robusta, te propongo este modelo inicial:
  ✅ Tablas principales
  users
  products
  orders
  order_items
  cart_items (opcional)

🧩 2. Diagrama lógico (simplificado)
users (1) ──── (N) orders (1) ──── (N) order_items (N) ──── (1) products
users (1) ──── (N) cart_items (N) ──── (1) products

🛢️ 3. SQL para crear la base de datos
Aquí tienes un esquema limpio, con claves primarias, foráneas, timestamps y buenas prácticas.
✅ Crear tablas
CREATE TABLE users (
id SERIAL PRIMARY KEY,
name VARCHAR(100) NOT NULL,
email VARCHAR(150) UNIQUE NOT NULL,
password_hash TEXT NOT NULL,
created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE products (
id SERIAL PRIMARY KEY,
name VARCHAR(150) NOT NULL,
description TEXT,
price NUMERIC(10,2) NOT NULL,
stock INT NOT NULL DEFAULT 0,
image_url TEXT,
created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE orders (
id SERIAL PRIMARY KEY,
user_id INT NOT NULL REFERENCES users(id),
total NUMERIC(10,2) NOT NULL,
status VARCHAR(50) DEFAULT 'pending',
created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE order_items (
id SERIAL PRIMARY KEY,
order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
product_id INT NOT NULL REFERENCES products(id),
quantity INT NOT NULL,
price NUMERIC(10,2) NOT NULL
);

CREATE TABLE cart_items (
id SERIAL PRIMARY KEY,
user_id INT NOT NULL REFERENCES users(id),
product_id INT NOT NULL REFERENCES products(id),
quantity INT NOT NULL DEFAULT 1,
UNIQUE(user_id, product_id)
);

🧠 4. Decisiones de diseño explicadas
✅ order_items.price guarda el precio del producto en el momento de la compra
Esto evita inconsistencias si el precio del producto cambia después.
✅ cart_items tiene UNIQUE(user_id, product_id)
Así evitas duplicados en el carrito.
✅ orders.status permite manejar flujo de compra
Ejemplos: "pending", "paid", "shipped", "cancelled".
✅ ON DELETE CASCADE en order_items
Si se borra una orden, se borran sus items automáticamente.

🧪 5. Datos de prueba (opcional)
INSERT INTO products (name, description, price, stock)
VALUES
('Laptop Gamer', 'RTX 4060, 16GB RAM', 4500.00, 10),
('Mouse Inalámbrico', 'Ergonómico', 80.00, 50),
('Teclado Mecánico', 'Switches rojos', 120.00, 30);

✅ ¿Qué sigue?
Puedo ayudarte a:

- Crear scripts de inicialización para Docker
- Escribir migraciones automáticas
- Conectar esta base de datos desde Node.js
- Crear los endpoints REST para productos, carrito y órdenes
- Diseñar un flujo de compra completo
  Si quieres, el siguiente paso natural es conectar Node.js a PostgreSQL y crear los primeros endpoints. ¿Quieres avanzar por ahí o prefieres agregar más tablas o funcionalidades a la base de datos?
