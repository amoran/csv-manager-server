const express = require('express');
const cors = require('cors');
const monk = require('monk');
const formidable = require('formidable');
const csv = require('csv-parser')
const fs = require('fs');

/* Database Setup */
const db = monk(process.env.MONGODB_URI || 'localhost:27017/csv-app');
const fileCollection = db.get('files');
fileCollection.createIndex('fileName');
const rowCollection = db.get('rows');
rowCollection.createIndex('fileId');

/* Express Setup */
const app = express();
app.use(cors());
app.use(express.json());

/* Hello World Endpoint */
app.get('/', (req, res) => {
    res.json({
        message: 'hello world'
    });
});

/* Get all files (metadata) */
app.get('/api/v1/files', async (req, res, next) => {
    const docs = await fileCollection.find({}, {sort: {uploadDate: -1}});
    res.send(docs);
})

/* Get specific files data */
app.get('/api/v1/files/:id/rows', async (req, res, next) => {
    const id = req.params.id;
    const docs = await rowCollection.find({fileId: monk.id(id)});
    res.send(docs);
})

/* Upload a file */
app.post('/api/v1/files', (req, res, next) => {
    const form = formidable({ multiples: true });

    form.parse(req, (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }

        Object.keys(files).map(async key => {
            let rows = [];
            let file = files[key];

            const newId = monk.id()

            // Stream rows into an array and push to database
            fs.createReadStream(file.path)
                .pipe(csv())
                .on('data', async (data) => {
                    if (data.state === "") {
                        data.state = "BLANK";
                    }
                    rows.push({...data, fileId: newId});
                })
                .on('end', async () => {

                    try {
                        // Create all rows
                        await rowCollection.insert(rows, {ordered: false});

                        // Create main file object
                        await fileCollection.insert({
                            _id: newId,
                            fileName: file.name,
                            type: file.type,
                            size: file.size,
                            uploadDate: new Date(),
                        });

                        res.sendStatus(201);
                    } catch (error) {
                        console.log(error);
                        res.sendStatus(500);
                    }
                })
                .on('error', (error) => {
                    console.log(error);
                    res.sendStatus(500);
                });
        });
    });
})

/* Start Server */
const port = process.env.PORT || 1337;
app.listen(port, () => {
    console.log(`listening on ${port}`)
})
