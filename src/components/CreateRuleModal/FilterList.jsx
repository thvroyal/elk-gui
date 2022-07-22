import { CloseIcon } from '@chakra-ui/icons';
import { Box, Button, Divider, Flex, FormLabel, HStack, IconButton, Input, Text, VStack } from '@chakra-ui/react';
import { useRef } from 'react';
import { fieldLabelMap } from '../../pages/Dashboard/constants';

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

const Pill = ({ label, value, color = '#38A169', onChange, index }) => {
  const inputRef = useRef();
  const handleChangeInput = () => {
    const value = inputRef.current?.value;
    onChange && onChange(label, value, index);
  }
  return (
    <>
      <Text fontSize="sm" color={color}>{fieldLabelMap[label]}</Text>
      <Input ref={inputRef} value={value} size='sm' width="130px" borderRadius="6px" onChange={handleChangeInput} />
    </>
  )
}
const FilterList = ({ title, color, data, onChange, onAddMore, onDeleteItem }) => {
    const isShowLine = data.length > 1;

    return (
      <>
        <FormLabel mt={4}>{title}</FormLabel>
        <Flex justify="left">
          {isShowLine && <Box w="2px" h="inherit" bgColor="#B3D1ED" borderRadius="full" my="15.7px" />}
          <VStack spacing="12px" align="left" w="523px" ml="-1.5px" overflow="auto">
            {data && data.map((cs, index) => {
              const elements = [];
              for (const [key, value] of Object.entries(cs)) {
                elements.push(
                  <HStack spacing="4px" key={`${title}_${index}${key}`}>
                    <Pill label={key} value={value} color={color} onChange={onChange} index={index} />
                  </HStack>
                )
              }
              if (elements.length > 0) {
                elements.push(
                  <IconButton 
                    key="delete-icon"
                    colorScheme='red'
                    aria-label='Delete'
                    size="xs"
                    variant="ghost"
                    onClick={() => onDeleteItem(title, index)}
                    icon={<CloseIcon />}
                  />
                )
              }
              return (
                <Flex align="center" key={`${cs}_${index}`}>
                  {isShowLine && <Box w="12px" h="2px" bgColor="#B3D1ED" borderRadius="full" mr="4px" />}
                  <Box overflow="auto" flex="1">
                    <HStack spacing="10px" py="1px">{elements}</HStack>
                  </Box>
                </Flex>
              )
            })}
          </VStack>
        </Flex>
        <Button colorScheme="blue" variant="ghost" my="16px" ml="16px" onClick={() => onAddMore(title)}>Add more</Button>
        <Divider />
      </>
    )
}

export default FilterList;