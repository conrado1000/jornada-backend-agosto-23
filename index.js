const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

// const url = "mongodb://localhost:27017";
// const url = "mongodb://127.0.0.1:27017";
const url = "mongodb://127.0.0.1:27017";
// const url = "mongodb+srv://admin:v8h7sjoNkQixeoNz@cluster0.xsfw5tb.mongodb.net";
const dbName = "jornada-backend-ago-23";
const client = new MongoClient(url);

async function main() {
  console.info("Conectando ao banco de dados...");
  await client.connect();
  console.info("Banco de dados conectado com sucesso!");

  const db = client.db(dbName);
  const collection = db.collection("herois");

  const app = express();

  // Habilitamos o processamento de JSON
  app.use(express.json());

  // Endpoint Principal
  app.get("/", function (req, res) {
    res.send("Hello World");
  });

  // Endpoint /oi
  app.get("/oi", function (req, res) {
    res.send("Olá, mundo!");
  });

  // Endpoints de Herois
  const lista = ["Mulher Maravilha", "Capitã Marvel", "Homem de Ferro"];
  //             0                    1                2

  // Read All -> [GET] /herois
  app.get("/herois", async function (req, res) {
    const itens = await collection.find().toArray();
    res.send(itens);
  });

  // Create -> [POST] /herois
  app.post("/herois", async function (req, res) {
    // console.log(req.body, typeof req.body);

    // Extrai o nome do Body da Request (Corpo da Requisição)
    const item = req.body;

    // Inserir o item na lista
    // lista.push(item);

    //Inserir o item na collection

    await collection.insertOne(item);

    // Enviamos uma resposta de sucesso
    res.send(item);
  });

  // Read By Id -> [GET] /herois/:id
  app.get("/herois/:id", async function (req, res) {
    // Pegamos o parâmetro de rota ID
    const id = req.params.id;

    // Pegamos a informação da lista
    const item =  await collection.findOne({
      _id: new ObjectId(id),
    });

    // Exibimos o item na resposta do endpoint
    res.send(item);
  });

  // Update -> [PUT] /herois/:id
  app.put("/herois/:id", function (req, res) {
    // Pegamos o parâmetro de rota ID
    const id = req.params.id;

    // Extrai o nome do Body da Request (Corpo da Requisição)
    const item = req.body;

collection.updateOne(
{_id: new ObjectId(id) },
{$set: item },

);

    // Atualizamos a informação na lista de registros
    lista[id] = item;

    res.send("Item editado com sucesso!");
  });

  // Delete -> [DELETE] /herois/:id
  app.delete("/herois/:id", async function (req, res) {
    // Pegamos o parâmetro de rota ID
    const id = req.params.id;

    // Excluir o item da lista
    delete lista[id];

    await collection.deleteOne({ _id: new ObjectId});
    res.send("Item excluído com sucesso!");
  });

  app.listen(process.env.Port || 3000);
}

main();