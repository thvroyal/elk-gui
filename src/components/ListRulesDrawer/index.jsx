import { Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Button, useDisclosure, DrawerCloseButton } from '@chakra-ui/react';
import React, { useState } from 'react';
import { deleteRuleId, getAllRules } from '../../pages/Dashboard/helpers';
import RowRule from './RowRule';

const ListRulesDrawer = ({ placement }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
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
    const handleOpen = () => {
        getRule();
        onOpen();
    }
    
    const handleClickDelete = (id, name) => {
        deleteRuleId(id).then(res => {
            if (res) {
                getRule();
            }
        });
    }
    return (
        <>
            <Button onClick={handleOpen}>List Rules</Button>
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
        </>
    )
}

export default ListRulesDrawer;