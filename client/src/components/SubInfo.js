import React, { useContext, useState, useRef, useEffect } from 'react'
import DeleteIcon from '@material-ui/icons/Delete'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import SubItem from './SubItem'
import Checkbox from '../tools/Checkbox'
import Switch from '../tools/Switch'
import Slider from '../tools/Slider'
import { Context } from '../tools/Context'
import { ContextApp } from '../tools/Context'
import PomoClock from './PomoClock'
import CryptoJS from 'crypto-js'
import TimerIcon from '@material-ui/icons/Timer'

const SubInfo = ({ infoSpace, infoPageHandler }) => {
    const { id, taskName, checked, priority, pomoTimes,
        subTasks, chain, push } = infoSpace
    const { itemDeleteHandler, attributeChangeHandler, pomoMode, clockMode,
        itemDeleteUploader, attributeChangeUploader } = useContext(Context)
    const { todoFlag } = useContext(ContextApp)

    const [inputHolder, setInputHolder] = useState('')
    const [mobileClockFlag, setMobileClockFlag] = useState(false)

    const ref = useRef()

    const tag = `Pomodoro Times  ${pomoTimes}`

    const blue = { fill: '#155fd8' }
    const gray = { fill: '#7b8088' }

    useEffect(() => {
        const listener = (event) => {
            const { activeElement } = document
            const targetElement = ref.current
            if (targetElement === activeElement)
                if (event.code === 'Enter' || event.code === 'NumpadEnter') {
                    addSubTaskFunction()
                    event.preventDefault()
                }
        }
        document.addEventListener('keydown', listener)
        return () => {
            document.removeEventListener('keydown', listener)
        }
    })

    const inputSubTaskFunction = (e) => {
        const { value } = e.target
        setInputHolder(value)
    }

    const addSubTaskFunction = () => {
        const seed = new Date()
        let id = seed.getTime() + 13
        // id = CryptoJS.SHA256(id).toString()
        const item = {
            id: id,
            subTaskName: inputHolder,
            checked: false,
        }
        const oldData = subTasks
        const length = oldData.length
        // console.log(length,'subtask-length')
        if (length < 5) {
            const newData = [...oldData, item]
            if (inputHolder !== '')
                attributeChangeFunction('subTasks', newData)
            setInputHolder('')
        } else {
            setInputHolder('')
            if (inputHolder !== '')
                window.alert("You can't splite a task more than 5 parts")
        }
    }

    const deleteFunction = () => {
        itemDeleteHandler(id)
        itemDeleteUploader(id, todoFlag)
        infoPageHandler(false)
    }

    const taskNameFunction = (e) => {
        const { value } = e.target
        attributeChangeFunction('taskName', value)
    }

    const pomoTimesFunction = (e, value) => {
        attributeChangeFunction('pomoTimes', value)
    }

    const attributeChangeFunction = (name, value) => {
        attributeChangeHandler(name, value, id)
        attributeChangeUploader(name, value, id, todoFlag, chain)
    }

    /**
     * child functions
     */

    const deleteSubTaskHandler = (id) => {
        const oldSubData = subTasks
        const newSubData = oldSubData.filter(e => e.id !== id)
        attributeChangeFunction('subTasks', newSubData)
    }

    const checkSubTaskFHandler = (id, value) => {
        const oldSubData = subTasks
        const newSubData = oldSubData.map((e, index) => {
            if (e.id === id) {
                e.checked = value
            }
            return e
        })
        attributeChangeFunction('subTasks', newSubData)
    }


    /**
     * Components
     */

    const subItemList = subTasks.map((e, index) => {
        return <SubItem
            deleteSubTaskHandler={deleteSubTaskHandler}
            checkSubTaskFHandler={checkSubTaskFHandler}
            key={e.id + 0.0001} id={e.id}
            subTaskName={e.subTaskName} checked={e.checked} />
    })

    const head =
        <div className='flex'>
            <input
                onChange={taskNameFunction}
                value={taskName}
                className='basis-7/8 outline-none inline-block p-2 w-5/6 border-b-2 focus:border-blue-500 font-bold text-xl' />
            <DeleteIcon
                onClick={deleteFunction}
                className='hover:cursor-pointer basis-1/8 mx-auto my-auto'
            />
        </div>

    const details =
        <div >
            <div className='flex select-none'>
                <div className='basis-2/7 my-auto'>
                    <span>Check</span>
                    <Checkbox
                        checked={checked}
                        onClick={() => attributeChangeFunction('checked', !checked)}
                    />
                </div>
                <div className='basis-1/7 my-auto mx-4'>
                    <span >Priority</span>
                    <Switch
                        color='primary'
                        checked={priority}
                        onChange={() => attributeChangeFunction('priority', !priority)}
                    />
                </div>
                {(clockMode && todoFlag) ? <div className='basis-3/7 my-auto mx-4 md:hidden block'>
                    <span className='relative bottom-1' >PomoClock</span>
                    <TimerIcon
                        onClick={() => setMobileClockFlag(true)}
                        className='h-full mx-2 relative bottom-px hover:cursor-pointer'
                        style={pomoTimes === 0 ? gray : blue} />
                </div> : null}
                {todoFlag ? null :
                    <div className='basis3/7 my-auto mx-4'>
                        <span >Loaded</span>
                        <Switch
                            color='primary'
                            checked={push}
                            onChange={() => attributeChangeFunction('push', !push)}
                        />
                    </div>}
            </div>
            {pomoMode ?
                <div className='my-auto select-none'>
                    <div className='w-2/6 py-2 inline-block'>{tag}</div>
                    <div className='w-3/6 relative top-2 inline-block -mx-2'>
                        <Slider
                            step={1}
                            min={0}
                            max={5}
                            value={pomoTimes}
                            onChange={pomoTimesFunction}
                        />
                    </div>
                </div> : null}
            <div>
                <input
                    ref={ref}
                    value={inputHolder}
                    onChange={inputSubTaskFunction}
                    placeholder='Input sub task here'
                    className='outline-none inline-block w-3/5 border-b-2' />
                <AddCircleIcon
                    onClick={addSubTaskFunction}
                    style={{ fill: '#155fd8' }}
                    color='primary'
                    className='relative hover:cursor-pointer left-2'
                />
            </div>
            <div>
                {subItemList}
            </div>
        </div>

    const pomodoro =
        <div className='select-none'>
            <PomoClock pomoTimes={pomoTimes} attributeChangeFunction={attributeChangeFunction} />
        </div>

    const clockClassName = clockMode ? 'grid grid-cols-3 container my-4' : 'grid grid-cols-2 container my-4'
    const mobileClockClassName = mobileClockFlag ? 'block md:col-span-1 sm:col-span-2 col-span-3' : 'md:block hidden'
    const mobileDetailsClassName = mobileClockFlag ? 'hidden' : 'md:col-span-2 col-span-3'
    return (
        <div className='absolute z-50 bg-white mx-auto lg:w-8/12 w-5/6 h-5/6 my-8 rounded-xl shadow-md'>
            <div className='container mx-5 my-4 p-4 w-auto'>
                {head}
                <div className={clockClassName}>
                    <div className={mobileDetailsClassName}>{details}</div>
                    {(clockMode && todoFlag) ? <div className={mobileClockClassName}>{pomodoro}</div> : null}
                </div>
            </div>

        </div>
    )
}

export default React.memo(SubInfo)
