import { Router } from "express";
import { getActiveSale } from "../services/sales/registry.js";

export const saleRouter: Router = Router();

saleRouter.get("/active", (_req, res) => {
  res.json([getActiveSale()]);
});
