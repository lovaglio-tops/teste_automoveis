import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../src/repositories/clienteRepository.js", () => ({
    default: {
        criar: vi.fn(),
        editar: vi.fn(),
        deletar: vi.fn(),
        selecionar: vi.fn()
    }
}));

vi.mock("../../src/utils/consultarCep.js", () => ({
    consultarCep: vi.fn()
}));

import clienteController from "../../src/controllers/clienteController.js";
import clienteRepository from "../../src/repositories/clienteRepository.js";
import { consultarCep } from "../../src/utils/consultarCep.js";

const resposta = () => ({
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis()
});

const clienteValido = {
    nome: "Florisvaldo Junior",
    cpf: "1234567800",
    cep: "13185880",
    numero: 123,
    complemento: "Teste"
};

const cepValido = {
    cep: "13185880",
    logradouro: "Rua Teste",
    bairro: "Centro",
    cidade: "Sumaré",
    uf: "SP"
};

describe("Testes unitários - Clientes", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        consultarCep.mockResolvedValue(cepValido);
    });

    it("CT-001 - deve criar cliente com sucesso e retornar 201", async () => {
        clienteRepository.criar.mockResolvedValue({ insertId: 1 });
        const res = resposta();
        await clienteController.criar({ body: clienteValido }, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Cliente criado com sucesso" }));
    });

    it("CT-002 - deve listar clientes e retornar 200", async () => {
        clienteRepository.selecionar.mockResolvedValue([{ id: 1, nome: "Cliente" }]);
        const res = resposta();
        await clienteController.selecionar({}, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: expect.any(Array) }));
    });

    it("CT-003 - deve atualizar cliente e retornar 200", async () => {
        clienteRepository.editar.mockResolvedValue({ affectedRows: 1 });
        const res = resposta();
        await clienteController.atualizar({ query: { id: "1" }, body: clienteValido }, res);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it("CT-004 - deve excluir cliente e retornar 200", async () => {
        clienteRepository.deletar.mockResolvedValue({ affectedRows: 1 });
        const res = resposta();
        await clienteController.deletar({ params: { id: "1" } }, res);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it("CT-005 - deve rejeitar cliente sem nome com 400", async () => {
        const res = resposta();
        await clienteController.criar({ body: { ...clienteValido, nome: undefined } }, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it("CT-006 - deve rejeitar nome inválido com 400", async () => {
        const res = resposta();
        await clienteController.criar({ body: { ...clienteValido, nome: "AB" } }, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it("CT-007 - deve rejeitar cliente sem CPF com 400", async () => {
        const res = resposta();
        await clienteController.criar({ body: { ...clienteValido, cpf: undefined } }, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it("CT-008 - deve rejeitar CEP inválido com 400", async () => {
        consultarCep.mockRejectedValue(new Error("CEP inválido"));
        const res = resposta();
        await clienteController.criar({ body: { ...clienteValido, cep: "123" } }, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it("CT-009 - deve rejeitar CEP não encontrado com 400", async () => {
        consultarCep.mockRejectedValue(new Error("CEP não encontrado"));
        const res = resposta();
        await clienteController.criar({ body: clienteValido }, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it("CT-010 - deve impedir exclusão de cliente vinculado e retornar 400", async () => {
        const erro = new Error("Cannot delete or update a parent row");
        erro.code = "ER_ROW_IS_REFERENCED_2";
        clienteRepository.deletar.mockRejectedValue(erro);
        const res = resposta();
        await clienteController.deletar({ params: { id: "1" } }, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it("CT-031 - deve retornar 500 quando o repository falhar ao criar cliente", async () => {
        clienteRepository.criar.mockRejectedValue(new Error("Falha no banco"));
        const res = resposta();
        await clienteController.criar({ body: clienteValido }, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });

    it("CT-032 - deve retornar 500 quando o repository falhar ao listar clientes", async () => {
        clienteRepository.selecionar.mockRejectedValue(new Error("Falha no banco"));
        const res = resposta();
        await clienteController.selecionar({}, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });

    it("CT-033 - deve retornar 500 quando o repository falhar ao atualizar cliente", async () => {
        clienteRepository.editar.mockRejectedValue(new Error("Falha no banco"));
        const res = resposta();
        await clienteController.atualizar({ query: { id: "1" }, body: clienteValido }, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });
});
