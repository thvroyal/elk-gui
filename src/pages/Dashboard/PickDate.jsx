import { Input, InputGroup } from '@chakra-ui/react';
import React, { forwardRef } from 'react'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"

export default function PickDate({ dateDefault, setDate }) {
  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <InputGroup width="250px">
      <Input bg="white" size="lg" ref={ref} onClick={onClick} value={value} readOnly/>
    </InputGroup>
  ))
  
  return (
    <div>
      <DatePicker
        selected={dateDefault}
        onChange={(date) => setDate(date)}
        customInput={<CustomInput />}
        showTimeSelect
        dateFormat="MMM dd, yyyy @ hh:mm:ss"
        showTimeInput
      />
    </div>
  )
}
