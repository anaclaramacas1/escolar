import express from "express";
import { ObjectId } from "mongodb";
import { colecaoAlunos } from "../db.js";

const router = express.Router();

// GET /alunos
router.get("/", async (req, res) => {
    try {
        const {
            nome,
            curso,
            turma,
            idadeMin,
            idadeMax,
            ativo,
            campos,
            ordenarPor,
            direcao,
            limite
        } = req.query;

        const filtro = {};

        // Filtro por nome usando regex
        if (nome) {
            filtro.nome = {
                $regex: nome,
                $options: "i"
            };
        }

        // Filtro por curso
        if (curso) {
            filtro.curso = curso;
        }

        // Filtro por turma
        if (turma) {
            filtro.turma = turma;
        }

        // Idade mínima
        if (idadeMin) {
            filtro.idade = {
                ...(filtro.idade || {}),
                $gte: Number(idadeMin)
            };
        }

        // Idade máxima
        if (idadeMax) {
            filtro.idade = {
                ...(filtro.idade || {}),
                $lte: Number(idadeMax)
            };
        }

        // Filtro por situação
        if (ativo !== undefined) {
            if (ativo === "true") {
                filtro.situacao = "ativo";
            }

            if (ativo === "false") {
                filtro.situacao = {
                    $ne: "ativo"
                };
            }
        }

        // Projeção dos campos
        let projection = undefined;

        if (campos) {
            projection = {
                _id: 0
            };

            campos.split(",").forEach((campo) => {
                projection[campo.trim()] = 1;
            });
        }

        // Consulta no MongoDB
        let consulta = (await colecaoAlunos()).find(filtro, {
            projection: projection
        });

        // Ordenação
        if (ordenarPor) {
            const ordem = direcao === "desc" ? -1 : 1;

            consulta = consulta.sort({
                [ordenarPor]: ordem
            });
        }

        // Limite
        if (limite) {
            const numeroLimite = Number(limite);

            if (
                Number.isInteger(numeroLimite) &&
                numeroLimite > 0
            ) {
                consulta = consulta.limit(numeroLimite);
            }
        }

        const alunos = await consulta.toArray();

        res.json(alunos);

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            mensagem: "Erro ao buscar alunos"
        });
    }
});


// GET /alunos/:id
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const alunos = await colecaoAlunos();

        const aluno = await alunos.findOne({
            _id: new ObjectId(id)
        });

        if (!aluno) {
            return res.status(404).json({
                mensagem: "Aluno não encontrado"
            });
        }

        res.json(aluno);

    } catch (erro) {
        res.status(400).json({
            mensagem: "ID inválido"
        });
    }
});


// POST /alunos
router.post("/", async (req, res) => {
    try {
        const {
            nome,
            idade,
            email,
            curso,
            turma,
            telefone
        } = req.body;

        if (!nome || !idade || !email || !curso) {
            return res.status(400).json({
                mensagem: "Nome, idade, email e curso são obrigatórios"
            });
        }

        const novoAluno = {
            nome,
            idade: Number(idade),
            email,
            curso,
            turma: turma || null,
            telefone: telefone || null,
            ativo: true,
            dataMatricula: new Date()
        };

        const alunos = await colecaoAlunos();

        const resultado = await alunos.insertOne(novoAluno);

        res.status(201).json({
            mensagem: "Aluno cadastrado com sucesso",
            aluno: {
                _id: resultado.insertedId,
                ...novoAluno
            }
        });

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            mensagem: "Erro ao cadastrar aluno"
        });
    }
});


// PUT /alunos/:id
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const dados = req.body;

        delete dados._id;

        const alunos = await colecaoAlunos();

        const resultado = await alunos.updateOne(
            {
                _id: new ObjectId(id)
            },
            {
                $set: dados
            }
        );

        if (resultado.matchedCount === 0) {
            return res.status(404).json({
                mensagem: "Aluno não encontrado"
            });
        }

        res.json({
            mensagem: "Aluno atualizado com sucesso"
        });

    } catch (erro) {
        console.error(erro);

        res.status(400).json({
            mensagem: "ID inválido"
        });
    }
});


// DELETE /alunos/:id
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const alunos = await colecaoAlunos();

        const resultado = await alunos.deleteOne({
            _id: new ObjectId(id)
        });

        if (resultado.deletedCount === 0) {
            return res.status(404).json({
                mensagem: "Aluno não encontrado"
            });
        }

        res.json({
            mensagem: "Aluno excluído com sucesso"
        });

    } catch (erro) {
        console.error(erro);

        res.status(400).json({
            mensagem: "ID inválido"
        });
    }
});


export default router;