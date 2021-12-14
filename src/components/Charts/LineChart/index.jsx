import React from 'react';
import { arrayOf, bool, number, shape, string, oneOfType } from 'prop-types';
import ReactDOMServer from "react-dom/server"; 
import { ReactAmChart } from "../../AmChartReact";
import ChartTooltip from "./ChartToolTip";

const FIRST_VALUE = "firstValue";
const SECOND_VALUE = "secondValue";
const DATE_CHANGE_VALUE = "change"
const TIME = "time";

export default class LineChart extends ReactAmChart {
  static propTypes = {
    isCompare: bool,
    typeSelect: string,
    fontFamily: string,
    firstRange: string,
    secondRange: string,
    data: arrayOf(shape({
      time: string.isRequired,
      firstValue: number,
      secondValue: number,
      change: oneOfType([string, number])
    })).isRequired,
    chartColor: shape({
      firstLineColor: string,
      secondLineColor: string,
      labelColor: string,
      tooltipBackgroundColor: string
    })
  }

  static defaultProps = {
    selectBy: "Total Req.",
    chartColor: {
      firstLineColor: "#00BCD4",
      secondLineColor: "#3F51B5",
      labelColor:"#757575",
      tooltipBackgroundColor:"#FFFFFF"  
    },
    isCompare: false,
    fontFamily: 'Roboto, "Helvetica Neue", sans-serif'
  }

  valueAxis;
  firstSeries;
  secondSeries;
  bullet;
  comparedBullet;
  drawFunction(chartId, prevChart, am4core, am4charts) {
    const { isCompare, data, selectBy, firstRange, secondRange, chartColor, fontFamily } = this.props;
    let chart = prevChart;

        const htmlToolTipContent =  ReactDOMServer.renderToString(
          <ChartTooltip
            isCompare={isCompare}
            chartValueLabel={selectBy}
            firstValueLabel={firstRange}
            secondValueLabel={secondRange}
            firstValue={FIRST_VALUE}
            secondValue={SECOND_VALUE}
            dataChangeValue={DATE_CHANGE_VALUE}
          />
        )


        if(!chart) {
            // Create new chart
            chart = am4core.create(chartId, am4charts.XYChart);
            chart.zoomOutButton.disabled = true;

            //Create X axis for time
            const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
            categoryAxis.renderer.grid.template.strokeOpacity = 0;
            categoryAxis.dataFields.category = TIME;
            categoryAxis.cursorTooltipEnabled = false;
            categoryAxis.startLocation = 0;
            categoryAxis.endLocation = 1;
            categoryAxis.renderer.labels.template.fontSize = 12;
            categoryAxis.renderer.labels.template.fontFamily = fontFamily;
            categoryAxis.renderer.labels.template.fill = am4core.color(chartColor.labelColor);

            //Create Y axis for value
            this.valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            this.valueAxis.renderer.grid.template.strokeOpacity = 0.1;
            this.valueAxis.cursorTooltipEnabled = false;
            this.valueAxis.renderer.labels.template.fontSize = 12;
            this.valueAxis.renderer.labels.template.fill = am4core.color(chartColor.labelColor);
            this.valueAxis.fontFamily = fontFamily;
            this.valueAxis.title.fontSize = 14;
            this.valueAxis.title.fontWeight = 500;
            this.valueAxis.title.fontFamily = fontFamily;
            this.valueAxis.title.fill = am4core.color(chartColor.labelColor);

            // Create first LineSeries
            this.firstSeries = chart.series.push(new am4charts.LineSeries());
            this.firstSeries.dataFields.valueY = FIRST_VALUE;
            this.firstSeries.dataFields.categoryX = TIME;
            this.firstSeries.stroke = am4core.color(chartColor.firstLineColor);
            this.firstSeries.strokeWidth = 3;

            this.bullet = this.firstSeries.bullets.push(new am4charts.CircleBullet());
            this.bullet.circle.strokeWidth = 2;
            this.bullet.circle.radius = 4;
            this.bullet.circle.fill = am4core.color(chartColor.firstLineColor);

            //Create HTML toolTips
            this.firstSeries.tooltip.getFillFromObject = false;
            this.firstSeries.tooltip.background.fill = am4core.color(chartColor.tooltipBackgroundColor);
            this.firstSeries.tooltip.tooltipContainer.exportable = false;

            this.secondSeries = chart.series.push(new am4charts.LineSeries());
            this.secondSeries.dataFields.valueY = SECOND_VALUE;
            this.secondSeries.dataFields.categoryX = TIME;
            this.secondSeries.stroke = am4core.color(chartColor.secondLineColor);
            this.secondSeries.strokeWidth = 3;
            this.comparedBullet = this.secondSeries.bullets.push(new am4charts.CircleBullet());
            this.comparedBullet.circle.strokeWidth = 2;
            this.comparedBullet.circle.radius = 4;
            this.comparedBullet.circle.fill = am4core.color(chartColor.secondLineColor);

            // Create cursor
            chart.cursor = new am4charts.XYCursor();
            chart.cursor.lineX.exportable = false;
            chart.cursor.lineY.exportable = false;
            chart.cursor.lineY.strokeWidth = 0;
            chart.cursor.lineX.stroke = am4core.color(chartColor.labelColor);
            chart.cursor.lineX.strokeWidth = 1;
            chart.cursor.lineX.strokeOpacity = 1;
            chart.cursor.behavior = "none"; // Disable zoom
        }

        if (isCompare) {
          this.secondSeries.show();    
        } else if (this.secondSeries) {
          this.secondSeries.hide();
        }

        if (data.length === 1) {
          this.bullet.disabled = false;
          this.comparedBullet.disabled = false;
        } else {
          this.bullet.disabled = true;
          this.comparedBullet.disabled = true;
        }

        // Update toolTip for 1st line
        this.firstSeries.tooltipHTML = htmlToolTipContent;

        // Update text for line serie
        this.valueAxis.title.text = selectBy;

        chart.data = data;
        return chart;
    }
}




