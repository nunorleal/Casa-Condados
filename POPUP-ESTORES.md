# Popup dos estores — 1.099

Layout adaptado à referência fornecida pelo utilizador: cabeçalho CONTROLOS DO ESTORE, nome, estado, desenho do estore, abertura/slider com extremos Fechado/Aberto, trio Abrir/Parar/Fechar, feedback, botões circulares de consulta/configuração e cartões de consumo. Largura máxima 480 px e scroll limitado à altura disponível; alvos de pelo menos 44 px. Estore representado em CSS, sem novos bitmaps. Movimento reduzido desativa a transição.

Os IDs e handlers dos controlos existentes são preservados. O slider envia apenas no change; input indica o destino. Percentagem e desenho usam exclusivamente posição reportada ou última posição explicitamente identificada. Não antecipam a aceitação de um comando. Unknown sem posição mostra traço e representação com interrogação; comandos continuam sujeitos às guardas de consulta/calibração existentes. Offline mantém a marca da versão anterior. Demonstração é identificada e não envia comandos.

blind-core.meterStatus acrescenta apenas leitura de consumo no mesmo canal: Gen2 cover:n.apower/aenergy.total (Wh /1000); Gen1 meters[n].power/total (Watt-minute /60000). Dados negativos, ausentes, inválidos ou em erro não viram zero. Não se calculam períodos ou consumos fictícios. Estado e confirmação do movimento continuam independentes dos consumos.

cloud-read-core conserva separadamente a última potência e energia válidas por estore, com hora própria. Consulta continua no mesmo pedido e fila, sem novos IDs, timers de rede ou atuações. Offline/erro/stale e resposta parcial mostram valores conhecidos como Última leitura. Um zero medido é preservado. Sem medição, os cartões mostram traços. Não há nova configuração nem dados persistidos em backup.

Testes: blind-meters.test.cjs, blinds-cloud.test.cjs, cloud-auto.test.cjs e ui-syntax.test.cjs, 19 aprovados. Fixture review/blind-popup-fixture.html usa só IDs/chave fictícios, interceta todas as chamadas e recusa atuações. Revisão visual com percentagem intermédia, fechado e offline; zero comandos reais.
