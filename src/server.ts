
require('dotenv').config()

import { Server } from '@hapi/hapi'

import { HealthPlugin } from 'hapi-k8s-health'

import { log } from './log'

import { join } from 'path'

const Joi = require('joi')

const Inert = require('@hapi/inert');

const Vision = require('@hapi/vision');

const HapiSwagger = require('hapi-swagger');

const Pack = require('../package');

import { load } from './server/handlers'

const handlers = load(join(__dirname, './server/handlers'))

export const server = new Server({
  host: process.env.HOST || "0.0.0.0",
  port: process.env.PORT || 8000,
  routes: {
    cors: true,
    validate: {
      options: {
        stripUnknown: true
      }
    }
  }
});

server.route({
  method: 'GET',
  path: '/api/v0/status',
  handler: handlers.Status.index,
  options: {
    description: 'Simply check to see that the server is online and responding',
    tags: ['api', 'system'],
    response: {
      failAction: 'log',
      schema: Joi.object({
        status: Joi.string().valid('OK', 'ERROR').required(),
        error: Joi.string().optional()
      }).label('ServerStatus')
    }
  }
})

const swaggerOptions = {
  info: {
    title: 'API Docs',
    version: Pack.version,
    description: 'Developer API Documentation \n\n *** DEVELOPERS *** \n\n Edit this file under `swaggerOptions` in `src/server.ts` to better describe your service.'
  },
  schemes: ['https'],
  host: 'http://localhost:8000',
  documentationPath: '/',
  grouping: 'tags'
}

var started = false

export async function start() {

  if (started) return;

  started = true

  await server.register([
      Inert,
      Vision,
      {
        plugin: HapiSwagger,
        options: swaggerOptions
      },
      {
        plugin: HealthPlugin
      }
  ]);

  await server.start();

  log.info(server.info)

}

if (require.main === module) {

  start()

}
