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

//let rows_aux = [{ ola: 1 }];

/* function createData(info) {
  return rows_aux.push(info);
} */

export default function TableList() {
  const classes = useStyles();
  const [rows, setRows] = React.useState([]);

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
      let json;
      data.stats.forEach((item) => {
        //let id = item.substring(0, item.indexOf("="));
        json = JSON.parse(item.substring(item.indexOf("=") + 1));
        json.id = user_id;
        json.name = user_name;
      });

      //createData(json);

      return json;
    } catch (e) {
      console.log(e.message);
    }
  }

  useEffect(() => {
    loadData().then((data) => {
      //console.log(data);
      setRows(data);
    });
  }, []);

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>
              Spliting costs Álison-Ana
            </h4>
            <p className={classes.cardCategoryWhite}>Full balance analysis</p>
          </CardHeader>
          <CardBody>
            <Table
              tableHeaderColor="primary"
              tableHead={["Owner", "Total", "iShare", "yShare"]}
              {...console.log(rows)}
              tableData={[
                [
                  rows.name || "NA",
                  parseFloat(rows.total).toFixed(2) || "NA",
                  parseFloat(rows.iShare).toFixed(2) || "NA",
                  parseFloat(rows.yShare).toFixed(2) || "NA",
                ],
              ]}
            />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
