package com.aboa.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RestauranteRecomendacaoDTO {
    @JsonProperty("estabelecimento_id") // Para corresponder ao JS
    private Long id; // Mantemos como id internamente, mas serializa como estabelecimento_id

    private String nome;
    private String descricao;
    private String imagem; // Virá do coverImageUrl ou logoUrl

    @JsonProperty("link_mapa") // Para corresponder ao JS
    private String linkMapa;

    private Double avaliacao; // O JS espera estrelas, vamos enviar a nota
}