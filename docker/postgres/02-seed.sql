-- =========================
-- Seed inicial para e-commerce
-- =========================

-- Productos de prueba
INSERT INTO products (name, description, price, stock, image_url)
VALUES
('Laptop Gamer', 'RTX 4060, 16GB RAM', 4500.00, 10, 'https://example.com/laptop.jpg'),
('Mouse Inalámbrico', 'Ergonómico y preciso', 80.00, 50, 'https://example.com/mouse.jpg'),
('Teclado Mecánico', 'Switches rojos, RGB', 120.00, 30, 'https://example.com/teclado.jpg');

-- Usuarios de prueba
INSERT INTO users (name, email, password_hash)
VALUES
('Juan Pérez', 'juan@example.com', 'hash123'),
('María Gómez', 'maria@example.com', 'hash456'),
('Carlos López', 'carlos@example.com', 'hash789');

-- Carritos iniciales
INSERT INTO cart_items (user_id, product_id, quantity)
VALUES
(1, 2, 2), -- Juan tiene 2 Mouse Inalámbricos
(2, 1, 1), -- María tiene 1 Laptop Gamer
(3, 3, 1); -- Carlos tiene 1 Teclado Mecánico

-- Órdenes de prueba
INSERT INTO orders (user_id, total, status)
VALUES
(1, 160.00, 'completed'), -- Juan compró 2 Mouse
(2, 4500.00, 'pending');  -- María compró 1 Laptop

-- Detalle de órdenes
INSERT INTO order_items (order_id, product_id, quantity, price)
VALUES
(1, 2, 2, 80.00),  -- Orden 1: 2 Mouse a 80 cada uno
(2, 1, 1, 4500.00); -- Orden 2: 1 Laptop Gamer