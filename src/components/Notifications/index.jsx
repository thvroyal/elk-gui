import { Badge, Button, Flex, HStack, Box, IconButton, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Portal, Text } from '@chakra-ui/react';
import moment from 'moment';
import React, { useState } from 'react';
import { RingIcon } from '../Icons';

const Notifications = ({ notifyData, onClickResolve }) => {
    
    const [filterBy, setFilterBy] = useState("all");
    
    const preprocessData = (notifyData = []) => {
        let numOfUnsolved = 0;
        const newNotifyData = notifyData && notifyData.map(notify => {
            if (!notify.resolved) {
                numOfUnsolved++;
            };
            
            let msg = "";
            if ("file" in notify) {
                msg = `Process ${notify.process} running under user ${notify.actor} interacted with file ${notify.file}`
            } else if ("destination" in notify) {
                msg = `User ${notify.actor} connected to ${notify.destination} through process ${notify.process}`
            } else {
                msg = `Remote IP ${notify.remote_ip} accessed URL ${notify.url}`
            }
            
            return {
                ...notify,
                msg,
            }
        }).filter(notify => {
            return (notify.resolved && filterBy === 'resolved') 
            || (!notify.resolved && filterBy === 'unsolved') 
            || (filterBy === "all")
        })
        
        return {
            data: newNotifyData?.reverse(),
            numOfUnsolved,
        }
    }
    
    const handleClickFilterBy = (type) => {
        setFilterBy(type);
    }
    
    const { data: dataProcessed, numOfUnsolved } = preprocessData(notifyData);
    
    return (
        <Popover>
            <PopoverTrigger>
                <Box position="relative">
                    <IconButton icon={<RingIcon />} fontSize="20px" variant="outline" />
                    <Badge 
                        variant="solid" 
                        colorScheme="red" 
                        rounded="12px" 
                        position="absolute"
                        border="4px"
                        borderColor="white" 
                        top={-3} 
                        right={-4}
                    >
                        {numOfUnsolved > 99 ? '99+' : numOfUnsolved}
                    </Badge>
                </Box>
            </PopoverTrigger>
            <Portal>
                <PopoverContent>
                <PopoverArrow />
                <PopoverHeader>
                    <Text mb="6px" fontSize="16px" fontWeight="700">Manage Notifications</Text>
                    <HStack>
                        <Button 
                            variant={filterBy === "all" ? "solid" : "outline"} 
                            colorScheme={filterBy === "all" ? "blue" : "gray"}
                            size='xs' 
                            onClick={() => handleClickFilterBy("all")}
                        >
                            All
                        </Button>
                        <Button 
                            variant={filterBy === "resolved" ? "solid" : "outline"} 
                            colorScheme={filterBy === "resolved" ? "blue" : "gray"}
                            size='xs' 
                            onClick={() => handleClickFilterBy("resolved")}
                        >
                            Resolved
                        </Button>
                        <Button 
                            variant={filterBy === "unsolved" ? "solid" : "outline"} 
                            colorScheme={filterBy === "unsolved" ? "blue" : "gray"}
                            size='xs' 
                            onClick={() => handleClickFilterBy("unsolved")}
                        >
                            Unsolved
                        </Button>
                    </HStack>
                </PopoverHeader>
                <PopoverCloseButton />
                <PopoverBody maxHeight="400px" overflow="auto" p="0px">
                    {dataProcessed.length > 0 && dataProcessed.map(data => (
                        <Flex 
                            flexDirection="column" 
                            alignItems="flex-start" 
                            borderBottom="1px" 
                            borderBottomColor="gray.200" 
                            pb="10px"
                            _hover={{
                                background: "gray.100"
                            }}
                            p="10px"
                            cursor="pointer"
                            key={data._id.$oid}
                        >
                            <Text mb="4px">{data.msg}</Text>
                            <HStack>
                                <Text fontSize="14px" color="gray.500">{moment(data.time).fromNow()}</Text>
                                <Text color="gray.500">•</Text>
                                <Badge 
                                    colorScheme={data.resolved ? 'green' : 'red'}
                                    onClick={() => onClickResolve(data)}
                                >
                                    {data.resolved ? "resolved" : "unsolved"}
                                </Badge>
                            </HStack>
                        </Flex>
                    ))}
                </PopoverBody>
                </PopoverContent>
            </Portal>
        </Popover>
    )
}

export default Notifications;