import React, { useState, useEffect } from 'react'
import SubInfo from '../components/SubInfo'
import Add from '../components/Add'
import Holder from './Holder'
import Backdrop from '../tools/Backdrop'
import axios from '../axios'
import { Context } from '../tools/Context'
// import { ContextApp } from '../tools/Context'

const Container = ({ pomoMode, clockMode, onlineMode,
    todoFlag, refresh, modeChangeHandler }) => {
    const [infoFlag, setInfoFlag] = useState(false)
    const [infoSpace, setInfoSpace] = useState({})
    const [infoId, setInfoId] = useState('')
    const [todoData, setTodoData] = useState([])
    const [scheduleData, setScheduleData] = useState([])

    // flag handler

    const infoPageHandler = (value) => {
        setInfoFlag(value)
    }

    /**
     * Data fetching and setting function
     */

    const setDataFunction = (flag, data, type) => {
        if (flag) {
            setTodoData(data)
            console.log(`${type} todoData load`, data, onlineMode)
        } else {
            setScheduleData(data)
            console.log(`${type} scheduleData load`, data, onlineMode)
        }
    }

    const onlineDataFetchingHandler = (flag) => {
        let api = flag ? '/todoData.json' : '/scheduleData.json'
        console.log('fetching online')
        axios.get(api)
            .then(res => {
                const { data } = res
                const onlineData = data
                if (onlineData)
                    setDataFunction(flag, onlineData, 'online')
            })
            .catch(err => {
                console.log(err)
                window.alert('You are offline now, turn to local ')
                modeChangeHandler(false, "onlineMode")
            })
    }

    const localDataFetchingHandler = (flag) => {
        console.log('fetching local')
        const tagString = flag ? 'localTodoData' : 'localScheduleData'
        const localData = JSON.parse(localStorage.getItem(tagString))
        // console.log('localdata .......', localData)
        if (localData) {
            setDataFunction(flag, localData, 'local')
        } else {
            setDataFunction(flag, [], 'local')
        }
    }

    // fetching data to state

    useEffect(() => {
        const flag = todoFlag
        if (onlineMode) {
            onlineDataFetchingHandler(flag)
        } else {
            localDataFetchingHandler(flag)
        }
        return
    }, [refresh, onlineMode])

    // set data to localStorage

    useEffect(() => {
        if (!onlineMode) {
            if (todoData) {
                console.log('[todo] set to localStorage', todoData)
                localStorage.setItem('localTodoData', JSON.stringify(todoData))
            }
            if (scheduleData) {
                console.log('[schedule] set to localStorage', scheduleData)
                localStorage.setItem('localScheduleData', JSON.stringify(scheduleData))
            }
        }
        return
    }, [todoData, scheduleData, onlineMode])

    /**
     * context function
     */

    const infoIdHandler = (id, type) => {
        setInfoId(id)
        const data = type ? todoData : scheduleData
        data.forEach(e => {
            if (e.id === id)
                setInfoSpace(e)
        })
        infoPageHandler(true)
    }

    const itemDeleteHandler = (id, type, chain) => {
        // const oldData = type ? todoData : scheduleData
        const oldTodoData = todoData
        const oldScheduleData = scheduleData
        const newTodoData = oldTodoData.filter((e) => e.id !== id)
        const newScheduleData = oldScheduleData.filter((e) => e.id !== id)
        // setDeleteFlag(true)
        if (type) {
            setTodoData(newTodoData)
            setScheduleData(newScheduleData)
        }
        else {
            if (chain) {
                setScheduleData(newScheduleData)
                setTodoData(newTodoData)
            } else {
                setScheduleData(newScheduleData)
            }
        }

    }


    const itemAddHandler = (item, type) => {
        const oldData = type ? todoData : scheduleData
        const newData = [...oldData, item]
        if (type) {
            setTodoData(newData)
            setScheduleData(newData)
        }
        else
            setScheduleData(newData)
    }

    const attributeChangeHandler = (name, value, id, type, chain) => {
        // const oldData = type ? todoData : scheduleData
        const oldTodoData = todoData
        const oldScheduleData = scheduleData
        const newTodoData = oldTodoData.map((e, index) => {
            if (e.id === id) {
                e[name] = value
            }
            return e
        })
        const newScheduleData = oldScheduleData.map((e, index) => {
            if (e.id === id) {
                e[name] = value
            }
            return e
        })
        if (type) {
            setTodoData(newTodoData)
            setScheduleData(newScheduleData)
        }
        else {
            if (chain) {
                setScheduleData(newScheduleData)
                setTodoData(newTodoData)
            } else {
                setScheduleData(newScheduleData)
            }
        }
    }

    /**
     * sundden offline handler
     */

    const suddenOfflineHandler = (type) => {
        const onlineTodo = todoData
        const tag = type === 'todo' ? 'localTodoData' : 'localScheduleData'
        const localTodo = JSON.parse(localStorage.getItem(tag))
        const newData = [...localTodo, ...onlineTodo]
        localStorage.setItem(tag, JSON.stringify(newData))
    }

    /**
     * Uploader function Context
     */

    const attributeChangeUploader = (name, value, id, type, chain) => {
        if (onlineMode) {
            const data = { name, value, id, type, chain }
            axios.post('/attributeChange.json', data)
                .then(res => {
                    console.log('update')
                    axios.post('/attributeChange.json', { name, value, id, type: false })
                        .then(res => {
                            // console.log('update ...')
                        })
                        .catch(err => {
                            console.log(err)
                            window.alert('You are offline now, turn to local (add with schdule)')
                            modeChangeHandler(false, "onlineMode")
                            suddenOfflineHandler('todo')
                        })
                })
                .catch(err => {
                    console.log(err)
                    window.alert('You are offline now, turn to local ')
                    modeChangeHandler(false, "onlineMode")
                    suddenOfflineHandler('todo')
                })
        } else {
            console.log('local update')
        }
    }

    const itemDeleteUploader = (id, type, chain) => {
        if (onlineMode) {
            const data = { id, type, chain }
            axios.post('/itemDelete.json', data)
                .then(res => {
                    console.log('delete')
                    axios.post('/itemDelete.json', { id, type: false })
                        .then(res => {
                            // console.log('delete')
                        })
                        .catch(err => {
                            console.log(err)
                            window.alert('You are offline now, turn to local (add with schdule)')
                            modeChangeHandler(false, "onlineMode")
                            suddenOfflineHandler('todo')
                        })
                })
                .catch(err => {
                    console.log(err)
                    window.alert('You are offline now, turn to local ')
                    modeChangeHandler(false, "onlineMode")
                    suddenOfflineHandler('todo')
                })
        } else {
            console.log('local delete')
        }
    }

    const passingContext = {
        infoIdHandler, itemAddHandler, itemDeleteHandler, pomoMode, modeChangeHandler,
        clockMode, attributeChangeHandler, attributeChangeUploader, itemDeleteUploader
    }

    // console.log(onlineMode, 'render container')
    return (
        <div className='container w-full h-screen mx-auto px-10 py-5'>
            <Context.Provider value={passingContext}>
                {infoFlag ?
                    <div>
                        <SubInfo infoSpace={infoSpace} infoPageHandler={infoPageHandler} />
                        <div onClick={() => infoPageHandler(false)}>
                            <Backdrop />
                        </div>
                    </div> : null}
                <div className='-z-20'>
                    <Add onlineMode={onlineMode} suddenOfflineHandler={suddenOfflineHandler} />
                    {todoFlag ? <Holder data={todoData} />
                        : <Holder data={scheduleData} />}
                </div>
            </Context.Provider>
        </div>
    )
}

export default React.memo(Container)
