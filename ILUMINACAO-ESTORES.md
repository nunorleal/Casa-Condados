# Iluminação, estores e preparação Shelly · 1.027

A aplicação continua autónoma dentro de dist, em file:// e GitHub Pages. Os novos scripts são clássicos, com caminhos relativos. Não há transporte Shelly nos módulos novos e nenhum controlo de demonstração envia pedidos ou comandos.

## Ambientes

home.js monta uma camada SVG independente sobre o chão, os móveis e os equipamentos. As paredes originais são recolocadas por cima, com os mesmos percursos, espessuras e cores. Não altera os SVG base. O ambiente acompanha CasaEnvironment.isDay, incluindo os modos Diurno/Noturno nas definições.

A máscara escurece os interiores de noite. A luz elétrica retira o sombreado da divisão e acrescenta um tom quente. As transições entre zonas têm uma margem suave; cada divisão mantém controlo independente. Não há simulação de reflexos de janelas abertas.

Os nove estores de fachada estão definidos em CasaHomeCore.WINDOWS: três quartos, WC da suite, cozinha, duas janelas independentes da sala, estúdio e sala 2. As duas Velux não têm estores nem controlos de estore. À noite, a intensidade da faixa azulada junto de cada janela acompanha a abertura do seu estore; com 0% desaparece. Não se deduz a abertura de um contacto de janela.

O contorno da janela realça a azul no hover e no foco de teclado. Clique, toque, Enter ou Espaço abre o popup. O banner mostra percentagem aberta: 0 fechado, 100 aberto. O check Mostrar percentagens dos estores oculta apenas os banners, mantendo as janelas interativas. As posições e luzes são explicitamente de demonstração e persistem em casa-leal-home-demo-v1. A visibilidade usa casa-leal-show-blind-banners-v1.

Os popups das divisões permitem controlar luz e estores. Ligar todas, Apagar todas e Repor demonstração atuam exclusivamente no modelo local. Não chamam CasaShelly, a ponte da MeteoNL, a porta real ou qualquer atuador. Zoom e navegação mantêm a reposição por piso; um toque nos novos controlos não é tratado como swipe e dois dedos continuam a ampliar.

## Preparação da conta e associações

shelly-setup.js apresenta servidor, chave de autorização e check opcional de retenção da chave. As associações são separadas por piso/divisão, com ID, canal e tipo da luz e um ID/canal por estore. A entrada inclui campos opcionais para contacto BLU/BTHome da porta. As secções details começam fechadas e mantêm os campos no DOM.

CasaHomeCore.setup valida o servidor HTTPS Shelly Cloud, IDs hexadecimais de atuadores, canais 0..15 e tipos switch/light/cover. O contacto aceita XB completo ou hexadecimal, componente 0..255 e origem explícita. Saídas duplicadas entre luzes e estores são recusadas; um contacto só de leitura pode partilhar dispositivo. Campos ausentes ficam por associar. Não há IDs copiados da outra casa.

Configuração: casa-leal-shelly-setup-v1. A chave não integra este objeto. Só é persistida em casa-leal-cloud-auth-v1 se o utilizador marcar o check; caso contrário, permanece no formulário durante a sessão. Não é exibida em resumos, logs ou backups. A conta guardada com a chave tem de corresponder ao servidor da configuração ao carregar. O editor deteta gravação concorrente noutra janela antes de substituir a configuração.

Guardar, abrir, colapsar, exportar ou importar nunca consulta nem aciona dispositivos. Associar IDs não transforma os estados demonstrativos em leituras reais. A ligação Cloud e confirmação de estados reais serão implementadas numa etapa posterior, preservando a separação entre demonstração e atuação.

## Backups

backup-core inclui homeDemo, showBlindBanners e shellySetup, com validação pura. Backups anteriores sem estas categorias preservam os valores atuais. Não aceita authKey nem credenciais na configuração importada. Exportar recusa formulário de configuração ainda por guardar. A chave local não é exportada nem substituída por uma importação.

## Recursos e verificação

assets/piso-3-noite.svg e piso-4-noite.svg são pré-visualizações estáticas, com luzes apagadas e estores abertos. Regenerar com `node generate-night.cjs` depois de atualizar os SVG com `python3 generate-plans.py`. A aplicação usa o render dinâmico, que reage aos controlos sem trocar os ficheiros base.

Os 24 testes de dist/tests passaram, incluindo nove estores, limites, luzes, duplicados, servidor, backups antigos, exclusão de credenciais, gesto de toque e ampliação. UI revista em iPad vertical 768×1024: popup de estore, 0/100%, iluminação da Sala 2, navegação entre pisos, check das percentagens e formulário Cloud/associações. Cenário de QA apenas local em review/home-demo-ipad.html, origem localhost; não contém credenciais ou IDs reais. Prova conjunta: review/noite-pisos-3-4-1.027.png.

## Atualização 1.029

O contador EM foi ativado exclusivamente para leitura, usando a mesma conta e o editor. Guardar pode agora consultar apenas esse contador. Luzes e estores continuam estritamente demonstrativos. Ver CONTADOR-GERAL.md para a fila, regras de estados e associação pedida.


## Limites de luz natural — 1.030

No piso 3, o hall de entrada e o WC de entrada recebem a média das aberturas dos estores cozinha/oeste e sala/sul esquerda e direita. As escadas seguem apenas sala/sul direita, a janela mais próxima. Corredor dos quartos e WC interior recebem a média dos três estores dos quartos; o closet acompanha o quarto principal. Cada fonte contribui igualmente e percentagens intermédias variam continuamente. Com todas fechadas, estas zonas escurecem como as divisões com janela; luz elétrica mantém prioridade. À noite, abertura dá apenas uma contribuição ambiente ténue, além das faixas lunares locais existentes.

CasaHomeCore.lighting concentra a regra pura partilhada por home.js e generate-night.cjs. lightingAreas no gerador prolonga o sombreado da entrada/cozinha através dos limiares abertos, sem alterar paredes, móveis ou a contenção das legendas. Não há novos IDs, comandos, preferências ou alterações à Cloud. Todas as modificações ficam em dist/.

Verificação: 37 testes, incluindo cinco regressões de fontes, contribuição individual, percentagens e prioridade elétrica. Revisão visual diurna em iPad 768×1024, estores a 0% e 100%, com paredes brancas preservadas. Cenário isolado localhost em review/shutter-influence.html; prova review/limites-estores-1.030.png. Sem uso de equipamentos reais.


# Luz exterior com luz elétrica ligada — 1.042

Por pedido do utilizador, a luz exterior não desaparece ao ligar a divisão. HomeCore.beamOpacity depende apenas da abertura do respetivo estore e do ambiente (diurno quente suave, noturno azulado), nunca de on. home.js conserva os feixes sobre o contributo elétrico. Estore0 remove apenas a luz exterior dessa janela. De dia, lighting.electricOpacity reduz o tom quente elétrico proporcionalmente à luz natural; de noite ambos se combinam. Guardar estados, áreas partilhadas, paredes brancas, relevo e comandos ficam intactos. Esta regra substitui a anterior supressão de feixes com iluminação ligada.

50 testes passam, incluindo independência de estore/luz e combinação diurna/noturna. UI Sala2 com luz ligada e estore100% verificada; prova review/luz-rua-eletrica-1.042.png. Só demonstração, sem equipamentos reais.


# Garagem com luz branca neutra — 1.043

HomeCore.lighting trata apenas−1/garage com luz ligada: opacity0 e electricOpacity0, removendo a máscara escura e o véu âmbar sobre os pixels do chão/carro. A luz branca neutra revela os materiais originais sem camada branca que também os tornaria baços. Luz apagada mantém escurecimento noturno; restantes pisos mantêm tom quente e luz exterior. Não editar imagem/posição do ID.4, carregador, paredes, geometria ou estadosCloud. Teste dedicado e suite51 passam; UI com luz acesa verificada na fixture fictícia, prova review/garagem-luz-branca-1.043.png.
