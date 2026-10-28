# Offline — 1.098

connectionState(scope) usa apenas online booleano ou numérico 0/1 recebido de um dispositivo presente na resposta Cloud. Não interpreta relé OFF, watts zero, ausência de dispositivo, flags desconhecidas, erros de transporte ou leitura antiga como uma nova confirmação de offline. Conserva o último estado de ligação confirmado durante falhas; nova resposta substitui-o. Mudar de configuração limpa o registo. Dados expostos: configurado, offline, contagem e quantidade com estado conhecido; sem IDs ou credenciais.

offline.js é estritamente visual, sem pedidos ou comandos. Marca ícones, banners e cabeçalhos/linhas dos popups, incluindo luzes, estores/contactos, portas, sensores, consumos, alarme e aparelhos. Resumo no topo conta dispositivos distintos offline e desaparece ao recuperar. É ocultado na MeteoNL. Um contacto e um estore na mesma janela partilham o indicador visual; os respetivos estados continuam separados nas linhas do popup.

Termoventilador e desumidificador mostram explicitamente Offline e halo vermelho no render do aparelho e na pré-visualização. Recuperação retira a marca e devolve o halo de alimentação confirmado. Não substitui os estados por OFF nem altera a iluminação ou a posição dos aparelhos. Valores conhecidos permanecem Última leitura e as guardas de comando existentes continuam a bloquear atuações sem estado online recente.

Os SVG usam um sinal de Wi-Fi cortado de tamanho estável durante zoom; HTML usa o mesmo sinal com texto Offline e nome acessível. Os indicadores não capturam cliques nem alteram arrastamento, configurações ou backups. Nenhuma preferência nova.

Ver tests/offline.test.cjs: OFF/zero, erro de rede, stale, ausente, online omitido/inválido, 0/false vs 1/true, consultas parciais independentes, recuperação e reconfiguração. review/offline-fixture.html interceta todas as chamadas, aceita só IDs e chave fictícios e recusa qualquer atuação. Verificações visuais de halo vermelho, sinal, recuperação verde, relé OFF sem offline e consumos anteriores preservados; zero comandos reais.
