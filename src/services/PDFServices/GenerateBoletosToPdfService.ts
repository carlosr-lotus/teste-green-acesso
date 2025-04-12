import { Request, Response } from "express";
import fs from 'fs';
import path from 'path';
import Boletos from "../../models/boletos";
import { PDFDocument } from 'pdf-lib';

const GenerateRelatorioToPdfService = async(req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Error: No PDF file was detect.' });
    }

    const pdfBuffer = fs.readFileSync(req.file.path);
    const pdfDoc = await PDFDocument.load(pdfBuffer);

    const totalPages = pdfDoc.getPageCount();

    const ordemNomes = ['MARCIA', 'JOSE', 'MARCOS'];

    if (ordemNomes.length !== totalPages) {
      return res.status(400).json({ message: 'Number of pages dont match provided order.' });
    }

    const boletos = await Boletos.findAll();

    const outputDir = path.resolve(__dirname, '..', '..', '..', 'pdfs_generated');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    for (let i = 0; i < ordemNomes.length; i++) {
      const nome = ordemNomes[i];

      const novoPdf = await PDFDocument.create();
      const [copiedPage] = await novoPdf.copyPages(pdfDoc, [i]);
      novoPdf.addPage(copiedPage);

      const boleto = boletos.find((b) => b.nome_sacado.toUpperCase().includes(nome));
      if (!boleto) {
        console.warn(`No boleto found for: "${nome}"`);
        continue;
      }

      const pdfBytes = await novoPdf.save();
      const outputPath = path.join(outputDir, `${boleto.id}.pdf`);

      console.log(`Saving page for boleto ID ${boleto.id} in: ${outputPath}`);
      fs.writeFileSync(outputPath, pdfBytes);
    }

    return res.status(200).json({ message: 'PDFs saved successfully!' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro while processing PDF.' });
  }
};

export default GenerateRelatorioToPdfService;