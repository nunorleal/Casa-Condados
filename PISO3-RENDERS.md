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
