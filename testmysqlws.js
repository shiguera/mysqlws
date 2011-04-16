/**
 * Test para  mysqlws
 */

window.onload= function() {
	mysql_use('localhost', 'guest', 'guestpass', 'pruebasmysqlws');
	//alert(mysql_host+", "+mysql_user+", "+mysql_pw+", "+mysql_db_name+", ");
	var ar=mysql_select_query("select * from nombres");
	alert(ar);
}