// pages/api/core/[[...path]].ts
import { NextApiRequest, NextApiResponse } from 'next';
import {coreApiHandler} from "dashboard-core/backend/CoreApiHandler";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return coreApiHandler(req, res);
}