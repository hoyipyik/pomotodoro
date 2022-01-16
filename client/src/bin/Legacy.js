/**
 * 
 * This file is used to store some code parts which are useless but suitable to keep
 * 
 */

/**
 * From Container.js top
 */

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

//*