# Nova casa — instruções de implementação

Todas as alterações ficam exclusivamente nesta pasta do projeto Casa Condados (anteriormente dist/) e devem funcionar com esta pasta na raiz de GitHub Pages e em abertura local. Atualizar versão visível/metadados/cache/version.json nas alterações funcionais.

Por instrução explícita do utilizador, os novos elementos devem ser addons independentes por cima das plantas, sem redesenhar ou incorporar os elementos na geometria base. Usar addons.js para montagem das camadas; preservar paredes brancas por cima dos elementos interiores, proporções, portões, navegação e alinhamento dos banners. Só mudar a arquitetura quando o utilizador pedir explicitamente.

Sem mobília, equipamentos ou associações herdadas da outra casa. Nunca usar equipamentos reais em testes. MeteoNL e regras compatíveis de REGRAS-BASE.md preservadas.

# Nome e versão da nova casa

Nome visível: Casa Leal. Desde 1.001, usar formato 1.xxx, incrementando 1.002, 1.003, etc. A versão aparece apenas de forma compacta por baixo do nome no cabeçalho, sem linha própria no rodapé ou nas definições. Manter version.json, metadados e caches coerentes; a versão interna da MeteoNL é independente.

# Navegação atual

Sem menu inferior. Casa Leal à esquerda do cabeçalho regressa ao piso 3; meteorologia centrada e definições à direita com ícone Settings da MeteoNL. Checks de legendas nas definições. Em baixo, apenas o nome discreto do piso; aproveitar o restante espaço para a planta.

# Armários e portas — 1.004

Autorizados os armários integrados nos locais marcados pelo utilizador: closet em L, quarto 2, quarto 3 e hall. São addons SVG vistos rigorosamente de cima, independentes da planta. Não acrescentar outra mobília sem pedido. Portas interiores seguem as dobradiças e sentidos da referência arquitetónica; WC comum entra pela lateral direita, WC de entrada abre para dentro do WC, quartos abrem para dentro.

# Cozinha — 1.018

Autorizados cerca de dez módulos de cozinha na faixa indicada e ilha de refeições em madeira. kitchenAddon independente, visto rigorosamente de cima, abaixo de portas e paredes, sem cadeiras ou outros móveis acrescentados. Não criar associações ou comandos para eletrodomésticos ilustrativos.

# Equipamentos da varanda — 1.022

Autorizados aspirador, máquina de lavar roupa e bomba de calor na faixa direita da varanda inferior. Representações esquemáticas estritamente de cima em balconyUtilitiesAddon, independentes e sem estados, controlos, associações ou comandos reais. Preservar paredes, guarda e vãos.

# Porta de entrada com duas posições — 1.024

Entrada tem grupos SVG separados closed/open, castanhos e robustos. Fechada por omissão; aberta só por booleano true explícito via CasaAddons.setEntranceDoorState. false fecha, null/desconhecido mostra fechado com data-door-status unknown, sem inferir leitura real. Apenas preparação visual; não criar associações, IDs ou comandos sem pedido. Estado visual não é persistido e reaplica ao mudar de piso.

# Nome informal do piso 4

O utilizador também chama sótão ao piso 4. A porta de correr entre Estúdio e Sala 2 recolhe para a parede esquerda e deixa abertura à direita.

# Loiças sanitárias — 1.026

Autorizados três conjuntos sanitários no piso 3: três sanitas, três lavatórios e dois duches, nos locais marcados. bathroomAddon independente e estritamente de cima, abaixo de portas/paredes. Check Mostrar loiças das casas de banho controla a camada inteira, persistido em casa-leal-show-bathroom-fixtures-v1 e incluído como showBathroomFixtures no backup. Backups anteriores sem o campo preservam preferência atual. Sem associações ou comandos reais.

# Iluminação, estores e preparação Cloud — 1.027

home-core.js/home.js/home.css implementam apenas demonstração local, com render SVG noturno para pisos 3 e 4 e iluminação por divisão. Preservar paredes brancas por cima e todos os addons originais. Nove estores de fachada, incluindo as duas janelas da sala separadas; Velux sem estores. Percentagem é abertura (0 fechado, 100 aberto). Hover/foco azul na janela; check Mostrar percentagens dos estores oculta só os banners. Faixa lunar noturna acompanha a percentagem, sem reflexos de contacto de janela.

shelly-setup.js é editor de preparação, sem transporte, consultas ou comandos. Conta, IDs e canais não ativam equipamentos nem promovem simulação a estado real. Configuração nova em casa-leal-shelly-setup-v1; não herdar IDs da outra casa. Chave só guardada com check explícito, separada em casa-leal-cloud-auth-v1, nunca no backup/logs/resumos. A futura ligação terá de manter confirmação real, fila única e guardas das regras originais. Demonstração nunca poderá acionar equipamentos associados.

homeDemo, showBlindBanners e shellySetup integram backup validado; categorias ausentes preservadas e credenciais recusadas. Exportação recusa formulário sujo. Ver ILUMINACAO-ESTORES.md e testes fictícios. Não usar equipamentos reais em testes.

# Estilo dos banners dos estores — 1.028

Usar o estilo da app original: cápsula azul translúcida, ícone circular com quatro linhas horizontais, nome da divisão e percentagem grande. Preservar o ícone e nome ao atualizar a percentagem; o check continua a ocultar apenas estes banners.

# Contador geral real de leitura — 1.029

A nova autorização ativa apenas a leitura do Shelly EM 48e72967aadc/canal0. Potência contratada inicial 6,9kVA herdada da referência visual, editável e ainda por confirmar pelo utilizador. A exceção à preparação de 1.027 é só o contador: luzes, estores e restantes equipamentos mantêm demonstração, mesmo com IDs guardados.

energy-core.js adapta o normalizador original; cloud-read-core.js/cloud-read.js são a fila única de leitura desta casa, com conta do editor, geração e bloqueio de formulário sujo/conflito. Sem endpoints de atuação ou reset. Atualiza 15s visível, fresco45s, erros/offline/stale neutros e última leitura identificada. Calcular kVA com hypot(P,Q), nunca assumir reativa zero ou kW=kVA. Preservar key fora de snapshots/backups/logs e nunca enviar credenciais à MeteoNL. Protetor adia entrada enquanto a fila está ocupada.

homeEnergy opcional no setup, null para remoção. Migração inicial com casa-leal-em-associated-v1 preserva edições e remoções; marcador e showEnergyBanner validados/exportados. Backup antigo sem contador preserva associação atual apenas na mesma conta. Ver CONTADOR-GERAL.md. Testes sempre com mocks; fixture em localhost interceta toda a rede Cloud.


## Limites de luz natural — 1.030

No piso 3, o hall de entrada e o WC de entrada recebem a média das aberturas dos estores cozinha/oeste e sala/sul esquerda e direita. As escadas seguem apenas sala/sul direita, a janela mais próxima. Corredor dos quartos e WC interior recebem a média dos três estores dos quartos; o closet acompanha o quarto principal. Cada fonte contribui igualmente e percentagens intermédias variam continuamente. Com todas fechadas, estas zonas escurecem como as divisões com janela; luz elétrica mantém prioridade. À noite, abertura dá apenas uma contribuição ambiente ténue, além das faixas lunares locais existentes.

CasaHomeCore.lighting concentra a regra pura partilhada por home.js e generate-night.cjs. lightingAreas no gerador prolonga o sombreado da entrada/cozinha através dos limiares abertos, sem alterar paredes, móveis ou a contenção das legendas. Não há novos IDs, comandos, preferências ou alterações à Cloud. Todas as modificações ficam em dist/.

Verificação: 37 testes, incluindo cinco regressões de fontes, contribuição individual, percentagens e prioridade elétrica. Revisão visual diurna em iPad 768×1024, estores a 0% e 100%, com paredes brancas preservadas. Cenário isolado localhost em review/shutter-influence.html; prova review/limites-estores-1.030.png. Sem uso de equipamentos reais.


# Fechar popups pelo exterior — 1.031

app.js permite fechar todos os dialogs da Casa (definições, divisão, estore e contador) com toque/clique no backdrop. Exigir início e fim fora do retângulo, botão primário e cancelar em pointercancel; clicar no espaço interior ou arrastar de dentro para fora não fecha. Usar dialog.close para preservar eventos/foco nativos. Não apagar campos por guardar nem enviar comandos ao fechar.


# Popup de dispositivos por divisão — 1.033

Tocar/clicar no interior das divisões abre o popup, mesmo com nomes ocultos. app.js transforma coordenadas pelo getScreenCTM inverso e usa as áreas de contenção, preservando a supressão de cliques de pan/pinch/swipe e arrasto de legendas. Clique com movimento superior a 8px é ignorado; botões/janelas mantêm ações próprias. As legendas continuam acessíveis por teclado. Escadas têm popup com ação explícita para mudar de piso.

home.js apresenta lista no estilo da app original: título, contagem dos controlos disponíveis, atualização local, iluminação com botão circular e percentagens dos estores com painel de ajuste. Sem sensor associado, temperatura/humidade e contactos são identificados como ausentes; não mostrar leituras ou dispositivos da outra casa. Botões continuam estritamente demonstrativos; não acrescentar comandos Cloud. Fecho por X/Escape/exterior preservado. Verificação no iPad768×1024: toque na sala com nomes ocultos, luz on/off, painel do estore e 0%, e popup da garagem. 37 testes existentes passam.

# ID.4 na garagem — 1.034

addons.js monta garage-vehicle acima do chão e abaixo da iluminação/paredes. Asset independente assets/id4-vista-superior-v1.png é uma cópia integral do recorte Volkswagen existente, visto de cima, rodado180° para orientar a frente ao portão inferior. Carregador SVG estático na parede superior, à esquerda do carro, com cabo recolhido. Nenhum estado de carga, associação ou comando é inferido/adicionado. Não alterar a geometria, chão ou portão. Prova review/garagem-id4-1.034-full.png; popup review/popup-divisao-1.033-full.png.


# ID.4 à esquerda — 1.035

Por pedido do utilizador, carro deslocado200 unidades para a esquerda (imagem x220, centro de rotação423.5), com pequena folga à parede e frente mantida para o portão. Carregador deslocado105 unidades à esquerda na mesma parede superior, acima do canto esquerdo do carro. Apenas addon; geometria e equipamentos reais intactos.


# Carregador EM no canal 1 — 1.036

Por associação explícita do utilizador, evMeter opcional {deviceId,channel} guarda o carregador48e72967aadc/canal1, separado de homeEnergy canal0. Migração única casa-leal-ev-associated-v1 completa só campo ausente; preserva edição e null para remoção. Campos nas definições, validação Home.setup e backup incluídos. Backups antigos preservam as duas associações ausentes apenas na mesma conta. Leitura pode partilhar ID/canal; não criar relé de atuação a partir do canal de medição.

cloud-read-core mantém uma fila e conta comuns, deduplica IDs e normaliza cada canal exato de emeters separadamente. Nunca usar canal0 como fallback para o carro. evSnapshot não expõe ID nem segredo, retorna W/1000 em kW e totalWh/1000 em kWh. Sem zeros inventados ou valores absolutos; fresco45s online válido, erros/offline/antigo ficam por confirmar com último total identificado. Mantém geração, bloqueio de formulário sujo, timeout e limites/401 existentes. Só endpoint get; guardar/abrir/consultar não atua no carregador.

addons.js afasta ligeiramente o ID.4 (imagem x300, centro503.5) e põe carregador na parede esquerda, junto ao canto superior esquerdo do carro. ev-read.js/css monta banner clicável e popup só de leitura; cabo até ao carro apenas com potência válida fresca superior a50W, recolhido nos outros casos. Não inferir ficha física/bateria/carga completa nem estado do relé. Controlos do carregador preservam zoom com dois dedos e não abrem simultaneamente popup da garagem. Todos os scripts/recursos relativos dentro de dist/.

42 testes passam: novos casos em tests/ev-read.test.cjs cobrem canais independentes numa consulta, canal ausente, zero/limiar/negativos, offline/stale/inválido/erro, consulta sem contador geral, guardas e backup. Fixture review/charger-fixture.html e em-fixture.html usam exclusivamente ID/chave fictícios e intercetam toda a rede; restauram preferências no pagehide. Revisão iPad768×1024 com banner/popup; imagens review/carregador-em-1.036.png e carregador-popup-1.036.png mostram dados simulados. Não foi realizado teste de equipamentos reais.


# Animação do carregador — 1.037

O cabo tem traços verdes em movimento do carregador para o carro, e o LED do carregador pulsa durante consumo de carga confirmado. Ativar is-charging exclusivamente com evSnapshot.charging true, no piso−1 visível. Sem consumo/offline/erro/stale: sem animação e cabo recolhido. Pausar quando documento oculto e respeitar prefers-reduced-motion. Não alterar associações, normalização, limiar50W, transporte ou equipamentos reais. Fixture charge=off/offline permite verificar interrupção com dados fictícios. UI validada com7,2kW e0W, screenshot review/carregador-animacao-1.037.png.


# Cor pelo relé do EM — 1.038

Utilizador confirmou que desligado significa relé de alimentação OFF, não offline. energy-core.relayStatus lê exclusivamente relays[0].ison ou switch:0.output do mesmo EM associado ao carro (relé único0, independente da pinça1). Booleanos exatos, conflitos/erros/ausência/offline/stale mantêm feed null. cloud-read-core.evSnapshot.feed não depende dos watts nem inventa OFF a0W; mesma consulta get/fila/geração, sem novos comandos. Desenho usa símbolo/LED vermelho com false, verde com true, neutro unknown. Animação do cabo continua por potência; pulsação do LED só com alimentação ON. Popup informa alimentação lida, sem botão de atuação. Testes44, incluindo independência potência/relé e canal/erros/frescura. UI validada com relé OFF fictício; prova review/carregador-off-1.038.png.


# Atualização automática — 1.039

cloud-read.js acompanha o ritmo da app original: consulta geral30s e15s com popup energy/ev aberto, verificação do agendamento a cada1s, relógio reiniciado ao concluir a consulta. Abrir/fechar popup e regressar à app/foco/pageshow/rede/visibilidade/MeteoNL renova por leitura. MeteoNL visível já não suspende consultas da Casa (a exclusão anterior deixava os estados sem atualização após o protetor); app realmente oculta continua suspensa. meteo.js emite casahomevisible no regresso, preservando popups e campos.

Preservar fila partilhada, coalescência, geração, formulário sujo/conflito, backoff429 e bloqueio automático401. Eventos automáticos nunca usam manual=true nem enviam comandos. Testes tests/cloud-auto.test.cjs usam relógio e cliente fictícios para tempos/retoma/guardas; suite48 passa. Fixture autopoll=1 muda estado nas respostas e conta consultas visíveis. UI comprovou passagem de4 a6 consultas no popup sem clicar Atualizar, com hora renovada; prova review/atualizacao-automatica-1.039.png. Sem equipamentos reais.


# Cenários gerais — 1.040

Botão redondo com símbolo de camadas #open-scenarios junto às definições, em .top-actions, abre #scenarios-dialog. Quatro ações: abrir9estores100%, fechar9estores0%, ligar todas as luzes e apagar todas, nos três pisos. Sem estores Velux. CasaHome.setAllLights/setAllBlinds centralizam alteração do estado local, persistência e redesenho; não chamam transporteCloud, não alteram EM/relé do carregador, nem credenciais. Respeitar separação de demonstração mesmo com IDs guardados. Popup mostra resultado em role=status, nota de demonstração e fecha por X/Escape/exterior. MeteoNL envolve/restaura este dialog como os restantes.

Verificação visual768×1024 e375×812, todas as quatro ações acionadas na demonstração;48 testes existentes passam. Header adaptado a ecrãs pequenos mantendo botões44px. Prova review/cenarios-1.040.png, harness review/cenarios-mobile.html.


# Relevo arquitetónico — 1.041

wall-relief.js acrescenta addon SVG nos pisos3e4 com faces laterais deslocadas4×9unidades, sombras projetadas difusas e sombra curta de contacto. Deriva do mesmo percurso das white-walls, sem modificar geometria, áreas interativas, materiais ou recursos base. home.js monta o relevo depois da iluminação e antes das paredes originais, preservando a camada branca acima de tudo e a ausência de juntas visíveis. Camada não interativa, sem mobília nova; garagem mantida. Pequena sombra nas folhas das portas existentes viaCSS. Não introduzir AI/renderbitmap que altere proporções.

Pré-visualizações noturnas geradas pelo mesmo markup de relevo em generate-night.cjs; XML válido. UI diurna nos pisos3/4 e noturna no piso3 verificada em768×1024.48 testes existentes passam. Prova review/paredes-relevo-1.041.png e paredes-relevo-noite-1.041-full.png. Nenhuma configuração/estado/comando Shelly alterado.


# Luz exterior com luz elétrica ligada — 1.042

Por pedido do utilizador, a luz exterior não desaparece ao ligar a divisão. HomeCore.beamOpacity depende apenas da abertura do respetivo estore e do ambiente (diurno quente suave, noturno azulado), nunca de on. home.js conserva os feixes sobre o contributo elétrico. Estore0 remove apenas a luz exterior dessa janela. De dia, lighting.electricOpacity reduz o tom quente elétrico proporcionalmente à luz natural; de noite ambos se combinam. Guardar estados, áreas partilhadas, paredes brancas, relevo e comandos ficam intactos. Esta regra substitui a anterior supressão de feixes com iluminação ligada.

50 testes passam, incluindo independência de estore/luz e combinação diurna/noturna. UI Sala2 com luz ligada e estore100% verificada; prova review/luz-rua-eletrica-1.042.png. Só demonstração, sem equipamentos reais.


# Garagem com luz branca neutra — 1.043

HomeCore.lighting trata apenas−1/garage com luz ligada: opacity0 e electricOpacity0, removendo a máscara escura e o véu âmbar sobre os pixels do chão/carro. A luz branca neutra revela os materiais originais sem camada branca que também os tornaria baços. Luz apagada mantém escurecimento noturno; restantes pisos mantêm tom quente e luz exterior. Não editar imagem/posição do ID.4, carregador, paredes, geometria ou estadosCloud. Teste dedicado e suite51 passam; UI com luz acesa verificada na fixture fictícia, prova review/garagem-luz-branca-1.043.png.


# Visibilidade do consumo do carro — 1.044

Check Mostrar consumo do carro nas definições, alinhado com os outros. ev-read.js persiste booleano casa-leal-show-ev-banner-v1, omissão true e validação de tipo ao carregar. position oculta apenas .ev-badge; carro, carregador clicável, cabo/animação e consultas automáticas continuam. Preferência showEVBanner validada/exportada/restaurada no backup; ficheiros antigos sem campo preservam valor atual. UI iPad: desmarcar remove banner, mantém carregador e contador de consultas a avançar. Prova review/consumo-carro-oculto-1.044.png. Regressões de backup passam.


# Ligação do cabo no ID.4 — 1.045

Conetor movido para a lateral esquerda do carro no ponto indicado pela seta, junto à traseira: centro380,698. Atualizar em conjunto o percurso da sombra e o do fluxo; carro, carregador e cabo recolhido mantidos. Animação e guardas de potência/relé intactas.


# Porta principal BLU funcional — 1.046

Associação explícita XB66172384118439, sourceblu, componente/channel0 em entranceContact da mesma configuração/conta. Migração única casa-leal-entrance-associated-v1 aplica o ID pedido, preserva canal de associação BLU igual e demais equipamentos; marcador no backup, remoção posterior permitida. IDs XB completos até48bits decimais preservados na configuração, backup e transporteget; nunca substituir pelo MAC/gateway. Não ativar janelas sem IDs pedidos.

contact-core normaliza window:N.open e value legado com false explícito, conflitos inválidos unknown, janela legada só componente0. BTHome opcional exige componenteobj_id45; nunca deduzir abertura por lux/ângulo/bateria/relé. Erros/ausência/offline/stale45s = null, desenho fechado por omissão com legenda por confirmar. cloud-read-core inclui contacto na mesma consulta/fila/geração dos dois canaisEM (IDsdeduplicados), apenas get. doorSnapshot expõe estado e mensagens seguros, não ID/chave.

entrance-read cria zona clicável no vão real da porta, popupAberta/Fechada/Por confirmar, hora explicitamente de consulta, refresh e atalho da associação. Desenho usa CasaAddons.setEntranceDoorState; não alterar geometria/batentes/sentido ou paredes. Hall também apresenta leitura. Atualização30s geral/15s popupporta ouhall, renovação ao abrir; nunca comandos de abertura/desbloqueio nem mistura com grupos de luzes/estores. Backups antigos sem campo opcional preservam contacto atual apenas na mesma conta; null remove.

57 testes passam, incluindo normalização,canal,conflitos,offline/stale/erro, porta semEM, transporteXB,backup e desenho. review/entrance-fixture.html usa apenas ID/chave fictícios, todas as chamadasCloud intercetadas. UIiPad768×1024 verificou contacto true→Aberta efalse→Fechada e clique no vão; screenshot review/porta-principal-1.046.png. Nenhum equipamento real foi usado nos testes.


# Identificação das divisões — 1.047

Utilizador identificou os quartos do piso3, da esquerda para a direita: master=Suite principal, bedroom2=Quarto do Gui, bedroom3=Biblioteca / Escritório Gui. Nomes atualizados no gerador e inventário de janelas para acompanhar planta, popups, banners, definições e associações futuras. Preservar IDs internos, chaves de estado/backup, áreas, posições guardadas e equipamentos associados.


# Materiais e paredes volumétricas — 1.049

Substitui o relevo 1.041: wall-relief.js calcula a união do traçado ortogonal das paredes e extrude só arestas expostas (4×24 unidades), com sombra de base, sem faces internas em cruzamentos. Preservar os topos brancos por cima da iluminação. Removida a sombra CSS das folhas de porta; faces de madeira ficam nos grupos de estado existentes, sem alterar pivôs ou abertura. Pavimento dos pisos 3/4 usa assets/parquet-carvalho-natural-v1.png, gerado com imagegen integrado a partir da referência estética, sem regenerar geometria. Não acrescentar móveis. Garagem e comandos intactos. SVG externos usam caminhos de recursos relativos à própria pasta assets. Ver RENDER-MATERIALS.md para prompt, geradores, limites e provas. 59 testes passaram; verificação visual dos pisos 3 e 4.


# Reposição das paredes — 1.050

Por correção do utilizador, manter o parquet natural de 1.049 e retirar o relevo adicional das paredes e as faces de madeira acrescentadas às portas. home.js já não monta CasaWallRelief e index.html já não carrega o módulo. Pré-visualizações noturnas também deixam de incluir a extrusão. Preservar paredes brancas originais, geometria, portas, iluminação, configurações e comandos. O módulo wall-relief.js e as provas antigas são históricos, não o aspeto ativo.


# Temperatura real na MeteoNL — 1.051

Associação explícita do sensor XB211299192082120, componente 0, em meteoSensor opcional {deviceId,channel} da configuração Casa Leal. Migração única casa-leal-meteo-temperature-associated-v1 preenche apenas campo ausente; preservar edições e null para remoção. Formulário próprio MeteoNL · Temperatura real nas associações Shelly, validação/backup partilhados e proteção contra escritas de outra janela. Backups antigos da mesma conta preservam associação ausente. Sem credenciais na ponte MeteoNL, no backup ou no snapshot.

Reutiliza conta, fila, deduplicação de IDs, geração e consultas get de cloud-read-core. Consulta automática a cada 30s com app visível, também durante MeteoNL e quando só existe este sensor; abrir MeteoNL renova se faltar leitura ou tiver mais de60s. Nenhum endpoint de comandos. temperature-core aceita temperature:N.tC e Gen1 tmp/hum com validade/unidades como a app original; nunca temperatura interna de relés. XB completo preservado.

CasaMeteoBridge.realTemperature passa o snapshot ao CasaMeteoCore.realTemperature existente. Componente RealTemperature original mostra Real sob a previsão, °C/°F e Última leitura em offline/erro/antigo120s; inválido/ausente mostra traço, sem inventar zero. Sem alterações nas fontes React ou bundle, pois o componente já existia. Timestamp é da consulta, nunca da medição.

Verificação: 63 testes com dados fictícios, incluindo normalização, fila/leitura única, ID XB, offline/erro/antigo, importação/remoção e polling sem EM. review/meteo-temperature-fixture.html bloqueia rede Cloud real e usa só ID/chave fictícios; prova review/meteo-temperatura-1.051.png mostra18,7°C simulado. Não foi consultado o equipamento real em testes.


# Banner do sensor na varanda inferior — 1.052

O mesmo meteoSensor aparece no piso3, varanda sul/inferior, através de balcony-sensor.js. Banner azul com temperatura °C e humidade%, posição SVG300,1495; acompanha zoom/pan/redimensionamento, escala para caber na varanda e só aparece com associação e piso3 ativo. Substitui visualmente a legenda simples dessa varanda para evitar sobreposição, mesmo com nomes ocultos. Não altera posições guardadas nem a planta. Apenas informativo, deixa passar cliques para a divisão.

TemperatureCore.status acrescenta humidity a partir de humidity:N.rh ou Gen1 hum.value no componente configurado, independente da validade da temperatura; aceitar0real, rejeitar ausência/string/fora0..100/is_validfalse/errors. Snapshot partilhado mantém conta/fila/polling30s, sem pedidos adicionais nem comandos. Offline/erro/idade>120s mostra Última leitura, ausência mostra traço, sem inferir valores. Timestamp só da consulta no título. MeteoNL mantém o seu desenho e a sua leitura.

64 testes passaram. Fixture review/meteo-temperature-fixture.html atualizada com18,7°C/65% fictícios; verificação visual confirma banner dentro da varanda sem tapar equipamentos e oculto no piso4. Prova review/varanda-sensor-1.052.png. Nenhum equipamento real em testes.


# Sensores da garagem, sala e suite — 1.053/1.054

Associações opcionais garageSensor (XB211299197137945), livingSensor (799b1c) e masterSensor (799c3b), todas com channel0, na mesma configuração validada de Casa Leal. Preenchimento único apenas de campos ausentes através dos marcadores booleanos casa-leal-garage-temperature-associated-v1 e casa-leal-room-temperature-associated-v1; preservar edições/null/remoções. Formulários em Piso−1/Garagem, Piso3/Sala e Piso3/Suite principal. Backup valida e preserva os sensores ausentes de ficheiros antigos apenas na mesma conta. Nunca guardar chave em backups.

CasaCloudRead.temperatureSnapshot aceita meteo (omissão), garage, living e master; papéis desconhecidos ficam sem associação, nunca reutilizam outro sensor. Uma só consulta get com IDs deduplicados, mesma conta/fila/geração/polling30s, incluindo quando só existe um sensor. Até sete IDs distintos possíveis no esquema atual, abaixo de10. Ler apenas temperatura/humidade ambiente através do normalizador existente, sem ações em equipamentos.

Os quatro banners são montados por balcony-sensor.js: varanda(300,1495), garagem(805,650), sala(300,1200), suite(220,390), coordenadas SVG. Garagem só no piso−1, restantes no piso3. Evitar legenda duplicada na varanda/sala/suite enquanto o banner está visível. Preservar nomes/posições guardadas e planta.

Check Mostrar temperatura e humidade junto dos restantes em Definições controla os quatro banners imediatamente e persiste booleano casa-leal-show-sensor-readings-v1, omissão true. Backup inclui showSensorReadings e os marcadores. Ocultar não envia pedidos, não para polling, não afeta MeteoNL nem sensores associados; legendas simples regressam segundo o check dos nomes.

70 testes passaram com IDs/chave fictícios: isolamento dos sensores, deduplicação, zero real, offline/erro/antigo, ausência, componentes exatos, backup/parciais/null, check booleano e polling sem EM. Fixture review/meteo-temperature-fixture.html bloqueia todo o transporte Cloud real e simula quatro sensores. Navegador confirmou banners da sala/suite, garagem, desativação pelo check e leitura Real na MeteoNL mesmo com check desligado. Provas review/sensores-planta-1.054.png e review/sensores-check-1.054.png; garagem em review/garagem-sensor-1.053.png. Nenhum equipamento real usado nos testes.


# Renders fornecidos da garagem — 1.055

Usar assets/garagem-luz-acesa-v1.jpg e assets/garagem-luz-apagada-v1.jpg, cópias sem edição dos JPG fornecidos: Gemini_Generated_Image_kpvd64kpvd64kpvd.jpg (acesa) e Gemini_Generated_Image_wcnltpwcnltpwcnl.jpg (apagada), ambos1114×944. Não gerar nem retocar pixels. garage-render.js faz apenas apresentação/recorte SVG pelo contorno exterior das paredes, excluindo todo o exterior da fotografia. Contorno na origem: M43 24H1052V914H245V250H64L43 230Z; transformar limites43,24..1052,914 para75,460..925,1210 da planta. Recursos relativos, publicação estática em dist.

Addon independente montado por CasaAddons antes dos restantes controlos da garagem. Ocultar os caminhos de pavimento/paredes/portão originais só visualmente, mantendo geometria para áreas interativas e contenção. O carro já vem nos renders: retirar apenas o grupo data-vehicle antigo nesta montagem. Manter carregador SVG/cabo/fluxo numa camada posterior ao render. Preservar fotos/carro de fallback e todos os outros pisos.

home.js usa CasaGarageRender.setLight com o booleano da iluminação existente da garagem; on=acesa e off=apagada, independentemente do dia/noite. Desativar somente a máscara sintética de iluminação desta garagem para não sobrepor películas/sombras à imagem. Banners, preferências, sensores e EM intactos; não acrescentar associações ou comandos de luz. A iluminação continua em demonstração nesta app.

70 testes existentes passaram. Verificação no navegador com fixture estritamente fictícia review/garage-render-fixture.html: ligar/apagar no popup da garagem troca corretamente os renders; apenas uma imagem visível, nenhum carro duplicado, máscara sintética desativada e carregador/cabo animado por cima. Recorte não mostra o fundo externo da imagem. Provas review/garagem-render-aceso-1.055.png e review/garagem-render-apagado-1.055.png. Nunca usar equipamentos reais para testes.


# Três renders fornecidos do piso3 — 1.056

Recursos originais copiados sem edição: assets/piso3-diurno-v1.jpg (Gemini_Generated_Image_4g8z664g8z664g8z.jpg), assets/piso3-estores-fechados-v1.jpg (Gemini_Generated_Image_sc04r1sc04r1sc04.jpg), assets/piso3-noturno-abertos-v1.jpg (Gemini_Generated_Image_b7h27eb7h27eb7h2.jpg). Todos816×1280. Não gerar novas imagens nem retocar pixels. A mobília/loiças/pequenas emissões decorativas estão incorporadas nestas imagens fornecidas, não são equipamentos nem leituras. O check de loiças de addons não consegue retirar elementos impressos nestes renders.

floor3-render.js monta addon independente por CasaAddons antes da iluminação. Recorte SVG pelo contorno exterior das paredes, exclui fundo das fotos, preserva fundo de paralelos da Casa. Transformação dos limites35,14..779,1278 para55,55..945,1584. Geometria original mantida invisível para clique/contenção/hotspots, sem alterar IDs, associações ou posições guardadas. Não montar os armários/cozinha/loiças/varanda/arquitetura SVG antigos neste piso para evitar duplicação.

Combinar foto fechada como base com diurna ou noturna através de máscaras de cada divisão em coordenadas da fotografia. levels reutiliza CasaHomeCore.lighting e percentagens: cozinha+duas janelas da sala afetam entrada/WCentrada; escadas seguem estore direito da sala; hall/WCinterior seguem três quartos; closet segue suite. Aberturas parciais interpolam os estados. Faixas das sete janelas têm máscaras próprias pela percentagem de cada estore; 0%escuro da fotografia fechada e100%vidro azulado da fotografia aberta. A luz elétrica nunca muda essas máscaras.

Sem render elétrico específico fornecido, iluminação em demonstração usa recorte da foto diurna com94% de mistura só na divisão ligada, excluindo faixas das janelas. Não acrescentar gradientes/películas sintéticas sobre os renders. Home desativa só a camada sintética de room-lighting deste piso e sincroniza o addon a cada atualização. Todos os estores/luzes continuam com o comportamento de demonstração anterior; não criar comandos. Piso4 e garagem permanecem independentes.

Porta de entrada mantém o contacto real e o símbolo aberto apenas com true confirmado. Foto já representa porta fechada; grupo nativo closed fica transparente, grupo open/arco pode ser sobreposto à fotografia para sinalizar leitura aberta. Não inferir contacto nem retirar a associação.

73 testes passaram, incluindo todos os estados extremos, cobertura das divisões, dependências e independência entre luz/estore. Navegador verificou dia100%, todosfechados0%, noite100%, suitefechada/restantesabertos e luzsuite comestore0%. Máscaras de janelas100% confirmadas brancas sem sobreposição sintética preta. Fixture review/floor3-render-fixture.html bloqueia Cloud real e usa apenas dados fictícios. Provas review/piso3-render-dia-1.056.png, piso3-render-fechados-1.056.png, piso3-render-noite-1.056.png, piso3-render-misto-1.056.png e piso3-render-luz-suite-1.056.png. Nenhum equipamento real em testes.


# Escurecimento de toda a divisão — 1.057

Utilizador reportou que só a janela escurecia. Substituir as máscaras globais de luminância de1.056 por recortes independentes com opacidade explícita por divisão, para dia e noite. floor3-render.partition divide toda a imagem816×1280 em regiões disjuntas (janelas primeiro, divisões depois, estrutura restante). regionAt atribui cada ponto a um único papel. Nenhuma camada ambiente clara é desenhada por trás do interior de uma divisão fechada.

Render escuro original como base; cada região abre a fotografia diurna/noturna apenas pela percentagem aplicável. A0% natural tem opacity0 em ambas as variantes, deixando toda a divisão no render escuro. Luz acesa aplica só o recorte da divisão e exclui os recortes de janelas, preservando estore fechado. Recursos originais reutilizados por use/href; não alterar fotos, geometria interativa, IDs, comandos, garagem ou piso4. Preservar dependências anteriores de corredor/WC/entrada/escadas e percentagens intermédias.

75 testes passaram. Novas regressões verificam cobertura integral sem sobreposições e sync real de opacidade em dia/noite com suite0%/quartoao lado100%; luzsuite confirma recorte elétrico sem abrir janela. Fixture fictícia review/floor3-render-fixture.html: teste diurno com só suite fechada escurece todo o seu interior enquanto quarto vizinho fica igual. Comparação de amostras dos screenshots: luminosidade média166,8→39,4 na suite e122,6→122,6 no quarto ao lado. Luz da suite devolve brilho mantendo0%. Provas review/divisao-aberta-1.057.png, divisao-fechada-1.057.png e divisao-fechada-luz-acesa-1.057.png. Testes sem equipamentos reais.


# Varandas de noite — 1.058

Em floor3-render.levels, balcony-north e balcony-south recebem natural0 de noite, independentemente da abertura dos estores. Cada varanda só recebe o recorte elétrico quando a respetiva luz está ligada. Preservar regra diurna, luzes/estores interiores, recortes de janelas, fotos, associações e comandos.76 testes passaram, incluindo independência das duas luzes e estores100% sem iluminar varandas de noite.


# Renders do sótão — 1.059

Recursos originais896×1190 copiados sem edição: assets/sotao-diurno-v1.jpg de Gemini_Generated_Image_a19cb5a19cb5a19c.jpg; assets/sotao-estores-fechados-v1.jpg de Gemini_Generated_Image_ru1nsjru1nsjru1n.jpg; assets/sotao-noturno-abertos-v1.jpg de Gemini_Generated_Image_wo8nctwo8nctwo8n.jpg. Recorte pelo contorno exterior das paredes, sem o fundo das fotografias, preservando paralelos da Casa. Não gerar novas imagens nem retocar pixels.

floor4-render.js é addon independente montado por CasaAddons. Usa createRegions, auxiliar puro extraído de floor3-render, com regiões disjuntas de studio/living2/stairs4 e das duas janelas. Dimensões/IDs/estado do piso3 preservados; testes anteriores continuam válidos. No sótão os limites51,10..858,1178 mapeiam55,90..885,1278; conservar geometria original invisível para clique/contenção e posições guardadas. Não sobrepor chão, escadas, móveis, porta ou vidros nativos sobre as imagens que já os incluem. Os renders não representam Velux; não as pintar como retângulos no chão e não criar estores para elas. A preferência Velux e os recursos antigos permanecem guardados para o desenho nativo de fallback.

Dois estores independentes: studio-west afeta todo o Estúdio; living2-west afeta Sala2 e luz natural nas escadas. A0% só o render escuro nessa divisão; percentagens intermédias interpolam. Dia/noite seleciona a imagem clara ou lunar. Luz elétrica local em demonstração usa94% do recorte diurno sem clarear a janela fechada; escadas mantêm a sua luz separada. Sem nova associação ou comandos. Desativar película sintética apenas no piso4 com render ativo.

HOTSPOTS adapta só posição visual/clique/banner às janelas das fotografias: estúdio x65/y542..654, Sala2 x65/y810..923. Preservar os IDs e percentagens do inventário nativo. Piso3, garagem, leituras Cloud e backups não mudam.

80 testes passaram: estados extremos, independência de divisões/luz/estores, opacidade real nos dois períodos e cobertura sem sobreposições. UI com fixture estritamente fictícia review/floor4-render-fixture.html verificou dia, estúdio0%/Sala2 100%, luz ligada mantendo0%, noite com estores abertos e todosfechados. Provas review/sotao-dia-1.059.png, sotao-estudio-fechado-1.059.png, sotao-estudio-luz-1.059.png, sotao-noite-1.059.png e sotao-fechado-1.059.png. Nenhum equipamento real em testes.


## Render elétrico fornecido — 1.060

Imagem original Gemini_Generated_Image_jn9nuxjn9nuxjn9n.jpg preservada em assets/piso3-luz-eletrica-v1.jpg, 816×1280. floor3-render.js usa esta quarta imagem nos recortes elétricos de cada divisão, excluindo janelas. Com luz desligada a contribuição é zero; à noite com luz ligada é 1, independentemente do estore; de dia é proporcional à falta de abertura/luz natural (1 − natural). Assim, estore fechado + luz ligada usa integralmente o render elétrico, enquanto luz natural abundante preserva o diurno. Mantêm-se as máscaras e dependências existentes, incluindo luzes independentes das varandas. Não altera estados, configurações ou comandos Shelly.

81 testes passaram; comparação visual isolada sem dispositivos em review/electric-preview.html e review/piso3-eletrico-1.060.png.


## Render elétrico do sótão — 1.061

Imagem Gemini_Generated_Image_qrd1a0qrd1a0qrd1.jpg copiada integralmente para assets/sotao-luz-eletrica-v1.jpg. floor4-render.js usa este quarto render nos recortes elétricos locais, excluindo janelas e exterior. Luz desligada = contribuição zero; noite e luz ligada = 1 independentemente do estore; dia e luz ligada = 1 − abertura do estore da zona. Mantém independência de estúdio, Sala 2 e escadas, estados/configuração/IDs e comandos anteriores.

82 testes passaram, incluindo limites de abertura e noite, isolamento e referência ao novo recurso. Comparação visual sem dispositivos em review/attic-electric-preview.html, captura review/sotao-eletrico-1.061.png.


## Hover dos estores — 1.062

HOTSPOTS dos renders 3/4 são calculados a partir dos retângulos WINDOWS e da mesma transformação SVG das fotografias. home.js aplica esses limites à zona clicável, posição inicial do banner e contorno; margem do contorno fotográfico 2 unidades, mantendo área de toque ampliada. Corrige deslocamento herdado da geometria antiga no piso 3 e substitui aproximações no sótão. Não altera IDs, percentagens, configuração ou comandos. 82 testes existentes passaram; verificação visual de todos os contornos em review/hover-preview.html e review/estores-hover-1.062.png.


## Calibração da porta no render — 1.063

floor3-render.ENTRANCE centraliza centro, dimensões do alvo, dobradiça e comprimento da folha a partir do vão na fotografia (x767, y606..667, coordenadas fonte). entrance-read usa a transformação da fotografia para o alvo responsivo com mínimo44px. addons aplica a mesma dobradiça/comprimento ao símbolo aberto, preservando o estado fechado impresso, leitura BLU e unknown fechado. Nenhuma alteração de associação ou comando. 82 testes passaram; popup e posicionamento verificados em fixture isolada sem sensor/dispositivos reais; review/porta-calibrada-1.063.png.


## Estore da entrada — 1.064

Por nova instrução, entrada (hall de entrada) acompanha exclusivamente kitchen-west, substituindo a média dos três estores da sala para esta zona. Hall dos quartos, WC e sala mantêm as suas fontes. Escadas stairs3 continuam exclusivamente living-south-right (inferior direito). A luz elétrica local mantém prioridade. Regressões com abertura/fecho independente em dia/noite, sem equipamentos reais.


## Luz partilhada da sala/cozinha — 1.065

Nova afinação do utilizador substitui 1.064: entrada e WC entrada (bath3) recebem média dos três estores kitchen-west/living-south-left/living-south-right, tal como o estado geral de cozinha/sala. Hall dos quartos mantém fontes dos quartos; escadas continuam só inferior direito.

No render, cozinha e sala partilham a mesma máscara alfa com gradiente vertical contínuo de y660 a1132, sem corte entre zonas: em cima 45% cozinha +55% média dos inferiores, em baixo 5% cozinha +95% média dos inferiores. Percentagens de abertura multiplicam estes pesos; todos abertos=1, todos fechados=0. Fechar só cozinha deixa55%em cima/95%em baixo. A máscara só controla a mistura das fotografias naturais dia/noite; iluminação elétrica local permanece independente. Janelas, paredes e restantes recortes preservados.

83 testes passaram, incluindo misturas/fontes/isolações e extremos. Verificação visual real dos recortes em três estados, sem rede ou equipamentos: review/openplan-light-preview.html; captura review/luz-sala-cozinha-1.065.png. IDs SVG da pré-visualização são únicos por exemplo para não partilhar gradientes.


## Banners de temperatura móveis — 1.066

CasaSensorLayout reutiliza o controlador de arrastamento/teclado/retângulo completo de label-layout, separado das legendas, em casa-leal-sensor-layout-v1. Papéis master/living/meteo/garage ficam respetivamente em master/living/balcony-south/garage nos pisos3/−1. Guardar só no fim de drag ou Alt+seta; cancelamento repõe início. Mudanças de leitura/redimensionamento recontêm o banner inteiro. Coordenadas SVG pela CTM mantêm zoom; dois dedos cancelam drag e passam a zoom; swipe de piso não captura o banner. MeteoNL/navegação adiam durante drag. Só usa os mesmos snapshots de leitura, sem comandos nem pedidos adicionais.

sensorPositions valida só as quatro divisões permitidas; sensorRoom restringe garagem ao chão interior do render excluindo paredes. Backup inclui sensorLayout opcional, preservando ficheiros antigos e posições das legendas independentes. 84 testes passaram (contenção, posições/backup e gestos existentes); teste visual real com rato na fixture fictícia em sala, suite, varanda e garagem, incluindo arrastar além dos limites. Captura review/sensores-arrastados-1.066.png.


## Remate do quarto do Gui — 1.067

A máscara bedroom2 inclui o remate direito do armário/parede x530..550,y405..440 da fotografia, anteriormente atribuído ao hall. Acompanha o estore e luz do quarto do meio em todos os renders; chão abaixo do remate continua hall. Geometria fotográfica intacta, sem comandos/associações novas. 85 testes passaram, incluindo pontos no remate e no chão adjacente. Comparação visual com estore100/0 em review/bedroom-corner-preview.html e review/canto-quarto-gui-1.067.png.


## Slider dos banners de temperatura — 1.068

Definições junto de Mostrar temperatura e humidade: sensor-banner-scale, 60..160%, passo5, omissão100. Atualiza no evento input e persiste número validado em casa-leal-sensor-banner-scale-v1; backup opcional sensorBannerScale (Layout.sensorScale). Multiplica a fonte base e padding relativo; retângulo completo volta a ser contido, diminuindo progressivamente o tamanho caso não caiba na divisão. Sem transform CSS de escala que engane dimensões de arrastamento; posições, contactos e leituras intactos. Sem comandos/pedidos novos. 86 testes passaram. UI da fixture fictícia verificada nos extremos60/160 e contenção da suite/sala/varanda; review/tamanho-banners-1.068.png.


## Portão da garagem — 1.069

Recurso fornecido Portão.png copiado sem edição para assets/portao-garagem-aberto-v1.png. garage-render sobrepõe em x320,y870,w545,h330 (coordenadas nativas), como na referência do utilizador; addon só visível com gateSnapshot.open===true confirmado. Com luz apagada adapta o brilho do addon. Restantes pixels do render/carro mantidos.

Config opcional gateContact {deviceId,channel,source:blu/bthome}, independente de entranceContact e sem migração/ID inventado. Mesmo validador BLU, ID XB completo, contacto duplicado com entrada recusado. Definições Garagem/Contacto BLU do portão; campo vazio até utilizador fornecer ID. Backup valida/preserva e mantém associação atual ausente de cópia antiga na mesma conta; null remove explicitamente.

CloudCore gateSnapshot usa estado booleano explícito, online e fresco45s; desconhecido/offline/erro/stale nunca confirma fechado nem aberto. Transporte e fila só status/get, leitura com conta comum, polling30s ou15s no popup; guardar/abrir só consulta. gate-read fornece zona clicável no vão inferior, popup de estado e atalho para configurar; acesso também no popup da garagem. Não existem comandos para mover o portão nem participação em grupos/cenários/reset.

89 testes passaram: contactos independentes, IDs/backup/duplicados, estado aberto/fechado/offline/erro/stale e render true-only. Fixture review/gate-fixture.html usa só IDs/chave falsos e bloqueia rede não prevista; ?closed e ?offline. Verificados visualmente addon aberto, fechado sem addon, popup, campo da garagem e guardar só com leitura. Captura de demonstração com sensor fictício review/portao-aberto-1.069.png.


## Sensor BLU do portão associado — 1.070

ID fornecido XB106582486435511, source blu, componente0. Associação inicial única em shelly-setup (gateContact vazio/ausente), preservando associação existente. Marcador casa-leal-gate-associated-v1 validado/incluído no backup como gateAssociated; permitir remoção sem voltar a associar. Preserva XB completo, conta/credenciais, fila/polling e apenas consultas. Fixtures com fixtureKeys marcam migração concluída para manter apenas IDs fictícios. Nenhum equipamento real usado em testes.


## Primeiros quatro estores associados — 1.071

Associação explícita pedida: master-north/suite34945469ff57; bedroom2-north/quarto do meio485519027c43; kitchen-west/cozinha34945468f610; living-south-left/sala esquerda10521c0719c0. Tipo cover, canal0 por omissão (preservar canal já editado quando o ID coincide). Migração única casa-leal-first-blinds-associated-v1, marcador firstBlindsAssociated booleano validado/exportado no backup; preservar todos os outros campos/associações e permitir edições/remoção posteriores sem repetir migração. Validação integral antes de persistir, incluindo saídas duplicadas.

Esta entrega associa IDs; estores da Casa Leal continuam em demonstração, sem consultas/atuação Cloud de covers ainda implementadas, como comunicado ao utilizador. Não atribuir estados/percentagens reais nem enviar comandos ao associar. Fixtures com migrações automáticas bloqueiam também este marcador; testes nunca usam equipamentos reais.


## Estores com controlo real — 1.072

Substitui a limitação de demonstração para estores associados. blind-core normaliza Gen1 rollers[channel] e Gen2 cover:n no canal exato, current_pos0..100, calibração, estado e erros. Gen1 open/close significam movimento; Gen2 open/closed são finais. Estado de movimento ausente não confirma paragem. Não adivinhar saída/canal, posição ou perfil. Online e frescura45s exigidos; percentagens exigem posição válida e calibração não explicitamente falsa. Erros bloqueiam movimento, mantendo Parar disponível quando a saída está online/recente.

CloudReadCore inclui os IDs configurados na mesma conta/fila com os monitores, deduplicados em lotes<=10. Comandos explícitos POST /v2/devices/api/set/cover, body{id,channel,position} com open/close/stop ou número inteiro0..100, conforme shelly-transport da app original. Mesmo servidor/chave/geração/intervalo, sem novo transporte nem credenciais. HTTP200 apenas aceita o pedido; nunca altera a posição local. Consulta imediata, acompanhamento a cada2s até90s (fila/intervalo respeitados), sem repetir comandos falhados. Normal com estores15s, outros monitores30s; visibilidade e configuração suja bloqueiam. Respeitar Retry-After429 e autorização recusada. Protetor adia enquanto comando/confirmação pendente.

Home usa estado visual efetivo separado da demonstração: banners/percentagens/iluminação acompanham leituras reais; dados inválidos/offline/stale mostram traço e motivo, última posição confirmada apenas como fallback visual, ou escuro se nunca conhecida. Nunca guardar essa posição como demonstração. Popup individual e divisão permitem abrir/fechar/parar/slider; slider real só envia em change, sem comandos em input. Guardar/importar/carregar/consultar/abrir popup e Repor demonstração nunca movem equipamentos. Reset preserva leituras reais, afeta apenas demonstração.

Abrir/fechar todos é uma ação explícita: comandos individuais sequenciais nos estores reais disponíveis, restantes simulados; indisponíveis ignorados e contados. UI distingue pedidos enviados de posições confirmadas. Luzes e estores sem associação continuam em demonstração. Conserva IDs e canais da1.071.

100 testes passaram, incluindo Gen1/Gen2/finais, validação/canais, dados ausentes/offline/stale/erros, ausência de otimismo, cancelamento por configuração, paragem, timeout90s, não repetição, Retry-After e lotes. Teste visual exclusivamente com fixture de quatro IDs hex fictícios e Cloud intercetada: percentagens iniciais com0comandos; fecho/slider individuais; abertura pelo popup da divisão; grupo enviou exatamente4pedidos, sem duplicados; reset deixou contagem inalterada e estados reais intactos; offline mostra traço e controlos desativados. Não acionar nem alegar teste de movimentos em equipamentos reais.

Fixture: review/blinds-control-fixture.html, modos offline/wrongchannel/uncalibrated/reject/hold, gerada a partir de review/blinds-fixture-header.txt e fontes atuais. Provas: review/estores-controlo-1.072.png e review/estores-offline-1.072.png. Apenas dist/, caminhos relativos e funcionamento estático Pages preservados.


## Alarme da garagem — 1.073

Adapta o esquema e SVG dinâmicos do alarme da cave da app original, sem alterar fotografias, carro ou paredes. Símbolo circular arrastável na garagem: verde armado, cinzento desarmado, vermelho animado no disparo (prioridade), âmbar desconhecido/parcial; respeita movimento reduzido. Popup separa armação e disparo, permite apenas comando explícito de armação e consulta. Disponível também no popup da garagem e nos controlos gerais; excluído de grupos, cenários e reset.

Associações confirmadas pelo utilizador: arm 441793d689c0, trigger e9df24, canal0 e ON ativo em ambos. Migração única casa-leal-alarm-associated-v1 preenche apenas papéis ausentes, preserva edições e remoções futuras. alarm opcional validado por home-core/alarm-core; arm não pode duplicar atuador existente, trigger não pode ser a mesma saída de arm. Backup preserva alarm, marcador booleano e casa-leal-alarm-layout-v1; importação antiga da mesma conta conserva associações ausentes.

Estado exclusivamente booleano de relays/switch no canal exato, online/sem erros/fresco45s; sem inferência por potência ou estado otimista. Só arm recebe set/switch com booleano explícito. Trigger é estritamente de leitura. Conta/fila/geração/transporte/lotes<=10 partilhados, consulta15s; após comando consulta imediata e acompanhamento2s até90s, sem retry automático. Configurar/guardar/importar/abrir/consultar nunca atua. Configuração suja, dados antigos/offline e confirmação pendente bloqueiam comandos; protetor adia durante confirmação.

110 testes passaram, incluindo sintaxe de todos os scripts da entrega, estado prioritário, polaridade, canais, duplicados, backup/layout, guardas, timeout, fila e ausência de otimismo/retry. UI com review/alarm-fixture.html e IDs/chave estritamente fictícios: armado, desarme pendente até leitura confirmada, disparo, offline com botão bloqueado, arrastamento sem popup/comando e campos independentes. Nunca testar alarme real nem alegar atuação real. Provas review/alarme-garagem-armado-1.073.png, review/alarme-garagem-disparo-1.073.png e review/alarme-garagem-popup-1.073.png. Ver ALARME-GARAGEM.md.


## Comunicação Shelly fluida — 1.074

Substitui as regras de consulta/confirmacão das versões1.072/1.073, preservando o design, configurações, IDs e comportamento de demonstração existentes. Referência lida: shelly.js, shelly-transport.js, confirmation-core.js, cloud-activity-core.js e FLUIDEZ-SHELLY.md da Domótica NL. Foram adaptados apenas mecanismos genéricos; não copiar associações, migrações, IDs ou segredos da outra casa.

shelly-transport.js gere uma única fila para todos os pedidos; intervalo mínimo1500ms depois de terminar/abortar a resposta anterior, incluindo leitura do corpo. Metadados temporários last/retryAt/strikes por servidor, sem IDs/chave e fora do backup, partilhados por localStorage; Web Lock quando disponível. Sem Web Locks, timestamps são fallback e não garantem exclusão entre processos. Timeout20s apenas de leituras; cancelStatus só aborta status. Atuação enviada nunca é cancelada nem repetida. Guardas de configuração/geração/estado à saída da fila cancelam apenas pedidos ainda não enviados. Erros/redações não expõem credenciais.

cloud-read.js agenda geral30s após conclusão, apenas visível e configuração limpa. Abertura de popup de equipamento suspende restantes e limita IDs ao âmbito, renovando15s após conclusão. IDs de quarto/divisão derivam das associações atuais e de WINDOWS; garagem inclui os seus monitores, sensor, contacto e alarme. energy/EV/entrada/portão/alarme/estore são específicos. Leituras recentes10s e consultas concorrentes são reutilizadas; manual força só o âmbito atual. Fechar retoma geral após2s, depois cadência30s. Wake/foco/online reutilizam leituras recentes; MeteoNL visível mantém o agendamento da casa e não consulta fora do popup ativo.

cloud-read-core aplica cada lote<=10 de imediato, apenas aos IDs pedidos, com timestamp real; interrupção/falha posterior não elimina lotes recebidos nem marca outros aparelhos. Prioridade: comando do utilizador, confirmação, popup, geral. Pode interromper status e descartar lotes ainda não enviados; não tratar preempção como falha de rede. Dados recentes continuam a permitir comandos durante consultas; pausas/erros/saídas inválidas/estado antigo/sujo continuam a bloquear. Uma resposta anterior ao comando não confirma estado novo.

confirmation-core tem ticket independente por alvo/revisão. Relé de armação (único relé com controlo real nesta app): até3 consultas, esperas1,5/4/10s, prazo30s. Estores: até5, esperas1,5/4/8/12/16s, prazo60s. Só consulta o ID comandado, inclusive quando outro popup está aberto. Confirma booleano real/posição ou movimento na direção pedida; movimento confirmado não significa chegada ao destino. Sem confirmação termina pendente com mensagem explícita, conserva estado recebido e regressa às consultas normais. Nenhuma repetição de atuação, inclusive em429/falha/timeout. Luzes mantêm demonstração, sem associações ou atuação nova.

Retry-After numérico/data respeitado. Sem cabeçalho:2,5/5/10/20/40s, reinicia após resposta bem-sucedida. Recuperação de leitura focalizada precede geral e nunca guarda intenção de comando. Leituras anteriores em memória mantêm valores/timestamps e indicação Última leitura; não inventar zeros nem renovar idade numa falha. Histórico de estores, relés/contactos, EM/EV e sensores é só apresentação; não concede comando nem animação. Campos individuais de sensores ausentes também preservam o histórico.

125 testes fictícios passaram: fila após conclusão/corpo, duas janelas/lock, Retry-After/data/backoff, aborto só de leitura, precedência, preservação parcial e timestamp, não otimismo, limites efetivos de tentativas/prazos, reaproveitamento10s, âmbito de popups, geral30s, oculto/sujo, backup e sintaxe. UI isolada review/communication-fixture.html?slow: configuração só fictícia, todas rotas intercetadas; popup mantém estado recebido após um comando único e três verificações individuais; botão disponível durante leitura e depois de esgotar confirmação; sem erros de consola. Captura review/comunicacao-confirmacao-1.074.png. Nunca testar com equipamentos reais. Ver FLUIDEZ-SHELLY.md dentro de dist.


## Transições suaves de iluminação — 1.075

floor3-render compõe uma máscara alfa única de luz natural e outra de luz elétrica, com feGaussianBlur stdDeviation4 nas coordenadas da fotografia. O filtro atua apenas na máscara, nunca na imagem; suaviza as fronteiras entre divisões em cerca de10px, preservando nitidez dos materiais/contornos. Imagens naturais dia/noite reutilizam a mesma máscara; elétrica usa máscara própria. Manter composição única evita costuras escuras de sobreposição quando todos os estores estão abertos. Contorno exterior continua recortado por OUTLINE. Preservar geometria PARTITIONS, retângulos de janelas/hover, níveis de iluminação, gradiente cozinha/sala e todos os estados/associações Shelly. Não alterar sótão nem garagem neste ajuste.

Atualizadas as verificações existentes de markup para a máscara partilhada. Suite125 testes passou. Pré-visualização review/desvanecimento-piso3.html sem qualquer transporte/equipamento permite alternar escritório+WC suite escuros e tudo aberto; verificado sem costuras no caso uniforme e sem erros de consola. Prova review/desvanecimento-piso3-1.075.png. Alterações só em dist, versão1.075 nos metadados/cache/backup.


## Contactos das janelas e folha vermelha — 1.076

windowContacts opcional na configuração da mesma conta, chaves dos nove estores de fachada. Schema por contacto {deviceId,source:blu/bthome,channel0..255}; IDs XB completos preservados, sourceBLU e componente0 por omissão nesta associação. windows-core valida e recusa contacto repetido entre janelas, entrada e portão. Não confundir contacto de janela com o estore nem inferir abertura por percentagem/luminosidade. Dados exclusivamente booleanos window:N.open/value normalizados pelo ContactCore; online/sem erro/fresco45s. Unknown/offline/stale mostra indicação âmbar ?, nunca assume fechada nem recorre à demonstração. Histórico identificado no popup, sem conferir estado atual.

IDs fornecidos pelo utilizador, migração única casa-leal-window-contacts-associated-v1 completa só papéis ausentes: master-north XB154411473786357; bedroom2-north XB106582486823095; living-south-left XB66172384108257; kitchen-west XB106582486821873. Não copiar IDs da outra casa. Preservar edições e permitir remover sem voltar a associar. Config, backup e consultas opcionais mantêm ficheiros antigos compatíveis. Importação antiga da mesma conta preserva windowContacts ausente e revalida contactos após fusão. Marcador booleano incluído no backup.

cloud-read-core inclui/deduplica estes IDs em deviceIds/lotes<=10, aplica apenas as leituras pedidas e guarda histórico com timestamp original; popup da divisão dá prioridade aos contactos e estores dessa divisão. Usa fila/geração/pausa/consultas gerais30s e popup15s existentes, sem transporte paralelo. Não existe endpoint de atuação de janela. Guardar/importar/carregar apenas consulta.

windows.js sobrepõe SVG nativo: pequena folha de vidro deslocada com contorno/preenchimento vermelho e seta, sempre visível com abertura true confirmada. Usa HOTSPOTS calibrados dos pisos3/4, respeita orientação norte/sul/oeste e zoom sem editar pixels do render, alterar luz ou estore. Nenhuma animação contínua. Banners dos estores recebem afastamento discreto quando há folha/marcador para não taparem a indicação. Restantes janelas ficam em demonstração, fechadas por omissão, com Abrir/Fechar demo no popup da divisão; estado booleano separado casa-leal-window-demo-v1, validado e incluído no backup. Repor demonstração só limpa esta simulação e mantém leituras reais. Controlos de demo nunca enviam comandos.

Associações editáveis por divisão, junto do estore, como Janela/só leitura. Popup diferencia leitura Cloud e demonstração; contactos reais não apresentam botão de simular abertura. Velux mantêm desenho anterior e não recebem contactos/estores inventados.

130 testes passaram, incluindo migração/mapeamento, schema/duplicados, backup antigo/remoção, IDsXB, true/false/offline/erro/stale, âmbito de consulta e independência entre janela/estore. UI com review/windows-fixture.html e quatro IDs fictícios, fetch bloqueado fora de status/get: folhas vermelhas, offline com ?, demo aberta→fechada sem comando ou alteração do estore, popup real só leitura; zero atuações. Captura review/janelas-vermelhas-1.076.png. Nunca testar com equipamentos reais. Apenas dist, versão1.076 e caminhos relativos.


## Realce da porta principal — 1.077

entrance-read.js mantém ENTRANCE.x/y como centro calibrado do vão (não canto superior esquerdo). Contorno visual separado do alvo de toque: pseudo-elemento com largura/altura reais projetadas por getScreenCTM e margem2px, borda2px #72bfff, preenchimento #4bafff33 e raio3px, como os estores. Não desenhar cápsula grande sobre a área mínima44px do botão. Hover e focus-visible mostram o mesmo contorno; substituir só o outline global deste botão pelo contorno calibrado para manter foco visível sem duplicação. app.positionLabels chama CasaEntrance.position também ao ampliar/deslocar/redimensionar.

Preservar sensor, popup, comandos/leituras, geometria e fotografias. Sem atuações novas. Janelas1.076 e respetivas associações mantidas. 130 testes aprovados; verificação visual com fixture fictícia, foco na porta e sem erros de consola, prova review/realce-porta-1.077.png. Alterações só em dist, versão/cache/backup1.077.


## Estado da janela no banner do estore — 1.078

Por pedido explícito, substituir a folha deslocada/seta1.076 por faixa vermelha exatamente sobre o retângulo calibrado da janela. windows.js mantém estado booleano/leitura/demonstração e indicação âmbar de desconhecido; não gera render novo nem desenha seta. home.position aplica window-is-open ao banner apenas com open===true e mostra Janela aberta (demo identificada); inclui estado da janela em aria-label/title. CSS vermelho permanece também em hover/foco, ícone acompanha o tom. Sem leitura confirmada não tornar vermelho nem assumir fechado: texto Janela por confirmar. Janela fechada regressa ao estilo azul, sem texto extra.

A percentagem continua exclusivamente do estore; abrir janela não altera posição, iluminação nem comandos. Repõe posições normais dos banners (sem afastamento adicional1.076), porque o próprio banner transmite a abertura quando cobre o vidro. Ocultar percentagens continua a mostrar a faixa na janela. Não alterar associações, conta, transporte, backups exceto versão1.078. Apenas dist.

Seis verificações relevantes passaram (windows e sintaxe). UI fictícia com red-banner/vidro, WC fechado azul, percentagens100% preservadas, opção Mostrar percentagens a ocultar os banners e revelar faixas sem seta; sem erros de consola e zero comandos. Provas review/janela-banner-vermelho-1.078.png e review/janela-faixa-vermelha-1.078.png. Nunca testar com aparelhos reais.


## Indicação discreta de janela aberta — 1.079

Por pedido do utilizador, o banner do estore mantém integralmente o azul normal, incluindo hover/foco. Apenas border/box-shadow de .blind-banner-icon recebem auréola vermelha com window-is-open; não alterar fundo, texto nem borda exterior do banner. Preservar texto Janela aberta e percentagem independente. A sobreposição sobre o vidro passa a preenchimento vermelho14% e contorno vermelho1,5px non-scaling-stroke (sem seta), mantendo alinhamento geométrico e todos os validadores/estados anteriores.

Seis verificações relevantes aprovadas (windows + sintaxe). Fixture local fictícia: banner azul, círculo vermelho com janela aberta e círculo normal no WC fechado; zero comandos. Prova review/janela-aureola-1.079.png. Só dist, versão/cache/backup1.079, nenhuma alteração à comunicação ou associações.


## Associações Shelly Bulb — 1.080

Pedido explícito de associação: lights['3:living'] ID98cdac2d2eb6, lights['3:bedroom2'] ID98cdac1f18fa e lights['3:master'] ID98cdac1df7e9. Tipo light, canal0 por omissão; conservar canal editado se o ID já coincide. Home.associateBulbs substitui só estes três papéis pelos IDs pedidos e preserva restantes luzes. Migração única casa-leal-bulbs-associated-v1 valida o setup completo/duplicados antes de persistir e só depois guarda marcador, atualizando baseline; remoções/edições posteriores não são repetidas. Mesmo armazenamento/conta e política de chave existentes, sem credencial nova.

Esta entrega associa IDs nos campos existentes por divisão; não ativa transporte/controlo real de luzes. Estado/interruptores/ações gerais de iluminação continuam em demonstração, como comunicado ao utilizador. Não incluir as Bulb em leituras/atuações antes de implementar normalização/guardas de luzes e confirmação apropriadas. Nenhuma atuação para testar a associação.

Backup já preserva lights pelo Home.setup; inclui agora marcador bulbsAssociated booleano validado e rótulo de exportação. Fixtures com fixtureKeys marcam esta migração concluída para não inserir IDs reais. 14 verificações de associações, modelo, backup e sintaxe passaram sem rede/equipamentos reais. Só dist, versão/cache/backup1.080.


## Tamanho dos banners dos estores — 1.081

Slider blind-banner-scale nas definições, junto de Mostrar percentagens dos estores,60..160%, passo5, omissão100. home.js carrega/valida inteiro, atualiza em input e guarda casa-leal-blind-banner-scale-v1. Escala proporcional do botão completo (ícone/textos/auréola), sem mudar percentagens nem estado da janela. Mantém ancoragem central nos vãos norte/sul e lateral nos de oeste; pseudo-elemento transparente conserva alvo de toque mínimo44px mesmo com visual reduzido. Sem alterações à iluminação, contactos ou comunicação Shelly.

Backup opcional blindBannerScale via Layout.blindScale (mesmos limites validados do sensorScale), exportação/rótulo próprios; ficheiros antigos sem campo conservam preferência existente. Independente de sensorBannerScale e visibilidade dos banners. Versão/cache/backup1.081, só dist.

13 verificações relevantes passaram (layout/preferência/backup/sintaxe). Fixture fictícia: slider100→60 por teclado, texto60% e banners reduzidos com azul/auréola vermelha intactos; sem erros de consola e zero comandos. Prova review/banners-estores-60-1.081.png.


## Remover check Velux — 1.082

Retirar Mostrar janelas Velux das definições e respetivo listener/referência DOM. Preservar desenhos e preferência anterior showVelux, compatível com backups antigos; CasaAddons.veluxVisible devolve a preferência em memória para exportar sem depender do input removido. Sem alterações a contactos, renders ou Shelly. Versão/cache/backup1.082 e só dist. Verificações existentes de backup e sintaxe, sem equipamentos reais.


## Equipamentos por piso — 1.083

Nas definições, mover os nós existentes shelly-energy-group para dentro de Piso3 (antes das divisões) e shelly-ev-group para Piso−1/Garagem. Não clonar campos, alterar IDs/canais/valores, listeners nem formato do backup. Os grupos mantêm details independentes, fechados por omissão; campos continuam no formulário e validação revela antecessores.

CasaShellySetup.openEquipment abre o grupo alvo e todos os details antecessores e desloca para o alvo. Atalhos Configurar contador e Configurar carregador usam este helper para não deixar o equipamento oculto pelo piso/divisão recolhidos. Abertura/fecho só muda UI; sem atuação, associação ou credencial nova.

16 verificações existentes de contador/EV/sintaxe passaram. Fixture fictícia confirmou atalho do contador com Piso3/grupo abertos e hierarquia Piso−1/Garagem/Carregador; sem erros de consola. Prova review/equipamentos-por-piso-1.083.png. Apenas dist, versão/cache/backup1.083.

# Luzes reais — 1.084

As luzes associadas deixam de ser demonstração: light-core.js normaliza booleanos Gen1/Gen2 no canal exato, deteta família real sem enviar comandos exploratórios e exige leitura online recente45s. cloud-read-core usa a fila existente e confirma explicitamente por até três leituras1,5/4/10s, prazo30s; nunca estado otimista/retry. Popup e Ligar/Apagar todas controlam luzes associadas disponíveis; restantes simuladas. Reset preserva sobreposição real. Configurar/importar/consultar nunca atua. Testes apenas fictícios em tests/light-control.test.cjs e review/lights-fixture.html. Ver LUZES-SHELLY.md.

# Banners e carregador — 1.085

Tamanho comum em banner-size.js/banner-size.css, chave casa-leal-banner-scale-v1, slider único60..160%. Aplica a legendas, sensores, estores, EV e alarme; manter barra do contador como controlo fixo. Migração lê tamanho antigo de sensores ou estores se não existir chave comum. Backup valida bannerScale; importação antiga deriva do tamanho de sensores, ou estores quando só esse existir. EV usa CasaCreateLayout com contenção do retângulo completo na garagem, rato/toque/Alt+setas, supressão do clique após arrastar, chave casa-leal-ev-layout-v1 e backup evLayout. Check show-ev-banner continua independente, não altera medição, carregador nem comandos. Geometria considera dimensões visuais após escala e adapta a divisões pequenas. Testes/fixture apenas fictícios.

# Barras discretas dos estores — 1.086

Leitura adicional independente dos banners e hover, check show-blind-bars, preferência casa-leal-show-blind-bars-v1 e backup showBlindBars booleano. Faixa fina no vidro alinhada aos HOTSPOTS existentes, preenchimento inverso à percentagem aberta. Snapshot real existente; último valor âmbar/tracejado, desconhecido sem preenchimento, nunca assumir fechado. Não altera luz natural, posições, comandos ou pedidos Cloud. Sem barras nas Velux. Testes fictícios em blind-bars.test.cjs e review/blind-bars-fixture.html; ver BANNERS.md.

# TV por consumo — 1.087

TV da sala opcional tvMeter (ID437c82/canal0 indicado pelo utilizador), migração única tv-associated, configuração/backup/consulta partilhados. Só leitura: Gen1 meters/emeters e Gen2 switch/pm1, canal exato, sem inferir watts pelo relé/somar famílias. Online e fresco45s:>50W ligada,5..50W regeneração,0..<5W desligada. Desconhecido/offline/erro/stale preserva última leitura sem halo/feixe e nunca inventa zero. Banner verde+reflexo SVG animado apenas ligada, amarelo na regeneração, oculto desligada; alvo TV mantém acesso. Escala comum e layout arrastável só na sala, backup tvLayout. Sem comandos/controlo de alimentação e excluída de grupos/cenários/reset. Popup TV foca consulta do seu ID; Sala inclui TV. Respeitar movimento reduzido e camadas fotográficas/paredes. Testes exclusivamente fictícios; ver TV-SALA.md.

# Edição de nomes — 1.088

Duplo clique/F2 em banner de divisão ou sensor abre editor; clique simples mantém popup com deferimento500ms. Nomes opcionais em casa-leal-room-names-v1, backup roomNames validado pelo core, mapa piso:ID estável;1..60 caracteres Unicode, sem controlos e texto escapado por textContent/value. Não mutar plans nem associações. Cancelar não grava; Repor remove só nome personalizado; erros de persistência conservam nomes anteriores. Propagar banners/sensores/título/resumos e recalcular contenção. Preservar drag e edição com Meteo. Ver BANNERS.md e testes/fixture fictícios.

# Termoventilador móvel — 1.090

Recursos dia/noite copiados sem edição da app original, sem alterar renders das plantas. Início Biblioteca/Escritório Gui piso3/bedroom3,810,520. Mistura segue CasaHomeCore.lighting da divisão atribuída, independente do relé; contorno verde apenas ON confirmado. heater opcional ID ea9d29/canal0 por migração única, mesma conta/fila/geração e confirmação3leituras1,5/4/10s/prazo30s. Estado booleano relays/switch fresco45s; sem inferência por watts, otimismo ou retry. Meter Gen1 Watt-minute/Wh e Gen2 Wh separados; manter últimas leituras em falha/offline/stale. Excluir grupos/cenários/reset.

Drag dentro e entre divisões do piso; seletor no popup permite todos os pisos. Layout local validado floor/room/x/y com contenção84×54, persistência e backup. Drop inválido/cancelamento reverte e não abre popup. Setas para mover, alvos44px, preservar zoom/swipe e Meteo. Check showHeater antes do slider final só oculta addon; nunca comanda. Grupo de configuração próprio com proteção de saídas duplicadas. Ver TERMOVENTILADOR.md; testes apenas fictícios.

# Desumidificador móvel — 1.091

Addon próprio dehumidifier, inicial3/bath2(430,750), ID88d798/canal0 por migração única. Sprites dia/noite copiados sem editar da app original, seguem a iluminação da divisão. Estado/posição/marcadores/configuração independentes de heater. Mesma fila/conta/geração e confirmação3leituras1,5/4/10s/prazo30s, relé booleano Gen1/Gen2 fresco45s; sem inferência por watts, otimismo, retry ou atuação por mover/guardar/consultar. Leitura W/kWh reutiliza normalizador puro do termoventilador. Duplicados entre atuadores proibidos.

Layout floor/room/x/y com contenção84×84 e backup dehumidifierLayout; drag entre divisões, seletor todos os pisos, setas/cancelamento/drop inválido/supressão de clique e bloqueio de swipe/Meteo equivalentes ao heater. Check showDehumidifier antes do slider final, sem mexer nos controlos. Excluir grupos/cenários/reset. Backup preserva associação ausente de cópia antiga da mesma conta e remoção explícita. Testes/fixture só fictícios; ver DESUMIDIFICADOR.md.


## TV — 1.094
Retirado o banner flutuante da TV. Halo verde/amarelo no contorno do próprio ecrã (x68,y888,14×102 na imagem fonte), preservando os limiares de consumo e as guardas de validade. Reflexo com origem limitada ao ecrã e animação contida numa máscara fixa, sem abranger o móvel. Clique na TV mantém o popup de consumo. Posições de banners TV de backups antigos continuam aceites por compatibilidade, sem interface ativa. Testes apenas fictícios.


## Popups compactos — 1.095
Lista por divisão: luz, estores e contactos existentes, sensores associados com valores reais, TV e equipamentos móveis na localização atual. Garagem inclui carregador e armação/sirene em linhas separadas. Contador geral acessível na entrada do piso 3 e incluído no âmbito de consulta desse popup. Nenhuma associação ou ID é copiado da outra casa. Sensores seguem a frescura de 120 s dos banners; valores antigos são Última leitura. Consumos conservam leituras anteriores identificadas. Atualização local de validade não envia pedidos. Janela de 460px, linhas de 60px e alvos mínimos de 44px, scroll limitado à altura disponível. Abertura e consulta nunca atuam, mantêm fila/foco e confirmação existentes. Ver tests/room-inventory.test.cjs e review/rooms-fixture.html (rede intercetada, apenas equipamentos fictícios).

## Máquina de lavar loiça — 1.096

`dishwasherMeter` opcional, só leitura, ID solicitado e465b8b1526c/canal0, migração única validada com marcador no backup. Preservar remoções/edições e backups antigos da mesma conta. Fila/conta/polling partilhados: âmbito dishwasher-dialog só a máquina, Cozinha inclui a máquina. Atividade apenas por potência real fresca >10 W, mesmo limiar e símbolo do kitchen.js original; unknown/offline/erro/stale sem animação/halo, últimos valores identificados. Nunca atuar automaticamente ou acrescentar a cenários/grupos/reset. Exaustor retirado por recortes imagegen locais dos quatro ambientes, antes das máscaras existentes; restantes pixels preservados. Documentação/prompts e testes fictícios em MAQUINA-LOICA.md.

## Varanda: roupa e caldeira — 1.097

balconyMeters opcional com papéis washer/boiler, canais0 e IDs explicitamente pedidos, migração única validada e marcador no backup. Preservar campo ausente em backups antigos da mesma conta, edições, objeto vazio e remoções null. Só leitura na fila/conta/polling partilhados; popup individual consulta só o papel, popup Varanda inclui ambos. Símbolos originais kitchen.js: tambor e chama, atividade por potência real fresca >10 W. Sem dados/offline/erro/stale, animação e halo param, últimos valores identificados. Não acrescentar atuação, grupos ou automações. Apenas planta do canto inferior direito removida por quatro recortes imagegen locais antes das máscaras; preservar plantas da esquerda e resto do render, incluindo bancada sem exaustor. Ver VARANDA-APARELHOS.md e testes/fixture fictícios.

## Indicadores offline — 1.098

connectionState(scope) deriva de online false/0 explícito na resposta Cloud, sem inferência a partir de OFF, zero, dados antigos ou falhas. Última ligação confirmada mantém-se durante falhas, nova consulta/reconfiguração atualiza/limpa. offline.js apenas apresenta sinais nos equipamentos/banners/popups e resumo deduplicado; não consulta nem atua. Termoventilador/desumidificador: halo vermelho de offline e texto Offline, sem fingir OFF nem apagar valores conhecidos. Recuperação remove sinais e repõe estado confirmado. Preservar alvos de rato/teclado/drag e fila/foco/credenciais. Ver SHELLY-OFFLINE.md e testes/fixture fictícios.

## Layout do popup de estores — 1.099

Preservar IDs/handlers de comandos, fila e confirmação. Representação visual e percentagem seguem posição reportada, sem otimismo; última posição é identificada, unknown usa traço/interrogação. Novo layout compacto conforme imagem do utilizador, com Abrir/Parar/Fechar, slider, refresh/configuração circulares e consumos. Medição somente no canal associado: Gen2 cover.apower/aenergy.total Wh; Gen1 meters.power/total Watt-minute. Última potência/energia por campo conservadas em memória e identificadas em dados antigos, offline, erros ou resposta parcial. Não inventar zeros, adicionar pedidos ou usar consumo para inferir movimento. Ver POPUP-ESTORES.md e testes/fixture fictícios.

# Apresentação partilhada dos popups — 1.100

shelly-popup.js/css uniformizam os popups individuais com o estilo da app original: branco translúcido, ações circulares, estado e cartões compactos. Mover os nós de controlos existentes preservando IDs/listeners/guardas; não acrescentar atuações a equipamentos apenas de leitura. Não aplicar este adaptador ao popup de divisão ou de estore. TV mostra energia acumulada da mesma consulta/canal já existente; preservar o total anterior com Última leitura em ausência/offline/erro e não alterar os limiares de atividade. Ver POPUPS-SHELLY.md; fixtures sempre fictícias.

# Alimentação TV, máquinas e caldeira — 1.101

Pedido explícito ativa comando de alimentação para tvMeter, dishwasherMeter e balconyMeters washer/boiler nos mesmos IDs/canais guardados. Substitui a restrição anterior de apenas leitura destes quatro papéis. Usar exclusivamente appliancePowerSnapshot/commandAppliance da fila partilhada: relé booleano exato, online/fresco45s, sem inferência por watts/otimismo/retry, três confirmações apenas do dispositivo. Botão circular separado de atividade/consumo, bloqueado com dados inválidos/offline/antigos ou formulário sujo. Não incluir em grupos/cenários/reset. Proibir duplicados com restantes atuadores; preservar IDs/configurações. Testar apenas com fixtures fictícias. Ver POPUPS-SHELLY.md.

# Escada do piso 3 e sala de jantar — 1.102

Por pedido do utilizador, stairs3 acompanha a luz da sala (living), incluindo a fonte elétrica, em vez de depender apenas do estore inferior direito ou do estado de luz independente das escadas. No render fotográfico, aplicar à escada a mesma máscara gradual openplan da cozinha/sala: a luz natural coincide com a zona adjacente da mesa de jantar à mesma altura. Preservar máscaras de paredes, geometria, imagens e restantes divisões. Sem comandos/alterações de associações. Regressões em floor3-render.test.cjs e shutter-influence.test.cjs.

# Popups compactos — 1.103

Pedido do utilizador reduz os popups no geral para aproximadamente metade da área ocupada. popup-compact.css, carregado depois dos restantes estilos, fixa largura máxima360px, reduz espaços, títulos, pré-visualizações e cartões, incluindo popups Shelly, estores, divisões e definições. Não usar transform/zoom que reduza alvos de interação: preservar botões principais44px, texto12px e scroll interno limitado ao viewport. Reservar espaço do botão fechar nos títulos longos. Sem alterações aos controlos, estados, fila ou associações. Fixtures review/compact-popup-fixture.html e compact-blind-fixture.html apenas fictícias.

# Varandas pelo horário solar — 1.104

A luz natural das duas varandas do piso3 segue CasaEnvironment.isSolarDay (resolveDay automático com nascer/pôr do sol da cidade e estimativa solar existente quando falta previsão), independente dos estores e da pré-visualização interior dia/noite. Sem cidade/período solar disponível, manter fallback do ambiente existente. CasaHome passa balconyDay ao render; exterior recebe natural1 de dia e0 de noite. Máscara própria floor3-balcony-feather mostra o render diurno só no exterior, preservando os estados interiores; à noite mantém base escura salvo luz elétrica da própria varanda ligada. Cada varanda tem estado elétrico independente. Atualização usa environmentchange e temporizadores meteorológicos existentes; não adicionar consultas Shelly nem comandos. Testes balcony-solar.test.cjs e floor3-render.test.cjs; fixture solar fictícia e captura review/varandas-noite-1.104.png.

# Inventário das divisões por tipo — 1.105

room-popup.js reorganiza os nós existentes do popup: alimentação (iluminação, TV, máquinas, caldeira, portáteis e armação do alarme), estores, contactos de janelas/portas e restantes monitores só de leitura. Preservar a pertença das associações à divisão e a localização atual dos portáteis; não importar equipamentos/IDs de outra casa. Cada atuador tem botão circular direto com snapshot/comando individual já existente, booleano confirmado, guardas de dados recentes/formulário sujo e sem otimismo/retry. Preservar acesso Detalhes, os controlos dos estores e a distinção entre alimentação e atividade por consumo. Temperatura/humidade associadas ficam em #room-header-sensor ao lado de #room-title, sem linha duplicada na lista; valores inválidos são traços e dados antigos Última leitura. O cabeçalho não depende do check dos banners. Contagem inclui o sensor do cabeçalho. Manter dimensões compactas, título sem colisão com Fechar e ordem estável dentro do tipo. Ver POPUPS-SHELLY.md e fixture fictícia room-devices-sorted-fixture.html.

# Margem do botão fechar — 1.106

Nos popups compactos, manter .close a12px do topo/direita e outline de foco2px com offset2px, para o halo permanecer dentro da margem arredondada. Preservar alvo44px e indicação de foco por teclado. Verificação visual com fixture fictícia e captura review/botao-fechar-1.106.png.

# Roda dentada única — 1.107

Usar sempre o SVG da roda dentada de #open-settings (topo da app), identificado por data-settings-icon. shelly-popup.js clona esse desenho para todos os botões de configuração, incluindo #blind-configure. Os templates iniciais dos estores/contador e dos portáteis também seguem o mesmo desenho. Preservar viewBox24×24, proporções, traço2 e centragem; não reintroduzir o polígono assimétrico antigo. Apenas apresentação: preservar IDs/listeners/ações. Verificação sintática e visual com fixture fictícia review/gear-icon-fixture.html; captura review/roda-dentada-1.107.png.

# Roda dentada abre o ID exato — 1.108

CasaShellySetup.openDevice(kind,key) procura os campos registados pelo tipo/chave exatos (alarm por papel), abre as definições e todos os details antecessores, centra e foca o input do ID. Não recarregar/resetar/preencher o formulário nem emitir input/change ao navegar. openEquipment(groupId) também foca o primeiro ID dos grupos específicos (contador, carregador e portáteis). Estores usam activeBlind.id, TV tvMeter, loiça dishwasherMeter, varanda o papel selected washer/boiler, contactos a sua chave e alarme arm. Preservar os valores em edição e as guardas existentes. Sem comandos ao navegar. Fixtures device-id-blind-fixture.html/device-id-appliance-fixture.html apenas fictícias verificam foco específico no estore esquerdo e na caldeira, sem confundir com estore direito/roupa. Captura review/id-direto-1.108.png.

# Multimédia da sala apenas no popup — 1.109

mediaBindings opcional contém vodafone e465b8b9c64c, soundbar4359bb, playstation435aa1 e unifi e465b84553bc, canal0 editável. Associações pedidas pelo utilizador, guardadas apenas quando o campo está ausente; mapa explícito vazio/parcial/remoções não volta a preencher automaticamente. Não copiar outros equipamentos da app original. Config, backup e validação de saídas duplicadas partilhados; backup antigo da mesma conta conserva mediaBindings atuais ausentes.

Aparecem exclusivamente no popup de living/piso3, antes dos estores, com W/kWh, estado de alimentação, botão circular e roda dentada para openDevice('media',role). Não criar ícones, animações, hits ou banners na planta. Sem inferir estado operacional por watts. Relé Gen1/Gen2 exato, online/fresco45s; OFF/ON só confirmado; offline explícito e valores anteriores Última leitura. commandAppliance reutiliza fila/conta/geração/guardas e três confirmações apenas do ID alvo, sem retry/otimismo nem grupos/cenários/reset. Consultar/associar/guardar/importar nunca aciona.

Mesma consulta deduplicada e lotes existentes; popup da sala inclui os quatro IDs, outras divisões excluem-nos. Testes living-media.test.cjs usam apenas IDs/chave fictícios, abrangendo formatos de medição/relé, backup, deduplicação, âmbito, offline/erro/antigo e atuação/confirmacão individual. Fixture review/living-media-fixture.html interceta toda a rede; captura review/sala-multimedia-1.109.png.

# Roda dentada da TV na divisão — 1.110

No popup da sala, a linha da TV usa roda dentada circular idêntica aos restantes equipamentos em vez de Detalhes. Abre e foca diretamente tvMeter através de openDevice('meter','tvMeter'), sem atuar. room-popup.js preserva este SVG e o listener, sem o converter novamente em texto. Popup individual da TV continua acessível pela própria TV na planta. Verificação visual e foco do ID com fixture fictícia; captura review/tv-roda-dentada-1.110.png.

# Seguidores visuais dos estores de demonstração — 1.111

HomeCore.DEMO_BLIND_LINKS: living-south-right→living-south-left, suite-west→kitchen-west, bedroom3-north→bedroom2-north, studio-west/living2-west→living-south-left. Aplicar apenas quando o destino não tem associação Shelly. blind-demo-core.js é puramente visual, sem transporte/comandos, e produz o estado usado em render, iluminação, barras, banners, popups e listas. Origem Cloud só fornece posição numérica válida e fresca; ausente/offline/erro preserva última posição visual, nunca inventar0. Se a origem também é demonstração, copiar o seu valor local.

Mover manualmente um seguidor cria exceção temporária: leituras iguais não a apagam; retomar quando a posição válida da origem mudar. Se origem inicialmente desconhecida, primeira leitura estabelece referência e não apaga o manual. Botão Voltar a seguir o estore de origem permite retoma imediata. Exceções vivem na sessão, valores manuais locais continuam no backup antigo sem mudar schema; recarregar/repor demonstração retoma seguimento. Destino com Shelly real nunca é seguido/comandado pela relação.

scopeIds inclui a origem associada quando o popup do estore/da divisão mostra um seguidor de demonstração (incluindo sótão), apenas para consultas na fila existente. Sem pedidos extra de atuação, grupos ou configuração automática. Testes blind-demo.test.cjs e fixture estritamente fictícia review/blind-demo-follow-fixture.html. Ver ESTORES-DEMONSTRACAO.md.

# Equipamentos do estúdio apenas no popup — 1.112

studioBindings opcional contém monitor441db8, apollo e43ad8, terramaster e9df12 e backup bb8ac4 (canal0 editável), por pedido explícito do utilizador. Só preencher quando o campo estiver ausente; preservar mapa vazio/parcial/remoções futuras. Validação de duplicados com todos os atuadores e backup partilhado; backups antigos da mesma conta preservam studioBindings atuais ausentes. Não mover estes IDs para a sala ou biblioteca.

Aparecem exclusivamente no popup studio/piso4, com W/kWh, alimentação confirmada, botão circular e roda dentada openDevice('studio',role). Sem novos ícones/hits/banners na planta. Reutilizar mediaSnapshot para medições e appliancePowerSnapshot/commandAppliance para relé, fila e confirmações; manter leitura/controlo separados da atividade operacional. Dados ausentes/offline/antigos bloqueiam controlo e conservam histórico identificado. Sem comandos em guardar/importar/consultar nem participação em grupos/cenários/reset. Encerrar servidor/disco pelo sistema antes de cortar alimentação; nota no popup.

scopeIds da sala usa apenas livingMediaBindings; estúdio apenas studioBindings, além dos restantes equipamentos/dependências já existentes da divisão. Os registos de medição podem ser partilhados internamente, sem cruzar associações. Testes studio-devices.test.cjs incluem isolamento sala/estúdio, duplicados, backup, medição e comandos individuais apenas fictícios. Fixture review/studio-devices-fixture.html e captura review/estudio-dispositivos-1.112.png.

# Shelly Bulb do Gui transferida para o estúdio — 1.113

Por pedido explícito, a luz associada a3:bedroom2 passa para4:studio. HomeCore.moveGuiBulbToStudio move a associação existente preservando ID/canal/tipo, elimina apenas a entrada de luz do quarto e conserva as outras luzes. Se não existir origem nem destino, usar a Bulb fornecida98cdac1f18fa/canal0/light; destino já existente sem origem mantém-se. Defaults SUPPLIED_BULBS usam agora4:studio. O quarto do Gui passa a iluminação em demonstração; estores/contactos/sensores permanecem independentes.

Migração única casa-leal-gui-bulb-moved-to-studio-v1, validada/persistida antes do marcador, incluída como studioBulbMoved booleana no backup. Não reescrever associações após a migração. Configurar/transferir só consulta: nunca enviar comandos, desligar ou ligar a lâmpada automaticamente. Mesma conta/fila/guardas/estado confirmado. Testes bulb-associations.test.cjs e studio-bulb.test.cjs verificam transferência/canal/tipo/backup, ausência de associação real no quarto e consulta só da lâmpada fictícia no estúdio.16 testes passaram incluindo controlo de luz e backups; nenhuma atuação real.

# Limpeza dos popups — 1.114

Por nova instrução explícita, retirar de todos os popups de divisão as legendas normais de alimentação ON/OFF e mensagens repetidas de estado confirmado, a frase Equipamentos sem associação: demonstração, o botão inferior Configurar equipamentos e a nota sobre encerrar servidor/discos. Esta regra substitui as notas anteriores que pediam esse aviso. Manter consumos/atividade e estados de demonstração individuais, estores, contactos, acesso por rodas dentadas e controlos reais. Preservar avisos de offline/erro/estado desconhecido, última leitura e confirmação pendente, além de aria-label/aria-pressed nos botões. Portáteis mostram consumo na linha da divisão sem duplicar estado normal de alimentação; popups individuais com botão ocultam o texto normal ON/OFF, conservando estados não confirmados. Não mudar transporte/guardas/associações.28 testes passaram; fixture fictícia review/clean-room-popup-fixture.html e captura review/popup-limpo-1.114.png.

# Feixe RGB do monitor Dell — 1.115

studio-monitor-core.js/js/css acrescentam apenas projeção SVG sobre o render existente do estúdio/piso4, alinhada com a largura do monitor em coordenadas da fotografia (x112..273/y610), orientada para cima e limitada ao interior. Três canais RGB animados suavemente, com gradiente que perde intensidade até alfa0 e desfocagem apenas da luz. Não alterar imagens, adicionar ícones/hits nem bloquear interações. Respeitar prefers-reduced-motion e pausa na MeteoNL.

Emitir apenas com appliancePowerSnapshot('monitor').on===true e mediaSnapshot('monitor') fresco com potência válida>0; OFF/zero/ausente/offline/erro/antigo não emitem. Aceitação de comando não altera emissão sem nova leitura. Utilizar leituras já existentes, sem pedidos adicionais ou atuações. app.js monta ao mudar piso; fora do piso4 não há camada. Testes studio-monitor.test.cjs e studio-devices.test.cjs com dados fictícios; fixture review/studio-monitor-fixture.html e captura review/monitor-rgb-1.115.png.10 testes passaram, verificados visualmente ON/OFF sem equipamentos reais.

# Intensidade do feixe do monitor — 1.116

Por pedido do utilizador, aumentar aproximadamente45% a opacidade do gradiente RGB do monitor: .46 na origem, .28 no primeiro declínio e .075 na cauda, terminando em0. Preservar movimento, geometria, desfocagem e guardas de estado/consumo existentes.

# Comprimento do feixe do monitor — 1.117

Encurtar o feixe do Dell cerca36%: origem y610 e término transparente y350 nas coordenadas da fotografia. Ajustar os limites laterais proporcionalmente, preservando a largura na origem, intensidade, animação e guardas existentes.

# Feixe RGB da TV da sala — 1.118

Substituir a projeção branca/azulada da TV por três canais RGB iguais aos do monitor Dell: cores #ff536f/#55f5b4/#569dff, gradiente .46/.28/.075/0, animação suave7s com fases desfasadas e desfocagem da luz7px. Origem conserva a largura real da TV x82/y888..990; termina transparente em x342, limitado à sala. Não usar largura do móvel nem alterar render, halo, hit/popup ou estado. Preservar emissão apenas em atividade TV on (>50W válido/fresco), regeneração/OFF/unknown sem feixe, sem inferência de novos comandos. Respeitar movimento reduzido e pausa MeteoNL.6 testes passaram; fixture fictícia review/tv-rgb-fixture.html e captura review/tv-rgb-1.118.png.

# Navegação por camadas — 1.119

Substituir os três pontos por SVGs de camadas/losangos em .floor-nav: ordem4/3/−1, largura50px alinhada com a barra do contador. O piso aria-current=page recebe preenchimento azul mais carregado; restantes camadas contorno claro e fundo discreto. Preservar os mesmos botões/data-floor, nomes acessíveis, foco, alvos50×44px e navegação por clique/scroll/swipe/Casa. Não alterar lógica Shelly. floor-layers.css reserva margem lateral em ecrãs estreitos e afasta as camadas do contador em alturas pequenas. Verificados visualmente pisos3/4 e clique na camada superior com fixture fictícia; captura review/pisos-camadas-1.119.png.

# Ícone dos cenários — 1.120

Substituir apenas o SVG de #open-scenarios por uma varinha mágica diagonal com três brilhos, em traço arredondado/currentColor coerente com os restantes botões do topo. Preservar botão, acessibilidade, abertura e comandos dos cenários. As camadas ficam reservadas à navegação de pisos. Verificado visualmente e abertura do popup com fixture fictícia, sem atuações; captura review/cenarios-varinha-1.120.png.

# Barra de comunicação Shelly — 1.121

cloud-activity.js/css adaptam o indicador original à CasaCloudRead.activitySnapshot, apenas leitura. Barra vertical acima do contador; camadas dos pisos abaixo de ambos. Progresso por equipamentos dos lotes terminados; verde apenas com ciclo completo e tom pronto, âmbar em consulta/pausa e vermelho em falha. Clicar só abre Estado dos pedidos, sem consulta adicional nem comandos. Métricas usam a fila existente, sem IDs/credenciais; percentagem não representa online nem estado de atuação. Atualizar por energychange e temporizador visível, incluindo durante o popup. Montar antes de meteo.js para partilhar inert e preservação de diálogos. Emitir progresso após contar cada lote, preservando regras de transporte/confirmacão. Testes cloud-activity/cloud-transport com dados fictícios e fixture review/cloud-activity-fixture.html; capturas shelly-barra-1.121.png e shelly-pedidos-1.121.png.

# Roda dentada da iluminação — 1.122

Todas as linhas Iluminação dos popups de divisão incluem botão room-round antes da alimentação, clonando o SVG de #open-settings. Abre diretamente CasaShellySetup.openDevice(light, floor:room) no ID correspondente, também em demonstração para permitir associar. Preservar controlo/estado/guardas da luz; abrir configurações nunca atua. Verificação visual e foco no ID fictício corretos, sem comandos. Captura review/iluminacao-roda-1.122.png.

# Camadas sobrepostas — 1.123

Por pedido do utilizador, compactar a navegação em três losangos sobrepostos com passo vertical16px, mantendo largura50px, botões independentes, nomes acessíveis e foco de teclado. Camada superior desenhada acima das seguintes; preenchimento opaco discreto evita mistura de contornos, ativo continua azul mais carregado. Substitui o espaçamento44px da1.119 apenas nesta navegação. Sem alterações de lógica dos pisos ou Shelly. Verificação visual e clique no piso4 com fixture fictícia; captura review/pisos-sobrepostos-1.123.png.

# Relógio do cabeçalho — 1.124

header-clock.js/css mostram HH:mm com dia da semana e data pequenos por baixo, junto da meteorologia. Intl pt-PT e fuso Europe/Lisbon, incluindo mudança automática de hora; atualizar apenas o DOM, sem rede/Cloud/persistência. Renovar ao regressar à página e enquanto visível. Em ecrãs estreitos o relógio fica por cima da meteorologia para preservar os botões. Script clássico e recursos relativos. Sintaxe e apresentação desktop verificadas em fixture fictícia; captura review/relogio-1.124.png.

# Prioridade do consumo após comando — 1.125

Preservar o seguimento de watts em consumptionTargets dentro do ticket de confirmação já existente do relé. Depois de confirmado o booleano, não bloquear o botão enquanto se aguardam watts: continuar apenas as leituras restantes do mesmo ID, até três totais/prazo30s. Terminar por mudança real de potência ou orçamento; zero/ausência nunca provam falha. Separar relayEntries de entries para não contar atualização de consumo como comando ainda por confirmar. Sem novas filas, comandos/retries ou IDs. Consultar FLUIDEZ-SHELLY.md e tests/consumption-priority.test.cjs para fronteiras e exemplos fictícios.

# Um quadrado por piso — 1.126

Eliminar floor-layer-edge dos três SVGs da navegação e respetivos estilos: cada piso é apenas um quadrado em perspetiva, sem linha inferior que sugira segunda camada. Manter sobreposição, cor azul do ativo, botões, foco e navegação existentes. Verificado com fixture fictícia; captura review/pisos-quadrado-unico-1.126.png.

# Ventoinha da garagem — 1.127

Implementar fan opcional com ID original8819dc/canal0 só quando ausente, preservando null/edições e credenciais desta app. Mesmo SVG de cima/animação do original, botão arrastável com layout/backup e slider comum; popup próprio, Cenários e linha na garagem. Usar appliancePowerSnapshot/commandAppliance(fan,on), fila/geração/guardas45s e confirmação3 comuns, sem seguimento de watts, inferência/otimismo/retry/grupos. Offline/desconhecido param pás. Consultas gerais e scopes fan/garagem incluem o ID. Só leituras ao carregar/guardar/abrir; testes fictícios e manutenção em VENTOINHA-GARAGEM.md.

# Símbolos maiores na garagem — 1.128

Aumentar só os addons da planta: fan-pin54→66px e alarm-pin56→68px (cerca22%). Preservar tamanhos de popup, associação, estados, posições guardadas, arrastamento/contenção e slider comum. Verificado visualmente sem atuações na fixture fictícia review/garage-addons-size-fixture.html; captura review/garagem-addons-maiores-1.128.png.

# Nomes das exportações — 1.129

Os backups JSON usam Condados-NL-AAAA-MM-DD_HH-mm-ss.json, com data/hora Europe/Lisbon a partir de exportedAt do próprio backup. Preservar conteúdo, validação, importação e proteção de credenciais existentes. Projeto transferido por instrução do utilizador para esta pasta Casa Condados; esta é agora a raiz exclusiva das alterações.

# Limpeza do menu Definições — 1.130

Retirar bloco Iluminação/demonstração (texto, Ligar todas, Apagar todas, Repor demonstração) e atalhos Contador geral/consumo e Shelly Cloud/equipamentos. Manter cenários, barra do contador, campos de conta/equipamentos e rodas dentadas. Remover listeners dos elementos retirados e usar CasaShellySetup.open no regresso das definições MeteoNL, sem depender do botão removido. Sem alteração de estados ou comandos.

# Intensidade das Shelly Bulb — 1.131

Sliders Intensidade nos popups de sala, suite e estúdio quando a iluminação é light (também em futuras saídas light). Estilo do slider dos estores,0–100%, envio único em change/soltar; input apenas pré-visualiza Destino. commandBrightness usa a mesma fila/geração/visibilidade/guardas de commandLight, set/light com brightness inteiro0..100 sem on, preservando a ação ligar/desligar separada. Nunca enviar brilho a switch ou tentar tipos/canais alternativos. Requer leitura recente/online com brightness válido; unknown/offline/ausente bloqueia o slider, mostra traço/Última leitura.

Normalizar brightness só da saída light exata (Gen1 lights/Gen2 light:n), preservando zero. Estado e valor confirmados só após leitura, não HTTP aceite. Ticket de intensidade distingue-se de ON/OFF e só confirma ao reportar brightness correspondente (tolerância1), até3 verificações/prazo30s existentes; estado ON inalterado nunca confirma sozinho. Conservar última intensidade válida e não guardar valores inventados/config novos. Sliders não alteram renders nem brilho de outras divisões por simulação. Testes fictícios tests/light-brightness.test.cjs;30 testes relevantes passaram, UI das três divisões e comando65→40% verificados em fixture isolada; captura review/intensidade-bulb-1.131.png.

# Limpeza — 1.132

Retiradas páginas/capturas históricas de review e wall-relief.js já desativado. Não voltar a gerar dezenas de cópias completas antigas: manter a fixture fictícia atual e fontes pequenas. Referências antigas a provas review em notas históricas não representam dependências da aplicação; recuperar no Git quando necessário. Manter testes/fontes MeteoNL/geradores/recursos dinâmicos e compatibilidade de backups. Ver LIMPEZA.md.

# Resumo da casa — 1.133

Indicadores no cabeçalho e popup em house-summary.js/css/core. Só estados confirmados de janelas e luzes associadas, demonstrações excluídas; unknown/histórico nunca contam como fechado/desligado. Saúde deduplicada por ID via healthSnapshot da fila, distingue offline/erro/indisponível de stale/pending, sem pedidos adicionais. Clique só navega; comandos sempre nos controlos individuais existentes. Resumo ocupa o lugar do aviso geral isolado de offline, preservando marcadores individuais. Montar antes de MeteoNL, adaptar cabeçalho móvel e manter nomes personalizados. Ver RESUMO-CASA.md e testes fictícios house-summary.test.cjs.

# Resumo lateral e progresso circular — 1.134

Por pedido do utilizador, mover #open-house-summary para a lateral esquerda, por baixo de #shelly-activity agora circular e acima da barra de energia/pisos. Novo ícone SVG de janela com duas folhas abertas. A esfera enche verticalmente com --cloud-progress e conserva data-state, cores e popup. Remover adaptações do cabeçalho criadas apenas para o resumo. Não alterar cálculos, fila, contagens, estados ou comandos. Dimensões/posições por variáveis em cloud-activity.css e house-summary.css; ver RESUMO-CASA.md e captura review/resumo-lateral-1.134.png.

# Botões de fechar alinhados — 1.135

popup-compact.css define o botão .close comum aos popups:44×44px, sem padding/margem, right igual ao padding lateral do conteúdo17px (12px em ecrãs≤360px), top12px. X desenhado por dois traços CSS centrados em50%/50%, evitando desvio de baseline do glifo ×. Preservar texto/aria-label/listeners existentes, foco e Escape. Mesmo aro2px/inset3px em todos. Verificação visual no popup de divisão e resumo, fecho normal confirmado com fixture fictícia; captura review/fechar-alinhado-1.135.png.

# Coluna lateral no telefone — 1.136

Os indicadores Shelly, resumo da casa, contador e pisos partilham --side-rail-left: 6 px no desktop e 1 px até 550 px, respeitando safe-area-inset-left. As camadas dos pisos seguem --cloud-rail-width (50 px no desktop e 36 px no telefone), centradas no mesmo eixo dos banners. Preservar navegação, estados, popups e fila Shelly. Verificação visual com fixture fictícia de 375 px, sem comandos reais.

# Planta ampliada — 1.137

O contentor da planta reserva a largura da coluna lateral mais 10 px à esquerda e 10 px à direita, respeitando as áreas seguras. Remover o antigo recuo móvel de 62 px. Os renders dos pisos 3 e 4 definem data-fit-view-box pelos limites do seu contorno fotográfico para não reservar margens vazias internas. Manter o ajuste proporcional completo com CasaPlanViewCore.fit: em ecrãs baixos, a altura disponível continua a limitar a escala, sem cortar a planta. Preservar zoom, arrastamento, paredes, sobreposições e comandos.

# Roda dentada nos detalhes — 1.138

Os botões antes identificados como Detalhes nos popups das divisões usam agora room-round e uma cópia do SVG de #open-settings, igual à iluminação. Preservar ações, nomes acessíveis e controlos de alimentação. Não voltar a substituir o ícone por texto em CasaRoomPopup.decorate.

# Sobreposição dos pisos — 1.139

Passo vertical das três camadas reduzido de 16 para 12 px em floor-layers.css. Preservar largura partilhada com os banners, eixo lateral, ícones, cores, ordem, foco e ações de navegação.

# Regeneração da TV — 1.140

TV da sala: menos de 5 W desligada, 5 a 40 W inclusive em regeneração, mais de 40 W ligada. Apenas interpretação de consumo válido e recente; preservar guardas offline/erro e não atuar automaticamente sobre o relé.

# Regeneração da TV — 1.141

Correção do utilizador: regeneração entre 5 e 35 W inclusive; ligada acima de 35 W; desligada abaixo de 5 W. Substitui o limiar de 40 W da versão anterior, mantendo as guardas e comandos existentes.
