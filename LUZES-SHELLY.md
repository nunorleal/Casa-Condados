# Luzes reais — 1.084

As associações `lights` guardadas passam a participar nas consultas e comandos reais. Mantêm-se os três IDs fornecidos para sala, quarto do Gui e suite, sem substituir edições ou voltar a executar a migração. Restantes divisões sem associação continuam em demonstração.

`light-core.js` normaliza Gen1 lights/relays e Gen2 light:n/switch:n no canal exato. Se apenas uma família existe nesse canal, usa essa família; se ambas existem, respeita a preferência. Não tenta endpoints por atuação nem altera associações para descobrir a saída. Dados online 1/true, booleano explícito e frescura de 45 segundos são obrigatórios. Erros/ausência/canal errado bloqueiam comandos. Não inferir estado pela potência.

`cloud-read-core.js` usa transporte/fila/conta/geração existentes: prioridade do utilizador, cancelamento só de leituras, sem repetição de atuações. Comando explícito on=true/false; aceitação HTTP não muda a planta. Confirma apenas IDs envolvidos, até três verificações (1,5/4/10 s), prazo de 30 s. Popup foca também a luz da divisão; leituras recentes mantêm o botão disponível durante consultas de fundo. Falhas preservam o último booleano para o render, com estado por confirmar e indicação Última leitura no popup.

`home.js` compõe estados reais sobre a simulação sem gravá-los como estados de demonstração. Reset não envia comandos nem substitui estados reais. Ligar/Apagar todas envia comandos individuais às luzes associadas disponíveis e simula as restantes, apresentando contagens e conservando estados até confirmação. Portas, estores, EV e alarme não integram o grupo de luzes.

Verificação: `node --test dist/tests/*.test.cjs` (140 testes). `tests/light-control.test.cjs` usa exclusivamente IDs/chave fictícios e fetch simulado. `review/lights-fixture.html` interceta toda a rede; aceita apenas os três IDs fictícios e comandos light explícitos. Modos `?mode=hold` e `?mode=offline` permitem simular ausência de confirmação/offline. Preserva/restaura armazenamento no pagehide, não usar junto da app de produção na mesma origem. Prova visual em `review/lights-real-control-1.084.png`. Nenhum comando em equipamentos reais foi executado durante os testes.
