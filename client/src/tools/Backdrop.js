import React from 'react'
import { Backdrop as Bd } from '@material-ui/core'

const Backdrop = ({z=40}) => {
    
    const tag = z === 20 ? 'w-4/5 z-20 h-screen  -mx-10 -my-5 absolute'  : 'w-4/5 z-40 h-screen  -mx-10 -my-5 absolute' 
    return (
        <div className={tag}>
            <Bd open={true}/>
        </div>
    )
}

export default Backdrop
