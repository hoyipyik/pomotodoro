import React, {useState, useContext, useEffect, useRef} from 'react'
import MenuIcon from '@material-ui/icons/Menu'
import { Context } from '../tools/Context'
import { ContextApp } from '../tools/Context'
import CryptoJS from 'crypto-js'
import axios from '../axios'

const Add = ({onlineMode, suddenOfflineHandler}) => {
    const [taskName, setTaskName] = useState('')

    const {itemAddHandler, modeChangeHandler} = useContext(Context)
    const {minSidebarHandler, todoFlag, account, encryptFunction, decryptFunction, 
        itemEncryptHandler, itemDecryptHandler, arrayDecryptHandler, arrayEncryptHandler} = useContext(ContextApp)
    const ref = useRef()

    useEffect(()=>{
        const listener = (event) =>{
            const {activeElement} = document
            // const targetElement = document.getElementById('addInput')
            const targetElement = ref.current
            // console.log(ref.current)
            if(activeElement === targetElement)
                if(event.code === 'Enter' || event.code === 'NumpadEnter'){
                    buttonFunction()
                    // console.log('enter')
                    event.preventDefault()
                    ref.current.focus()
                }     
        }

        document.addEventListener('keydown', listener)
        return ()=>{
            document.removeEventListener('keydown', listener)
        }
    }, )

    const inputFunction = (e) =>{
        const {value} = e.target
        setTaskName(value)
    }

    const addItemFunction = (name, type) =>{
        const taskName = name
        const seed = new Date()
        let id = seed.getTime()+21
        // id = CryptoJS.SHA256(id).toString()
        // console.log(typeof(id))
        const item = {
            id: id,
            taskName: taskName,
            checked: false,
            priority: false,
            pomoTimes: 0,
            chain: type,
            push: type,
            subTasks: [],
        }
        const item_schedule ={
            id: id,
            taskName: taskName,
            checked: false,
            priority: false,
            pomoTimes: 0,
            chain: true,
            push: true,
            subTasks: [], 
        }
        if (taskName!==''){
            if(type){
                itemAddHandler(item, type)
                itemAddHandler(item_schedule, !type)
                itemAddUploader(item, type)
                itemAddUploader(item_schedule, !type)
            }else{
                itemAddHandler(item, type)
                itemAddUploader(item, type)
            }
            
        }
        setTaskName('')
    }

    const buttonFunction = () =>{
        const type = todoFlag
        addItemFunction(taskName, type)
    }

    /**
     * Uploader Function
     */

    const itemAddUploader = (item, type) =>{
        if(onlineMode){
            const item_c = itemEncryptHandler(item)
            const type_c = encryptFunction(type.toString())
            const account_c = encryptFunction(account)
            const pack = {item_c, type_c, account_c}
            const tag = type ? 'todo' : 'schedule'
            axios.post('/itemAdd.json', pack)
            .then(res=>{
                console.log('add')
            })
            .catch(err=>{
                console.log(err)
                window.alert('You are offline now, turn to local ')
                modeChangeHandler(false, "onlineMode")
                suddenOfflineHandler(tag)
            })
        }else{
            console.log('local add')
        }
    }

    const title = todoFlag ? "What's Your Plan Today" : "This is Your Schedule Book"

    return (
        <div className='select-none'>
            <header>
                <div className='flex'>
                    <div 
                        onClick={minSidebarHandler} 
                        className='lg:hidden h-full my-auto mr-2  hover:cursor-pointer'><MenuIcon /></div>
                    <h1 className='inline md:text-2xl text-xl font-bold font-sans'>{title}</h1>
                </div>
                <input
                    id='addInput'
                    ref={ref} 
                    value={taskName}
                    onChange={inputFunction} 
                    className='lg:w-5/6  px-2 py-1 h-11 my-4  w-full border-2 border-gray-400 focus:border-gray-500 outline-none rounded block'>
                </input>
                <button
                    onClick={buttonFunction}
                    className='text-lg bg-blue-600 text-white px-2 w-20 h-10 rounded-md border-0 hover:bg-blue-500 outline-none'
                    >
                    Add
                </button>
            </header>
        </div>
    )
}

export default Add
