# MeteoNL integrada na Casa Condados

A MeteoNL mostra o número de versão da planta dos Condados. O pacote é o mesmo que a T2 usa. A fonte canónica está em `DomoticaNL V2/meteo-src/`. A pasta `meteo-src/` aqui acompanha essa fonte para inspeção e testes. A versão autónoma anterior é histórica.

Com os projetos lado a lado, executar `node meteo-src/build.cjs` nos Condados para gerar o pacote uma vez na T2 e copiá-lo para os dois projetos. Se os projetos estiverem noutro local, `METEONL_T2` pode indicar a pasta da T2. Pode ainda passar o caminho de `node_modules` como primeiro argumento.

Abrir a MeteoNL pelo botão de meteorologia ou pela navegação acima do piso superior. Preferências, sensores e dispositivos são os da Casa Condados. O pacote funciona dentro da app local e da app publicada, a partir dos ficheiros deste projeto.
