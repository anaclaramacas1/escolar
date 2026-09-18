import express from "express";
import dotenv from "dotenv";
import { conectarBanco } from "./db.js";
import alunosRouter from "./routes/alunos.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {

    res.json({
        mensagem: "API de Gestão de Alunos"
    });

});

app.use("/alunos", alunosRouter);

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