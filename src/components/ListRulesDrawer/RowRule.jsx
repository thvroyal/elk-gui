import { DeleteIcon } from '@chakra-ui/icons';
import { Flex, HStack, IconButton, Switch, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { updateRuleId } from '../../pages/Dashboard/helpers';
import CreateRuleModal from '../CreateRuleModal';

const RowRule = ({ data, onClickDelete, onGetRule }) => {
    const { name, description, status } = data;
    const [active, setActive] = useState(false);
    
    useEffect(() => {
        setActive(status === 'Enable');
    }, [status]);
    
    const handleToggleSwitch = (event) => {
        const newData = {
            ...data,
            status: event.target.checked ? 'Enable' : 'Disable',
        }
        delete newData._id;
        setActive(event.target.checked);
        updateRuleId(data._id.$oid, newData).then(res => {
            if (!res) {
                setActive(!event.target.checked);
            } else {
                onGetRule && onGetRule();
            }
        })
            
    }
    
    return (
        <Flex borderBottomWidth="1px" borderBottomColor="gray.800" px="24px" py="16px" justify="space-between" align="center">
            <Flex direction="column">
                <HStack spacing="10px">
                    <Text fontSize="16px" lineHeight="24px" fontWeight={500}>{name}</Text>
                    <CreateRuleModal isEdit data={data} onGetRule={onGetRule} />
                    <IconButton icon={<DeleteIcon />} variant="ghost" size="xs" colorScheme="red" onClick={onClickDelete} />
                </HStack>
                <Text fontSize="12px" color="gray.400" fontWeight={400}>{description}</Text>
            </Flex>
            <Switch isChecked={active} onChange={handleToggleSwitch} />
        </Flex>
    )
};

export default RowRule;