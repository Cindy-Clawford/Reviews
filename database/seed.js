const {generate} = require('./dataGenerator.js');
const fs = require('fs');
const now = require('performance-now');

function seed() {

  var totalEntries = 10000000;
  var chunk = 100000;
  var runs = totalEntries / chunk;

  let writeStream = fs.createWriteStream('./database/data.txt');

  var data = [];
  var newWrite = true;


  for (var i = 0; i < runs; i++) {
    var t0 = now();
    var generatedChunk = generate(chunk);
    var t1 = now();
    console.log(`creating a chunk of size ${chunk} took ${t1 - t0} milliseconds.`);
    console.log(`${((i + 1) / runs) * 100}% completed`);

    if (newWrite) {
      writeStream.write("[");
      newWrite = false;
    } else {
      writeStream.write(",");
    }

    var stringifiedChunk = JSON.stringify(generatedChunk);
    writeStream.write(stringifiedChunk.slice(1, stringifiedChunk.length - 1));

  }

  writeStream.write("]");
  writeStream.end();
}

seed();