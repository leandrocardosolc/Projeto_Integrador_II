# ABOA 
📝 Descrição
[cite_start]ABOA é um aplicativo de recomendação de restaurantes. [cite_start]Ele foi desenvolvido para gerenciar usuários, restaurantes e seus respectivos cardápios, além de fornecer funcionalidades de autenticação, cadastro e busca. [cite_start]O projeto visa ser o core de dados e lógica para uma plataforma onde usuários podem descobrir restaurantes com base em suas preferências.

✨ Funcionalidades
* [cite_start]**Cadastro de Usuário:** Permite o registro de novos usuários na plataforma.
* [cite_start]**Autenticação de Usuário:** Sistema de login seguro baseado em Spring Security.
* **Gerenciamento de Perfil de Usuário:**
    * [cite_start]Visualização do perfil do usuário logado.
* [cite_start]**Cadastro de Restaurante:** Permite que usuários se tornem proprietários e registrem seus restaurantes, com atribuição automática do papel `ROLE_RESTAURANT_OWNER` ao usuário logado.
* **Gerenciamento de Restaurante:**
    * [cite_start]Visualização perfil de um restaurante (dados básicos, endereço, URLs de imagem).
* **Gestão de Cardápio:**
    * [cite_start]Listagem de itens do cardápio de um restaurante específico.
    * [cite_start]Adição de novos itens ao cardápio de um restaurante.
    * [cite_start]Busca de itens do cardápio por ID.
    * [cite_start]Atualização de itens existentes no cardápio.
    * [cite_start]Exclusão de itens do cardápio.
* [cite_start]**Busca e Recomendação de Restaurantes:** Permite buscar restaurantes por termo (nome, ramo de atividade, cidade) e retorna uma recomendação principal e outras recomendações.
* [cite_start]**Tratamento Global de Exceções:** Gerenciamento centralizado de erros para `EntityNotFoundException`, `IllegalArgumentException` e erros de validação (`MethodArgumentNotValidException`).
* [cite_start]**Segurança:** Implementação de Spring Security para autenticação via formulário, autorização baseada em roles (`@PreAuthorize`) e configuração CORS.

🚀 Tecnologias Utilizadas
* [cite_start]**Java:** Versão 17 
* [cite_start]**Spring Boot:** Versão 3.5.0 (Framework principal para desenvolvimento de aplicações Java).
    * [cite_start]**Spring Boot Starter Data JPA:** Para integração com JPA e simplificação do acesso a dados.
    * [cite_start]**Spring Boot Starter Web:** Para construção de APIs RESTful.
    * [cite_start]**Spring Boot Starter Security:** Para autenticação e autorização robustas.
    * [cite_start]**Spring Boot Starter Validation:** Para validação de dados usando Jakarta Bean Validation.
    * [cite_start]**Spring Boot Starter Test:** Para testes de integração e unitários.
* **Banco de Dados:**
    * [cite_start]**H2 Database:** Banco de dados em memória para desenvolvimento e testes.
    * [cite_start]Configurado para `create-drop` e com console acessível em `http://localhost:8080/h2-console`.
    * [cite_start]**PostgreSQL:** Suporte para banco de dados relacional em produção (configurações comentadas no `application.properties` para uso em desenvolvimento com H2).
* [cite_start]**Maven:** Para gerenciamento de dependências e construção do projeto.
* [cite_start]**Lombok:** Para reduzir o código boilerplate (getters, setters, construtores).
* [cite_start]**Jakarta Persistence API (JPA) / Hibernate:** Para mapeamento objeto-relacional.
* [cite_start]**Jackson:** Para serialização e desserialização JSON (incluído via `spring-boot-starter-web`).

⚙️ **Como Instalar e Rodar**
[cite_start]Siga os passos abaixo para configurar e executar a ABOA em sua máquina local.

### Pré-requisitos
* [cite_start]JDK 17 ou superior.
* [cite_start]Maven 3.x.x.
* [cite_start]Node.js e npm (ou yarn) instalados.
* [cite_start]Um servidor web local (como o Live Server do VS Code).

### Passos de Instalação e Execução
1.  **Clone o repositório do projeto:**
    ```bash
    git clone [https://github.com/leandrocardosolc/Projeto_Integrador_II](https://github.com/leandrocardosolc/Projeto_Integrador_II)
    ```
    (Este é o repositório principal que contém tanto o backend quanto o frontend em suas respectivas subpastas, conforme sua estrutura.)

2.  **Inicie a Aplicação (Backend - Spring Boot):**
    * [cite_start]Navegue até o diretório do backend da API: `cd Projeto_Integrador_II/aboa - backend/api`.
    * [cite_start]Compile o projeto com Maven: `mvn clean install`.
    * [cite_start]Execute a aplicação Spring Boot: `mvn spring-boot:run`. [cite_start]A aplicação será iniciada na porta `8080`.

3.  **Inicie o Frontend com Live Server:**
    * [cite_start]Abra uma nova janela/aba do terminal (mantenha o backend rodando).
    * [cite_start]Navegue até o diretório do seu frontend: `cd Projeto_Integrador_II/aboa`.
    * [cite_start]**Se você usa VS Code:** Abra a pasta raiz do seu frontend no VS Code (Ex: `Projeto_Integrador_II/aboa`).
    * [cite_start]Clique com o botão direito no arquivo `aboa2.html` e selecione "Open with Live Server".
    * [cite_start]O navegador deverá abrir em `http://127.0.0.1:5500/aboa2.html` ou `http://localhost:5500/aboa2.html`.
    * [cite_start]**(Importante):** A API já está configurada para permitir requisições de `http://localhost:5500` e `http://127.0.0.1:5500` para evitar problemas de CORS.

    * [cite_start]**Se você usa outro servidor web local (ex: npm `http-server`):** Instale-o globalmente (`npm install -g http-server`) e execute na pasta do frontend:
        ```bash
        http-server . -p 5500
        ```
        Em seguida, acesse `http://localhost:5500/aboa2.html` no seu navegador.

### Passo a Passo: Testando as Funcionalidades do ABOA com o Frontend
[cite_start]Antes de começar, certifique-se de que a sua API ABOA (o projeto Spring Boot) está rodando na porta `8080`. [cite_start]Se não estiver, siga as instruções na seção "⚙️ Como Instalar e Rodar" do README.

1.  **Iniciar o Frontend com Live Server:**
    * [cite_start]Abra a pasta do seu projeto frontend (onde estão `aboa2.html`, `cadastro.html`, `login.html`, etc.) no VS Code.
    * [cite_start]Clique com o botão direito no arquivo `aboa2.html` e selecione "Open with Live Server".
    * [cite_start]O navegador deverá abrir na URL `http://127.0.0.1:5500/aboa2.html` ou `http://localhost:5500/aboa2.html`.

2.  **Fazer um Cadastro de Usuário:**
    * [cite_start]Na página inicial do ABOA (`aboa2.html`), clique em "Crie sua conta" no cabeçalho ou no link "Ainda não tem conta?".
    * [cite_start]Na página de login, isso o levará para `cadastro.html`.
    * [cite_start]Preencha os campos do formulário de cadastro de usuário:
        * **Nome completo:** `Usuário Teste`
        * **E-mail:** `usuario.teste@example.com`
        * **Senha:** `senha123`
        * **Confirmar senha:** `senha123`
        * Marque a caixa "Concordo com os Termos de Uso e Política de Privacidade".
    * [cite_start]Clique no botão "Cadastrar".
    * [cite_start]Você deverá ver uma mensagem de sucesso (geralmente um alerta ou redirecionamento para a página de login) indicando que o usuário foi registrado.

3.  **Sair da Aplicação (Se Estiver Logado):**
    * [cite_start]Se após o cadastro você for automaticamente logado ou redirecionado para alguma página logada, procure pelo link "Sair" no cabeçalho e clique nele.
    * [cite_start]Isso garantirá que você esteja deslogado para os próximos passos, caso a lógica de negócio exija isso (por exemplo, um usuário precisa estar logado para cadastrar um restaurante, mas *não pode ser já um proprietário de restaurante* se o fluxo exigir isso).

4.  **Fazer um Cadastro de Restaurante:**
    * [cite_start]Primeiro, você precisará fazer login com o usuário que você acabou de criar.
    * [cite_start]Vá para `login.html` (se não estiver lá) e faça login com `usuario.teste@example.com` e `senha123`.
    * [cite_start]Após o login, navegue para a página de cadastro de restaurante.
    * [cite_start]Você pode encontrá-la no rodapé da `aboa2.html` ("Cadastre seu comércio") ou em links em outras páginas como `cadastro.html` e `contausuario.html`.
    * [cite_start]Isso o levará para `cadastrorestaurante.html`.
    * [cite_start]Preencha os campos do formulário de cadastro de estabelecimento:
        * **Razão Social:** `Restaurante Teste Ltda.`
        * **Nome Fantasia:** `Comida Boa`
        * [cite_start]**CNPJ:** `00.000.000/0001-00` (Certifique-se de que é um CNPJ válido e não duplicado) 
        * [cite_start]**Inscrição Estadual:** `Isento` (marque a caixa "Isento de Inscrição Estadual") 
        * [cite_start]**Ramo de Atividade:** `HAMBURGUERIA` (ou outra opção relevante) 
        * [cite_start]**CEP:** `08000-000` 
        * [cite_start]**Endereço (Logradouro):** `Rua das Delícias` 
        * [cite_start]**Número:** `123` 
        * [cite_start]**Complemento:** `Apto 10` 
        * [cite_start]**Bairro:** `Centro` 
        * [cite_start]**Cidade:** `Cotia` 
        * [cite_start]**Estado:** `SP` 
        * [cite_start]**Telefone do Estabelecimento:** `(11) 99999-9999` 
        * [cite_start]**E-mail do Estabelecimento:** `contato@comidaboa.com` 
        * [cite_start]**URL do Logotipo:** `https://i.imgur.com/logo-restaurante.png` (use uma URL de imagem real ou um placeholder) 
        * [cite_start]**URL da Imagem de Capa:** `https://i.imgur.com/capa-restaurante.png` (use uma URL de imagem real ou um placeholder) 
        * [cite_start]**Descrição do Estabelecimento:** `Um lugar aconchegante com os melhores lanches.` 
        * [cite_start]**Link do Mapa:** `https://maps.app.goo.gl/exemplo` (use um link real ou um placeholder) 
        * [cite_start]Marque a caixa "Concordo com os Termos de Uso e Política de Privacidade".
    * [cite_start]Clique no botão "Cadastrar".
    * [cite_start]Você deverá ser redirecionado ou ver uma mensagem de sucesso.
    * [cite_start]O usuário logado agora terá a role `ROLE_RESTAURANT_OWNER`.

5.  **Adicionar Itens ao Cardápio do Restaurante:**
    * [cite_start]Após cadastrar o restaurante, você deverá estar logado como proprietário.
    * Navegue para a página de gerenciamento do restaurante. [cite_start]Tipicamente, isso seria `contarestaurante.html` ou uma página similar.
    * [cite_start]Procure pela seção de "Itens do Cardápio" e o botão "+ Adicionar Item".
    * [cite_start]Clique nele para abrir o modal de adição de item.
    * [cite_start]Preencha os campos do formulário de item do cardápio:
        * **Nome do Item:** `Hambúrguer Clássico`
        * [cite_start]**Descrição:** `Carne bovina, queijo, alface, tomate, picles e molho especial.` 
        * [cite_start]**Preço (R$):** `25.90` 
        * [cite_start]**Categoria:** `Hambúrgueres` (selecione na lista) 
        * [cite_start]**Imagem do Item:** Você pode arrastar e soltar um arquivo ou clicar para selecionar uma imagem local. (Seu frontend provavelmente não faz upload de arquivos diretamente para a API neste momento, mas pode enviar uma URL). [cite_start]Se não houver upload, insira uma URL válida aqui.
        * [cite_start]**Item disponível para pedidos:** Deixe marcado.
    * [cite_start]Clique em "Salvar Item".
    * [cite_start]Repita o processo para adicionar mais alguns itens, como:
        * [cite_start]**Nome do Item:** `Batata Frita Média` 
        * [cite_start]**Preço (R$):** `12.00` 
        * [cite_start]**Categoria:** `Acompanhamentos` 
        * [cite_start]**Nome do Item:** `Refrigerante Lata` 
        * [cite_start]**Preço (R$):** `6.00` 
        * [cite_start]**Categoria:** `Bebidas` 
    * [cite_start]Verifique se os itens adicionados aparecem na lista do cardápio na página de gerenciamento do restaurante.

6.  **Consultar o Restaurante e Ver o Cardápio (como Cliente):**
    * [cite_start]Saia da sua conta de proprietário de restaurante (clique em "Sair").
    * [cite_start]Vá para a página inicial `aboa2.html`.
    * [cite_start]Na barra de busca, digite parte do "Nome Fantasia" do seu restaurante cadastrado, por exemplo, "Comida" ou "Hamburgueria", e clique na lupa ou pressione Enter.
    * [cite_start]Você deverá ser redirecionado para a página `recomenda.html`.
    * [cite_start]Verifique se o seu restaurante ("Comida Boa") aparece como "A boa de hoje é:" ou em "Outras recomendações".
    * [cite_start]Clique no botão "Ver Cardápio" associado ao seu restaurante.
    * [cite_start]Você será redirecionado para a página `cardapio.html` do seu restaurante, onde deverá ver os itens que você adicionou anteriormente (Hambúrguer Clássico, Batata Frita Média, Refrigerante Lata, etc.).

### Acessando o H2 Console (Somente em desenvolvimento)
[cite_start]Se você estiver usando o H2 Database em memória (configuração padrão), você pode acessar o console do banco de dados em seu navegador:
* [cite_start]**URL:** `http://localhost:8080/h2-console` 
* [cite_start]**JDBC URL:** `jdbc:h2:mem:aboadb` 
* [cite_start]**Username:** `sa` 
* [cite_start]**Password:** (deixe em branco) 

## 💡 Como Usar
[cite_start]A aplicação ABOA expõe diversos endpoints para gerenciar usuários, restaurantes e cardápios.

[cite_start]**Base URL:** `http://localhost:8080/api` 

### Autenticação e Usuários
* **Registrar Novo Usuário**
    * [cite_start]`POST /api/auth/registrar` 
    * [cite_start]**Corpo da Requisição:** `UsuarioCadastroDTO` (nomeCompleto, email, senha) 
    * **Exemplo:**
        ```json
        {
          "nomeCompleto": "João da Silva",
          "email": "joao.silva@example.com",
          "senha": "senhaSegura123"
        }
        ```
    * **Resposta Sucesso (201 Created):** `{"message": "Usuário registrado com sucesso! ID: <ID_DO_USUARIO>"}` 
* **Login**
    * `POST /api/auth/login-process` (Gerenciado pelo Spring Security - autentica via formulário) 
    * **Corpo da Requisição (form-data ou x-www-form-urlencoded):** `username`, `password` 
    * **Resposta Sucesso (200 OK):** `{"message": "Login bem-sucedido!", "roles": "ROLE_USER,ROLE_RESTAURANT_OWNER"}` 
    * **Resposta Falha (401 Unauthorized):** `{"error": "Credenciais inválidas!", "details": "Bad credentials"}` 
* **Logout**
    * `POST /api/auth/logout` (Gerenciado pelo Spring Security) 
    * **Resposta Sucesso (200 OK):** `{"message": "Logout bem-sucedido!"}` 
* **Obter Perfil do Usuário Logado**
    * `GET /api/usuarios/me` 
    * **Requer:** Autenticação (usuário logado) 
    * **Resposta Sucesso (200 OK):** `UsuarioProfileDTO` 
* **Obter Perfil de Usuário por ID**
    * `GET /api/usuarios/{id}` 
    * **Requer:** Autenticação e autorização (próprio usuário ou `ROLE_ADMIN`) 
    * **Resposta Sucesso (200 OK):** `UsuarioProfileDTO` 
* **Atualizar Perfil do Usuário Logado**
    * `PUT /api/usuarios/me` 
    * **Requer:** Autenticação 
    * **Corpo da Requisição:** `UsuarioProfileDTO` (campos atualizáveis: nomeCompleto, telefone, dataNascimento, genero, profileImageUrl) 
    * **Resposta Sucesso (200 OK):** `UsuarioProfileDTO` atualizado 
* **Deletar Conta do Usuário Logado**
    * `DELETE /api/usuarios/me` 
    * **Requer:** Autenticação 
    * **Resposta Sucesso (204 No Content):** 

### Restaurantes
* **Criar Restaurante**
    * [cite_start]`POST /api/restaurantes` 
    * [cite_start]**Requer:** Autenticação (o usuário logado será automaticamente associado como proprietário e receberá a role `ROLE_RESTAURANT_OWNER`) 
    * [cite_start]**Corpo da Requisição:** `RestauranteDTO` 
    * **Exemplo:**
        ```json
        {
          "nomeFantasia": "Pizzaria do Zé",
          "razaoSocial": "Pizzaria XYZ Ltda",
          "cnpj": "12.345.678/0001-90",
          "email": "contato@pizzariadoze.com",
          "telefone": "11987654321",
          "ramoAtividade": "PIZZARIA",
          "descricao": "As melhores pizzas da cidade!",
          "linkMapa": "[https://maps.google.com/](https://maps.google.com/)",
          "logoUrl": "[http://example.com/logo.png](http://example.com/logo.png)",
          "coverImageUrl": "[http://example.com/cover.png](http://example.com/cover.png)",
          "endereco": {
            "cep": "01000-000",
            "logradouro": "Rua Principal",
            "numero": "123",
            "complemento": "Apto 1",
            "bairro": "Centro",
            "cidade": "São Paulo",
            "estado": "SP"
          }
        }
        ```
    * [cite_start]**Resposta Sucesso (201 Created):** `RestauranteDTO` do novo restaurante 
    * **Respostas de Erro:**
        * [cite_start]`400 Bad Request`: CNPJ ou Email já cadastrado, ou dados inválidos.
        * [cite_start]`500 Internal Server Error`: Usuário logado não encontrado (erro interno).
        * [cite_start]`401 Unauthorized`: Usuário não logado.
* **Listar Todos os Restaurantes**
    * [cite_start]`GET /api/restaurantes` 
    * [cite_start]**Resposta Sucesso (200 OK):** Lista de `RestauranteDTO` 
* **Buscar Restaurante por ID**
    * [cite_start]`GET /api/restaurantes/{id}` 
    * [cite_start]**Resposta Sucesso (200 OK):** `RestauranteDTO` 
    * [cite_start]**Resposta Erro (404 Not Found):** Restaurante não encontrado.
* **Atualizar Restaurante**
    * [cite_start]`PUT /api/restaurantes/{id}` 
    * [cite_start]**Requer:** Autenticação e `ROLE_RESTAURANT_OWNER` (e ser o proprietário do restaurante) 
    * [cite_start]**Corpo da Requisição:** `RestauranteDTO` com os dados atualizados.
    * [cite_start]**Resposta Sucesso (200 OK):** `RestauranteDTO` atualizado 
* **Deletar Restaurante**
    * [cite_start]`DELETE /api/restaurantes/{id}` 
    * [cite_start]**Requer:** Autenticação e `ROLE_RESTAURANT_OWNER` (e ser o proprietário do restaurante) 
    * [cite_start]**Resposta Sucesso (204 No Content):** 
    * **Respostas de Erro:**
        * [cite_start]`404 Not Found`: Restaurante não encontrado.
        * [cite_start]`403 Forbidden`: Acesso negado.
* **Buscar Meu Restaurante (Perfil do Restaurante do Usuário Logado)**
    * [cite_start]`GET /api/restaurantes/me` 
    * [cite_start]**Requer:** Autenticação e `ROLE_RESTAURANT_OWNER` 
    * [cite_start]**Resposta Sucesso (200 OK):** `RestauranteProfileDTO` 
    * [cite_start]**Resposta Erro (404 Not Found):** Restaurante não encontrado para o usuário logado.
* **Buscar Recomendações de Restaurantes**
    * [cite_start]`GET /api/recomendacoes` ou `GET /api/recomendacoes?busca={termo}` 
    * [cite_start]**Parâmetro:** `busca` (opcional, termo de pesquisa por nome fantasia, ramo de atividade ou cidade) 
    * [cite_start]**Resposta Sucesso (200 OK):** `RecomendacaoRespostaDTO` (contém `recomendacao_principal` e `outras_recomendacoes`) 

### Cardápio
* **Listar Itens do Cardápio por Restaurante**
    * [cite_start]`GET /api/cardapio?restaurante_id={id_do_restaurante}` 
    * [cite_start]**Parâmetro de Query:** `restaurante_id` (obrigatório) 
    * [cite_start]**Resposta Sucesso (200 OK):** Lista de `ItemCardapioDTO` 
    * [cite_start]**Resposta Erro (404 Not Found):** Restaurante não encontrado.
* **Adicionar Item ao Cardápio**
    * [cite_start]`POST /api/cardapio` 
    * [cite_start]**Requer:** Autenticação 
    * [cite_start]**Corpo da Requisição:** `ItemCardapioDTO` (incluindo `restauranteId`) 
    * **Exemplo:**
        ```json
        {
          "nome": "Pizza Calabresa",
          "descricao": "Deliciosa pizza de calabresa com queijo",
          "preco": 45.90,
          "categoria": "Pizzas",
          "imagem_url": "[http://example.com/pizza_calabresa.jpg](http://example.com/pizza_calabresa.jpg)",
          "restauranteId": 1
        }
        ```
    * **Resposta Sucesso (201 Created):** `ItemCardapioDTO` do novo item 
* **Buscar Item do Cardápio por ID**
    * `GET /api/cardapio/{itemId}` 
    * **Resposta Sucesso (200 OK):** `ItemCardapioDTO` 
    * **Resposta Erro (404 Not Found):** Item não encontrado.
* **Atualizar Item do Cardápio**
    * `PUT /api/cardapio/{itemId}` 
    * **Requer:** Autenticação 
    * **Corpo da Requisição:** `ItemCardapioDTO` com os dados atualizados 
    * **Resposta Sucesso (200 OK):** `ItemCardapioDTO` atualizado 
* **Deletar Item do Cardápio**
    * `DELETE /api/cardapio/{itemId}` 
    * **Requer:** Autenticação 
    * **Resposta Sucesso (204 No Content):**