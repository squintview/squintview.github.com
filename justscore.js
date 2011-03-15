<script type="text/javascript" charset="utf-8">
function trim(data) {
	return data.replace(/^\s+|\s+$/g,"");
}

function sclean(data) {
	return data.replace(/\n+/g," ");
}


player = function(name) {
	this.name = name;
	this.sixes = 0;
	this.srate = 0.00;
	this.out = 0;
	//this.runs = 0;
	this.cat = '';
	this.points = 0;
	this.overs = 0;
	this.maidens = 0;
	this.oruns = 0;
	this.wickets = 0;
	this.wicket_list = new Array();
	this.wicket_list['nonbowler'] = 0;
	this.wicket_list['bowler'] = 0;
	this.economy = 0.00;
	this.pom = 0;
	this.catches = 0;
	this.stumping = 0;
	this.runout_list = new Array();
	this.runout_list['direct'] = 0;
	this.runout_list['indirect'] = 0;
}
mycb = function(data) {
	var qresults = data.query.results;
	if (qresults == null) {
		var ndata = document.createElement('div');
		ndata.innerHTML='No data found';
		document.getElementsByTagName('body')[0].appendChild(ndata);
		return false;
	}
	
	var playerdata = data.query.results.tr;
	
	var rowcount = playerdata.length;
	var i = 0;
	var totaldata = '';
	var playerstats = new Array();
	var d = document.createElement('div');
	d.setAttribute('id','finalscore');
	var plcount = 0;
	
	for (i=0; i < rowcount; i++) {
		var pldetail = playerdata[i].td;
		var name, sixes, rr, out, runs, cat;
		var pom = 0;
		var isnotes = 1;
		if (playerdata[i].hasOwnProperty('class') && playerdata[i].class=='inningsRow') isnotes = 0;
		if(!isnotes && pldetail[1].hasOwnProperty('a') && pldetail[1].a.class=="playerName")
		{
			name = trim(sclean(pldetail[1].a.content));
			plcount++;
		}
		else if(isnotes && pldetail.hasOwnProperty('strong') && pldetail.strong=="Player of the match")
		{
			namearr = trim(sclean(pldetail.p.content));
			namearr = namearr.split(" ");
			name = namearr[0] + " " + namearr[1];
			pom = 1;
		}
		else
		{
			continue;
		}
		var plvar = new player(name);
		if (playerstats.hasOwnProperty(name)) {
			plvar = playerstats[name];
		}

		if (pom == 1)
		{
			plvar.pom = 1;
		}
		if (!isnotes  &&  pldetail[2].class=="battingDismissal")
		{
			if (pldetail[2].p == 'not out') 
				plvar.out = 0;
			else
			{
				plvar.out = 1;
				// if (pldetail[2].p.search('run out') != -1)
				if (pldetail[2].p.search('c ') == 0 || pldetail[2].p.search('b ') == 0 || pldetail[2].p.search('lbw') == 0)
				{
					var splitreg = "b ";
					if (pldetail[2].p.charAt(0) != 'b') splitreg = " b ";
					var list = pldetail[2].p.split(splitreg);
					var bowler = getActualName(list[1]);
					var bwlrvar = new player(bowler);
					if (playerstats.hasOwnProperty(bowler)) {
						bwlrvar = playerstats[bowler];
					}
					var batcategory = getCategory(plvar.name);
					plvar.cat = batcategory;
					if (batcategory == 'batter' || batcategory == 'keeper' || batcategory == 'allrounder') {
						bwlrvar.wicket_list['nonbowler'] += 1;
					}
					else if (batcategory == 'bowler') {
						bwlrvar.wicket_list['bowler'] += 1;
					}
					if (bwlrvar.hasOwnProperty('name') && typeof bwlrvar.name != 'undefined')
					{
						playerstats[bowler] = bwlrvar;
					}
					if (list[0].search('c ') == 0) {
						var catcherarr = list[0].split(' ');
						if (catcherarr[1] == 'sub') continue;
						catcherarr[1] = catcherarr[1].replace(/[^A-Za-z ']/g,"");
						var catcher = getActualName(catcherarr[1]);
						var ctchrvar = new player(catcher);
						if (playerstats.hasOwnProperty(catcher)) {
							ctchrvar = playerstats[catcher];
						}
						ctchrvar.catches += 1;
						if (ctchrvar.hasOwnProperty('name') && typeof ctchrvar.name != 'undefined')
						{
							playerstats[catcher] = ctchrvar;
						}
					}
					if (list[0].search('st ') == 0) {
						var stumperarr = list[0].split(' ');
						stumperarr[1] = stumperarr[1].replace(/[^A-Za-z ']/g,"");
						var stumper = getActualName(sclean(stumperarr[1]));
						var stmprvar = new player(stumper);
						if (playerstats.hasOwnProperty(stumper)) {
							stmprvar = playerstats[stumper];
						}
						stmprvar.stumping += 1;
						if (stmprvar.hasOwnProperty('name') && typeof stmprvar.name != 'undefined')
						{
							playerstats[stumper] = stmprvar;
						}
					}
	
				}
				else if (pldetail[2].p.search('run out ') == 0)
				{
				// run out (Botha/Mooney)
				// run out (Sammy)
					var bpos = pldetail[2].p.indexOf('(');
					var epos = pldetail[2].p.indexOf(')');
					if (bpos == -1 || epos == -1 ) continue;
					var fldrlist = pldetail[2].p.substr(bpos+1,epos-bpos-1);
					var fldrarr = fldrlist.split('/');
					var fldnum = fldrarr.length;	
						
					for (var j = 0; j < fldnum; j++) {
						fldrarr[j] = fldrarr[j].replace(/[^A-Za-z ']/g,"");
						var fielder = getActualName(sclean(fldrarr[j]));
						var fldrvar = new player(fielder);
						if (playerstats.hasOwnProperty(fielder)) {
							fldrvar = playerstats[fielder];
						}
						if (fldnum == 1) 	
							fldrvar.runout_list['direct'] += 1;
						else if (fldnum > 1)
							fldrvar.runout_list['indirect'] += 1;
		
						if (fldrvar.hasOwnProperty('name') && typeof fldrvar.name != 'undefined')
						{
							playerstats[fielder] = fldrvar;
						}
					}
				}
			}
		}
		else if (!isnotes  &&  pldetail[2].class=="bowlingDetails")
		{
			plvar.overs = parseFloat(pldetail[2].p);	
		}

		if (!isnotes  &&  pldetail[3].class=="battingRuns")
		{
			plvar.runs = parseInt(pldetail[3].p);
		}
		else if (!isnotes  &&  pldetail[3].class=="bowlingDetails")
		{
			plvar.maidens = parseInt(pldetail[3].p);	
		}

		if (!isnotes  &&pldetail[4].class=="bowlingDetails")
		{
			plvar.oruns = parseInt(pldetail[4].p);	
		}

		if (!isnotes && pldetail[5].class=="bowlingDetails")
		{
			plvar.wickets = parseInt(pldetail[5].p);	
		}

		if (!isnotes && pldetail[6].class=="bowlingDetails")
		{
			plvar.economy = parseFloat(pldetail[6].p);	
		}
		else if (!isnotes && pldetail[6].class=="battingDetails")
		{
			plvar.sixes = parseInt(pldetail[6].p);
		}

		if (!isnotes  &&pldetail[7].class=="battingDetails")
		{
			plvar.srate = parseFloat(pldetail[7].p);
			if (plvar.srate == 0 && plvar.runs == 0) plvar.runs = undefined;
		}

		if (!isnotes && pldetail[8].hasOwnProperty('p'))
		{
			plvar.sixes = parseInt(pldetail[7].p);
			plvar.srate = parseFloat(pldetail[8].p);
			if (plvar.srate == 0 && plvar.runs == 0) plvar.runs = undefined;
		}

		// totaldata = totaldata + name + ' Runs: ' + runs + '<br>' ;
		playerstats[name] = plvar;
	}
	var e = document.createElement('div');
	e.setAttribute('id','jsresults');
	// totaldata = '<table><tr><td>Name</td><td>Points</td><td>Category</td><td>MOM</td></tr>';
	var totaldata = '<table><tr><td>Name</td><td>Points</td><td>Category</td><td>Runs</td><td>Sixes</td><td>Rate</td><td>Wickets</td><td>Economy</td></tr>';
	for (plmember in playerstats) {
		calcpoints(playerstats[plmember]);
		if(typeof playerstats[plmember].runs == 'undefined')playerstats[plmember].runs = 0;
		// calcpoints(playerstats[i]);
		// totaldata = totaldata + '<tr><td>' + playerstats[plmember].name + '</td><td>'+playerstats[plmember].points + '</td><td>' + playerstats[plmember].cat + '</td><td>' + playerstats[plmember].pom + '</tr>';
		totaldata = totaldata 
		+ '<tr><td>' + playerstats[plmember].name 
		+ '</td><td>'+playerstats[plmember].points 
		+ '</td><td>' + playerstats[plmember].cat 
		+ '</td><td>' + playerstats[plmember].runs
		+ '</td><td>' + playerstats[plmember].sixes 
		+ '</td><td>' + playerstats[plmember].srate 
		+ '</td><td>' + playerstats[plmember].wickets 
		+ '</td><td>' + playerstats[plmember].economy 
		+ '</td><td></tr>';
	}
	totaldata = totaldata + '</table>';
	totaldata = totaldata + '<br><br><font size=2><i>add 100 points for the player of the match and double total points if the player is your team captain </i>';
	totaldata = totaldata + '<i><br>&copy; Nirmal Thangaraj - Last updated - 15-March-2011 </br></i></font>';
	e.innerHTML = totaldata;
	document.getElementsByTagName('body')[0].appendChild(e);
}

 function getActualName(plname)
 {
	var players=["MS Dhoni","AB de Villiers","KC Sangakkara","BB McCullum","BJ Haddin","K Akmal","T Taibu","TD Paine","M Rahim","MJ Prior","A Bagai","NJ OBrien","NJ O'Brien","DO Obuya","DC Thomas","GC Wilson","MA Ouma","W Barresi","RW Chakabva","AF Buurman", "M Muralitharan","GP Swann","B Lee","H Singh","Z Khan","Umar Gul", "U Gul","DW Steyn","SL Malinga","MG Johnson","A Razzak","JM Anderson","KD Mills","S Akhtar","M Morkel","BAW Mendis","KMDN Kulasekara","SW Tait","A Nehra","MM Patel","S Ajmal","LL Tsotsobe","CRD Fernando","KAJ Roach","JJ Krejza","A Shahzad","PP Chawla","R Ashwin","S Sreesanth","TG Southee","Wahab Riaz","W Riaz","WD Parnell","NO Miller","R Rampaul","P Utseya","RW Price","WB Rankin","PJ Ongondo","HK Bennett","NL McCullum","Abdur Rehman","A Rehman","RJ Peterson","HMRKB Herath","SJ Benn","AG Cremer","CB Mpofu","T Panyangara","N Hossain","R Hossain","S Islam","S Shuvo","CT Tremlett","A van der Merwe","GH Dockrell","NG Jones","JO Ngoche","NN Odhiambo","J Khan","Imran Tahir","MI Tahir","H Baidwan","K Chohan","PM Seelaar","AD Russell","D Bishoo","SW Masakadza","H Osinde","PA Desai","WDB Rao","WD Balaji Rao","E Otieno","SO Ngoche","Adeel Raja","A Raja","BA Westdijk","BP Kruger","BP Loots","SR Watson","JH Kallis","CH Gayle","S Al Hasan","Y Singh","A Razzaq","Abdur Razzaq","AD Mathews","TM Dilshan","PD Collingwood","DL Vettori","SB Styris","S Afridi","Shahid Afridi","KA Pollard","TT Bresnan","YK Pathan","RN ten Doeschate","JDP Oram","JEC Franklin","M Hafeez","SPD Smith","JM Davison","J Botha","NLTC Perera","DJ Sammy","E Chigumbura","M Mahmudullah","N Islam","AS Hansra","LJ Wright","MH Yardy","AR Cusack","JF Mooney","KJ O'Brien","KJ OBrien", "S Tikolo","TM Odoyo","LJ Woodcock","GA Lamb","JW Hastings","RA Cheema","Rizwan Cheema","JC Tredwell","AC Botha","AR White","DT Johnston","JK Kamande","F du Plessis","M Bukhari","Mudassar Bukhari","K Whatham","PW Borren", "SR Tendulkar","MEK Hussey","RT Ponting","V Sehwag","HM Amla","MJ Clarke","G Gambhir","DPMD Jayawardene","CL White","AJ Strauss","EJG Morgan","SK Raina","V Kohli","LRPL Taylor","Y Khan","GC Smith","RR Sarwan","S Chanderpaul","CJ Ferguson","T Iqbal","IJL Trott","KP Pietersen", "IR Bell","JD Ryder","MJ Guptill","M ul-Haq","JP Duminy","WU Tharanga","BRM Taylor","DJ Hussey","S Nafees","RS Bopara","PR Stirling","JM How","U Akmal","CA Ingram","MN van Wyk","LPC Silva","TT Samaraweera","DM Bravo","I Kayes","M Ashraful","R Hasan","TLW Cooper","KS Williamson","CK Kapugedera","DS Smith","CK Coventry","CR Ervine","J Siddique","R Gunasekera","EC Joyce","WTS Porterfield","AA Obanda","T Mishra","A Shafiq","A Shehzad","V Sibanda","CO Obuya","AN Kervezee","B Zuiderent","ES Szwarczynski","KA Edwards","T Duffin","H Patel","N Kumar","TG Gordon","ZE Surkari","RR Patel","SR Waters","TN de Grooth","SCJ Broad"];

 for (i in players) {
	if (plname == players[i])
		return players[i];
	if (players[i].search(plname) != -1)
		return players[i];
 }

	return plname;
 }

 function getCategory(plname)
 {
	var keepers={"MS Dhoni":1,"AB de Villiers":1,"KC Sangakkara":1,"BB McCullum":1,"BJ Haddin":1,"K Akmal":1,"T Taibu":1,"TD Paine":1,"M Rahim":1,"MJ Prior":1,"A Bagai":1,"NJ O'Brien":1,"NJ OBrien":1,"DO Obuya":1,"DC Thomas":1,"GC Wilson":1,"MA Ouma":1,"W Barresi":1,"RW Chakabva":1,"AF Buurman":1};
	var bowlers={"M Muralitharan":1,"GP Swann":1,"B Lee":1,"H Singh":1,"Z Khan":1,"Umar Gul":1, "U Gul":1,"DW Steyn":1,"SL Malinga":1,"MG Johnson":1,"A Razzak":1,"JM Anderson":1,"KD Mills":1,"S Akhtar":1,"M Morkel":1,"BAW Mendis":1,"KMDN Kulasekara":1,"SW Tait":1,"A Nehra":1,"MM Patel":1,"S Ajmal":1,"LL Tsotsobe":1,"CRD Fernando":1,"KAJ Roach":1,"JJ Krejza":1,"A Shahzad":1,"PP Chawla":1,"R Ashwin":1,"S Sreesanth":1,"TG Southee":1,"Wahab Riaz":1,"W Riaz":1,"WD Parnell":1,"NO Miller":1,"R Rampaul":1,"P Utseya":1,"RW Price":1,"WB Rankin":1,"PJ Ongondo":1,"HK Bennett":1,"NL McCullum":1,"Abdur Rehman":1,"A Rehman":1,"RJ Peterson":1,"HMRKB Herath":1,"SJ Benn":1,"AG Cremer":1,"CB Mpofu":1,"T Panyangara":1,"N Hossain":1,"R Hossain":1,"S Islam":1,"S Shuvo":1,"CT Tremlett":1,"A van der Merwe":1,"GH Dockrell":1,"NG Jones":1,"JO Ngoche":1,"NN Odhiambo":1,"J Khan":1,"Imran Tahir":1,"MI Tahir":1,"H Baidwan":1,"K Chohan":1,"PM Seelaar":1,"AD Russell":1,"D Bishoo":1,"SW Masakadza":1,"H Osinde":1,"PA Desai":1,"WDB Rao":1,"WD Balaji Rao":1,"E Otieno":1,"SO Ngoche":1,"Adeel Raja":1,"A Raja":1,"BA Westdijk":1,"BP Kruger":1,"BP Loots":1, "SCJ Broad":1};
	var allrounders={"SR Watson":1,"JH Kallis":1,"CH Gayle":1,"S Al Hasan":1,"Y Singh":1,"A Razzaq":1,"Abdur Razzaq":1,"AD Mathews":1,"TM Dilshan":1,"PD Collingwood":1,"DL Vettori":1,"SB Styris":1,"S Afridi":1,"Shahid Afridi":1,"KA Pollard":1,"TT Bresnan":1,"YK Pathan":1,"RN ten Doeschate":1,"JDP Oram":1,"JEC Franklin":1,"M Hafeez":1,"SPD Smith":1,"JM Davison":1,"J Botha":1,"NLTC Perera":1,"DJ Sammy":1,"E Chigumbura":1,"M Mahmudullah":1,"N Islam":1,"AS Hansra":1,"LJ Wright":1,"MH Yardy":1,"AR Cusack":1,"JF Mooney":1,"KJ O'Brien":1,"KJ OBrien":1,"S Tikolo":1,"TM Odoyo":1,"LJ Woodcock":1,"GA Lamb":1,"JW Hastings":1,"RA Cheema":1,"Rizwan Cheema":1,"JC Tredwell":1,"AC Botha":1,"AR White":1,"DT Johnston":1,"JK Kamande":1,"F du Plessis":1,"M Bukhari":1,"Mudassar Bukhari":1,"K Whatham":1,"PW Borren":1};
	var batters={"SR Tendulkar":1,"MEK Hussey":1,"RT Ponting":1,"V Sehwag":1,"HM Amla":1,"MJ Clarke":1,"G Gambhir":1,"DPMD Jayawardene":1,"CL White":1,"AJ Strauss":1,"EJG Morgan":1,"SK Raina":1,"V Kohli":1,"LRPL Taylor":1,"Y Khan":1,"GC Smith":1,"RR Sarwan":1,"S Chanderpaul":1,"CJ Ferguson":1,"T Iqbal":1,"IJL Trott":1,"KP Pietersen":1, "IR Bell":1,"JD Ryder":1,"MJ Guptill":1,"M ul-Haq":1,"JP Duminy":1,"WU Tharanga":1,"BRM Taylor":1,"DJ Hussey":1,"S Nafees":1,"RS Bopara":1,"PR Stirling":1,"JM How":1,"U Akmal":1,"CA Ingram":1,"MN van Wyk":1,"LPC Silva":1,"TT Samaraweera":1,"DM Bravo":1,"I Kayes":1,"M Ashraful":1,"R Hasan":1,"TLW Cooper":1,"KS Williamson":1,"CK Kapugedera":1,"DS Smith":1,"CK Coventry":1,"CR Ervine":1,"J Siddique":1,"R Gunasekera":1,"EC Joyce":1,"WTS Porterfield":1,"AA Obanda":1,"T Mishra":1,"A Shafiq":1,"A Shehzad":1,"V Sibanda":1,"CO Obuya":1,"AN Kervezee":1,"B Zuiderent":1,"ES Szwarczynski":1,"KA Edwards":1,"T Duffin":1,"H Patel":1,"N Kumar":1,"TG Gordon":1,"ZE Surkari":1,"RR Patel":1,"SR Waters":1,"TN de Grooth":1};

	var snamearr = plname.split(" ");
	var snamelen = snamearr.length;
	var sname = snamearr[snamelen-1];
	for (var i=0;i<snamelen-1;i++)
	{
		sname = snamearr[i].charAt(0)+ " " + sname;	
	}
	var category = 'unknown';
	if (keepers[plname] == 1 || keepers[sname] == 1) category='keeper';
	if (bowlers[plname] == 1 || bowlers[sname] == 1) category='bowler';
	if (allrounders[plname] == 1 || allrounders[sname] == 1) category='allrounder';
	if (batters[plname] == 1 || batters[sname] == 1) category='batter';
	return category;

 }
 function calcpoints(playerdetails)
 {
	var keepers={"MS Dhoni":1,"AB de Villiers":1,"KC Sangakkara":1,"BB McCullum":1,"BJ Haddin":1,"K Akmal":1,"T Taibu":1,"TD Paine":1,"M Rahim":1,"MJ Prior":1,"A Bagai":1,"NJ O'Brien":1,"NJ OBrien":1, "DO Obuya":1,"DC Thomas":1,"GC Wilson":1,"MA Ouma":1,"W Barresi":1,"RW Chakabva":1,"AF Buurman":1};
	var bowlers={"M Muralitharan":1,"GP Swann":1,"B Lee":1,"H Singh":1,"Z Khan":1,"Umar Gul":1, "U Gul":1,"DW Steyn":1,"SL Malinga":1,"MG Johnson":1,"A Razzak":1,"JM Anderson":1,"KD Mills":1,"S Akhtar":1,"M Morkel":1,"BAW Mendis":1,"KMDN Kulasekara":1,"SW Tait":1,"A Nehra":1,"MM Patel":1,"S Ajmal":1,"LL Tsotsobe":1,"CRD Fernando":1,"KAJ Roach":1,"JJ Krejza":1,"A Shahzad":1,"PP Chawla":1,"R Ashwin":1,"S Sreesanth":1,"TG Southee":1,"Wahab Riaz":1,"W Riaz":1,"WD Parnell":1,"NO Miller":1,"R Rampaul":1,"P Utseya":1,"RW Price":1,"WB Rankin":1,"PJ Ongondo":1,"HK Bennett":1,"NL McCullum":1,"Abdur Rehman":1,"A Rehman":1,"RJ Peterson":1,"HMRKB Herath":1,"SJ Benn":1,"AG Cremer":1,"CB Mpofu":1,"T Panyangara":1,"N Hossain":1,"R Hossain":1,"S Islam":1,"S Shuvo":1,"CT Tremlett":1,"A van der Merwe":1,"GH Dockrell":1,"NG Jones":1,"JO Ngoche":1,"NN Odhiambo":1,"J Khan":1,"Imran Tahir":1,"MI Tahir":1,"H Baidwan":1,"K Chohan":1,"PM Seelaar":1,"AD Russell":1,"D Bishoo":1,"SW Masakadza":1,"H Osinde":1,"PA Desai":1,"WDB Rao":1,"WD Balaji Rao":1,"E Otieno":1,"SO Ngoche":1,"Adeel Raja":1,"A Raja":1,"BA Westdijk":1,"BP Kruger":1,"BP Loots":1, "SCJ Broad":1};
	var allrounders={"SR Watson":1,"JH Kallis":1,"CH Gayle":1,"S Al Hasan":1,"Y Singh":1,"A Razzaq":1,"Abdur Razzaq":1,"AD Mathews":1,"TM Dilshan":1,"PD Collingwood":1,"DL Vettori":1,"SB Styris":1,"S Afridi":1,"Shahid Afridi":1,"KA Pollard":1,"TT Bresnan":1,"YK Pathan":1,"RN ten Doeschate":1,"JDP Oram":1,"JEC Franklin":1,"M Hafeez":1,"SPD Smith":1,"JM Davison":1,"J Botha":1,"NLTC Perera":1,"DJ Sammy":1,"E Chigumbura":1,"M Mahmudullah":1,"N Islam":1,"AS Hansra":1,"LJ Wright":1,"MH Yardy":1,"AR Cusack":1,"JF Mooney":1,"KJ O'Brien":1,"KJ OBrien":1, "S Tikolo":1,"TM Odoyo":1,"LJ Woodcock":1,"GA Lamb":1,"JW Hastings":1,"RA Cheema":1,"Rizwan Cheema":1,"JC Tredwell":1,"AC Botha":1,"AR White":1,"DT Johnston":1,"JK Kamande":1,"F du Plessis":1,"M Bukhari":1,"Mudassar Bukhari":1,"K Whatham":1,"PW Borren":1};
	var batters={"SR Tendulkar":1,"MEK Hussey":1,"RT Ponting":1,"V Sehwag":1,"HM Amla":1,"MJ Clarke":1,"G Gambhir":1,"DPMD Jayawardene":1,"CL White":1,"AJ Strauss":1,"EJG Morgan":1,"SK Raina":1,"V Kohli":1,"LRPL Taylor":1,"Y Khan":1,"GC Smith":1,"RR Sarwan":1,"S Chanderpaul":1,"CJ Ferguson":1,"T Iqbal":1,"IJL Trott":1,"KP Pietersen":1, "IR Bell":1,"JD Ryder":1,"MJ Guptill":1,"M ul-Haq":1,"JP Duminy":1,"WU Tharanga":1,"BRM Taylor":1,"DJ Hussey":1,"S Nafees":1,"RS Bopara":1,"PR Stirling":1,"JM How":1,"U Akmal":1,"CA Ingram":1,"MN van Wyk":1,"LPC Silva":1,"TT Samaraweera":1,"DM Bravo":1,"I Kayes":1,"M Ashraful":1,"R Hasan":1,"TLW Cooper":1,"KS Williamson":1,"CK Kapugedera":1,"DS Smith":1,"CK Coventry":1,"CR Ervine":1,"J Siddique":1,"R Gunasekera":1,"EC Joyce":1,"WTS Porterfield":1,"AA Obanda":1,"T Mishra":1,"A Shafiq":1,"A Shehzad":1,"V Sibanda":1,"CO Obuya":1,"AN Kervezee":1,"B Zuiderent":1,"ES Szwarczynski":1,"KA Edwards":1,"T Duffin":1,"H Patel":1,"N Kumar":1,"TG Gordon":1,"ZE Surkari":1,"RR Patel":1,"SR Waters":1,"TN de Grooth":1};

	
 	var snamearr = playerdetails.name.split(" ");
	var snamelen = snamearr.length;
	var sname = snamearr[snamelen-1];
	for (var i=0;i<snamelen-1;i++)
	{
		sname = snamearr[i].charAt(0)+ " " + sname;	
	}
	if (keepers[playerdetails.name] == 1 || keepers[sname] == 1) playerdetails.cat='keeper';
	if (bowlers[playerdetails.name] == 1 || bowlers[sname] == 1) playerdetails.cat='bowler';
	if (allrounders[playerdetails.name] == 1 || allrounders[sname] == 1) playerdetails.cat='allrounder';
	if (batters[playerdetails.name] == 1 || batters[sname] == 1) playerdetails.cat='batter';
	if (playerdetails.cat=='undefined') playerdetails.cat='unknown';

	// points from runs
	var score = 0;
	if (typeof playerdetails.runs != 'undefined' && playerdetails.runs != 'norun')
		score = playerdetails.runs;
	else
		score = 0;
	if (playerdetails.cat!='bowler' && typeof playerdetails.runs != 'undefined' && playerdetails.runs == 0) score = score - 20;
	score = score + (6 * playerdetails.sixes);
	if (playerdetails.cat!='bowler' && playerdetails.out==1) score = score - 10;

	if (typeof playerdetails.runs != 'undefined') {
	if (playerdetails.runs>=50 && playerdetails.runs<100) score = score + 15;
	if (playerdetails.runs>=100 && playerdetails.runs<150) score = score + 30;
	if (playerdetails.runs>=150) score = score + 50;

	if (playerdetails.runs > 25) {
		if (playerdetails.srate>=0 && playerdetails.srate<25) score = score - 50;
		if (playerdetails.srate>=25 && playerdetails.srate<50) score = score - 30;
		if (playerdetails.srate>=50 && playerdetails.srate<75) score = score - 15;
		if (playerdetails.srate>=75 && playerdetails.srate<100) score = score + 0;
		if (playerdetails.srate>=100 && playerdetails.srate<125) score = score + 15;
		if (playerdetails.srate>=125 && playerdetails.srate<175) score = score + 30;
		if (playerdetails.srate>=175) score = score + 50;
	}
	}

	if (playerdetails.wickets >= 2 && playerdetails.wickets < 4) score = score + 15;
	if (playerdetails.wickets >= 4 && playerdetails.wickets < 6) score = score + 30;
	if (playerdetails.wickets >= 6) score = score + 50;

	score = playerdetails.wicket_list['nonbowler'] * 30 + score;
	score = playerdetails.wicket_list['bowler'] * 15 + score;

	score = playerdetails.maidens * 6 + score;

	if (playerdetails.overs >= 3) {
		if (playerdetails.economy>=0 && playerdetails.economy<3) score = score + 50;
		if (playerdetails.economy>=3 && playerdetails.economy<4) score = score + 30;
		if (playerdetails.economy>=4 && playerdetails.economy<5) score = score + 15;
		if (playerdetails.economy>=5 && playerdetails.economy<7) score = score + 0;
		if (playerdetails.economy>=7 && playerdetails.economy<8) score = score - 15;
		if (playerdetails.economy>=8 && playerdetails.economy<9) score = score - 30;
		if (playerdetails.economy>=9) score = score - 50;
	}
	
	score = playerdetails.catches * 10 + score;
	score = playerdetails.stumping * 20 + score;
	score = playerdetails.runout_list['direct'] * 20 + score;
	score = playerdetails.runout_list['indirect'] * 10 + score;
	
	if (playerdetails.pom == 1) score += 100;
	playerdetails.points = score;
 }

 function getData(matchnum) {
	var results = document.getElementById('results');
        var api="http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%20%3D%20'http%3A%2F%2Fwww.espncricinfo.com%2Ficc_cricket_worldcup2011%2Fengine%2Fcurrent%2Fmatch%2F"+matchnum+".html%3Fview%3Dscorecard'%20and%20xpath%3D'%2F%2Ftr%5B%40class%3D%22inningsRow%22%5D'&format=json&callback=mycb";

	// alert(api);
	var s = document.createElement('script');
	s.setAttribute('src',api);
	document.getElementsByTagName('head')[0].appendChild(s);
 }

	document.getElementById("matchsearch").onsubmit = function(){
	var matchnum = document.getElementById('query').value;
	getData(matchnum);
	return false;;
 }
</script>
