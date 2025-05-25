package com.aboa.api.dto;

import com.aboa.api.model.Usuario;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
// Remova List import se não for usar agora
// import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioProfileDTO {
    private Long id;
    private String nomeCompleto;
    private String email;
    private String telefone;
    private LocalDate dataNascimento;
    private String cpf;
    private String genero;
    private String profileImageUrl;

    // REMOVA OU COMENTE ESSAS LINHAS SE ELAS EXISTIREM POR ENQUANTO
    // private List<EnderecoDTO> enderecos;
    // private List<FormaPagamentoDTO> formasPagamento;

    public UsuarioProfileDTO(Usuario usuario) {
        this.id = usuario.getId();
        this.nomeCompleto = usuario.getNomeCompleto();
        this.email = usuario.getEmail();
        this.telefone = usuario.getTelefone();
        this.dataNascimento = usuario.getDataNascimento();
        this.cpf = usuario.getCpf();
        this.genero = usuario.getGenero();
        this.profileImageUrl = usuario.getProfileImageUrl();

        // REMOVA OU COMENTE ESTA LÓGICA POR ENQUANTO
        // if (usuario.getEnderecos() != null) {
        //     this.enderecos = usuario.getEnderecos().stream()
        //         .map(EnderecoDTO::new)
        //         .collect(Collectors.toList());
        // }
        // if (usuario.getFormasPagamento() != null) { /* ... */ }
    }
}