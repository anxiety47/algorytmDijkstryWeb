/* opisy funkcji znajduja sie w pliku dokumentacja.html*/
var xmlHttp;

// dane dla kola rysowanego  w funkcji rysujKolo
var promien = 250;
var srodekX = 300;
var srodekY = 300;

/*obiekt przechowujacy najwazniejsze informacje dotyczace grafu, tj. tablice wierzcholkow, krawedzi, wag, zmodyfikowana macierz sasiedztwa,wierzcholekStart (zrodlo - wierzcholek z ktorego szukamy najkrotszych sciezek) oraz tabliceKoncowa, czyli informacje o dlugosciach sciezek, poprzednikach i statusie podczas wykonywania algorytmu */
var graf = new Object;

function wyczyscDiv(elementID)
{
	document.getElementById(elementID).innerHTML = "";
}

function rysujTabInfo(tabStatus,tabDlugosc, tabPoprzednik)
{
	wyczyscDiv("tabDijkstra");

	var grafTab = [];
	var tablica = document.getElementById("tabDijkstra");
	var ileWierszy = graf.wierzcholki.length;
	var ileKolumn = 4;
	
	var tbl = document.createElement("table");

        var naglowek = document.createElement("tr");

        var wierzcholek = document.createElement("th");
        wierzcholek.appendChild(document.createTextNode("nr wierzchołka"));
        naglowek.appendChild(wierzcholek);

        var status = document.createElement("th");
        status.appendChild(document.createTextNode("czy odwiedzony"));
        naglowek.appendChild(status);

        var sciezka = document.createElement("th");
        sciezka.appendChild(document.createTextNode("długość ścieżki"));
        naglowek.appendChild(sciezka);

	var poprzedni = document.createElement("th");
        poprzedni.appendChild(document.createTextNode("poprzedni wierzchołek"));
        naglowek.appendChild(poprzedni);

        tbl.appendChild(naglowek);
	
	for (var r = 0; r < ileWierszy; r++)
        {
		grafTab[r] = new Array(ileKolumn);
                var wiersz = document.createElement("tr");
                for (var c = 0 ; c < ileKolumn; c++)
                {	
			if (c == 0)	
			{
				var g = r;
				var wartosc = document.createTextNode(r);
			}
			if (c == 1)	
			{
				var g = tabStatus[r];
				var wartosc = document.createTextNode(tabStatus[r]);
			}
			if (c == 2)
			{
				var g = tabDlugosc[r];
				var wartosc = document.createTextNode(tabDlugosc[r]);
			}
			if (c ==3)
			{
				var g = tabPoprzednik[r];
                        	var wartosc =  document.createTextNode(tabPoprzednik[r]) ;
			}

			grafTab[r][c] = g;
			// sprawdzamy czy wartosc w komorce sie zmienila (grafTab - nowa wartosc, graf.tablicaKoncowa - stara wartosc)
			if (grafTab[r][c] != graf.tablicaKoncowa[r][c])
				{
					// zaznacz komorke na czerwono	
					var wyrozniony = document.createElement("td");
					wyrozniony.style.background = "red";
					wyrozniony.appendChild(wartosc);
					wiersz.appendChild(wyrozniony);
					
				}
			else
				{	
					var komorka = document.createElement("td");
					komorka.style.background = "white";
					komorka.appendChild(wartosc);
                 		       	wiersz.appendChild(komorka);
				}
                }
                tbl.appendChild(wiersz);
        }
        tablica.appendChild(tbl);
	graf.tablicaKoncowa = grafTab;
}

function rysujTabKrawedzi()
{
	wyczyscDiv("tabKrawedzie");
	otworzZakladke("infoTablice");

	var tablica = document.getElementById("tabKrawedzie");
	var ileWierszy = graf.wagi.length;
	var ileKolumn = 3;
	
	var tbl = document.createElement("table");
	
	var naglowek = document.createElement("tr");
	
	var wierzcholek1 = document.createElement("th");
	wierzcholek1.appendChild(document.createTextNode("wierzchołek 1"));
	naglowek.appendChild(wierzcholek1);

	var wierzcholek2 = document.createElement("th");
        wierzcholek2.appendChild(document.createTextNode("wierzchołek 2"));
        naglowek.appendChild(wierzcholek2);

	var waga = document.createElement("th");
        waga.appendChild(document.createTextNode("waga"));
        naglowek.appendChild(waga);

	tbl.appendChild(naglowek);	

	for (var r = 0; r < ileWierszy; r++)
	{		
		var wiersz = document.createElement("tr");
		for (var c = 0 ; c < ileKolumn; c++)
		{
			var komorka = document.createElement("td");
			var wartosc = document.createTextNode(graf.wagi[r][c]);
			komorka.appendChild(wartosc);		
			wiersz.appendChild(komorka);
		}
		tbl.appendChild(wiersz);
	}
	tablica.appendChild(tbl);

} 

function wyroznijKrawedz(w1,w2, kolor)
{
	var c = document.getElementById("canvas");
        var ctx = c.getContext("2d");

        ctx.beginPath();
        ctx.moveTo(graf.wierzcholki[w1][0], graf.wierzcholki[w1][1]);
        ctx.lineTo(graf.wierzcholki[w2][0], graf.wierzcholki[w2][1]);

        ctx.lineWidth = 3;
        ctx.strokeStyle = kolor;
        ctx.stroke();
}

function wyroznijPunkt(x,y)
{
	var c = document.getElementById("canvas");
        var ctx = c.getContext("2d");

        ctx.beginPath();
	ctx.fillStyle="red";
        ctx.arc(x,y,7,0,2*Math.PI);
        ctx.fill();

}
function dzwiek()
{
	var d = document.getElementById("sukces");
	d.play();

}

function Dijkstra()
{
	wyczyscDiv("sciezki");
	otworzZakladke("infoTablice");
	var start = document.getElementById("start").value;
	graf.wierzcholekStart = start;
	var v = document.getElementById("szybkosc").value;
		
	var najkrotszaSciezkaInfo = najkrotszaSciezka(v);
	if (najkrotszaSciezkaInfo == -1)
		console.log("brak sciezki");
}

function wypelnijTabliceKoncowa(tabStatus, tabDlugosc, tabPoprzednik )
{
	var ileWierszy = graf.wierzcholki.length;
	var ileKolumn = 4;
	grafTab = [];

	for (var r = 0; r < ileWierszy; r++)
        {
                grafTab[r] = new Array(ileKolumn);
                for (var c = 0 ; c < ileKolumn; c++)
                {
                        if (c == 0)
                                var wartosc = r;
                        if (c == 1)
                                var wartosc =tabStatus[r];
                        if (c == 2)
                                var wartosc = tabDlugosc[r];
                        if (c ==3)
                                var wartosc =tabPoprzednik[r];

                        grafTab[r][c] = wartosc;

		}
	}
	return grafTab;
}

function najkrotszaSciezka(v)
{	
	var c = document.getElementById("canvas");
        var ctx = c.getContext("2d");

	var interwal = v*1000;
	var licznik = 1;
	
	var startW = graf.wierzcholekStart;
	var rozmiar = graf.macierz.length;
	var wierzcholkiOdwiedzone = new Array(rozmiar);
	
	var tabOdleglosci = new Array(rozmiar);
        var tabPoprzednikow = new Array(rozmiar);


	//wypelniamy tablice wartosciami poczatkowymi
        for (var i = 0; i < rozmiar; i++)
	{
        	wierzcholkiOdwiedzone[i] = false; 
		tabOdleglosci[i] = Infinity; 
	   	tabPoprzednikow[i] = -1;
	}		
	graf.tablicaKoncowa = wypelnijTabliceKoncowa(wierzcholkiOdwiedzone, tabOdleglosci, tabPoprzednikow);

	wierzcholkiOdwiedzone[startW] = true;
	wyroznijPunkt(graf.wierzcholki[startW][0], graf.wierzcholki[startW][1]);
	rysujTabInfo(wierzcholkiOdwiedzone, tabOdleglosci, tabPoprzednikow);

	// szukamy wierzcholkow ktore maja bezposrednie polaczenie z wierzcholkiem startowym 
	var c = function()
	{
	        odtworzGraf();

		for (var i = 0; i < rozmiar; i++)
		{
			tabOdleglosci[i] = graf.macierz[startW][i];
			if (graf.macierz[startW][i] != Infinity)
			{	
				wyroznijPunkt(graf.wierzcholki[startW][0], graf.wierzcholki[startW][1]);
				wyroznijKrawedz(startW,i, "red");
				tabPoprzednikow[i] = startW;		
			}
		} 
		
		tabOdleglosci[startW] = 0;
		rysujTabInfo(wierzcholkiOdwiedzone, tabOdleglosci, tabPoprzednikow);
	}
	setTimeout(c,licznik*interwal);
	licznik++;

	for (var i = 0; i < rozmiar-1; i++)
	{	

		var flaga = 0;
		var najblizszyWierzcholek = -1;

		var d = function()
		{
			var odl = Infinity;
		
			for (var j = 0; j < rozmiar; j++)
			{
				if(!wierzcholkiOdwiedzone[j] && tabOdleglosci[j] < odl)
				{
					odl = tabOdleglosci[j];
					najblizszyWierzcholek = j;
				}	
			}
			if (najblizszyWierzcholek == -1)
			{
				console.log("break");
				flaga = -1;
				return -1;
			}
			wierzcholkiOdwiedzone[najblizszyWierzcholek] = true;
		
	       		odtworzGraf();
			wyroznijPunkt(graf.wierzcholki[najblizszyWierzcholek][0], graf.wierzcholki[najblizszyWierzcholek][1]);
			rysujTabInfo(wierzcholkiOdwiedzone,tabOdleglosci,tabPoprzednikow);
                }
                setTimeout(d,licznik*interwal);
                licznik++;		
		
		var e = function()
		{
			if (flaga == -1)
				return -1;
		
		        odtworzGraf();

			for (var j = 0; j < rozmiar; j++)
			{
				if(!wierzcholkiOdwiedzone[j])
				{
					var testOdleglosc = tabOdleglosci[najblizszyWierzcholek] + graf.macierz[najblizszyWierzcholek][j];
					if(testOdleglosc < tabOdleglosci[j])
					{
						tabOdleglosci[j] = testOdleglosc;
						tabPoprzednikow[j] = najblizszyWierzcholek;
						wyroznijKrawedz(najblizszyWierzcholek, j, "red");
					}
					else if(graf.macierz[najblizszyWierzcholek][j] != Infinity)
						wyroznijKrawedz(najblizszyWierzcholek, j, "blue");
				
				}			
			}
			rysujTabInfo(wierzcholkiOdwiedzone,tabOdleglosci,tabPoprzednikow);
		}
		setTimeout(e,licznik*interwal);
		licznik++;
	}

	var fun = function()
        {
		rysujTabInfo(wierzcholkiOdwiedzone,tabOdleglosci,tabPoprzednikow);
        	dzwiek();
        	var sciezkiInfo = document.getElementById("sciezki");
		sciezkiInfo.innerHTML = "";
        	for (var i = 0; i < graf.macierz.length; i++)
       	 	{
                	if (i != graf.wierzcholekStart)
               	 	{
				wierzcholekKoncowy = i;
                        	sciezkiInfo.innerHTML += "ścieżka od " + graf.wierzcholekStart + " do " + i + ": ";
	
				var sciezka = [];
       			 	while (wierzcholekKoncowy != startW)
       		 	 	{
                			//console.log("while");
                			if (tabPoprzednikow[wierzcholekKoncowy] ==-1)
						break;
				
               				else
					{
					sciezka.unshift(wierzcholekKoncowy);
                			wierzcholekKoncowy = tabPoprzednikow[wierzcholekKoncowy];
  					}
	      			}
        
				if (sciezka.length != 0)
					sciezka.unshift(wierzcholekKoncowy);
        			var wynik = sciezka;
		

                        	if (wynik.length == 0)
                                	sciezkiInfo.innerHTML += "brak ścieżki" + "<br/>";
                       		else
                                	sciezkiInfo.innerHTML += wynik + "<br/>";
        		} 
		}
        }        
        setTimeout(fun,licznik*interwal);

	
	return { "poczatkowyWierzcholek":startW,
		 "tabOdleglosci": tabOdleglosci,
		 "tabPoprzednikow":tabPoprzednikow };		
}

function utworzMacierz(wagi,w)
{	
	var macierz = new Array(w);
	for (var i =0; i <w ; i++)
	{
		macierz[i] = new Array(w);
		for (var j =0 ; j < w ; j++)
			macierz[i][j] = Infinity;
	}
	
	for (var i = 0; i < wagi.length; i++)
	{
		macierz[wagi[i][0]][wagi[i][1]] = wagi[i][2];
		macierz[wagi[i][1]][wagi[i][0]] = wagi[i][2];	
		
	}		
	graf.macierz = macierz;
}


function getRequestObject() 
{
       if ( window.ActiveXObject)  {
            return ( new ActiveXObject("Microsoft.XMLHTTP")) ;
        } else if (window.XMLHttpRequest)  {
           return (new XMLHttpRequest())  ;
        } else {
           return (null) ;
        }
}

function sendRequest()
{
       xmlHttp = getRequestObject() ;
       if (xmlHttp) {
         try {
           var iloscWierzcholkow = document.getElementById('wierzcholki').value ;
           var url = "../../cgi-bin/projekt1/projekt.py" ;
           url += "?wierzcholki=" + iloscWierzcholkow;

           xmlHttp.onreadystatechange = handleResponse ;
           xmlHttp.open("GET", url, true);
           xmlHttp.send(null);
         }
         catch (e) {
           alert ("Nie mozna polaczyc sie z serwerem: " + e.toString()) ;
         }
       } else {
         alert ("Blad") ;
       }
}

function handleResponse() 
{
    wiadomosc = document.getElementById("ans");
    if (xmlHttp.readyState == 4) {
         if ( xmlHttp.status == 200 )  {
             response = xmlHttp.responseText;
	     var dataJSON = JSON.parse(response);
             var w = parseInt(dataJSON.wierzcholki);
        
	          
	     //tablica na wierzcholki grafu (wspolrzedna x i y)
	     var punkty = [];
	     punkty.length = w;
	     
	     var max = w*(w-1)/2;
             var ileKrawedzi = rand(1,max+1);
	     var krawedzie = new Array(ileKrawedzi);

	     var wagi = new Array(ileKrawedzi);

	     rysujGraf(w,punkty,krawedzie,wagi);
       		
	     wagi.sort();
		
	     // przepisujemy dane do obiektu
	     graf.wagi = wagi; 
	     graf.wierzcholki = punkty;
	     graf.krawedzie = krawedzie;

	     utworzMacierz(wagi,w);
	}
    }
}


function rysujGraf(liczbaWierzcholkow, punkty, krawedzie,wagi)
{
	var c = document.getElementById("canvas");
	var ctx = c.getContext("2d");
	ctx.clearRect(0,0,c.width,c.height);
	rysujKolo(srodekX, srodekY, promien);


	for(var x=0; x<liczbaWierzcholkow;x++)
		rysujPunkt(srodekX, srodekY, promien, (x+1) * (360 / liczbaWierzcholkow),x,punkty);
	rysujLinie(liczbaWierzcholkow,punkty,krawedzie,wagi);
}


/*funkcja rysujaca kolo(niewidoczne), na ktorym wybierzemy wierzcholki grafu */
function rysujKolo(x, y, r) {

	var c = document.getElementById("canvas");
	var ctx = c.getContext("2d");
	ctx.strokeStyle="white";
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2 * Math.PI);
	ctx.stroke();
}


/* funkcja rysujaca wierzcholki grafu */
function rysujPunkt(x, y, dlugosc, kat, numer,punkty) {

	var c = document.getElementById("canvas");
	var ctx = c.getContext("2d");

	var radian = kat / 180 * Math.PI;
	var punktX = parseInt(x + dlugosc * Math.cos(radian));
	var punktY = parseInt(y - dlugosc * Math.sin(radian));

	ctx.beginPath();
	ctx.fillStyle="green";
	ctx.arc(punktX,punktY,5,0,2*Math.PI);
	ctx.fill();

	ctx.fillStyle="black";
	ctx.font="20px Arial";
	ctx.fillText(numer,punktX,punktY);

	punkty[numer] = [punktX,punktY];
}


/* funkcja rysujaca krawedzie w grafie*/
function rysujLinie(liczbaWierzcholkow,punkty, krawedzie, wagi)
{
	var c = document.getElementById("canvas");
        var ctx = c.getContext("2d");

	for (var i = 0; i <krawedzie.length;i++)
	{
		krawedzie[i] = new Array(2);
		wagi[i] = new Array(3);
		var w1 = 0;
		var w2 = 0;
		do
		{
			while(w1==w2)
			{
				w1 = rand(0,liczbaWierzcholkow);
				w2 = rand(0,liczbaWierzcholkow);
			}
			if (i == 0)
			{
				krawedzie[i][0] = w1;
				krawedzie[i][1] = w2;
				wagi[i][0] = w1;
				wagi[i][1] = w2;	
			}

			else
			{
				if (sprawdzKrawedz(krawedzie, w1,w2,i) == false)
				{
					w1 = 0;
					w2 = 0;
				}
				else
				{
					krawedzie[i][0] = w1;
					krawedzie[i][1] = w2;
					wagi[i][0] = w1;
					wagi[i][1] = w2;
				}
			}
		} while (w1==w2);

		w1x = punkty[w1][0];
		w1y = punkty[w1][1];
		w2x = punkty[w2][0];
		w2y = punkty[w2][1];

		ctx.beginPath();
		ctx.moveTo(w1x,w1y);
		ctx.lineTo(w2x,w2y);
		ctx.strokeStyle = "black";
		ctx.stroke();

		wagi[i][2] = rand(1,11);
		ctx.fillStyle = "blue";
		ctx.font = "15px Arial";
		// zmiana z 2 na 4, wagi beda sie wypisywac w ok.1/4 dlugosci krawedzi
		ctx.fillText(wagi[i][2], w1x + (w2x-w1x)/4,w1y + (w2y-w1y)/4);
	}
}

function sprawdzKrawedz(krawedzie, w1, w2,dlugosc)
{
	for (var i = 0; i < dlugosc; i++)
	{
		if ((krawedzie[i][0] == w1 && krawedzie[i][1] == w2) || (krawedzie[i][0] == w2 && krawedzie[i][1] == w1))
			return false;
	}
	return true;
}


/* funkcja zwracajaca losowa wartosc typu int z przedzialu <min,max)*/
function rand(min, max) 
{
    return Math.floor(Math.random() * (max - min)) + min;
}


// funkcja otwierajaca zakladki po nacisnieniu przycisku Info lub Tablice
function zakladki(e, tab) 
{
	var i = document.getElementById('info');
	var t = document.getElementById('infoTablice');
	if (tab == 'info')
	{
		i.style.display = 'block';
		t.style.display = 'none';
	}
	if (tab == 'infoTablice')
	{
		i.style.display = 'none';
		t.style.display = 'block';
	}
}

// funkcja otwierajaca zakladki (wywolywana w funkcjach, bez eventu)
function otworzZakladke(tab)
{
        var i = document.getElementById('info');
        var t = document.getElementById('infoTablice');
        if (tab == 'info')
        {
                i.style.display = 'block';
                t.style.display = 'none';
        }
        if (tab == 'infoTablice')
        {
                i.style.display = 'none';
                t.style.display = 'block';
        }
}


function odtworzGraf()
{
	odtworzPunkty();
	odtworzKrawedzie();
}

function odtworzPunkty()
{
	var c = document.getElementById("canvas");
        var ctx = c.getContext("2d");
	ctx.clearRect(0,0,c.width,c.height);	
	ctx.lineWidth = 1;

	for (var i = 0; i < graf.wierzcholki.length;i++)
	{
		ctx.beginPath();
		ctx.fillStyle = "green";
		var punktX = graf.wierzcholki[i][0];
		var punktY = graf.wierzcholki[i][1];
		ctx.arc(punktX,punktY,5,0,2*Math.PI);
        	ctx.fill();
	
		ctx.beginPath();
        	ctx.fillStyle="black";
        	ctx.font="20px Arial";
        	ctx.fillText(i,punktX,punktY);
	}
}

function odtworzKrawedzie()
{
	var c = document.getElementById("canvas");
        var ctx = c.getContext("2d");
	ctx.lineWidth = 1;
	
	for (var i = 0; i < graf.wagi.length;i++)
	{
		w1 = graf.wagi[i][0];
		w2 = graf.wagi[i][1];
		w1x = graf.wierzcholki[w1][0];
		w1y = graf.wierzcholki[w1][1];
		w2x = graf.wierzcholki[w2][0];
                w2y = graf.wierzcholki[w2][1];


        	ctx.beginPath();
		ctx.moveTo(w1x,w1y);
        	ctx.lineTo(w2x,w2y);
        	ctx.strokeStyle = "black";
        	ctx.stroke();

        	waga = graf.wagi[i][2];
        	ctx.fillStyle = "blue";
        	ctx.font = "15px Arial";
       		// zmiana z 2 na 4
        	ctx.fillText(waga, w1x + (w2x-w1x)/4,w1y + (w2y-w1y)/4);	
	}
}
