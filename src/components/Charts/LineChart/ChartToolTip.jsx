import React, { Component } from 'react';
import styles from './styles.scss';
import { string } from 'prop-types';

export default class ChartToolTip extends Component {

    static propTypes = {
        chartValueLabel: string,
        firstValue: string, 
    };

    static defaultProps = {
        changeLabel: "Change",
    };

    render() {
      const {
        chartValueLabel,
        firstValue,
      } = this.props;

      return (
        <div data-test="tooltipChart" className={styles.boxTooltip}>
          <div>
            <div data-test="tooltipChartTime" className={styles.title}>{"{time}"}</div>
            <hr className={styles.dividerTooltip}/>
              {
                chartValueLabel && 
                <div className={styles.firstChoice}>
                  {chartValueLabel}: 
                  <span data-test="tooltipChartFirstValue" className={styles.firstValue}>
                    {`{${firstValue}}`}
                  </span>
                </div>
              }   
          </div>
        </div>
      );
  }
}
