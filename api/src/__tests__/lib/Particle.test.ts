import _fetch from 'node-fetch'

const fetchMock = jest.fn()
jest.mock('node-fetch', () => fetchMock)

import { Particle, ParticleRequest } from '../../lib/Particle'

describe('Lib: Particle', () => {
  const animateData: ParticleRequest = {
    deviceId: 'test',
    duration: 1800,
    endIntensity: 0.10,
    endTemp: 2000,
    startIntensity: 0.01,
    startTemp: 1000,
    totalDuration: 2500,
  }

  test('Can construct a class', () => {
    const service = new Particle()
    expect(service).toBeInstanceOf(Particle)
  })

  test('runAction: runs TEMP_ANIMATE', async () => {
    const animateTempMock = jest.fn()
    const service = new Particle()
    service.animateTemp = animateTempMock

    return service.runAction('TEMP_ANIMATE', animateData)
      .then(() => {
        expect(animateTempMock).toHaveBeenCalledTimes(1)
        expect(animateTempMock).toHaveBeenCalledWith(animateData)
      })
  })

  test('runAction: fails on bad action', async () => {
    const service = new Particle()

    return expect(service.runAction('NotARealActionBro', animateData))
      .rejects.toEqual(new Error('No such action type'))
  })

  test('animateTemp: makes a call out', async () => {
    const service = new Particle()

    fetchMock.mockResolvedValue(true)

    return service.animateTemp(animateData)
      .then(() => {
        expect(fetchMock).toHaveBeenCalledTimes(1)
        expect(fetchMock).toHaveBeenCalledWith(
          `https://api.particle.io/v1/devices/${animateData.deviceId}/animateLight`,
          {
            body: expect.any(String),
            headers: expect.objectContaining({
              Authorization: expect.any(String),
            }),
            method: 'POST',
          }
        )
      })
  })

  test('animateTemp: fails somewhat gracefully and silently', async () => {
    const service = new Particle()

    fetchMock.mockRejectedValue('errrrrrrrrr')

    return expect(service.animateTemp(animateData))
      .resolves.toEqual('errrrrrrrrr')
  })
})
