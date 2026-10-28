# Janelas — Casa Leal1.076


windowContacts opcional na configuração da mesma conta, chaves dos nove estores de fachada. Schema por contacto {deviceId,source:blu/bthome,channel0..255}; IDs XB completos preservados, sourceBLU e componente0 por omissão nesta associação. windows-core valida e recusa contacto repetido entre janelas, entrada e portão. Não confundir contacto de janela com o estore nem inferir abertura por percentagem/luminosidade. Dados exclusivamente booleanos window:N.open/value normalizados pelo ContactCore; online/sem erro/fresco45s. Unknown/offline/stale mostra indicação âmbar ?, nunca assume fechada nem recorre à demonstração. Histórico identificado no popup, sem conferir estado atual.

IDs fornecidos pelo utilizador, migração única casa-leal-window-contacts-associated-v1 completa só papéis ausentes: master-north XB154411473786357; bedroom2-north XB106582486823095; living-south-left XB66172384108257; kitchen-west XB106582486821873. Não copiar IDs da outra casa. Preservar edições e permitir remover sem voltar a associar. Config, backup e consultas opcionais mantêm ficheiros antigos compatíveis. Importação antiga da mesma conta preserva windowContacts ausente e revalida contactos após fusão. Marcador booleano incluído no backup.

cloud-read-core inclui/deduplica estes IDs em deviceIds/lotes<=10, aplica apenas as leituras pedidas e guarda histórico com timestamp original; popup da divisão dá prioridade aos contactos e estores dessa divisão. Usa fila/geração/pausa/consultas gerais30s e popup15s existentes, sem transporte paralelo. Não existe endpoint de atuação de janela. Guardar/importar/carregar apenas consulta.

windows.js sobrepõe SVG nativo: pequena folha de vidro deslocada com contorno/preenchimento vermelho e seta, sempre visível com abertura true confirmada. Usa HOTSPOTS calibrados dos pisos3/4, respeita orientação norte/sul/oeste e zoom sem editar pixels do render, alterar luz ou estore. Nenhuma animação contínua. Banners dos estores recebem afastamento discreto quando há folha/marcador para não taparem a indicação. Restantes janelas ficam em demonstração, fechadas por omissão, com Abrir/Fechar demo no popup da divisão; estado booleano separado casa-leal-window-demo-v1, validado e incluído no backup. Repor demonstração só limpa esta simulação e mantém leituras reais. Controlos de demo nunca enviam comandos.

Associações editáveis por divisão, junto do estore, como Janela/só leitura. Popup diferencia leitura Cloud e demonstração; contactos reais não apresentam botão de simular abertura. Velux mantêm desenho anterior e não recebem contactos/estores inventados.

130 testes passaram, incluindo migração/mapeamento, schema/duplicados, backup antigo/remoção, IDsXB, true/false/offline/erro/stale, âmbito de consulta e independência entre janela/estore. UI com review/windows-fixture.html e quatro IDs fictícios, fetch bloqueado fora de status/get: folhas vermelhas, offline com ?, demo aberta→fechada sem comando ou alteração do estore, popup real só leitura; zero atuações. Captura review/janelas-vermelhas-1.076.png. Nunca testar com equipamentos reais. Apenas dist, versão1.076 e caminhos relativos.

## Verificar

`node --test dist/tests/*.test.cjs`, incluindo tests/windows.test.cjs. Fixture local review/windows-fixture.html suporta ?mode=open/closed/offline/invalid e usa exclusivamente IDsXB100001..100004/chave fictícia. Bloqueia atuações e qualquer ID/URL inesperado. Cabeçalho em review/windows-fixture-header.txt; regenerar a partir de index.html com base ../ e scripts clássicos incorporados. As preferências de demonstração/visibilidade da fixture são restauradas ao sair e não fazem parte da configuração real.


## Estado da janela no banner do estore — 1.078

Por pedido explícito, substituir a folha deslocada/seta1.076 por faixa vermelha exatamente sobre o retângulo calibrado da janela. windows.js mantém estado booleano/leitura/demonstração e indicação âmbar de desconhecido; não gera render novo nem desenha seta. home.position aplica window-is-open ao banner apenas com open===true e mostra Janela aberta (demo identificada); inclui estado da janela em aria-label/title. CSS vermelho permanece também em hover/foco, ícone acompanha o tom. Sem leitura confirmada não tornar vermelho nem assumir fechado: texto Janela por confirmar. Janela fechada regressa ao estilo azul, sem texto extra.

A percentagem continua exclusivamente do estore; abrir janela não altera posição, iluminação nem comandos. Repõe posições normais dos banners (sem afastamento adicional1.076), porque o próprio banner transmite a abertura quando cobre o vidro. Ocultar percentagens continua a mostrar a faixa na janela. Não alterar associações, conta, transporte, backups exceto versão1.078. Apenas dist.

Seis verificações relevantes passaram (windows e sintaxe). UI fictícia com red-banner/vidro, WC fechado azul, percentagens100% preservadas, opção Mostrar percentagens a ocultar os banners e revelar faixas sem seta; sem erros de consola e zero comandos. Provas review/janela-banner-vermelho-1.078.png e review/janela-faixa-vermelha-1.078.png. Nunca testar com aparelhos reais.


## Indicação discreta de janela aberta — 1.079

Por pedido do utilizador, o banner do estore mantém integralmente o azul normal, incluindo hover/foco. Apenas border/box-shadow de .blind-banner-icon recebem auréola vermelha com window-is-open; não alterar fundo, texto nem borda exterior do banner. Preservar texto Janela aberta e percentagem independente. A sobreposição sobre o vidro passa a preenchimento vermelho14% e contorno vermelho1,5px non-scaling-stroke (sem seta), mantendo alinhamento geométrico e todos os validadores/estados anteriores.

Seis verificações relevantes aprovadas (windows + sintaxe). Fixture local fictícia: banner azul, círculo vermelho com janela aberta e círculo normal no WC fechado; zero comandos. Prova review/janela-aureola-1.079.png. Só dist, versão/cache/backup1.079, nenhuma alteração à comunicação ou associações.
