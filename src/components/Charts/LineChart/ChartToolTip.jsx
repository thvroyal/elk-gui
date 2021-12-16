import React, { Component } from 'react';
import { string } from 'prop-types';
import { Box, Flex } from '@chakra-ui/react';

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
        <Box color="rgba(0, 0, 0, 0.87)" fontSize="12px">
          <div>
            <Box data-test="tooltipChartTime" fontWeight="600">{"{key_as_string}"}</Box>
            <Box width="17px" borderBottom="2px" borderColor="#979797" marginY="7px" />
              {
                chartValueLabel && 
                <Flex color="rgba(0,0,0,0.87)" justify="space-between">
                  {chartValueLabel}: 
                  <Box data-test="tooltipChartFirstValue" marginLeft="50px" fontWeight="600">
                    {`{${firstValue}}`}
                  </Box>
                </Flex>
              }   
          </div>
        </Box>
      );
  }
}
