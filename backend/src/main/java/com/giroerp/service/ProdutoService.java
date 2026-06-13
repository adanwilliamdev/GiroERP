package com.giroerp.service;

import com.giroerp.dto.ProdutoDTO;
import com.giroerp.model.Produto;
import com.giroerp.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProdutoService {
    
    private final ProdutoRepository produtoRepository;
    
    @Transactional
    public ProdutoDTO create(ProdutoDTO produtoDTO) {
        System.out.println("Criando produto: " + produtoDTO);
        
        Produto produto = new Produto();
        produto.setCodigo(produtoDTO.getCodigo());
        produto.setNome(produtoDTO.getNome());
        produto.setDescricao(produtoDTO.getDescricao());
        produto.setPreco(produtoDTO.getPreco());
        produto.setEstoque(produtoDTO.getEstoque() != null ? produtoDTO.getEstoque() : 0);
        produto.setCategoria(produtoDTO.getCategoria());
        produto.setAtivo(produtoDTO.getAtivo() != null ? produtoDTO.getAtivo() : true);
        
        // Garantir valores padrão
        if (produto.getEstoque() == null) produto.setEstoque(0);
        if (produto.getAtivo() == null) produto.setAtivo(true);
        
        try {
            produto = produtoRepository.save(produto);
            System.out.println("Produto salvo com ID: " + produto.getId());
        } catch (Exception e) {
            System.err.println("Erro ao salvar produto: " + e.getMessage());
            throw new RuntimeException("Erro ao salvar produto: " + e.getMessage());
        }
        
        return convertToDTO(produto);
    }
    
    public ProdutoDTO findById(Long id) {
        Produto produto = produtoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Produto não encontrado com ID: " + id));
        return convertToDTO(produto);
    }
    
    public Page<ProdutoDTO> findAll(Pageable pageable) {
        return produtoRepository.findAll(pageable).map(this::convertToDTO);
    }
    
    @Transactional
    public ProdutoDTO update(Long id, ProdutoDTO produtoDTO) {
        Produto produto = produtoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Produto não encontrado com ID: " + id));
        
        produto.setCodigo(produtoDTO.getCodigo());
        produto.setNome(produtoDTO.getNome());
        produto.setDescricao(produtoDTO.getDescricao());
        produto.setPreco(produtoDTO.getPreco());
        produto.setEstoque(produtoDTO.getEstoque());
        produto.setCategoria(produtoDTO.getCategoria());
        produto.setAtivo(produtoDTO.getAtivo());
        
        produto = produtoRepository.save(produto);
        return convertToDTO(produto);
    }
    
    @Transactional
    public void delete(Long id) {
        if (!produtoRepository.existsById(id)) {
            throw new RuntimeException("Produto não encontrado com ID: " + id);
        }
        produtoRepository.deleteById(id);
    }
    
    private ProdutoDTO convertToDTO(Produto produto) {
        ProdutoDTO dto = new ProdutoDTO();
        dto.setId(produto.getId());
        dto.setCodigo(produto.getCodigo());
        dto.setNome(produto.getNome());
        dto.setDescricao(produto.getDescricao());
        dto.setPreco(produto.getPreco());
        dto.setEstoque(produto.getEstoque());
        dto.setCategoria(produto.getCategoria());
        dto.setAtivo(produto.getAtivo());
        dto.setCreatedAt(produto.getCreatedAt());
        dto.setUpdatedAt(produto.getUpdatedAt());
        return dto;
    }
}