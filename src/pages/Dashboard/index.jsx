import { Box, Button, ButtonGroup, Container, Flex, Heading, HStack, Input, Select, Tooltip, useToast } from '@chakra-ui/react';
import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';
import HorizontalBarChart from '../../components/Charts/HorizontalBarChart';
import LineChart from '../../components/Charts/LineChart';
import PieChart from '../../components/Charts/PieChart';
import CreateRuleModal from '../../components/CreateRuleModal';
import ListRulesDrawer from '../../components/ListRulesDrawer';
import Notifications from '../../components/Notifications';
import { IP_CHART_ID, LOG_FILES, REQUESTS_CHART_ID, REQUEST_THRESHOLD_DEFAULT, TOP_VALUE_CHART_ID } from './constants';
import { generatePayloadApi, getDataWithPayload, getNotifications, resolveProblem } from './helpers';
import PickDate from './PickDate';

const MAP_DURATION = {
  seconds: 1,
  minutes: 60,
  hours: 60*60,
  days: 60*60*24,
};

const mockDataNotify = [
  {
      "_id" : "62d0170dc6a12f78f1dc9204", 
      "time" : "2022-07-14T13:15:40.384Z", 
      "file" : "/etc/passwd", 
      "process" : "dpkg", 
      "actor" : "root", 
      "resolved" : false 
  },
  {
    "_id" : "62d0170dc6a12f78f1dc9205", 
    "time" : "2022-07-14T13:15:40.384Z", 
    "file" : "/etc/passwd", 
    "process" : "dpkg", 
    "actor" : "root", 
    "resolved" : true 
},
{
  "_id" : "62d0170dc6a12f78f1dc9206", 
  "time" : "2022-07-10T13:15:40.384Z", 
  "file" : "/etc/passwd", 
  "process" : "dpkg", 
  "actor" : "root", 
  "resolved" : false 
}
];


export default function Dashboard() {
  const [request, setRequest] = useState(REQUEST_THRESHOLD_DEFAULT);
  const [perTime, setPerTime] = useState(1);
  const [unit, setUnit] = useState('seconds'); //default: second
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [ipChartData, setIpChartData] = useState([]);
  const [requestChartData, setRequestChartData] = useState([]);
  const [osChartData, setOsChartData] = useState([]);
  const [sourceId, setSourceId] = useState(0);
  const [realtime, setRealtime] = useState(false);
  const [intervalIdState, setIntervalIdState] = useState(null);
  const [notifyData, setNotifyData] = useState([]);
  
  const warningToast = useToast();
  
  useEffect(() => {
    async function fetchData(fnSetData, type) {
      const _payload = generatePayloadApi(startDate, endDate, type);
      const responseData = await getDataWithPayload(_payload, LOG_FILES[sourceId]);
      fnSetData(responseData);
    }
    
    if (!realtime) {
      Promise.all([
        fetchData(setRequestChartData, REQUESTS_CHART_ID),
        fetchData(setIpChartData, IP_CHART_ID),
        fetchData(setOsChartData, TOP_VALUE_CHART_ID)
      ]);
      clearInterval(intervalIdState);
      return;
    }
    
    const intervalId = setInterval(async () => {
      setEndDate(new Date());
      await Promise.all([
        fetchData(setRequestChartData, REQUESTS_CHART_ID),
        // fetchData(setIpChartData, IP_CHART_ID),
        // fetchData(setOsChartData, TOP_VALUE_CHART_ID)
      ]);
      
      // handle alert notifications
      if (requestChartData) {
        //get list
        const numOfRequests = MAP_DURATION[unit] * perTime;
        const newRequestAtTime = _.slice(requestChartData, requestChartData.length - numOfRequests);
        const maxRequest = _.maxBy(newRequestAtTime, (timestamp) => timestamp['doc_count']);
        
        if (_.get(maxRequest, 'doc_count', 0) >= request) {
          if (!warningToast.isActive('warning-toast')){
            warningToast({
              id: 'warning-toast',
              title: `DDoS detection!`,
              status: 'error',
              isClosable: true,
              position: 'top',
            })
          }
        }
      }
    }, perTime * MAP_DURATION[unit] * 1000);
    setIntervalIdState(intervalId);
  
    return () => clearInterval(intervalId);
  },[startDate, endDate, sourceId, perTime, realtime, unit]);
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      getNotifications().then(res => {
          setNotifyData(res.data);
      })
    }, 1000);
    
    return () => clearInterval(intervalId);

}, []);
  
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
  
  const onChangeUnit = (event) => {
    setUnit(event.target.value);
  }
  
  const handleClickNow = () => {
    setEndDate(new Date());
    setRealtime(!realtime);
  }
  const handleClickRefresh = () => {
    console.log({
      request, perTime, startDate, endDate
    })
  }
  const handleClickResolve = (data) => {
    const newData = {
      ...data,
      resolved: !data.resolved,
    }
    resolveProblem(newData).then(res => {
      if (res) {
        const newNotifyData = notifyData.map(noti => {
          if (noti._id.$oid === newData._id.$oid) {
            return newData;
          } else return noti;
        })
        setNotifyData(newNotifyData);
      }
    })
  }
  
  return (
    <Box bg="#F7FAFC">
      <Flex justify="space-between" align="center" bg="white" w="100%" py="24px" px="24px" borderBottom="1px" borderColor="#CBD5E0">
          <Heading as="h4" fontSize="24px" color="#171923" whiteSpace="nowrap">ELK-Dang Dashboard</Heading>
          <HStack spacing="20px">
            <Notifications notifyData={notifyData} onClickResolve={handleClickResolve} />
            <ButtonGroup size='sm' isAttached variant='outline'>
              <ListRulesDrawer placement="right" />
              <CreateRuleModal />
            </ButtonGroup>
          </HStack>
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
              variant={realtime ? 'solid' : 'outline'}
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
            <Select variant="unstyled" size="lg" width="100px" onChange={onChangeUnit}>
              <option value='seconds' defaultChecked>seconds</option>
              <option value='minutes'>minutes</option>
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
          fromDate={startDate.toString()}
          endDate={endDate.toString()}
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
