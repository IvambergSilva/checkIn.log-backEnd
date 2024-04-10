# CheckIn.log - Backend

O CheckIn.log é uma aplicação para **gerenciamento de participantes em eventos presenciais**.

Esta ferramenta permite que o responsável pelo evento cadastre-o e crie uma página pública para inscrições.

Com este backend, os organizadores podem visualizar e gerenciar eventos, enquanto os participantes podem se inscrever e realizar check-in nos eventos.

<hr>

## Documentção da API (Swagger):

Para documentação da API, acesse o link: <a href="https://checkin-log-backend.onrender.com/docs">Documentação - Swagger</a>

<img src="/src/assets/images/doc-swagger.png" alt="Documentação da API no Swagger"/><br>

<hr>

## Requisitos

### Requisitos funcionais

- [x] O organizador pode cadastrar um novo evento;
- [x] O organizador pode visualizar dados de um evento;
- [x] O organizador pode visualizar a lista de participantes; 
- [x] O participante pode se inscrever em um evento;
- [x] O participante pode visualizar seu crachá de inscrição;
- [x] O participante pode realizar check-in no evento;

### Regras de negócio

- [x] Restrição de uma única inscrição por participante em um evento;
- [x] Restrição de inscrição apenas em eventos com vagas disponíveis;
- [x] Restrição de realização de check-in apenas uma vez por participante em um evento;

<hr>

## Tecnologias Usadas

- [x] Node.js: Utilizado como ambiente de execução para o servidor.
- [x] Fastify: Adotado como framework para construção de APIs eficientes.
- [x] TypeScript: Usado para adicionar tipagem estática ao JavaScript, aumentando a segurança e a robustez do código.
- [x] Prisma: Empregado como ORM (Object-Relational Mapping) para facilitar a interação com o banco de dados e a manipulação de modelos de dados.
- [x] Zod: Utilizado para validação de esquemas de dados, garantindo a integridade e a consistência dos dados manipulados pela aplicação.
- [x] NanoId: Usado para a geração de identificadores únicos e curtos.

<hr>

## Como utilizar:
Siga essas etapas para configurar e iniciar a aplicação localmente na sua máquina.

1) Clone o repositório:
    - Clone o repositório do FRONT-END na sua máquina local:
    ```bash
    git clone https://github.com/ivamberg/IvambergSilva/checkIn.log.git
    ```
    - Clone também o repositório do BACK-END em outro diretório:
    ```bash
    git clone https://github.com/IvambergSilva/checkIn.log-backEnd
    ```

2) Instale as dependências:
    - No diretório do FRONT-END, instale as dependências utilizando o npm:
    ```bash
    cd .\checkIn.log\
    npm install
    ```
    - Em seguida, vá para o diretório do BACK-END e instale as dependências:
    ```bash
    cd .\checkIn.log-backEnd\
    npm install
    ```

3) Configure o Banco de Dados:
    - Crie um arquivo `.env` no diretório do BACK-END e adicione o seguinte código:
    ```bash
    DATABASE_URL = "file:./dev.db"
    ```

4) Preechendo o Banco de Dados:
    - No terminal, execute o comando a seguir no diretório do BACK-END para preencher o banco de dados com dados de exemplo:
    ```bash
    npx prisma db seed
    ```

5) Iniciar os Servidores:
    - Primeiramente, inicie o servidor do BACK-END:
    ```bash
    npm run dev
    ```
    - Em seguida, inicie o servidor do FRONT-END:
    ```bash
    npm run dev
    ```
6) Acessar a Aplicação:
    - Abra o seu navegador e acesse o link gerado para acessar a aplicação.

<hr>

## Banco de Dados
Nessa aplicação, iremos empregar um banco de dados relacional (SQL). Para o ambiente de desenvolvimento, optaremos pelo SQLite devido à facilidade de configuração e utilização.

### Estrutura do banco SQL

```sql
-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "details" TEXT,
    "slug" TEXT NOT NULL,
    "maximum-attendees" INTEGER,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendees" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "socialName" TEXT,
    "email" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "customGender" TEXT,
    "treatAs" TEXT,
    "accessibility" TEXT,
    "created-at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "event-id" TEXT NOT NULL,

    CONSTRAINT "attendees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "check-ins" (
    "id" TEXT NOT NULL,
    "created-at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attendee-id" TEXT NOT NULL,

    CONSTRAINT "check-ins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "events_slug_key" ON "events"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "attendees_event-id_email_key" ON "attendees"("event-id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "check-ins_attendee-id_key" ON "check-ins"("attendee-id");

-- AddForeignKey
ALTER TABLE "attendees" ADD CONSTRAINT "attendees_event-id_fkey" FOREIGN KEY ("event-id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check-ins" ADD CONSTRAINT "check-ins_attendee-id_fkey" FOREIGN KEY ("attendee-id") REFERENCES "attendees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
```

<hr>

## 🤝 Autor

<p align="center">
    <a href="https://www.linkedin.com/in/ivamberg-silva/">
        <img src="https://avatars.githubusercontent.com/u/99219836" width="100px;" alt="Foto do Ivamberg Silva no GitHub" /><br>
        <b>Ivamberg Silva</b>
    </a>
</p>
<p align="center">Copyright © 2024 - Ivamberg Silva</p>