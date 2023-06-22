import DayjsUtils from "@date-io/dayjs";
import { FormGroup, Typography } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import dayjs from "dayjs";
import React from "react";
import { Line } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import { ChartLabelsTwentyWeeks } from "../../constantTemplates/ChartLabelsTwentyWeeks";
import { StatsResponse } from "../../models/StatsResponse";
import { generateIdealVelocity } from "../../utils/functions/generateIdealVelocity";
import { achievementsMax, burnDown } from "../../utils/functions/statsSelect";

interface Props {
  statisticsData: StatsResponse | undefined;
  selectedTargetGrade: number | undefined;
  deadline: null | string | undefined;
  startDate: string | null | undefined;
  updateDeadline: (target: string) => Promise<void>;
}

export const defaultWeeksTarget = 16;

const BurnDownChart = (props: Props) => {
  const { t } = useTranslation();
  const { statisticsData, selectedTargetGrade } = props;
  const loading =
    statisticsData === undefined || selectedTargetGrade === undefined;

  const deadlineIsUndefined = props.deadline === null || props.deadline === undefined;

  let defaultDeadline = dayjs(new Date(props.startDate ? props.startDate : ""));
  defaultDeadline = defaultDeadline.add(defaultWeeksTarget, 'week');
  if (deadlineIsUndefined) {
    props.updateDeadline(defaultDeadline.format('YYYY-MM-DD').toString());
  }
  const [deadline, setDeadline] = React.useState(deadlineIsUndefined ? defaultDeadline.format('YYYY-MM-DD').toString() : props.deadline);
  const weeksNeeded = deadlineIsUndefined ? defaultWeeksTarget : statisticsData?.weeksNeeded ? statisticsData?.weeksNeeded : defaultWeeksTarget;
  const handleDateChange = (date: MaterialUiPickersDate) => {
    if (date && date.isValid()) {
      setDeadline(date.format('YYYY-MM-DD').toString());
      props.updateDeadline(date.format('YYYY-MM-DD').toString());
    }
  }
  const firstDateAfterIntro = dayjs(props.startDate ? props.startDate : new Date()).add(3, 'week');
  const lastDate = dayjs(props.startDate ? props.startDate : new Date()).add(20, 'week');

  const dataset: any = {
    labels: ChartLabelsTwentyWeeks,
    datasets: [
      {
        label: t("BurnDownChart.idealLabel"),
        fill: false,
        lineTension: 0,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        spanGaps: true,
        data: statisticsData ? generateIdealVelocity(achievementsMax(statisticsData), weeksNeeded)
         : [],
      },
      {
        label: t("BurnDownChart.myLabel"),
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(255,0,0,1)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: statisticsData ? burnDown(statisticsData) : [],
      },
    ],
  };
  return (
    <>
      <Typography style={{ paddingTop: "10px", textAlign: "center" }}>
        <b>{t("BurnDownChart.title")}</b>
      </Typography>
      {loading ? (
        <Skeleton variant="rect" height="100%" />
      ) : (
        <div style={{height: "80%"}}>
        <Line
          type='line' // See https://github.com/reactchartjs/react-chartjs-2/issues/659
          data={dataset}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              yAxes: [
                {
                  scaleLabel: {
                    display: true,
                    labelString: t("BurnDownChart.yAxis") as string,
                  },
                  ticks: {
                    suggestedMin: 78,
                    suggestedMax: 78,
                  },
                },
              ],
              xAxes: [
                {
                  scaleLabel: {
                    display: true,
                    labelString: t("BurnDownChart.xAxis") as string,
                  },
                },
              ],
            },
          }}
        />
        </div>
      )}
      <FormGroup>
        <MuiPickersUtilsProvider utils={DayjsUtils}>
          <KeyboardDatePicker
            style={{ margin: "10px" }}
            margin="normal"
            id="course-date"
            label="Target date"
            format="YYYY-MM-DD"
            minDate={firstDateAfterIntro.format('YYYY-MM-DD').toString()}
            maxDate={lastDate.format('YYYY-MM-DD').toString()}
            value={deadline}
            onChange={handleDateChange}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
        </MuiPickersUtilsProvider>
      </FormGroup>
    </>
  );
};

export default BurnDownChart;
