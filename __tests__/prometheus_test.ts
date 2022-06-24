
import { server, start } from '../src/server'

import { expect } from './utils'

describe('Scraping Prometheus Metrics', () => {

  before(async () => {

    await start()

  })

  it('GET /metrics should provide the metrics', async () => {

    const response = await server.inject({
      method: 'GET',
      url: '/metrics'
    })

    expect(response.statusCode).to.be.equal(200)

  })

  it('GET /liveness should return success', async () => {

    const response = await server.inject({
      method: 'GET',
      url: '/liveness'
    })

    expect(response.statusCode).to.be.equal(200)

  })

  it('GET /readiness should return success', async () => {

    const response = await server.inject({
      method: 'GET',
      url: '/readiness'
    })

    expect(response.statusCode).to.be.equal(200)

  })

})
