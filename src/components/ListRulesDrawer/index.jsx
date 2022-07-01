import { Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Button, useDisclosure, DrawerCloseButton } from '@chakra-ui/react';
import React from 'react';

const ListRulesDrawer = ({ placement }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <>
            <Button onClick={onOpen}>List Rules</Button>
            <Drawer placement={placement} onClose={onClose} isOpen={isOpen} size="sm">
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth='1px'>List Rules</DrawerHeader>
                    <DrawerBody>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default ListRulesDrawer;