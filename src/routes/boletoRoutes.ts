import { Router } from "express";
import * as BoletosController from "../controllers/BoletosController";
import { upload } from "../middleware/upload";

const boletoRoutes = Router();

boletoRoutes.get('/boletos', BoletosController.index)

boletoRoutes.post('/import', upload.single('file'), BoletosController.store);

export default boletoRoutes;