import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const cliente = new MongoClient(process.env.MONGODB_URI);

const nomeBanco = process.env.DB_NAME || "gestao_escolar";

let banco;

export async function conectarBanco() {

    if (!banco) {

        await cliente.connect();

        banco = cliente.db(nomeBanco);

        console.log("MongoDB conectado!");

    }

    return banco;
}


export async function colecaoAlunos() {

    const db = await conectarBanco();

    return db.collection("alunos");
}