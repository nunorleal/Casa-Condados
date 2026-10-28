# Casa Leal · 1.001

Base independente, dentro de dist/, para publicar diretamente numa raiz GitHub Pages ou abrir index.html localmente. Ficheiros da casa anterior preservados. Sem associações ou transporte Shelly nesta primeira fase. Não carregar os módulos antigos de migração de IDs.

## Plantas

Geometria SVG nativa editável em generate-plans.py; executar `python3 generate-plans.py` nesta pasta para regenerar assets/piso-*.svg e plans.js. Todas as vistas são rigorosamente de cima, sem mobiliário, sanitários, candeeiros ou automóveis. Paredes brancas, madeira clara em espinha, duas casas de banho com pedra bege; WC da entrada com madeira. As texturas são interpretações vetoriais das referências, não fotografias do material. As medidas/geometrias foram transcritas visualmente das capturas e devem ser revistas pelo utilizador antes de uso como desenho definitivo.

- Piso −1: garagem de 25,70 m²; portão inferior; exclui escadas, patamar e porta comuns à esquerda. Cimento provisório (material não fornecido).
- Piso 3: apenas a fração delimitada a rosa. Três quartos, closet, três WC, halls, cozinha/sala abertas, duas varandas e escadas interiores para piso 4. Nomes dos quartos provisórios. Varandas com pavimento neutro provisório.
- Piso 4: apenas a área delimitada a castanho. Estúdio em cima, incorporando a antiga casa de banho; Sala 2 em baixo. A passagem entre as duas divisões é provisória, pois a remoção da casa de banho não define a posição final da porta. Escadas conservadas à direita. Claraboias representadas como na planta.

## Navegação e MeteoNL

Bolinhas à esquerda: cima piso 4, meio piso 3, baixo garagem. Clique, swipe vertical, roda e PageUp/PageDown. Casa regressa ao piso 3. Movimento reduzido respeitado; popups/MeteoNL bloqueiam navegação. Ambiente automático via cidade ou pré-visualização diurna/noturna. Nenhum controlo de equipamentos inventado.

MeteoNL original preservada em meteo/assets/app-2.40.*, com fontes em meteo-src/. Reutiliza meteo.js/meteo-core.js e o fallback srcdoc para file:// no Safari; não regista service worker. Nenhuma alteração ao bundle. Preferências da nova casa usam chaves casa-nova para cidade, ambiente, nomes e protetor; MeteoNL mantém as preferências visuais originais. Temporizador por omissão 30s, configurável nas definições; abertura e regresso preservam piso e popup.

REGRAS-BASE.md preserva as regras da origem como referência para etapas de associação/controlo futuras. As migrações e IDs da casa anterior não são executados nesta base. Os padrões/plantas fornecidos orientam a arquitetura; não autorizam qualquer atuação real.

## Verificação desta entrega

Sintaxe JS e XML dos três SVG válidas; referências locais do HTML verificadas e bundle MeteoNL idêntico ao original. Pré-visualização vertical no navegador a 735 × 988 sem overflow (scrollWidth/Height iguais à viewport); navegação dos três pisos, popup e MeteoNL com regresso ao piso selecionado verificados. Safari com abertura file:// carregou a MeteoNL em about:srcdoc e regressou à casa. Não foi usado um iPad físico nem simuladas dimensões exatas de iPad nesta verificação. Nenhuma chamada Shelly é possível nesta base, pois não existe transporte de equipamentos carregado. Prova em review/piso-3-2.41.png.

## 2.42 · Escala do pavimento

Padrão da madeira em espinha reduzido para metade em ambas as direções (scale .7 → .35), em todos os pisos onde existe madeira. Geometria e restantes materiais preservados. SVG e plans.js regenerados a partir da fonte.

## 2.43 · Limites da garagem

Retirados da representação o patamar, as escadas e a porta do prédio à esquerda. Conservados o contorno privativo com o recanto superior, as paredes brancas e o portão inferior como entrada da garagem. Pisos 3 e 4 inalterados (comparação integral dos SVG).

## 2.44 · Garagem ampliada

ViewBox próprio da garagem (45 430 910 830) elimina o espaço vazio da prancha vertical. Escala responsiva uniforme para caber na área útil sem deformar a garagem nem sobrepor menus. Banners usam o viewBox do SVG ativo para manter o alinhamento ao redimensionar. Geometria e pisos superiores preservados.

## 2.45 · Addons e chão da garagem

Por instrução do utilizador, todos os próximos elementos são camadas independentes por cima das plantas. addons.js monta as camadas após inserir o SVG, sem editar a geometria base. O addon garage-floor usa a cópia integral de assets/cimento-cave.svg da cave do projeto inicial, recortada pela superfície existente e colocada antes das paredes/portão; sem interação nem alterações aos pisos 3/4. O recurso original é mantido localmente para abertura direta e GitHub Pages. O chão provisório da planta base fica coberto pelo addon.

## 2.46 · União do canto da garagem

Contorno da parede desenhado como um único percurso contínuo entre as extremidades do portão. Elimina a emenda de dois segmentos no canto superior esquerdo, permitindo a junção miter completa, sem alterar coordenadas, espessuras ou addon de cimento. Pisos superiores inalterados.

## 2.47 · Visibilidade das Velux

As duas Velux do piso 4 passam para uma camada independente em addons.js, nas mesmas posições e com o mesmo desenho. Check nativo Mostrar janelas Velux nas definições, ativo por omissão; preferência booleana casa-nova-show-velux-v1, validada ao carregar. Atualização imediata; preservada ao mudar de piso e recarregar. Ocultar revela o pavimento original contínuo e não modifica paredes, luz, MeteoNL ou equipamentos.

## 2.48 · Área útil do piso 4 e janelas laterais

Corrigida a transcrição proporcional da captura: a área útil termina na linha y1118 da referência, antes da faixa inferior às riscas. Escala uniforme baseada em x297..920 (fachada esquerda interior até limite direito da Sala 2). Mantém duas divisões; Estúdio inclui o WC removido. Escadas, banners e Velux acompanham as coordenadas corrigidas. Não contabilizar as faixas de cobertura como área interior.

Acrescentada uma janela por divisão na parede esquerda, em addons.js, com vãos correspondentes na parede base: Estúdio y555..666 e Sala 2 y845..959. O check Mostrar janelas Velux continua a afetar apenas as claraboias, não as janelas laterais. Garagem e piso 3 preservados integralmente.

Verificação Safari file://: piso 4 apresentado com as duas janelas de fachada e proporções corrigidas; prova review/piso-4-2.48.png. Sintaxe de addons.js e XML do SVG válidos.

## 2.49 · Nova referência de paredes do piso 3

Paredes e proporções transcritas da captura de 26 de outubro: transformação uniforme x46..1000 → x65..935 e y125..1434 → y225..1419. Corrigidos os limites dos três quartos, recanto do closet, dois WC com pedra, WC de entrada com madeira, hall aberto e recuo exterior junto às escadas. Conservadas as varandas e os vãos exteriores da planta arquitetónica inicial, ausentes do novo modelo de paredes.

Portas, vidros, escadas e guardas são architectureAddon em plans.js, montado por addons.js sob as paredes; não incorporados no desenho base. Sem mobília ou novos equipamentos. Os nomes e áreas de etiqueta acompanham a geometria. Garagem e piso 4 mantêm SVG integralmente idêntico.

Verificação visual em iframe com viewport 768 × 1024: planta, portas, escadas e etiquetas apresentadas sem sobreposição entre nomes; WC de entrada com etiqueta adaptada à largura da divisão. Sem erros JavaScript na consulta do navegador. Prova review/piso-3-2.49-vertical.png; página de revisão em review/vertical-preview.html.

## 2.50 · Toggle das legendas nas definições

Toggle nativo acessível Mostrar nomes das divisões nas definições, sincronizado com Nomes no menu. Ambos usam setLabelsVisible e a mesma preferência booleana casa-nova-labels-v1. Mostrar/ocultar afeta as legendas de todos os pisos, preserva a escolha ao recarregar e não altera a geometria, addons, MeteoNL ou equipamentos.

## 2.51 · Menus e legendas azuis

Nova camada visual blue-glass.css, carregada após os estilos base. Usa os tokens exatos de gradiente azul translúcido, bordas, texto e controlos de blue-glass.css do projeto original. Aplicada às legendas de todos os pisos, menu inferior, superfícies claras dos popups, formulários, checks, toggle e identificação da Casa. Sem alterações às plantas, materiais, addons, MeteoNL ou comportamentos.

## 2.52 · Checkboxes uniformes

Mostrar nomes das divisões usa o mesmo checkbox nativo azul de Mostrar janelas Velux. Removida a apresentação de interruptor; preferências e sincronização com Nomes preservadas.

## 2.53 · Legendas arrastáveis dentro das divisões

Camada label-layout.js com rato/toque/caneta, limiar de arrasto 7 px, pointer capture e supressão do clique após arrastar. Clique normal e Enter/Espaço mantêm o popup ou acesso às escadas. Alt + setas permite mover pelo teclado. Apenas a camada das legendas é movida, sem alterar plantas/addons.

Cada divisão tem polígono invisível area em coordenadas SVG (generate-plans.py). BannerGeometry verifica o retângulo completo, incluindo divisões em L, e trava o trajeto na parede. Recalcula contenção e quebra de linha ao redimensionar. Posições por piso/divisão em casa-nova-room-label-layout-v1, validadas ao carregar, sem comandos nem associações. Cancelar um arrasto restaura a posição inicial; a navegação/protetor ficam bloqueados enquanto o ponteiro está capturado.

Verificação: quatro testes passam (pontos iniciais, retângulo no recanto em L, movimentos extremos e validação/persistência por piso). No navegador a 768×1024, arrasto da Sala em direção a outra divisão ficou contido na Sala e não abriu popup; posição mantida após recarregar; clique normal abriu a Sala. Todas as legendas do piso 4 presentes. Sem erros JS observados. Prova review/legendas-arrasto-2.53.png.

## 2.54 · Vista ajustada e zoom da planta

Nome do piso único, pequeno, imediatamente acima do menu inferior. Removido o subtítulo superior; versão disponível nas definições. Área da planta usa o espaço livre entre cabeçalho e menu; viewBoxes de enquadramento mais próximos do desenho, sem alterar geometria, pavimentos ou addons.

plan-view.js/plan-view-core.js permitem pinch de dois dedos até 4×, deslocação com um dedo apenas quando ampliado, Ctrl/Command + roda para ampliar e teclas +/−/0 com foco na planta. Menu e cabeçalho fixos. Ao mudar de piso, clicar Casa ou redimensionar, a vista regressa ao enquadramento inicial. Sem zoom, mantêm-se swipes entre pisos; em zoom, o mesmo gesto desloca a planta.

Dois dedos cancelam um eventual arrasto de legenda e não abrem popups. Um dedo nas legendas mantém o seu arrasto independente e a contenção completa no SVG. Bloquear protetor durante gestos; MeteoNL preserva a vista ao regressar. Zoom não é guardado nem envia pedidos/comandos.

Verificação: nove testes passaram, incluindo pinch de dois dedos simulado no controlador, cancelamento do arrasto de legenda, consumo do dedo restante, reposição por novo piso, limites do pan e contenção das legendas. Navegador em viewport 768×1024: zoom por teclado ampliou apenas a planta; mudar para piso 4 repôs o enquadramento; título inferior e menu mantiveram-se fixos. Gestos não verificados num iPad físico. Prova review/piso-ajustado-2.54-vertical.png.

## 1.001 · Casa Leal e nova numeração

Numeração da nova casa reiniciada por pedido em 1.001 (próximas 1.002, 1.003…). Cabeçalho Casa Leal com v1.001 imediatamente abaixo, na linha anteriormente ocupada pelo lema. Sem versão em linha separada no rodapé nem nas definições. Versão, metadados e caches atualizados; MeteoNL mantém a sua versão própria. Histórico 2.xx acima preserva as entregas anteriores.

## 1.002 · Exportar e importar dados

Secção Cópia de segurança nas definições: exportação JSON e importação com validação, pré-visualização por categoria, confirmação e cancelamento. Formato casa-leal-backup-v1. Inclui cidade/ambiente, checks de legendas e Velux, tempo do protetor, posições das legendas e preferências visuais MeteoNL. Caches meteorológicas regeneráveis e zoom transitório não são exportados.

Importações parciais preservam categorias ausentes. Rejeitar formatos da outra casa, campos desconhecidos, booleanos/tempos/cidades/coordenadas inválidos. Limite de 1 MB. Escrita apenas nas seis chaves autorizadas; rollback em falha de persistência e atualização da página após sucesso. Sem credenciais/IDs/equipamentos ou comandos neste projeto.

Verificação: 13 testes passaram (backup e regressões de legendas/zoom). Interface identificou três categorias num ficheiro fictício e só apresentou a confirmação; cancelar manteve os dados atuais. Prova review/backup-1.002.png. A exportação/importação completa e rollback foram verificados no core com armazenamento em memória, sem equipamentos reais.

## 1.003 · Menu superior e mais área para a planta

Retirado o menu inferior Casa/Nomes/Definições. Nome do piso mantém-se discreto no rodapé. Cabeçalho em três colunas: Casa Leal/versão à esquerda, meteorologia ao centro, definições à direita. Ícone SVG Settings (Lucide) extraído do bundle MeteoNL existente, com o mesmo desenho e botão circular de 44 px para toque.

Clicar Casa Leal preserva acesso ao piso 3; check Mostrar nomes das divisões permanece nas definições. Área útil da planta ampliada para o espaço libertado, com ajuste/zoom/arrasto/navegação existentes. Backup e restantes preferências preservados.

Verificação: 13 testes de regressão aprovados. Em viewport 768×1024, temperatura centrada, definições do topo abriram corretamente, menu inferior ausente e 14 legendas presentes na área ampliada. Ajustado arredondamento das medidas de contenção para evitar ocultar a legenda estreita das escadas em escalas fracionárias. Prova review/menu-superior-1.003-vertical.png.

## 1.004 · Armários e abertura das portas

Addon cabinets independente: armário em L no closet, armários horizontais nos quartos 2/3 e no hall, conforme marcações vermelhas. Desenho nativo rigorosamente de cima, acabamento claro neutro, módulos e puxadores discretos. Sem outros móveis. Inserido abaixo de portas e paredes brancas.

Corrigida dobradiça do quarto 2 para o lado esquerdo do vão, mantida abertura do quarto 3 para dentro, acrescentada porta do closet, corrigida abertura do WC da suite para dentro com dobradiça esquerda e WC de entrada para dentro. WC comum passa a ter abertura na parede direita, como na referência, com folha recolhida para o interior; fechada a abertura superior anterior. Pequeno afastamento do início da parede do armário do hall para não cruzar o vão. Porta da entrada preservada a abrir para o hall. As folhas/arcos são addons, sem estados ou comandos.

Verificação: 13 testes de regressão passaram; addons SVG válidos, quatro conjuntos de armários e sete portas interiores/entrada identificadas. Revisão em viewport 768×1024 com legendas temporariamente ocultas (depois repostas). Prova review/armarios-portas-1.004-detalhe.png.

## 1.005 · Estilo dos armários da referência

Armários reinterpretados em SVG visto de cima: aro branco, interior de carvalho claro com veios, sombra interior e folha clara em diagonal, conforme referência fornecida. Mesmas quatro zonas e mesmas dimensões; o L usa dois segmentos contíguos. Sem alteração das portas da casa ou plantas base (SVG comparados integralmente). O acabamento permanece numa camada cabinetAddon independente.

Verificação visual ampliada em review/cabinet-style.html; XML dos addons válido e plantas base comparadas sem diferenças. Prova review/armarios-estilo-1.005.png.

## 1.006 · Armários encostados às paredes

Retiradas as folgas entre os armários e as paredes no closet, quartos e hall. Mantidos os tamanhos e o estilo da referência. Plantas base verificadas sem diferenças; addon SVG válido.

## 1.007 · Preenchimento do recanto do closet

Alargado o segmento horizontal até à face interior da parede lateral (x264) e prolongado o segmento vertical até à parede inferior (y670), eliminando as faixas de chão nas extremidades. Mantidos o acabamento e a profundidade dos armários. SVG válido e plantas base inalteradas.

## 1.008 · Armário do quarto 3

Profundidade aumentada de 42 para 50 unidades, igual ao quarto 2. Largura ajustada para preencher o recanto entre as faces x776 e x927; fundo encostado à parede y618. Acabamento preservado, addon SVG válido e plantas base inalteradas.

## 1.009 · Porta do WC comum

Corrigida pela referência do utilizador: abertura no topo à direita, entre x420 e x505, à cota y678. Dobradiça no canto superior direito, folha abre para dentro junto à parede direita. Fechada a abertura lateral anterior. Restantes portas, armários e pisos preservados. Geometria e SVG verificados.

## 1.010 · Folha visível do WC comum

Deslocado o eixo da folha para a face interior do vão (x492), com raio 72, para que a porta aberta seja visível junto da parede direita, sem ficar coberta pela camada branca. O arco acompanha a folha e termina no extremo esquerdo do vão (x420). Parede, abertura e restantes plantas preservadas.

## 1.011 · Junções contínuas das paredes do piso 3

Contornos de todas as paredes pintados antes do acabamento branco comum. Eliminadas as linhas sobrepostas nas interseções, preservando integralmente os segmentos, espessuras e aberturas. Comparação SVG confirma a mesma geometria e addons; pisos 4 e garagem inalterados.

## 1.012 · Trajetória da porta do piso 4

Invertido apenas o arco da porta entre Estúdio e Sala 2: passa para o lado direito, dentro do vão. Folha aberta mantida vertical, na mesma posição x310/y767..847. Restantes pisos preservados e SVG validado.

## 1.013 · Canto inferior direito do WC comum

Ligados os segmentos horizontal e vertical num único percurso no canto x505/y859, usando a junção miter existente. Eliminado o recorte no quadrante exterior sem deslocar paredes ou alterar aberturas. Addons e restantes pisos preservados; SVG válido.

## 1.014 · Parede, armário e porta do hall

Parede inferior do armário alinhada a y750 conforme linha vermelha; armário com profundidade 60 em vez de 42, encostado à parede. Remate direito do hall alinhado à mesma cota e porta nesse vão, com folha vertical em x744 e arco para a esquerda. Contenção das legendas acompanha o limite atualizado. Retirado o símbolo anterior da porta nessa zona, para manter apenas a folha e trajetória na posição indicada. Outros pisos preservados.

## 1.015 · Remate lateral do armário e largura no closet

Criada parede lateral esquerda do armário do quarto 2, x468/y505..565, com a mesma espessura e junção contínua da parede inferior. Armário encostado à face interior x476. Braço vertical do closet alargado de 47 para 54 unidades, conforme marca roxa. Portas e outros pisos preservados; SVG validado.

## 1.016 · Alinhamento pela marca amarela

Parede inferior do armário e remate do vão do hall alinhados a y740, à mesma cota da parede do WC de entrada à direita. Profundidade do armário reduzida de 60 para 50, mantendo-o encostado. Porta acompanha o alinhamento e mantém arco à esquerda. Contenção dos banners atualizada; outros pisos preservados e SVG válido.

## 1.017 · Portas e reentrâncias junto ao closet

Folhas reposicionadas conforme marcas bordeaux: quarto 2 vertical em x390, closet horizontal a y658. Criados pequenos retornos de parede nas dobradiças, conforme marcas roxas e referência arquitetónica. Arcos acompanham as novas folhas; armários e restantes pisos preservados. SVG validado.

## 1.018 · Cozinha e ilha

Addon kitchen independente: dez módulos alinhados à parede na faixa x73..513/y867..927, acabamento claro, lava-loiça e placa vistos de cima, duas colunas claras à direita. Ilha de refeições em madeira x155/y1002, 130×55, na marca azul. Tons inspirados no render fornecido. Sem cadeiras ou novas associações de equipamentos. Plantas base comparadas sem diferenças e dez módulos/SVG validados.

## 1.019 · Parede alinhada e porta de correr do WC

Topo da parede branca lateral do armário do quarto 3 alinhado ao topo do armário em y568. Porta de correr do WC de entrada representada por um pequeno traço x790..806/y740, na posição marcada, sem arco de abertura. Armários, cozinha e restantes pisos preservados; addon SVG validado.

## 1.020 · Porta de entrada robusta em castanho

Folha da porta de entrada com traço castanho #855b3b e espessura 9, em vez do traço claro de 5. Posição, comprimento, dobradiça e arco preservados. Comparação confirma restantes portas, plantas e addons sem diferenças; SVG válido.

## 1.021 · Porta de correr entra na parede

Traço da porta de correr do WC prolongado de x790 até x865, entrando no troço da parede direita iniciado em x851. A parede branca permanece por cima e oculta o final do traço, simulando o encaixe na parede. Sem arco; outros elementos preservados e SVG validado.

## 1.022 · Equipamentos na varanda inferior

Addon independente balconyUtilitiesAddon com aspirador, máquina de lavar roupa e bomba de calor, representações esquemáticas vistas de cima na faixa direita marcada. Ocupação x607..663/y1435..1546, antes da guarda em y1550. Sem estados ou comandos. Plantas base comparadas sem diferenças e três equipamentos/SVG validados.

## 1.023 · Porta de correr no piso 4

Porta entre Estúdio e Sala 2 substituída por traço horizontal no vão x310..390/y767, prolongado até x404 para entrar na parede direita, conforme o WC do piso 3. Sem folha perpendicular nem arco. Abertura, paredes e outros pisos preservados; SVG validado.

## 1.024 · Porta de entrada fechada e dois estados visuais

Folha castanha fechada no vão direito y798..868 por omissão. Dois grupos independentes para aberta/fechada, arco apenas aberta. API visual aceita true/false/null para futura leitura Shelly; unknown mantém desenho fechado, sem alegar contacto confirmado. Sem transporte, IDs ou comandos. Outros elementos preservados; teste com DOM fictício e SVG validado.

## 1.025 · Porta de correr do sótão recolhida à esquerda

Piso 4 também referido pelo utilizador como sótão. Traço da porta parcialmente aberto, de x296 até x345 em y767: entra na parede esquerda (até x310), deixando abertura à direita até x390. Sem alterar o vão ou restantes pisos. SVG validado.

## 1.026 · Loiças sanitárias opcionais

Três sanitas, três lavatórios e duas cabines de duche nas posições indicadas, em bathroomAddon independente. Check nativo nas definições mostra/oculta a camada inteira, persiste e integra exportação/importação com validação booleana e compatibilidade com backups anteriores. Plantas base inalteradas; contagem dos oito elementos e SVG validados. Testes fictícios de preferência, persistência e backup.

## 1.027 · Noite, estores e luzes em demonstração

Criada camada nativa de iluminação noturna para pisos 3 e 4, com faixas lunares proporcionais à abertura de cada estore e luz quente independente por divisão. Paredes brancas e SVG base preservados. Nove zonas de estores com hover/foco azul, popup 0..100 e banners ocultáveis por check; Velux excluídas. Luzes e estores explicitamente demonstrativos, com persistência e reposição local.

Definições incluem editor da conta Shelly Cloud e associações por piso/divisão: luzes, cada estore e contacto da porta. Validação de servidor, IDs, canais e saídas duplicadas, proteção de gravação concorrente. Credenciais opcionais separadas, nunca nos backups. Nenhuma consulta ou comando Shelly implementado nesta etapa. Exportação/importação preserva os novos dados e compatibilidade anterior.

24 testes passaram. Verificação UI em iPad768×1024 e recursos noturnos SVG validados. Provas review/noite-pisos-3-4-1.027.png. Documentação em ILUMINACAO-ESTORES.md.

## 1.028 · Banners de estore como na app original

Cápsulas azuis translúcidas com ícone circular de estore, nome da divisão e percentagem em destaque, reutilizando o desenho e a paleta originais. Conteúdo dimensionado à escala da planta. Mantidos os controlos, check de visibilidade, abertura acessível e demonstração.

Verificação iPad768×1024: novo banner abre o popup e a percentagem atualiza sem perder ícone/nome. Prova review/banners-estores-1.028.png.

## 1.029 · Barra de consumo e contador geral

Barra vertical e popup adaptados da app original, com percentagem do contrato, kVA, margem, kW e total kWh. Check de visibilidade e acesso alternativo nas definições. Associado o EM indicado pelo utilizador, ID48e72967aadc/canal0, por migração única que permite remoção posterior. Contrato inicial6,9kVA editável.

Primeira integração Cloud da nova casa, apenas leitura: conta já existente no editor, fila serial, polling15s, proteção de credenciais/geração/formulário/concorrência, neutralidade para dados inválidos/offline/antigos e sem comandos de relé. Dados não inventados quando a conta não está configurada. Backups atualizados sem chaves. 32 testes passaram e UI verificada com fixture exclusivamente fictícia. Ver CONTADOR-GERAL.md e review/contador-em-1.029.png.


## Limites de luz natural — 1.030

No piso 3, o hall de entrada e o WC de entrada recebem a média das aberturas dos estores cozinha/oeste e sala/sul esquerda e direita. As escadas seguem apenas sala/sul direita, a janela mais próxima. Corredor dos quartos e WC interior recebem a média dos três estores dos quartos; o closet acompanha o quarto principal. Cada fonte contribui igualmente e percentagens intermédias variam continuamente. Com todas fechadas, estas zonas escurecem como as divisões com janela; luz elétrica mantém prioridade. À noite, abertura dá apenas uma contribuição ambiente ténue, além das faixas lunares locais existentes.

CasaHomeCore.lighting concentra a regra pura partilhada por home.js e generate-night.cjs. lightingAreas no gerador prolonga o sombreado da entrada/cozinha através dos limiares abertos, sem alterar paredes, móveis ou a contenção das legendas. Não há novos IDs, comandos, preferências ou alterações à Cloud. Todas as modificações ficam em dist/.

Verificação: 37 testes, incluindo cinco regressões de fontes, contribuição individual, percentagens e prioridade elétrica. Revisão visual diurna em iPad 768×1024, estores a 0% e 100%, com paredes brancas preservadas. Cenário isolado localhost em review/shutter-influence.html; prova review/limites-estores-1.030.png. Sem uso de equipamentos reais.


# Popup de dispositivos por divisão — 1.033

Tocar/clicar no interior das divisões abre o popup, mesmo com nomes ocultos. app.js transforma coordenadas pelo getScreenCTM inverso e usa as áreas de contenção, preservando a supressão de cliques de pan/pinch/swipe e arrasto de legendas. Clique com movimento superior a 8px é ignorado; botões/janelas mantêm ações próprias. As legendas continuam acessíveis por teclado. Escadas têm popup com ação explícita para mudar de piso.

home.js apresenta lista no estilo da app original: título, contagem dos controlos disponíveis, atualização local, iluminação com botão circular e percentagens dos estores com painel de ajuste. Sem sensor associado, temperatura/humidade e contactos são identificados como ausentes; não mostrar leituras ou dispositivos da outra casa. Botões continuam estritamente demonstrativos; não acrescentar comandos Cloud. Fecho por X/Escape/exterior preservado. Verificação no iPad768×1024: toque na sala com nomes ocultos, luz on/off, painel do estore e 0%, e popup da garagem. 37 testes existentes passam.

# ID.4 na garagem — 1.034

addons.js monta garage-vehicle acima do chão e abaixo da iluminação/paredes. Asset independente assets/id4-vista-superior-v1.png é uma cópia integral do recorte Volkswagen existente, visto de cima, rodado180° para orientar a frente ao portão inferior. Carregador SVG estático na parede superior, à esquerda do carro, com cabo recolhido. Nenhum estado de carga, associação ou comando é inferido/adicionado. Não alterar a geometria, chão ou portão. Prova review/garagem-id4-1.034-full.png; popup review/popup-divisao-1.033-full.png.


# Carregador EM no canal 1 — 1.036

Por associação explícita do utilizador, evMeter opcional {deviceId,channel} guarda o carregador48e72967aadc/canal1, separado de homeEnergy canal0. Migração única casa-leal-ev-associated-v1 completa só campo ausente; preserva edição e null para remoção. Campos nas definições, validação Home.setup e backup incluídos. Backups antigos preservam as duas associações ausentes apenas na mesma conta. Leitura pode partilhar ID/canal; não criar relé de atuação a partir do canal de medição.

cloud-read-core mantém uma fila e conta comuns, deduplica IDs e normaliza cada canal exato de emeters separadamente. Nunca usar canal0 como fallback para o carro. evSnapshot não expõe ID nem segredo, retorna W/1000 em kW e totalWh/1000 em kWh. Sem zeros inventados ou valores absolutos; fresco45s online válido, erros/offline/antigo ficam por confirmar com último total identificado. Mantém geração, bloqueio de formulário sujo, timeout e limites/401 existentes. Só endpoint get; guardar/abrir/consultar não atua no carregador.

addons.js afasta ligeiramente o ID.4 (imagem x300, centro503.5) e põe carregador na parede esquerda, junto ao canto superior esquerdo do carro. ev-read.js/css monta banner clicável e popup só de leitura; cabo até ao carro apenas com potência válida fresca superior a50W, recolhido nos outros casos. Não inferir ficha física/bateria/carga completa nem estado do relé. Controlos do carregador preservam zoom com dois dedos e não abrem simultaneamente popup da garagem. Todos os scripts/recursos relativos dentro de dist/.

42 testes passam: novos casos em tests/ev-read.test.cjs cobrem canais independentes numa consulta, canal ausente, zero/limiar/negativos, offline/stale/inválido/erro, consulta sem contador geral, guardas e backup. Fixture review/charger-fixture.html e em-fixture.html usam exclusivamente ID/chave fictícios e intercetam toda a rede; restauram preferências no pagehide. Revisão iPad768×1024 com banner/popup; imagens review/carregador-em-1.036.png e carregador-popup-1.036.png mostram dados simulados. Não foi realizado teste de equipamentos reais.


# Animação do carregador — 1.037

O cabo tem traços verdes em movimento do carregador para o carro, e o LED do carregador pulsa durante consumo de carga confirmado. Ativar is-charging exclusivamente com evSnapshot.charging true, no piso−1 visível. Sem consumo/offline/erro/stale: sem animação e cabo recolhido. Pausar quando documento oculto e respeitar prefers-reduced-motion. Não alterar associações, normalização, limiar50W, transporte ou equipamentos reais. Fixture charge=off/offline permite verificar interrupção com dados fictícios. UI validada com7,2kW e0W, screenshot review/carregador-animacao-1.037.png.


# Cor pelo relé do EM — 1.038

Utilizador confirmou que desligado significa relé de alimentação OFF, não offline. energy-core.relayStatus lê exclusivamente relays[0].ison ou switch:0.output do mesmo EM associado ao carro (relé único0, independente da pinça1). Booleanos exatos, conflitos/erros/ausência/offline/stale mantêm feed null. cloud-read-core.evSnapshot.feed não depende dos watts nem inventa OFF a0W; mesma consulta get/fila/geração, sem novos comandos. Desenho usa símbolo/LED vermelho com false, verde com true, neutro unknown. Animação do cabo continua por potência; pulsação do LED só com alimentação ON. Popup informa alimentação lida, sem botão de atuação. Testes44, incluindo independência potência/relé e canal/erros/frescura. UI validada com relé OFF fictício; prova review/carregador-off-1.038.png.


# Cenários gerais — 1.040

Botão redondo com símbolo de camadas #open-scenarios junto às definições, em .top-actions, abre #scenarios-dialog. Quatro ações: abrir9estores100%, fechar9estores0%, ligar todas as luzes e apagar todas, nos três pisos. Sem estores Velux. CasaHome.setAllLights/setAllBlinds centralizam alteração do estado local, persistência e redesenho; não chamam transporteCloud, não alteram EM/relé do carregador, nem credenciais. Respeitar separação de demonstração mesmo com IDs guardados. Popup mostra resultado em role=status, nota de demonstração e fecha por X/Escape/exterior. MeteoNL envolve/restaura este dialog como os restantes.

Verificação visual768×1024 e375×812, todas as quatro ações acionadas na demonstração;48 testes existentes passam. Header adaptado a ecrãs pequenos mantendo botões44px. Prova review/cenarios-1.040.png, harness review/cenarios-mobile.html.


# Relevo arquitetónico — 1.041

wall-relief.js acrescenta addon SVG nos pisos3e4 com faces laterais deslocadas4×9unidades, sombras projetadas difusas e sombra curta de contacto. Deriva do mesmo percurso das white-walls, sem modificar geometria, áreas interativas, materiais ou recursos base. home.js monta o relevo depois da iluminação e antes das paredes originais, preservando a camada branca acima de tudo e a ausência de juntas visíveis. Camada não interativa, sem mobília nova; garagem mantida. Pequena sombra nas folhas das portas existentes viaCSS. Não introduzir AI/renderbitmap que altere proporções.

Pré-visualizações noturnas geradas pelo mesmo markup de relevo em generate-night.cjs; XML válido. UI diurna nos pisos3/4 e noturna no piso3 verificada em768×1024.48 testes existentes passam. Prova review/paredes-relevo-1.041.png e paredes-relevo-noite-1.041-full.png. Nenhuma configuração/estado/comando Shelly alterado.


# Porta principal BLU funcional — 1.046

Associação explícita XB66172384118439, sourceblu, componente/channel0 em entranceContact da mesma configuração/conta. Migração única casa-leal-entrance-associated-v1 aplica o ID pedido, preserva canal de associação BLU igual e demais equipamentos; marcador no backup, remoção posterior permitida. IDs XB completos até48bits decimais preservados na configuração, backup e transporteget; nunca substituir pelo MAC/gateway. Não ativar janelas sem IDs pedidos.

contact-core normaliza window:N.open e value legado com false explícito, conflitos inválidos unknown, janela legada só componente0. BTHome opcional exige componenteobj_id45; nunca deduzir abertura por lux/ângulo/bateria/relé. Erros/ausência/offline/stale45s = null, desenho fechado por omissão com legenda por confirmar. cloud-read-core inclui contacto na mesma consulta/fila/geração dos dois canaisEM (IDsdeduplicados), apenas get. doorSnapshot expõe estado e mensagens seguros, não ID/chave.

entrance-read cria zona clicável no vão real da porta, popupAberta/Fechada/Por confirmar, hora explicitamente de consulta, refresh e atalho da associação. Desenho usa CasaAddons.setEntranceDoorState; não alterar geometria/batentes/sentido ou paredes. Hall também apresenta leitura. Atualização30s geral/15s popupporta ouhall, renovação ao abrir; nunca comandos de abertura/desbloqueio nem mistura com grupos de luzes/estores. Backups antigos sem campo opcional preservam contacto atual apenas na mesma conta; null remove.

57 testes passam, incluindo normalização,canal,conflitos,offline/stale/erro, porta semEM, transporteXB,backup e desenho. review/entrance-fixture.html usa apenas ID/chave fictícios, todas as chamadasCloud intercetadas. UIiPad768×1024 verificou contacto true→Aberta efalse→Fechada e clique no vão; screenshot review/porta-principal-1.046.png. Nenhum equipamento real foi usado nos testes.


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
