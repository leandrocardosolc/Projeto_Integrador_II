package com.aboa.api.controller;

import com.aboa.api.dto.RecomendacaoRespostaDTO;
import com.aboa.api.dto.RestauranteDTO;
import com.aboa.api.dto.RestauranteProfileDTO;
import com.aboa.api.model.Restaurante;
import com.aboa.api.model.Usuario;
import com.aboa.api.repository.RestauranteRepository;
import com.aboa.api.repository.UsuarioRepository;
import com.aboa.api.service.RestauranteService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class RestauranteController {

    @Autowired
    private RestauranteService restauranteService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RestauranteRepository restauranteRepository;

    // --- Endpoint para criar Restaurante ---
    @PostMapping("/restaurantes")
    @PreAuthorize("isAuthenticated()") // Apenas usuários logados (qualquer papel) podem tentar cadastrar um restaurante
    public ResponseEntity<?> criarRestaurante(@Valid @RequestBody RestauranteDTO restauranteDTO) {
        try {
            // Obtém o email (username) do usuário logado do contexto de segurança do Spring Security
            String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
            // Busca o objeto Usuario logado no banco de dados
            Usuario usuarioLogado = usuarioRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new EntityNotFoundException("Usuário logado não encontrado para associar ao restaurante."));

            // Passa o DTO do restaurante E o objeto Usuario logado para o serviço
            RestauranteDTO novoRestaurante = restauranteService.criarRestaurante(restauranteDTO, usuarioLogado);
            return ResponseEntity.status(HttpStatus.CREATED).body(novoRestaurante);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (EntityNotFoundException e) {
            // Se o usuário logado não for encontrado (apesar de isAuthenticated), é um erro interno
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro interno: Usuário logado não encontrado no sistema.");
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    // --- Outros Endpoints (Mantidos como estão) ---
    @GetMapping("/restaurantes")
    public ResponseEntity<List<RestauranteDTO>> listarTodosRestaurantes() {
        List<RestauranteDTO> restaurantes = restauranteService.buscarTodosRestaurantes();
        return ResponseEntity.ok(restaurantes);
    }

    @GetMapping("/restaurantes/{id}")
    public ResponseEntity<?> buscarRestaurantePorId(@PathVariable Long id) {
        try {
            RestauranteDTO restaurante = restauranteService.buscarRestaurantePorId(id);
            return ResponseEntity.ok(restaurante);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/restaurantes/{id}")
    @PreAuthorize("isAuthenticated() and hasRole('RESTAURANT_OWNER')")
    public ResponseEntity<?> atualizarRestaurante(@PathVariable Long id,
            @Valid @RequestBody RestauranteDTO restauranteDTO) {
        try {
            String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
            Usuario usuarioLogado = usuarioRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new EntityNotFoundException("Usuário logado não encontrado."));

            RestauranteDTO restauranteAtualizado = restauranteService.atualizarRestaurante(id, restauranteDTO, usuarioLogado);
            return ResponseEntity.ok(restauranteAtualizado);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage()); // Mudei para FORBIDDEN para permissão
        }
    }

    @DeleteMapping("/restaurantes/{id}")
    @PreAuthorize("isAuthenticated() and hasRole('RESTAURANT_OWNER')")
    public ResponseEntity<?> deletarRestaurante(@PathVariable Long id) {
        try {
            String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
            Usuario usuarioLogado = usuarioRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new EntityNotFoundException("Usuário logado não encontrado."));

            restauranteService.deletarRestaurante(id, usuarioLogado);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage()); // Mudei para FORBIDDEN para permissão
        }
    }

    @GetMapping({ "/recomendacoes", "/recomendacoes/" })
    public ResponseEntity<RecomendacaoRespostaDTO> buscarRecomendacoes(
            @RequestParam(name = "busca", required = false) String termoBusca) {
        RecomendacaoRespostaDTO resposta = restauranteService.buscarRestaurantesParaRecomendacao(termoBusca);
        return ResponseEntity.ok(resposta);
    }

    @GetMapping("/restaurantes/me")
    @PreAuthorize("isAuthenticated() and hasRole('RESTAURANT_OWNER')")
    public ResponseEntity<?> getMyRestaurantProfile() {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuarioLogado = usuarioRepository.findByEmail(userEmail)
                .orElseThrow(() -> new EntityNotFoundException("Usuário logado não encontrado."));

        Restaurante restaurante = restauranteRepository.findByUsuarioProprietario(usuarioLogado)
                .orElseThrow(() -> new EntityNotFoundException("Restaurante não encontrado para o usuário logado."));
        
        RestauranteProfileDTO profileDto = new RestauranteProfileDTO(restaurante);
        return ResponseEntity.ok(profileDto);
    }
}