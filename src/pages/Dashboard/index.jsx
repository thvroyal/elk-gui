import { Box, Container, Heading, HStack, Input, Select, Button, Flex, Tooltip} from '@chakra-ui/react'
import React, { useRef, useState, useEffect } from 'react'
import HorizontalBarChart from '../../components/Charts/HorizontalBarChart';
import LineChart from '../../components/Charts/LineChart';
import PieChart from '../../components/Charts/PieChart';
import { IP_CHART_ID, LOG_FILES, REQUESTS_CHART_ID, REQUEST_THRESHOLD_DEFAULT, TOP_VALUE_CHART_ID } from './constants';
import { generatePayloadApi, getDataWithPayload } from './helpers';
import PickDate from './PickDate';

export default function Dashboard() {
  const [request, setRequest] = useState(REQUEST_THRESHOLD_DEFAULT);
  const [perTime, setPerTime] = useState(1);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [ipChartData, setIpChartData] = useState([]);
  const [requestChartData, setRequestChartData] = useState([]);
  const [osChartData, setOsChartData] = useState([]);
  const [sourceId, setSourceId] = useState(0);
  
  useEffect(() => {
    async function fetchData(fnSetData, type) {
      const _payload = generatePayloadApi(startDate, endDate, type);
      const responseData = await getDataWithPayload(_payload, LOG_FILES[sourceId]);
      fnSetData(responseData);
    }
    Promise.all([
      fetchData(setRequestChartData, REQUESTS_CHART_ID),
      fetchData(setIpChartData, IP_CHART_ID),
      fetchData(setOsChartData, TOP_VALUE_CHART_ID)
    ]);
    
  },[startDate, endDate, sourceId])
  
  const requestRef = useRef();
  const perTimeRef = useRef();
  
  const onChangeRequestInput = () => {
    setRequest(requestRef.current.value);
  }
  
  const onChangePerTimeInput = () => {
    setPerTime(perTimeRef.current.value);
  }
  
  const onChangeLogFile = (event) => {
    setSourceId(event.target.value);
  }
  
  const handleClickNow = () => {
    setEndDate(new Date());
  }
  const handleClickRefresh = () => {
    console.log({
      request, perTime, startDate, endDate
    })
  }
  
  return (
    <Box bg="#F7FAFC">
      <Flex justify="space-between" align="center" bg="white" w="100%" py="24px" px="24px" borderBottom="1px" borderColor="#CBD5E0">
          <Heading as="h4" fontSize="24px" color="#171923" whiteSpace="nowrap">ELK-Dang Dashboard</Heading>
          <Select width="300px" onChange={onChangeLogFile}>
            {LOG_FILES.map((filename, index) => (
              <option value={index} key={filename} defaultChecked={!index}>
                {filename}
              </option>
              )) 
            }
          </Select>
      </Flex>
      <Container maxW="1328px">
      <HStack spacing="32px" marginTop="26px">
        <HStack spacing="10px">
          <Box fontSize="18px" color="#2D3748">From</Box>
          <PickDate dateDefault={startDate} setDate={setStartDate}/>
        </HStack>
        <HStack spacing="10px">
          <Box fontSize="18px" color="#2D3748">To</Box>
          <PickDate dateDefault={endDate} setDate={setEndDate} />
          <Tooltip label="Update to now">
            <Button 
              size="sm" 
              colorScheme="teal" 
              variant='outline' 
              onClick={handleClickNow}
            >
              Now
            </Button>
          </Tooltip>
        </HStack>  
        <HStack spacing="10px">
          <Box fontSize="18px" color="#2D3748">Limit</Box>
          <Flex size="lg" width="100%" bg="white" borderRadius="6px" border="1px" borderColor="#E2E8F0" height="48px" 
            align="center"
            paddingLeft="12px"
          >
            <Input variant="unstyled" type="number" defaultValue={request} size="lg" maxWidth="80px" fontWeight={500} 
              ref={requestRef} onChange={onChangeRequestInput}
            />
            <Box whiteSpace="nowrap" fontSize="18px" marginRight="12px">request in</Box>
            <Input variant="unstyled" type="text" defaultValue={perTime} size="lg" maxW="60px" fontWeight={500} 
              ref={perTimeRef} onChange={onChangePerTimeInput}
            />
            <Select variant="unstyled" size="lg" width="100px">
              <option value='minutes' defaultChecked>minutes</option>
              <option value='hours'>hours</option>
              <option value='days'>days</option>
            </Select>
          </Flex>
        </HStack>      
        <Button size="lg" colorScheme="blue" onClick={handleClickRefresh}>Refresh</Button>
      </HStack>
      <Flex bg="white" borderRadius="6px" border="1px" borderColor="#CBD5E0"
        padding="10px" flexDirection="column" marginTop="32px" height="450px"
      >
        <Heading as="h5" size="xs" marginBottom="12px">Client IP request with timestamp</Heading>
        <LineChart 
          data={requestChartData}
          threshold={parseFloat(request)}
          fromDate={startDate}
          endDate={endDate}
        />
      </Flex>
      <Flex bg="white" borderRadius="6px" border="1px" borderColor="#CBD5E0"
        padding="10px" flexDirection="column" marginTop="32px" height="450px"
      >
        <Heading as="h5" size="xs" marginBottom="12px">Client IP</Heading>
          <PieChart 
            data={ipChartData} 
          />
      </Flex>
      <Flex bg="white" borderRadius="6px" border="1px" borderColor="#CBD5E0"
        padding="10px" flexDirection="column" marginY="32px" height="450px"
      >
        <Heading as="h5" size="xs" marginBottom="12px">Top values of OS</Heading>
          <HorizontalBarChart
            data={osChartData} 
            xAxisTitle="Count of records"
          />
      </Flex>
      </Container>
    </Box>
  )
}
