const tf = require("@tensorflow/tfjs-node");
const InputError = require("../exceptions/InputError");

async function predictClassification(model, image) {
  try {
    const tensor = tf.node
      .decodeJpeg(image)
      .resizeNearestNeighbor([224, 224])
      .expandDims()
      .toFloat()

    const clasess = ['Cancer', "Non-cancer"];

    const predict = model.predict(tensor);
    const score = await predict.data();
    const confidenceScore = Math.max(...score) * 100;

    // const classResult = tf.argMax(predict, 1).dataSync()[0];
    // const label = clasess[classResult];
    let suggestion;
    let result;
    if(confidenceScore > 50 ){
      result = clasess[0];
      suggestion = "Segera periksa ke dokter!"
    } else  {
      result = clasess[1]
      suggestion = "Penyakit kanker tidak terdeteksi."
    }

    return {result, suggestion}
  } catch (error) {
    throw new InputError(`Terjadi kesalahan dalam melakukan prediksi`);
  }
}

module.exports = predictClassification