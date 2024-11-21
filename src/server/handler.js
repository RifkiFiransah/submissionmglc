const getData = require("../services/getData");
const postPredictClassification = require("../services/inference");
const storeData = require("../services/storeData");
const crypto = require("crypto");

async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;

  const { result, suggestion } = await postPredictClassification(model, image);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const data = {
    id,
    "result": result,
    suggestion,
    createdAt
  }

  await storeData(id, data);

  const response = h.response({
    status: "success",
    message: "Model is predicted successfully",
    "data": data
  });

  response.code(201)
  return response;
}

async function getAllPredictHandler(request, h) {
  const data = await getData("predictions");

  const response = h.response({
    status: "success",
    "data": data
  });

  response.code(200);
  return response;
}

module.exports = {postPredictHandler, getAllPredictHandler};