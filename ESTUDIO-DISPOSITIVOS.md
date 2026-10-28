# Equipamentos do estúdio — 1.112

Monitor Dell, Placa de Som Apollo Twin, Servidor Terramaster e Disco Rígido Backup2TB foram associados aos IDs fornecidos pelo utilizador, canal0 editável. studioBindings é independente de mediaBindings da sala e de todas as luzes/estores. Associação inicial só quando o campo está ausente, sem reintroduzir remoções explícitas.

Exibir apenas no popup Estúdio, piso4. Cada linha mostra consumo W/kWh, alimentação confirmada, botão de alimentação e roda dentada que foca o próprio ID. Nenhum novo desenho/ícone/botão/banner na planta. Aviso local para encerrar servidor/disco no sistema antes de desligar a alimentação.

Reutiliza a fila e conta Cloud, prioridade e três confirmações por leitura do ID envolvido, sem retry de atuações nem estados otimistas. Os watts não determinam o estado do relé nem a atividade operacional. Offline/erro/antigo conservam histórico identificado e bloqueiam atuação. Nenhum comando em associação/consulta/importação; excluir de grupos/cenários/reset.

26 testes passaram (estúdio/sala, sintaxe, backup e agendamento Cloud), exclusivamente com IDs/chave fictícios. Verificados visualmente os quatro equipamentos e foco do ID do servidor através da roda dentada, usando fixture que interceta toda a rede. Nenhum equipamento real foi comandado. Ver review/studio-devices-fixture.html e review/estudio-dispositivos-1.112.png.
