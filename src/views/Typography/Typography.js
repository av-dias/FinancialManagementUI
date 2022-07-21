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
};

const useStyles = makeStyles(styles);

const columns = [
  {
    id: "Type",
    label: "Type",
  },
  {
    id: "subType",
    label: "Name",
  },
  { id: "Value", label: "Price" },
  { id: "Date", label: "Date" },
  { id: "Options", label: "Options" },
];

let rows_aux = [];

function createData(info) {
  return rows_aux.push(info);
}

async function rowsData() {
  rows_aux = [];
  try {
    let user_id = window.sessionStorage.getItem("user_id");

    let response_purchase = await fetch(
      `http://localhost:8080/api/v1/purchase/user/${user_id}`,
      {
        method: "GET",
        headers: {
          "Access-Control-Allow-Origin": "*",
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            "Bearer " + window.sessionStorage.getItem("access_token"),
        },
      }
    );

    const data_purchase = await response_purchase.json();

    let response_income = await fetch(
      `http://localhost:8080/api/v1/income/user/${user_id}`,
      {
        method: "GET",
        headers: {
          "Access-Control-Allow-Origin": "*",
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            "Bearer " + window.sessionStorage.getItem("access_token"),
        },
      }
    );

    const data_income = await response_income.json();
    //let data = [...data_purchase, ...data_income];
    //console.log(data);
    for (const element of data_purchase) {
      element.status = 0;
      createData(element);
    }
    for (const element of data_income) {
      element.status = 1;
      createData(element);
    }
    return rows_aux;
  } catch (e) {
    console.log(e.message);
  }
}

export default function UserProfile() {
  const classes = useStyles();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = React.useState([]);
  const [purchaseDate, setPurchaseDate] = React.useState(new Date());
  const [incomeDate, setIncomeDate] = React.useState(new Date());

  function sortArray(data) {
    data.sort(function (a, b) {
      var dateA = new Date(a.dop || a.doi),
        dateB = new Date(b.dop || a.doi);
      return dateB - dateA;
    });

    return data;
  }

  useEffect(() => {
    rowsData().then((data) => {
      sortArray(data);
      setRows(data);
    });
  }, []);

  const purchaseHandle = async (e) => {
    e.preventDefault();

    let _name = document.getElementById("product_service_name").value;
    let _value = document.getElementById("product_service_price").value;
    let _type = document.getElementById("product_service_subtype").value;
    let date = new Date(purchaseDate);
    let _dop = new Date(date.setTime(date.getTime() + 1 * 60 * 60 * 1000));
    //let _dop = purchaseDate;

    let user_id = window.sessionStorage.getItem("user_id");

    let Purchase = { value: _value, name: _name, type: _type, dop: _dop };
    try {
      await fetch(`http://localhost:8080/api/v1/purchase/user/${user_id}`, {
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
      });
    } catch (err) {
      console.log(err);
    }
  };

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
      await fetch(`http://localhost:8080/api/v1/income/user/${user_id}`, {
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
      rowsData().then((data) => setRows(data));
    } catch (err) {
      console.log(err);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleClick = (event) => {
    let id = event.target.getAttribute("id");
    let status = event.target.getAttribute("value");
    console.log(status, id);
  };

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Movement History</h4>
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
                            align={column.align}
                            style={{ minWidth: column.minWidth }}
                          >
                            {column.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody id="tablebody">
                      {rows.map((item) => {
                        return (
                          <tr key={Math.random()}>
                            <th scope="row">{item.type}</th>
                            <td>{item.subType || item.name}</td>
                            <td>{item.value}</td>
                            <td>{item.dop || item.doi}</td>
                            <td>
                              <button
                                id={item.id}
                                value={item.status}
                                onClick={handleClick}
                              >
                                Edit
                              </button>
                              {item.status == 0 ? (
                                <button
                                  id={item.id}
                                  value={item.status}
                                  onClick={handleClick}
                                >
                                  Split
                                </button>
                              ) : (
                                <></>
                              )}
                            </td>
                          </tr>
                        );
                      })}
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
        <GridItem xs={12} sm={12} md={4}>
          <Card profile>
            <CardBody profile>
              <FormContainer id="purchaseForm" onSubmit={purchaseHandle}>
                <a>Purchases</a>
                <CustomInput
                  labelText="Product/Service Name"
                  id="product_service_name"
                  formControlProps={{
                    fullWidth: true,
                  }}
                />
                <CustomInput
                  labelText="Product/Service Price"
                  id="product_service_price"
                  formControlProps={{
                    fullWidth: true,
                  }}
                />
                <CustomInput
                  labelText="Product/Service Sub-Type"
                  id="product_service_subtype"
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

                <SubmitButton
                  color="primary"
                  type="submit"
                  form="purchaseForm"
                  round
                >
                  Insert
                </SubmitButton>
              </FormContainer>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card profile>
            <CardBody profile>
              <FormContainer id="incomeForm" onSubmit={incomeHandle}>
                <a>Income</a>
                <CustomInput
                  labelText="Type"
                  id="income_type"
                  formControlProps={{
                    fullWidth: false,
                  }}
                />
                <CustomInput
                  labelText="Sub-Type"
                  id="income_subType"
                  formControlProps={{
                    fullWidth: false,
                  }}
                />
                <CustomInput
                  labelText="Value"
                  id="income_value"
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
                <SubmitButton
                  color="primary"
                  type="submit"
                  form="incomeForm"
                  round
                >
                  Insert
                </SubmitButton>
              </FormContainer>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
