import { Input, Text, HStack, Box, Flex, Spacer, VStack, FormLabel, Button } from '@chakra-ui/react';
import React, { useRef, useState } from 'react';

const mockData = [
    {
      "destination_ip": "192.168.56.103",
      "process_name": "filebeat",
      "actor": "roy_99",
    }, 
    { "process_name" : "auditbeat" }, 
    { "actor" : "dangvh" },
    { destination_ip: "192.168.12.23"}
];

const Pill = ({ field, value, color = '#38A169' }) => {
  
  return (
    <>
      <Text fontSize="sm" color={color}>{field}</Text>
      <Input value={value} size='sm' width="130px" borderRadius="6px" />
    </>
  )
}
const FilterList = () => {
    return (
      <>
        <FormLabel mt={4}>Allowlist</FormLabel>
        <Flex justify="left">
          <Box w="2px" h="inherit" bgColor="#B3D1ED" borderRadius="full" my="15.7px" />
          <VStack spacing="12px" align="left" w="523px" ml="-1.5px" overflow="auto">
            {mockData.map(cs => {
              const elements = [];
              for (const [key, value] of Object.entries(cs)) {
                elements.push(
                  <HStack spacing="4px">
                    <Pill field={key} value={value} />
                  </HStack>
                )
              }
              return (
                <Flex align="center">
                  <Box w="12px" h="2px" bgColor="#B3D1ED" borderRadius="full" mr="4px" />
                  <Box overflow="auto" flex="1">
                    <HStack spacing="10px" py="1px">{elements}</HStack>
                  </Box>
                </Flex>
              )
            })}
          </VStack>
        </Flex>
        <Button colorScheme="blue" variant="ghost" my="16px" ml="16px">Add more</Button>
      </>
    )
}

export default FilterList;