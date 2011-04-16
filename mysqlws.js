var urlMysqlwsphp="../mysqlws.php";
var mysql_db_name ="dbname";

// Acceso a mysql
function mysql_use( dbname) {
	mysql_db_name = dbname; 
}
function mysql_select_query(query) {
	var c="selectQuery";
	var xmlresp = doRequest(c, query);
	return responseContent(xmlresp);
}
function mysql_update_query(query) {
	var c="updateQuery";
	var xmlresp = doRequest(c, query);
	return responseContent(xmlresp);	
}
function mysql_col_names(tableName) {
	var c="getColNames";
	var xmlresp = doRequest(c, tableName);
	return responseContent(xmlresp);
}
// ---------------------------
// Utilidades DOM-HTML
// ---------------------------
function $(elementId) {
	return document.getElementById(elementId);
}
function setElementContent( element, content) {
	// Asigna el valor de content a la propiedad
	// innerHTML del element. El element puede ser una
	// referencia o un String con el id
	var domElement=null;
	if(typeof element == 'string') {
		domElement = document.getElementById(element);
	}
	if (domElement != null) {
		if ( document.all ) { 
			domElement.innerHTML = content;
		}
		if ( document.getElementById && !document.all ) { 
			domElement.innerHTML=content; 
		}
	}
}
function getDocHeight() {
    var D = document;
    return Math.max(
        Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
        Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
        Math.max(D.body.clientHeight, D.documentElement.clientHeight)
    );
}
function setElementHeight(obj, h) {
	if(typeof obj == 'string') {
		obj = $(obj);
	}	
	obj.style.height = h +'px';
}
function getElementHeight( obj) {
	var divHeight = 0;
	if(typeof obj == 'string') {
		obj = $(obj);
	}
	if(obj.offsetHeight) {
		divHeight=obj.offsetHeight;
	} else if(obj.style.pixelHeight){
		divHeight=obj.style.pixelHeight;
	}
	return divHeight;
}
function setElementWidth(obj, w) {
	if(typeof obj == 'string') {
		obj = $(obj);
	}	
	obj.style.width = w +'px';
}
function getElementWidth( obj) {
	var divWidth = 0;
	if(typeof obj == 'string') {
		obj = $(obj);
	}
	if(obj.offsetWidth) {
		divWidth=obj.offsetWidth;
	} else if(obj.style.pixelWidth){
		divWidth=obj.style.pixelWidth;
	}
	return divWidth;
}
function getWindowHeight() {
	var h = 0;
	if (typeof window.innerWidth != 'undefined') {
		h=window.innerHeight;
	} else if (typeof document.documentElement != 'undefined'
			&& typeof document.documentElement.clientWidth != 'undefined'
			&& document.documentElement.clientWidth != 0) {
		h = document.documentElement.clientHeight;
	} else {
		h = document.getElementsByTagName('body')[0].clientHeight;
	}
	return h;
}
function getWindowWidth() {  
	var w = 0;
	if (typeof window.innerWidth != 'undefined') {
		w = window.innerWidth;
	} else if (typeof document.documentElement != 'undefined'
			&& typeof document.documentElement.clientWidth != 'undefined'
			&& document.documentElement.clientWidth != 0) {
		w = document.documentElement.clientWidth;
	} else {
		w = document.getElementsByTagName('body')[0].clientWidth;
	}
	return w;  
}  
function getTamanoVentana() {
	var Tamanyo = [ 0, 0 ];
	if (typeof window.innerWidth != 'undefined') {
		Tamanyo = [ window.innerWidth, window.innerHeight ];
	} else if (typeof document.documentElement != 'undefined'
			&& typeof document.documentElement.clientWidth != 'undefined'
			&& document.documentElement.clientWidth != 0) {
		Tamanyo = [ document.documentElement.clientWidth,
				document.documentElement.clientHeight ];
	} else {
		Tamanyo = [ document.getElementsByTagName('body')[0].clientWidth,
				document.getElementsByTagName('body')[0].clientHeight ];
	}
	return Tamanyo;
}  
function createTableFromArray(arrayDatos, arrayCabeceras) {
	// Devuelve una <table>....</table> con los datos del arrayDatos
	// Si se incluye el parametro arrayCabeceras se inserta como fila 1
	// Se puede omitir el parametro arrayCabeceras
	// Devuelve : un String con la <table>...</table>
	var array = arrayDatos;
	if(arrayCabeceras != null) {
		if(arrayCabeceras.length == arrayDatos[0].length) {
			array.unshift(new Array());
			array[0]=arrayCabeceras;
		}
	}
	// Devuelve un array <table>...</table>
	var cad="";
	if(array == null ){
		return cad;
	}
	cad ="<table border='1'>";
	var nf, nc;
	if (array[0][0] != null) {
		// Es de dos dimensiones
		nf = array.length;
		nc = array[0].length;
		for(i=0; i< nf;  i++) {
			cad += "<tr>";
			for(j=0; j<nc; j++) {
				cad += "<td>"+array[i][j]+"</td>";
			}
			cad += "</tr>";
		}
	} else if (array[0] != null ){
		nf = 1;
		nc = array.length;
		cad += "<tr>";
		for(j=0; j<nc; j++) {
			cad += "<td>"+array[j]+"</td>";
		}
		cad += "</tr>";
	} else {
		nf = 1;
		nc = 1;
		cad += "<tr>";
		cad += "<td>"+array+"</td>";
		cad += "</tr>";
	}
	cad += "</table>";
	return cad;
}
/*
 * Utilidades de fechas
 */
function parseFechaUTC(cadfecha, cadhora) {
	// Parametros :
	//		cadfecha = "2010-12-21"
	// 		cadhora = "12:00:00" (se puede omitir)
	// Devuelve :
	// 		objeto Date
	var dt = new Date(); 
	var y = parseInt(cadfecha.substr(0,4),10);
	var m = parseInt(cadfecha.substr(5,2),10)-1;
	var d = parseInt(cadfecha.substr(8,2),10);
	dt.setUTCFullYear(y,m,d);
	var h = 0;
	var min = 0;
	var s = 0;
	if (cadhora != null) {
		h = parseInt(cadhora.substr(0,2),10);
		min = parseInt(cadhora.substr(3,2),10);
		s = parseInt(cadhora.substr(6,2),10);
	}
	dt.setUTCHours(h, min, s, 0);
	return dt;
}
function intToString(number, digits) {
	// Convierte en cadena un numero entero
	// Rellena con ceros a la izda hasta numero de digitos
	var cad = number.toString();
	if(cad.length < digits) {
		var dif = digits - cad.length;
		var ceros ="";
		for (var i=0; i<dif; i++) {
			ceros += "0";
		}
		cad = ceros + cad;
	}
	return cad;
}
function getCadFechaUTCFromJSDate(date) {
	var y = date.getUTCFullYear();
	var m = intToString(date.getUTCMonth()+1,2);
	var d = intToString(date.getUTCDate(),2);
	var cad = y +"-"+ m +"-"+ d;
	return cad;
}
function getCadHoraUTCFromJSDate(date) {
	var h = intToString(date.getUTCHours(),2);
	var m = intToString(date.getUTCMinutes(),2);
	var s = intToString(date.getUTCSeconds(),2);
	var cad = h +":"+ m +":"+ s;
	return cad;
}
function calculaVectorDuracion(dtinicio,dtactual) {
	var horas = 0;
	var min = 0;
	var sg = (dtactual.getTime() - dtinicio.getTime())/1000;
	if(sg>59) {
		min = Math.floor(sg/60);
		sg = sg%60;
		if(min>59) {
			horas = Math.floor(min/60);
			min = min%60;
		}
	}	
	return [horas, min, sg];
}

// ----------------------------
// xmlresponse
// ----------------------------
function responseCode(xmlresp) {
	var lstCode = xmlresp.getElementsByTagName("statusCode");
	var cod = lstCode[0].childNodes[0].nodeValue;
	return cod;
}
function responseText(xmlresp) {
	var lstDesc = xmlresp.getElementsByTagName("statusText");
	var desc = lstDesc[0].childNodes[0].nodeValue;
	return desc;
}
function responseContent(xmlresp) {
	// Devuelve un array con el contenido.
	// El array puede ser multidimensional
	if(xmlresp == null) {
		return null;
	}
	var arResp = new Array();
	var lstCtnt = xmlresp.getElementsByTagName("content");
	var childs = lstCtnt[0].childNodes[0];
	if ((childs != null) && (childs.nodeType == 1)) {
		// Contenido elementos <item>
		var lstItem = lstCtnt[0].getElementsByTagName("item");
		var numItem = lstItem.length;
		for (i = 0; i < numItem; i++) {
			var ar = lstItem[i].childNodes[0].nodeValue.split(",");
			arResp.push(ar);
		}
	} else if ((childs != null) && (childs.nodeType == 3)) {
		// Contenido una cadena separada por comas
		var ctnt = lstCtnt[0].childNodes[0].nodeValue;
		arResp = ctnt.split(",");
	} else {
		arResp = null;
	}
	return arResp;
}
function alertXmlResp(responsexml) {
	var code = responseCode(responsexml);
	var txt = responseText(responsexml);
	var ctnt = responseContent(responsexml);
	alert(code + ", " + txt + "\n" + ctnt);
}

// ---------------------------------
// AJAX Request
// ---------------------------------
function doRequest(comm, pars) {
	var req = new ajaxRequest();
	if (pars == "") {
		pars = "1";
	}
	var url = urlMysqlwsphp+"?db="+mysql_db_name+"&c=" + comm + "&p=" + pars;
	req.open("GET", url, false);
	req.send(null);
	return req.responseXML;
}
function loadXmlDoc(name) {
	var req = new ajaxRequest();
	req.open("GET", name, false);
	req.send(null);
	return req.responseXML;
}
function loadXMLString(txt) {
	if (window.DOMParser) {
		parser = new DOMParser();
		xmlDoc = parser.parseFromString(txt, "text/xml");
	} else { // Internet Explorer
		xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async = "false";
		xmlDoc.loadXML(txt);
	}
	return xmlDoc;
}
function ajaxRequest() {
	try {
		var request = new XMLHttpRequest();
	} catch (e1) {
		try {
			request = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e2) {
			try {
				request = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e3) {
				request = false;
			}
		}
	}
	return request;
}
