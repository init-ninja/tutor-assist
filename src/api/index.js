const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('Hello Worldsss!'))

app.listen(9001, () => console.log('Example app listening on port 3000!'))
