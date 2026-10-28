# Alarme da garagem — 1.073


Adapta o esquema e SVG dinâmicos do alarme da cave da app original, sem alterar fotografias, carro ou paredes. Símbolo circular arrastável na garagem: verde armado, cinzento desarmado, vermelho animado no disparo (prioridade), âmbar desconhecido/parcial; respeita movimento reduzido. Popup separa armação e disparo, permite apenas comando explícito de armação e consulta. Disponível também no popup da garagem e nos controlos gerais; excluído de grupos, cenários e reset.

Associações confirmadas pelo utilizador: arm 441793d689c0, trigger e9df24, canal0 e ON ativo em ambos. Migração única casa-leal-alarm-associated-v1 preenche apenas papéis ausentes, preserva edições e remoções futuras. alarm opcional validado por home-core/alarm-core; arm não pode duplicar atuador existente, trigger não pode ser a mesma saída de arm. Backup preserva alarm, marcador booleano e casa-leal-alarm-layout-v1; importação antiga da mesma conta conserva associações ausentes.

Estado exclusivamente booleano de relays/switch no canal exato, online/sem erros/fresco45s; sem inferência por potência ou estado otimista. Só arm recebe set/switch com booleano explícito. Trigger é estritamente de leitura. Conta/fila/geração/transporte/lotes<=10 partilhados, consulta15s; após comando consulta imediata e acompanhamento2s até90s, sem retry automático. Configurar/guardar/importar/abrir/consultar nunca atua. Configuração suja, dados antigos/offline e confirmação pendente bloqueiam comandos; protetor adia durante confirmação.

110 testes passaram, incluindo sintaxe de todos os scripts da entrega, estado prioritário, polaridade, canais, duplicados, backup/layout, guardas, timeout, fila e ausência de otimismo/retry. UI com review/alarm-fixture.html e IDs/chave estritamente fictícios: armado, desarme pendente até leitura confirmada, disparo, offline com botão bloqueado, arrastamento sem popup/comando e campos independentes. Nunca testar alarme real nem alegar atuação real. Provas review/alarme-garagem-armado-1.073.png, review/alarme-garagem-disparo-1.073.png e review/alarme-garagem-popup-1.073.png. Ver ALARME-GARAGEM.md.

## Manutenção e verificação

alarm-core.js contém configuração, frescura, prioridade e comando puro. cloud-read-core.js integra leituras e atuação na fila existente; cloud-read.js agenda consultas. alarm.js/alarm.css reutilizam os símbolos originais, popup e CasaCreateLayout para posição limitada à garagem. shelly-setup.js contém a associação e migração; backup-core.js valida/preserva as preferências.

Executar `node --test dist/tests/*.test.cjs` a partir do projeto. A fixture é estática, interceta todas as chamadas Shelly e recusa comandos ao ID fictício do disparo. Modos `?alarm=armed`, `disarmed`, `sounding`, `partial`, `offline`, `hold`, `reject`. Só usar a fixture para testar botões. Para regenerar, inserir review/alarm-fixture-header.txt imediatamente depois de head e incorporar os scripts clássicos relativos de index.html. Os recursos continuam relativos à pasta dist, incluindo quando publicada na raiz de um branch Pages.
