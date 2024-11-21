const {Firestore} = require("@google-cloud/firestore");
const InputError = require("../exceptions/InputError");

async function getData(collection) {
  try {
    const db = new Firestore({projectId: "submissionmlgc-rifkifiransah"});
  
    const predictions = await db.collection(collection).get();

    if (predictions.empty) {
      console.log("No matching documents.");
      return [];
    }

    const data = [];
    predictions.forEach((doc) => {
      data.push({ id: doc.id, "history": {...doc.data()} });
    });

    return data;
  } catch (error) {
    throw new InputError("Failed to retrieve data");
  }
}

module.exports = getData;