# Ventoinha da garagem · 1.127

Adaptada de fan.js/fan.css e VENTOINHA-CAVE.md da app original, a pedido do utilizador. Mesmo desenho visto de cima, três pás e grelha sem pés/base; rotação só em relé ON confirmado e recente. Associação original 8819dc/canal0 preenchida apenas quando fan está ausente; preservar edições e null (remoção explícita). Sem copiar conta ou chave. Migração apenas valida/guarda; pode provocar leituras, nunca comandos.

Campo opcional fan {deviceId,channel0..15}, validado por CasaHomeCore.setup com deteção de duplicados de atuadores. Backup preserva a associação e fanLayout; importação antiga na mesma conta preserva fan atual. Ficheiros restritos a dist/, recursos relativos e Cloud direta.

Transporte via appliancePowerSnapshot/commandAppliance('fan',boolean), fila e confirmações comuns. Estado estritamente booleano do canal exato de switch/relays, online/fresco45s; não inferir por consumo. Confirmação até3 consultas, sem repetir atuação/estado otimista. A ventoinha não tem seguimento de consumo. Offline/antigo/erro/saída ausente param animação e bloqueiam botão; histórico identificado. Nunca participa em grupos de luzes, estores, cenários automáticos ou reset.

Popup individual com alimentação/refresh/roda dentada; atalho em Cenários e linha com alimentação/definições no popup da garagem. Popup fan prioriza só o seu ID, e o da garagem inclui fan. Símbolo arrastável contido na garagem por CasaCreateLayout; posição em casa-leal-fan-layout-v1 e backup, tamanho acompanha slider comum, drag excluído de navegação/zoom. Montar antes de Meteo para inert/retorno. Movimento reduzido respeitado.

Verificação apenas fictícia: tests/fan.test.cjs cobre config, duplicados, backup, leitura sem atuação, canal, confirmação, zero otimismo, limite3, offline/antigo/falha/saída ausente e limpeza de geração. Suites de fila/polling/consumo/sintaxe:29 testes passaram. Fixture review/fan-fixture.html interceta toda a rede e usa fan feedface000c; verificados ON→comando→confirmação OFF e atalho de ID, sem equipamento real. Captura review/ventoinha-garagem-1.127.png.
