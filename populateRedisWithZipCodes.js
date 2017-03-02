'use strict';

import * as redis from './lib/redisManager';
import path from 'path'
import csv from 'fast-csv';
import fs from 'fs';
const stream = fs.createReadStream(path.join(__dirname, 'zip_code_database.csv'));
const csvStream = csv()
  .on("data", function (data) {
    redis.setJson(data[0], data);
  })
  .on("end", async function () {
    console.log("import done");
    console.log(await redis.getJson('00544'));
  });
stream.pipe(csvStream);
