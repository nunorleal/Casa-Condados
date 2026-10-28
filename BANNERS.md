# Banners — 1.085

Definições: um único slider «Tamanho de todos os banners», 60–160%, passo5%. Ajusta legendas das divisões, temperatura/humidade, estores, carregador e símbolo do alarme. Os tamanhos relativos de cada tipo são preservados. A barra fixa do contador geral mantém a dimensão de controlo de interface.

Preferência: casa-leal-banner-scale-v1, exposta por CasaBannerSize.value(). Sem chave nova, lê primeiro a preferência antiga de sensores e depois de estores. Ambos os antigos campos continuam aceites em backups; importação sem bannerScale deriva um único tamanho dessa mesma ordem. Exportação nova contém bannerScale.

O check «Mostrar banner do carregador do carro» reutiliza a preferência existente casa-leal-show-ev-banner-v1. Ocultar não altera o carregador, o cabo ou a leitura Shelly. Arrastar por rato/toque ou Alt+setas move apenas o banner, conservando o clique para abrir o popup. Escape/cancelamento repõe posição inicial do arrastamento. Posição em coordenadas da planta, limitada ao retângulo completo dentro da garagem; adapta após redimensionamento, novo texto e mudança de tamanho. Persiste em casa-leal-ev-layout-v1, backup evLayout.

A geometria partilhada usa dimensões visuais (incluindo escala), encolhendo localmente quando uma divisão pequena não comporta o tamanho escolhido. Alterar apresentação ou posição não envia comandos nem consultas Cloud.

Verificação: node --test dist/tests/*.test.cjs (141 testes). UI em review/banners-fixture.html: dados e chave fictícios, toda a rede intercetada; verifica arrastamento sem popup, retenção ao trocar de piso, slider130% e check ocultar/mostrar. Prova review/banner-settings-1.085.png. Não usar fixture na mesma origem da produção; o armazenamento é restaurado ao fechar.

# Leitura discreta dos estores — 1.086

Novo check independente «Mostrar barras discretas dos estores», ativo por omissão, chave casa-leal-show-blind-bars-v1; backup booleano showBlindBars. Não modifica a preferência dos banners existentes.

home.js coloca no centro do vidro uma faixa fina azul acinzentada, sobre os mesmos HOTSPOTS calibrados usados pelo hover nos pisos3/4. Largura/comprimento seguem a janela; espessura6 unidades da planta, sem crescer com o slider dos banners. Barra cheia significa0% aberto, meia50%, vazia100%; atualização pelo snapshot existente, sem pedidos extra nem comandos. Velux não têm estore e não recebem barra. O alvo de clique e o destaque azul de hover mantêm-se.

blind-bar-core.js separa geometria e cálculo da leitura: valor atual válido, último valor disponível com âmbar/tracejado, ou apenas contorno âmbar tracejado quando desconhecido. Nunca representa ausência de leitura como fechado. Sem associação usa a percentagem simulada já existente. A informação acessível permanece no botão da janela, que já distingue Última leitura e estado desconhecido.

145 testes passam, incluindo tests/blind-bars.test.cjs: inversão0/50/100%, ausentes/antigos, orientação e backup. review/blind-bars-fixture.html usa apenas IDs fictícios, interceta toda a rede e mostra três estores0/50/100; zero comandos. Prova visual review/blind-bars-1.086.png.

# Nomes de divisões — 1.088

Duplo clique em banners normais ou de temperatura abre o editor do nome da divisão. F2 no banner também abre; Enter/Espaço mantém acesso à divisão. Clique simples do rato é diferido500ms para distinguir o duplo clique. O arrastamento existente conserva captura de ponteiro e supressão de clique; a edição não muda posições.

room-names-core.js valida um mapa de ID estável piso:divisão para nome,1..60 caracteres Unicode, sem controlos, normalizando espaços. room-names.js guarda em casa-leal-room-names-v1 e usa sempre textContent/value, sem HTML dinâmico. Cancelar/Escape não guarda; Repor nome original remove apenas a substituição dessa divisão. Falha de armazenamento conserva nomes anteriores e mostra erro. ID da divisão, plantas originais e associações dos equipamentos permanecem intactos.

Nome atualizado em legenda, banner de temperatura, nome do banner do estore, título do popup e resumo da divisão nas definições. Contenção do retângulo é recalculada após alterações. Backup roomNames opcional e validado; cópias antigas preservam nomes quando o campo está ausente. A Meteo adia o protetor durante edição e preserva o editor numa abertura manual.

152 testes passam, incluindo room-names.test.cjs (normalização, limites Unicode, IDs permitidos e backup). Verificação UI apenas fictícia em review/room-names-fixture.html: duplo clique em legenda e sensor, gravação, clique simples e título atualizado, zero comandos. Prova review/room-name-editor-1.088.png.


# Espessura das barras — 1.093

Aumentada de6 para12 unidades da planta, mantendo o centro do vidro nas janelas horizontais e verticais. Comprimento, preenchimento, cores, check e estados mantidos.
