<!--#include virtual="/raiz/Syn_Conexion/conexion0.asp" -->
<%

dim SQL, strJson, strhtml, n
dim vCodEmpresa, vRol, vIp
dim vCodRegional, vCiclo, vRuta, vPeriodo

vCodEmpresa = Request("empresa")
vRol = Request("rol")
vIp = Request ("Ip")
vPeriodo = Request ("p_periodo")
vCodRegional = Request ("p_cod_regional")
vCiclo = Request ("p_ciclo")
vRuta = Request ("p_ruta")

vParametro = Request("p_parametro")

'~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~* 
Sub Exec_SQL(p_bandera, p_mysql)

    depura2("SQL: " & p_bandera & vbCrLf & p_mysql)
    db.execute p_mysql
    
End Sub

'~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~* 
function fn_combo(p_sql)
	
	depura2("fn_combo: "&p_sql)
	strhtml = ""
	set rsdav = Server.CreateObject("ADODB.Recordset")
	rsdav.Open p_sql,db	
	
	if not (rsdav.EOF) then
		strhtml = "<option value =''></option>"
	end if
	
	do while not (rsdav.EOF)

		strhtml = strhtml & "<option value='" & rsdav.Fields(0) & "'"
		strhtml = strhtml & " >" & rsdav.Fields(1) & "</option>"
		
		rsdav.Movenext
	loop
	
	rsdav.Close()
	Set rsdav = Nothing					
		
	fn_combo = strhtml

end function

'#####################################################################################
select case Request("func")	
	
'~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*		
case "fn_grid_principal"

	Response.ContentType = "application/json;"
	
	SQL = "select "
	SQL = SQL & "'""C1"":""'||TO_CHAR(LEC.PERIODO,'dd/mm/yyyy')||'""', "
	SQL = SQL & "'""C2"":""'||LEC.REGIONAL||'""', "
	SQL = SQL & "'""C3"":""'||LEC.CICLO||'""', "
	SQL = SQL & "'""C4"":""'||CON.NOMBRE_EMPRESA||'""', "
	SQL = SQL & "'""C5"":""'||LEC.SEC_CARGA||'""', "
	SQL = SQL & "'""C6"":""'||TO_CHAR(LEC.FEC_INGRESO,'dd/mm/yyyy')||'""', "
	SQL = SQL & "'""C7"":""'||TO_CHAR(LEC.FEC_APRUEBA,'dd/mm/yyyy')||'""', "
	SQL = SQL & "'""C8"":""'||LEC.ROL_APRUEBA||'""',"
	SQL = SQL & "'""C9"":""'||TO_CHAR(LEC.FEC_PROCESO_CARGA,'dd/mm/yyyy')||'""', "
	SQL = SQL & "'""C10"":""'||LEC.TOTAL_CLIENTES||'""', "
	SQL = SQL & "'""C11"":""'||LEC.TOTAL_LEIDOS||'""', "
	SQL = SQL & "'""C12"":""'||(NVL(LEC.TOTAL_LEIDOS,0) - NVL(LEC.TOTAL_CLI_ANOMALIAS,0))||'""', " 'TOTAL_CORRECTOS
	SQL = SQL & "'""C13"":""'||LEC.TOTAL_CLI_ANOMALIAS||'""', "
	SQL = SQL & "'""C14"":""'||(NVL(LEC.TOTAL_CLIENTES,0) - NVL(LEC.TOTAL_LEIDOS,0))||'""' "       'TOTAL_SIN_LEER
	SQL1 = SQL1 & "  FROM LEC_CARGA LEC, LEC_EMPRESA_CONTRATISTA CON"
	SQL1 = SQL1 & " WHERE  LEC.COD_CONTRATISTA = CON.COD_CONTRATISTA"
	SQL1 = SQL1 & "  AND LEC.PERIODO = TO_DATE ('" & vPeriodo & "', 'dd/mm/yyyy')"
	if vCodRegional <> "" then
		SQL1 = SQL1 & " AND LEC.REGIONAL = '" & vCodRegional & "' "
	end if	
	if vCiclo <> "" then
		SQL1 = SQL1 & " AND LEC.CICLO = '" & vCiclo & "' "
	end if	
	SQL1 = SQL1 & "  AND LEC.ESTADO_APRUEBA = 'A'"
	SQL1 = SQL1 & "  AND LEC.ESTADO_PROCESO = 'S'"
	SQL1 = SQL1 & "  AND (LEC.COD_CONTRATISTA, LEC.SEC_CARGA) NOT IN"
	SQL1 = SQL1 & "  (SELECT nvl(C05.COD_CONTRATISTA,0), nvl(C05.SEC_CARGA, 0) "
	SQL1 = SQL1 & "  FROM CIASSB0005 C05 "
	SQL1 = SQL1 & "  WHERE C05.CEN_OPERATIVO = LEC.REGIONAL AND C05.RECORR1 = LEC.CICLO) " 
	
	SQL = SQL & SQL1
	depura("fn_grid_principal...:" & SQL)

	n = 0
	strJson=""
	set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open SQL, db
	
	do while not rs.eof						
		strJson = strJson &  rs.GetString(,100,",","},"&vbCrLf&"{","")		
		n=n+1
	loop
	
	rs.Close()
	Set rs = Nothing
	
	if n>0 then
		strJson=strJson & "?"
		strJson=replace(strJson,","&vbCrLf&"{?","")
		strJson="{"&strJson
	end if

	SQL = "Select count(*) "
	SQL = SQL & SQL1
	depura("fn_cantidad...:" & SQL)
	
	set rsdav = Server.CreateObject("ADODB.Recordset")
	
	rsdav.Open SQL,db
	
	n = ""
	if not(rsdav.EOF) then
		n = rsdav.Fields(0)
	end if
	
	rsdav.Close()
	Set rsdav = Nothing		
	
	SQL = "" 
	SQL = SQL & "SELECT TO_CHAR(LEC.PERIODO,'dd/mm/yyyy'),"
	SQL = SQL & " LEC.REGIONAL,"
	SQL = SQL & " LEC.CICLO,"
	SQL = SQL & " CON.NOMBRE_EMPRESA,"
	SQL = SQL & " LEC.SEC_CARGA,"
	SQL = SQL & " TO_CHAR(LEC.FEC_INGRESO,'dd/mm/yyyy'),"
	SQL = SQL & " TO_CHAR(LEC.FEC_APRUEBA,'dd/mm/yyyy'),"
	SQL = SQL & " LEC.ROL_APRUEBA,"
	SQL = SQL & " TO_CHAR(LEC.FEC_PROCESO_CARGA,'dd/mm/yyyy'),"
	SQL = SQL & " LEC.TOTAL_CLIENTES,"
	SQL = SQL & " LEC.TOTAL_LEIDOS,"
	SQL = SQL & " (NVL(LEC.TOTAL_LEIDOS,0)-NVL(LEC.TOTAL_CLI_ANOMALIAS,0)) , "
	SQL = SQL & " LEC.TOTAL_CLI_ANOMALIAS,"
	SQL = SQL & " (NVL(LEC.TOTAL_CLIENTES,0)-NVL(LEC.TOTAL_LEIDOS,0)) "
	SQL = SQL & SQL1
	
	depura("fn_grid_principal excel...:" & SQL)

%>
{		
	"data": [<%=strJson%>],
	"sql":"<%=SQL%>",
	"totalRecords":<%=n%>
}
<%

	
'~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*		
case "fn_grid_dos"

	Response.ContentType = "application/json;"
	
	SQL = "select "
	SQL = SQL & "'""C1"":""'||TO_CHAR (n45.fec_proceso, 'dd/mm/yyyy')||'""', "
	SQL = SQL & "'""C2"":""'||n45.cen_operativo||'""', "
	SQL = SQL & "'""C3"":""'||n45.recorr1||'""', "
	SQL = SQL & "'""C4"":""'||n45.recorr2||'""', "
	SQL = SQL & "'""C5"":""'||SUM (1)||'""', "
	SQL = SQL & "'""C6"":""'||SUM (DECODE (n46.cod_contratista, NULL, 0, 1))||'""', "
	SQL = SQL & "'""C7"":""'||SUM (DECODE (n46.cod_contratista, NULL, 0, (DECODE (n45.clave_facturacion, 'M', 1, 'R', 1, 0))))||'""', "
	SQL = SQL & "'""C8"":""'||SUM (DECODE (n46.cod_contratista, NULL, (DECODE (n45.clave_facturacion, 'M', 1, 'R', 1, 0)), 0))||'""',"
	SQL = SQL & "'""C9"":""'||(SUM (DECODE (n46.cod_contratista, NULL, 0, (DECODE (n45.clave_facturacion, 'M', 1, 'R', 1, 0)))) + SUM (DECODE (n46.cod_contratista, NULL, (DECODE (n45.clave_facturacion, 'M', 1, 'R', 1, 0)), 0)))||'""', "
	SQL = SQL & "'""C10"":""'||ROUND ( "
	SQL = SQL & " (SUM (DECODE (n46.cod_contratista, NULL, 0, (DECODE (n45.clave_facturacion, 'M', 1, 'R', 1, 0)))) + SUM (DECODE (n46.cod_contratista, NULL, (DECODE (n45.clave_facturacion, 'M', 1, 'R', 1, 0)), 0))) "
	SQL = SQL & " / SUM (1) * 100,0)||'%""' "
	''%'
	SQL1 = SQL1 & " FROM   nucssb0045 n45, nucssb0046 n46 "
	SQL1 = SQL1 & " where n45.cod_empresa=1 "
	SQL1 = SQL1 & " and n45.fec_proceso=to_date('"& vPeriodo &"','dd/mm/yyyy') "
	SQL1 = SQL1 & " and n45.cen_operativo='"& vCodRegional &"' "
	SQL1 = SQL1 & " and n45.recorr1='"& vCiclo &"' "
	SQL1 = SQL1 & " and nvl(n45.cor_facturacion,0)>0 "
	SQL1 = SQL1 & " and nvl(n45.cor_refacturacion,0)=0 "
	SQL1 = SQL1 & " and n46.nro_suministro=n45.nro_suministro "
	SQL1 = SQL1 & " and n46.cor_consumo=n45.cor_consumo "
	SQL1 = SQL1 & " and n46.cod_empresa=n45.cod_empresa "
	SQL1 = SQL1 & " and n46.pos_secuencia=1 "
	SQL1 = SQL1 & " GROUP BY to_char(n45.fec_proceso,'dd/mm/yyyy'),n45.cen_operativo, n45.recorr1, n45.recorr2 "
	SQL1 = SQL1 & " order by 4 asc "
	
	SQL = SQL & SQL1
	depura("fn_grid_dos...:" & SQL)

	n = 0
	strJson=""
	set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open SQL, db
	
	do while not rs.eof						
		strJson = strJson &  rs.GetString(,100,",","},"&vbCrLf&"{","")		
		n=n+1
	loop
	
	rs.Close()
	Set rs = Nothing
	
	if n>0 then
		strJson=strJson & "?"
		strJson=replace(strJson,","&vbCrLf&"{?","")
		strJson="{"&strJson
	end if
	
	SQL = "" 
	SQL = "SELECT   TO_CHAR (n45.fec_proceso, 'dd/mm/yyyy'), "
	SQL = SQL & " n45.cen_operativo, "
	SQL = SQL & " n45.recorr1, "
	SQL = SQL & " n45.recorr2, "
	SQL = SQL & " SUM (1), "
	SQL = SQL & " SUM (DECODE (n46.cod_contratista, NULL, 0, 1)), " 'Reportados por contratista
	SQL = SQL & " SUM (DECODE (n46.cod_contratista, NULL, 0, (DECODE (n45.clave_facturacion, 'M', 1, 'R', 1, 0)))), " 'Medidos por carga
	SQL = SQL & " SUM (DECODE (n46.cod_contratista, NULL, (DECODE (n45.clave_facturacion, 'M', 1, 'R', 1, 0)), 0)), "	'Medidos por Captura
	SQL = SQL & " (SUM (DECODE (n46.cod_contratista, NULL, 0, (DECODE (n45.clave_facturacion, 'M', 1, 'R', 1, 0)))) + SUM (DECODE (n46.cod_contratista, NULL, (DECODE (n45.clave_facturacion, 'M', 1, 'R', 1, 0)), 0))), " 'Facturados con medicion
	SQL = SQL & " ROUND ( "
	SQL = SQL & " (SUM (DECODE (n46.cod_contratista, NULL, 0, (DECODE (n45.clave_facturacion, 'M', 1, 'R', 1, 0)))) + SUM (DECODE (n46.cod_contratista, NULL, (DECODE (n45.clave_facturacion, 'M', 1, 'R', 1, 0)), 0))) "
	SQL = SQL & " / SUM (1) * 100,0) "
	SQL = SQL & " || '%' "'facturados con medicion
	SQL = SQL & SQL1
	
	depura("fn_grid_dos excel...:" & SQL)

%>
{		
	"data": [<%=strJson%>],
	"sql":"<%=SQL%>",
	"totalRecords":<%=n%>
}
<%

'~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*		
case "fn_grid_tres"

	Response.ContentType = "application/json;"	
	
	SQL = "select "
	SQL = SQL & "'""C1"":""'||n45.cen_operativo||'""', "
	SQL = SQL & "'""C2"":""'||n45.recorr1||'""', "
	SQL = SQL & "'""C3"":""'||n46a.cod_contratista || nvl('-' || e.nombre_empresa,'')||'""', "
	SQL = SQL & "'""C4"":""'||n46a.sec_carga||'""', "
	SQL = SQL & "'""C5"":""'||n45.nro_suministro||'""', "
	SQL = SQL & "'""C6"":""'||n46a.nro_aparato||'""', "
	SQL = SQL & "'""C7"":""'||n46a.marca_aparato||'""', "
	SQL = SQL & "'""C8"":""'||(select   n11.valor2 "
	Sql = Sql & "               from   nucssb0011 n11 "
    Sql = Sql & "              where   n11.nomtabla = 'TIPOMED' and n11.codigo = n46a.tip_medida)||'""',"
	SQL = SQL & "'""C9"":""'||n45.clave_facturacion||'""', "                   'tipo_facturacion
	SQL = SQL & "'""C10"":""'||n46a.clave_terreno|| '-' || nvl(ct.descripcion,'Desconocida')||'""', "  'clave_terreno
	SQL = SQL & "'""C11"":""'||n45.clave_lectura || '-' || nvl(cl.descripcion,'Desconocida')||'""', "  'clave_lectura
	SQL = SQL & "'""C12"":""'||n46a.lectura_terreno||'""', "          'lec1
	SQL = SQL & "'""C13"":""'||nvl (n46b.lectura_terreno, 0)||'""' "  'lec2
	SQL1 = SQL1 & "       from   nucssb0045 n45, nucssb0046 n46a, nucssb0046 n46b, nucssb0080 cl, nucssb0080 ct, lec_empresa_contratista e "
	SQL1 = SQL1 & "       where       n45.fec_proceso = to_date ('" & vPeriodo & "', 'dd/mm/yyyy') "
    SQL1 = SQL1 & "            and n45.cen_operativo = '" & vCodRegional & "' "
    SQL1 = SQL1 & "            and n45.recorr1 = '" & vCiclo & "' "
    SQL1 = SQL1 & "            and n45.recorr2 = '" & vRuta & "' "
    SQL1 = SQL1 & "            and nvl (n45.cor_refacturacion, 0) = 0 "
    SQL1 = SQL1 & "            and nvl (n45.cor_consumo, 0) > 0 "
    SQL1 = SQL1 & "            and cl.cod_empresa(+)=n45.cod_empresa "
    SQL1 = SQL1 & "            and cl.clave_lectura(+)=n45.clave_lectura "
    SQL1 = SQL1 & "            and n46a.cod_empresa = n45.cod_empresa  "
    SQL1 = SQL1 & "            and n46a.nro_suministro = n45.nro_suministro "
    SQL1 = SQL1 & "            and n46a.cor_consumo = n45.cor_consumo "
    SQL1 = SQL1 & "            and n46a.pos_secuencia = 1 "
    SQL1 = SQL1 & "            and n46a.cod_contratista = e.cod_contratista(+)"
    SQL1 = SQL1 & "            and ct.cod_empresa(+)=n46a.cod_empresa "
    SQL1 = SQL1 & "            and ct.clave_lectura(+)=n46a.clave_terreno "
    SQL1 = SQL1 & "            and n46b.cod_empresa(+) = n45.cod_empresa "
    SQL1 = SQL1 & "            and n46b.nro_suministro(+) = n45.nro_suministro "
    SQL1 = SQL1 & "            and n46b.cor_consumo(+) = n45.cor_consumo "
    SQL1 = SQL1 & "            and n46b.pos_secuencia(+) = 2 "
	
	SQL = SQL & SQL1
	depura("fn_grid_tres...:" & SQL)

	n = 0
	strJson=""
	set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open SQL, db
	
	do while not rs.eof						
		strJson = strJson &  rs.GetString(,100,",","},"&vbCrLf&"{","")		
		n=n+1
	loop
	
	rs.Close()
	Set rs = Nothing
	
	if n>0 then
		strJson=strJson & "?"
		strJson=replace(strJson,","&vbCrLf&"{?","")
		strJson="{"&strJson
	end if
	
	SQL = "" 
	SQL = SQL & "       select   n45.cen_operativo regional, "
    SQL = SQL & "            n45.recorr1 ciclo, "
    SQL = SQL & "            n46a.cod_contratista || nvl('-' || e.nombre_empresa,'') , "
    SQL = SQL & "            n46a.sec_carga, "
    SQL = SQL & "            n45.nro_suministro, "
    SQL = SQL & "            n46a.nro_aparato, "
    SQL = SQL & "            n46a.marca_aparato, "
    SQL = SQL & "           (select   n11.valor2 "
    SQL = SQL & "               from   nucssb0011 n11 "
    SQL = SQL & "              where   n11.nomtabla = 'TIPOMED' and n11.codigo = n46a.tip_medida) "
    SQL = SQL & "               medida, "
    SQL = SQL & "            n45.clave_facturacion tipo_facturacion , "
    SQL = SQL & "            n46a.clave_terreno|| '-' || nvl(ct.descripcion,'Desconocida') clave_terreno, "
	SQL = SQL & "            n45.clave_lectura || '-' || nvl(cl.descripcion,'Desconocida') clave_lectura, "
    SQL = SQL & "            n46a.lectura_terreno lec1, "
    SQL = SQL & "            nvl (n46b.lectura_terreno, 0) lec2 "
	SQL = SQL & SQL1
	
	depura("fn_grid_tres excel...:" & SQL)

%>
{		
	"data": [<%=strJson%>],
	"sql":"<%=SQL%>",
	"totalRecords":<%=n%>
}
<%

'~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
case "fn_periodo"
	
	SQL = "select codigo, valor from ( "
	SQL = SQL & " SELECT DISTINCT TO_CHAR(LEC.PERIODO, 'dd/mm/yyyy') codigo, TO_CHAR(LEC.PERIODO, 'dd/mm/yyyy') valor "
	SQL = SQL & " FROM LEC_CARGA LEC, FACSSB0008 FAC "
	SQL = SQL & " WHERE LEC.PERIODO = FAC.FEC_PROCESO AND LEC.CICLO = FAC.RECORR1 AND LEC.ESTADO_APRUEBA = 'A' AND LEC.ESTADO_PROCESO = 'S' "
	SQL = SQL & " AND FAC.ESTADO = 'T' "
	SQL = SQL & " ) ORDER BY TO_date(codigo, 'dd/mm/yyyy') DESC "
	

	depura("fn_periodo...:" & SQL)
	resp = fn_combo(SQL)
	
	response.ContentType = "text/plain;"
	response.write(resp)

'~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
case "fn_regional"
	 
	 
	SQL = "SELECT DISTINCT REGIONAL, REGIONAL "
    SQL = SQL & "FROM LEC_CARGA "
	SQL = SQL & "WHERE PERIODO = to_date('" & vPeriodo & "','dd/mm/yyyy') "
	SQL = SQL & "order by 1"
	
	depura("fn_regional...:" & SQL)
	resp = fn_combo(SQL)
	
	response.ContentType = "text/plain;"
	response.write(resp)

'~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
case "fn_ciclo"
	 
	SQL = "SELECT DISTINCT CICLO, CICLO "
	SQL = SQL & "FROM LEC_CARGA "
	SQL = SQL & "WHERE PERIODO = TO_DATE ('" & vPeriodo & "', 'dd/mm/yyyy') "
	SQL = SQL & "AND REGIONAL = '" & vCodRegional & "'  " 
	SQL = SQL & "ORDER BY 1 "

	depura("fn_ciclo...:" & SQL)
	resp = fn_combo(SQL)
	
	response.ContentType = "text/plain;"
	response.write(resp)
	
end select

%>
