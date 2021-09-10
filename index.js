const csv = require("csv-parser");
const fs = require("fs");
const stockData = [];
const CMF = [];
const MFVArray = [];
const VArray = [];
let MFVSum = 0;
let VSum = 0;

fs.createReadStream("RELIANCE.NS.csv")
  .pipe(csv())
  .on("data", (data) => stockData.push(data))
  .on("end", () => {
    stockData.map((e) => {
      const MFM = (e.Close - e.Low - (e.High - e.Close)) / (e.High - e.Low);

      const MFV = MFM * e.Volume;
      MFVArray.push(MFV);
      VArray.push(parseInt(e.Volume));
    });
    for (let i = 1; i <= stockData.length; i++) {
      if (i % 21 === 0) {
        CMF.push(MFVSum / VSum);
        MFVSum = 0;
        VSum = 0;
        continue;
      }

      MFVSum = MFVSum + MFVArray[i];
      VSum = VSum + VArray[i];
    }

    console.log(
      "----THE CHAIKIN MONEY FLOW VALUES OF RELIANCE FROM 06/07/2020 TO 06/07/2021----"
    );
    CMF.forEach((e) => {
      console.table({ CMF: e });
    });
  });
