const readExcel = require("read-excel-file/node");
require("dotenv").config();

readExcel("./public/" + process.env.BLAST_FILE_NAME).then(async (data) => {
    data.shift();

    console.log("--check excel sheet--");
    console.log(data.filter((item) => item[3]));
});
