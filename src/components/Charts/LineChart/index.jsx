import React from 'react';
import { arrayOf, number, shape, string } from 'prop-types';
import ReactDOMServer from "react-dom/server"; 
import { ReactAmChart } from "../../AmChartReact";
import ChartTooltip from "./ChartToolTip";
import moment from 'moment';

const FIRST_VALUE = "doc_count";
const TIME = "key_axis";

export default class LineChart extends ReactAmChart {
  static propTypes = {
    typeSelect: string,
    fontFamily: string,
    firstRange: string,
    secondRange: string,
    data: arrayOf(shape({
      key_as_string: string.isRequired,
      doc_count: number,
    })).isRequired,
    chartColor: shape({
      firstLineColor: string,
      secondLineColor: string,
      labelColor: string,
      tooltipBackgroundColor: string,
      thresholdLine: string,
    }),
    threshold: number,
    fromDate: string,
    endDate: string,
  }

  static defaultProps = {
    selectBy: "Total Req.",
    chartColor: {
      firstLineColor: "#00BCD4",
      secondLineColor: "#3F51B5",
      labelColor:"#757575",
      tooltipBackgroundColor:"#FFFFFF",
      thresholdLine: '#DC143C' 
    },
    fontFamily: 'Roboto, "Helvetica Neue", sans-serif',
    threshold: 0,
  }

  valueAxis;
  firstSeries;
  secondSeries;
  bullet;
  comparedBullet;
  avgLine;
  
  preProcessData = (data) => {
    if (data) {
      const { fromDate, endDate } = this.props;
      let newData = [...data];
      if (moment(data[0]?.key_as_string).toISOString() !== moment(fromDate).toISOString()) {
        const obj = {
          key_as_string: moment(fromDate).toISOString(),
          doc_count: 0,
        }
        newData = [obj,...newData];
      }
      
      if (moment(data[data.length - 1]?.key_as_string).toISOString() !== moment(endDate).toISOString()) {
        const obj = {
          key_as_string: moment(endDate).toISOString(),
          doc_count: 0,
        }
        newData = [...newData, obj];
      }
      return newData.map(item => {
        return {
          ...item,
          key_axis: moment(item.key_as_string).format('DD/MM@hh:mm'),
          key_as_string: moment(item.key_as_string).format('DD/MM/YYYY hh:mm:ss')
        }
      })
    }
    else {
      return [];
    }
  }
  drawFunction(chartId, prevChart, am4core, am4charts) {
    const { data, selectBy, firstRange, secondRange, chartColor, fontFamily, threshold } = this.props;
    let chart = prevChart;

        const htmlToolTipContent =  ReactDOMServer.renderToString(
          <ChartTooltip
            chartValueLabel={selectBy}
            firstValueLabel={firstRange}
            secondValueLabel={secondRange}
            firstValue={FIRST_VALUE}
          />
        )


        if(!chart) {
            // Create new chart
            chart = am4core.create(chartId, am4charts.XYChart);
            chart.zoomOutButton.disabled = true;

            //Create X axis for time
            const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
            dateAxis.renderer.grid.template.strokeOpacity = 0;
            dateAxis.dataFields.category = TIME;
            dateAxis.cursorTooltipEnabled = false;
            dateAxis.startLocation = 0;
            dateAxis.endLocation = 1;
            dateAxis.renderer.labels.template.fontSize = 12;
            dateAxis.renderer.labels.template.fontFamily = fontFamily;
            dateAxis.renderer.labels.template.fill = am4core.color(chartColor.labelColor);

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
            this.firstSeries.dataFields.dateX = TIME;
            this.firstSeries.stroke = am4core.color(chartColor.firstLineColor);
            this.firstSeries.strokeWidth = 3;

            this.bullet = this.firstSeries.bullets.push(new am4charts.CircleBullet());
            this.bullet.circle.strokeWidth = 2;
            this.bullet.circle.radius = 4;
            this.bullet.circle.fill = am4core.color(chartColor.firstLineColor);
            
            // Create threshold line
            this.avgLine = this.valueAxis.axisRanges.create();
            this.avgLine.value = 0;
            this.avgLine.grid.stroke = am4core.color(chartColor.thresholdLine);
            this.avgLine.grid.strokeWidth = 2;
            this.avgLine.grid.strokeOpacity = 1;
            this.avgLine.grid.above = true;

            //Create HTML toolTips
            this.firstSeries.tooltip.getFillFromObject = false;
            this.firstSeries.tooltip.background.fill = am4core.color(chartColor.tooltipBackgroundColor);
            this.firstSeries.tooltip.tooltipContainer.exportable = false;

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

        if (data.length === 1) {
          this.bullet.disabled = false;
        } else {
          this.bullet.disabled = true;
        }

        // Update toolTip for 1st line
        this.firstSeries.tooltipHTML = htmlToolTipContent;

        // Update text for line serie
        this.valueAxis.title.text = selectBy;

        chart.data = this.preProcessData(data);
        this.avgLine.value = threshold;
        return chart;
    }
}




