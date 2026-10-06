import app from "../../src/app";
import  request  from "supertest";
import {afterEach, beforeEach, describe, expect, it, vi} from  'vitest';

import { MontadoraFactory } from "../factories/montadoraFactory";
import { clearDatabase } from "./clearDatabase";

describe('API de montadoras', ()=>{
    beforeEach(async ()=>{
        await MontadoraFactory.create('Toyota', 'japão');

        vi.clearAllMocks();
    });

    afterEach(async()=>{
        await clearDatabase();

        vi.resetAllMocks();
    })
    
    
    it('deve criar uma montadoras com sucesso.', async ()=>{
        const response = await request(app)
        .post('/montadoras')
        .send({nome: 'Hyundai', pais: 'Coreia do Sul'});

        expect(response.status).toBe(201);
        expect(response.body.data).toHaveProperty('insertId');
    });
});