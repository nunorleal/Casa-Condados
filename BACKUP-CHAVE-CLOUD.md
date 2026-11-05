# Chave Cloud protegida no JSON - 1.200

Guardar a chave neste dispositivo e independente da exportacao. Em Copia de seguranca, marcar Incluir chave Shelly Cloud encriptada neste JSON mostra dois campos para uma palavra-passe do backup com pelo menos 12 caracteres. A palavra-passe nao e a chave Shelly, nao fica no JSON nem no armazenamento e os campos sao limpos depois do uso. As outras preferencias continuam legiveis.

A encriptacao usa Web Crypto AES-GCM 256 bits, PBKDF2 SHA-256 com 600000 iteracoes, salt aleatorio de 16 bytes e IV aleatorio de 12 bytes. O servidor e autenticado como additionalData. Nenhuma chave fixa de cifra pertence ao codigo. Sem Web Crypto, falha sem exportar a chave em texto simples.

Importacao valida o envelope com limites fixos. Se escolher restaurar a chave, exige a palavra-passe e desencripta antes de qualquer gravacao. Palavra-passe errada, adulteracao ou cancelamento nao aplicam dados. Configuracao e credencial desencriptada sao gravadas com rollback antes de recarregar. O servidor da chave tem de corresponder ao da configuracao do proprio JSON. write recusa guardar envelopes cifrados como credenciais.

Backups antigos sem chave ou com chave legivel continuam validos. As copias antigas nao sao protegidas retroativamente: exportar uma nova copia cifrada. Sem a palavra-passe nao e possivel recuperar a chave dessa copia; e possivel importar as preferencias sem restaurar a chave e voltar a configura-la manualmente.

A chave usada pela app continua a seguir a opcao local Guardar neste dispositivo. Esta protecao abrange o JSON exportado, nao transforma o armazenamento local num cofre. Nao publicar backups com informacao privada. Nenhum segredo real faz parte de testes, fontes, capturas ou logs.

Validacao: 345 testes com valores ficticios; JSON exportado pela interface sem chave/palavra-passe em claro, desencriptacao e restauracao verificadas. Safari file:// confirmou secureContext, encriptacao e recuperacao. Documentacao: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/deriveKey e https://developer.mozilla.org/en-US/docs/Web/API/AesGcmParams .
