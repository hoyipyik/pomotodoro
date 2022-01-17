const express = require('express')
const app = express()
const url = 'mongodb://localhost:27017/'

app.use(express.json())

app.set('port', process.env.PORT || 4000)

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
})

app.post('/login.json', (req, res) => {
    const rawData = req.body
    const { username, password } = rawData
    const queryFactor = { username: username }
    const MongoClient = require('mongodb').MongoClient
    MongoClient.connect(url, (err, db) => {
        if (err) throw err
        let dbo = db.db('userInfo')
        dbo.collection('account').find(queryFactor).toArray((err2, res2) => {
            // console.log(res2)
            if (res2[0].password === password) {
                res.send({ msg: true })
                console.log('login success')
            } else {
                res.send({ msg: false })
                console.log('login fail')
            }
        })
    })
})

app.post('/signup.json', (req, res) => {
    const rawData = req.body
    const { username, password } = rawData
    const item = rawData
    const queryFactor = { username: username }
    const infoItem = { username: username, icon: 'default' }
    const MongoClient = require('mongodb').MongoClient
    MongoClient.connect(url, (err, db) => {
        if (err) throw err
        let dbo = db.db('userInfo')
        dbo.collection('account').find(queryFactor).toArray((err1, resd) => {
            if (err1) throw err1
            console.log(resd)
            if (resd[0]) {
                res.send({ msg: false })
                console.log('username used')
            } else {
                dbo.collection('account').insertOne(item, (err2, res2) => {
                    if (err2) throw err2
                    console.log(res2, 'username added')
                    dbo.collection('info').insertOne(infoItem, (err3, res3) => {
                        if (err3) throw err3
                        console.log(res3, 'user info added')
                        console.log('signup success')
                        res.send({ msg: true })
                    })
                })
                const MongoClient2 = require('mongodb').MongoClient
                MongoClient2.connect(url + username, (err3, db2) => {
                    if (err3) throw err3
                    let dbo2 = db2.db(username)
                    dbo2.createCollection('todoData', (err4, res4) => {
                        if (err4) throw err4
                        console.log('new db create todoData colection')
                        dbo2.createCollection('scheduleData', (err5, res5) => {
                            if (err5) throw err5
                            console.log('new db create scheduleData collection')
                        })
                    })
                })
            }
        })
    })
})

app.post('/todoData.json', (req, res) => {
    const { account } = req.body
    const MongoClient = require('mongodb').MongoClient
    MongoClient.connect(url, (err, db) => {
        if (err) throw err
        let dbo = db.db(account)
        dbo.collection('todoData').find().toArray((err1, resd) => {
            if (err1) throw err1
            const data = [...resd]
            res.send(data)
            console.log('send todoData')
            db.close()
        })
    })

})

app.post('/scheduleData.json', (req, res) => {
    const { account } = req.body
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
    const { id, account } = rawData
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
    const { id, account } = rawData
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
    const { item, type, account } = rawData
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
    const { id, name, value, type, chain, account } = rawData
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
                oldItem[name] = value
                if (name === 'push')
                    oldItem.chain = value
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
    const { schedule, account } = rawData
    const MongoClient2 = require('mongodb').MongoClient
    MongoClient2.connect(url, (err, db) => {
        if (err) throw err
        let dbo2 = db.db("Ho_Yipyik")
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
    const { todo, account } = rawData
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