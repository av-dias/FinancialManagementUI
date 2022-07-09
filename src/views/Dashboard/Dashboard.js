import React, { useEffect } from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Store from "@material-ui/icons/Store";
import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
import Accessibility from "@material-ui/icons/Accessibility";
import BugReport from "@material-ui/icons/BugReport";
import Code from "@material-ui/icons/Code";
import Cloud from "@material-ui/icons/Cloud";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Tasks from "components/Tasks/Tasks.js";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import Danger from "components/Typography/Danger.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import { bugs, website, server } from "variables/general.js";

import { loadCharts, completedTasksChart } from "variables/charts.js";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

const useStyles = makeStyles(styles);

export default function Dashboard() {
  let [dashboardData, setdashboardData] = React.useState({
    total_spendings: 0,
    total_savings: 0,
    month_spendings: 0,
    month_savings: 0,
  });

  let [chartData, setchartData] = React.useState(loadCharts());

  async function loadData() {
    try {
      let user_id = window.sessionStorage.getItem("user_id");

      let response = await fetch(
        `http://localhost:8080/api/v1/user/${user_id}/purchase/statistics`,
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

      console.log(data);
      return data;
    } catch (e) {
      console.log(e.message);
    }
  }

  useEffect(() => {
    loadData().then((data) => {
      setdashboardData(data);
      setchartData(loadCharts(data.purchases_by_type));
    });
  }, []);

  const classes = useStyles();
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={10} md={3}>
          <Card>
            <CardHeader
              color="warning"
              stats
              icon
              className={classes.cardHeader}
            >
              <CardIcon color="warning">
                <Icon>content_copy</Icon>
              </CardIcon>
              <p className={classes.cardCategory}>Total Spendings</p>
              <h3 className={classes.cardTitle}>
                {dashboardData.total_spendings.toFixed(2) || 0} <small>€</small>
              </h3>
            </CardHeader>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader
              color="success"
              stats
              icon
              className={classes.cardHeader}
            >
              <CardIcon color="success">
                <Store />
              </CardIcon>
              <p className={classes.cardCategory}>Total Savings</p>
              <br></br>
              <h3 className={classes.cardTitle}>
                {dashboardData.total_savings.toFixed(2) || 0} <small>€</small>
              </h3>
            </CardHeader>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader
              color="danger"
              stats
              icon
              className={classes.cardHeader}
            >
              <CardIcon color="danger">
                <Icon>info_outline</Icon>
              </CardIcon>
              <p className={classes.cardCategory}>Month Expenses</p>
              <h3 className={classes.cardTitle}>
                {dashboardData.month_spendings.toFixed(2) || 0} <small>€</small>
              </h3>
            </CardHeader>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="info" stats icon className={classes.cardHeader}>
              <CardIcon color="info">
                <Accessibility />
              </CardIcon>
              <p className={classes.cardCategory}>Month Savings</p>
              <br></br>
              <h3 className={classes.cardTitle}>
                {dashboardData.month_savings.toFixed(2) || 0} <small>€</small>
              </h3>
            </CardHeader>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <Card chart>
            <CardHeader color="success">
              <ChartistGraph
                className="ct-chart"
                data={chartData.data}
                type="Bar"
                options={chartData.options}
                listener={chartData.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Month Savings</h4>
              <p className={classes.cardCategory}>
                <span className={classes.successText}>
                  <ArrowUpward className={classes.upArrowCardCategory} /> 55%
                </span>{" "}
                increase in today sales.
              </p>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> updated 4 minutes ago
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card chart>
            <CardHeader color="danger">
              <ChartistGraph
                className="ct-chart"
                data={completedTasksChart.data}
                type="Line"
                options={completedTasksChart.options}
                listener={completedTasksChart.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Completed Tasks</h4>
              <p className={classes.cardCategory}>Last Campaign Performance</p>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> campaign sent 2 days ago
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <CustomTabs
            title="Tasks:"
            headerColor="primary"
            tabs={[
              {
                tabName: "Bugs",
                tabIcon: BugReport,
                tabContent: (
                  <Tasks
                    checkedIndexes={[0, 3]}
                    tasksIndexes={[0, 1, 2, 3]}
                    tasks={bugs}
                  />
                ),
              },
              {
                tabName: "Website",
                tabIcon: Code,
                tabContent: (
                  <Tasks
                    checkedIndexes={[0]}
                    tasksIndexes={[0, 1]}
                    tasks={website}
                  />
                ),
              },
              {
                tabName: "Server",
                tabIcon: Cloud,
                tabContent: (
                  <Tasks
                    checkedIndexes={[1]}
                    tasksIndexes={[0, 1, 2]}
                    tasks={server}
                  />
                ),
              },
            ]}
          />
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="warning">
              <h4 className={classes.cardTitleWhite}>Employees Stats</h4>
              <p className={classes.cardCategoryWhite}>
                New employees on 15th September, 2016
              </p>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="warning"
                tableHead={["ID", "Name", "Salary", "Country"]}
                tableData={[
                  ["1", "Dakota Rice", "$36,738", "Niger"],
                  ["2", "Minerva Hooper", "$23,789", "Curaçao"],
                  ["3", "Sage Rodriguez", "$56,142", "Netherlands"],
                  ["4", "Philip Chaney", "$38,735", "Korea, South"],
                ]}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
