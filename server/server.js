const express = require('express')
const app = express()
const url = 'mongodb://localhost:27017/'
const CryptoJS = require('crypto-js')

app.use(express.json())

app.set('port', process.env.PORT || 3000)

const encryptFunction = (str) => {
    // const CryptoJS = require('crypto-js')
    const password = '再びホワイトアルバムの季節です&TheTruthShallMakeUFree'
    const key = CryptoJS.SHA256(password).toString()
    const encryptData = CryptoJS.AES.encrypt(str, key).toString()
    return encryptData
}

const decryptFunction = (str) => {
    // const CryptoJS = require('crypto-js')
    const password = '再びホワイトアルバムの季節です&TheTruthShallMakeUFree'
    const key = CryptoJS.SHA256(password).toString()
    const decryptData = CryptoJS.AES.decrypt(str, key).toString(CryptoJS.enc.Utf8)
    return decryptData
}

const hashingFunction = (str) => {
    const key = CryptoJS.SHA3(str).toString()
    return key
}

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
})

app.post('/deleteAccount.json', (req, res) => {
    const rawData = req.body
    const { username_c, password_c } = rawData
    const username = decryptFunction(username_c)
    const password = decryptFunction(password_c)
    const user = username.replaceAll(' ', '_')
    const user_rc = hashingFunction(user)
    const password_rc = hashingFunction(password)
    const queryFactor = { username: user_rc }
    const MongoClient = require('mongodb').MongoClient
    MongoClient.connect(url, (err, db) => {
        if (err) throw err
        let dbo = db.db('userInfo')
        dbo.collection('account').find(queryFactor).toArray((err1, res1) => {
            if (err1) throw err1
            if (res1[0])
                if (res1[0].password === password_rc) {
                    console.log('password match')
                    dbo.collection('account').deleteOne(queryFactor, (err2, res2) => {
                        if (err2) throw err2
                        console.log('delete from account list')
                        dbo.collection('info').deleteOne(queryFactor, (err3, res3) => {
                            if (err3) throw err3
                            console.log('delete from info')
                            db.close()
                            const MongoClient2 = require('mongodb').MongoClient
                            MongoClient2.connect(url + user, (err4, db2) => {
                                if (err4) throw err4
                                let dbo2 = db2.db(user)
                                dbo2.dropDatabase((err5, res5) => {
                                    if (err5) throw err5
                                    res.send({ msg: true })
                                    console.log('delete database associated with account')
                                })
                            })
                        })
                    })
                }
        })
    })

})

app.post('/info.json', (req, res) => {
    const rawData = req.body
    const { account_c } = rawData
    const account = decryptFunction(account_c)
    const user = account.replaceAll(' ', '_')
    const user_rc = hashingFunction(user)
    const queryFactor = { username: user_rc }
    const MongoClient = require('mongodb').MongoClient
    MongoClient.connect(url, (err, db) => {
        if (err) throw err
        let dbo = db.db('userInfo')
        // console.log(queryFactor)
        dbo.collection('info').find(queryFactor).toArray((err1, res1) => {
            if (err1) throw err1
            if (res1[0]) {
                const { username, icon, name } = res1[0]
                const username_c = encryptFunction(username)
                const icon_c = encryptFunction(icon)
                const name_c = name
                const backData = { username_c, icon_c, name_c }
                // console.log(res1)
                res.send(backData)
                db.close()
                console.log('info send')
            }else{
                res.send({})
                db.close()
                console.log('info send')
            }
        })

    })
})

app.post('/login.json', (req, res) => {
    const rawData = req.body
    // console.log(rawData)
    const { username_c, password_c } = rawData
    const username = decryptFunction(username_c)
    const password = decryptFunction(password_c)
    const user = username.replaceAll(' ', '_')
    const user_rc = hashingFunction(user)
    const password_rc = hashingFunction(password)
    const queryFactor = { username: user_rc }
    const MongoClient = require('mongodb').MongoClient
    MongoClient.connect(url, (err, db) => {
        if (err) throw err
        let dbo = db.db('userInfo')
        dbo.collection('account').find(queryFactor).toArray((err2, res2) => {
            // console.log(res2)
            if (res2[0]) {
                if (res2[0].password === password_rc) {
                    res.send({ msg: encryptFunction('true') })
                    console.log('login success')
                }
            } else {
                res.send({ msg: encryptFunction('false') })
                db.close()
                console.log('login fail')
            }
        })
    })
})

app.post('/signup.json', (req, res) => {
    const rawData = req.body
    const { username_c, password_c } = rawData
    const username = decryptFunction(username_c)
    const password = decryptFunction(password_c)
    user = username.replaceAll(' ', '_')
    const user_rc = hashingFunction(user)
    const password_rc = hashingFunction(password)
    const item = { username: user_rc, password: password_rc }
    const queryFactor = { username: user_rc }
    const infoItem = { username: user_rc, icon: 'default', name: username_c }
    const MongoClient = require('mongodb').MongoClient
    MongoClient.connect(url, (err, db) => {
        if (err) throw err
        let dbo = db.db('userInfo')
        dbo.collection('account').find(queryFactor).toArray((err1, resd) => {
            if (err1) throw err1
            // console.log(resd)
            if (resd[0]) {
                res.send({ msg: encryptFunction('false') })
                console.log('username used')
            } else {
                dbo.collection('account').insertOne(item, (err2, res2) => {
                    if (err2) throw err2
                    console.log('username added')
                    dbo.collection('info').insertOne(infoItem, (err3, res3) => {
                        if (err3) throw err3
                        console.log('user info added')
                        console.log('signup success')
                        const MongoClient2 = require('mongodb').MongoClient
                        MongoClient2.connect(url + user, (err3, db2) => {
                            if (err3) throw err3
                            let dbo2 = db2.db(user)
                            dbo2.createCollection('todoData', (err4, res4) => {
                                if (err4) throw err4
                                console.log('new db create todoData colection')
                                dbo2.createCollection('scheduleData', (err5, res5) => {
                                    if (err5) throw err5
                                    res.send({ msg: encryptFunction('true') })
                                    db.close()
                                    console.log('new db create scheduleData collection')
                                })
                            })
                        })
                    })
                })
            }
        })
    })
})

app.post('/todoData.json', (req, res) => {
    const { account_c } = req.body
    const account = decryptFunction(account_c)
    const MongoClient = require('mongodb').MongoClient
    MongoClient.connect(url, (err, db) => {
        if (err) throw err
        let dbo = db.db(account)
        dbo.collection('todoData').find().toArray((err1, resd) => {
            if (err1) throw err1
            const data = [...resd]
            res.send(data)
            // console.log(data)
            console.log('send todoData')
            db.close()
        })
    })

})

app.post('/scheduleData.json', (req, res) => {
    const { account_c } = req.body
    const account = decryptFunction(account_c)
    const MongoClient = require('mongodb').MongoClient
    MongoClient.connect(url, (err, db) => {
        if (err) throw err
        let dbo = db.db(account)
        dbo.collection('scheduleData').find().toArray((err1, resd) => {
            if (err1) throw err1
            const data = [...resd]
            res.send(data)
            console.log('send scheduleData')
            db.close()
        })
    })
})

app.post('/itemDelete.json', (req, res) => {
    const rawData = req.body
    const { id_c, account_c } = rawData
    const account = decryptFunction(account_c)
    const id = parseInt(decryptFunction(id_c))
    // console.log(id, 'delete id')
    const queryFactor = { id: id }
    const MongoClient = require('mongodb').MongoClient
    MongoClient.connect(url, (err, db) => {
        if (err) throw err
        let dbo = db.db(account)
        dbo.collection('todoData').deleteOne(queryFactor, (err1, res1) => {
            if (err1) throw err1
            dbo.collection('scheduleData').deleteOne(queryFactor, (err2, res2) => {
                if (err2) throw err2
                console.log("delete success")
                res.send({ res1, res2, msg: 'delete' })
                db.close()
            })
        })
    })
})

app.post('/chainDelete.json', (req, res) => {
    const rawData = req.body
    const { id_c, account_c } = rawData
    const id = parseInt(decryptFunction(id_c))
    const account = decryptFunction(account_c)
    const queryFactor = { id: id }
    const MongoClient = require('mongodb').MongoClient
    MongoClient.connect(url, (err, db) => {
        if (err) throw err
        let dbo = db.db(account)
        dbo.collection('todoData').deleteOne(queryFactor, (err1, res1) => {
            if (err1) throw err1
            console.log("chain delete todo success")
            res.send({ res1, msg: 'delete chain' })
            db.close()
        })
    })
})

app.post('/itemAdd.json', (req, res) => {
    const rawData = req.body
    const { item_c, type_c, account_c } = rawData
    const item = item_c
    const account = decryptFunction(account_c)
    const type = (decryptFunction(type_c) === 'true')
    const collectionName = type ? 'todoData' : 'scheduleData'
    const MongoClient = require('mongodb').MongoClient
    MongoClient.connect(url, (err, db) => {
        if (err) throw err
        let dbo = db.db(account)
        dbo.collection(collectionName).insertOne(item, (err1, res1) => {
            if (err1) throw err1
            console.log('insert successfully')
            res.send({ res1, msg: 'add' })
            db.close()
        })
    })
})

app.post('/attributeChange.json', (req, res) => {
    const rawData = req.body
    const { id_c, name_c, value_c, type_c, account_c } = rawData
    const id = parseInt(decryptFunction(id_c))
    const name = decryptFunction(name_c)
    const type = (decryptFunction(type_c) === 'true')
    const account = decryptFunction(account_c)
    const queryFactor = { id: id }
    const collectionName = type ? 'todoData' : 'scheduleData'
    const MongoClient = require('mongodb').MongoClient
    MongoClient.connect(url, (err, db) => {
        if (err) throw err
        let dbo = db.db(account)
        dbo.collection(collectionName).find(queryFactor).toArray((err1, res1) => {
            if (err1) throw err1
            let oldItem = res1[0]
            if (oldItem) {
                oldItem[name] = value_c
                if (name === 'push')
                    oldItem.chain = value_c
                const newItem = oldItem
                const setData = { $set: newItem }
                dbo.collection(collectionName).updateOne(queryFactor, setData, (err2, res2) => {
                    if (err2) throw err2
                    console.log('update success')
                    res.send({ res2, msg: 'update' })
                    db.close()
                })
            }
        })
    })
})

app.post('/merge_schedule.json', (req, res) => {
    const rawData = req.body
    const { schedule_c, account_c } = rawData
    const schedule = schedule_c
    const account = decryptFunction(account_c)
    const MongoClient2 = require('mongodb').MongoClient
    MongoClient2.connect(url, (err, db) => {
        if (err) throw err
        let dbo2 = db.db(account)
        dbo2.collection('scheduleData').drop((err2, res2) => {
            if (err2) throw err2
            console.log('drop schedule')
            dbo2.createCollection('scheduleData', (err4, res4) => {
                if (err4) throw err4
                console.log('create collection scheduleData')
                if (schedule[0] !== undefined) {
                    dbo2.collection('scheduleData').insertMany(schedule, (err6, res6) => {
                        if (err6) throw err6
                        console.log('scheduleData renew')
                        db.close()
                        res.send({ msg: 'schedule renew' })
                    })
                } else {
                    console.log('scheduleData renew')
                    db.close()
                    res.send({ msg: 'schedule renew' })
                }
            })
        })

    })
    // res.send({msg: 'schedule renew'})
})

app.post('/merge_todo.json', (req, res) => {
    const rawData = req.body
    const { todo_c, account_c } = rawData
    const todo = todo_c
    const account = decryptFunction(account_c)
    // console.log(rawData)
    const MongoClient = require('mongodb').MongoClient
    MongoClient.connect(url, (err, db) => {
        if (err) throw err
        let dbo = db.db(account)
        dbo.collection('todoData').drop((err1, res1) => {
            if (err1) throw err1
            console.log('drop todo')
            dbo.createCollection('todoData', (err3, res3) => {
                if (err3) throw err3
                console.log('create collection todoData')

                if (todo[0] !== undefined) {
                    dbo.collection('todoData').insertMany(todo, (err5, res5) => {
                        if (err5) throw err5
                        console.log('todoData renew')
                        db.close()
                        res.send({ msg: 'todo renew' })
                    })
                } else {
                    console.log('todoData renew')
                    db.close()
                    res.send({ msg: 'todo renew' })
                }
            })
        })
    })
    // res.send({msg:'todo renew'})

})


app.listen(app.get('port'), () => {
    console.log("Express started on http://localhost:" +
        app.get("port") +
        " \npress Ctrl - C to terminate....")
})