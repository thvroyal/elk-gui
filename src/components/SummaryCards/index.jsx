import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';

const SummaryCards = ({ data }) => {
    
    const drawCard = ({ label, value, color }) => {
        return (
            <Flex 
                key={`${label}`} 
                flexDirection="column" 
                align="center"
                backgroundColor="white"
                px="30px"
                py="20px"
                borderRadius="8px"
                border="1px"
                borderColor="#CBD5E0"
                w="100%"
                _hover={{
                    borderColor: color ? color : "blue.600",
                }}
            >
                <Text color="gray.500">{label}</Text>
                <Text fontSize="40px" fontWeight="500" color={color ? color : "blue.600"}>{value}</Text>
            </Flex>
        )
    }
    return (
        <Flex justify="space-around" mt="32px" gridGap="60px" px="120px">
            {data && data.map(item => drawCard(item))}
        </Flex>
    )
};

export default SummaryCards;