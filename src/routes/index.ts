import { Router } from "express";

import boletoRoutes from "./boletoRoutes";
import pdfRoutes from "./PDFRoutes";

const routes = Router();

routes.use(boletoRoutes);
routes.use(pdfRoutes);

export default routes;
