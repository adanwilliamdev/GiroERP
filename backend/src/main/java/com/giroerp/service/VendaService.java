package com.giroerp.service;

import com.giroerp.dto.VendaDTO;
import com.giroerp.dto.ItemVendaDTO;
import com.giroerp.model.*;
import com.giroerp.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VendaService {
    
    private final VendaRepository vendaRepository;
    private final ClienteRepository clienteRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProdutoRepository produtoRepository;
    
    @Transactional
    public VendaDTO create(VendaDTO vendaDTO) {
        System.out.println("Criando venda: " + vendaDTO);
        
        Cliente cliente = clienteRepository.findById(vendaDTO.getClienteId())
            .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
        
        Usuario usuario = usuarioRepository.findById(1L)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        Venda venda = new Venda();
        venda.setNumero(generateNumeroVenda());
        venda.setCliente(cliente);
        venda.setUsuario(usuario);
        venda.setDataVenda(LocalDateTime.now());
        venda.setStatus("PENDENTE");
        venda.setDesconto(vendaDTO.getDesconto() != null ? vendaDTO.getDesconto() : BigDecimal.ZERO);
        
        // Dados de pagamento
        venda.setFormaPagamento(vendaDTO.getFormaPagamento());
        venda.setNumeroParcelas(vendaDTO.getNumeroParcelas());
        venda.setValorEntrada(vendaDTO.getValorEntrada());
        venda.setValorParcela(vendaDTO.getValorParcela());
        venda.setBandeiraCartao(vendaDTO.getBandeiraCartao());
        venda.setUltimosDigitos(vendaDTO.getUltimosDigitos());
        
        BigDecimal subtotal = BigDecimal.ZERO;
        List<ItemVenda> itens = new ArrayList<>();
        
        for (ItemVendaDTO itemDTO : vendaDTO.getItens()) {
            Produto produto = produtoRepository.findById(itemDTO.getProdutoId())
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
            
            ItemVenda item = new ItemVenda();
            item.setProduto(produto);
            item.setQuantidade(itemDTO.getQuantidade());
            item.setPrecoUnitario(produto.getPreco());
            item.setSubtotal(produto.getPreco().multiply(BigDecimal.valueOf(itemDTO.getQuantidade())));
            item.setVenda(venda);
            
            subtotal = subtotal.add(item.getSubtotal());
            itens.add(item);
        }
        
        venda.setSubtotal(subtotal);
        venda.setTotal(subtotal.subtract(venda.getDesconto()));
        venda.setItens(itens);
        
        Venda saved = vendaRepository.save(venda);
        System.out.println("Venda salva com ID: " + saved.getId());
        
        return convertToDTO(saved);
    }
    
    public List<VendaDTO> findAll() {
        return vendaRepository.findAll().stream()
            .map(this::convertToDTO)
            .toList();
    }
    
    public VendaDTO findById(Long id) {
        Venda venda = vendaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Venda não encontrada"));
        return convertToDTO(venda);
    }
    
    @Transactional
    public VendaDTO updateStatus(Long id, String status) {
        Venda venda = vendaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Venda não encontrada"));
        venda.setStatus(status);
        Venda saved = vendaRepository.save(venda);
        return convertToDTO(saved);
    }
    
    private String generateNumeroVenda() {
        return "VENDA-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
    
    private VendaDTO convertToDTO(Venda venda) {
        VendaDTO dto = new VendaDTO();
        dto.setId(venda.getId());
        dto.setNumero(venda.getNumero());
        dto.setClienteId(venda.getCliente().getId());
        dto.setClienteNome(venda.getCliente().getNome());
        dto.setDataVenda(venda.getDataVenda());
        dto.setSubtotal(venda.getSubtotal());
        dto.setDesconto(venda.getDesconto());
        dto.setTotal(venda.getTotal());
        dto.setStatus(venda.getStatus());
        
        // Dados de pagamento
        dto.setFormaPagamento(venda.getFormaPagamento());
        dto.setNumeroParcelas(venda.getNumeroParcelas());
        dto.setValorEntrada(venda.getValorEntrada());
        dto.setValorParcela(venda.getValorParcela());
        dto.setBandeiraCartao(venda.getBandeiraCartao());
        dto.setUltimosDigitos(venda.getUltimosDigitos());
        
        return dto;
    }
}