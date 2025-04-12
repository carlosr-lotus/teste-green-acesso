import { Router } from "express";
import * as PDFController from "../controllers/PDFController";
import { upload } from "../middleware/upload";

const pdfRoutes = Router();

pdfRoutes.post('/savePdfs', upload.single('file'), PDFController.store);

export default pdfRoutes;