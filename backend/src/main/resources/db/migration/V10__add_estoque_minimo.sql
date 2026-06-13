-- V10__add_estoque_minimo.sql
ALTER TABLE produtos ADD COLUMN IF NOT EXISTS estoque_minimo INTEGER DEFAULT 5;
ALTER TABLE produtos ADD COLUMN IF NOT EXISTS imagem_url VARCHAR(500);

-- Atualizar produtos existentes
UPDATE produtos SET estoque_minimo = 5 WHERE estoque_minimo IS NULL;