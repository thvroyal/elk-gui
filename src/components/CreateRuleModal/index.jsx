import { AddIcon } from '@chakra-ui/icons';
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, ModalFooter, useDisclosure, IconButton, InputGroup, InputLeftAddon, Textarea, RadioGroup, HStack, Radio, Select, Divider, useRadioGroup, Switch } from '@chakra-ui/react';
import React from 'react';
import { EmailIcon, SlackIcon, TelegramIcon } from '../Icons';
import AlertCard from './AlertCard';
import FilterList from './FilterList';

const CreateRuleModal = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const initialRef = React.useRef(null);
    
    const alertOptions = [
      {
        value: "telegram",
        icon: TelegramIcon
      },
      {
        value: "slack",
        icon: SlackIcon
      },{
        value: "email",
        icon: EmailIcon
      },
    ];
    const { getRootProps, getRadioProps } = useRadioGroup({
      name: 'alert',
      defaultValue: 'telegram',
      onChange: console.log,
    })
    
    const group = getRootProps()
    
    return (
      <>
        <IconButton
          aria-label='Create new rule' 
          icon={<AddIcon />} 
          onClick={onOpen} 
        />

        <Modal
          initialFocusRef={initialRef}
          isOpen={isOpen}
          onClose={onClose}
          size="xl"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create New Rule</ModalHeader>
              
            <ModalCloseButton />
              
            <ModalBody pb={6} maxH="640px" overflow="auto">
              <InputGroup>
                <InputLeftAddon children='Name' />
                <Input type='text' ref={initialRef} placeholder='New Rule Name' w="318px" />
              </InputGroup>

              <FormControl mt={4}>
                <FormLabel>Description</FormLabel>
                <Textarea placeholder='Add some descriptions for this rule' />
              </FormControl>
              
              <FormControl mt={4}>
                <FormLabel as='legend'>Type</FormLabel>
                <RadioGroup defaultValue='web'>
                  <HStack spacing='64px'>
                    <Radio value='web'>Web</Radio>
                    <Radio value='network'>Network</Radio>
                    <Radio value='system'>System</Radio>
                  </HStack>
                </RadioGroup>
              </FormControl>
              
              <FormControl my={4} w="200px">
                <FormLabel htmlFor='severity'>Severity</FormLabel>
                <Select id='severity' defaultValue="low">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </Select>
              </FormControl>
              <Divider />
              <FilterList />
              <Divider />
              <FilterList />
              <Divider />
              <FormControl mt={4}>
                <FormLabel as='legend'>Alert</FormLabel>
                <RadioGroup defaultValue='web'>
                  <HStack {...group} flex="1">
                    {alertOptions.map(option => {
                      const {value, icon} = option;
                      const radio = getRadioProps({ value, iconEle: icon });
                      return (
                        <AlertCard key={value} {...radio}/>
                      )
                    })}
                  </HStack>
                </RadioGroup>
              </FormControl>
              <FormControl display='flex' alignItems='center' mt={4}>
                <FormLabel htmlFor='email-alerts' mb='0'>
                  Active rule
                </FormLabel>
                <Switch id='email-alerts' />
              </FormControl>
            </ModalBody>
              
              <ModalFooter>
                <Button colorScheme='blue' mr={3} size="md" variant="solid">
                  Create
                </Button>
                <Button onClick={onClose} size="md">Cancel</Button>
              </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
}

export default CreateRuleModal;