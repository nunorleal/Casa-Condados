# Comparacao com a T2 - 1.198

As duas apps usam o mesmo cats-traffic-core.js e o mesmo cats.css; ambas animam por requestAnimationFrame e atualizam a luz a cada 300 ms. O caminho nao era a diferenca principal observada no codigo.

Nos Condados os gatos estavam dentro de floorN-render > g, descendente do grupo filter=url(#shadow) que inclui todas as imagens e mascaras da planta. A T2 monta a camada animada no SVG de iluminacao sem esse filtro ancestral global. Alterar um gato nos Condados podia invalidar o filtro de uma superficie muito maior.

A camada dos gatos passa a ser filha direta do SVG principal, fora do filtro. Copia apenas as transformacoes dos antecessores; preserva o recorte interior, posicoes, percursos, iluminacao e brilho dos olhos. A planta, sombras estaticas, paredes e imagens nao sao alteradas. O mesmo viewBox continua a controlar zoom/pan.

O arrasto da T2 usa um retangulo medido ao iniciar. Os Condados mediam getScreenCTM duas vezes nesse momento. Agora reutilizam a inversa guardada quando a posicao e atualizada. O movimento continua agregado por frame. As pausas dos gatos introduzidas nas correcoes anteriores foram retiradas: podem continuar a andar durante o arrasto.

Testes isolados: portable-drag-performance.test.cjs, portable-stairs.test.cjs, cats.test.cjs e cats-traffic.test.cjs. Fixture local: tests/serve_portable_perf_fixture.py; fetch externo intercetado, dispositivos ficticios. Resultados de um navegador nao garantem os mesmos tempos no Safari do utilizador.

No ensaio isolado realizado no Safari, mantendo o mesmo arrasto e alterando apenas o pai da camada dos gatos: grupo antigo com filtro global, media 263 ms/frame (maximo 284); camada isolada, media 16,6 ms/frame (maximo 17). Valores de um ensaio local, nao uma garantia para todos os ecras. 332 testes passaram, com fetch externo bloqueado.

Confirmacao com movimento controlado identico dos dois gatos, Safari v1.198: antigo 263,45 ms/frame (maximo 285), isolado 14,05 ms/frame (maximo 16); inicio do arrasto 1 ms / 0 ms. O ensaio controla a animacao para evitar que uma pausa natural dos gatos distorca a comparacao. Prova: review/cats-safari-1.198.png.
