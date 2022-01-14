import React from 'react'
import { Backdrop as Bd } from '@material-ui/core'

const Backdrop = ({z=30}) => {
    const tag = `w-4/5 z-${z} h-screen  -mx-10 -my-5 absolute`
    return (
        <div className={tag}>
            <Bd open={true}/>
        </div>
    )
}

export default Backdrop
