import React, { useContext, useState, useEffect, useRef } from 'react'
import axios from '../axios'
import testImg from '../images/user.png'
import { ContextApp } from '../tools/Context'
import Switch from '../tools/Switch'

const Account = ({ modeChangeHandler, keepMode, accountPageHandler, refreshHandler }) => {

    const [signed, setSigned] = useState(false)
    const [usernameHolder, setUsernameHolder] = useState('')
    const [passwordHolder, setPasswordHolder] = useState('')
    const [deleteConfirmFlag, setDeleteConfirmFlag] = useState(false)

    const { account, accountHandler, accountInfo, accountInfoHandler, encryptFunction, decryptFunction } = useContext(ContextApp)
    const { username, name, icon } = accountInfo

    const blue = { color: '#155fd8' }

    const ref1 = useRef()
    const ref2 = useRef()

    useEffect(() => {
        if (account) {
            const account_c = encryptFunction(account)
            const pack = { account_c: account_c }
            axios.post('/info.json', pack)
                .then(res => {
                    const {username_c, icon_c, name_c} = res.data
                    const username = decryptFunction(username_c)
                    const icon = decryptFunction(icon_c)
                    const name = decryptFunction(name_c)
                    const info = {username, icon, name}
                    accountInfoHandler(info)
                    if (keepMode)
                        localStorage.setItem('accountInfo', JSON.stringify(info))
                    console.log('account info load', info)
                })
                .catch(err => console.log(err))
            return
        }
    }, [account])

    useEffect(() => {
        const flag = JSON.parse(localStorage.getItem('signed'))
        setSigned(flag)
        return
    }, [])

    useEffect(() => {
        const listener = (e) => {
            const activeElement = document.activeElement
            if (activeElement === ref2.current || activeElement === ref1.current) {
                if (e.code === 'Enter' || e.code === 'NumpadEnter') {
                    console.log('listener')
                    if (!deleteConfirmFlag)
                        submitButton()
                    else
                        deleteConfirmHandler()
                }
            }
        }
        document.addEventListener('keydown', listener)
        return () => {
            document.removeEventListener('keydown', listener)
        }
    })

    const signedHandler = (value) => {
        setSigned(value)
    }

    const usernameHandler = (e) => {
        const { value } = e.target
        setUsernameHolder(value)
    }

    const passwordHandler = (e) => {
        const { value } = e.target
        setPasswordHolder(value)
    }

    const submitButton = () => {
        console.log('button works')
        // true log; false sign
        const type = signed
        const username = usernameHolder
        const password = passwordHolder
        const username_c = encryptFunction(username)
        const password_c = encryptFunction(password)
        const pack = { username_c, password_c }
        // console.log(pack)
        const addr = type ? '/login.json' : '/signup.json'
        if (usernameHolder && passwordHolder) {
            axios.post(addr, pack)
                .then(res => {
                    const backFlag_c = res.data.msg
                    const backFlag = (decryptFunction(backFlag_c) === 'true')
                    if (backFlag) {
                        if (type) {
                            const user = username.replaceAll(' ', '_')
                            accountHandler(user)
                            console.log('login success')
                            modeChangeHandler(true, 'onlineMode')
                            if (keepMode)
                                localStorage.setItem('account', JSON.stringify(user))
                            localStorage.setItem('signed', JSON.stringify(true))
                        } else {
                            setSigned(true)
                            console.log('signup success')
                            ref1.current.focus()
                            refreshHandler()
                            localStorage.setItem('signed', JSON.stringify(true))
                        }
                        setUsernameHolder('')
                        setPasswordHolder('')
                    } else {
                        if (type) {
                            console.log('login failed')
                            window.alert('login failed')
                        } else {
                            console.log('signup failed')
                            window.alert('username used')
                            setUsernameHolder('')
                            setPasswordHolder('')
                        }
                    }
                })
                .catch(err => {
                    console.log(err)
                    window.alert('err')
                })
        }
    }

    const logOutFunction = () => {
        accountHandler('')
        accountInfoHandler({})
        modeChangeHandler(false, 'onlineMode')
        localStorage.setItem('account', JSON.stringify(''))
        localStorage.setItem('accountInfo', JSON.stringify({}))
    }

    const deleteAccountFunction = () => {
        setDeleteConfirmFlag(true)
    }

    const deleteConfirmHandler = () => {
        const username = usernameHolder
        const password = passwordHolder
        const username_c = encryptFunction(username)
        const password_c = encryptFunction(password)
        const pack = { username_c, password_c }
        axios.post('/deleteAccount.json', pack)
            .then(res => {
                const backFlag = res.data.msg
                if (backFlag) {
                    console.log('account delete success')
                    logOutFunction()
                    accountPageHandler(false)
                } else {
                    window.alert('password or username false')
                    console.log('account delete fail')
                }
            })
            .catch(err => console.log(err))
    }

    const accountContentsClassName = deleteConfirmFlag ? 'basis-2/3 flex-wrap py-4 lg:block hidden' : 'basis-2/3 flex-wrap py-4'

    const accountContents =
        <div className={accountContentsClassName}>
            <div className='mb-2'>
                <h3 className='text-lg font-semibold mb-2 '>Name</h3>
                <div className='text-lg' style={blue}>{name}</div>
            </div>

            <div className='mb-2'>
                <h3 className='text-lg font-semibold mb-2 '>Keep Login</h3>
                <Switch className='-mx-3' color='primary' onClick={() => modeChangeHandler(!keepMode, 'keepMode')} checked={keepMode} />
            </div>

            {/* <div>
                <h3 className='text-lg font-semibold'>Icon</h3>
                <img className='aspect-square w-1/4 h-auto' src={testImg} />
            </div> */}

            <div>
                <h3 className='text-lg font-semibold'>Actions</h3>
                <button
                    onClick={logOutFunction}
                    className='bg-blue-600 text-sm mt-2
                    text-white px-1  w-16 h-9 rounded-md border-0
                    hover:bg-blue-500 outline-none'>
                    Logout
                </button>
            </div>

            <div>
                <h3 className=' mt-4'>Delete Account</h3>
                <button
                    onClick={deleteAccountFunction}
                    className='bg-blue-600 text-sm mt-2
                    text-white px-1  w-16 h-9 rounded-md border-0
                    hover:bg-blue-500 outline-none'>
                    Delete
                </button>
            </div>
        </div>

    const sign =
        <div>
            <h3 className='text-lg font-semibold mb-2'>Signup</h3>
            <h4 className='font-semibold'>username</h4>
            <input
                value={usernameHolder}
                ref={ref1}
                className='my-1 p-1 border-2 border-gray-400 focus:border-gray-500 outline-none rounded block'
                onChange={usernameHandler}
            />
            <h4 className='font-semibold'>password</h4>
            <input
                ref={ref2}
                type='password'
                value={passwordHolder}
                className='my-1 p-1 border-2 border-gray-400 focus:border-gray-500 outline-none rounded block'
                onChange={passwordHandler}
            />
            <button
                className='bg-blue-600 text-sm  mt-2
                text-white px-1  w-16 h-8 rounded-md border-0 mb-7
                hover:bg-blue-500 outline-none'
                onClick={submitButton}
            >
                <span className=' text-sm'>Sign up</span>
            </button>
            <div className='relative top-10 text-sm'>
                <span className=' hover:cursor-pointer' onClick={() => signedHandler(false)} style={blue}>Signup</span>
                <span>&ensp;/&ensp;</span>
                <span className=' hover:cursor-pointer' onClick={() => signedHandler(true)}>Login</span>
            </div>
        </div>

    const log =
        <div>
            <h3 className='text-lg font-semibold mb-2'>Login</h3>
            <h4 className='font-semibold'>username</h4>
            <input
                ref={ref1}
                value={usernameHolder}
                className='my-1 p-1 border-2 border-gray-400 focus:border-gray-500 outline-none rounded block'
                onChange={usernameHandler}
            />
            <h4 className='font-semibold'>password</h4>
            <input
                ref={ref2}
                type='password'
                value={passwordHolder}
                className='my-1 p-1 border-2 border-gray-400 focus:border-gray-500 outline-none rounded block'
                onChange={passwordHandler}
            />
            <button
                className='bg-blue-600 text-sm  mt-2
                text-white px-1  w-16 h-8 rounded-md border-0 mb-7
                hover:bg-blue-500 outline-none'
                onClick={submitButton}
            >
                <span className=' text-sm'>Log in</span>
            </button>
            <div className='relative top-10 text-sm'>
                <span className=' hover:cursor-pointer' onClick={() => signedHandler(false)}>Signup</span>
                <span>&ensp;/&ensp;</span>
                <span className=' hover:cursor-pointer' onClick={() => signedHandler(true)} style={blue}>Login</span>
            </div>
        </div>

    const logUI =
        <div className='basis-1/3 flex py-4'>
            {signed ?
                <div>{log}</div> :
                <div>{sign}</div>
            }
        </div>

    const deleteLog =
        <div className='flex flex-col flex-shrink-0 basis-1/3'>
            <h3 className='text-lg font-semibold mb-2'>Delete Confirm</h3>
            <h4 className='font-semibold'>username</h4>
            <input
                ref={ref1}
                value={usernameHolder}
                className='my-1 p-1 border-2 w-full border-gray-400 focus:border-gray-500 outline-none rounded block'
                onChange={usernameHandler}
            />
            <h4 className='font-semibold'>password</h4>
            <input
                ref={ref2}
                type='password'
                value={passwordHolder}
                className='my-1 p-1 border-2 border-gray-400 focus:border-gray-500 outline-none rounded block'
                onChange={passwordHandler}
            />
            <button
                className='bg-blue-600 text-sm  mt-2
                text-white px-1  w-16 h-8 rounded-md border-0 mb-7
                hover:bg-blue-500 outline-none'
                onClick={deleteConfirmHandler}
            >
                <span className=' text-sm'>Confirm</span>
            </button>
        </div>

    return (
        <div className='absolute w-4/5 sm:w-4/6 md:w-4/7 h-4/5 mx-11 sm:mx-28 md:mx-36  lg:mx-48 xl:mx-60 my-14 bg-white z-50 shadow-md rounded-lg select-none'>
            <div className='container md:px-20 xl:px-24 px-10 py-6 w-auto mx-px overflow-y-auto h-full'>
                <h1 className='text-2xl py-2 mb-1 sm:w-4/5 w-full font-bold border-b-2'>Account</h1>
                <div className='flex flex-shrink-0'>
                    {account ? <div className='flex flex-row pt-1 h-4/5 w-full flex-shrink-0'>{accountContents}
                        {deleteConfirmFlag ? <div className='flex flex-shrink-0'>{deleteLog}</div> : null
                        }
                    </div>
                        : <div className='flex flex-row pt-1 h-4/5 w-full'>{logUI}</div>}
                </div>
            </div>
        </div>
    )
}

export default Account
