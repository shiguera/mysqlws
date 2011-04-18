<?php
/*
* mysqlws.php Componente del servidor.
*             Recibe las llamadas desde la librería Javascript mysqlws.js
*             Las llamadas son de la forma:
*                 mysqlws.php?c=comando&p=parameters&host=host&db=db&user=user&pw=pw
*             
*/
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); // Date in the past
header('Content-Type: text/xml');
header("Content-Transfer-Encoding: binary");

// Estas variables toman valor a través de las variables javascript
// correspondientes que se encuentran en mysqlws.js y que se establecen
// llamando al método javascript use(host,user,pw,db)
$host="localhost";
$user="guest";
$pw="guestpass";
$db="pruebasmysqlws";

		

if(isset($_POST['c']) and isset($_POST['p'])) {

	$command=$_POST['c'];
	$params = $_POST['p'];
	if(isset($_POST['host'])) {
		$host = $_POST['host'];
	}
	if(isset($_POST['user'])) {
		$user = $_POST['user'];
	}
	if(isset($_POST['pw'])) {
		$pw = $_POST['pw'];
	}
	if(isset($_POST['db'])) {
		$db = $_POST['db'];
	}

	
	$resp = processcommand($command, $params);
} else {
	$resp=createResponse(0, "ERROR", "Parametros HTTP incorrectos");
}
echo $resp;
return;


function processCommand($command, $params) {
	// processCommand
	// procesa un comando válido recibido en la llamada a la página. 
	// Es llamado desde el flujo principal
	// Distribuye el trabajo a la rutina correspondiente y
	// devuelve una respuesta en formato xml

	// Primero descomponer la cadena de params en un array
	//$arrParams = createArrayFromCadParams($params);
	
	// Declarar la respuesta
	$respxml=null;
	
	// Derivar a la rutina adecuada
	if(strcmp("updateQuery",$command)== 0) {
		$respxml=updateQuery($params);
	} else if (strcmp("selectQuery",$command)==0) {
		$respxml=selectQuery($params); 
	} else if (strcmp("getColNames",$command)==0) {
		$respxml=getColNames($params); 
	} else {
		$respxml=createResponse(0,"ERROR","El comando no existe");
	}

	return $respxml;
}


function updateQuery($query) {
// Ejecuta un comando tipo SELECT en la base de datos
// $query = String con el comando	
// devuelve: xmlresponse con el resultado

	GLOBAL $host, $user, $pw, $db;

	// Abrir la conexión con mysql
	$conn = opendb($host, $user, $pw, $db);
	if(!$conn) {
		return createResponse(-2,"ERROR","Error de conexión.-$conn");
	}

	
	// Realizar la consulta a la B.D.
	$result=mysql_query($query, $conn);
	
	//echo "Result:". $result."<br/>";
	//$nr = mysql_num_rows($result);
	//echo "NumRows: ".$nr."<br/>";
	$ar = mysql_affected_rows();
	//echo "AffRows: ".$ar."<br/>";
	//$nc = mysql_num_fields($result);
	//echo "NumFields: ".$nc."<br/>";
	
	//mysql_free_result($result);
	$cod = 0;
	$text ="ERROR";
	$desc ="-1";
	
	if($result == true) {
		$cod = 0;
		$text ="OK";
		$desc =$ar;	
	}
	$response = createResponse($cod,$text,$desc);

	// Cerrar la conexión
	closedb($conn);

	// Devolver el resultado
	return $response;
};

function selectQuery($query) {
// Ejecuta un comando tipo SELECT en la base de datos
// query = String con el comando	
// devuelve: xmlresponse con el resultado
	
	GLOBAL $host, $user, $pw, $db;
	
	// Abrir la conexión con mysql
	
	
	$conn = opendb($host, $user, $pw, $db);
	
	if(!$conn) {	
		return createResponse(-2,"ERROR","Error de conexión.-$conn");
	}
	
	// Realizar la consulta a la B.D.
	$result=mysql_query($query, $conn);
	
	if ($result) {
		$nc = mysql_num_fields($result);
		
		$cad="";
		$n = 0;
		while( $row = mysql_fetch_row($result)) {
			
			$cad .= "<item>";			
			
			for($i=0; $i<$nc; ++$i) {
				$cad .= utf8_encode($row[$i]);
				
				if($i<$nc-1) {
					$cad .= ",";
				}
			}
			
			$cad .= "</item>";
			
		}
						
		mysql_free_result($result);
			
		$response = createResponse(1,"OK",$cad);		
		
	} else {
		$response = createResponse(0, "ERROR", "Error en la llamada SQL"); 
	}
	// Cerrar la conexión
	closedb($conn);
		
	// Devolver el resultado
	return $response;
};

function getColNames($nombreTabla) {
	// Devuelve un array con los nombres de las columnas de la 
	// tabla pasada como argumento
	// Si error devuelve array nulo;	
	
	// Establecer las variables globales
	GLOBAL $host, $user, $pw, $db;
	
	// Abrir la conexión con mysql
	$conn = opendb($host, $user, $pw, $db);
	if(!$conn) {
		return createResponse(-2,"ERROR","Error de conexión.-$conn");
	}
	
	// Realizar la consulta a la B.D.
	$query = "SELECT * FROM $nombreTabla";
	$result=mysql_query($query, $conn);
	if ($result) {
	
		$numcols = mysql_num_fields($result);
	
		$resp = "";
		for($i=0; $i< $numcols; $i++) {
			$resp .= mysql_field_name($result, $i);
			if($i < $numcols-1) {
				$resp .= ",";
			}	
		}
		mysql_free_result($result);
		$response = createResponse(1, "OK", $resp);
		
	} else {
		$response = createResponse(0, "ERROR", "Error en acceso SQL");
		
	}
	
	
	// Cerrar la conexión
	closedb($conn);

	// Devolver el resultado
	return $response;
};

function opendb($host, $user, $pw, $db) {
	// opendb
	// Establece conexión con el servidor $host y hace un USE de la base de datos $db
	// Parametros:
	//    $host
	//    $user
	//    $pw : password
	//    $db : Base de datos sobre la que se hará el USE 
	// Devuelve:
	//    Referencia a la conexión abierta o null si hay errores
	//
	$conn = mysql_connect($host, $user, $pw);
	if(!$conn) {
		return null;
	}
	//echo "connected<br/>";
	$resp = mysql_select_db($db, $conn);
	if($resp != true) {
		return null;
	}
	//echo "used<br/>";
	return $conn;
};

function closedb($conn) {
	// closedb()
	// Cierra la conexión con la base de datos
	// Parámetros:
	//	   $conn Referencia al recurso de la conexión con la B.D.
	// Devuelve
	//	   void
	if(!$conn) {
		return;
	}
	mysql_close($conn);
};

function createArrayFromCadParams($cadParams) {
	// Recibe como entrada la cadena de parametros separados por comas
	// y devuelve un Array con los parametros separados
	$arrayParams=array();
	if (strlen($cadParams)!=0) {
		if(strpos($cadParams, ',')>0) {
			$arrayParams = 	explode(',',$cadParams);
		} else {
			$arrayParams[0]=$cadParams;
		}
	}
	return $arrayParams;
};

function createResponse($code, $text, $content) {
	// createResponse($code, $descrip, $content)
	// 		Genera un documento XML del tipo <regataResponse>.
	// 		(Ver su constitución en la documentación del programa)
	// Parámetros:
	//
	// Devuelve:
	//
	$doc=new DOMDocument('1.0');
	$cadxml="<wsResponse>";
	$cadxml=$cadxml."<statusCode>$code</statusCode>";
	$cadxml=$cadxml."<statusText>$text</statusText>";
	$cadxml=$cadxml."<content>$content</content>;";
	$cadxml=$cadxml."</wsResponse>";
	$doc->loadXML($cadxml);
	return $doc->saveXML();
	
};

function createResponseFromCode($code) {
	// createResponseFromCode($code)
	// 		Genera un documento XML del tipo <wsResponse>.
	// 		OK para códigos >0 y ERROR para codigos <= 0		
	// (Ver su constitución en la documentación del programa)
	// Parámetros:
	//
	// Devuelve:
	//
	$text="ERROR";
	$content = "ERROR";
	if($code>0) {
		$text="OK";
		$content ="OK";
	}
	$doc=new DOMDocument('1.0');
	$cadxml="<wsResponse>";
	$cadxml=$cadxml."<statusCode>$code</statusCode>";
	$cadxml=$cadxml."<statusText>$text</statusText>";
	$cadxml=$cadxml."<content>$content</content>";
	$cadxml=$cadxml."</wsResponse>";
	$doc->loadXML($cadxml);
	return $doc->saveXML();
};
?>