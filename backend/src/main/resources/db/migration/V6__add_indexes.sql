-- Índices para melhor performance

CREATE INDEX IF NOT EXISTS idx_produtos_codigo ON produtos(codigo);
CREATE INDEX IF NOT EXISTS idx_produtos_nome ON produtos(nome);
CREATE INDEX IF NOT EXISTS idx_produtos_categoria ON produtos(categoria);
CREATE INDEX IF NOT EXISTS idx_produtos_ativo ON produtos(ativo);

CREATE INDEX IF NOT EXISTS idx_clientes_cpf_cnpj ON clientes(cpf_cnpj);
CREATE INDEX IF NOT EXISTS idx_clientes_nome ON clientes(nome);
CREATE INDEX IF NOT EXISTS idx_clientes_email ON clientes(email);

CREATE INDEX IF NOT EXISTS idx_vendas_numero ON vendas(numero);
CREATE INDEX IF NOT EXISTS idx_vendas_data_venda ON vendas(data_venda);
CREATE INDEX IF NOT EXISTS idx_vendas_status ON vendas(status);
CREATE INDEX IF NOT EXISTS idx_vendas_cliente_id ON vendas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_vendas_usuario_id ON vendas(usuario_id);

CREATE INDEX IF NOT EXISTS idx_itens_venda_venda_id ON itens_venda(venda_id);
CREATE INDEX IF NOT EXISTS idx_itens_venda_produto_id ON itens_venda(produto_id);

CREATE INDEX IF NOT EXISTS idx_usuarios_username ON usuarios(username);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);