import React, { Fragment, useState } from "react";
import "./emicalculator.css";
import { withStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import { Button, Table, TableCell } from "@material-ui/core";
import { Pie } from "react-chartjs-2";
import TableDetail from "../TableDetail/TableDetail";
import SlideMarks from "../utils/SlideMarks";
import LoanJS from "loanjs";
import Axios from "axios";

const PrettySlider = withStyles({
  root: { color: "#5B2A86", height: 10 },
  thumb: {
    height: 25,
    width: 25,
    backgroundColor: "white",
    border: "3px solid #333",
    marginTop: -9,
    marginLeft: -9,
  },
  track: { height: 10, borderRadius: 4 },
  rail: { height: 10, borderRadius: 4 },
})(Slider);

const EmiCalculator = () => {
  const [pAmount, setpAmount] = useState(100000);
  const [interest, setinterest] = useState(7);
  const [duration, setDuration] = useState(10);
  const [installments, setInstallments] = useState([]);
  const [isYear, setIsYear] = useState(false);
  const maxValue = 20000000;
  const intMax = 20;
  const maxDuration = 360;

  const monthlyInterestRatio = interest / 1200;
  const emi = duration
    ? Math.round(
        (pAmount * monthlyInterestRatio) /
          (1 - Math.pow(1 / (1 + monthlyInterestRatio), duration))
      )
    : 0;
  const totalAmt = duration * emi;
  var TotalAmountofCredit = Math.round(
    (emi / monthlyInterestRatio) *
      (1 - Math.pow(1 + monthlyInterestRatio, -duration))
  );
  const TotalAmountofInterest = Math.round(totalAmt - TotalAmountofCredit);

  const handleSubmit = (e) => {
    e.preventDefault();
    let installments = calculate(pAmount, duration, interest);
    const arrayNew = installments.map((item, index) => {
      return Object.assign(item, { month: index + 1 });
    });
    Axios.post("https://emi-calulator-app.herokuapp.com/api/insert", {
      pAmount: pAmount,
      interest: interest,
      duration: duration,
      emi: emi,
      TotalAmountofInterest: TotalAmountofInterest,
      totalAmt: totalAmt,
      amortDataJSON: arrayNew,
    })
      .then(() => {
        console.log("inserted successsfully");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const calculate = (pAmount, duration, interest) => {
    var loan = new LoanJS.Loan(pAmount, duration * 12, interest);
    setInstallments(loan.installments);
    return loan.installments;
  };

  const FormatNumber = (number, numberOfDigits = 2) => {
    try {
      return new Intl.NumberFormat("en-US").format(
        parseFloat(number).toFixed(numberOfDigits)
      );
    } catch (error) {
      return 0;
    }
  };

  const yearHandler = (e) => {
    e.preventDefault();
    setIsYear(true);
  };

  return (
    <Fragment>
      <div className="EMI_calc_container">
        {/* slider container */}
        <div className="slider_container">
          <h2 className="heading">
            <u>EMI calculator</u>
          </h2>
          <div className="slider">
            <Typography gutterBottom>
              <strong>Loan Amount</strong>
              <input
                type="number"
                className="input-amount"
                placeholder={pAmount}
                value={pAmount}
              />
              <Button variant="contained" disabled className="button_rupees">
                ₹
              </Button>
            </Typography>
            <PrettySlider
              value={pAmount}
              marks={SlideMarks.marksAmt}
              step={1}
              onChange={(event, vAmt) => {
                setpAmount(vAmt);
              }}
              defaultValue={pAmount}
              max={maxValue}
            />
          </div>
          <div className="slider">
            <Typography gutterBottom>
              <strong>Interest Rate %</strong>
              <input
                type="number"
                className="input-amount"
                placeholder={interest}
                value={interest}
              />
              <Button variant="contained" disabled className="button_rupees">
                %
              </Button>
            </Typography>
            <PrettySlider
              value={interest}
              marks={SlideMarks.marksInt}
              step={0.1}
              onChange={(event, vInt) => {
                setinterest(vInt);
              }}
              max={intMax}
              defaultValue={interest}
            />
          </div>
          <div className="slider">
            <Typography gutterBottom>
              <strong>Tenure</strong>
              <input
                type="number"
                className="input-amount"
                placeholder={duration}
                value={isYear ? duration * 12 : duration}
              />
              <Button
                variant="contained"
                active={isYear}
                onClick={yearHandler}
                className="button_year"
              >
                Year
              </Button>
              <Button variant="contained" className="button_year">
                Month
              </Button>
            </Typography>
            <PrettySlider
              marks={SlideMarks.marksTenure}
              value={duration}
              onChange={(event, vDur) => {
                setDuration(vDur);
              }}
              defaultValue={duration}
              max={maxDuration}
            />
          </div>
          <div className="save_btn">
            <Button variant="contained" className="btn" onClick={handleSubmit}>
              Calculate and Save result
            </Button>
          </div>
        </div>
        {/* end of slider container */}

        {/* KPI and chart */}
        <div className="KPI_chart">
          <div className="kpi">
            <Table className="table">
              <TableCell>
                <TableDetail
                  pAmount={pAmount}
                  interest={interest}
                  duration={duration}
                  emi={emi}
                  TotalAmountofInterest={TotalAmountofInterest}
                  totalAmt={totalAmt}
                />
              </TableCell>
            </Table>
          </div>
          <div className="pie">
            <Pie
              className="pie_chart"
              data={{
                labels: ["Total Interest", "Total Amount"],
                datasets: [
                  {
                    data: [TotalAmountofInterest, pAmount],
                    backgroundColor: ["#5B2A86", "#360568"],
                  },
                ],
              }}
              width={200}
              height={200}
            />
          </div>
        </div>
        {/* end of KPI and chart */}

        {/* amortization table */}
        <div className="amortization_table">
          <h2 className="heading">
            <u>Amortization Schedule</u>
          </h2>
          <div className="amort_data">
            <table>
              {installments && (
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Payment Amount</th>
                    <th>Interest Paid</th>
                    <th>Principal Paid</th>
                    <th>Remain</th>
                  </tr>
                </thead>
              )}
              <tbody>
                {installments.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{`₹` + FormatNumber(item.installment)}</td>
                    <td>{`₹` + FormatNumber(item.interest)}</td>
                    <td>{`₹` + FormatNumber(item.capital)}</td>
                    <td>{`₹` + FormatNumber(item.remain)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* end of amortization table */}
      </div>
    </Fragment>
  );
};

export default EmiCalculator;
