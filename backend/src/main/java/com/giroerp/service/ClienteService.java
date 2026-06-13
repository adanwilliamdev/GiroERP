package com.giroerp.service;

import com.giroerp.dto.ClienteDTO;
import com.giroerp.model.Cliente;
import com.giroerp.repository.ClienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ClienteService {
    
    private final ClienteRepository clienteRepository;
    
    @Transactional
    public ClienteDTO create(ClienteDTO clienteDTO) {
        System.out.println("Criando cliente: " + clienteDTO);
        
        Cliente cliente = new Cliente();
        cliente.setNome(clienteDTO.getNome());
        cliente.setCpfCnpj(clienteDTO.getCpfCnpj());
        cliente.setEmail(clienteDTO.getEmail());
        cliente.setTelefone(clienteDTO.getTelefone());
        cliente.setEndereco(clienteDTO.getEndereco());
        cliente.setCidade(clienteDTO.getCidade());
        cliente.setEstado(clienteDTO.getEstado());
        cliente.setCep(clienteDTO.getCep());
        cliente.setAtivo(true);
        
        try {
            cliente = clienteRepository.save(cliente);
            System.out.println("Cliente salvo com ID: " + cliente.getId());
        } catch (Exception e) {
            System.err.println("Erro ao salvar cliente: " + e.getMessage());
            throw new RuntimeException("Erro ao salvar cliente: " + e.getMessage());
        }
        
        return convertToDTO(cliente);
    }
    
    public ClienteDTO findById(Long id) {
        Cliente cliente = clienteRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
        return convertToDTO(cliente);
    }
    
    public Page<ClienteDTO> findAll(Pageable pageable) {
        return clienteRepository.findAll(pageable).map(this::convertToDTO);
    }
    
    @Transactional
    public ClienteDTO update(Long id, ClienteDTO clienteDTO) {
        Cliente cliente = clienteRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
        
        cliente.setNome(clienteDTO.getNome());
        cliente.setCpfCnpj(clienteDTO.getCpfCnpj());
        cliente.setEmail(clienteDTO.getEmail());
        cliente.setTelefone(clienteDTO.getTelefone());
        cliente.setEndereco(clienteDTO.getEndereco());
        cliente.setCidade(clienteDTO.getCidade());
        cliente.setEstado(clienteDTO.getEstado());
        cliente.setCep(clienteDTO.getCep());
        
        cliente = clienteRepository.save(cliente);
        return convertToDTO(cliente);
    }
    
    @Transactional
    public void delete(Long id) {
        clienteRepository.deleteById(id);
    }
    
    private ClienteDTO convertToDTO(Cliente cliente) {
        return ClienteDTO.builder()
            .id(cliente.getId())
            .nome(cliente.getNome())
            .cpfCnpj(cliente.getCpfCnpj())
            .email(cliente.getEmail())
            .telefone(cliente.getTelefone())
            .endereco(cliente.getEndereco())
            .cidade(cliente.getCidade())
            .estado(cliente.getEstado())
            .cep(cliente.getCep())
            .ativo(cliente.getAtivo())
            .createdAt(cliente.getCreatedAt())
            .updatedAt(cliente.getUpdatedAt())
            .build();
    }
}