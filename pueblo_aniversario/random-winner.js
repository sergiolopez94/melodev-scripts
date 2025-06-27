function randomBoolean(probability = 0.7) {
  return Math.random() < probability;
}

const output = [
  {
    json: {
      winner: randomBoolean()
    }
  }
];

console.log(JSON.stringify(output, null, 2)); // Pretty-printed JSON
