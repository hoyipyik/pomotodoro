import React from 'react'
import { Backdrop as Bd } from '@material-ui/core'

const Backdrop = () => {
    return (
        <div className='w-4/5 z-40 h-screen  -mx-10 -my-5 absolute'>
            <Bd open={true}/>
        </div>
    )
}

export default Backdrop
