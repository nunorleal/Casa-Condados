# TV da sala — 1.087

Associação opcional tvMeter {deviceId,channel0..15} na configuração Cloud existente. Migração única casa-leal-tv-associated-v1 associa o ID437c82 indicado pelo utilizador, canal0, apenas quando o campo está ausente; preserva edições e null de remoção. Formulário em Piso3/Sala/TV, backup valida configuração e marcador. Importações antigas da mesma conta preservam tvMeter atual quando ausente. Não introduz chave ou conta adicional.

Leitura exclusivamente de potência real no canal exato: Gen1 meters/emeters.power, Gen2 switch:n/pm1:n.apower. Recusa famílias ambíguas, erros, valores ausentes/negativos/não numéricos; não soma famílias nem deduz watts pelo relé. Consulta pela mesma fila/conta/geração, lotes<=10 e temporizador geral30s. Popup TV foca apenas TV a15s; popup Sala inclui TV. Abrir/guardar/importar só consulta, nunca atua. Não existe comando TV nem participação em grupos de luzes/estores/alarme.

Estados com online true/1, medição válida e recente45s:
- Mais de50W: Ligada, halo verde no banner e reflexo animado local à frente da TV.
- 5..50W inclusive: Em regeneração, halo amarelo, sem feixe. O valor50W fica aqui por ser necessário>50W para Ligada; evita intervalo indefinido49..50W.
- 0..menos de5W: Desligada, sem feixe e banner oculto. O botão sobre a TV e acesso no popup Sala continuam disponíveis.
- Offline/falha/stale/ausência: Por confirmar, sem halo ativo/feixe; preserva watts anteriores como Última leitura e não inventa zero.

Reflexo SVG na transformação fotográfica do piso3, limitado ao interior da sala. Não altera imagens, paredes, estores, luz elétrica ou dados de equipamentos. Respeita movimento reduzido; suspende emissão quando documento oculto, noutro piso ou leitura inválida. A Meteo pausa a animação. Banner acompanha slider comum, arrastamento e contenção do retângulo na sala; posição casa-leal-tv-layout-v1 / backup tvLayout.

Verificações: node --test dist/tests/*.test.cjs (149 testes). tv.test.cjs valida limiares fracionários/50W, normalização, configurações antigas, backup e consultas/scope/frescura/offline sem comandos. review/tv-fixture.html interceta toda a rede e usa só feedface0001/chave fictícia. Modos on/regenerating/off/offline/invalid/boundary; nenhum equipamento real acionado. Provas review/tv-on-1.087.png, tv-regenerating-1.087.png e tv-off-1.087.png.


## TV — 1.094
Retirado o banner flutuante da TV. Halo verde/amarelo no contorno do próprio ecrã (x68,y888,14×102 na imagem fonte), preservando os limiares de consumo e as guardas de validade. Reflexo com origem limitada ao ecrã e animação contida numa máscara fixa, sem abranger o móvel. Clique na TV mantém o popup de consumo. Posições de banners TV de backups antigos continuam aceites por compatibilidade, sem interface ativa. Testes apenas fictícios.
