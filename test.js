player = function(name, sixes, srate, out, runs, overs) {
	this.name = name;
	this.sixes = sixes;
	this.srate = srate;
	this.out = out;
	this.runs = runs;
	this.overs = overs;
}

mycb = function(data) {
	var playerdata = data.query.results.tr;
	var plcount = playerdata.length;
	var i = 0;
	var totaldata = '';
	var playerstats = new Array();
	var d = document.createElement('div');
	d.setAttribute('id', 'apidata');
	
	for (i=0; i < plcount; i++) {
		var pldetail = playerdata[i].td;
		var name, sixes, rr, out, runs, overs;
		if(pldetail[1].hasOwnProperty('a') && pldetail[1].a.class=="playerName")
		{
			name = pldetail[1].a.content;
		}
		else
		{
			continue;
		}
		if (pldetail[2].class=="battingDismissal")
		{
			out = 1;
		}
		if (pldetail[3].class=="battingRuns")
		{
			runs = pldetail[3].p;
		}
		if (pldetail[7].class=="battingDetails")
		{
			sixes = pldetail[7].p;
		}
		if (pldetail[8].class=="battingDetails")
		{
			srate = pldetail[8].p;
		}
		var plvar = new player(name, sixes, srate, out, runs, overs);
		playerstats[name] = plvar;
		totaldata = totaldata + name + ' Runs: ' + runs + '<br>' ;
	}
	d.innerHTML = totaldata;
	document.getElementsByTagName('body')[0].appendChild(d);
}

 function calcpoints(playerdetails)
 {
	var keepers=["MS Dhoni","AB de Villiers","KC Sangakkara","BB McCullum","BJ Haddin","K Akmal","T Taibu","TD Paine","M Rahim","MJ Prior","A Bagai","NJ O'Brien","DO Obuya","DC Thomas","GC Wilson","MA Ouma","W Barresi","RW Chakabva","A Buurman"];
	var bowlers=["M Muralitharan","GP Swann","B Lee","H Singh","Z Khan","U Gul","DW Steyn","SL Malinga","MG Johnson","A Razzak","JM Anderson","KD Mills","S Akhtar","M Morkel","BAW Mendis","KMDN Kulasekara","SW Tait","A Nehra","MM Patel","S Ajmal","LL Tsotsobe","CRD Fernando","KAJ Roach","JJ Krejza","A Shahzad","PP Chawla","R Ashwin","S Sreesanth","TG Southee","W Riaz","WD Parnell","NO Miller","R Rampaul","P Utseya","RW Price","WB Rankin","PJ Ongondo","HK Bennett","NL McCullum","A Rehman","RJ Peterson","HMRKB Herath","SJ Benn","AG Cremer","CB Mpofu","T Panyangara","N Hossain","R Hossain","S Islam","S Shuvo","CT Tremlett","A van der Merwe","GH Dockrell","NG Jones","JO Ngoche","NN Odhiambo","J Khan","MI Tahir","H Baidwan","K Chohan","PM Seelaar","AD Russell","D Bishoo","SW Masakadza","H Osinde","PA Desai","WDB Rao","E Otieno","SO Ngoche","A Raja","BA Westdijk","BP Kruger","BP Loots"];
	var allrounders=["SR Watson","JH Kallis","CH Gayle","S Al Hasan","Y Singh","A Razzaq","AD Mathews","TM Dilshan","PD Collingwood","DL Vettori","SB Styris","S Afridi","KA Pollard","TT Bresnan","YK Pathan","RN ten Doeschate","JDP Oram","JEC Franklin","M Hafeez","SPD Smith","JM Davison","J Botha","NLTC Perera","DJ Sammy","E Chigumbura","M Mahmudullah","N Islam","AS Hansra","LJ Wright","MH Yardy","AR Cusack","JF Mooney","KJ O'Brien","S Tikolo","TM Odoyo","LJ Woodcock","GA Lamb","JW Hastings","RA Cheema","JC Tredwell","AC Botha","AR White","DT Johnston","JK Kamande","F du Plessis","M Bukhari","K Whatham","PW Borren"];
	var batters=["SR Tendulkar","MEK Hussey","RT Ponting","V Sehwag","HM Amla","MJ Clarke","G Gambhir","DPMD Jayawardene","CL White","AJ Strauss","EJG Morgan","SK Raina","V Kohli","LRPL Taylor","Y Khan","GC Smith","RR Sarwan","S Chanderpaul","CJ Ferguson","T Iqbal","IJL Trott","IR Bell","JD Ryder","MJ Guptill","M ul-Haq","JP Duminy","WU Tharanga","BRM Taylor","DJ Hussey","S Nafees","RS Bopara","PR Stirling","JM How","U Akmal","CA Ingram","MN van Wyk","LPC Silva","TT Samaraweera","DM Bravo","I Kayes","M Ashraful","R Hasan","TLW Cooper","KS Williamson","CK Kapugedera","DS Smith","CK Coventry","CR Ervine","J Siddique","R Gunasekera","EC Joyce","WTS Porterfield","AA Obanda","T Mishra","A Shafiq","A Shehzad","V Sibanda","CO Obuya","AN Kervezee","B Zuiderent","ES Szwarczynski","KA Edwards","T Duffin","H Patel","N Kumar","TG Gordon","ZE Surkari","RR Patel","SR Waters","TN de Grooth"];

	// playerdetails (runs, sixes, rr, out, cat, 


 }

 function getData(matchnum) {
	var results = document.getElementById('results');
	var url = 'select * from html where url = "http://www.espncricinfo.com/icc_cricket_worldcup2011/engine/current/match/433586.html?view=scorecard" and xpath="//*[@id=\"inningsBat1\"]//tr[@class=\"inningsRow\"]"';
	var api = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent(url) + '&format=json&diagnostics=false&callback=mycb';

	api = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%20%3D%20'http%3A%2F%2Fwww.espncricinfo.com%2Ficc_cricket_worldcup2011%2Fengine%2Fcurrent%2Fmatch%2F433585.html%3Fview%3Dscorecard'%20and%20xpath%3D'%2F%2F*%5B%40id%3D%22inningsBat1%22%5D%2F%2Ftr%5B%40class%3D%22inningsRow%22%5D'%20%0A&format=json&callback=mycb";
	
	var s = document.createElement('script');
	s.setAttribute('src',api);
	document.getElementsByTagName('head')[0].appendChild(s);
 }

 document.getElementById("matchsearch").onsubmit = function(){
	var matchnum = document.getElementById('query').value;
	getData(matchnum);
	return false;
 }
