import React, { useState, useEffect, useContext } from 'react'
import SubInfo from '../components/SubInfo'
import Add from '../components/Add'
import Holder from './Holder'
import Backdrop from '../tools/Backdrop'
import axios from '../axios'
import { Context } from '../tools/Context'
import { ContextApp } from '../tools/Context'

const Container = ({ pomoMode, clockMode, onlineMode,
    todoFlag, refresh, modeChangeHandler }) => {
    const [infoFlag, setInfoFlag] = useState(false)
    const [infoSpace, setInfoSpace] = useState({})
    const [infoId, setInfoId] = useState('')
    const [todoData, setTodoData] = useState([])
    const [scheduleData, setScheduleData] = useState([])

    const { account } = useContext(ContextApp)

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

    const onlineDataFetchingHandler = () => {
        console.log('fetching online')
        if (account) {
            axios.post('/todoData.json', { account: account })
                .then(res => {
                    const { data } = res
                    const onlineData = data
                    if (onlineData)
                        setDataFunction(true, onlineData, 'online')
                })
                .catch(err => {
                    console.log(err)
                    window.alert('You are offline now, turn to local ')
                    modeChangeHandler(false, "onlineMode")
                })
            axios.post('/scheduleData.json', { account: account })
                .then(res => {
                    const { data } = res
                    const onlineData = data
                    if (onlineData)
                        setDataFunction(false, onlineData, 'online')
                })
                .catch(err => {
                    console.log(err)
                    window.alert('You are offline now, turn to local ')
                    modeChangeHandler(false, "onlineMode")
                })
        }
    }

    const localDataFetchingHandler = () => {
        console.log('fetching local')
        const todoData = JSON.parse(localStorage.getItem('localTodoData'))
        if (todoData) {
            setDataFunction(true, todoData, 'local')
        } else {
            setDataFunction(true, [], 'local')
        }
        const scheduleData = JSON.parse(localStorage.getItem('localScheduleData'))
        if (scheduleData) {
            setDataFunction(false, scheduleData, 'local')
        } else {
            setDataFunction(false, [], 'local')
        }
    }

    // fetching data to state

    useEffect(() => {
        if (onlineMode) {
            onlineDataFetchingHandler()
        } else {
            localDataFetchingHandler()
        }
        return
    }, [refresh, onlineMode])

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

    const itemDeleteHandler = (id) => {
        const oldTodoData = todoData
        const oldScheduleData = scheduleData
        const newTodoData = oldTodoData.filter((e) => e.id !== id)
        const newScheduleData = oldScheduleData.filter((e) => e.id !== id)
        setTodoData(newTodoData)
        setScheduleData(newScheduleData)
        if (!onlineMode) {
            localStorage.setItem('localTodoData', JSON.stringify(newTodoData))
            localStorage.setItem('localScheduleData', JSON.stringify(newScheduleData))
        }
    }

    const pushHandler = (id, add, scheduleData) => {
        const oldTodoData = [...todoData]
        if (add) {
            let itemArray = scheduleData.filter(e => e.id === id)
            const newData = [...oldTodoData, ...itemArray]
            setTodoData(newData)
            if (!onlineMode)
                localStorage.setItem('localTodoData', JSON.stringify(newData))
        } else {
            const newData = oldTodoData.filter(e => e.id !== id)
            // console.log(newData, 'minus')
            setTodoData(newData)
            if (!onlineMode)
                localStorage.setItem('localTodoData', JSON.stringify(newData))
        }
    }

    const itemAddHandler = (item, type) => {
        const oldData = type ? todoData : scheduleData
        const newData = [...oldData, item]
        if (type) {
            setTodoData(newData)
            setScheduleData(newData)
            if (!onlineMode) {
                localStorage.setItem('localTodoData', JSON.stringify(newData))
                localStorage.setItem('localScheduleData', JSON.stringify(newData))
            }
        }
        else {
            setScheduleData(newData)
            if (!onlineMode)
                localStorage.setItem('localScheduleData', JSON.stringify(newData))
        }
    }

    const attributeChangeHandler = (name, value, id) => {
        const oldTodoData = todoData
        const oldScheduleData = scheduleData
        const newTodoData = oldTodoData.map((e, index) => {
            if (e.id === id) {
                e[name] = value
                if (name === 'push')
                    e.chain = value
            }
            return e
        })
        const newScheduleData = oldScheduleData.map((e, index) => {
            if (e.id === id) {
                e[name] = value
                if (name === 'push')
                    e.chain = value
            }
            return e
        })
        setTodoData(newTodoData)
        setScheduleData(newScheduleData)
        if (!onlineMode) {
            localStorage.setItem('localTodoData', JSON.stringify(newTodoData))
            localStorage.setItem('localScheduleData', JSON.stringify(newScheduleData))
        }
        if (name === 'push')
            pushHandler(id, value, newScheduleData)
    }

    /**
     * sundden offline handler
     */

    const suddenOfflineHandler = (type) => {
        const onlineTodo = todoData
        const onlineSchedule = scheduleData
        const localTodo = JSON.parse(localStorage.getItem('localTodoData'))
        const localSchedule = JSON.parse(localStorage.getItem('localScheduleData'))
        const newTodoData = [...localTodo, ...onlineTodo]
        const newScheduleData = [...localSchedule, ...onlineSchedule]
        localStorage.setItem('localTodoData', JSON.stringify(newTodoData))
        localStorage.setItem('localScheduleData', JSON.stringify(newScheduleData))
    }

    /**
     * Uploader function Context
     */


    const attributeChangeUploader = (name, value, id, type, chain) => {
        if (onlineMode) {
            const data = { name, value, id, type, chain, account }
            axios.post('/attributeChange.json', data)
                .then(res => {
                    if (chain) {
                        axios.post('/attributeChange.json', { name, value, id, type: !type, chain, account })
                            .then(res => {
                                console.log('update')
                            })
                            .catch(err => {
                                console.log(err)
                                window.alert('You are offline now, turn to local ')
                                modeChangeHandler(false, "onlineMode")
                                const tag = type ? 'todo' : 'schedule'
                                suddenOfflineHandler(tag)
                            })
                    } else {
                        console.log('update')
                    }

                })
                .catch(err => {
                    console.log(err)
                    window.alert('You are offline now, turn to local ')
                    modeChangeHandler(false, "onlineMode")
                    const tag = type ? 'todo' : 'schedule'
                    suddenOfflineHandler(tag)
                })
            if (name === 'push') {
                if (value) {
                    let item = {}
                    scheduleData.map((e, index) => {
                        if (e.id === id) {
                            e[name] = value
                            if (name === 'push')
                                e.chain = value
                            item = e
                        }
                        return e
                    })
                    const packData = { item, type: true, account }
                    axios.post('/itemAdd.json', packData)
                        .then(res => {
                            console.log('update add todo')
                        })
                        .catch(err => {
                            console.log(err)
                            window.alert('You are offline now, turn to local ')
                            modeChangeHandler(false, "onlineMode")
                            const tag = type ? 'todo' : 'schedule'
                            suddenOfflineHandler(tag)
                        })
                } else {
                    const packData = { id, account }
                    axios.post('/chainDelete.json', packData)
                        .then(res => {
                            console.log('update minus todo')
                        })
                        .catch(err => {
                            console.log(err)
                            window.alert('You are offline now, turn to local ')
                            modeChangeHandler(false, "onlineMode")
                            const tag = type ? 'todo' : 'schedule'
                            suddenOfflineHandler(tag)
                        })
                }
            }

        } else {
            console.log('local update')
        }
    }

    const itemDeleteUploader = (id, type) => {
        if (onlineMode) {
            const data = { id, account }
            axios.post('/itemDelete.json', data)
                .then(res => {
                    console.log('delete')
                })
                .catch(err => {
                    console.log(err)
                    window.alert('You are offline now, turn to local ')
                    modeChangeHandler(false, "onlineMode")
                    const tag = type ? 'todo' : 'schedule'
                    suddenOfflineHandler(tag)
                })
        } else {
            console.log('local delete')
        }
    }

    const passingContext = {
        pushHandler, infoIdHandler, itemAddHandler, itemDeleteHandler,
        pomoMode, modeChangeHandler, clockMode, attributeChangeHandler,
        attributeChangeUploader, itemDeleteUploader
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
