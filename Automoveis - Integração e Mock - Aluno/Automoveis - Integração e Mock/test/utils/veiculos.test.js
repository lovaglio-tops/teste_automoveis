import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../src/repositories/veiculoRepository.js", () => ({
    default: {
        criar: vi.fn(),
        editar: vi.fn(),
        deletar: vi.fn(),
        selecionar: vi.fn()
    }
}));

import veiculoController from "../../src/controllers/veiculoController.js";
import veiculoRepository from "../../src/repositories/veiculoRepository.js";

const resposta = () => ({
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis()
});

const veiculoValido = {
    idMontadora: 1,
    idCliente: 1,
    modelo: "Corolla",
    placa: "ABC1234",
    ano: 2025,
    cor: "Prata",
    valor: 120000
};

describe("Testes unitários - Veículos", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("CT-021 - deve criar veículo e retornar 201", async () => {
        veiculoRepository.criar.mockResolvedValue({ insertId: 1 });
        const res = resposta();
        await veiculoController.criar({ body: veiculoValido }, res);
        expect(res.status).toHaveBeenCalledWith(201);
    });

    it("CT-022 - deve listar veículos e retornar 200", async () => {
        veiculoRepository.selecionar.mockResolvedValue([{ id: 1, modelo: "Corolla" }]);
        const res = resposta();
        await veiculoController.selecionar({}, res);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it("CT-023 - deve atualizar veículo e retornar 200", async () => {
        veiculoRepository.editar.mockResolvedValue({ affectedRows: 1 });
        const res = resposta();
        await veiculoController.atualizar({ query: { id: "1" }, body: veiculoValido }, res);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it("CT-024 - deve excluir veículo e retornar 200", async () => {
        veiculoRepository.deletar.mockResolvedValue({ affectedRows: 1 });
        const res = resposta();
        await veiculoController.deletar({ params: { id: "1" } }, res);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it("CT-025 - deve rejeitar veículo sem montadora com 400", async () => {
        const res = resposta();
        await veiculoController.criar({ body: { ...veiculoValido, idMontadora: undefined } }, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it("CT-026 - deve rejeitar veículo sem cliente com 400", async () => {
        const res = resposta();
        await veiculoController.criar({ body: { ...veiculoValido, idCliente: undefined } }, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it("CT-027 - deve rejeitar modelo inválido com 400", async () => {
        const res = resposta();
        await veiculoController.criar({ body: { ...veiculoValido, modelo: "A" } }, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it("CT-028 - deve rejeitar ano inválido com 400", async () => {
        const res = resposta();
        await veiculoController.criar({ body: { ...veiculoValido, ano: 1800 } }, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it("CT-029 - deve rejeitar valor inválido com 400", async () => {
        const res = resposta();
        await veiculoController.criar({ body: { ...veiculoValido, valor: 0 } }, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it("CT-030 - deve rejeitar montadora inexistente por chave estrangeira com 400", async () => {
        const erro = new Error("Cannot add or update a child row");
        erro.code = "ER_NO_REFERENCED_ROW_2";
        veiculoRepository.criar.mockRejectedValue(erro);
        const res = resposta();
        await veiculoController.criar({ body: { ...veiculoValido, idMontadora: 9999 } }, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });


    it("CT-039 - deve retornar 500 quando repository falhar ao atualizar veículo", async () => {
        veiculoRepository.editar.mockRejectedValue(new Error("Falha no banco"));
        const res = resposta();
        await veiculoController.atualizar({ query: { id: "1" }, body: veiculoValido }, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });

    it("CT-040 - deve retornar 500 quando repository falhar ao listar veículos", async () => {
        veiculoRepository.selecionar.mockRejectedValue(new Error("Falha no banco"));
        const res = resposta();
        await veiculoController.selecionar({}, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });
});
