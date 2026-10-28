# Contador geral · 1.029

Adaptado da app original (energy-core.js, energy.js, energy.css, consumption.js e transporte Cloud). Mantém potência ativa, aparente, margem e energia acumulada separadas. Barra vertical fixa à esquerda, popup azul/claro e check Mostrar barra do contador geral. O contador também abre pelas definições quando a barra está oculta.

## Associação pedida

ID 48e72967aadc, canal 0. Associação inicial única em shelly-setup.js, apenas quando homeEnergy está ausente e o marcador casa-leal-em-associated-v1 ainda não foi concluído. Preserva configurações existentes, guarda o marcador só após persistência e permite remover o ID sem voltar a acrescentar. Não herda a conta nem equipamentos da outra casa.

Potência contratada inicial 6,9 kVA, baseada na app original/referência; o utilizador ainda não confirmou este valor para a nova casa. Está identificada como inicial e é editável em Shelly Cloud → Contador geral. A leitura kW/kWh não depende deste parâmetro; percentagem e margem dependem do contrato correto.

homeEnergy opcional em casa-leal-shelly-setup-v1: {source:'custom',deviceId,channel:0|1,contractKVA}. null permite remoção explícita. Conta e chave usam o editor já existente; a chave não é exportada nem devolvida nos snapshots. Nesta implementação, a conta do navegador 127.0.0.1 ainda estava sem servidor e chave, pelo que não foi possível obter uma leitura real. A UI mostra dados indisponíveis até a conta estar guardada.

## Leitura e segurança de estados

cloud-read-core.js é a primeira fila Cloud da nova casa, estritamente de leitura. Apenas POST /v2/devices/api/get, com ids e select:['status']; não há endpoints de relé, comandos de configuração ou alteração de totais. Reutiliza a conta do editor, mantém uma única fila serial, agrupa pedidos simultâneos e descarta respostas quando conta/associação/formulário mudam. Não expõe segredos nos snapshots ou mensagens. Credenciais omitidas nos cookies, referrer omitido, redirects recusados, sem cache de pedidos. Não regista payloads de erro ou URLs com a chave.

Uma consulta inicial após carregar/guardar quando a conta e o EM estão configurados; atualização a cada 15s enquanto a casa está visível, botão de consulta manual e renovação ao abrir o popup se antigo. Formulário sujo/conflito com outra janela impede consultas. A janela do protetor MeteoNL é adiada durante pedidos em curso; a MeteoNL não recebe chave nem ID. 401/403 suspende consulta automática até nova configuração ou pedido manual. 429 respeita Retry-After (segundos ou data) e não repete imediatamente. A fila não pode ser usada por demonstrações de luzes/estores.

Gen1 EM: emeters[channel].power W → kW; reactive VAR → kvar; potência aparente hypot(P,Q)/1000 kVA; total Wh → kWh. Não equiparar kW/kVA, assumir reativa zero, inventar zeros, converter negativos para positivos ou somar canais. Sem canal, erro/is_valid false, offline ou consulta com mais de 45s: escala e percentagem neutras; valores antigos explicitamente Última leitura. Hora exibida é a consulta, nunca hora da medição. Os valores não são persistidos no backup.

Cores iguais à original: verde abaixo de 60%, amarelo 60..80%, laranja 80..95%, vermelho 95..100% e limite acima de 100%. O marcador fica dentro da escala, preservando a percentagem real quando ultrapassa 100%.

## Configuração e backups

Exportação inclui associação, contrato, check da barra e marcador inicial, sem chave. Backups antigos com a categoria de configuração da mesma conta, mas sem homeEnergy, mantêm o contador atual. Entre servidores diferentes não mistura associações. Remoção explícita null é respeitada. A configuração usa a proteção de concorrência do editor e não escreve no projeto original.

## Verificação

32 testes passaram, apenas com mocks/IDs/chave fictícios: unidades, reativa ausente, zeros e negativos, offline, erro, staleness, geração, coalescência, bloqueio de formulário/credenciais em falta, 401, 429, contratos, backups e regressões anteriores. UI em iPad768×1024: barra abre popup, estado real sem conta mostra traços e configuração apresenta o ID/canal pedidos. Pré-visualização de valores com review/em-fixture.html, limitada a localhost e com todos os pedidos intercetados, sem equipamentos reais. A fixture repõe o armazenamento anterior ao fechar. Imagem review/contador-em-1.029.png assinalada como dados fictícios.

Fontes primárias: [Cloud Control API v2](https://shelly-api-docs.shelly.cloud/cloud-control-api/communication-v2/), [Shelly EM Gen1](https://shelly-api-docs.shelly.cloud/gen1/#shelly-em-emeter-index).


# Carregador EM no canal 1 — 1.036

Por associação explícita do utilizador, evMeter opcional {deviceId,channel} guarda o carregador48e72967aadc/canal1, separado de homeEnergy canal0. Migração única casa-leal-ev-associated-v1 completa só campo ausente; preserva edição e null para remoção. Campos nas definições, validação Home.setup e backup incluídos. Backups antigos preservam as duas associações ausentes apenas na mesma conta. Leitura pode partilhar ID/canal; não criar relé de atuação a partir do canal de medição.

cloud-read-core mantém uma fila e conta comuns, deduplica IDs e normaliza cada canal exato de emeters separadamente. Nunca usar canal0 como fallback para o carro. evSnapshot não expõe ID nem segredo, retorna W/1000 em kW e totalWh/1000 em kWh. Sem zeros inventados ou valores absolutos; fresco45s online válido, erros/offline/antigo ficam por confirmar com último total identificado. Mantém geração, bloqueio de formulário sujo, timeout e limites/401 existentes. Só endpoint get; guardar/abrir/consultar não atua no carregador.

addons.js afasta ligeiramente o ID.4 (imagem x300, centro503.5) e põe carregador na parede esquerda, junto ao canto superior esquerdo do carro. ev-read.js/css monta banner clicável e popup só de leitura; cabo até ao carro apenas com potência válida fresca superior a50W, recolhido nos outros casos. Não inferir ficha física/bateria/carga completa nem estado do relé. Controlos do carregador preservam zoom com dois dedos e não abrem simultaneamente popup da garagem. Todos os scripts/recursos relativos dentro de dist/.

42 testes passam: novos casos em tests/ev-read.test.cjs cobrem canais independentes numa consulta, canal ausente, zero/limiar/negativos, offline/stale/inválido/erro, consulta sem contador geral, guardas e backup. Fixture review/charger-fixture.html e em-fixture.html usam exclusivamente ID/chave fictícios e intercetam toda a rede; restauram preferências no pagehide. Revisão iPad768×1024 com banner/popup; imagens review/carregador-em-1.036.png e carregador-popup-1.036.png mostram dados simulados. Não foi realizado teste de equipamentos reais.


# Cor pelo relé do EM — 1.038

Utilizador confirmou que desligado significa relé de alimentação OFF, não offline. energy-core.relayStatus lê exclusivamente relays[0].ison ou switch:0.output do mesmo EM associado ao carro (relé único0, independente da pinça1). Booleanos exatos, conflitos/erros/ausência/offline/stale mantêm feed null. cloud-read-core.evSnapshot.feed não depende dos watts nem inventa OFF a0W; mesma consulta get/fila/geração, sem novos comandos. Desenho usa símbolo/LED vermelho com false, verde com true, neutro unknown. Animação do cabo continua por potência; pulsação do LED só com alimentação ON. Popup informa alimentação lida, sem botão de atuação. Testes44, incluindo independência potência/relé e canal/erros/frescura. UI validada com relé OFF fictício; prova review/carregador-off-1.038.png.


# Atualização automática — 1.039

cloud-read.js acompanha o ritmo da app original: consulta geral30s e15s com popup energy/ev aberto, verificação do agendamento a cada1s, relógio reiniciado ao concluir a consulta. Abrir/fechar popup e regressar à app/foco/pageshow/rede/visibilidade/MeteoNL renova por leitura. MeteoNL visível já não suspende consultas da Casa (a exclusão anterior deixava os estados sem atualização após o protetor); app realmente oculta continua suspensa. meteo.js emite casahomevisible no regresso, preservando popups e campos.

Preservar fila partilhada, coalescência, geração, formulário sujo/conflito, backoff429 e bloqueio automático401. Eventos automáticos nunca usam manual=true nem enviam comandos. Testes tests/cloud-auto.test.cjs usam relógio e cliente fictícios para tempos/retoma/guardas; suite48 passa. Fixture autopoll=1 muda estado nas respostas e conta consultas visíveis. UI comprovou passagem de4 a6 consultas no popup sem clicar Atualizar, com hora renovada; prova review/atualizacao-automatica-1.039.png. Sem equipamentos reais.


# Visibilidade do consumo do carro — 1.044

Check Mostrar consumo do carro nas definições, alinhado com os outros. ev-read.js persiste booleano casa-leal-show-ev-banner-v1, omissão true e validação de tipo ao carregar. position oculta apenas .ev-badge; carro, carregador clicável, cabo/animação e consultas automáticas continuam. Preferência showEVBanner validada/exportada/restaurada no backup; ficheiros antigos sem campo preservam valor atual. UI iPad: desmarcar remove banner, mantém carregador e contador de consultas a avançar. Prova review/consumo-carro-oculto-1.044.png. Regressões de backup passam.


# Porta principal BLU funcional — 1.046

Associação explícita XB66172384118439, sourceblu, componente/channel0 em entranceContact da mesma configuração/conta. Migração única casa-leal-entrance-associated-v1 aplica o ID pedido, preserva canal de associação BLU igual e demais equipamentos; marcador no backup, remoção posterior permitida. IDs XB completos até48bits decimais preservados na configuração, backup e transporteget; nunca substituir pelo MAC/gateway. Não ativar janelas sem IDs pedidos.

contact-core normaliza window:N.open e value legado com false explícito, conflitos inválidos unknown, janela legada só componente0. BTHome opcional exige componenteobj_id45; nunca deduzir abertura por lux/ângulo/bateria/relé. Erros/ausência/offline/stale45s = null, desenho fechado por omissão com legenda por confirmar. cloud-read-core inclui contacto na mesma consulta/fila/geração dos dois canaisEM (IDsdeduplicados), apenas get. doorSnapshot expõe estado e mensagens seguros, não ID/chave.

entrance-read cria zona clicável no vão real da porta, popupAberta/Fechada/Por confirmar, hora explicitamente de consulta, refresh e atalho da associação. Desenho usa CasaAddons.setEntranceDoorState; não alterar geometria/batentes/sentido ou paredes. Hall também apresenta leitura. Atualização30s geral/15s popupporta ouhall, renovação ao abrir; nunca comandos de abertura/desbloqueio nem mistura com grupos de luzes/estores. Backups antigos sem campo opcional preservam contacto atual apenas na mesma conta; null remove.

57 testes passam, incluindo normalização,canal,conflitos,offline/stale/erro, porta semEM, transporteXB,backup e desenho. review/entrance-fixture.html usa apenas ID/chave fictícios, todas as chamadasCloud intercetadas. UIiPad768×1024 verificou contacto true→Aberta efalse→Fechada e clique no vão; screenshot review/porta-principal-1.046.png. Nenhum equipamento real foi usado nos testes.
