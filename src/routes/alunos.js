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

     router.get("/:id", async (req, res) => {
        try {const { id } = req.params;

        if (!idValido(id)) {
            return res.status(400).json({mensagem: "ID inválido"
         });
        }
         const aluno = await colecaoAlunos().findOne({_id: new ObjectId(id)
        });

        if (!aluno) {
            return res.status(404).json({mensagem: "Aluno não encontrado"
            });
        }

        res.json(aluno);

    } catch (erro) {
        res.status(500).json({
            mensagem: "Erro ao buscar aluno",
            erro: erro.message
        });
    }
});

    router.get("/", async(req, res) => {
         try{const alunos = await colecaoAlunos()
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


    router.put("/:id", async (req, res) => {
        try {const { id } = req.params;
        const { nome, idade, email, curso, turma, telefone } = req.body;

        if (!idValido(id)) {
            return res.status(400).json({
                mensagem: "ID inválido"
            });
        }

        if (!nome || idade == undefined || !email || !curso) {
            return res.status(400).json({
                mensagem: "Nome, idade, email e curso são obrigatórios"
            });
        }

        const resultado = await colecaoAlunos().updateOne(
            { _id: new ObjectId(id) },
            { $set: {
                    nome,
                    idade: Number(idade),
                    email,
                    curso,
                    turma: turma || null,
                }
            }
        );

        if (resultado.matchedCount === 0) {
            return res.status(404).json({
                mensagem: "Aluno não encontrado"
            });
        }

        const alunoAtualizado = await colecaoAlunos().findOne({
            _id: new ObjectId(id)
        });

        res.json({mensagem: "Aluno atualizado com sucesso",
            aluno: alunoAtualizado
        });

    } catch (erro) {
        res.status(500).json({mensagem: "Erro ao atualizar aluno",
            erro: erro.message
        });
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

    router.delete("/:id", async (req, res) => {
        try {const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({mensagem: "ID inválido"
            });
        }

        const resultado = await colecaoAlunos().deleteOne({_id: new ObjectId(id)
        });

        if (resultado.deletedCount === 0) {
            return res.status(404).json({mensagem: "Aluno não encontrado"
            });
        }

        res.status(200).json({mensagem: "Aluno excluído com sucesso"
        });

    } catch (erro) {console.error(erro);

        res.status(500).json({mensagem: "Erro ao excluir aluno"
        });
    }
});

export default router;