import { DeleteIcon } from '@chakra-ui/icons';
import { Flex, HStack, IconButton, Switch, Text } from '@chakra-ui/react';
import CreateRuleModal from '../CreateRuleModal';

const RowRule = ({ data, onClickDelete }) => {
    const { name, description, onGetRule } = data;
    
    return (
        <Flex borderBottomWidth="1px" borderBottomColor="#E2E8F0" px="24px" py="16px" justify="space-between" align="center">
            <Flex direction="column">
                <HStack spacing="10px">
                    <Text fontSize="16px" lineHeight="24px" fontWeight={500}>{name}</Text>
                    <CreateRuleModal isEdit data={data} onGetRule={onGetRule} />
                    <IconButton icon={<DeleteIcon />} variant="ghost" size="xs" colorScheme="red" onClick={onClickDelete} />
                </HStack>
                <Text fontSize="12px" color="rgba(45, 55, 72, 0.5)" fontWeight={400}>{description}</Text>
            </Flex>
            <Switch />
        </Flex>
    )
};

export default RowRule;