var data;
var json = null;

function readData(name)
{
    var req = new XMLHttpRequest();
    var loc = 'http://astarte.csr.unibo.it/gapdata/' + name;
    if ('withCredentials' in req)
    {
        req.open('GET', loc , true);
        req.onreadystatechange = function()
        {
            if (req.readyState === 4)
            {
                if (req.status >= 200 && req.status < 400){
                    data = req.responseText;
                    json = JSON.parse(data);
                    assignDataGAP();
                }
                else{
                    alert("Errore nella lettura del JSON!");
                }
            }
        };
        req.send();
        //alert("Data readed from location:\n" + loc);
        return "Loaded file "+ name + ". Now, click Maxo Go!";
    }
}

function assignDataGAP()
{
    var nome = json.nome;
    m = json.magazzini;//numero dei magazzini
    n = json.clienti;//numero dei clienti
    cap = json.cap;//vettore delle capacità dei magazzini
    c = new Array(m);
    var i = 0;
    var j = 0;

    for(i = 0; i < m; i++)
    {
        c[i] = json.costi[i];//costi per ogni magazzino(righe) e clienti(colonne)
    }
    req = new Array(m);
    for(i = 0; i < m; i++)
    {
        req[i] = json.req[i];// matrice delle richieste
    }
}
