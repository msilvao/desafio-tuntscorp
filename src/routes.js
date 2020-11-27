const express = require('express');
const routes = express.Router();

const index = require('./controllers/index');

routes.get('/run', index.handleGrades);

module.exports = routes;
