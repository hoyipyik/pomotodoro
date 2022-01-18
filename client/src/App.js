import React, { useState, useEffect } from 'react'

import Sidebar from './components/Sidebar'
import Container from './containers/Container'
import Setting from './components/Setting'
import Backdrop from './tools/Backdrop'
import { ContextApp } from './tools/Context'
import Account from './components/Account'

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

  const contextPassingValue = {
    minSidebarHandler, todoFlag, account,
    accountHandler, accountInfo, accountInfoHandler
  }
  // console.log(onlineMode, 'render app')

  return (
    <div>
      <ContextApp.Provider value={contextPassingValue}>
        {accountPageFlag ?
          <div className='flex'>
            <Account modeChangeHandler={modeChangeHandler} keepMode={keepMode} />
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
