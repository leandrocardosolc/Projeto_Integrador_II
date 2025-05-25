package com.aboa.api.controller;

import com.aboa.api.dto.UsuarioCadastroDTO;
import com.aboa.api.model.Usuario;
import com.aboa.api.service.CustomUserDetailsService; // Alterado para o serviço que contém o método de registro
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private CustomUserDetailsService userDetailsService; // Alterado para CustomUserDetailsService

    @PostMapping("/registrar")
    public ResponseEntity<?> registrarUsuario(@Valid @RequestBody UsuarioCadastroDTO cadastroDTO) {
        try {
            Usuario novoUsuario = userDetailsService.registrarNovoUsuario(cadastroDTO);
            // Não retorne a senha na resposta
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Usuário registrado com sucesso! ID: " + novoUsuario.getId());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao registrar usuário: " + e.getMessage());
        }
    }

    // O endpoint de login (/api/auth/login-process) é gerenciado pelo Spring
    // Security (formLogin)
    // O endpoint de logout (/api/auth/logout) também é gerenciado pelo Spring
    // Security
}