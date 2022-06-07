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
    id: "type",
    label: "type",
  },
  {
    id: "subType",
    label: "subType",
  },
  { id: "value", label: "value" },
  { id: "dop", label: "dop" },
];

let rows_aux = [];
function createData(info) {
  return rows_aux.push(info);
}

async function rowsData() {
  rows_aux = [];
  try {
    let user_id = window.sessionStorage.getItem("user_id");

    let response = await fetch(
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

    const data = await response.json();

    for (const element of data) {
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

  useEffect(() => {
    rowsData().then((data) => {
      data.sort(function (a, b) {
        var dateA = new Date(a.dop),
          dateB = new Date(b.dop);
        return dateB - dateA;
      });
      setRows(data);
    });
  }, []);

  const purchaseHandle = async (e) => {
    e.preventDefault();

    let _name = document.getElementById("product_service_name").value;
    let _value = document.getElementById("product_service_price").value;
    let _subtype = document.getElementById("product_service_subtype").value;
    let date = new Date(purchaseDate);
    let _dop = new Date(date.setTime(date.getTime() + 1 * 60 * 60 * 1000));
    //let _dop = purchaseDate;

    console.log(_dop);

    let user_id = window.sessionStorage.getItem("user_id");

    let Purchase = { value: _value, type: _name, subType: _subtype, dop: _dop };
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

  return (
    <div>
      <GridContainer>
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
                  labelText="Product/Service SubType"
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
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>List of Purchases</h4>
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
                      {
                        //console.log(rows)
                        rows.map((item) => {
                          return (
                            <tr key={Math.random()}>
                              <th scope="row">{item.type}</th>
                              <td>{item.subType}</td>
                              <td>{item.value}</td>
                              <td>{item.dop}</td>
                            </tr>
                          );
                        })
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
        <GridItem xs={12} sm={12} md={4}>
          <Card profile>
            <CardBody profile>
              <FormContainer id="incomeForm" onSubmit={purchaseHandle}>
                <a>Income</a>
                <CustomInput
                  labelText="Type"
                  id="income_type"
                  formControlProps={{
                    fullWidth: true,
                  }}
                />
                <CustomInput
                  labelText="Value"
                  id="income_value"
                  formControlProps={{
                    fullWidth: true,
                  }}
                />
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
      </GridContainer>
    </div>
  );
}
