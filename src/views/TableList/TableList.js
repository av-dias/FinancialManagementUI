import React, { useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0",
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF",
    },
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1",
    },
  },
};

const useStyles = makeStyles(styles);

function checkDept(json) {
  if (json && json.Given && json.Self) {
    console.log(json.Self.iShare, json.Given.yShare);
    if (json.Self.yShare > json.Given.iShare) {
      let balance = [
        "Balance",
        "Debt",
        0,
        parseFloat(json.Self.yShare - json.Given.iShare).toFixed(2),
      ];
      return balance;
    } else
      return [
        "Balance",
        "Debt",
        parseFloat(json.Given.iShare - json.Self.yShare).toFixed(2),
        0,
      ];
  }
  return ["Balance", "NA", "NA", "NA"];
}

//let rows_aux = [{ ola: 1 }];

/* function createData(info) {
  return rows_aux.push(info);
} */

export default function TableList() {
  const classes = useStyles();
  const [rows, setRows] = React.useState({});

  async function loadData() {
    try {
      let user_id = window.sessionStorage.getItem("user_id");
      let user_name = window.sessionStorage.getItem("user_name");

      let response = await fetch(
        `http://localhost:8080/api/v1/split/users/user/${user_id}/stats`,
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
      let json = {};
      data.Self.forEach((item) => {
        //let id = item.substring(0, item.indexOf("="));
        json.Self = JSON.parse(item.substring(item.indexOf("=") + 1));
        json.Self.id = user_id;
        json.Self.name = user_name;
      });

      data.Given.forEach((item) => {
        let id = item.substring(0, item.indexOf("="));
        json.Given = JSON.parse(item.substring(item.indexOf("=") + 1));
        json.Given.id = id;
        json.Given.name = data.Names[id];
      });

      return json;
    } catch (e) {
      console.log(e.message);
    }
  }

  useEffect(async () => {
    await loadData().then((data) => {
      setRows(data);
    });
  }, []);

  if (rows.Given || rows.Self) {
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>
                Spliting {rows.Self.name}-{rows.Given.name}
              </h4>
              <p className={classes.cardCategoryWhite}>
                {rows.Self.name} analysis
              </p>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="primary"
                tableHead={[
                  "Owner",
                  "Total",
                  rows.Self.name + " Share",
                  rows.Given.name + " Share",
                ]}
                tableData={[
                  [
                    rows.Self.name || "NA",
                    parseFloat(rows.Self.total).toFixed(2) || "NA",
                    parseFloat(rows.Self.iShare).toFixed(2) || "NA",
                    parseFloat(rows.Self.yShare).toFixed(2) || "NA",
                  ],
                  [
                    rows.Given.name || "NA",
                    parseFloat(rows.Given.total).toFixed(2) || "NA",
                    parseFloat(rows.Given.iShare).toFixed(2) || "NA",
                    parseFloat(rows.Given.yShare).toFixed(2) || "NA",
                  ],
                  [
                    "Total",
                    parseFloat(rows.Given.total + rows.Self.total).toFixed(2) ||
                      "NA",
                    parseFloat(rows.Given.iShare + rows.Self.iShare).toFixed(
                      2
                    ) || "NA",
                    parseFloat(rows.Given.yShare + rows.Self.yShare).toFixed(
                      2
                    ) || "NA",
                  ],
                  checkDept(rows),
                ]}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    );
  } else {
    return null;
  }
}
