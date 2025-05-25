package com.aboa.api.dto;

import com.aboa.api.model.Endereco; // Importe a model Endereco
import com.aboa.api.model.Restaurante; // Importe a model Restaurante
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

// Se você tiver um DTO para Endereço, importe-o aqui
// import com.aboa.api.dto.EnderecoDTO;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RestauranteProfileDTO {
    private Long id;
    private String nomeFantasia;
    private String razaoSocial;
    private String cnpj;
    private String inscricaoEstadual;
    private String email;
    private String telefone;
    private String ramoAtividade;
    private String descricao;
    private String linkMapa;
    private String logoUrl;
    private String coverImageUrl;
    
    // Objeto Endereco embutido no DTO
    private Endereco endereco; // Ou crie um EnderecoDTO se preferir mais controle

    // Outros campos que você queira expor, como itens do cardápio (se forem DTOs)
    // private List<ItemCardapioDTO> itensCardapio; 
    // private String horarioFuncionamento; // Se for string na model


    // Construtor para converter da Model Restaurante para RestauranteProfileDTO
    public RestauranteProfileDTO(Restaurante restaurante) {
        this.id = restaurante.getId();
        this.nomeFantasia = restaurante.getNomeFantasia();
        this.razaoSocial = restaurante.getRazaoSocial();
        this.cnpj = restaurante.getCnpj();
        this.inscricaoEstadual = restaurante.getInscricaoEstadual();
        this.email = restaurante.getEmail();
        this.telefone = restaurante.getTelefone();
        this.ramoAtividade = restaurante.getRamoAtividade();
        this.descricao = restaurante.getDescricao();
        this.linkMapa = restaurante.getLinkMapa();
        this.logoUrl = restaurante.getLogoUrl();
        this.coverImageUrl = restaurante.getCoverImageUrl();
        
        // Mapeia o objeto Endereco (que já é @Embeddable, então pode ser diretamente mapeado aqui)
        this.endereco = restaurante.getEndereco(); // Assumindo que Endereco é uma Model @Embeddable

        // Se você tiver itens de cardápio e quiser incluí-los (e se tiver um ItemCardapioDTO)
        // if (restaurante.getItensCardapio() != null) {
        //     this.itensCardapio = restaurante.getItensCardapio().stream()
        //         .map(ItemCardapioDTO::new)
        //         .collect(Collectors.toList());
        // }
    }
}
