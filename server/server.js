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
            console.log(resd, 'send todoData')
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
            console.log(resd, 'send scheduleData')
            db.close()
        })
    })
})

app.post('/itemDelete.json', (req, res)=>{
    const rawData = req.body
    // console.log(rawData)
    const MongoClient = require('mongodb').MongoClient
    MongoClient.connect(url, (err, db)=>{
        if(err) throw err
        let dbo = db.db('Ho_Yipyik')
        dbo.collection('todoData').deleteOne(rawData, (err1, res1)=>{
            if(err1) throw err1
            console.log(res1, "delete success")
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
            console.log(res1, 'insert successfully')
            res.send({res1, msg: 'add'})
            db.close()
        })
    })
})

app.post('/attributeChange.json', (req, res)=>{
    const rawData = req.body
    const {id, name, value} = rawData
    const queryFactor = {id: id}
    // console.log(id)
    const MongoClient = require('mongodb').MongoClient
    MongoClient.connect(url, (err, db)=>{
        if(err) throw err
        let dbo = db.db('Ho_Yipyik')
        dbo.collection('todoData').find(queryFactor).toArray((err1, res1)=>{
            if(err1) throw err1
            let oldItem = res1[0]
            // console.log(oldItem)
            oldItem[name] = value
            const newItem = oldItem
            const setData = {$set: newItem}
            dbo.collection('todoData').updateOne(queryFactor, setData, (err2, res2)=>{
                if (err2) throw err2
                console.log(res2, 'update success')
                res.send({res2, msg: 'update'})
                db.close()
            })
        })
    })
    
})


app.listen(app.get('port'), ()=>{
    console.log("Express started on http://localhost:" +
     app.get("port") +
      "; \npress Ctrl - C to terminate....")
})