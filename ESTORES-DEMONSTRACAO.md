# Estores de demonstração — 1.111

Sala direita segue sala esquerda; WC suite segue cozinha; biblioteca segue quarto do Gui; ambos os estores do sótão seguem sala esquerda. Apenas destinos sem Shelly associado participam. O seguimento lê a posição reportada, não envia comandos a destinos nem origens. As relações não ligam equipamentos físicos.

Uma alteração manual local permanece até a próxima mudança de posição válida da origem. Consultas repetidas sem mudança não desfazem a escolha. Pode retomar imediatamente no popup com Voltar a seguir o estore de origem. Recarregar/repor demonstração retoma seguimento; não foi acrescentado formato de backup. Estados/percentagens da origem inválidos, antigos ou offline conservam o último valor visual conhecido. Equipamentos reais continuam independentes.

A posição efetiva alimenta a planta, iluminação, barras, banners e controlos. O popup inclui consultas da origem na fila comum para manter atualizado o seguimento, sem atuar nem copiar IDs.

24 testes passaram: lógica de seguimento, confirmação/segurança Cloud, agendamento/âmbito de popups e sintaxe. A fixture blind-demo-follow-fixture.html usa apenas origem/ID/chave fictícios e recusa todas as atuações. Verificado visualmente 40% da origem copiados, alteração manual100% e retoma40% pelo botão. Nenhum movimento real foi executado. Captura review/estore-seguidor-manual-1.111.png.
