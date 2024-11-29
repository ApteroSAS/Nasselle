import express from "express";
import {authenticate, AuthUserRequest} from "./ExpressAuthenticateMiddleWare.js";
import axios from "axios";
import {config} from "../EnvConfig.js";

export function routerProxyAPI(expressApp: express.Application) {
  let router = express.Router();

  /**
   * GET /available/:domain
   * Checks if a domain name is available.
   */
  router.get('/available/:domain', async (req, res) => {
    try {
      const response = await axios.get(config.MESH_ROUTER_BACKEND_URL + '/available/' + req.params.domain);
      res.status(response.status).json(response.data);
    } catch (error) {
      console.log(error);
      res.status(500).json({error: 'Internal server error'});
    }
  });

  /**
   * GET /domain/:userid
   * Retrieves the domain information for the specified user.
   */
  router.get('/domain/:userid', async (req, res) => {
    try {
      const response = await axios.get(
        config.MESH_ROUTER_BACKEND_URL + '/domain/' + req.params.userid,
        {
          headers: {
            'Authorization': `Bearer ${config.MESH_ROUTER_BACKEND_API_KEY};${req.params.userid}`
          }
        }
      );
      res.status(response.status).json(response.data);
    } catch (error) {
      console.log(error);
      res.status(500).json({error: 'Internal server error'});
    }
  });

  /**
   * POST /domain/:userid
   * Updates or sets the domain information for the specified user.
   * Requires authentication.
   */
  router.post('/domain', authenticate, async (req: AuthUserRequest, res) => {
    const uid = req.user.uid;
    try {
      const response = await axios.post(
        config.MESH_ROUTER_BACKEND_URL + '/domain',
        {...req.body,
        source: `${uid}@nasselle.com`},
        {
          headers: {
            'Authorization': `Bearer ${config.MESH_ROUTER_BACKEND_API_KEY};${uid}`
          }
        }
      );
      res.status(response.status).json(response.data);
    } catch (error) {
      console.log(error);
      res.status(500).json({error: 'Internal server error'});
    }
  });

  /**
   * DELETE /domain
   * Deletes the domain information for the authenticated user.
   * Requires authentication.
   */
  router.delete('/domain', authenticate, async (req: AuthUserRequest, res) => {
    const uid = req.user.uid;
    try {
      const response = await axios.delete(
        config.MESH_ROUTER_BACKEND_URL + '/domain',
        {
          headers: {
            'Authorization': `Bearer ${config.MESH_ROUTER_BACKEND_API_KEY};${uid}`
          }
        }
      );
      res.status(response.status).json(response.data);
    } catch (error) {
      console.log(error);
      res.status(500).json({error: 'Internal server error'});
    }
  });

  expressApp.use('/', router);
}