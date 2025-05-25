package com.aboa.api.service;

import com.aboa.api.model.ItemCardapio;
import com.aboa.api.model.Restaurante;
import com.aboa.api.repository.ItemCardapioRepository;
import com.aboa.api.repository.RestauranteRepository;
import com.aboa.api.dto.ItemCardapioDTO; // Importe o DTO, caso precise usar em outros métodos aqui
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ItemCardapioService {

    @Autowired
    private ItemCardapioRepository itemCardapioRepository;

    @Autowired
    private RestauranteRepository restauranteRepository;

    /**
     * Busca todos os itens do cardápio associados a um determinado restaurante.
     * Este método retorna a lista de ItemCardapio (Models), que será convertida
     * para DTOs na camada do Controller.
     *
     * @param restauranteId O ID do restaurante.
     * @return Uma lista de ItemCardapio (Models).
     * @throws EntityNotFoundException se o restaurante com o ID especificado não for encontrado.
     */
    public List<ItemCardapio> buscarItensPorRestauranteModel(Long restauranteId) {
        // Primeiro, é uma boa prática verificar se o restaurante realmente existe.
        // Isso garante que não estamos buscando itens para um restaurante inexistente
        // e retorna um erro 404 (NOT FOUND) mais claro ao cliente.
        Optional<Restaurante> restauranteOptional = restauranteRepository.findById(restauranteId);
        if (restauranteOptional.isEmpty()) {
            throw new EntityNotFoundException("Restaurante com ID " + restauranteId + " não encontrado.");
        }

        // Se o restaurante existe, use o método do repositório para buscar os itens
        // associados a ele.
        // - O método findByRestauranteId(Long restauranteId) deve estar no seu ItemCardapioRepository
        return itemCardapioRepository.findByRestauranteId(restauranteId);
    }

    // Abaixo estão exemplos de como outros métodos do seu serviço podem ser ajustados
    // para trabalhar com DTOs na entrada e Models para persistência.
    // Você já tem esses métodos na sua CardapioController, eles provavelmente chamam
    // métodos correspondentes no ItemCardapioService.

    /**
     * Adiciona um novo item ao cardápio de um restaurante específico.
     * Recebe um DTO e converte para a Model antes de salvar.
     * @param restauranteId O ID do restaurante ao qual o item será adicionado.
     * @param itemDto O DTO do item a ser adicionado.
     * @return O DTO do item recém-adicionado.
     * @throws EntityNotFoundException se o restaurante não for encontrado.
     * @throws IllegalArgumentException se o itemDto for inválido ou não tiver o restauranteId.
     */
    public ItemCardapioDTO adicionarItemAoCardapio(Long restauranteId, ItemCardapioDTO itemDto) {
        // Valida se o restaurante existe
        Restaurante restaurante = restauranteRepository.findById(restauranteId)
                .orElseThrow(() -> new EntityNotFoundException("Restaurante com ID " + restauranteId + " não encontrado."));

        // Cria uma nova instância da Model ItemCardapio a partir do DTO
        ItemCardapio item = new ItemCardapio();
        item.setNome(itemDto.getNome());
        item.setDescricao(itemDto.getDescricao());
        item.setPreco(itemDto.getPreco());
        item.setCategoria(itemDto.getCategoria());
        item.setImageUrl(itemDto.getImageUrl());
        item.setRestaurante(restaurante); // Associa o objeto Restaurante ao ItemCardapio
        // Se você tiver um campo 'disponivel' em ItemCardapio, lembre-se de setá-lo aqui também.
        // item.setDisponivel(itemDto.isDisponivel()); // Exemplo

        // Salva a Model no banco de dados
        ItemCardapio savedItem = itemCardapioRepository.save(item);

        // Retorna o DTO do item salvo
        return new ItemCardapioDTO(savedItem);
    }

    /**
     * Busca um item do cardápio por ID e o retorna como DTO.
     * @param itemId O ID do item.
     * @return O DTO do item.
     * @throws EntityNotFoundException se o item não for encontrado.
     */
    public ItemCardapioDTO buscarItemPorId(Long itemId) {
        ItemCardapio item = itemCardapioRepository.findById(itemId)
            .orElseThrow(() -> new EntityNotFoundException("Item de cardápio com ID " + itemId + " não encontrado."));
        return new ItemCardapioDTO(item);
    }

    /**
     * Atualiza um item do cardápio existente.
     * Recebe um DTO e converte para a Model para atualização.
     * @param itemId O ID do item a ser atualizado.
     * @param itemDto O DTO com os dados atualizados.
     * @return O DTO do item atualizado.
     * @throws EntityNotFoundException se o item não for encontrado.
     */
    public ItemCardapioDTO atualizarItemCardapio(Long itemId, ItemCardapioDTO itemDto) {
        ItemCardapio itemExistente = itemCardapioRepository.findById(itemId)
            .orElseThrow(() -> new EntityNotFoundException("Item de cardápio com ID " + itemId + " não encontrado para atualização."));

        // Atualiza os campos da Model com base nos dados do DTO
        itemExistente.setNome(itemDto.getNome());
        itemExistente.setDescricao(itemDto.getDescricao());
        itemExistente.setPreco(itemDto.getPreco());
        itemExistente.setCategoria(itemDto.getCategoria());
        itemExistente.setImageUrl(itemDto.getImageUrl());
        // Não é comum alterar o restaurante de um item em uma atualização simples,
        // mas se for o caso, você precisaria carregar o novo Restaurante e setar.

        // Salva as alterações na Model
        ItemCardapio updatedItem = itemCardapioRepository.save(itemExistente);
        return new ItemCardapioDTO(updatedItem);
    }

    /**
     * Deleta um item do cardápio por ID.
     * @param itemId O ID do item a ser deletado.
     * @throws EntityNotFoundException se o item não for encontrado.
     */
    public void deletarItemCardapio(Long itemId) {
        if (!itemCardapioRepository.existsById(itemId)) {
            throw new EntityNotFoundException("Item de cardápio com ID " + itemId + " não encontrado para exclusão.");
        }
        itemCardapioRepository.deleteById(itemId);
    }
}