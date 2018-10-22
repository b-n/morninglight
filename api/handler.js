import fetch from 'node-fetch';

const animate = async (event, context) => {

  const apiKey = process.env.PHOTON_API_KEY;
  const {
    deviceId,
    duration,
    startTemp,
    endTemp,
    startIntensity,
    endIntensity,
    overallDuration
  } = JSON.parse(event.body);

  return fetch(
    `https://api.particle.io/v1/devices/${deviceId}/animateLight`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `args=${startTemp},${startIntensity},${endTemp},${endIntensity},${duration*1000},${overallDuration*1000}`
    }
  )
  .then(response => response.json())
  .then(response => {
    console.log(response);
    return {
      statusCode: 200,
      body: JSON.stringify(response)
    }
  });
};

export { animate };
