const express = require('express');
const pool = require('./db');
const multer = require('multer');

var multipartUpload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, callback) { callback(null, 'public/images/'); },
        filename: function (req, file, callback) { callback(null, file.originalname); }
    })
}).single('photo_upload');

var filenameCheck = async (reqFile, db) => {
    var ifFilenameExists = new Boolean(false);
    const filename = reqFile.originalname;
    const filename_query = `SELECT count(*) AS photosCount FROM Photos WHERE filename=?;`
    try {
        const [count_rows, count_fields] = await db.query(filename_query, filename);
        fileCount = count_rows[0].photosCount;
        if (fileCount > 0) {
            ifFilenameExists = true;
        }
    } catch (err) {
        console.error("Database error occurred: " + err.message);
    }

    return ifFilenameExists;
}

router = express.Router();

router.get('/', async (req, res) => {
    res.redirect('/birds')
});

router.get('/birds', async (req, res) => {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    var ifFileExists = req.session.fileExists;
    var errMessage = '';
    if (ifFileExists == 'true') {
        errMessage = 'Photo file already exists';
    }

    conservation_status_data = []
    bird_data = []

    const db = pool.promise();
    const status_query = `SELECT * FROM ConservationStatus;`
    const bird_query = `SELECT b.bird_id, b.primary_name, b.english_name, b.scientific_name, b.family, b.order_name, p.filename, p.photographer, s.status_name, s.status_colour, b.length, b.weight FROM Bird b 
                        LEFT JOIN ConservationStatus s ON b.status_id = s.status_id 
                        LEFT JOIN Photos p ON p.bird_id = b.bird_id 
                        ORDER BY b.bird_id;`

    try {
        const [status_rows, status_fields] = await db.query(status_query);
        conservation_status_data = status_rows;
        const [bird_rows, bird_fields] = await db.query(bird_query);
        bird_data = bird_rows;
    } catch (err) {
        console.error("Database error occured: " + err.message);
    }

    req.session.destroy();
    res.render('index', { title: 'Birds of Aotearoa', birds: bird_data, status: conservation_status_data, alertMessage: errMessage });
});

router.get('/birds/:id(\\d+)', async (req, res) => {
    conservation_status_data = []
    bird = []

    const db = pool.promise();
    const id = req.params.id;
    const status_query = `SELECT * FROM ConservationStatus;`
    const bird_query = `SELECT * FROM Bird b 
                   LEFT JOIN ConservationStatus s ON b.status_id = s.status_id 
                   LEFT JOIN Photos p ON p.bird_id = b.bird_id 
                   WHERE b.bird_id = ?;`;

    try {
        const [status_rows, status_fields] = await db.query(status_query);
        conservation_status_data = status_rows;
        const [bird_rows, bird_fields] = await db.query(bird_query, [id]);
        bird_data = bird_rows;
    } catch (err) {
        console.error("Database error occurred: " + err.message);
    }

    res.render('display', { title: 'Bird: ' + bird_data[0].primary_name, birds: bird_data, status: conservation_status_data });
});

router.get('/birds/create', async (req, res) => {
    conservation_status_data = []

    const db = pool.promise();
    const status_query = `SELECT * FROM ConservationStatus;`

    try {
        const [status_rows, status_fields] = await db.query(status_query);
        conservation_status_data = status_rows;
    } catch (err) {
        console.error("Database error occurred: " + err.message);
    }

    res.render('create', { title: 'Create Bird', status: conservation_status_data });
});

router.post('/birds/create', multipartUpload, async (req, res) => {
    const reqBody = req.body;
    const reqFile = req.file;

    const db = pool.promise();

    var ifFilenameExists = await filenameCheck(reqFile, db);
    if (ifFilenameExists == true) {
        req.session.fileExists = 'true';

        return res.redirect('/birds');
    }

    const bird_command = `INSERT INTO Bird (primary_name, english_name, scientific_name, order_name, family, length, weight, status_id)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?);`
    const photo_command = `INSERT INTO Photos (filename, photographer, bird_id)
                            VALUES (?, ?, ?);`

    try {
        const newBird = await db.query(bird_command, [reqBody.primary_name, reqBody.english_name, reqBody.scientific_name, reqBody.order_name, reqBody.family, reqBody.length, reqBody.weight, reqBody.status_name]);
        const newBirdId = newBird[0].insertId;
        const newPhoto = await db.query(photo_command, [reqFile.originalname, reqBody.photographer, newBirdId]);
    } catch (err) {
        console.error("Database error occurred: " + err.message);
    }

    return res.redirect('/birds')
});

router.get('/birds/:id(\\d+)/edit', async (req, res) => {
    conservation_status_data = []
    bird = []

    const db = pool.promise();
    const id = req.params.id;
    const status_query = `SELECT * FROM ConservationStatus;`
    const bird_query = `SELECT * FROM Bird b 
                   LEFT JOIN ConservationStatus s ON b.status_id = s.status_id 
                   LEFT JOIN Photos p ON p.bird_id = b.bird_id 
                   WHERE b.bird_id = ?;`;

    try {
        const [status_rows, status_fields] = await db.query(status_query);
        conservation_status_data = status_rows;
        const [bird_rows, bird_fields] = await db.query(bird_query, [id]);
        bird_data = bird_rows[0];
    } catch (err) {
        console.error("Database error occurred: " + err.message);
    }

    res.render('edit', { title: 'Edit: ' + bird_data.primary_name, birds: bird_data, status: conservation_status_data });
});

router.post('/birds/edit', multipartUpload, async (req, res) => {
    const reqBody = req.body;
    const reqFile = req.file;

    const db = pool.promise();
    if (reqFile != null) {
        var ifFilenameExists = await filenameCheck(reqFile, db);
        if (ifFilenameExists == true) {
            req.session.fileExists = 'true';
            return res.redirect('/birds');
        }
    }

    const bird_command = `UPDATE Bird 
                            SET primary_name = ?, english_name = ?, scientific_name = ?, order_name = ?, family = ?, length = ?, weight = ?, status_id = ?
                            WHERE bird_id = ?;`
    const photo_command = `UPDATE Photos 
                            SET filename = ?, photographer = ?
                            WHERE bird_id = ?;`

    try {
        const updateBird = await db.query(bird_command, [reqBody.primary_name, reqBody.english_name, reqBody.scientific_name, reqBody.order_name, reqBody.family, reqBody.length, reqBody.weight, reqBody.status_name, reqBody.bird_id]);
        if (reqFile != null) {
            const updatePhoto = await db.query(photo_command, [reqFile.originalname, reqBody.photographer, reqBody.bird_id]);
        }
    } catch (err) {
        console.error("Database error occurred: " + err.message);
    }

    return res.redirect('/birds')
});

router.get('/birds/:id(\\d+)/delete', async (req, res) => {
    const db = pool.promise();
    const id = req.params.id;
    const del_photo_command = `DELETE FROM Photos WHERE bird_id = ?;`
    const del_bird_command = `DELETE FROM Bird WHERE bird_id = ?;`

    try {
        await db.query(del_photo_command + ' ' + del_bird_command, [id, id]);
    } catch (err) {
        console.error("Database error occurred: " + err.message);
    }
    res.redirect('/birds')
});

module.exports = router;