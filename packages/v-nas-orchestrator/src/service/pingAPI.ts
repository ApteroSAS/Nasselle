import express from "express";

export function pingAPI(expressApp: express.Application) {
  let router = express.Router();

  router.post("/ping", async (req, res) => {
      res.json(req.body);
  });

  expressApp.use('/', router);
}