import express from "express";
import dotenv from "dotenv";
import { conectarBanco } from "./db.js";
import alunosRouter from "./routes/alunos.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;


// Permite receber JSON
app.use(express.json());


// Rota inicial
app.get("/", (req, res) => {

    res.json({
        mensagem: "API de Gestão de Alunos"
    });

});


// Rotas dos alunos
app.use("/alunos", alunosRouter);


// Iniciar servidor
async function iniciarServidor() {

    try {

        await conectarBanco();

        app.listen(PORT, () => {

            console.log(`Servidor rodando em http://localhost:${PORT}`);

        });

    } catch (erro) {

        console.error("Erro ao iniciar servidor:", erro);

    }
}


iniciarServidor();