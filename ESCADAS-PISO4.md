# Escadas do piso4

Usa exclusivamente a escada da divisão inferior de sótão.png fornecido pelo utilizador. O ficheiro foi copiado integralmente, sem alteração, para assets/sotao-escada-fornecida-v1.png. Não foram usadas as imagens geradas nos ensaios anteriores.

floor4-stairs.js projeta só o recorte x868/y934/w138/h453 da imagem1088×1445 para x718/y774/w123/h373 da fotografia atual896×1190. Dia, fechado, elétrico e noite usam exatamente a mesma origem e geometria, variando só o filtro de iluminação. O SVG local tem overflow hidden: nenhuma parede da imagem fornecida é incorporada, nem se redesenham paredes ou outros elementos. Os quatro renders originais, máscaras, janelas, porta removida, móveis e posições mantêm-se.

## Reverter

Mudar apenas const ENABLED=true para const ENABLED=false em floor4-stairs.js. Isso retira o recorte e recupera as escadas originais em todos os ambientes. Também existe a cópia exata review/floor4-render-before-stairs-1.160.js. Hashes dos JPG originais em review/floor4-originals-1.160.json. Não apagar os renders antigos.

Desde1.163, as escadas acompanham a Sala2 no render e no normalizador de iluminação, incluindo luz elétrica e abertura do estore. O valor independente legado de4:stairs4 é ignorado visualmente; guardar/consultar não envia comandos.

1.166: sombra preta SVG local por ambiente (84% fechado, 72% noturno, 12% elétrico e 0% diurno), sem filtro CSS em fontes reutilizadas por use. Recorte e imagem preservados. Limite entre divisões em y675, na base da parede; geometria OUTLINE intacta.

1.174: apenas o recorte noturno das escadas recebe uma matriz SVG sRGB que converte a luminância da madeira para tom frio azulado. Mantém a sombra preta72%, geometria e textura originais. Dia, fechado e elétrico sem mudança de cor. A mistura por abertura/luz da Sala2 existente continua a controlar o resultado. 14 testes aprovados; fixture noturna com estore100% confirmou o tom frio e zero comandos Cloud. Prova review/escadas-azul-1.174.png.
