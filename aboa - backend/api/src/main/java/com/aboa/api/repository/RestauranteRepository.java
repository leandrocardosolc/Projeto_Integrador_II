package com.aboa.api.repository;

import com.aboa.api.model.Restaurante; // Já existente
import com.aboa.api.model.Usuario; // Importe a model Usuario
import org.springframework.data.jpa.repository.JpaRepository; // Já existente
import org.springframework.data.jpa.repository.Query; // Já existente
import org.springframework.data.repository.query.Param; // Já existente
import org.springframework.stereotype.Repository; // Já existente

import java.util.List; // Já existente
import java.util.Optional; // Já existente

@Repository // Já existente
public interface RestauranteRepository extends JpaRepository<Restaurante, Long> {

    Optional<Restaurante> findByCnpj(String cnpj); // Já existente

    @Query("SELECT r FROM Restaurante r WHERE lower(r.nomeFantasia) LIKE lower(concat('%', :termo, '%')) OR lower(r.ramoAtividade) LIKE lower(concat('%', :termo, '%')) OR lower(r.endereco.cidade) LIKE lower(concat('%', :termo, '%'))")
    List<Restaurante> searchByTermo(@Param("termo") String termo); // Já existente

    // --- NOVO MÉTODO NECESSÁRIO ---
    // Adicionado para buscar um restaurante pelo seu proprietário (usuário)
    Optional<Restaurante> findByUsuarioProprietario(Usuario usuarioProprietario);

    // --- NOVO MÉTODO NECESSÁRIO ---
    // Adicionado para buscar um restaurante pelo email (do restaurante)
    Optional<Restaurante> findByEmail(String email);
}