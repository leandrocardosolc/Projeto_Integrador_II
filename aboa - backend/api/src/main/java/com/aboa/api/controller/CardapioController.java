package com.aboa.api.controller;

import com.aboa.api.dto.ItemCardapioDTO; // Importe o DTO
import com.aboa.api.model.ItemCardapio; // Importe a model ItemCardapio, pois o serviço retorna models
import com.aboa.api.service.ItemCardapioService; // Importe o serviço
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors; // Importe Collectors para usar o stream().map()

@RestController
@RequestMapping("/api/cardapio") // Base path conforme esperado pelo cardapio.js
public class CardapioController {

    @Autowired
    private ItemCardapioService itemCardapioService;

    // GET /api/cardapio?restaurante_id={id_do_restaurante}
    // Este endpoint agora retorna uma lista de ItemCardapioDTO
    @GetMapping
    public ResponseEntity<?> listarItensPorRestaurante(@RequestParam(name = "restaurante_id") Long restauranteId) {
        try {
            // 1. Chamar o serviço para obter a LISTA DE MODELS (ItemCardapio)
            // O serviço 'itemCardapioService' agora tem o método 'buscarItensPorRestauranteModel'
            // que retorna List<ItemCardapio>.
            List<ItemCardapio> itensModel = itemCardapioService.buscarItensPorRestauranteModel(restauranteId); // <-- CORRIGIDO AQUI!

            // 2. Converter a lista de Models (ItemCardapio) para uma lista de DTOs (ItemCardapioDTO)
            // Usamos o construtor do ItemCardapioDTO que aceita um ItemCardapio.
            List<ItemCardapioDTO> itensDto = itensModel.stream()
                                                    .map(ItemCardapioDTO::new) // Conversão de Model para DTO
                                                    .collect(Collectors.toList());

            return ResponseEntity.ok(itensDto);
        } catch (EntityNotFoundException e) {
            // Se o restaurante não for encontrado pelo serviço, retorna 404
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // POST /api/cardapio
    // Adiciona um novo item ao cardápio, recebendo os dados via DTO
    @PostMapping
    @PreAuthorize("isAuthenticated()") // Apenas usuários autenticados (e com permissão)
    public ResponseEntity<?> adicionarItem(@Valid @RequestBody ItemCardapioDTO itemDto) {
        if (itemDto.getRestauranteId() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("ID do restaurante é obrigatório no corpo da requisição para adicionar item.");
        }
        try {
            // Chama o serviço para adicionar o item, passando o ID do restaurante e o DTO
            ItemCardapioDTO novoItem = itemCardapioService.adicionarItemAoCardapio(itemDto.getRestauranteId(), itemDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(novoItem);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // GET /api/cardapio/{itemId} - para buscar um item específico
    @GetMapping("/{itemId}")
    public ResponseEntity<?> buscarItemPorId(@PathVariable Long itemId) {
        try {
            // Chama o serviço para buscar o item por ID, que já retorna um DTO
            ItemCardapioDTO item = itemCardapioService.buscarItemPorId(itemId);
            return ResponseEntity.ok(item);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // PUT /api/cardapio/{itemId}
    // Atualiza um item do cardápio existente, recebendo os dados via DTO
    @PutMapping("/{itemId}")
    @PreAuthorize("isAuthenticated()") // E permissão sobre o item/restaurante
    public ResponseEntity<?> atualizarItem(@PathVariable Long itemId, @Valid @RequestBody ItemCardapioDTO itemDto) {
        try {
            // Chama o serviço para atualizar o item, passando o ID do item e o DTO
            ItemCardapioDTO itemAtualizado = itemCardapioService.atualizarItemCardapio(itemId, itemDto);
            return ResponseEntity.ok(itemAtualizado);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // DELETE /api/cardapio/{itemId}
    // Deleta um item do cardápio por ID
    @DeleteMapping("/{itemId}")
    @PreAuthorize("isAuthenticated()") // E permissão
    public ResponseEntity<?> deletarItem(@PathVariable Long itemId) {
        try {
            // Chama o serviço para deletar o item
            itemCardapioService.deletarItemCardapio(itemId);
            return ResponseEntity.noContent().build(); // HTTP 204 No Content
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}