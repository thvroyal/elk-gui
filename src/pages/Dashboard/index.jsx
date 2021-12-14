import { Box, Container, Heading, HStack, Input, Select, Button, Flex} from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import LineChart from '../../components/Charts/LineChart';
import PieChart from '../../components/Charts/PieChart';
import PickDate from './PickDate'

export default function Dashboard() {
  const [request, setRequest] = useState(100000);
  const [perTime, setPerTime] = useState(1);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  
  const requestRef = useRef();
  const perTimeRef = useRef();
  
  const onChangeRequestInput = () => {
    setRequest(requestRef.current.value);
  }
  
  const onChangePerTimeInput = () => {
    setPerTime(perTimeRef.current.value);
  }
  
  const handleClickUpdate = () => {
    console.log({
      request, perTime, startDate, endDate
    })
  }
  
  return (
    <Box bg="#F7FAFC">
      <Box bg="white" w="100%" py="24px" px="24px" borderBottom="1px" borderColor="#CBD5E0">
          <Heading as="h4" fontSize="24px" color="#171923">ELK-Dang Dashboard</Heading>
      </Box>
      <Container maxW="1328px">
      <HStack spacing="32px" marginTop="26px">
        <HStack spacing="10px">
          <Box fontSize="18px" color="#2D3748">From</Box>
          <PickDate dateDefault={startDate} setDate={setStartDate}/>
        </HStack>
        <HStack spacing="10px">
          <Box fontSize="18px" color="#2D3748">To</Box>
          <PickDate dateDefault={endDate} setDate={setEndDate}/>
        </HStack>  
        <HStack spacing="10px">
          <Box fontSize="18px" color="#2D3748">Limit</Box>
          <Flex size="lg" width="100%" bg="white" borderRadius="6px" border="1px" borderColor="#E2E8F0" height="48px" 
            align="center"
            paddingLeft="12px"
          >
            <Input variant="unstyled" type="text" defaultValue={request} size="lg" maxWidth="80px" fontWeight={500} 
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
        <Button size="lg" colorScheme="blue" onClick={handleClickUpdate}>Update</Button>
      </HStack>
      <Flex bg="white" borderRadius="6px" border="1px" borderColor="#CBD5E0"
        padding="10px" flexDirection="column" marginTop="32px" height="450px"
      >
        <Heading as="h5" size="xs" marginBottom="12px">Client IP request with timestamp</Heading>
        <LineChart data={[
          {
            time: '11:48',
            firstValue: '30000',
          },
          {
            time: '11:49',
            firstValue: '3000',
          },
          {
            time: '11:50',
            firstValue: '4000',
          }
        ]}/>
      </Flex>
      <Flex bg="white" borderRadius="6px" border="1px" borderColor="#CBD5E0"
        padding="10px" flexDirection="column" marginTop="32px" height="450px"
      >
        <Heading as="h5" size="xs" marginBottom="12px">Client IP</Heading>
          <PieChart data={[
            {
              address: '192.168.1.2',
              value: '30000'
            },
            {
              address: '192.168.1.4',
              value: '20000'
            },
            {
              address: '192.168.2.27',
              value: '1000'
            },
            {
              address: '192.168.11.22',
              value: '10200'
            }
          ]} 
          />
      </Flex>
      </Container>
    </Box>
  )
}
