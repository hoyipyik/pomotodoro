const express = require('express')
const app = express()
const url = 'mongodb://localhost:27017/'

app.use(express.json())

app.set('port', process.env.PORT || 4000)

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
  })

app.get('/todoData.json', (req, res)=>{
    const MongoClient = require('mongodb').MongoClient
    MongoClient.connect(url, (err, db)=>{
        if(err) throw err
        let dbo = db.db('Ho_Yipyik')
        dbo.collection('todoData').find().toArray((err1, resd)=>{
            if(err1) throw err1
            const data = [...resd]
            res.send(data)
            console.log('send todoData')
            db.close()
        })
    })
    
})

app.get('/scheduleData.json', (req, res)=>{
    const MongoClient = require('mongodb').MongoClient
    MongoClient.connect(url, (err, db)=>{
        if(err) throw err
        let dbo = db.db('Ho_Yipyik')
        dbo.collection('scheduleData').find().toArray((err1, resd)=>{
            if(err1) throw err1
            const data = [...resd]
            res.send(data)
            console.log('send scheduleData')
            db.close()
        })
    })
})

app.post('/itemDelete.json', (req, res)=>{
    const rawData = req.body
    const MongoClient = require('mongodb').MongoClient
    MongoClient.connect(url, (err, db)=>{
        if(err) throw err
        let dbo = db.db('Ho_Yipyik')
        dbo.collection('todoData').deleteOne(rawData, (err1, res1)=>{
            if(err1) throw err1
            console.log("delete success")
            res.send({res1, msg:'delete'})
            db.close()
        })
    })
})

app.post('/itemAdd.json', (req, res)=>{
    const rawData = req.body
    const MongoClient = require('mongodb').MongoClient
    MongoClient.connect(url, (err, db)=>{
        if(err) throw err
        let dbo = db.db('Ho_Yipyik')
        dbo.collection('todoData').insertOne(rawData, (err1, res1)=>{
            if(err1) throw err1
            console.log('insert successfully')
            res.send({res1, msg: 'add'})
            db.close()
        })
    })
})

app.post('/attributeChange.json', (req, res)=>{
    const rawData = req.body
    const {id, name, value} = rawData
    const queryFactor = {id: id}
    const MongoClient = require('mongodb').MongoClient
    MongoClient.connect(url, (err, db)=>{
        if(err) throw err
        let dbo = db.db('Ho_Yipyik')
        dbo.collection('todoData').find(queryFactor).toArray((err1, res1)=>{
            if(err1) throw err1
            let oldItem = res1[0]
            oldItem[name] = value
            const newItem = oldItem
            const setData = {$set: newItem}
            dbo.collection('todoData').updateOne(queryFactor, setData, (err2, res2)=>{
                if (err2) throw err2
                console.log('update success')
                res.send({res2, msg: 'update'})
                db.close()
            })
        })
    })
    
})

app.post('/merge.json', (req, res)=>{
    const rawData = req.body
    const {todo, schedule} = rawData
    const MongoClient = require('mongodb').MongoClient
    MongoClient.connect(url, (err, db)=>{
        if(err) throw err
        let dbo = db.db('Ho_Yipyik')
        dbo.collection('todoData').drop((err1, res1)=>{
            if(err1) throw err1
            console.log(res1, 'drop todo')
            dbo.createCollection('todoData', (err3, res3)=>{
                if(err3) throw err3
                console.log('create collection todoData')
                if(todo[0]!==undefined){
                    dbo.collection('todoData').insertMany(todo, (err5, res5)=>{
                        if(err5) throw err5
                        console.log('todoData renew')
                        db.close()
                    })
                }
            })
        })
    })
    const MongoClient2 = require('mongodb').MongoClient
    MongoClient2.connect(url, (err, db)=>{
        if(err) throw err
        let dbo2 = db.db("Ho_Yipyik")
        dbo2.collection('scheduleData').drop((err2, res2)=>{
            if(err2) throw err2
            console.log(res2, 'drop schedule')
            dbo2.createCollection('scheduleData', (err4, res4)=>{
                if(err4) throw err4
                console.log('create collection scheduleData')
                if(schedule[0]!==undefined){
                    dbo2.collection('scheduleData').insertMany(schedule, (err6, res6)=>{
                        if(err6) throw err6
                        console.log('scheduleData renew')
                        db.close()
                    })
                }
            })
        })
        
    })
    res.send({msg:'renew merge'})
})


app.listen(app.get('port'), ()=>{
    console.log("Express started on http://localhost:" +
     app.get("port") +
      " \npress Ctrl - C to terminate....")
})