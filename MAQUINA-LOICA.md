# Máquina de lavar loiça — 1.096

Associação pedida pelo utilizador: `dishwasherMeter`, ID e465b8b1526c, canal 0. Migração única `casa-leal-dishwasher-associated-v1` apenas preenche um campo ausente, preserva edições e remoção null. Mesma conta/fila Cloud, lotes deduplicados; nenhuma credencial ou outra associação foi copiada da casa original. Definições em Piso 3 / Cozinha; validação e backup mantêm o campo opcional e o marcador. Backups antigos da mesma conta conservam a associação atual.

Referências lidas, sem alterar: kitchen.js, kitchen.css e media-core.js do projeto original. Limiar original: consumo superior a 10 W = A trabalhar. Usa o mesmo símbolo SVG de máquina com linha ondulada animada, adaptado ao estilo desta aplicação. Halo no próprio bloco da bancada, não num banner flutuante. Apenas medições reais online, válidas e com menos de 45 s ativam o símbolo. Leituras inválidas, negativas, offline, em erro ou antigas suspendem halo e animação; os últimos valores conhecidos ficam identificados. Não se infere fim de ciclo, programa ou alimentação pelo consumo.

O módulo é só de leitura: não acrescenta comandos, não comuta a alimentação, não participa em cenários, grupos ou reposições. Popup individual e popup Cozinha usam o âmbito do equipamento/divisão e os temporizadores partilhados. Fechar o popup retoma o âmbito geral. Clique e teclado abrem detalhes; alvo de pelo menos 44 px; movimento reduzido mantém símbolo estático.

## Edição dos renders

Ferramenta incorporada imagegen. Recursos em assets/: piso3-sem-exaustor-patch-v1.png (dia), piso3-sem-exaustor-closed-patch-v1.png (escuro), piso3-sem-exaustor-night-patch-v1.png (noite com estores abertos), piso3-sem-exaustor-electric-patch-v1.png (luz elétrica). Não se aplicam filtros de cor artificiais: cada patch vem do respetivo render editado. Apenas a área local do exaustor (x190,y648,w59,h59 nas coordenadas da fotografia; versão elétrica deslocada em 9 px) é inserida nas fontes dos renders, antes das máscaras de iluminação existentes. Todos os restantes pixels e máscaras permanecem originais.

Prompt diurno usado:

> Edit target: the supplied top-down floorplan. Remove ONLY the small metallic extractor hood on the kitchen countertop, located x194..244,y660..700 in the 816x1280 reference. Infill its footprint with a perfectly continuous pale white-grey marble countertop matching immediately surrounding marble. The upper wall is preserved and the dark cabinet fascia below y707 is preserved. Do not add a sink, hob, appliances, icons or text. Keep exact camera, image proportions, house geometry and object locations. Preserve every other part of image unchanged. This will be used only as a tiny local crop patch around the removed hood, so retain precise pixel registration and original image framing. photorealistic-natural architectural edit.

Para os outros três ambientes usa-se o próprio render como alvo, retirando apenas o exaustor e preservando expressamente a exposição/temperatura de cor original. São inseridos apenas os mesmos recortes locais.

## Verificação

tests/dishwasher.test.cjs: fronteiras do limiar, consumo zero real, inválido/negativo, offline, erro imediatamente após leitura válida, expiração, conservação de energia e potência, âmbito exclusivo, configuração e backup. Só IDs/chave fictícios. review/dishwasher-fixture.html interceta todas as chamadas fetch e recusa qualquer atuação. A revisão global em review/tests-1.096.txt tem 165 testes aprovados e dois testes antigos de loiças de casa de banho incompatíveis com a remoção anterior desse check; nenhuma nova falha.

Prompt dos três restantes renders (kind = electric, closed ou night; shift = 9 para electric, 0 para os restantes):

> Edit target: supplied top-down house render. Remove ONLY the small metallic extractor hood at kitchen countertop x194..244,y{650+shift}..{700+shift} in 816x1280 reference. Infill countertop under the hood with the exact continuous pale marble visible immediately to either side. Restore small wall area behind the hood with the same wall surface as adjacent wall. Preserve existing countertop lighting under upper wall, shadows and cabinet fascia below y{707+shift}. CRITICAL: keep the original {warm electric-lit / dim night} exposure and colour on the marble and wall: do not brighten the patch or invent lights. Maintain original image proportions and pixel registration. Do not add any objects or appliances. All other objects, geometry, lighting and camera unchanged. Output full image framing; only a tiny local crop of the kitchen hood area will be used. photorealistic-natural architectural edit.
