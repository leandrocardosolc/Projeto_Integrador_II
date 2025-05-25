package com.aboa.api.service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken; // Importe para autenticação
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails; // Importe UserDetails
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aboa.api.dto.EnderecoDTO;
import com.aboa.api.dto.RecomendacaoRespostaDTO;
import com.aboa.api.dto.RestauranteDTO;
import com.aboa.api.dto.RestauranteProfileDTO;
import com.aboa.api.dto.RestauranteRecomendacaoDTO;
import com.aboa.api.model.Endereco;
import com.aboa.api.model.Restaurante;
import com.aboa.api.model.Usuario;
import com.aboa.api.repository.RestauranteRepository;
import com.aboa.api.repository.UsuarioRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class RestauranteService {

    @Autowired
    private RestauranteRepository restauranteRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private CustomUserDetailsService customUserDetailsService; // Injete o UserDetailsService para recarregar o usuário

    @Transactional
    public RestauranteDTO criarRestaurante(RestauranteDTO dto, Usuario usuarioLogado) {
        restauranteRepository.findByCnpj(dto.getCnpj()).ifPresent(r -> {
            throw new IllegalArgumentException("CNPJ já cadastrado: " + dto.getCnpj());
        });

        if (restauranteRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email de restaurante já cadastrado: " + dto.getEmail());
        }

        Restaurante restaurante = new Restaurante();
        mapDtoToEntity(dto, restaurante);

        if (usuarioLogado == null) {
            throw new IllegalStateException("Usuário precisa estar logado para cadastrar um restaurante.");
        }
        restaurante.setUsuarioProprietario(usuarioLogado);

        Restaurante novoRestaurante = restauranteRepository.save(restaurante);

        // --- Lógica para atribuir o papel 'ROLE_RESTAURANT_OWNER' e ATUALIZAR A SESSÃO ---
        if (!usuarioLogado.getPapeis().contains("ROLE_RESTAURANT_OWNER")) {
            usuarioLogado.getPapeis().add("ROLE_RESTAURANT_OWNER");
            usuarioRepository.save(usuarioLogado); // Salva o usuário com o novo papel

            // FORÇA A REAUTENTICAÇÃO/ATUALIZAÇÃO DO CONTEXTO DE SEGURANÇA
            // Isso é essencial para que o Spring Security reconheça os novos papéis na sessão ativa.
            try {
                // Recarrega o UserDetails do banco de dados (agora com o novo papel)
                UserDetails updatedUserDetails = customUserDetailsService.loadUserByUsername(usuarioLogado.getEmail());
                
                // Cria um novo objeto Authentication com os UserDetails atualizados
                Authentication newAuthentication = new UsernamePasswordAuthenticationToken(
                    updatedUserDetails,
                    usuarioLogado.getSenha(), // Você pode precisar pegar a senha RAW ou usar um null se não for checar
                    updatedUserDetails.getAuthorities()
                );
                
                // Atualiza o contexto de segurança com a nova autenticação
                SecurityContextHolder.getContext().setAuthentication(newAuthentication);
                System.out.println("DEBUG: Contexto de segurança atualizado com o papel RESTAURANT_OWNER para: " + usuarioLogado.getEmail());
            } catch (Exception e) {
                System.err.println("ATENÇÃO: Erro ao reautenticar usuário após atribuição de papel: " + e.getMessage());
                // Este erro pode ser tolerado, mas o usuário precisará fazer login novamente para que o papel seja reconhecido
            }
        }
        // ----------------------------------------------------------------------------------

        return mapEntityToDto(novoRestaurante);
    }

    // --- Métodos Existentes (Mantidos) ---
    public List<RestauranteDTO> buscarTodosRestaurantes() {
        return restauranteRepository.findAll().stream()
                .map(this::mapEntityToDto)
                .collect(Collectors.toList());
    }

    public RestauranteDTO buscarRestaurantePorId(Long id) {
        Restaurante restaurante = restauranteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Restaurante não encontrado com ID: " + id));
        return mapEntityToDto(restaurante);
    }

    // Método para buscar o perfil do restaurante do usuário logado
    public RestauranteProfileDTO buscarMeuRestaurante() {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuarioLogado = usuarioRepository.findByEmail(userEmail)
                .orElseThrow(() -> new EntityNotFoundException("Usuário logado não encontrado."));

        Restaurante restaurante = restauranteRepository.findByUsuarioProprietario(usuarioLogado)
                .orElseThrow(() -> new EntityNotFoundException("Restaurante não encontrado para o usuário logado."));
        
        return new RestauranteProfileDTO(restaurante);
    }

    @Transactional
    public RestauranteDTO atualizarRestaurante(Long id, RestauranteDTO dto, Usuario usuarioLogado) {
        Restaurante restauranteExistente = restauranteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Restaurante não encontrado com ID: " + id));

        if (!restauranteExistente.getUsuarioProprietario().equals(usuarioLogado)) {
            throw new IllegalArgumentException("Acesso negado: Você não é o proprietário deste restaurante.");
        }

        mapDtoToEntity(dto, restauranteExistente);
        Restaurante atualizado = restauranteRepository.save(restauranteExistente);
        return mapEntityToDto(atualizado);
    }

    @Transactional
    public void deletarRestaurante(Long id, Usuario usuarioLogado) {
        Restaurante restauranteExistente = restauranteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Restaurante não encontrado com ID: " + id));

        if (!restauranteExistente.getUsuarioProprietario().equals(usuarioLogado)) {
            throw new IllegalArgumentException("Acesso negado: Você não é o proprietário deste restaurante.");
        }

        restauranteRepository.delete(restauranteExistente);
    }

    public RecomendacaoRespostaDTO buscarRestaurantesParaRecomendacao(String termo) {
        List<Restaurante> resultados;
        if (termo == null || termo.trim().isEmpty()) {
            resultados = restauranteRepository.findAll().stream().limit(5).collect(Collectors.toList());
        } else {
            resultados = restauranteRepository.searchByTermo(termo);
        }

        RecomendacaoRespostaDTO resposta = new RecomendacaoRespostaDTO();
        if (!resultados.isEmpty()) {
            resposta.setRecomendacaoPrincipal(mapEntityToRecomendacaoDto(resultados.get(0)));
            if (resultados.size() > 1) {
                resposta.setOutrasRecomendacoes(
                                resultados.subList(1, Math.min(resultados.size(), 4))
                                        .stream()
                                        .map(this::mapEntityToRecomendacaoDto)
                                        .collect(Collectors.toList()));
            } else {
                resposta.setOutrasRecomendacoes(Collections.emptyList());
            }
        } else {
            resposta.setRecomendacaoPrincipal(null);
            resposta.setOutrasRecomendacoes(Collections.emptyList());
        }
        return resposta;
    }

    private RestauranteRecomendacaoDTO mapEntityToRecomendacaoDto(Restaurante restaurante) {
        if (restaurante == null)
            return null;
        RestauranteRecomendacaoDTO dto = new RestauranteRecomendacaoDTO();
        dto.setId(restaurante.getId());
        dto.setNome(restaurante.getNomeFantasia());

        String descricaoRestaurante = restaurante.getDescricao();
        if (descricaoRestaurante == null || descricaoRestaurante.trim().isEmpty()) {
            descricaoRestaurante = "Especializado em " + restaurante.getRamoAtividade() + ". Localizado em "
                    + (restaurante.getEndereco() != null ? restaurante.getEndereco().getCidade()
                            : "local não informado")
                    + ".";
        }
        dto.setDescricao(descricaoRestaurante);

        if (restaurante.getCoverImageUrl() != null && !restaurante.getCoverImageUrl().isEmpty()) {
            dto.setImagem(restaurante.getCoverImageUrl());
        } else if (restaurante.getLogoUrl() != null && !restaurante.getLogoUrl().isEmpty()) {
            dto.setImagem(restaurante.getLogoUrl());
        } else {
            dto.setImagem("/imgs/placeholders/default_400_320.png");
        }

        dto.setLinkMapa(restaurante.getLinkMapa());
        dto.setAvaliacao(4.5);
        return dto;
    }

    private RestauranteDTO mapEntityToDto(Restaurante restaurante) {
        RestauranteDTO dto = new RestauranteDTO();
        dto.setId(restaurante.getId());
        dto.setNomeFantasia(restaurante.getNomeFantasia());
        dto.setRazaoSocial(restaurante.getRazaoSocial());
        dto.setCnpj(restaurante.getCnpj());
        dto.setInscricaoEstadual(restaurante.getInscricaoEstadual());
        dto.setEmail(restaurante.getEmail());
        dto.setTelefone(restaurante.getTelefone());
        dto.setRamoAtividade(restaurante.getRamoAtividade());
        dto.setDescricao(restaurante.getDescricao());
        dto.setLinkMapa(restaurante.getLinkMapa());
        dto.setLogoUrl(restaurante.getLogoUrl());
        dto.setCoverImageUrl(restaurante.getCoverImageUrl());

        if (restaurante.getUsuarioProprietario() != null) {
            dto.setUsuarioProprietarioId(restaurante.getUsuarioProprietario().getId());
        }

        if (restaurante.getEndereco() != null) {
            EnderecoDTO enderecoDTO = new EnderecoDTO();
            enderecoDTO.setCep(restaurante.getEndereco().getCep());
            enderecoDTO.setLogradouro(restaurante.getEndereco().getLogradouro());
            enderecoDTO.setNumero(restaurante.getEndereco().getNumero());
            enderecoDTO.setComplemento(restaurante.getEndereco().getComplemento());
            enderecoDTO.setBairro(restaurante.getEndereco().getBairro());
            enderecoDTO.setCidade(restaurante.getEndereco().getCidade());
            enderecoDTO.setEstado(restaurante.getEndereco().getEstado());
            dto.setEndereco(enderecoDTO);
        }
        return dto;
    }

    private void mapDtoToEntity(RestauranteDTO dto, Restaurante restaurante) {
        restaurante.setNomeFantasia(dto.getNomeFantasia());
        restaurante.setRazaoSocial(dto.getRazaoSocial());
        restaurante.setCnpj(dto.getCnpj());
        restaurante.setInscricaoEstadual(dto.getInscricaoEstadual());
        restaurante.setEmail(dto.getEmail());
        restaurante.setTelefone(dto.getTelefone());
        restaurante.setRamoAtividade(dto.getRamoAtividade());
        restaurante.setDescricao(dto.getDescricao());
        restaurante.setLinkMapa(dto.getLinkMapa());
        restaurante.setLogoUrl(dto.getLogoUrl());
        restaurante.setCoverImageUrl(dto.getCoverImageUrl());

        if (dto.getEndereco() != null) {
            Endereco endereco = restaurante.getEndereco() == null ? new Endereco() : restaurante.getEndereco();
            endereco.setCep(dto.getEndereco().getCep());
            endereco.setLogradouro(dto.getEndereco().getLogradouro());
            endereco.setNumero(dto.getEndereco().getNumero());
            endereco.setComplemento(dto.getEndereco().getComplemento());
            endereco.setBairro(dto.getEndereco().getBairro());
            endereco.setCidade(dto.getEndereco().getCidade());
            endereco.setEstado(dto.getEndereco().getEstado());
            restaurante.setEndereco(endereco);
        } else {
            restaurante.setEndereco(null);
        }
    }
}