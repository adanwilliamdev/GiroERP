-- Tabela de auditoria
CREATE TABLE IF NOT EXISTS audit_log (
    id BIGSERIAL PRIMARY KEY,
    tabela VARCHAR(50) NOT NULL,
    operacao VARCHAR(10) NOT NULL,
    registro_id BIGINT NOT NULL,
    dados_anteriores JSONB,
    dados_novos JSONB,
    usuario_id BIGINT REFERENCES usuarios(id),
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address INET
);

CREATE INDEX IF NOT EXISTS idx_audit_log_tabela ON audit_log(tabela);
CREATE INDEX IF NOT EXISTS idx_audit_log_data_hora ON audit_log(data_hora);
CREATE INDEX IF NOT EXISTS idx_audit_log_usuario_id ON audit_log(usuario_id);

-- Função para auditoria
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        INSERT INTO audit_log (tabela, operacao, registro_id, dados_anteriores, usuario_id)
        VALUES (TG_TABLE_NAME, TG_OP, OLD.id, row_to_json(OLD), NULL);
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO audit_log (tabela, operacao, registro_id, dados_anteriores, dados_novos, usuario_id)
        VALUES (TG_TABLE_NAME, TG_OP, NEW.id, row_to_json(OLD), row_to_json(NEW), NULL);
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO audit_log (tabela, operacao, registro_id, dados_novos, usuario_id)
        VALUES (TG_TABLE_NAME, TG_OP, NEW.id, row_to_json(NEW), NULL);
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Aplicar triggers de auditoria
CREATE TRIGGER audit_produtos
AFTER INSERT OR UPDATE OR DELETE ON produtos
FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_clientes
AFTER INSERT OR UPDATE OR DELETE ON clientes
FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_vendas
AFTER INSERT OR UPDATE OR DELETE ON vendas
FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();