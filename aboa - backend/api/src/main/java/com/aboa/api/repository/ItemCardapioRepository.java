package com.aboa.api.repository;

import com.aboa.api.model.ItemCardapio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemCardapioRepository extends JpaRepository<ItemCardapio, Long> {

    List<ItemCardapio> findByRestauranteId(Long restauranteId);

    // Se precisar filtrar por categoria também:
    // List<ItemCardapio> findByRestauranteIdAndCategoriaIgnoreCase(Long
    // restauranteId, String categoria);
}