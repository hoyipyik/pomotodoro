import React, { useState, useEffect } from 'react'

import Sidebar from './components/Sidebar'
import Container from './containers/Container'
import Setting from './components/Setting'
import Backdrop from './tools/Backdrop'
import { ContextApp } from './tools/Context'
import Account from './components/Account'
import CryptoJS from 'crypto-js'

const App = () => {
  const [todoFlag, setTodoFlag] = useState(true)
  const [account, setAccount] = useState('')
  const [keepMode, setKeepMode] = useState(true)
  const [accountInfo, setAccountInfo] = useState({})
  const [onlineMode, setOnlineMode] = useState(false)
  const [pomoMode, setPomoMode] = useState(true)
  const [clockMode, setClockMode] = useState(false)
  const [settingPageFlag, setSettingPageFlag] = useState(false)
  const [accountPageFlag, setAccountPageFlag] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [minSidebarFlag, setMinSidebarFlag] = useState(false)

  // useEffect(()=>{
  //   if(keepMode){
  // localStorage.setItem('account', JSON.stringify(account))
  // localStorage.setItem('accountInfo', JSON.stringify(accountInfo))
  //   }else{
  //     localStorage.setItem('account', JSON.stringify(''))
  //     localStorage.setItem('accountInfo', JSON.stringify({}))
  //   }
  //   return
  // }, [keepMode, account, accountInfo])

  useEffect(() => {
    const modeFlag = JSON.parse(localStorage.getItem('modeFlag'))
    let keep = false
    if (modeFlag) {
      keep = modeFlag.keep
      setKeepMode(keep)
    } else {
      setKeepMode(true)
    }
    if (keep) {
      console.log('keep works')
      const accountData = JSON.parse(localStorage.getItem('account'))
      const accountInfoData = JSON.parse(localStorage.getItem('accountInfo'))
      setAccount(accountData)
      setAccountInfo(accountInfoData)
      setOnlineMode(true)
    }
    return
  }, [])

  /**
   * mode flag set and load to/from localStorage
   */

  useEffect(() => {
    const modeFlag = JSON.parse(localStorage.getItem('modeFlag'))
    if (modeFlag) {
      const { online, pomo, clock, keep } = modeFlag
      // setOnlineMode(online)
      setPomoMode(pomo)
      setClockMode(clock)
      setKeepMode(keep)
    } else {
      setOnlineMode(true)
      setPomoMode(true)
      setClockMode(false)
      setKeepMode(true)
    }
    return
  }, [])

  useEffect(() => {
    // const online = onlineMode
    const pomo = pomoMode
    const clock = clockMode
    const keep = keepMode
    const modeFlag = { pomo, clock, keep }
    localStorage.setItem('modeFlag', JSON.stringify(modeFlag))
    return
  }, [pomoMode, clockMode, keepMode])

  // flag control

  const todoFlagHandler = (value) => {
    setTodoFlag(value)
  }

  const settingPageHandler = (value) => {
    setSettingPageFlag(value)
  }

  const accountPageHandler = (value) => {
    setAccountPageFlag(value)
  }

  const refreshHandler = () => {
    setRefresh(!refresh)
  }

  const minSidebarHandler = (value) => {
    setMinSidebarFlag(value)
  }

  const accountHandler = (value) => {
    setAccount(value)
  }

  const accountInfoHandler = (value) => {
    setAccountInfo(value)
  }

  /**
   * setting mode function
   */

  const modeChangeHandler = (value, name) => {
    switch (name) {
      case 'onlineMode':
        setOnlineMode(value)
        break;
      case 'pomoMode':
        setPomoMode(value)
        break;
      case 'clockMode':
        setClockMode(value)
        if (value)
          Notification.requestPermission()
        break;
      case 'keepMode':
        setKeepMode(value)
        if (!value) {
          localStorage.setItem('account', JSON.stringify(''))
          localStorage.setItem('accountInfo', JSON.stringify({}))
        } else {
          localStorage.setItem('account', JSON.stringify(account))
          localStorage.setItem('accountInfo', JSON.stringify(accountInfo))
        }
        break;
      default:
        break;
    }
  }

  /**
   * crypt and decrypt function
   */

  const encryptFunction = (str) => {
    const password = 'You Shall Know the Truth & the Truth Shall Make You Free'
    const key = CryptoJS.SHA256(password).toString()
    const encryptData = CryptoJS.AES.encrypt(str, key).toString()
    return encryptData
  }

  const decryptFunction = (str) => {
    const password = 'You Shall Know the Truth & the Truth Shall Make You Free'
    const key = CryptoJS.SHA256(password).toString()
    const decryptData = CryptoJS.AES.decrypt(str, key).toString(CryptoJS.enc.Utf8)
    return decryptData
  }

  const itemDecryptHandler = (item_c) => {
    const { id, taskName, checked, priority, pomoTimes, chain, push, subTasks } = item_c
    const taskName_d = decryptFunction(taskName)
    const checked_d = (decryptFunction(checked) === 'true')
    const priority_d = (decryptFunction(priority) === 'true')
    const pomoTimes_d = parseInt(decryptFunction(pomoTimes))
    const chain_d = (decryptFunction(chain) === 'true')
    const push_d = (decryptFunction(push) === 'true')
    const subTasks_d = subTasks.map((e, index) => {
      if (e) {
        e.subTaskName = decryptFunction(e.subTaskName)
        e.checked = (decryptFunction(e.checked) === 'true')
      }
      return e
    })
    const item = {
      id: id,
      taskName: taskName_d,
      checked: checked_d,
      priority: priority_d,
      pomoTimes: pomoTimes_d,
      chain: chain_d,
      push: push_d,
      subTasks: subTasks_d,
    }
    return item
  }

  const itemEncryptHandler = (item) => {
    const { id, taskName, checked, priority, pomoTimes, chain, push, subTasks } = item
    const taskName_c = encryptFunction(taskName)
    const checked_c = encryptFunction(checked.toString())
    const priority_c = encryptFunction(priority.toString())
    const pomoTimes_c = encryptFunction(String(pomoTimes))
    const chain_c = encryptFunction(chain.toString())
    const push_c = encryptFunction(push.toString())
    const subTasks_c = subTasks.map((e, index) => {
      if (e) {
        e.subTaskName = encryptFunction(e.subTaskName)
        e.checked = encryptFunction(e.checked.toString())
      }
      return e
    })
    const item_c = {
      id: id,
      taskName: taskName_c,
      checked: checked_c,
      priority: priority_c,
      pomoTimes: pomoTimes_c,
      chain: chain_c,
      push: push_c,
      subTasks: subTasks_c,
    }
    return item_c
  }

  const arrayDecryptHandler = (array_c) => {
    const array = array_c.map((e, index) => {
      if (e)
        e = itemDecryptHandler(e)
      return e
    })
    return array
  }

  const arrayEncryptHandler = (array) => {
    const array_c = array.map((e, index) => {
      if (e)
        e = itemEncryptHandler(e)
      return e
    })
    return array_c
  }

  //

  const contextPassingValue = {
    minSidebarHandler, todoFlag, account,
    accountHandler, accountInfo, accountInfoHandler,
    encryptFunction, decryptFunction, itemEncryptHandler, itemDecryptHandler, arrayDecryptHandler, arrayEncryptHandler
  }

  return (
    <div>
      <ContextApp.Provider value={contextPassingValue}>
        {accountPageFlag ?
          <div className='flex'>
            <Account modeChangeHandler={modeChangeHandler} keepMode={keepMode} accountPageHandler={accountPageHandler} />
            <div onClick={() => accountPageHandler(false)}><Backdrop /></div>
          </div> : null}
        {settingPageFlag ?
          <div className='flex'>
            <Setting
              modeChangeHandler={modeChangeHandler}
              pomoMode={pomoMode} clockMode={clockMode}
              onlineMode={onlineMode} refreshHandler={refreshHandler}
            />
            <div onClick={() => settingPageHandler(false)}><Backdrop /></div>
          </div> : null}
        {minSidebarFlag ?
          <div className='select-none absolute block lg:hidden w-2/3 sm:w-2/5 md:w-1/3 h-screen overflow-hidden'>
            <div onClick={() => minSidebarHandler(false)}><Backdrop z={20} /></div>
            <div className='h-screen'>
              <Sidebar
                accountPageHandler={accountPageHandler}
                todoFlagHandler={todoFlagHandler}
                settingPageHandler={settingPageHandler}
                refreshHandler={refreshHandler} />
            </div>
          </div> : null
        }
        <div className='flex flex-row min-h-fit'>
          <div className='select-none bg-gray-100 lg:block hidden md:basis-1/5 h-screen overflow-auto'>
            <Sidebar
              accountPageHandler={accountPageHandler}
              todoFlagHandler={todoFlagHandler}
              settingPageHandler={settingPageHandler}
              refreshHandler={refreshHandler} />
          </div>
          <div className='lg:basis-4/5 basis-full overflow-auto h-screen'>
            <Container
              pomoMode={pomoMode} clockMode={clockMode} modeChangeHandler={modeChangeHandler}
              todoFlag={todoFlag} refresh={refresh} onlineMode={onlineMode} />
          </div>
        </div>
      </ContextApp.Provider>
    </div>
  )
}

export default App
