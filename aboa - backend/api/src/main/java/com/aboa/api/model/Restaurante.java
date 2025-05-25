package com.aboa.api.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "restaurantes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Restaurante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nomeFantasia;

    @Column(nullable = false)
    private String razaoSocial;

    @Column(nullable = false, unique = true)
    private String cnpj;

    private String inscricaoEstadual; // Opcional

    @Column(nullable = false)
    private String email; // Email de contato do restaurante

    @Column(nullable = false)
    private String telefone;

    @Column(nullable = false)
    private String ramoAtividade; // Ex: HAMBURGUERIA, PIZZARIA, JAPONESA (pode ser um Enum também)

    @Embedded // Embutindo a classe Endereco
    private Endereco endereco;

    @Column(length = 1000) // Opcional: definir um tamanho maior para a descrição
    private String descricao;

    private String linkMapa;

    private String logoUrl;
    private String coverImageUrl;

    // Relacionamento com o usuário que cadastrou/gerencia o restaurante (opcional,
    // mas útil)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_proprietario_id")
    private Usuario usuarioProprietario;

    // Relacionamento com itens do cardápio (um restaurante tem muitos itens)
    @OneToMany(mappedBy = "restaurante", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ItemCardapio> itensCardapio = new ArrayList<>();

    // Outros campos que podem ser úteis:
    // private String horarioFuncionamento;
    // private List<String> formasPagamento;
    // private Double notaMedia; // Se for calcular avaliações
}