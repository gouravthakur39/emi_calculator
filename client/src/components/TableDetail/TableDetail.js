import React, { Fragment } from "react";
import "./tabledetail.css";
import { Table, TableCell, TableHead, TableRow } from "@material-ui/core";

const TableDetail = (props) => {
  return (
    <Fragment>
      <Table
        style={{ width: "100%", border: "2px solid #ccc" }}
        aria-label="table"
      >
        <TableHead>
          <TableRow>
            <TableCell className="ETableCellText">
              <strong>Loan Amount</strong>
            </TableCell>
            <TableCell className="ETableCellVal">
              <strong>₹</strong>
              {props.pAmount}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="ETableCellText">
              <strong>Interest</strong>
            </TableCell>
            <TableCell className="ETableCellVal">{props.interest}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="ETableCellText">
              <strong>Tenure</strong>
            </TableCell>
            <TableCell className="ETableCellVal">{props.duration}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="ETableCellText">
              <strong>EMI</strong>
            </TableCell>
            <TableCell className="ETableCellVal">
              <strong>₹</strong>
              {props.emi}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="ETableCellText">
              <strong>Total Interest</strong>
            </TableCell>
            <TableCell className="ETableCellVal">
              <strong>₹</strong>
              {props.TotalAmountofInterest}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="ETableCellText">
              <strong>Total Payment</strong>
            </TableCell>
            <TableCell className="ETableCellVal">
              <strong>₹</strong>
              {props.totalAmt ? props.totalAmt : 0}
            </TableCell>
          </TableRow>
        </TableHead>
      </Table>
    </Fragment>
  );
};

export default TableDetail;
