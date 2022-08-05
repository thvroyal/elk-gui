import { Box, Button, ButtonGroup, Container, Flex, Heading, HStack, Select } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import HorizontalBarChart from '../../components/Charts/HorizontalBarChart';
import LineChart from '../../components/Charts/LineChart';
import PieChart from '../../components/Charts/PieChart';
import CreateRuleModal from '../../components/CreateRuleModal';
import ListRulesDrawer from '../../components/ListRulesDrawer';
import Notifications from '../../components/Notifications';
import SummaryCards from '../../components/SummaryCards';
import { getNotifications, resolveProblem, getDataFromChartApi } from './helpers';
import PickDate from './PickDate';
import moment from 'moment';

const MAP_DURATION = {
  seconds: 1,
  minutes: 60,
  hours: 60*60,
  days: 60*60*24,
};


export default function Dashboard() {
  const yesterday = moment().subtract(1, 'days').toDate();
  const [startDate, setStartDate] = useState(yesterday);
  const [endDate, setEndDate] = useState(new Date());
  const [host, setHost] = useState('agent1');
  const [privileged, setPrivileged] = useState([]);
  const [networkUser, setNetworkUser] = useState([]);
  const [requestChartData, setRequestChartData] = useState([]);
  const [requestCount, setRequestCount] = useState(0);
  const [response4xx, setResponse4xx] = useState(0);
  const [response5xx, setResponse5xx] = useState(0);
  const [notifyData, setNotifyData] = useState([]);
  
  useEffect(() => {
    handleClickUpdate();
  }, []);
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      getNotifications().then(res => {
          setNotifyData(res.data);
      })
    }, 1000);
    
    return () => clearInterval(intervalId);

}, []);
  
  const handleClickUpdate = () => {
    getDataFromChartApi('request-line', startDate, endDate, host)
      .then(res => {
        setRequestChartData(res);
      });
      
    getDataFromChartApi('request-count', startDate, endDate, host)
      .then(res => {
        setRequestCount(res);
      });
      
    getDataFromChartApi('status-4xx', startDate, endDate, host)
    .then(res => {
      setResponse4xx(res);
    });
    
    getDataFromChartApi('status-5xx', startDate, endDate, host)
    .then(res => {
      setResponse5xx(res);
    });
    
    getDataFromChartApi('privileged-process', startDate, endDate, host)
      .then(res => {
        setPrivileged(res);
      });
      
    getDataFromChartApi('network-user', startDate, endDate, host)
    .then(res => {
      setNetworkUser(res);
    });
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
    <Box>
      <Flex justify="space-between" align="center" bg="whiteAlpha.100" w="100%" py="24px" px="24px" borderBottom="1px" borderColor="whiteAlpha.300">
          <Heading as="h4" fontSize="24px" color="white" whiteSpace="nowrap">ELK-Dang Dashboard</Heading>
          <HStack spacing="20px">
            <Notifications notifyData={notifyData} onClickResolve={handleClickResolve} />
            <ButtonGroup size='sm' isAttached variant='outline'>
              <ListRulesDrawer placement="right" />
              <CreateRuleModal />
            </ButtonGroup>
          </HStack>
      </Flex>
      <Container maxW="1328px">
        <HStack spacing="32px" marginTop="26px" justify="center">
          <HStack spacing="10px">
            <Box fontSize="18px" color="gray.400">From</Box>
            <PickDate dateDefault={startDate} setDate={setStartDate}/>
          </HStack>
          <HStack spacing="10px">
            <Box fontSize="18px" color="gray.400">To</Box>
            <PickDate dateDefault={endDate} setDate={setEndDate} />
          </HStack>
          <HStack spacing="10px">
            <Box fontSize="18px" color="gray.400">Host</Box>
            <Select w="150px" size="lg" onChange={(e) => setHost(e.target.value)} value={host}>
              <option value="agent1">Agent 1</option>
              <option value="agent2">Agent 2</option>
            </Select>
          </HStack>
          <Button size="lg" colorScheme="blue" onClick={handleClickUpdate}>Update</Button>
        </HStack>
        
        <SummaryCards 
          data={[
            {
              label: 'Total Requests',
              value: requestCount,
            },
            {
              label: '4xx Response',
              value: `${((response4xx / requestCount) * 100).toFixed(2)}%`,
              color: 'red.500'
            },
            {
              label: '5xx Response',
              value: `${((response5xx / requestCount) * 100).toFixed(2)}%`,
              color: 'red.500'
            },
          ]} 
        />
        
        <Flex bg="gray.700" borderRadius="6px" border="1px" borderColor="gray.600"
          padding="10px" flexDirection="column" marginTop="32px" height="450px"
        >
          <Heading as="h5" size="xs" marginBottom="12px">Client IP request with timestamp</Heading>
          <LineChart 
            data={requestChartData}
            fromDate={startDate.toString()}
            endDate={endDate.toString()}
          />
        </Flex>
        <Flex bg="gray.700" borderRadius="6px" border="1px" borderColor="gray.600"
          padding="10px" flexDirection="column" marginTop="32px" height="450px"
        >
          <Heading as="h5" size="xs" marginBottom="12px">Process interacting sensitive files</Heading>
            <PieChart 
              data={privileged} 
            />
        </Flex>
        <Flex bg="gray.700" borderRadius="6px" border="1px" borderColor="gray.600"
          padding="10px" flexDirection="column" marginY="32px" height="450px"
        >
          <Heading as="h5" size="xs" marginBottom="12px">User running network process</Heading>
            <HorizontalBarChart
              data={networkUser} 
              xAxisTitle="Count of records"
            />
        </Flex>
      </Container>
    </Box>
  )
}
