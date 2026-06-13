CREATE TABLE IF NOT EXISTS vendas (
    id BIGSERIAL PRIMARY KEY,
    numero VARCHAR(20) UNIQUE NOT NULL,
    cliente_id BIGINT REFERENCES clientes(id),
    usuario_id BIGINT REFERENCES usuarios(id),
    data_venda TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    subtotal DECIMAL(10,2),
    desconto DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'PENDENTE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS itens_venda (
    id BIGSERIAL PRIMARY KEY,
    venda_id BIGINT REFERENCES vendas(id) ON DELETE CASCADE,
    produto_id BIGINT REFERENCES produtos(id),
    quantidade INTEGER NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL
);