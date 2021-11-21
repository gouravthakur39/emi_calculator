require('dotenv').config()
const express = require("express");
const app = express();
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const db = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

app.use(cors());

app.use(bodyParser.json());

app.post("/api/insert", (req, res) => {
  console.log("body", JSON.stringify(req.body.amortDataJSON));
  const {
    pAmount,
    interest,
    duration,
    emi,
    TotalAmountofInterest,
    totalAmt,
    amortDataJSON,
  } = req.body;
  const amortData = JSON.stringify(req.body.amortDataJSON);

  const loanInsertQuery =
    "INSERT INTO loan_amount (loanAmount, interest, tenure, emi, totalInterest, totalPayment) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(
    loanInsertQuery,
    [pAmount, interest, duration, emi, TotalAmountofInterest, totalAmt],
    (err, result) => {
      if (!err) {
        const customerId = result.insertId;
        console.log(customerId);

        const amortInsertQuery =
          "INSERT INTO amortization_schedule (customerId, amortData) VALUES (?,?) ";
        db.query(amortInsertQuery, [customerId, amortData], (err1, result1) => {
          if (!err1) {
            console.log("inserted!");
            res.send({ success: true, message: "Data inserted successfully!" });
          } else {
            console.log(err1);
            res.send({ success: false, message: "Error occured amort." });
          }
        });
      } else {
        console.log(err);
        res.send({ success: false, message: "Error occured loan." });
      }
    }
  );
});

app.listen(process.env.PORT || 5000, () => {
  console.log("server started");
});
