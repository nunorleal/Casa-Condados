# Materiais e relevo — 1.049

Os pisos 3 e 4 usam faces SVG sólidas derivadas da união das paredes originais. Só as arestas expostas recebem faces; cruzamentos não geram juntas internas. A projeção é de 4 unidades na horizontal e 24 na vertical, com sombras na base e topos brancos originais acima da iluminação. Retirou-se o filtro de sombra das folhas das portas. As portas existentes recebem faces de madeira, conservando pivôs, percursos e grupos de estado. Não foram acrescentados móveis nem alterados os polígonos das divisões ou comandos Shelly. A garagem mantém o tratamento anterior.

A referência fornecida foi usada para orientar materiais e profundidade, não para substituir a geometria por uma imagem. O resultado continua a ser uma planta SVG interativa com relevo, não um modelo tridimensional completo.

## Textura de parquet

Recurso final: [assets/parquet-carvalho-natural-v1.png](assets/parquet-carvalho-natural-v1.png), 1254 × 1254, copiado sem alteração do resultado da ferramenta integrada imagegen. Não foi usado o CLI. Referência: Planta 3D de Apartamento Contemporâneo.png, fornecida pelo utilizador. Aplicação em padrão SVG de 160 × 160 unidades, caminhos relativos em planta inline e SVG externo.

Prompt final:

```text
Use case: photorealistic-natural. Asset type: seamless square parquet material texture for a precise interactive architectural floor plan. Reference image is STYLE AND MATERIAL REFERENCE ONLY; take the warm natural light oak herringbone flooring from it, do not reproduce the apartment. Generate a full-bleed 1024x1024 seamless repeating material swatch: strictly perpendicular top-down, flat square field entirely filled with finely grained natural oak herringbone parquet, many narrow rectangular boards at 45 degrees forming classic herringbone (not chevrons cut at an angle), about 18 to 24 board widths across the image. Natural pale honey oak and beige tones, subtle board-to-board variation, fine visible authentic timber grain and delicate seams. Photorealistic PBR albedo material quality, satin matte finish. Uniform neutral diffuse white lighting, no directional light or baked shadows, no vignette, no reflections, no perspective, no border, no furniture, no room, no walls, no objects, no labels. Opposite edges must tile seamlessly. Preserve the delicate small-scale herringbone pattern of the reference, improve material realism rather than changing the wood type.
```

## Regeneração e verificação

Executar `python3 dist/generate-plans.py` e `node dist/generate-night.cjs` a partir da raiz. Os geradores escrevem apenas dentro de dist. Os SVG noturnos reutilizam a textura e o mesmo relevo; as folhas de madeira são acrescentadas em tempo de execução pela montagem DOM.

59 testes passaram, incluindo união de paredes e preservação de vãos. Verificação visual dos pisos 3 e 4 em navegador, sem conta configurada e sem testar equipamentos reais. Provas em review/render-1.049-top.png, review/render-1.049-detail.png e review/render-1.049-floor4.png. review/render-large.html apresenta uma vista ampliada para inspeção dos materiais.


# Reposição das paredes — 1.050

Por correção do utilizador, manter o parquet natural de 1.049 e retirar o relevo adicional das paredes e as faces de madeira acrescentadas às portas. home.js já não monta CasaWallRelief e index.html já não carrega o módulo. Pré-visualizações noturnas também deixam de incluir a extrusão. Preservar paredes brancas originais, geometria, portas, iluminação, configurações e comandos. O módulo wall-relief.js e as provas antigas são históricos, não o aspeto ativo.
