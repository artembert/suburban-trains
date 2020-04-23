import { Router } from "express";

export const getRouter: Router = Router();

getRouter.get(`/`, (req, res) => {
  res.send(`OK`);
});
