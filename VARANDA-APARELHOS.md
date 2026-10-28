# Aparelhos da varanda — 1.097

Associações autorizadas pelo utilizador: caldeira Bosch bc1c2a e máquina de lavar roupa 485519eb7022, ambas no canal 0. Campo opcional balconyMeters com papéis boiler/washer; ausente mantém compatibilidade. Objeto vazio ou papel null permite remoção, preservada após a migração única casa-leal-balcony-appliances-associated-v1. Definições em Piso 3 / Varanda. Configuração, marcador e backup usam a conta existente; não se copiam outras associações nem credenciais.

Referências apenas lidas: kitchen.js, kitchen.css e media-core.js originais. Preservados os SVG originais da máquina e da chama, e o limiar de funcionamento estritamente superior a 10 W. Tambor gira em 2,8 s; chama varia a opacidade em 1,8 s. Movimento reduzido suspende animação. Halo no aparelho, sem banner extra. Contorno quadrado da roupa e circular da caldeira calibrados à fotografia. Rato, toque e Enter/Espaço abrem detalhes.

Só leitura: não existem comandos para estes dois aparelhos. Não participam em cenários, grupos, reset ou atuação automática. Consulta geral/foco/15 s/reutilização de leitura recente/fila de 1,5 s/Retry-After partilhados. Popup individual consulta só o papel selecionado; popup da varanda inclui ambos e o sensor existente. Configurar/abrir/importar não atua. Potência e total usam normalizadores existentes, canal exato, sem zeros inventados. Offline, erro ou mais de 45 s retiram animação e halo; preservam valores conhecidos como Última leitura. Consumo não permite inferir fim de ciclo ou programa.

## Renders e prompt

Ferramenta imagegen incorporada. Recursos novos: assets/piso3-varanda-sem-planta-{day,electric,closed,night}-patch-v1.png. Cada um deriva do render original do respetivo ambiente. Usa-se apenas um recorte local x395,y1135,w150,h123 sobre a planta do canto inferior direito, preservando todo o resto, incluindo as plantas da esquerda e o recorte sem exaustor anterior. O recorte fica dentro das fontes, antes das máscaras de iluminação, pelo que acompanha a luz da varanda.

Prompt diurno:

> Edit target: supplied 816x1280 top-down apartment render. Remove ONLY the large leafy potted tree in the LOWER RIGHT corner of the BOTTOM balcony, approximately x420..514, y1148..1240. Preserve the plants at the LEFT of this balcony and every other plant throughout the home. Fill the removed foliage and pot footprint with the exact existing pale stone tiled balcony floor, continuing existing tile joints. Reveal and preserve the two existing appliances at the extreme right of this bottom balcony: a small square washing machine above, around x500..540,y1170..1215, and the round grey circular boiler appliance below around x500..540,y1219..1255. Keep those two objects in their existing positions and sizes; remove any leaves overlapping them. Do not add other furniture, labels, icons, decoration or objects. Preserve all balcony walls, railings, glazing and air conditioner. Preserve original daylight, exposure, shadows and colour without brightening the patch. Keep image framing, aspect ratio, camera and pixel registration exact. Only a tiny local crop of the lower-right balcony will be used; all remaining pixels must be unchanged. photorealistic-natural architectural edit.

Os outros prompts são idênticos, substituindo daylight por warm electric lighting (electric) ou dark night lighting (closed/night), e usando como alvo o render desse ambiente.

## Verificação

tests/balcony-appliances.test.cjs cobre configuração e backup antigos, remoções, validade, limiar 10/10,01 W, zero, negativo, dados ausentes, offline, falhas, expiração e consulta individual sem atuar. review/balcony-appliances-fixture.html usa exclusivamente IDs/chave fictícios e bloqueia todas as chamadas que não sejam leituras autorizadas da fixture. Revisão visual: planta removida, alinhamento de ambos os contornos, popups individuais e lista da varanda. Os 22 testes dirigidos de leituras, backups, fila e sintaxe passaram.
