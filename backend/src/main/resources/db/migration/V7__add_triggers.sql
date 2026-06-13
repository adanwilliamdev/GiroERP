-- Trigger para atualizar estoque após venda
CREATE OR REPLACE FUNCTION update_estoque_after_venda()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE produtos
    SET estoque = estoque - NEW.quantidade,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.produto_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_estoque
AFTER INSERT ON itens_venda
FOR EACH ROW
EXECUTE FUNCTION update_estoque_after_venda();

-- Trigger para atualizar total da venda
CREATE OR REPLACE FUNCTION update_venda_total()
RETURNS TRIGGER AS $$
DECLARE
    v_total DECIMAL(10,2);
    v_subtotal DECIMAL(10,2);
BEGIN
    SELECT COALESCE(SUM(subtotal), 0) INTO v_subtotal
    FROM itens_venda
    WHERE venda_id = NEW.venda_id;

    v_total = v_subtotal - COALESCE((SELECT desconto FROM vendas WHERE id = NEW.venda_id), 0);

    UPDATE vendas
    SET subtotal = v_subtotal,
        total = v_total,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.venda_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_venda_total
AFTER INSERT OR UPDATE OR DELETE ON itens_venda
FOR EACH ROW
EXECUTE FUNCTION update_venda_total();

-- Trigger para atualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_produtos_updated_at
BEFORE UPDATE ON produtos
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_clientes_updated_at
BEFORE UPDATE ON clientes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();