import { Icon } from '@chakra-ui/icons';
import { Box, Flex, Text, useRadio } from '@chakra-ui/react';
import React from 'react';

const AlertCard = (props) => {
    const { getInputProps, getCheckboxProps } = useRadio(props);
    
    const input = getInputProps();
    const checkbox = getCheckboxProps();
    return (
        <Box as='label' flex={1}>
            <input {...input} />
            <Flex
                {...checkbox}
                cursor='pointer'
                borderWidth='1px'
                borderRadius='12px'
                direction="column"
                color="gray.600"
                align="center"
                _checked={{
                bg: 'blue.800',
                color: 'blue.500',
                borderColor: 'blue.500',
                }}
                p="24px"
            >
                <Icon as={props.iconEle} boxSize="24px" />
                <Text fontSize="16px" textTransform="capitalize" fontWeight={500}>{props.value}</Text>
            </Flex>
        </Box>
    )
}

export default AlertCard;