package com.aboa.api.dto;

import com.aboa.api.model.ItemCardapio; // Importar a model ItemCardapio
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor; // ADICIONAR ESTA IMPORTAÇÃO
import lombok.AllArgsConstructor; // ADICIONAR ESTA IMPORTAÇÃO (se for usar para construir DTOs diretamente)
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor // ADICIONE ESTA ANOTAÇÃO DO LOMBOK para gerar o construtor padrão
@AllArgsConstructor // Opcional, mas útil se você for criar DTOs passando todos os campos
public class ItemCardapioDTO {

    private Long id;

    @NotBlank(message = "Nome do item é obrigatório")
    private String nome;

    private String descricao;

    @NotNull(message = "Preço é obrigatório")
    @DecimalMin(value = "0.01", message = "Preço deve ser maior que zero")
    private BigDecimal preco;

    private String categoria;

    @JsonProperty("imagem_url") // Para corresponder ao JS
    private String imageUrl;

    private Long restauranteId;

    // ESTE CONSTRUTOR É APENAS PARA CONVERTER MODEL PARA DTO NA SAÍDA (GET)
    // Ele não é usado pelo Jackson para desserializar JSON de entrada.
    public ItemCardapioDTO(ItemCardapio itemCardapio) {
        this.id = itemCardapio.getId();
        this.nome = itemCardapio.getNome();
        this.descricao = itemCardapio.getDescricao();
        this.preco = itemCardapio.getPreco();
        this.categoria = itemCardapio.getCategoria();
        this.imageUrl = itemCardapio.getImageUrl();

        if (itemCardapio.getRestaurante() != null) {
            this.restauranteId = itemCardapio.getRestaurante().getId();
        } else {
            this.restauranteId = null;
        }
    }
}