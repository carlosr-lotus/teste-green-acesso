import { Request, Response } from "express";
import Boletos from "../../models/boletos";
import { Op } from "sequelize";
import PDFDocument from 'pdfkit';
import { PassThrough } from 'stream';

export const FetchBoletosServices = async(req: Request, res: Response) => {
  try {
    const { 
      nome, 
      valor_inicial, 
      valor_final, 
      id_lote, 
      relatorio 
    } = req.query;

    const whereClause: any = {};

    if (nome) {
      whereClause.nome_sacado = {
        [Op.iLike]: `%${nome}%`,
      };
    }

    if (valor_inicial || valor_final) {
      whereClause.valor = {};
      if (valor_inicial) whereClause.valor[Op.gte] = parseFloat(valor_inicial as string);
      if (valor_final) whereClause.valor[Op.lte] = parseFloat(valor_final as string);
    }

    if (id_lote) {
      whereClause.id_lote = parseInt(id_lote as string);
    }

    const boletos = await Boletos.findAll({ where: whereClause });

    if (relatorio && relatorio === '1') {
      const doc = new PDFDocument({ margin: 30, size: 'A4' });
      const stream = new PassThrough();
      const buffers: Buffer[] = [];

      doc.pipe(stream);

      const colX = {
        id: 30,
        nome_sacado: 70,
        id_lote: 250,
        valor: 310,
        linha_digitavel: 370,
      };

      const rowHeight = 20;
      let y = doc.y;

      doc.font('Helvetica-Bold').fontSize(10);
      doc.text('ID', colX.id, y);
      doc.text('Nome Sacado', colX.nome_sacado, y);
      doc.text('ID Lote', colX.id_lote, y);
      doc.text('Valor', colX.valor, y);
      doc.text('Linha Digitável', colX.linha_digitavel, y);

      y += rowHeight;

      doc.font('Helvetica').fontSize(10);
      for (const boleto of boletos) {
        doc.text(String(boleto.id), colX.id, y);
        doc.text(boleto.nome_sacado, colX.nome_sacado, y);
        doc.text(String(boleto.id_lote), colX.id_lote, y);
        doc.text(boleto.valor.toString(), colX.valor, y);
        doc.text(boleto.linha_digitavel, colX.linha_digitavel, y);
        y += rowHeight;
      }

      doc.end();

      stream.on('data', buffers.push.bind(buffers));
      stream.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        const base64 = pdfBuffer.toString('base64');
        return res.status(200).json({ base64 }); 
      });
    } else {
      return res.status(200).json(boletos);
    }
  } catch (err) {
    console.error('Error searching for boletos:', err);
    return { message: 'Error searching for boletos.' };
  }
}