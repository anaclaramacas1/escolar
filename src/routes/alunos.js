import express from "express";
import { ObjectId } from "mongodb";
import { obterBanco } from "../db.js";

const router = express.Router();

function colecaoAlunos(){
    return obterBanco().collection("alunos");
}

function idValido(id){
    return ObjectId.isValid(id);
}

router.post("/", async(req, res) => {
    try{
        const {nome, idade, email, curso, turma} = req.body;

        if (!nome || idade == undefined || !email || !curso) {
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
        situacao: "ativo",
        dataMatricula: new Date()
};


        const resultado =
        await colecaoAlunos().insertOne(novoAluno);

        res.status(201).json({
            mensagem: "Aluno cadastrado com sucesso",
            aluno: {
                _id: resultado.insertedId,
                ...novoAluno
            }
        });
    } catch(erro){
        res.status(500).json({
            mensagem: "Erro ao cadastrar aluno",
            erro: erro.message
        });
    }
});

router.get("/", async(req, res) => {
    try{
        const alunos = await colecaoAlunos()
        .find()
        .toArray();
        res.json(alunos);

    }catch(erro){
        res.status(500).json({
            mensagem: "Erro ao listar alunos",
            erro: erro.message
        })

    }
});

router.get("/ordenados/idade", async (req, res) => {

    try {
        const ordem = req.query.ordem === "desc" ? -1 : 1;

        const alunos = await colecaoAlunos()
        .find()
        .sort({idade: ordem})
        .toArray();

        res.json(alunos);
    }catch (erro) {
        res.status(500).json({
            mensagem: "Erro ao ordenar alunos",
            erro: erro.message
        });
    }
});




router.get("/limite/:quantidade", async (req, res) => {

  try {
    const quantidade = Number(req.params.quantidade);

    if (!Number.isInteger(quantidade) || quantidade <= 0) {
      return res.status(400).json({
        mensagem: "Informe uma quantidade inteira maior que zero"
      });
        }

      const alunos = await colecaoAlunos()
      .find()
      .limit(quantidade)
      .toArray();

      res.json(alunos);
      
  } catch (erro) {
    res.status(500).json({
      mensagem: "Erro ao limitar resultados",
      erro: erro.message
    });
    
  }
});


export default router;