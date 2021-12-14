import React, { Component } from  'react';
import { isEqual } from 'lodash';
import styles from './styles.scss';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { Box } from '@chakra-ui/react';

am4core.useTheme(am4themes_animated);
am4core.options.commercialLicense = true;

const uniqueId = Symbol('unique_id');
const amChartIdTracking = {};

function generateUniqueId(componentName = 'AmChart') {
  if (amChartIdTracking.componentName) {
    amChartIdTracking.componentName++;
  } else {
    amChartIdTracking.componentName = 1;
  }
  return `${componentName}_${amChartIdTracking.componentName}`;
}

export class ReactAmChart extends Component {
  constructor(props) {
    super(props);
    this.uniqueId = generateUniqueId(this.constructor.name);
  }

  componentDidMount() {
    const newChart = this.drawFunction(this.uniqueId, this.chart, am4core, am4charts);
    newChart[uniqueId] = this.uniqueId;
    this.chart = newChart;
  }

  componentDidUpdate(prevProps, prevState) {
    const oldProps = { ...prevProps };
    const newProps = { ...this.props };
    delete oldProps.defaultChartStyle;
    delete newProps.defaultChartStyle;

    if ( !isEqual(oldProps, newProps) || !isEqual(prevState, this.state) ) {
      const newChart = this.drawFunction(this.uniqueId, this.chart, am4core, am4charts);

      if(!newChart[uniqueId]){
        this.chart && this.chart.dispose();
        newChart[uniqueId] = this.uniqueId;
      }
      this.chart = newChart;
    }
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    } else {
      console.warn(`${this.constructor.name} - Missing chart reference`);
    }
  }

  get am4core() {
    return am4core;
  }

  get am4charts() {
    return am4charts;
  }

  chart;
  /**
   * Draw chart function
   * @param {string} chartId 
   * @param {amChart} chart - an instance of amChart
   * @param {am4core} am4core - imported core lib of @amcharts/amcharts4/core
   * @param {am4charts} am4charts - imported charts from @amcharts/amcharts4/charts
   * @return {amChart} chart instance
   * 
   * @typedef {Object} amChart
   * @property {Array} data Chart Data
   * 
   * @typedef {Object} am4core
   * @property {function} create - create a new chart function
   * 
   * @typedef {Object} am4charts
   * @property {Object} ChartType - Chart type ex: XYChart, PieChart
   */
  drawFunction(chartId, chart, am4core, am4charts) {
    console.warn(`${this.constructor.name} - drawFunction is not overriden`);
  }

  render() {
    return (
      <Box id={this.uniqueId} width="100%" height="100%" />
    )
  }
}
