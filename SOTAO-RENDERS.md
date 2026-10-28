# Renders do sótão — 1.059

Recursos originais896×1190 copiados sem edição: assets/sotao-diurno-v1.jpg de Gemini_Generated_Image_a19cb5a19cb5a19c.jpg; assets/sotao-estores-fechados-v1.jpg de Gemini_Generated_Image_ru1nsjru1nsjru1n.jpg; assets/sotao-noturno-abertos-v1.jpg de Gemini_Generated_Image_wo8nctwo8nctwo8n.jpg. Recorte pelo contorno exterior das paredes, sem o fundo das fotografias, preservando paralelos da Casa. Não gerar novas imagens nem retocar pixels.

floor4-render.js é addon independente montado por CasaAddons. Usa createRegions, auxiliar puro extraído de floor3-render, com regiões disjuntas de studio/living2/stairs4 e das duas janelas. Dimensões/IDs/estado do piso3 preservados; testes anteriores continuam válidos. No sótão os limites51,10..858,1178 mapeiam55,90..885,1278; conservar geometria original invisível para clique/contenção e posições guardadas. Não sobrepor chão, escadas, móveis, porta ou vidros nativos sobre as imagens que já os incluem. Os renders não representam Velux; não as pintar como retângulos no chão e não criar estores para elas. A preferência Velux e os recursos antigos permanecem guardados para o desenho nativo de fallback.

Dois estores independentes: studio-west afeta todo o Estúdio; living2-west afeta Sala2 e luz natural nas escadas. A0% só o render escuro nessa divisão; percentagens intermédias interpolam. Dia/noite seleciona a imagem clara ou lunar. Luz elétrica local em demonstração usa94% do recorte diurno sem clarear a janela fechada; escadas mantêm a sua luz separada. Sem nova associação ou comandos. Desativar película sintética apenas no piso4 com render ativo.

HOTSPOTS adapta só posição visual/clique/banner às janelas das fotografias: estúdio x65/y542..654, Sala2 x65/y810..923. Preservar os IDs e percentagens do inventário nativo. Piso3, garagem, leituras Cloud e backups não mudam.

80 testes passaram: estados extremos, independência de divisões/luz/estores, opacidade real nos dois períodos e cobertura sem sobreposições. UI com fixture estritamente fictícia review/floor4-render-fixture.html verificou dia, estúdio0%/Sala2 100%, luz ligada mantendo0%, noite com estores abertos e todosfechados. Provas review/sotao-dia-1.059.png, sotao-estudio-fechado-1.059.png, sotao-estudio-luz-1.059.png, sotao-noite-1.059.png e sotao-fechado-1.059.png. Nenhum equipamento real em testes.


## Render elétrico do sótão — 1.061

Imagem Gemini_Generated_Image_qrd1a0qrd1a0qrd1.jpg copiada integralmente para assets/sotao-luz-eletrica-v1.jpg. floor4-render.js usa este quarto render nos recortes elétricos locais, excluindo janelas e exterior. Luz desligada = contribuição zero; noite e luz ligada = 1 independentemente do estore; dia e luz ligada = 1 − abertura do estore da zona. Mantém independência de estúdio, Sala 2 e escadas, estados/configuração/IDs e comandos anteriores.

82 testes passaram, incluindo limites de abertura e noite, isolamento e referência ao novo recurso. Comparação visual sem dispositivos em review/attic-electric-preview.html, captura review/sotao-eletrico-1.061.png.
