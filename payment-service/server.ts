
console.log('my app is running')
import express from 'express';

const app = express();

const port = 3002


app.listen(port, () => {
    console.log(`my app is running the port ${port}`)
})

