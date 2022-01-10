import React from "react"
import { Slider as Sd } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'

function ValueLabelComponent(props) {
    const { children, open, value } = props;
  
    return (
      <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
        {children}
      </Tooltip>
    );
  }

const Slider = withStyles({
    root: {
      color: '#166ee2',
      height: 2,
      padding: '15px 0',
    },
    thumb: {
    },
    active: {},
    valueLabel: {
    //   left: 'calc(-50% + 12px)',
    //   top: -22,
    //   '& *': {
    //     background: 'transparent',
    //     color: '#000',
    //   },
    },
    track: {
    //   height: 2,
    },
    rail: {
   
    },
    mark: {
    //   backgroundColor: '#bfbfbf',
    //   height: 8,
    //   width: 1,
    //   marginTop: -3,
    },
    markActive: {
    //   opacity: 1,
    //   backgroundColor: 'currentColor',
    },
  })((props) => <Sd color="primary" 
  {...props}
  defaultValue={1}

  ValueLabelComponent={ValueLabelComponent}
  aria-labelledby="discrete-slider"
  valueLabelDisplay="auto"
  step={1}
  marks
  min={0}
  max={5}/>)

  export default Slider
  