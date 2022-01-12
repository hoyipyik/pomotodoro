import React, {useEffect, useState} from 'react'

import Switch from '../tools/Switch'
import Radio from '../tools/Radio'
import axios from '../axios'

const Setting = ({onlineMode, clockMode, pomoMode, refreshHandler, modeChangeHandler}) => {
    const [o2l, setO2l] = useState('')
    const [l2o, setL2o] = useState('')

    const [onlineTodoData, setOnlineTodoData] = useState([])
    const [onlineScheduleData, setOnlineScheduleData] = useState([])
    const [localTodoData, setLocalTodoData] = useState([])
    const [localScheduleData, setLocalScheduleData] = useState([])

    /**
     * fetching data function
     */

    const onlineDataFetchingFunction = () =>{
        axios.get('/todoData.json')
            .then(res=>{
                const {data} = res
                // console.log(data, '[setting.js]: onelineTodoData fetched')
                if(data)
                    setOnlineTodoData(data)
            })
            .catch(err=>console.log(err))
        axios.get('/scheduleData.json')
            .then(res=>{
                const {data} = res
                // console.log(data, '[setting.js]: oneline Schedule Data fetched')
                if(data)
                    setOnlineScheduleData(data)
            })
            .catch(err=>console.log(err)) 
    }

    const localDataFetchingFunction = () =>{
        const localtodo = JSON.parse(localStorage.getItem('localTodoData'))
        const localschedule = JSON.parse(localStorage.getItem('localScheduleData'))
        if(localtodo)
            setLocalTodoData(localtodo)
        if(localschedule)
            setLocalScheduleData(localschedule)
        // console.log('[setting.js]: local todo&schedule data fetched')
    }

    //

    useEffect(()=>{
        onlineDataFetchingFunction()
        localDataFetchingFunction()
        return 
    }, [])

    const online2LocalRadioFunction = (e) =>{
        const {value} = e.target
        setO2l(value)
        setL2o('')
    }

    const local2OnlineRadioFunction = (e) =>{
        const {value} = e.target
        setL2o(value)
        setO2l('')
    }

    /**
     * merged data push function
     */

    const onlinePushHandler = (todo, schedule) =>{
        const pack = {todo, schedule}
        axios.post('/merge.json', pack)
            .then(res=>{
                console.log('local to online success')
                refreshHandler()
            })
            .catch(err=>console.log(err))
    }

    const localPushHandler = (todo, schedule) =>{
        localStorage.setItem('localTodoData', JSON.stringify(todo))
        localStorage.setItem('localScheduleData', JSON.stringify(schedule))
        console.log('online to local success')
        refreshHandler()
    }

    // 

    const buttonFunction = () =>{
        if(o2l==='o2l'){
            // console.log('clicked')
            localPushHandler(onlineTodoData, onlineScheduleData)    
        }else if(l2o==='l2o'){
            onlinePushHandler(localTodoData, localScheduleData)
        }
    }

    const switchZone = 
    <div className='pt-2'>
        <div className='font-bold'>Mode</div>
        <div className='pt-2 flex gap-1 flex-wrap'>
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
    </div>

    const mergeButtonZone = 
        <div className='pt-2'>
            <div className='font-bold'>Merge</div>
            <div className='flex gap-1 flex-wrap my-2'>
                <div className='mr-3 flex-shrink-0'>
                    <span className='my-auto'>Online to Local</span>
                    <Radio 
                        checked={o2l==='o2l'}
                        value='o2l'
                        onChange={online2LocalRadioFunction}
                    />
                </div>
                <div className='mr-3 flex-shrink-0'>
                    <span className='my-auto'>Local to Online</span>
                    <Radio
                        checked={l2o==='l2o'}
                        value='l2o'
                        onChange={local2OnlineRadioFunction}
                    />
                </div>
            </div>
            <button 
                onClick={buttonFunction}
                className='text-lg bg-blue-600 md:mt-3 lg:mt-9
                text-white px-2  w-16 h-10 rounded-md border-0 
                hover:bg-blue-500 outline-none'>Go</button>
        </div>

    return (
        <div className='absolute w-4/5 sm:w-4/6 md:w-4/7 h-4/5 mx-11 sm:mx-28 md:mx-36  lg:mx-48 xl:mx-60 my-16 bg-white z-50 shadow-md rounded-lg'>
            <div className='container md:px-20 xl:px-24 px-10 py-6 w-auto overflow-auto h-full'>
                <h1 className='text-2xl py-2 mb-1 sm:w-4/5 w-full font-bold border-b-2'>Setting</h1>
                <div className='flex flex-col pt-1 h-4/5 w-10/12'>
                    {switchZone}
                    {mergeButtonZone}
                </div>
            </div>
        </div>
    )
}

export default Setting
