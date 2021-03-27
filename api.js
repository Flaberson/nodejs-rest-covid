const express = require('express');
const request = require('request');
const axios = require('axios');
const path = require('path');
const app = express();  
const router = express.Router();

const token = 'ac35099f0382427d71eb00101326a867f29c98b8';
const apiCovid = 'https://api.brasil.io/v1/dataset/covid19/caso/data/?';
const apiTest = 'https://us-central1-lms-nuvem-mestra.cloudfunctions.net/testApi';

//Comparer Function    
function GetSortOrder(prop) {    
    return function(a, b) {    
        if ([prop] < b[prop]) {    
            return 1;    
        } else if (a[prop] > b[prop]) {    
            return -1;    
        }    
        return 0;    
    }    
}    

router.get('/',function(req,res){
    var state = req.query.state;
    var dateStart = req.query.dateStart;
    var dateEnd = req.query.dateEnd;
    var i = 0;
    
    axios.get(apiCovid+'state='+state+'&date='+dateStart, {
      headers: {
          Authorization: `token ${token}`
      }
    }).then(function(response) {
        var itensList = [];
        itensList=response.data.results;
        itensList.sort(GetSortOrder("confirmed"));//ORDENAR MAIORES CASOS CONFIRMADOS
        const data = itensList.slice(0, 10).forEach(element => {
            const city = element.city
            const confirmed = element.confirmed            
            item = {
                id: i,
                nomeCidade: city,
                percentualDeCasos: confirmed
            }
            if(city!=null){
                const headersTest = {
                    MeuNome : 'Flaberson Barros'
                }

                axios.post(apiTest, item, {
                    headers: headersTest
                }).then(function(response) {
                    console.log(response.data);
                }).catch(function (error) {
                    if (error) {
                        console.log(error)
                    }
                });
                i++;
            }
        });    
    }).catch(function (error) {
        if (error) {
            console.log(error)
        }
    });

    res.send('Hello');
    res.end();
});

app.use('/',router);
app.listen(process.env.port || 3000);

console.log('Servidor ok!');