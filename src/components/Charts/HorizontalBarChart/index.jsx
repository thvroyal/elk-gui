import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { ReactAmChart } from '../../AmChartReact';
import { arrayOf, shape, string, number } from 'prop-types';
import { isEqual } from 'lodash';
import styles from './styles.scss';
import { Text } from '@chakra-ui/react';

export default class HorizontalBarChart extends ReactAmChart {
  static propTypes = {
    data: arrayOf(
      shape({
        key: string.isRequired,
        doc_count: number.isRequired,
        fillColor: string   //optional when each column has different color
      })
    ).isRequired,
    fontColor: string,
    xAxisTitle: string,
    yAxisTitle: string,
    fontFamily: string,
    defaultFillColor: string,
    yAxisFontSize: number,
    titleFontSize: number
  }

  static defaultProps = {
    titleFontSize: 14,
    yAxisFontSize: 14,
    defaultFillColor: '#4CAF50',
    fontColor: '#CBD5E0',
    fontFamily: 'Roboto, "Helvetica Neue", sans-serif'
  };

  prevChartData;
  columnSeries;
  valueAxis;
  drawFunction(chartId, prevChart, am4core, am4charts) {
    const {
      data,
      fontColor,
      defaultFillColor,
      xAxisTitle,
      yAxisTitle,
      yAxisFontSize,
      titleFontSize,
      fontFamily, 
      isAvgCost
    } = this.props;
    let chart = prevChart;

    if (!chart) {
      chart = am4core.create(chartId, am4charts.XYChart);
      const am4fontColor = am4core.color(fontColor);

      // set category Y
      const categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = 'key';
      categoryAxis.renderer.inversed = true;
      categoryAxis.renderer.minGridDistance = 30;
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.labels.template.align = 'left';
      categoryAxis.renderer.labels.template.paddingRight = '20';
      categoryAxis.cursorTooltipEnabled = false;
      this.setFont(categoryAxis, yAxisFontSize, am4fontColor, !yAxisTitle && 500, fontFamily);

      // only show top & bottom grid
      categoryAxis.renderer.grid.template.adapter.add('visible', (value, target) => {
        return target.dataItem.index === -1 || target.dataItem.index === 0;
      });

      // set yAxisTitle if any
      if (yAxisTitle) {
        categoryAxis.title.fontSize = titleFontSize;
        categoryAxis.title.fontFamily = fontFamily;
        categoryAxis.title.fontWeight = 500;
        categoryAxis.title.text = yAxisTitle;
        categoryAxis.title.fill = am4fontColor;
      }

      // set x axis
      this.valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
      this.valueAxis.min = 0;
      this.valueAxis.title.fontSize = titleFontSize;
      this.valueAxis.title.fontFamily = fontFamily;
      this.valueAxis.title.fontWeight = 500;
      this.valueAxis.title.fill = am4fontColor;
      this.valueAxis.renderer.minGridDistance = 100;
      this.valueAxis.cursorTooltipEnabled = false;
      if(isAvgCost) {
        this.valueAxis.numberFormatter.numberFormat = "#.00";
      }    
      this.setFont(this.valueAxis, 12, am4fontColor, 400, fontFamily);

      //set column
      this.columnSeries = chart.series.push(new am4charts.ColumnSeries());
      this.columnSeries.strokeWidth = 0;
      this.columnSeries.yAxes = categoryAxis;
      this.columnSeries.dataFields.valueX = 'doc_count';
      this.columnSeries.dataFields.categoryY = 'key';
      this.columnSeries.cursorTooltipEnabled = false;
      this.columnSeries.columns.template.height = am4core.percent(50);
      this.columnSeries.columns.template.fill = am4core.color(defaultFillColor);
      this.columnSeries.columns.template.propertyFields.fill = 'fillColor';
      this.columnSeries.tooltip.getFillFromObject = false;
      this.columnSeries.tooltip.background.fill = '#ffffff';

      chart.cursor = new am4charts.XYCursor();
      chart.cursor.lineX.strokeWidth = 0;
      chart.cursor.lineY.strokeWidth = 0;
      chart.cursor.lineX.exportable = false;
      chart.cursor.lineY.exportable = false;
      chart.cursor.behavior = 'none';
    }

    if (!isEqual(this.prevChartData, data)) {
      chart.data = data;
      this.prevChartData = data;

      // Updates the title and tooltip when selection changes in PlacementAnalytics.
      this.valueAxis.title.text = xAxisTitle;
      this.columnSeries.columns.template.tooltipHTML = ReactDOMServer.renderToString(this.drawToolTip());
    }

    return chart;
  }

  drawToolTip() {
    return (
      <div className={styles.toolTip}>
        <div className={styles.divider}/>
        <div className={styles.data}>
          <Text color="black" fontSize="12px" fontWeight="600">{'{categoryY} '}</Text>
           <Text color="black" fontSize="14px">{`{valueX}`}</Text>
        </div>
      </div>
    );
  }

  setFont(series, size, color, weight = 400, fontFamily) {
    series.fontSize = size;
    series.fontWeight = weight;
    series.fontFamily = fontFamily;
    series.renderer.labels.template.fill = color;
  }
}
