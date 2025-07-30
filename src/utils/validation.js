export function isAnswerEmpty(response) {
  return Object.keys(response).length === 0;
}

// this goes in the backend. Note that some validation functions can be encapsulated and reutilized
export async function validateExerciseResponse(response, exerciseId) {

  // Check if this is a SetClassifierDND exercise
  if (response?.setClassifier) {
    const module = await import("../PlaceholderData/SetClassifierDNDAnswer.json");
    const answer = module.default;

    return (
      JSON.stringify(answer.ge10.sort()) === JSON.stringify(response.response.ge10.sort()) &&
      JSON.stringify(answer.le10.sort()) === JSON.stringify(response.response.le10.sort()) &&
      JSON.stringify(answer.nonCrystal.sort()) === JSON.stringify(response.response.nonCrystal.sort())
    );
  }

  // Check if this is a MultiSelect exercise
  if (response?.multiSelect) {
    const module = await import("../PlaceholderData/MultiSelectAnswer.json");
    const answer = response.id == "R" ? module.default.R : module.default.Q;

    return (
      JSON.stringify(answer.sort()) === JSON.stringify((response.response || []).sort())
    );
  }

  if (response?.vennDiagramDND) {
    const module = await import("../PlaceholderData/VennDiagramDND.json");
    const correct = module.default;

    const regions = Object.keys(correct);

    for (const region of regions) {
      const expected = (correct[region] || []).sort();
      const actual = (response.response[region] || []).sort();

      if (JSON.stringify(expected) !== JSON.stringify(actual)) {
        return false;
      }
    }

    // Check for unexpected regions (i.e. extra keys in the response)
    const extraKeys = Object.keys(response.response).filter(k => !regions.includes(k));
    if (extraKeys.length > 0) return false;

    return true;
  }

  if (response?.vennDiagramSelect){
    const module = await import("../PlaceholderData/VennDiagramSelect.json");
    const answerMap = module.default;

    console.log(exerciseId)

    const correct = (answerMap[exerciseId] || []).sort();
    const actual = (response.response || []).sort();

    return JSON.stringify(correct) === JSON.stringify(actual);
  }

  if (response?.freeResponse){
    console.log("validated here")
    const module = await import("../PlaceholderData/FreeResponse.json");
    const answer = module.default[exerciseId];
    console.log(answer)
    console.log(response.response)
    return response.response == answer
  }

  if (response?.coinSampleSpace) {

    console.log()

    const module = await import("../PlaceholderData/CoinSampleSpace.json");
    const correctAnswer = module.default[exerciseId]; 

    const userAnswer = response.response || [];

    const isCorrect =
      userAnswer.length === correctAnswer.length &&
      correctAnswer.every((val) => userAnswer.includes(val));

    return isCorrect;
  }

  if (response?.diceSampleSpace) {
    console.log("here")
    const module = await import("../PlaceholderData/DiceSampleSpace.json");
    const answerMap = module.default;

    const correct = (answerMap[exerciseId] || []).sort();
    const actual = (response.response || []).sort();

    return JSON.stringify(correct) === JSON.stringify(actual);
  }

  if (response?.vennCardinality) {
    const module = await import("../PlaceholderData/VennDiagramCardinality.json");
    const correctMap = module.default;

    const correct = correctMap[exerciseId] || {};
    const actual = response.response || {};

    const expectedKeys = Object.keys(correct);
    const actualKeys = Object.keys(actual);

    // Must have same keys
    if (expectedKeys.length !== actualKeys.length) return false;

    // Must have all expected keys with exact matching string values
    for (const key of expectedKeys) {
      if (!(key in actual)) return false;
      if (String(correct[key]) !== String(actual[key])) return false;
    }

    return true;
  }

  // Unknown or unsupported response format
  return false;
}
