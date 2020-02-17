const express = require('express');
const bodyParser = require('body-parser');

const HTTP_PORT = 8000;
//const REGION_ID = 7; // Metropolitan region

let app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* Start server */
app.use(express.static(__dirname + '/public'));
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});
