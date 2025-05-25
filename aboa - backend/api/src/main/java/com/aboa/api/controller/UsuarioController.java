package com.aboa.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aboa.api.dto.UsuarioProfileDTO;
import com.aboa.api.model.Usuario;
import com.aboa.api.repository.UsuarioRepository;

import jakarta.persistence.EntityNotFoundException;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // --- Endpoint de CADASTRO de Usuário ---
    @PostMapping
    public ResponseEntity<?> cadastrarUsuario(@RequestBody Usuario usuario) {
        if (usuario.getEmail() == null || usuario.getEmail().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email é obrigatório.");
        }
        
        if (usuarioRepository.findByEmail(usuario.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email já cadastrado.");
        }
        
        if (usuario.getSenha() == null || usuario.getSenha().length() < 6) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("A senha deve ter no mínimo 6 caracteres.");
        }

        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));

        try {
            Usuario novoUsuario = usuarioRepository.save(usuario);
            novoUsuario.setSenha(null); // Limpa a senha do objeto antes de serializar para JSON
            return ResponseEntity.status(HttpStatus.CREATED).body(novoUsuario);
        } catch (Exception e) {
            System.err.println("Erro ao salvar usuário: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro interno ao cadastrar usuário.");
        }
    }

    // --- Endpoint para buscar o PERFIL DO USUÁRIO LOGADO ---
    // (Este é o endpoint que contausuario.js vai chamar)
    // O Spring Security gerencia a sessão via cookies.
    // O navegador automaticamente envia os cookies de sessão após o login.
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()") // Garante que apenas usuários logados podem acessar
    public ResponseEntity<?> getMyProfile() {
        // Obtém o e-mail (ou username) do usuário logado do contexto de segurança do Spring Security
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();

        Usuario usuario = usuarioRepository.findByEmail(userEmail)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado."));

        UsuarioProfileDTO profileDto = new UsuarioProfileDTO(usuario);
        return ResponseEntity.ok(profileDto);
    }

    // --- Endpoint para buscar perfil por ID (geralmente para ADMIN ou para o próprio usuário) ---
    @GetMapping("/{id}")
    // A segurança aqui é crucial: apenas o próprio usuário ou um ADMIN deve acessar.
    // Se você não usa JWT, o `authentication.principal` pode ser um objeto `UserDetails`
    // que não tem um método `getId()` diretamente, ou pode ser apenas o username (email).
    // A forma mais segura para comparar o ID do usuário autenticado é buscar no DB pelo email.
    @PreAuthorize("isAuthenticated() and (#id == @usuarioRepository.findByEmail(authentication.principal.username).get().id or hasRole('ADMIN'))")
    public ResponseEntity<?> getUserProfileById(@PathVariable Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuário com ID " + id + " não encontrado."));

        UsuarioProfileDTO profileDto = new UsuarioProfileDTO(usuario);
        return ResponseEntity.ok(profileDto);
    }

    // --- Endpoint para ATUALIZAR o perfil do usuário logado ---
    @PutMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateMyProfile(@RequestBody UsuarioProfileDTO profileDto) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();

        Usuario usuarioExistente = usuarioRepository.findByEmail(userEmail)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado."));

        usuarioExistente.setNomeCompleto(profileDto.getNomeCompleto());
        usuarioExistente.setTelefone(profileDto.getTelefone());
        usuarioExistente.setDataNascimento(profileDto.getDataNascimento());
        usuarioExistente.setGenero(profileDto.getGenero());
        usuarioExistente.setProfileImageUrl(profileDto.getProfileImageUrl());

        Usuario usuarioAtualizado = usuarioRepository.save(usuarioExistente);
        usuarioAtualizado.setSenha(null); 
        return ResponseEntity.ok(new UsuarioProfileDTO(usuarioAtualizado));
    }
    
    // --- Endpoint para EXCLUIR CONTA ---
    @DeleteMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> deleteMyAccount() {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();

        Usuario usuario = usuarioRepository.findByEmail(userEmail)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado."));

        usuarioRepository.delete(usuario);
        return ResponseEntity.noContent().build();
    }

    // --- Endpoint para ALTERAR SENHA (RECOMENDADO SEPARADO POR SEGURANÇA) ---
    // Você precisaria de um DTO para Alterar Senha (ex: AlterarSenhaRequestDTO com senhaAtual, novaSenha, confirmarNovaSenha)
    /*
    @PostMapping("/me/alterar-senha")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> alterarSenha(@RequestBody AlterarSenhaRequestDTO senhaDto) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuario = usuarioRepository.findByEmail(userEmail)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado."));

        if (!passwordEncoder.matches(senhaDto.getSenhaAtual(), usuario.getSenha())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Senha atual incorreta.");
        }
        if (!senhaDto.getNovaSenha().equals(senhaDto.getConfirmarNovaSenha())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Nova senha e confirmação não coincidem.");
        }
        if (senhaDto.getNovaSenha().length() < 6) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Nova senha muito curta.");
        }

        usuario.setSenha(passwordEncoder.encode(senhaDto.getNovaSenha()));
        usuarioRepository.save(usuario);

        return ResponseEntity.ok("Senha alterada com sucesso.");
    }
    */
}