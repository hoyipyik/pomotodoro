import React from "react"
import { Checkbox as Cb } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { blue } from '@material-ui/core/colors'

const Checkbox = withStyles({
    root: {
    //   color: blue[400],
      "&$checked": {
        color: blue[700]
      },
    },
    checked: {}
  })((props) => <Cb color="default" {...props} />)

  export default Checkbox
  