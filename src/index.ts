import e from "express";
import routes from "./routes";
import { sequelize } from "./config/database";
import Lotes from "./models/lotes";

const app = e();
const PORT = 3000;

app.use(routes);

// app.get('/', (req, res) => {
//   res.status(200).send('Hello World in Green Acesso!');
// });

async function addBaseLotes() {
  const lotesExistentes = await Lotes.count();

  console.log("Checking if it's necessary to create default lotes...");
  if (lotesExistentes === 0) {
    await Lotes.bulkCreate([
      { id: 3, nome: '0017', ativo: true, criado_em: new Date() },
      { id: 6, nome: '0018', ativo: true, criado_em: new Date() },
      { id: 7, nome: '0019', ativo: true, criado_em: new Date() },
    ]);

    console.log('Table "lotes" is now populated with default lotes data.');
  } else {
    console.log('Table "lotes" has records already.');
  }
}

app.listen(PORT, async() => {
  try {
    // await sequelize.authenticate();
    await sequelize.sync();
    await addBaseLotes();

    console.log('Connected to database.');
  } catch(err) {
    console.error('Unable to connect to database: ' + err);
  }

  console.log(`Server running (port: ${PORT})`);
});
// CREATE TABLE lotes (
// 	id INT NOT NULL ...,
// 	nome VARCHAR(100),
// 	ativo BOOLEAN,
// 	criado_em TIMESTAMP ...
// );

// CREATE TABLE boletos (
// 	id INT NOT NULL ...,
// 	nome_sacado VARCHAR(255),
// 	id_lote INT NOT NULL // FOREIGN KEY com a tabela lotes,
// 	valor DECIMAL,
// 	linha_digitavel VARCHAR(255)
// 	ativo BOOLEAN,
// 	criado_em TIMESTAMP...
// );