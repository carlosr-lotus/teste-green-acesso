import { Request, Response } from "express";
import ImportCsvToBoleto from "../services/BoletoServices/ImportCSVToBoleto";
import { FetchBoletosServices } from "../services/BoletoServices/FetchBoletosService";

export const index = async (req: Request, res: Response) => {
  const boletos = await FetchBoletosServices(req, res); 

  // return boletos;
};

export const store = async(req: Request, res: Response) => {
  const response = await ImportCsvToBoleto(req, res);

  // return response;
};
