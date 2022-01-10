import { Switch as Sw } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { blue } from '@material-ui/core/colors'

const Switch = withStyles({
    switchBase: {
    //   color: blue[500],
      '&$checked': {
        color: blue[600],
      },
      '&$checked + $track': {
        backgroundColor: blue[700],
      },
    },
    checked: {},
    track: {},
  })(Sw);

  export default Switch
  