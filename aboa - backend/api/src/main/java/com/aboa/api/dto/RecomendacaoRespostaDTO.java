package com.aboa.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class RecomendacaoRespostaDTO {
    @JsonProperty("recomendacao_principal")
    private RestauranteRecomendacaoDTO recomendacaoPrincipal;

    @JsonProperty("outras_recomendacoes")
    private List<RestauranteRecomendacaoDTO> outrasRecomendacoes;
}