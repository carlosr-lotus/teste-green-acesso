import { Request, Response } from 'express';
import GenerateRelatorioToPdfService from '../services/PDFServices/GenerateBoletosToPdfService';

export const store = async (req: Request, res: Response) => {
  await GenerateRelatorioToPdfService(req, res);
}
  
