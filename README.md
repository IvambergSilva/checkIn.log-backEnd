# CheckIn.log

O CheckIn.log é uma aplicação para **gerenciamento de participantes em eventos presenciais**.

Esta ferramenta permite que o responsável pelo evento cadastre-o e crie uma página pública para inscrições.

Os participantes inscritos podem gerar uma credencial para o check-in no dia do evento.

Para permitir a entrada no evento, o sistema escaneia a credencial do participante.

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

### Requisitos não-funcionais

- [x] O check-in no evento será realizado através de um QRCode;