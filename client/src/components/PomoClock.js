import React, { useState, useEffect } from 'react'

import Switch from '../tools/Switch'

const PomoClock = ({ attributeChangeFunction, pomoTimes }) => {
    const [skipFlag, setSkipFlag] = useState(false)
    const [current, setCurrent] = useState(null)
    const [time, setTime] = useState(25 * 60)
    const [isActive, setIsActive] = useState(false)
    const [doneFlag, setDoneFlag] = useState(false)

    const minusGap = skipFlag ? 2 : 1

    // useEffect(()=>{
    //     const pomo = Math.ceil(current/2)
    //     pomoTimesChanger(pomo)
    //     return
    // }, [current])
    useEffect(() => {
        if (current === 0) {
            pomoTimesChanger(0)
        }
        return
    }, [current])

    useEffect(() => {
        setCurrent(2 * pomoTimes)
        setIsActive(false)
        setTime(25 * 60)
        if (pomoTimes === 0) {
            setDoneFlag(true)
        } else {
            setDoneFlag(false)
        }
        return
    }, [pomoTimes])

    useEffect(() => {
        // console.log(time, 'time')
        let interval = null
        if (isActive) {
            interval = setInterval(() => {
                setTime(time => {
                    if (time > 0) {
                        if (time - 1 === 0) {
                            setIsActive(false)
                            if (skipFlag)
                                setTime(25 * 60)
                            else
                                if (current % 2 !== 0) {
                                    setTime(25 * 60)
                                } else {
                                    setTime(5 * 60)
                                }
                            setCurrent(current => {
                                if (current - minusGap > 0) {
                                    return current - minusGap
                                } else {
                                    setDoneFlag(true)
                                    return 0
                                }
                            })
                        }
                        return time - 1
                    } else {
                        return 0
                    }
                })

            }, 1000)
        } else if (!isActive && time !== 0) {
            clearInterval(interval)
            return
        }
        return () => clearInterval(interval)
    }, [time, isActive])

    const pomoTimesChanger = (value) => {
        attributeChangeFunction('pomoTimes', value)
    }

    const skipRestFunction = (value) => {
        setSkipFlag(value)
        if (current % 2 !== 0) {
            setTime(25 * 60)
            setCurrent(current => current - 1)
            if (current - 1 === 0)
                setDoneFlag(true)
        }
    }

    const startButton = () => {
        setIsActive(true)
    }

    const resetButton = () => {
        setIsActive(false)
        if (current % 2 === 0) {
            setTime(25 * 60)
        } else {
            setTime(5 * 60)
        }
    }

    const nextButton = () => {
        setIsActive(false)
        if (current - minusGap > 0) {
            const nextCurrent = current - minusGap
            if (!skipFlag) {
                if (current % 2 !== 0) {
                    setTime(25 * 60)
                } else {
                    setTime(5 * 60)
                }
            } else {
                setTime(25 * 60)
            }
            setCurrent(nextCurrent)
            // console.log('works nextbutton')
        } else {
            setCurrent(0)
            setDoneFlag(true)
        }
    }

    const minute = Math.floor(time / 60)
    const second = Math.floor(time % 60)
    const pomoLeft = Math.ceil(current / 2)

    // console.log(current)

    return (
        <div className='flex flex-col'>
            <div>
                <span>Skip Rest</span>
                <Switch checked={skipFlag} onClick={() => skipRestFunction(!skipFlag)} />
                <span>{pomoLeft}</span>
            </div>
            <div className='w-4/5  bg-gray-200 m-3 ml-0 flex flex-row'>
                <div className='relative text-4xl  mx-auto my-16 p-6'>
                    {doneFlag ? 'Done' : <div>{minute} : {second}</div>}
                </div>
            </div>
            <div className='flex w-4/5 flex-wrap'>
                <button
                    onClick={startButton}
                    className='bg-blue-600 text-sm m-2 mx-auto
                        text-white   w-16 h-9 rounded-md border-0 
                        hover:bg-blue-500'>
                    Start
                </button>
                <button
                    onClick={resetButton}
                    className='bg-blue-600 text-sm m-2 mx-auto
                        text-white   w-16 h-9 rounded-md border-0 
                        hover:bg-blue-500'>
                    Reset
                </button>
                <button
                    onClick={nextButton}
                    className='bg-gray-600 text-sm m-2 mx-auto
                        text-white   w-16 h-9 rounded-md border-0 
                        hover:bg-gray-500'>
                    Next
                </button>
            </div>
        </div>
    )
}



export default React.memo(PomoClock)
