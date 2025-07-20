import React from 'react'
import { TextField } from '@mui/material'

type Props = {
  name: string
  type: string
  label: string
  autoComplete: "on" | "off"
}

const CustomizedInput = (props: Props) => {
  return (
    <TextField
      autoComplete={props.autoComplete}
      margin="normal"
      name={props.name}
      label={props.label}
      type={props.type}
      slotProps={{
        root: {
          style: {
            width: '400px',
          },
        },
        inputLabel: {
          style: { color: 'white' },
        },
        input: {
          style: {
            fontSize: 20,
            color: 'white',
          },
        },
      }}
      sx={{
        
        '& .MuiOutlinedInput-root': {
      
          '& fieldset': {
            borderColor: 'white',
            borderRadius: '10px',
          },
          '&:hover fieldset': {
            borderColor: 'skyblue', // Change this color as you like
          },
          '&.Mui-focused fieldset': {
            borderColor: 'deepskyblue', // Focus color
          },
        },
        '& .MuiInputLabel-root': {
          color: 'white',
        },
        '& .MuiInputLabel-root.Mui-focused': {
          color: 'deepskyblue', // Focused label color
        },
        '& input:-webkit-autofill': {
          WebkitBoxShadow: '0 0 0 1000px transparent inset',
          WebkitTextFillColor: 'white',
          
        },
      }}
    />
  )
}

export default CustomizedInput