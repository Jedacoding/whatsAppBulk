const readExcel = require("read-excel-file/node");

readExcel("./public/blast.xlsx").then(async (data) => {
    data.shift();

    console.log("--check excel sheet--");
    console.log(data);
});
