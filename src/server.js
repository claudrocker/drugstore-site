const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const qs = require('qs');
const cheerio = require('cheerio');
const htmlEntities = require('html-entities').AllHtmlEntities;

const HTTP_PORT = 8000;
const REGION_ID = 7; // Metropolitan region
const COMMUNES_URL = 'https://midastest.minsal.cl/farmacias/maps/index.php/utilidades/maps_obtener_comunas_por_regiones';
const STORES_URL = 'https://farmanet.minsal.cl/maps/index.php/ws/getLocalesRegion';

let app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* Start server */
app.use(express.static(__dirname + '/public'));
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});

/**************/
/* Api routes */
/***+++++++++**/

/* Communes */
app.get("/api/communes", async(req, res, next) => {
    try {
        const communes = await getCommunes();
        res.json({
            "communes": communes
        })
    } catch(error) {
        console.log(error);
        res.json({
            "error": true,
            "message": "service unavailable"
        })
    }
});

/* Stores */
app.get("/api/stores", async(req, res, next) => {
    try {
        const stores = await getStores();

        /* Filters */
        let filteredStores = stores;
        /*   by communeId (required param) */
        if (req.query.communeId) {
            filteredStores = stores.filter(s => s.fk_comuna === req.query.communeId);
        }
        else {
            res.json({
                "error": true,
                "message": "Parameter expected: communeId"
            });
            return;
        }
        /*   by name (string is included in store name) (optional param) */
        if (req.query.name) {
            if (req.query.name !== '') {
                filteredStores = filteredStores.filter(s => s.local_nombre.includes(req.query.name.toUpperCase()));
            }
        }

        /* Format stores */
        let storesOk = filteredStores.map((s) => {
            return {
                store_name: s.local_nombre,
                address: s.local_direccion,
                commune: s.comuna_nombre,
                phone: s.local_telefono,
                lat: s.local_lat,
                lng: s.local_lng
            }
        });

        res.json({ "stores": storesOk});
    } catch(error) {
        console.log(error);
        res.json({
            "error": true,
            "message": "service unavailable"
        })
    }
});

/*  External service (Minsal) calls */
async function getCommunes(){
    let params = qs.stringify({
        reg_id: REGION_ID
    });

    try {
        const res = await axios({
            method: 'post',
            url: COMMUNES_URL,
            data: params,
            headers: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
        });

        /* Scraping the html response */
        const $ = await cheerio.load(res.data);

        let parsedData = [];
        $('option').each((i, elem) => {
            if ($(elem).attr('value') !== '0'){
                parsedData.push({
                    id: $(elem).attr('value'),
                    name: htmlEntities.decode($(elem).html())
                })
            }
        });

        return parsedData;
    } catch(error) {
        console.log(error);
        return error;
    }
}

async function getStores(){
    const storesUrl = `${STORES_URL}?id_region=${REGION_ID}`;
    try {
        const res = await axios.get(storesUrl);

        return res.data;
    } catch(error) {
        console.log(error);
        return error;
    }
}
