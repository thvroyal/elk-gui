import { AddIcon, EditIcon } from '@chakra-ui/icons';
import { Button, Divider, FormControl, FormLabel, HStack, IconButton, Input, InputGroup, InputLeftAddon, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Radio, RadioGroup, Select, Switch, Textarea, useDisclosure, useRadioGroup, useToast } from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { createNewRule, updateRuleId } from '../../pages/Dashboard/helpers';
import { EmailIcon, SlackIcon, TelegramIcon } from '../Icons';
import AlertCard from './AlertCard';
import FilterList from './FilterList';

const alertOptions = [
  {
    value: "Telegram",
    icon: TelegramIcon
  },
  {
    value: "Slack",
    icon: SlackIcon
  },{
    value: "Email",
    icon: EmailIcon
  },
];

const typeList = ['Web', 'Network', 'System']; 

const fieldOfType = {
  Allowlist: {
    Web: {'nginx.access.remote_ip': ''},
    Network: {'process.name': '', 'destination.ip': '', 'user.name': ''},
    System: {'user.name': ''},
  },
  Blacklist: {
    Web: {'nginx.access.url': '', 'nginx.access.remote_ip': ''},
    Network: {'process.name': '', 'destination.ip': '', 'user.name': ''},
    System: {'file.path': '', 'process.name': ''},
  }
}
const convertTypeListMap = (field) => {
  return typeList.reduce((acc, type) => {
    return {
      ...acc,
      [type]: [fieldOfType[field][type]]
    }
  }, {});
};

const cleanData = (list) => {
  return list.reduce((acc, curr) => {
    const obj = {};
    for (const [key, value] of Object.entries(curr)) {
      if (value !== '') {
        obj[key] = value;
      }
    }
    if (Object.keys(obj).length > 0) return [...acc, obj]; else return acc;
  }, [])
}

const RuleModal = ({ data, isEdit, isOpen, onClose, onGetRule }) => {
  const initialRef = React.useRef(null);
  const [fieldAlert, setFieldAlert] = useState(alertOptions[0].value);
  const [type, setType] = useState(typeList[0]);
  const [allowlist, setAllowlist] = useState(convertTypeListMap('Allowlist'));
  const [blacklist, setBlacklist] = useState(convertTypeListMap('Blacklist'));
  
  const toast = useToast();
  
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'alert',
    defaultValue: fieldAlert,
    onChange: (value) => setFieldAlert(value),
    value: fieldAlert,
  })  
  const group = getRootProps();
  
  
  //useEffect to set initial data when editing rule
  useEffect(() => {
    if (data) {
      setFieldAlert(data.alert);
      setType(data.type);
      
      setAllowlist({
        ...allowlist,
        [data.type]: data.allowlist,
      });
      
      setBlacklist({
        ...blacklist,
        [data.type]: data.blacklist,
      })
    }
  }, [data]);
  
  const handleChangeAllowlist = (field, value, index) => {
    const newAllowlist = {
      ...allowlist,
      [type]: allowlist[type].map((item, idx) => {
        if (idx === index) {
          return {
            ...item,
            [field]: value,
          }
        }
        return item;
      })
    }
    setAllowlist(newAllowlist);
  };
  
  const handleChangeBlacklist = (field, value, index) => {
    const newBlacklist = {
      ...blacklist,
      [type]: blacklist[type].map((item, idx) => {
        if (idx === index) {
          return {
            ...item,
            [field]: value,
          }
        }
        return item;
      })
    }
    setBlacklist(newBlacklist);
  };
  
  const handleAddMore = (title) => {
    if (title === "Allowlist") {
      const newAllowlist = {
        ...allowlist,
        [type]: [...allowlist[type], fieldOfType['Allowlist'][type]],
      }
      
      setAllowlist(newAllowlist);
    } else {
      const newBlacklist = {
        ...blacklist,
        [type]: [...blacklist[type], fieldOfType['Blacklist'][type]],
      }
      
      setBlacklist(newBlacklist);
    }
  }
  
  const handleDeleteItem = (title, index) => {
    if (title === "Allowlist") {
      const newAllowlist = {
        ...allowlist,
        [type]: allowlist[type].filter((_, idx) => idx !== index),
      }
      setAllowlist(newAllowlist);
    } else {
      const newBlacklist = {
        ...blacklist,
        [type]: blacklist[type].filter((_, idx) => idx !== index),
      }
      setBlacklist(newBlacklist);
    }
  }
  
  return (
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
              
            <Formik
              initialValues={{
                name: data ? data.name : '',
                description: data ? data.description : '',
                severity: data ? data.severity : 'LOW',
                status: data ? data.status === 'Enable' : false,
                host: data ? data.host : 'All',
              }}
              onSubmit={ async (values, actions) => {
                const newValues = {
                  ...values,
                  alert: fieldAlert,
                  type: type,
                  allowlist: cleanData(allowlist[type]),
                  blacklist: cleanData(blacklist[type]),
                  status: values.status ? 'Enable' : 'Disable',
                }
                const res = isEdit ? await updateRuleId(data._id.$oid, newValues) : await createNewRule(newValues);
                if (res) {
                  actions.setSubmitting(false);
                  isEdit && onGetRule && await onGetRule();
                  toast({
                    title: `Rule is ${isEdit ? 'saved' : 'created'}.`,
                    description: `Rule name: ${values.name}`,
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                    position: 'top-right',
                  });
                  onClose();
                }
              }}
            >
              {(props) => (
                <Form>
                  <ModalBody pb={6} maxH="500px" overflow="auto">
                    <Field name='name' key="name">
                      {({ field, form }) => (
                        <InputGroup>
                          <InputLeftAddon children='Name' />
                          <Input {...field} type='text' ref={initialRef} placeholder='New Rule Name' w="318px" />
                        </InputGroup>
                      )}
                    </Field>
                    
                    <Field name='description' key='description'>
                      {({ field }) => (
                        <FormControl mt={4}>
                          <FormLabel>Description</FormLabel>
                          <Textarea {...field} placeholder='Add some descriptions for this rule' />
                        </FormControl>
                      )}
                    </Field>
                    
                    <Field name='type' key="type">
                      {({ field }) => (
                        <FormControl mt={4}>
                          <FormLabel as='legend'>Type</FormLabel>
                          <RadioGroup defaultValue={type}>
                            <HStack spacing='64px'>
                              {typeList.map(type => (
                                <Radio onChange={() => setType(type)} value={type} key={type}>{type}</Radio>
                              ))}
                            </HStack>
                          </RadioGroup>
                        </FormControl>
                      )}
                    </Field>
                    
                    <Field name='host' key="host">
                      {({ field }) => (
                        <FormControl my={4} w="200px">
                          <FormLabel htmlFor='host'>Host</FormLabel>
                          <Select {...field} id='host'>
                            <option value="All">All</option>
                            <option value="agent1">Agent 1</option>
                            <option value="agent2">Agent 2</option>
                          </Select>
                        </FormControl>
                      )}
                    </Field>
                    
                    <Field name='severity' key="severity">
                      {({ field }) => (
                        <FormControl my={4} w="200px">
                          <FormLabel htmlFor='severity'>Severity</FormLabel>
                          <Select {...field} id='severity'>
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                            <option value="CRITICAL">Critical</option>
                          </Select>
                        </FormControl>
                      )}
                    </Field>
                    
                    <Divider />
                    
                    <FilterList 
                      title="Blacklist" 
                      color="#E53E3E" 
                      data={blacklist[type]}
                      onChange={handleChangeBlacklist}
                      onAddMore={handleAddMore}
                      onDeleteItem={handleDeleteItem}
                    />
                    
                    <FilterList 
                      title="Allowlist" 
                      onChange={handleChangeAllowlist} 
                      data={allowlist[type]} 
                      onAddMore={handleAddMore} 
                      onDeleteItem={handleDeleteItem}
                    />
                    
                    <FormControl mt={4}>
                      <FormLabel as='legend'>Alert</FormLabel>
                      <RadioGroup defaultValue={fieldAlert}>
                        <HStack {...group} flex="1">
                          {alertOptions.map(option => {
                            const {value, icon} = option;
                            const radio = getRadioProps({ value, iconEle: icon });
                            return (
                              <AlertCard key={value} {...radio} />
                            )
                          })}
                        </HStack>
                      </RadioGroup>
                    </FormControl>
                    
                    <Field name='status' key="status">
                      {({ field }) => (
                        <FormControl display='flex' alignItems='center' mt={4}>
                          <FormLabel htmlFor='email-alerts' mb='0'>
                            Active rule
                          </FormLabel>
                          <Switch isChecked={field.value} {...field} />
                        </FormControl>
                      )}
                    </Field>
                  </ModalBody>
                  
                  <ModalFooter>
                    <Button colorScheme='blue' mr={3} size="md" variant="solid" type="submit" isLoading={props.isSubmitting}>
                      {isEdit ? 'Save' : 'Create'}
                    </Button>
                    <Button onClick={onClose} size="md">Cancel</Button>
                  </ModalFooter>
                </Form>
              )}
            </Formik>
              
              
          </ModalContent>
        </Modal>
  )
}
const CreateRuleModal = (props) => {
    const { isEdit = false, data, onGetRule } = props;
    const { isOpen, onOpen, onClose } = useDisclosure();
    
    return (
      <>
        {isEdit ? <IconButton icon={<EditIcon />} variant="ghost" size="xs" colorScheme="blue" onClick={onOpen} /> : 
          <IconButton
            aria-label='Create new rule' 
            icon={<AddIcon />} 
            onClick={onOpen} 
          />
        }

        {isOpen && 
          <RuleModal 
            data={data} 
            isEdit={isEdit} 
            isOpen={isOpen} 
            onClose={onClose}
            onGetRule={onGetRule}
        />}
      </>
    )
}

export default CreateRuleModal;