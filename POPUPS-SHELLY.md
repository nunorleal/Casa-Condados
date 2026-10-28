# Popups Shelly — 1.100

Apresentação partilhada em shelly-popup.css e shelly-popup.js, carregada depois da inicialização da app e antes dos indicadores offline. Estilo inspirado nos popups da aplicação original: fundo branco translúcido, cabeçalho, estado, ações circulares e cartões compactos de consumo. Inclui TV, termoventilador, desumidificador, máquinas, caldeira, carregador, contador, contactos e alarme. O popup dos estores mantém o layout específico da versão 1.099 e as divisões mantêm a lista compacta de equipamentos.

O adaptador move os próprios botões existentes, preservando listeners, IDs, acessibilidade, bloqueios e confirmação. Não contém transporte nem associações. Notas explicativas ficam em Informação do equipamento; estados, erros e avisos offline continuam visíveis. Mover pela casa permanece disponível nos equipamentos móveis.

TV continua exclusivamente de leitura, com os limiares existentes (>50 W ligada, 5..50 W regeneração, <5 W desligada). O cartão acumulado normaliza a energia da mesma resposta/canal já consultado, sem pedidos adicionais. Ausência/offline/erro preservam o total anterior como Última leitura; nunca criar zero. Não foi acrescentado botão de alimentação da TV.

Verificação: 19 testes passaram (tv, ui-syntax, offline, heater e dehumidifier). Fixtures review/shelly-popup-fixture.html e shelly-popup-heater-fixture.html usam apenas ID/chave fictícios, intercetam a rede e recusam atuações. Verificados visualmente TV, termoventilador ligado e offline, incluindo halo vermelho e botão bloqueado. Exemplo em review/popup-tv-1.100.png. Não foram usados equipamentos reais.

## Alimentação dos quatro equipamentos — 1.101

Por pedido explícito, TV, máquina de lavar loiça, máquina de lavar roupa e caldeira Bosch passam a ter um botão circular de alimentação como os equipamentos móveis. Esta instrução substitui a restrição anterior de apenas leitura para estes quatro relés. As associações ID/canal existentes são preservadas. Leitura de relays[channel]/switch:channel separada do consumo: verde só com ON booleano confirmado, cinzento OFF, âmbar desconhecido e desativado. Consumo/atividade não autoriza um comando. O botão corta/repõe alimentação elétrica; não representa comando remoto de um programa de lavagem ou do controlo da TV.

appliancePowerSnapshot/commandAppliance partilham fila, geração, prioridade, proteção de formulário em edição e confirmação limitada a três leituras do ID envolvido. Sem otimismo nem repetição automática de atuações; offline/erro/antigo/canal sem relé bloqueiam. Estados anteriores permanecem identificados. Configurar, abrir, consultar e importar não atuam. Os novos relés não participam em grupos/cenários/reset. Validar duplicados com todos os outros atuadores também no backup e transporte.

Testes appliance-power.test.cjs cobrem os quatro papéis, comando explícito, leitura independente da potência, ID único na confirmação, três verificações, ausência de retry, falha/offline/canal/antigo/inativo e duplicados. Fixture appliance-power-fixture.html interceta toda a rede e só permite ID/chave fictícios e atuação simulada. Verificação visual do botão verde, confirmação pendente sem alterar o estado e OFF após leitura. Nenhum equipamento real foi comandado.

## Dimensões compactas — 1.103

popup-compact.css reduz a largura máxima geral para360px e o espaço vertical, incluindo pré-visualizações e cartões. TV passa de cerca520×696 para360×500px, aproximadamente metade da área ocupada, sem escala CSS e mantendo botões principais44px. Estores/divisões/definições recebem as mesmas dimensões base com ajustes específicos. Texto legível, títulos longos com espaço para fechar e scroll em viewports pequenos. Verificação visual com fixtures fictícias da TV e estore; sem comandos reais. Captura review/popup-compacto-1.103.png.

## Divisões organizadas por tipo — 1.105

As linhas de todos os equipamentos existentes da divisão são mantidas e ordenadas pelo adaptador room-popup.js: atuadores com alimentação, estores, contactos de janelas/portas, restantes monitores. O botão de alimentação é direto na lista para TV, loiça, roupa, Bosch, termoventilador, desumidificador e armação do alarme, além da iluminação existente. Usa os snapshots e comandos individuais anteriores com os mesmos bloqueios e confirmação. Detalhes permanece acessível. Nenhuma associação nem comando de grupo novo.

O sensor da divisão surge no cabeçalho junto do título (sala, suite, varanda inferior ou garagem, quando associado), atualizado com os mesmos dados e indicadores de Última leitura. Não repetir a linha na lista. Mover portáteis continua a mudar a divisão em que aparecem.

Validação:32 testes passaram (inventário, nomes de divisões, sintaxe, alimentação dos aparelhos, portáteis e alarme). Fixture room-devices-sorted-fixture.html usa apenas IDs/chave e comandos fictícios, bloqueando toda a restante rede. Verificados sala e varanda, ordem, cabeçalho, botão com confirmação pendente e estado após leitura, sem atuar equipamentos reais. Captura review/divisao-ordenada-1.105.png.
