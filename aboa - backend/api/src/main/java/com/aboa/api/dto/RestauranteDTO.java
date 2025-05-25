package com.aboa.api.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RestauranteDTO {

    private Long id;

    @NotBlank(message = "Nome fantasia é obrigatório")
    private String nomeFantasia;

    @NotBlank(message = "Razão social é obrigatória")
    private String razaoSocial;

    @NotBlank(message = "CNPJ é obrigatório")
    @Pattern(regexp = "\\d{2}\\.\\d{3}\\.\\d{3}/\\d{4}-\\d{2}", message = "CNPJ inválido. Formato esperado: XX.XXX.XXX/XXXX-XX")
    private String cnpj;

    private String inscricaoEstadual;

    @NotBlank(message = "Email do restaurante é obrigatório")
    @Email(message = "Email do restaurante inválido")
    private String email;

    @NotBlank(message = "Telefone do restaurante é obrigatório")
    private String telefone;

    @NotBlank(message = "Ramo de atividade é obrigatório")
    private String ramoAtividade;

    @Valid
    private EnderecoDTO endereco;

    private String logoUrl;
    private String coverImageUrl;
    private String descricao; // Campo que adicionamos
    private String linkMapa; // <<<<<< GARANTA QUE ESTE CAMPO ESTEJA AQUI <<<<<<

    private Long usuarioProprietarioId;
}