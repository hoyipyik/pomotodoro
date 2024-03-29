import React, { useContext, useEffect, useState } from 'react'

import { ContextApp } from '../tools/Context'
import Switch from '../tools/Switch'
import Radio from '../tools/Radio'
import axios from '../axios'

const Setting = ({ onlineMode, clockMode, pomoMode, refreshHandler, modeChangeHandler }) => {
    const [o2l_override, setO2l_override] = useState('')
    const [l2o_override, setL2o_override] = useState('')
    const [o2l_merge, setO2l_merge] = useState('')
    const [l2o_merge, setL2o_merge] = useState('')

    const [onlineTodoData, setOnlineTodoData] = useState([])
    const [onlineScheduleData, setOnlineScheduleData] = useState([])
    const [localTodoData, setLocalTodoData] = useState([])
    const [localScheduleData, setLocalScheduleData] = useState([])

    const { account, encryptFunction, decryptFunction, itemEncryptHandler, 
        itemDecryptHandler, arrayDecryptHandler, arrayEncryptHandler} = useContext(ContextApp)

    useEffect(() => {
        if (!onlineMode) {
            setL2o_merge('')
            setL2o_override('')
            setO2l_merge('')
            setO2l_override('')
        }
        return
    }, [onlineMode])

    /**
     * fetching data function
     */

    const onlineDataFetchingFunction = () => {
        console.log(account)
        if (account) {
            const account_c = encryptFunction(account)
            axios.post('/todoData.json', { account_c: account_c })
                .then(res => {
                    const data_c = res.data
                    // console.log(data, '[setting.js]: onelineTodoData fetched')
                    if (data_c) {
                        const data = arrayDecryptHandler([...data_c])
                        setOnlineTodoData(data)
                    }
                })
                .catch(err => console.log(err))
            axios.post('/scheduleData.json', { account_c: account_c })
                .then(res => {
                    const data_c = res.data
                    // console.log(data, '[setting.js]: oneline Schedule Data fetched')
                    if (data_c) {
                        const data = arrayDecryptHandler([...data_c])
                        setOnlineScheduleData(data)
                    }
                })
                .catch(err => console.log(err))
        }
    }

    const localDataFetchingFunction = () => {
        const localtodo = JSON.parse(localStorage.getItem('localTodoData'))
        const localschedule = JSON.parse(localStorage.getItem('localScheduleData'))
        if (localtodo)
            setLocalTodoData(localtodo)
        if (localschedule)
            setLocalScheduleData(localschedule)
        // console.log('[setting.js]: local todo&schedule data fetched')
    }

    //

    useEffect(() => {
        onlineDataFetchingFunction()
        localDataFetchingFunction()
        return
    }, [])  

    const overrideOnline2LocalRadioFunction = (e) => {
        const { value } = e.target
        setO2l_override(value)
        setL2o_override('')
    }

    const overrideLocal2OnlineRadioFunction = (e) => {
        const { value } = e.target
        setL2o_override(value)
        setO2l_override('')
    }

    const mergeOnline2LocalRadioFunction = (e) => {
        const { value } = e.target
        setO2l_merge(value)
        setL2o_merge('')
    }

    const mergeLocal2OnlineRadioFunction = (e) => {
        const { value } = e.target
        setL2o_merge(value)
        setO2l_merge('')
    }

    /**
     * merged data push function
     */

    const onlinePushHandler = (todo, schedule, type) => {
        const todo_c = arrayEncryptHandler(todo)
        const schedule_c = arrayEncryptHandler(schedule)
        const account_c = encryptFunction(account)
        axios.post('/merge_todo.json', { todo_c, account_c })
            .then(res => {
                axios.post('/merge_schedule.json', { schedule_c, account_c })
                    .then(res => {
                        console.log(`[${type}] local to online success`)
                        refreshHandler()
                    })
                    .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
    }

    const localPushHandler = (todo, schedule, type) => {
        localStorage.setItem('localTodoData', JSON.stringify(todo))
        localStorage.setItem('localScheduleData', JSON.stringify(schedule))
        console.log(`[${type}] online to local success`)
        refreshHandler()
    }

    // 

    const overrideButtonFunction = () => {
        if (onlineMode) {
            if (o2l_override === 'o2l') {
                localPushHandler(onlineTodoData, onlineScheduleData, 'override')
            } else if (l2o_override === 'l2o') {
                onlinePushHandler(localTodoData, localScheduleData, 'override')
            }
        }
    }

    const mergeButtonFunction = () => {
        if (onlineMode) {
            let dulplicatedRemovedtodoData = []
            const dulplicatedRmovedtodoDataId = [...onlineTodoData, ...localTodoData].reduce((prev, cur) => {
                if (prev.indexOf(cur.id) === -1) {
                    prev.push(cur.id)
                    dulplicatedRemovedtodoData.push(cur)
                }
                return prev
            }, [])
            let dulplicatedRemovedscheduleData = []
            const dulplicatedRemovedscheduleDataId = [...onlineScheduleData, ...localScheduleData].reduce((prev, cur) => {
                if (prev.indexOf(cur.id) === -1) {
                    prev.push(cur.id)
                    dulplicatedRemovedscheduleData.push(cur)
                }
                return prev
            }, [])

            if (o2l_merge === 'o2l') {
                localPushHandler(dulplicatedRemovedtodoData, dulplicatedRemovedscheduleData, 'merge')
            } else if (l2o_merge === 'l2o') {
                onlinePushHandler(dulplicatedRemovedtodoData, dulplicatedRemovedscheduleData, 'merge')
            }
        }
    }



    const switchZone =
        <div className='pt-2'>
            <div className='font-bold'>Mode</div>
            <div className='pt-2 flex gap-1 flex-wrap'>
                <div className='my-1.5 mr-2'>
                    <span className='my-auto'>Online</span>
                    <Switch color='primary' onClick={() => modeChangeHandler(!onlineMode, 'onlineMode')} checked={onlineMode} disabled={account === ''} />
                </div>
                <div className=' my-1.5 mr-2'>
                    <span className='my-auto'>PomoMode</span>
                    <Switch color='primary' onClick={() => modeChangeHandler(!pomoMode, 'pomoMode')} checked={pomoMode} />
                </div>
                <div className=' my-1.5 mr-2'>
                    <span className='my-auto'>clockMode</span>
                    <Switch color='primary' onClick={() => modeChangeHandler(!clockMode, 'clockMode')} checked={clockMode && (pomoMode === true)} disabled={pomoMode === false} />
                </div>
            </div>
        </div>

    const overrideButtonZone =
        <div className='pt-2'>
            <div className='font-bold'>Override</div>
            <div className='flex gap-1 flex-wrap my-2'>
                <div className='mr-3 flex-shrink-0'>
                    <span className='my-auto'>Online to Local</span>
                    <Radio
                        color='primary'
                        disabled={!onlineMode}
                        checked={o2l_override === 'o2l'}
                        value='o2l'
                        onChange={overrideOnline2LocalRadioFunction}
                    />
                </div>
                <div className='mr-3 flex-shrink-0'>
                    <span className='my-auto'>Local to Online</span>
                    <Radio
                        color='primary'
                        disabled={!onlineMode}
                        checked={l2o_override === 'l2o'}
                        value='l2o'
                        onChange={overrideLocal2OnlineRadioFunction}
                    />
                </div>
            </div>
            <button
                onClick={overrideButtonFunction}
                className='bg-blue-600 text-sm -mt-2
                text-white px-1  w-20 h-9 rounded-md border-0 
                hover:bg-blue-500 outline-none'>Override</button>
        </div>

    const mergeButtonZone =
        <div className='pt-6'>
            <div className='font-bold'>Merge</div>
            <div className='flex gap-1 flex-wrap my-2'>
                <div className='mr-3 flex-shrink-0'>
                    <span className='my-auto'>Online to Local</span>
                    <Radio
                        color='primary'
                        disabled={!onlineMode}
                        checked={o2l_merge === 'o2l'}
                        value='o2l'
                        onChange={mergeOnline2LocalRadioFunction}
                    />
                </div>
                <div className='mr-3 flex-shrink-0'>
                    <span className='my-auto'>Local to Online</span>
                    <Radio
                        color='primary'
                        disabled={!onlineMode}
                        checked={l2o_merge === 'l2o'}
                        value='l2o'
                        onChange={mergeLocal2OnlineRadioFunction}
                    />
                </div>
            </div>
            <button
                onClick={mergeButtonFunction}
                className='bg-blue-600 text-sm -mt-2
                text-white px-1  w-20 h-9 rounded-md border-0 mb-7
                hover:bg-blue-500 outline-none'>Merge</button>
            <br className='hidden md:block' />
        </div>

    return (
        // <div className='absolute w-4/5 sm:w-4/6 md:w-4/7 h-6/7 mx-11 sm:mx-28 md:mx-36  lg:mx-48 xl:mx-60 my-16 bg-white z-50 shadow-md rounded-lg'>
        <div className='absolute w-4/5 sm:w-4/6 md:w-4/7 h-auto md:h-4/5 mx-11 sm:mx-28 md:mx-36  lg:mx-48 xl:mx-60 my-3 lg:my-18 md:my-12 sm:my-8 bg-white z-50 shadow-md rounded-lg select-none'>
            <div className='container md:px-20 xl:px-24 px-10 py-6 w-auto mx-px overflow-y-auto h-full'>
                <h1 className='text-2xl py-2 mb-1 sm:w-4/5 w-full font-bold border-b-2'>Setting</h1>
                <div className='flex flex-col pt-1 h-4/5 w-10/12'>
                    {switchZone}
                    <div className='flex flex-wrap'>
                        {overrideButtonZone}
                        {mergeButtonZone}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Setting
