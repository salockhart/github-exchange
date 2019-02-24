const express = require('express');
const router = express.Router();

const request = require('request');

const appsService = require('../services/apps.service');
const usersService = require('../services/users.service');
const tokenService = require('../services/token.service');

router.use((req, res, next) => {
  req.auth = {};

  if (req.headers.authorization) {
    const token = req.headers.authorization.slice(7);
    tokenService
      .verify(token)
      .then((payload) => {
        req.auth = payload;
        next();
      })
      .catch(() => res.sendStatus(403));
  } else {
    next();
  }
});

router.get('/', (req, res, next) => {
  const user_id = req.auth && req.auth.user_id;

  if (!user_id) {
    return res.sendStatus(403);
  }

  appsService
    .getAll(user_id)
    .then((apps) => res.send(apps || []));
});

router.get('/:client_id/token', (req, res, next) => {
  const { client_id } = req.params;
  const { code } = req.query;

  const user_id = req.auth && req.auth.user_id;

  if (!user_id) {
    return res.sendStatus(403);
  }

  if (!code) {
    return res.status(400).send('Missing code');
  }

  appsService
    .get(user_id, client_id)
    .then((client_secret) => new Promise((resolve, reject) => {
      request.get('https://github.com/login/oauth/access_token', {
        headers: {
          Accept: 'application/json'
        },
        qs: {
          client_id,
          client_secret,
          code
        }
      }, (err, response, body) => {
        if (err) {
          return reject(err);
        }

        if (response.statusCode >= 400) {
          return reject();
        }

        resolve(body);
      })
    }))
    .then((response) => {
      const tokenBody = JSON.parse(response);

      if (tokenBody.error) {
        return res.status(400).send(tokenBody);
      }

      return res.send(tokenBody);
    })
    .catch(() => res.sendStatus(400));
});

router.post('/', (req, res, next) => {
  const { client_id, client_secret } = req.body;

  const user_id = (req.auth && req.auth.user_id) || usersService.create();

  if (!client_id) {
    return res.status(400).send('Missing client_id');
  }

  if (!client_secret) {
    return res.status(400).send('Missing client_secret');
  }

  appsService
    .create(user_id, client_id, client_secret)
    .then(({ user_id }) => tokenService.sign({ user_id }))
    .then((token) => res.send({ token, client_id }))
    .catch((error) => res.status(400).send(error.message));
});

router.put('/:client_id', (req, res, next) => {
  const { client_id } = req.params;
  const { client_secret } = req.body;

  const user_id = req.auth && req.auth.user_id;

  if (!user_id) {
    return res.sendStatus(403);
  }

  if (!client_secret) {
    return res.status(400).send('Missing client_secret');
  }

  appsService
    .update(user_id, client_id, client_secret)
    .then(({ client_id }) => res.send({ client_id }))
    .catch((error) => res.status(404).send(error.message));
});

router.delete('/:client_id', (req, res, next) => {
  const { client_id } = req.params;

  const user_id = req.auth && req.auth.user_id;

  if (!user_id) {
    return res.sendStatus(403);
  }

  appsService
    .delete(user_id, client_id)
    .then(() => res.sendStatus(200))
    .catch((error) => res.status(404).send(error.message));
});

module.exports = router;
