import { Request, Response } from "express";
import { createReadStream } from "fs";
import csv from 'csv-parser';
import path from "path";
import Lotes from "../../models/lotes";
import Boletos from "../../models/boletos";
import { Op } from "sequelize";

// interface Request {
//   media: any;
// }

const ImportCsvToBoleto = async(req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file found.' });
  }

  const filePath = path.resolve(req.file.path);
  const results: any[] = [];

  createReadStream(filePath)
    .pipe(csv({ separator: ';'}))
    .on('data', (d) => results.push(d))
    .on('end', async() => {
      const boletosInseridos = [];
      for (const row of results) {
          const unidadeExterna = row.unidade.trim();

          const internalLote = await Lotes.findOne({
            where: {
              nome: {
                [Op.like]: `%${unidadeExterna}%`,
              },
              ativo: true
            },
          });

          if (!internalLote) {
            console.warn(`Lote not found for: ${unidadeExterna}`);
            continue;
          }

          const newBoleto = await Boletos.create({
            nome_sacado: row.nome,
            id_lote: internalLote.id,
            valor: parseFloat(row.valor),
            linha_digitavel: row.linha_digitavel,
            ativo: true,
            criado_em: new Date(),
            updatedAt: new Date()
          });

          boletosInseridos.push(newBoleto);
        }

      return res.status(200).json({ message: 'Succesfully uploaded CSV file.', data: { results }});
    })
    .on('error', (err) => {
      console.error('Error uploading CSV file: ', err);
      return res.status(500).json({ message: 'Error processing file.' });
    })
};

export default ImportCsvToBoleto;