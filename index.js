const express = require('express');
const cors = require('cors');
const monk = require('monk');

const app = express();
const db = monk(process.env.MONGODB_URI || 'localhost:27017/csv-app');
const csvs = db.get('csvs');
csvs.createIndex('name');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'hello'
    });
});


const port = process.env.PORT || 1337;
app.listen(port, () => {
    console.log(`listening on ${port}`)
})

