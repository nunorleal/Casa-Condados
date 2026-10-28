# Equipamentos adicionais da sala — 1.109

Router Vodafone, Soundbar Polk, PlayStation5 e UniFi Dream Router foram associados aos IDs fornecidos pelo utilizador, no canal0 editável. Guardados em mediaBindings na mesma configuração Cloud, validados e incluídos no backup. Migração só quando mediaBindings está ausente; mapas editados/vazios/remoções são preservados.

A interface aparece só no popup da divisão Sala. Cada linha tem W e kWh, alimentação separada de consumo, botão de alimentação com estado confirmado e roda dentada que foca o próprio ID. Nenhum novo elemento na planta. A atividade operacional dos dispositivos não é deduzida por potência.

Reutiliza commandAppliance, fila e confirmações existentes: estado booleano exato, fresco/online, comandos explícitos e sem repetição/otimismo. Leituras antigas são identificadas; offline bloqueia atuação. Não incluir em grupos de iluminação, demonstração, cenários ou reset. Abrir/guardar/consultar não atua. Não há credenciais ou transporte separado.

Verificações automatizadas e visuais com mocks/fixtures exclusivamente fictícios; nenhuma atuação em equipamentos reais. Ver tests/living-media.test.cjs, review/living-media-fixture.html e review/sala-multimedia-1.109.png.
