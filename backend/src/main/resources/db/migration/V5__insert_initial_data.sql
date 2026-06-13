-- Inserir usuário admin
INSERT INTO usuarios (username, email, password, nome, role, ativo)
VALUES ('admin', 'admin@giroerp.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5E2M6lMqZqMqZqMqZqMqZq', 'Administrador', 'ADMIN', true);

-- Inserir produtos de exemplo
INSERT INTO produtos (codigo, nome, descricao, preco, estoque, categoria) VALUES
('PROD001', 'Notebook Dell', 'Notebook Dell Inspiron 15', 3500.00, 10, 'Eletrônicos'),
('PROD002', 'Mouse Logitech', 'Mouse sem fio', 150.00, 50, 'Periféricos'),
('PROD003', 'Teclado Mecânico', 'Teclado RGB', 250.00, 30, 'Periféricos');

-- Inserir clientes de exemplo
INSERT INTO clientes (nome, cpf_cnpj, email, telefone, cidade, estado) VALUES
('João Silva', '123.456.789-00', 'joao@email.com', '(11) 99999-9999', 'São Paulo', 'SP'),
('Maria Santos', '987.654.321-00', 'maria@email.com', '(21) 98888-8888', 'Rio de Janeiro', 'RJ');