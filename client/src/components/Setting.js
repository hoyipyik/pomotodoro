import React from 'react'

import Switch from '../tools/Switch'

const Setting = ({onlineMode, clockMode, pomoMode, modeChangeHandler}) => {

    const switchZone = 
        <div className='pt-2 flex w-10/12 gap-1 flex-wrap'>
            <div className='my-1.5 mr-2'>
                <span className='my-auto'>Online</span>
                <Switch  onClick={()=>modeChangeHandler(!onlineMode, 'onlineMode')} checked={onlineMode}/>
            </div>
            <div className=' my-1.5 mr-2'>
                <span className='my-auto'>PomoMode</span>
                <Switch onClick={()=>modeChangeHandler(!pomoMode, 'pomoMode')} checked={pomoMode}/>
            </div>
            <div className=' my-1.5 mr-2'>
                <span className='my-auto'>clockMode</span>
                <Switch onClick={()=>modeChangeHandler(!clockMode, 'clockMode')} checked={clockMode && (pomoMode===true)} disabled={pomoMode===false}/>
            </div>
        </div>

    return (
        <div className='absolute w-4/5 xl:w-5/6 h-5/6 mx-11 sm:mx-16 lg:mx-28 my-14 bg-white z-50 shadow-md rounded-lg'>
            <div className='container px-10 py-8 w-auto overflow-auto h-full'>
                <h1 className='text-2xl py-3 mb-1 w-3/5 font-bold border-b-2'>Setting</h1>
                    {switchZone}
            </div>
        </div>
    )
}

export default Setting
