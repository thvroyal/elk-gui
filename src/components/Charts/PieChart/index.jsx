import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { ReactAmChart } from '../../AmChartReact';
import { arrayOf, shape, string, number } from 'prop-types';
import { isEqual, cloneDeep } from 'lodash';

import { Box, Divider, Text } from '@chakra-ui/react';

export default class PieChart extends ReactAmChart {
  static propTypes = {
    data: arrayOf(shape({
      key: string,
      doc_count: number
    })),
    innerRadius: number,
    labelFontSize: number,
    tooltipFontSize: number,
    valueLabel: string
  }

  static defaultProps = {
    labelColor: 'rgba(0,0,0,0.87)',
    strokeColor: '#FFFFFF',
    innerRadius: 35,
    labelFontSize: 13,
    tooltipFontSize: 12,
    fontFamily: 'Roboto, "Helvetica Neue", sans-serif',
    valueLabel: 'Reqs'
  }

  prevChartData;
  pieSeries;
  drawFunction(chartId, preChart, am4core, am4charts) {
    const { data, strokeColor, innerRadius, labelFontSize, fontFamily, labelColor, isPercentageDisabled } = this.props;
    let chart = preChart;
    if (!chart) {
      chart = am4core.create(chartId, am4charts.PieChart);
      chart.innerRadius = am4core.percent(innerRadius);
      
      //Chart legend
      chart.legend = new am4charts.Legend();
      chart.legend.useDefaultMarker = true;
      chart.legend.position = "bottom";
      chart.legend.labels.template.text = "[{color}]{key}";
      chart.legend.valueLabels.template.disabled = true;
      var marker = chart.legend.markers.template.children.getIndex(0);
      marker.cornerRadius(12, 12, 12, 12);
      marker.strokeWidth = 2;
      marker.strokeOpacity = 1;
      marker.stroke = am4core.color("#ccc");

      this.pieSeries = chart.series.push(new am4charts.PieSeries());
      this.pieSeries.dataFields.value = 'doc_count';
      this.pieSeries.dataFields.category = 'key';
      this.pieSeries.slices.template.stroke = am4core.color(strokeColor);
      this.pieSeries.slices.template.strokeWidth = 2;
      this.pieSeries.slices.template.strokeOpacity = 1;
      this.pieSeries.calculatePercent = true;

      // Set chart labels
      const percentageValue = !isPercentageDisabled ? ` ({value.percent.formatNumber('#.0')}%)` : '';
      this.pieSeries.labels.template.text = `{key}: {doc_count}${percentageValue}`;
      this.pieSeries.labels.template.fontSize = labelFontSize;
      this.pieSeries.labels.template.fontFamily = fontFamily;
      this.pieSeries.labels.template.fill = am4core.color(labelColor);
      
      // Create initial animation
      this.pieSeries.hiddenState.properties.opacity = 1;
      this.pieSeries.hiddenState.properties.endAngle = 90;
      this.pieSeries.hiddenState.properties.startAngle = 90;
      chart.hiddenState.properties.innerRadius = am4core.percent(50);
      chart.hiddenState.properties.radius = am4core.percent(100);

      // Set tooltip
      this.pieSeries.tooltip.getFillFromObject = false;
      
      //disable animation when click
      this.pieSeries.slices.template.states.getKey("active").properties.shiftRadius = 0;      
    }

    if (!isEqual(this.prevChartData, data)) {
      this.prevChartData = cloneDeep(data);
      this.pieSeries.slices.template.adapter.add("hidden", this.hideZeroValue);
      this.pieSeries.ticks.template.adapter.add("hidden", this.hideZeroValue);
      this.pieSeries.labels.template.adapter.add("hidden", this.hideZeroValue);
      this.pieSeries.slices.template.tooltipHTML = ReactDOMServer.renderToString(this.drawToolTip());
      const percentageValue = !isPercentageDisabled ? ` ({value.percent.formatNumber('#.0')}%)` : '';
      this.pieSeries.labels.template.text = `{key}: {doc_count}${percentageValue}`;
      this.pieSeries.ticks.template.disabled = true;
      this.pieSeries.labels.template.disabled = true;
      chart.data = data;
    }

    return chart;
  }

  //https://amcharts.com/docs/v4/tutorials/hiding-small-pie-slices/
  hideZeroValue(hidden, target) {
    return target.dataItem.values.value.percent === 0;
  }

  drawToolTip() {
    const { valueLabel } = this.props;
    return ( 
      <Box p="5px" color="rgba(0, 0, 0, 0.87)" fontSize="12px" minW="120px">
        <Text p="2px 0" fontWeight="500" color="black" fontSize="14px">{'{key}'}</Text>
        <Divider />
        <Box p="7px 0 3px">
          <Text color="black">{valueLabel}</Text>
          <Text color="black" fontWeight="500">{`{doc_count}`}</Text>
        </Box>
      </Box>
    );
  }
}
