var express = require('express');
var app = express();
var redis = require('redis');
var client = redis.createClient({
    password: 'vcxS7wx8pZh4emmxA6wcFxGcTBeHqWbg',
    socket: {
        host: 'redis-14321.c267.us-east-1-4.ec2.cloud.redislabs.com',
        port: 14321
    }
});

client.connect();

client.FLUSHDB();

app.use(express.static('public'))
app.set('view engine', 'ejs')
app.set('views', './views')

senhaAtual = 0;
fila = "";

app.get("/", (req, res) => {
    res.render('index', { senhaAtual: senhaAtual, fila: fila })
});

app.get("/proximo", async (req, res) => {
    if(await client.lLen('senha') > 0){
        senhaAtual = await client.rPop('senha');
        fila = fila.replace(senhaAtual + "/", "");
        res.render('index', { senhaAtual: senhaAtual, fila: fila })
    } else{
        res.render('index', { senhaAtual: senhaAtual, fila: fila })
    }
});

app.get("/retirar", async (req, res) => {
    var empurra = Number(await client.LINDEX('senha', 0));
    empurra = empurra + 1;
    await client.lPush('senha', empurra.toString());
    fila = fila + empurra + "/";
    res.render('index', { senhaAtual: senhaAtual, fila: fila })
});

app.listen(8000, () => {
    console.log('Servidor iniciado porta 8000')
});

