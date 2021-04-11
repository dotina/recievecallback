const fs = require('fs');
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3300;
const {get, post } = require('./netUtils');
const { backup_task, getDateFormated } = require('./backup_agent')


app.use(cors());
// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.post('/recievecallback', async(req, res) => {
    const timestamp = getDateFormated(new Date(), 'DATETIME');
    // We will be coding here
    const body = 'body' in req ? req.body : null;
    const headers = 'headers' in req ? req.headers : null;
    const keyEndpoint = 'key-endpoint' in headers ? headers['key-endpoint'] : null;

    if (!body) {
        fs.appendFileSync(__dirname + "/logs/errorLogs.log", `${timestamp} | include a valid body \n`)
        res.status(400).json({ responseCode: 400, status: false, message: 'include a valid body' });
    } else if (!headers) {
        fs.appendFileSync(__dirname + "/logs/errorLogs.log", `${timestamp} | include a valid headers \n`)
        res.status(400).json({ responseCode: 400, status: false, message: 'include a valid headers' });
    } else if (!keyEndpoint) {
        fs.appendFileSync(__dirname + "/logs/errorLogs.log", `${timestamp} | missing destination endpoint in headers | check DB \n`)
        res.status(400).json({ responseCode: 400, status: false, message: 'missing destination endpoint in headers | check DB' });
    } else {
        post(keyEndpoint, body, {}, null, null)
            .then(response => {
                console.log('Incoming response : ', response.body);

                if (response.statusCode != 200) {
                    fs.appendFileSync(__dirname + "/logs/errorLogs.log", `${timestamp} | ${response.body} \n`)
                    res.status(response.statusCode).json({
                        responseCode: response.statusCode,
                        message: response.body,
                        status: false
                    })
                } else {
                    fs.appendFileSync(__dirname + "/logs/successLogs.log", `${timestamp} | ${response.body} \n`)
                    res.status(response.statusCode).json({
                        responseCode: response.statusCode,
                        message: response.body,
                        status: true
                    })
                }
            })
            .catch(err => {
                console.log('Error : ', err);
                fs.appendFileSync(__dirname + "/logs/errorLogs.log", `${timestamp} | ${err}\n`)
                res.status(500).json({
                    responseCode: 500,
                    message: 'service error',
                    err,
                    status: false
                })
            })
    }


});
const init_callback_router = () => {
    backup_task.start();
    app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));
}

init_callback_router();