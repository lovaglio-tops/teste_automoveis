# 40 testes unitários - Automóveis

Os 40 testes foram separados por tabela/recurso, mantendo a estrutura da pasta `test` do projeto original.

## Arquivos

- `test/clientes.test.js` — CT-001 a CT-010 e CT-031 a CT-033
- `test/montadoras.test.js` — CT-011 a CT-020 e CT-034 a CT-036
- `test/veiculos.test.js` — CT-021 a CT-030 e CT-037 a CT-040

## Códigos testados

- `201` — criação com sucesso
- `200` — consulta, atualização e exclusão com sucesso
- `400` — dados inválidos e violações de regra de negócio/chave estrangeira
- `404` — recurso inexistente
- `500` — erro interno/simulado do repository

## Execução

```bash
npm test
```

Arquivos individuais:

```bash
npx vitest run test/clientes.test.js
npx vitest run test/montadoras.test.js
npx vitest run test/veiculos.test.js
```
