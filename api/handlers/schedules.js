export const handler = async (event, context) => {
  console.log(event);
  return {
    statusCode: 200,
    body: JSON.stringify({message: "success"})
  }
}
