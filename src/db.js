import { MongoClient} from "mongodb";

const uri = process.env.MONGODB_URI;
const nomeBanco = process.env.DB_NAME || "gestao_escolar";

let banco;

export async function conectarBanco() {
    if (banco) {
        return banco;
    }
    
    const cliente = new MongoClient(uri);
    await cliente.connect();

    banco = cliente.db(nomeBanco);

    console.log(`MongoDB conectado ao banco: ${nomeBanco}`)

    return banco;
}

export function obterBanco(){
    if (!banco) {
        throw new Error("Banco de dados ainda não foi conectado")
    }
    return banco;
}