function doMaxo(maxT)
{
    if(json == null)
    {
        //alert("You must read the file first!!");
        return "You must read the file first!!";
    }
    var z=0;
    var localsolbest;
    var t0, tcurr, tspan;
    doConstructiveGAP();
    t0 = new Date();
    tcurr = new Date();
    tspan = new Date();
    tspan = 0;
    var r = confirm("Start!");

    if (r == true) 
    {
        opt10:
        while(tspan < maxT)
        {
            z = doOpt10(c);
            if(z < zub)
            {
                zub = z;
                solbest = sol.slice();
            }
            tcurr = new Date();
            tspan = tcurr - t0;
            if(tspan >= maxT)
                break;
            z = doOpt11(c);
            if(z < zub)
            {
                zub = z;
                solbest = sol.slice();
                //continue opt10;
            }
            tcurr = new Date();
            tspan = tcurr - t0;
            if(tspan >= maxT)
                break;
            z = doOpt21(c);
            if(z < zub)
            {
                zub = z;
                solbest = sol.slice();
                continue opt10;
            }
            tcurr = new Date();
            tspan = tcurr - t0;
            /*if(tspan >= maxT)
                break;
            z = doOpt10(c);
            if(z < zub)
            {
                zub = z;
                solbest = sol.slice();
                continue opt10;
            }
            tcurr = new Date();
            tspan = tcurr - t0;*/
            perturbation();
        }

        checkVal = Math.abs(checkSol(solbest) - zub);
        if(checkVal <= EPS )
        {
            var myJsonString = JSON.stringify(solbest);
            //alert("Costo: " + zub + " in " + tspan + " millisec e sol: " + myJsonString);
            return ["Costo: " + zub, " Tempo: " + tspan/1000 + " sec", " Soluzione: " + myJsonString];
        }    
        else
            alert("Errore!!");
    }
    else
    {
        return "You must press ok to start!";
    }
}

function doConstructiveGAP()
{
    var i = 0;
    var j = 0;
    var ii = 0;

    var capLeft = cap.slice(); // array delle capacità residue
    var z = 0; // costo della soluzione

    sol = new Array(n);

    var dist = new Array(m);
    for(i = 0; i < m; i++)
        dist[i] = new Array(2);

    //do it!!
    for(j = 0; j < n; j++)
    {
        for(i = 0; i < m; i++)
        {
            dist[i][0] = req[i][j];
            dist[i][1] = i;
        }
        dist.sort(compareKey);

        ii = 0;
        while(ii < m)
        {
            i = dist[ii][1];
            if(capLeft[i] >= req[i][j])
            {
                sol[j] = i;
                capLeft[i] -= req[i][j];
                z += c[i][j];
                break;
            }
            ii++;
        }
    }
    zub = z;
    solbest = sol.slice();
    var checkVal = Math.abs(checkSol(sol) - z);
    if(checkVal <= EPS )
    {
            //alert("Constructive Gap z = " + zub);
    }
    else
        alert("Errore!!");
}

function doOpt10(costi)
{
    var i, isol, j;
    var z = 0;
    var isImproved;
    var capLeft = cap.slice();
    for(j = 0; j < n; j++)
    {
        capLeft[sol[j]] -= req[sol[j]][j];
        z += costi[sol[j]][j];
    }
    do
    {
        isImproved = false;
        for (j = 0; j < n; j++) 
        {
            isol = sol[j];
            for(i = 0; i < m; i++)
            {
                if(i == isol)
                    continue;
                if(costi[isol][j] > costi[i][j] && capLeft[i] >= req[i][j])
                {
                    sol[j] = i;
                    capLeft[i] -= req[i][j];
                    capLeft[isol] += req[isol][j];
                    z -= costi[isol][j] - costi[i][j];
                    isImproved = true;
                    break;
                }
            }
            if(isImproved)
                break;
        }
    } while(isImproved);
    return z;
}

function doOpt11(costi)
{
    var i, isol, j=0, j1=0, sj, sj1;
    var z = 0;
    var isImproved;
    var capLeft = cap.slice();
    var delta = 0;
    var a=0,b=0;

    for(j = 0; j < n; j++)
    {
        capLeft[sol[j]] -= req[sol[j]][j];
        z += costi[sol[j]][j];
    }

    do
    {
        isImproved = false;
        for (j = 0; j < n-1; j++) 
        {
            for(j1 = (j+1) ; j1 < n; j1++)
            {
                sj = sol[j];
                sj1 = sol[j1];
                delta = 0;
                delta = (costi[sj][j] + costi[sj1][j1]) - (costi[sj][j1] + costi[sj1][j]);

                if(delta > 0)
                {
                    a = capLeft[sj] + req[sj][j];
                    b = capLeft[sj1] + req[sj1][j1];
                    if(a >= req[sj][j1] && b >= req[sj1][j])
                    {
                        sol[j] = sj1;
                        sol[j1] = sj;

                        capLeft[sj] -= req[sj][j1];
                        capLeft[sj] += req[sj][j];
                        capLeft[sj1] -= req[sj1][j];
                        capLeft[sj1] += req[sj1][j1];
                        z = z - delta;
                        isImproved = true;
                        break;
                    }
                }
            }
            if(isImproved)
                break;     
        }     
    } while(isImproved);
    return z;
}

function doOpt21(costi)
{
    var i, isol, j=0, j1=0, j2=0, sj, sj1, sj2;
    var z = 0;
    var isImproved;
    var capLeft = cap.slice();
    var delta1=0, delta2=0, delta=0;
    var reqS=0;
    var a=0,b=0;
    var flag = 0;
    var temp=0;
    var r=0;

    for(j = 0; j < n; j++)
    {
        capLeft[sol[j]] -= req[sol[j]][j];
        z += costi[sol[j]][j];
    }

    do
    {
        isImproved = false;
        for (j = 0; j<(n-2); j++) 
        {
            for(j1 = (j+1) ; j1 <(n-1); j1++)
            {
                for(j2 = (j1+1) ; j2 < n; j2++)
                {
                    sj = sol[j];//macchina che svolgeva il lavoro j nella precedente soluzione
                    sj1 = sol[j1];//macchina che svolgeva il lavoro j1 nella precedente soluzione
                    sj2 = sol[j2];//macchina che svolgeva il lavoro j2 nella precedente soluzione
                    if(sj == sj1 || sj == sj2)
                        continue;
                    delta = 0;
                    flag = 0;
                    delta1 = (costi[sj][j] + costi[sj1][j1] + costi[sj2][j2]) - (costi[sj1][j] + costi[sj][j1] + costi[sj][j2]);
                    delta2 = (costi[sj][j] + costi[sj1][j1] + costi[sj2][j2]) - (costi[sj2][j] + costi[sj][j1] + costi[sj][j2]);
                    if(delta1 > delta2)
                    {
                        delta = delta1;
                        flag = 1;
                    }
                    else
                    {
                        delta = delta2;
                        flag = 2;
                    }
                    if(delta > 0)
                    {
                        reqS = req[sj][j1] + req[sj][j2];
                        a = capLeft[sj] + req[sj][j];//capacità ripristinata della macchina sj
                        if(flag == 1)//se decido di assegnare il lavoro j alla macchina sj1
                        {
                            b = capLeft[sj1] + req[sj1][j1];//ripristino la capacità della macchina sj1
                            r = req[sj1][j];//richiesta per il lavoro j sulla macchina j1
                        }
                        else
                        {
                            b = capLeft[sj2] + req[sj2][j2];//ripristino la capacità della macchina sj2
                            r = req[sj2][j];//richiesta per il lavoro j sulla macchina j2
                        }
                        if(a >= reqS && b >= r)
                        {
                            //ripristino le capacità
                            capLeft[sj1] += req[sj1][j1];
                            capLeft[sj2] += req[sj2][j2];
                            capLeft[sj] += req[sj][j];

                            if(flag == 1)//se decido di assegnare j alla macchina j1
                            {
                                capLeft[sj1] -= req[sj1][j];
                                sol[j] = sj1;
                            }
                            else
                            {
                                capLeft[sj2] -= req[sj2][j];
                                sol[j] = sj2;
                            }

                            capLeft[sj] -= req[sj][j1];
                            capLeft[sj] -= req[sj][j2];

                            sol[j1] = sj;
                            sol[j2] = sj;

                            z = z - delta;
                            //console.log("Improving: " + z);
                            isImproved = true;
                            break;
                        }
                    }
                }
                if(isImproved)
                    break;  
            }
            if(isImproved)
                break;     
        }
    } while(isImproved);
    return z;
}

function checkSol(sol)
{
   var z = 0,j;
   var capused = new Array(m);
   for(i = 0; i<m; i++)
        capused[i] = 0;

   // controllo assegnamenti
   for (j = 0; j < n; j++)
        if (sol[j] < 0 || sol[j] >= m || sol[j]===undefined) 
        {  
            z = Number.MAX_VALUE;
            return z;
        } 
        else
            z += c[sol[j]][j];

   // controllo capacità
   for (j = 0; j < n; j++) 
   {  
        capused[sol[j]] += req[sol[j]][j];
        if (capused[sol[j]] > cap[sol[j]]) 
        {  
            z = Number.MAX_VALUE;
            return z;
        }
   }
   return z;
}

function compareKey(a,b)
{
    if(a[0] == b[0])
        return 0;
    else
        return (a[0] < b[0] ? -1 : 1);
}

function perturbation()
{
    var i,j;
    var cost = new Array(m);
    for(i = 0; i < m; i++)
    {
        cost[i] = new Array(n);
        for(j = 0; j < n; j++)
            cost[i][j] = 0;
    }
    for(i = 0; i < m; i++)
        for(j = 0; j < n; j++)
            cost[i][j] = 0.60*c[i][j] + Math.random()*0.8*c[i][j];
            //cost[i][j] = 0.75*c[i][j] + Math.random()*0.5*c[i][j];

    doOpt10(cost);//modifico solo la sol[] e non la z...quindi è ok
}