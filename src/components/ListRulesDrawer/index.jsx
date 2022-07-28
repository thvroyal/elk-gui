import { Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Button, useDisclosure, DrawerCloseButton } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { deleteRuleId, getAllRules } from '../../pages/Dashboard/helpers';
import RowRule from './RowRule';

const DrawerContainer = ({ isOpen, onClose, placement }) => {
    const [listRules, setListRules] = useState([]);
    
    const getRule = () => {
        getAllRules().then(res => {
            const {isSuccess, data} = res;
            if (isSuccess) {
                setListRules(data);
            }
        }).catch(err => {
            console.error(err);
        })
    }
    
    useEffect(() => {
        getRule();
    }, []);
    
    const handleClickDelete = (id, name) => {
        deleteRuleId(id).then(res => {
            if (res) {
                getRule();
            }
        });
    }
    return (
        <Drawer placement={placement} onClose={onClose} isOpen={isOpen} size="sm">
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth='1px'>List Rules</DrawerHeader>
                    <DrawerBody p={0}>
                        {listRules && listRules.map(rule => (
                            <RowRule data={rule} key={rule._id.$oid} onClickDelete={() => handleClickDelete(rule._id.$oid, rule.name)} onGetRule={getRule} />
                        ))}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
    )
}
const ListRulesDrawer = ({ placement }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    
    
    return (
        <>
            <Button onClick={onOpen}>List Rules</Button>
            {isOpen && <DrawerContainer isOpen={isOpen} onClose={onClose} placement={placement} />}
        </>
    )
}

export default ListRulesDrawer;