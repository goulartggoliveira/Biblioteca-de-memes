import  express  from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

//CRIAÇÃO DO SERVIDOR
const app = express();

// CONFIGURAÇÕES
app.use(express.json())
app.use(cors())
dotenv.config()

//SETUP DO BANCO DE DADOS
let db
const mongoClient = new MongoClient(process.env.DATABASE_URL)
mongoClient.connect()
    .then(() => mongoClient.db())
    .catch((error) => console.log("servidor não conectado: DEU RUIM!!"))

// CRIAÇÃO DOS ENDPOINTS

//CRIAÇÃO DO GET
app.get('/memes', (req, res) => {
    db.collection("memes").find().toArray()
        .then((memes) => res.send(memes))
        .catch((err) => res.status(500).send(err.message));
})

//CRIAÇÃO DO POST
app.post("/memes", (req, res) => {
    const { description, image, category } = req.body;
    if (!description || !image || !category){
        return res.status(422).send("Todos os campos são obrigatórios")
    }

    const newMeme = { description, image, category}
    db.collection("memes").insertOne(newMeme)
        .then(() => res.status(200).send("Meme enviado"))
        .catch((err) => res.status(500).send(err.message))

})


//PORTA ONDE O SERVIDOR IRÁ RODAR
const PORT = 5000
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));