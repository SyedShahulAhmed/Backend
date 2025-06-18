import express from 'express'
import 'dotenv/config'
const app = express()

const port = process.env.PORT1 || process.env.PORT2

// app.get('/', (req, res) => {
//     res.send('HOMEPAGE')
// })
// app.get('/login', (req, res) => {
//     res.send('LOGINPAGE')
// })
// app.get('/register', (req, res) => {
//     res.send('REGISTRATIONPAGE')
// })
// app.get('/contact', (req, res) => {
//     res.send('CONTACTPAGE')
// })

app.use(express.json())
let data = []
let nxtId = 1
app.post('/names',(req,res) =>{
    const {name,age} = req.body
    const newUser = {id : nxtId++,name,age,}
    data.push(newUser)
    res.status(201).send(newUser)
})

app.get('/names', (req,res) =>{
    res.status(201).send(data)
})
app.get('/names/:id', (req,res) =>{
    const d = data.find(d => d.id === parseInt(req.params.id))
    if(!d){
        return res.status(404).send("404 ID NOTFOUND")
    }
    res.status(200).send(d);
})

app.put('/names/:id',(req,res) =>{
    const id = req.params.id
    const n = data.find(d => d.id === parseInt(req.params.id))
    if(!n){
        return res.status(404).send("404 ID NOTFOUND")
    }
    const {name,age} = req.body
    n.name = name;
    n.age = age;
    res.status(200).send(n)
})

app.delete('/names/:id',(req,res) =>{
    const idx = data.findIndex(t => t.id === parseInt(req.params.id))
    if(idx === -1) {
        return res.status(404).send('Name NOT FOUND')
    }
    data.splice(idx,1)
    return res.status(204).send('DATA DELETED')
})

app.listen(port, () => {
    console.log(`Server Listening at port : ${port}...`);
})
