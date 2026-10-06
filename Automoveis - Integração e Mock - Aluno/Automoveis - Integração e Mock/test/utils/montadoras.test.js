import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../src/repositories/montadoraRepository.js", () => ({
    default: {
        criar: vi.fn(),
        editar: vi.fn(),
        deletar: vi.fn(),
        selecionar: vi.fn()
    }
}));

import montadoraController from "../../src/controllers/montadoraController.js";
import montadoraRepository from "../../src/repositories/montadoraRepository.js";

const resposta = () => ({
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis()
});

const montadoraValida = {
    nome: "Toyota",
    pais: "Japão"
};

describe("Testes unitários - Montadoras", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("CT-011 - deve criar montadora e retornar 201", async () => {
        montadoraRepository.criar.mockResolvedValue({ insertId: 1 });
        const res = resposta();
        await montadoraController.criar({ body: montadoraValida }, res);
        expect(res.status).toHaveBeenCalledWith(201);
    });

    it("CT-012 - deve listar montadoras e retornar 200", async () => {
        montadoraRepository.selecionar.mockResolvedValue([{ id: 1, nome: "Toyota" }]);
        const res = resposta();
        await montadoraController.selecionar({}, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: expect.any(Array) }));
    });

    it("CT-013 - deve atualizar montadora e retornar 200", async () => {
        montadoraRepository.editar.mockResolvedValue({ affectedRows: 1 });
        const res = resposta();
        await montadoraController.atualizar({ query: { id: "1" }, body: montadoraValida }, res);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it("CT-014 - deve excluir montadora e retornar 200", async () => {
        montadoraRepository.deletar.mockResolvedValue({ affectedRows: 1 });
        const res = resposta();
        await montadoraController.deletar({ params: { id: "1" } }, res);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it("CT-015 - deve rejeitar montadora sem nome com 400", async () => {
        const res = resposta();
        await montadoraController.criar({ body: { pais: "Brasil" } }, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it("CT-016 - deve rejeitar nome de montadora inválido com 400", async () => {
        const res = resposta();
        await montadoraController.criar({ body: { nome: "AB", pais: "Brasil" } }, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it("CT-017 - deve rejeitar montadora sem país com 400", async () => {
        const res = resposta();
        await montadoraController.criar({ body: { nome: "Toyota" } }, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it("CT-018 - deve rejeitar país inválido com 400", async () => {
        const res = resposta();
        await montadoraController.criar({ body: { nome: "Toyota", pais: "A" } }, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it("CT-019 - deve retornar 404 ao atualizar montadora inexistente", async () => {
        montadoraRepository.editar.mockResolvedValue({ affectedRows: 0 });
        const res = resposta();
        await montadoraController.atualizar({ query: { id: "999" }, body: montadoraValida }, res);
        expect(res.status).toHaveBeenCalledWith(404);
    });

    it("CT-020 - deve impedir exclusão de montadora vinculada e retornar 400", async () => {
        const erro = new Error("Cannot delete or update a parent row");
        erro.code = "ER_ROW_IS_REFERENCED_2";
        montadoraRepository.deletar.mockRejectedValue(erro);
        const res = resposta();
        await montadoraController.deletar({ params: { id: "1" } }, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it("CT-034 - deve retornar 404 ao excluir montadora inexistente", async () => {
        montadoraRepository.deletar.mockResolvedValue({ affectedRows: 0 });
        const res = resposta();
        await montadoraController.deletar({ params: { id: "999" } }, res);
        expect(res.status).toHaveBeenCalledWith(404);
    });

    it("CT-035 - deve retornar 500 quando repository falhar ao criar", async () => {
        montadoraRepository.criar.mockRejectedValue(new Error("Falha no banco"));
        const res = resposta();
        await montadoraController.criar({ body: montadoraValida }, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });

    it("CT-036 - deve retornar 500 quando repository falhar ao listar", async () => {
        montadoraRepository.selecionar.mockRejectedValue(new Error("Falha no banco"));
        const res = resposta();
        await montadoraController.selecionar({}, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });
});
