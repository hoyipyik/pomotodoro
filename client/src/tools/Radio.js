import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { blue } from '@material-ui/core/colors'
import { Radio as Ra } from '@material-ui/core/'

const Radio = withStyles({
    root: {
        // color: green[400],
        '&$checked': {
            color: blue[700],
        },
    },
    checked: {},
})((props) => <Ra color="default" {...props} />)

export default Radio