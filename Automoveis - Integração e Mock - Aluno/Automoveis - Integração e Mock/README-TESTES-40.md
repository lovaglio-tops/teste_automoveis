# 40 Testes Unitários - Automóveis

Foi adicionada a suíte `test/unitarios.test.js` mantendo o padrão Vitest usado na pasta `test`.

- 40 testes numerados CT-001 a CT-040.
- Casos de sucesso e erro.
- Verificação de HTTP 201, 200, 400, 404 e 500 quando aplicável.
- Mocks dos repositories e da consulta de CEP para os testes unitários.
- Validações dos modelos Cliente, Montadora e Veiculo.
- Controllers ajustados para retornar 400 em erros de validação e 404 quando um registro não é encontrado em atualização/exclusão de montadora.

Para executar:
1. `npm install`
2. `npm test`

A planilha `40-testes-unitarios-automoveis.xlsx` contém os mesmos 40 casos na estrutura da planilha original.
