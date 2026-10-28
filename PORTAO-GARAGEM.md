

## Portão da garagem — 1.069

Recurso fornecido Portão.png copiado sem edição para assets/portao-garagem-aberto-v1.png. garage-render sobrepõe em x320,y870,w545,h330 (coordenadas nativas), como na referência do utilizador; addon só visível com gateSnapshot.open===true confirmado. Com luz apagada adapta o brilho do addon. Restantes pixels do render/carro mantidos.

Config opcional gateContact {deviceId,channel,source:blu/bthome}, independente de entranceContact e sem migração/ID inventado. Mesmo validador BLU, ID XB completo, contacto duplicado com entrada recusado. Definições Garagem/Contacto BLU do portão; campo vazio até utilizador fornecer ID. Backup valida/preserva e mantém associação atual ausente de cópia antiga na mesma conta; null remove explicitamente.

CloudCore gateSnapshot usa estado booleano explícito, online e fresco45s; desconhecido/offline/erro/stale nunca confirma fechado nem aberto. Transporte e fila só status/get, leitura com conta comum, polling30s ou15s no popup; guardar/abrir só consulta. gate-read fornece zona clicável no vão inferior, popup de estado e atalho para configurar; acesso também no popup da garagem. Não existem comandos para mover o portão nem participação em grupos/cenários/reset.

89 testes passaram: contactos independentes, IDs/backup/duplicados, estado aberto/fechado/offline/erro/stale e render true-only. Fixture review/gate-fixture.html usa só IDs/chave falsos e bloqueia rede não prevista; ?closed e ?offline. Verificados visualmente addon aberto, fechado sem addon, popup, campo da garagem e guardar só com leitura. Captura de demonstração com sensor fictício review/portao-aberto-1.069.png.


## Sensor BLU do portão associado — 1.070

ID fornecido XB106582486435511, source blu, componente0. Associação inicial única em shelly-setup (gateContact vazio/ausente), preservando associação existente. Marcador casa-leal-gate-associated-v1 validado/incluído no backup como gateAssociated; permitir remoção sem voltar a associar. Preserva XB completo, conta/credenciais, fila/polling e apenas consultas. Fixtures com fixtureKeys marcam migração concluída para manter apenas IDs fictícios. Nenhum equipamento real usado em testes.


Verificação solicitada: portão aberto acompanha o render apagado por brightness(.4) já existente. Comparação visual de luz acesa/apagada confirmada em review/gate-light-preview.html, sem sensores/equipamentos reais; captura review/portao-luz-1.070.png. Sem alteração funcional, mantém versão1.070.
