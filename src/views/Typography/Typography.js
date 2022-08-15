import React, { useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import Popup from "components/Popup/Popup.js";

import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import {
  FormContainer,
  SubmitButton,
} from "../../components/accountBox/common";
import { Alert } from "@mui/material";

//import avatar from "assets/img/faces/marc.jpg";
//import { create } from "@mui/material/styles/createTransitions";

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0",
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
  rex: {
    display: "inline-block",
    margin: "5px 5px 5px 5px",
  },
  padding: {
    padding: "15px 15px 15px 15px",
  },
  child: {
    display: "inline-block",
    "vertical-align": "middle",
    "padding-right": "2em",
  },
  childRight: {
    display: "inline-block",
    "padding-right": "2em",
    position: "absolute",
    right: 0,
  },
};

import STATUS from "Utility/status.js";
import { rowsData, sortArray, truncateMax } from "./rowHandler";
import ADDRESS from "Utility/address.js";

const useStyles = makeStyles(styles);

const columns = [
  {
    id: "subType",
    label: "Name",
  },
  { id: "iShare", label: "(Total) iShare" },
  { id: "Date", label: "Date" },
  { id: "Options", label: "Options" },
];

export default function UserProfile() {
  const classes = useStyles();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = React.useState([]);
  const [purchaseDate, setPurchaseDate] = React.useState(new Date());
  const [incomeDate, setIncomeDate] = React.useState(new Date());
  const [tableStatus, setTableStatus] = React.useState(STATUS.TABLE.TOTAL);
  const [isOpen, setIsOpen] = React.useState(false);

  const incomeHandle = async (e) => {
    e.preventDefault();

    let _type = document.getElementById("income_type").value;
    let _subtype = document.getElementById("income_subType").value;
    let _value = document.getElementById("income_value").value;
    let date = new Date(incomeDate);
    let _doi = new Date(date.setTime(date.getTime() + 1 * 60 * 60 * 1000));
    //let _dop = purchaseDate;

    let user_id = window.sessionStorage.getItem("user_id");

    let Income = { value: _value, type: _type, subType: _subtype, doi: _doi };
    try {
      await fetch(`http://${ADDRESS.BACKEND}/api/v1/income/user/${user_id}`, {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": "*",
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            "Bearer " + window.sessionStorage.getItem("access_token"),
        },
        body: JSON.stringify(Income),
      });
      rowsData().then((data) => {
        sortArray(data);
        setRows(data);
        document.getElementById("income_type").value = "";
        document.getElementById("income_subType").value = "";
        document.getElementById("income_value").value = "";
      });
    } catch (err) {
      console.log(err);
    }
  };

  const purchaseHandle = async (e) => {
    e.preventDefault();
    console.log("TESTE");

    let _name = document.getElementById("product_service_name").value;
    let _value = document.getElementById("product_service_price").value;
    let _type = document.getElementById("product_service_subtype").value;
    let date = new Date(purchaseDate);
    let _dop = new Date(date.setTime(date.getTime() + 1 * 60 * 60 * 1000));
    //let _dop = purchaseDate;

    let user_id = window.sessionStorage.getItem("user_id");

    let Purchase = { value: _value, name: _name, type: _type, dop: _dop };

    console.log(Purchase);
    try {
      await fetch(`http://${ADDRESS.BACKEND}/api/v1/purchase/user/${user_id}`, {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": "*",
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            "Bearer " + window.sessionStorage.getItem("access_token"),
        },
        body: JSON.stringify(Purchase),
      });
      rowsData().then((data) => {
        sortArray(data);
        setRows(data);
        document.getElementById("product_service_name").value = "";
        document.getElementById("product_service_price").value = "";
        document.getElementById("product_service_subtype").value = "";
      });
    } catch (err) {
      console.log(err);
    }
  };

  const purchaseForm = (
    <GridContainer>
      <GridItem xs={4} sm={4} md={4}>
        <Card profile>
          <CardHeader>
            <FormContainer id="purchaseForm">
              <a>Purchases</a>
              <CustomInput
                labelText="Name"
                id="product_service_name"
                formControlProps={{
                  fullWidth: true,
                }}
              />
              <CustomInput
                labelText="Type"
                id="product_service_subtype"
                formControlProps={{
                  fullWidth: true,
                }}
              />
              <CustomInput
                labelText="Price"
                type="number"
                id="product_service_price"
                formControlProps={{
                  fullWidth: true,
                }}
              />
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  id="product_service_dop"
                  disableFuture
                  label="Date of Purchase"
                  openTo="year"
                  views={["year", "month", "day"]}
                  value={purchaseDate}
                  onChange={(newValue) => {
                    setPurchaseDate(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>

              <Button color="primary" onClick={purchaseHandle} round>
                Insert
              </Button>
            </FormContainer>
          </CardHeader>
        </Card>
      </GridItem>
      <GridItem xs={4} sm={4} md={4}>
        <Card profile>
          <CardHeader>
            <FormContainer id="incomeForm">
              <a>Income</a>
              <CustomInput
                labelText="Type"
                id="income_type"
                formControlProps={{
                  fullWidth: false,
                }}
              />
              <CustomInput
                labelText="Origin"
                id="income_subType"
                formControlProps={{
                  fullWidth: false,
                }}
              />
              <CustomInput
                labelText="Value"
                id="income_value"
                type="number"
                formControlProps={{
                  fullWidth: true,
                }}
              />
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  id="income_doi"
                  disableFuture
                  label="Date of Income"
                  openTo="year"
                  views={["year", "month", "day"]}
                  value={incomeDate}
                  onChange={(newValue) => {
                    setIncomeDate(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
              <Button color="primary" onClick={incomeHandle} round>
                Insert
              </Button>
            </FormContainer>
          </CardHeader>
        </Card>
      </GridItem>
    </GridContainer>
  );
  //const incomeForm = 0;

  let TOTAL_VALUE = 0;
  let TOTAL_ISHARE = 0;

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    rowsData().then((data) => {
      sortArray(data);
      setRows(data);
    });
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSplitClick = async (event) => {
    let purchase_id = event.target.getAttribute("id");
    let user_id = window.sessionStorage.getItem("user_id");
    const w = document.getElementById("weight" + purchase_id);
    const u = document.getElementById("email" + purchase_id);
    let split = {
      weight: w.value,
      userEmail: u.value,
    };
    try {
      await fetch(
        `http://${ADDRESS.BACKEND}/api/v1/split/user/${user_id}/purchase/${purchase_id}`,
        {
          method: "POST",
          headers: {
            "Access-Control-Allow-Origin": "*",
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization:
              "Bearer " + window.sessionStorage.getItem("access_token"),
          },
          body: JSON.stringify(split),
        }
      );
      w.value = "";
      rowsData().then((data) => {
        sortArray(data);
        setRows(data);
      });
    } catch (e) {
      console.log(e);
    }
  };
  const handleEditClick = (event) => {
    let id = event.target.getAttribute("id");
    let status = event.target.getAttribute("value");
    console.log(status, id);
  };

  const handleTableStatus = (event) => {
    switch (event) {
      case "TOTAL":
        setTableStatus(STATUS.TABLE.TOTAL);
        break;
      case "SPLIT":
        setTableStatus(STATUS.TABLE.SPLIT);
        break;
      case "NO_SPLIT":
        setTableStatus(STATUS.TABLE.NO_SPLIT);
        break;
      case "GIVEN":
        setTableStatus(STATUS.TABLE.GIVEN);
        break;
      default:
        setTableStatus(STATUS.TABLE.TOTAL);
        break;
    }
    setRows([...rows]);
  };

  return (
    <div>
      <GridContainer>
        <GridItem xs={8} sm={8} md={8}>
          <Card>
            <CardHeader color="primary">
              <div>
                <div className={classes.child}>
                  <h4 className={classes.cardTitleWhite}>Movement History</h4>
                </div>
                <div className={classes.child}>
                  <Button
                    color="warning"
                    size="sm"
                    onClick={() => handleTableStatus("TOTAL")}
                  >
                    Total
                  </Button>
                  <Button
                    color="warning"
                    size="sm"
                    onClick={() => handleTableStatus("SPLIT")}
                  >
                    Split
                  </Button>
                  <Button
                    color="warning"
                    size="sm"
                    onClick={() => handleTableStatus("NO_SPLIT")}
                  >
                    NoSplit
                  </Button>
                  <Button
                    color="warning"
                    size="sm"
                    onClick={() => handleTableStatus("GIVEN")}
                  >
                    Given
                  </Button>
                  <div className={classes.childRight}>
                    <Button
                      color="rose"
                      size="sm"
                      onClick={() => togglePopup()}
                    >
                      Purchase/Income
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <Paper sx={{ width: "100%" }}>
                <TableContainer sx={{ minHeight: 300 }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        {columns.map((column) => (
                          <TableCell
                            key={column.id}
                            align="center"
                            style={{ minWidth: column.minWidth }}
                          >
                            {column.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody id="tablebody">
                      {rows.map((item) => {
                        // *CHECK TABLE STATUS AND SHOW CONTENT
                        if (tableStatus == STATUS.TABLE.SPLIT) {
                          if (item.status != STATUS.PURCHASE.WITH_SPLIT) {
                            return null;
                          }
                        } else if (tableStatus == STATUS.TABLE.NO_SPLIT) {
                          if (item.status != STATUS.PURCHASE.NO_SPLIT) {
                            return null;
                          }
                        } else if (tableStatus == STATUS.TABLE.GIVEN) {
                          if (item.status != STATUS.PURCHASE.FROM_SPLIT) {
                            return null;
                          }
                        }

                        if (item.iShare)
                          TOTAL_ISHARE += parseFloat(item.iShare);
                        if (item.status != STATUS.PURCHASE.INCOME)
                          TOTAL_VALUE += parseFloat(item.value);

                        return (
                          <tr key={Math.random()}>
                            <td align="center">{truncateMax(item.name)}</td>
                            <td
                              align="center"
                              bgcolor={
                                item.status == STATUS.PURCHASE.INCOME
                                  ? "#03C04A"
                                  : item.weight == 0
                                  ? "lightblue"
                                  : item.weight == 100
                                  ? "tomato"
                                  : ""
                              }
                            >
                              {item.status == STATUS.PURCHASE.WITH_SPLIT ||
                              item.status == STATUS.PURCHASE.FROM_SPLIT
                                ? `(${item.value}) ` + item.iShare
                                : item.status == STATUS.PURCHASE.NO_SPLIT
                                ? item.value
                                : item.status == STATUS.PURCHASE.INCOME
                                ? item.value
                                : ""}
                            </td>
                            <td align="center">{item.dop || item.doi}</td>
                            <td align="center">
                              {item.status == STATUS.PURCHASE.NO_SPLIT ? (
                                <div>
                                  <div className={classes.rex}>
                                    <button
                                      id={item.id}
                                      value={item.status}
                                      onClick={handleEditClick}
                                    >
                                      Edit
                                    </button>
                                  </div>
                                  <div className={classes.rex}>
                                    <div className="input-group">
                                      <input
                                        id={"weight" + item.id}
                                        type="text"
                                        name="split_value"
                                        className="form-control"
                                        placeholder="0-100"
                                        size="1"
                                      ></input>
                                      <select
                                        id={"email" + item.id}
                                        name="split_userEmail"
                                      >
                                        <option value="anacatarinarebelo98@gmail.com">
                                          Ana Catarina
                                        </option>
                                        <option
                                          className={classes.padding}
                                          value="al.vrdias@gmail.com"
                                        >
                                          Álison Dias
                                        </option>
                                      </select>
                                      <span>
                                        <button
                                          id={item.id}
                                          value={item.status}
                                          className="btn btn-primary"
                                          onClick={handleSplitClick}
                                        >
                                          Split
                                        </button>
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ) : item.status == STATUS.PURCHASE.WITH_SPLIT ||
                                item.status == STATUS.PURCHASE.FROM_SPLIT ? (
                                <>
                                  <button
                                    id={item.id}
                                    value={item.status}
                                    onClick={handleEditClick}
                                  >
                                    Edit
                                  </button>
                                  <input
                                    id={"weight" + item.id}
                                    type="text"
                                    name="split_value"
                                    className="form-control"
                                    placeholder={item.weight + "%"}
                                    size="1"
                                    disabled
                                  ></input>
                                </>
                              ) : (
                                <>
                                  <button
                                    id={item.id}
                                    value={item.status}
                                    onClick={handleEditClick}
                                  >
                                    Edit
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </TableBody>
                    <TableBody>
                      {
                        <tr bgcolor="#E6E1EF">
                          <td align="center">Total</td>
                          <td align="center">{TOTAL_ISHARE.toFixed(2)}</td>
                          <td align="center">
                            {new Date().toISOString().split("T")[0]}
                          </td>
                          <td align="center"></td>
                        </tr>
                      }
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[10, 25, 100]}
                  component="div"
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Paper>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      {isOpen && <Popup content={purchaseForm} handleClose={togglePopup} />}
    </div>
  );
}
