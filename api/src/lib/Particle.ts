import fetch from 'node-fetch'

interface ParticleRequest {
  deviceId: string
  duration: number
  startTemp: number
  endTemp: number
  startIntensity: number
  endIntensity: number
  totalDuration: number
}

class Particle {
  private apiKey: string

  constructor() {
    this.apiKey = process.env.PHOTON_API_KEY!
  }

  public async runAction(action: string, data: ParticleRequest) {
    if (action === 'TEMP_ANIMATE') {
      return this.animateTemp(data)
    }
    return Promise.reject(new Error('No such action type'))
  }

  public async animateTemp(data: ParticleRequest) {
    const {
      deviceId,
      duration,
      startTemp,
      endTemp,
      startIntensity,
      endIntensity,
      totalDuration,
    } = data

    const body = `args=1,${startTemp},${startIntensity},${endTemp},${endIntensity},${duration * 1000},${totalDuration * 1000}`

    return fetch(
      `https://api.particle.io/v1/devices/${deviceId}/animateLight`,
      {
        body,
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
      }
    )
      .then((response) => response.json())
      .catch((err) => err)
  }
}

export {
  Particle,
  ParticleRequest,
}
