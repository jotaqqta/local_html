<!--#include virtual="/raiz/Syn_Conexion/conexion0.asp" -->
<%

dim SQL, strJson, strhtml, n
dim vCodEmpresa, vRol, vIp
dim vCodRegional, vCiclo, vRuta, vPeriodo, vFechaEst

vCodEmpresa = Request("empresa")
vRol = Request("rol")
vIp  = Request ("Ip")

vCodRegional = Request ("p_regional")
vCiclo  = Request ("p_ciclo")
vRuta   = Request ("p_ruta")
vLector = Request("p_lector")
vFecha = Request ("p_fecha")

vClaveLec = Request ("p_clavelec")
vLecTerr  = Request ("p_lecterr")
vClaveLec2 = Request ("p_clavelec2")
vLecTerr2  = Request ("p_lecterr2")

vNic      = Request ("p_cliente")
vMedidor  = Request ("p_medidor")
vTipoMed  = Request ("p_tipomed")
vModMed   = Request ("p_modelo")
vMarcaMed = Request ("p_marca")

vAccion     = Request ("p_accion")
vObs        = Request ("p_obs")
vTabla      = Request ("p_tabla")
vAplicacion = Request ("p_aplicacion")
vSistema    = Request ("p_sistema")
vIdRel      = Request ("p_idrelacion")

vParametro = Request("p_parametro")

'~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*' 
Sub Exec_SQL(p_bandera, p_mysql)

    depura2("SQL: " & p_bandera & vbCrLf & p_mysql)
    db.execute p_mysql
    
End Sub

'~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~* '
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
function fn_auditoria(strEstructura)
	', strIdRelacion, strRegistro
	
	secuencia = "SELECT sec_modssb0001.nextval FROM dual"
	vSec = mid(SYNSelect(secuencia),6)
	vSec = left(vSec,len(vSec)-2)
	
	
	SQL = ""
	SQL = SQL & "INSERT INTO modssb0003 ("
	SQL = SQL & "		cod_empresa,"
	SQL = SQL & "		estructura,"
	SQL = SQL & "		nro_suministro,"
	SQL = SQL & "		tip_identidad,"
	SQL = SQL & "		nro_identidad,"
	SQL = SQL & "		fecha,"
	SQL = SQL & "		rol,"
	SQL = SQL & "		codigo,"
	SQL = SQL & "		aplicacion,"
	SQL = SQL & "		estacion,"
	SQL = SQL & "		observacion,"
	SQL = SQL & "		dato_anterior,"
	SQL = SQL & "		dato_actual"
	SQL = SQL & ") VALUES ("
	SQL = SQL &		vCodEmpresa & ", '"
	SQL = SQL &		strEstructura & "', '"
	SQL = SQL &		vNic & "', "
	SQL = SQL &	"(select tip_identidad from ciassb0001 WHERE nro_suministro = '" & vNic & "' ) , " 
	SQL = SQL &	"(select nro_identidad from ciassb0001 WHERE nro_suministro = '" & vNic & "' ) , "
	
	SQL = SQL &	"sysdate, '"
	SQL = SQL &	vRol & "', "
	SQL = SQL &	"'123',"
	SQL = SQL &	"'ING_LECDUDO', '"
	SQL = SQL &	vIp & "', "
	SQL = SQL &	"'Actualización de Lectura y clave lectura de ["& vClaveLec2 &"] a ["& vClaveLec &"]' , '"
    SQL = SQL &	vLecTerr2 & "', '"
	SQL = SQL &	vLecTerr & "'"
	SQL = SQL & ")"
	
	'fn_auditoria = SYNEjecuta(sql,0)
	depura("fn_auditoria_lec_dudo...:" & SQL)
	Exec_SQL "fn_auditoria_lec_dudo",SQL
	
end function

'#####################################################################################'


'#####################################################################################'
select case Request("func")	

 	
	case "fn_grid_principal"
	
	Response.ContentType = "application/json;"
	
	
	SQL = "SELECT "
	SQL = SQL & "'""C1"":""'||c1.nro_suministro ||'""', "
	SQL = SQL & "'""C2"":""'||c2.nro_aparato ||'""', "
	SQL = SQL & "'""C3"":""'||c2.nro_enteros ||'""', "
	SQL = SQL & "'""C4"":""'||substr(c1.nombre,1,25) ||'""', "
	SQL = SQL & "'""C5"":""'||substr(c1.dir_suministro,1,45) ||'""', "
	SQL = SQL & "'""C6"":""'||c1.recorr1||'-'||c1.recorr2||'-'||c1.recorr3||'""', "
    SQL = SQL & "'""C7"":""'||c2.tip_medida ||'""', "
    SQL = SQL & "'""C8"":""'||c5.clave_lectura ||'""', "
    SQL = SQL & "'""C9"":""'||c5.lectura_terreno ||'""', "
    SQL = SQL & "'""C10"":""'||c5.clave_lectura ||'""', "
    SQL = SQL & "'""C11"":""'||c5.lectura_terreno ||'""', "
   
	SQL = SQL & "'""C12"":""'||c5.cod_lector||'""', "
    SQL = SQL & "'""C13"":""'||c2.marca_aparato ||'""', "
	SQL = SQL & "'""C14"":""'||c2.cod_modelo ||'""' "
	'SQL = SQL & "'""C15"":""'||0||'""' "
	'SQL = SQL & "'""C7"":""'||c1.recorr1 ||'""', "
    'SQL = SQL & "'""C8"":""'||c1.recorr2 ||'""', "
    'SQL = SQL & "'""C9"":""'||c1.recorr3 ||'""', "
   
    SQL2 = ""
	SQL2 = SQL2 &  " FROM ciassb0001 c1, ciassb0002 c2,  ciassb0005 c5"
	SQL2 = SQL2 &  " WHERE c1.cod_empresa = " & vCodEmpresa
	SQL2 = SQL2 &  "   AND c1.recorr1 = '"& vCiclo &"'"
	SQL2 = SQL2 &  "   AND c1.cen_operativo = '"& VCodRegional &"'"
	SQL2 = SQL2 &  "   AND c1.recorr2 = '"& vRuta &"'"
	
	SQL2 = SQL2 &  "   AND c2.cod_empresa = c1.cod_empresa "
	SQL2 = SQL2 &  "   AND c2.nro_suministro = c1.nro_suministro "
	SQL2 = SQL2 &  "   AND c5.nro_suministro = c2.nro_suministro "
	SQL2 = SQL2 &  "   AND c5.nro_aparato = c2.nro_aparato "
	SQL2 = SQL2 &  "   AND c5.marca_aparato = c2.marca_aparato "
	SQL2 = SQL2 &  "   AND c5.cod_modelo = c2.cod_modelo "
	SQL2 = SQL2 &  "   AND c5.cod_empresa = c2.cod_empresa "
	SQL2 = SQL2 &  "   AND c5.tip_medida = c2.tip_medida "
	SQL2 = SQL2 &  "   AND c1.tie_critica = 'S' "
	
	SQL2 = SQL2 &  "  ORDER BY c5.recorr1, c5.recorr2, c5.recorr3, c5.tip_medida " 
	
	

    SQL = SQL & SQL2
	
	depura("fn_principal...:" & SQL)

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
	
	SQL = "SELECT "
	SQL = SQL & "c1.nro_suministro, "
	SQL = SQL & "c2.nro_aparato, "
	SQL = SQL & "c2.nro_enteros, "
	SQL = SQL & "substr(c1.nombre,1,25) , "
	SQL = SQL & "substr(c1.dir_suministro,1,45), "

	SQL = SQL & "c1.recorr1||'-'||c1.recorr2||'-'||c1.recorr3,"
	SQL = SQL & "c2.tip_medida, "

	SQL = SQL & "c5.clave_lectura, "
	SQL = SQL & "c5.lectura_terreno "
	
	SQL = SQL & SQL2
	
	
	depura("fn_principal excel...:" & SQL)
%>
{		
	"data": [<%=strJson%>],
	"sql":"<%=SQL%>",
	"totalRecords":<%=n%>
}
<%

	  
	  
	
    '******************************************
    case  "fn_actualiza_datos"
	
    db.BeginTrans
	
	
	    SQL = "UPDATE CIASSB0005 SET "
		SQL = SQL & " clave_lectura    = '"   & vClaveLec & "' "
		SQL = SQL & ", lectura_terreno = " & vLecTerr
		SQL = SQL & ", cod_lector = '"     & vLector & "' "
        SQL = SQL & ", veces_leida = NVL(veces_leida,0)+1 "
		SQL = SQL & ", fec_lect_terreno = to_date('" & trim(vFecha) & "','dd/mm/yyyy') "
		SQL = SQL & " WHERE cod_empresa = " & vCodEmpresa
		SQL = SQL & "   AND nro_suministro = " & vNic
		SQL = SQL & "   AND nro_aparato = " & vMedidor
		SQL = SQL & "   AND marca_aparato = '" & vMarcaMed & "'"
		SQL = SQL & "   AND cod_modelo = '" & vModMed & "'"
		SQL = SQL & "   AND tip_medida = '" & vTipoMed & "'"
	
	depura("fn_actualiza_datos...:" & SQL)
	Exec_SQL "fn_actualiza_datos",SQL
	
	
	resp = fn_auditoria("CIASSB0005")
	', "U", vNic, "Medidor:[" & vMedidor & "] Cambio datos a: Lectura[" & vClaveLec & "] - Lectura Terreno [" & vLecTerr & "]"
	
	db.CommitTrans


	'~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
	'
    
	
	case "fn_regional"

	SQL = " SELECT codigo, descripcion "
	SQL = SQL & "FROM nucssb0011 "
	SQL = SQL & "WHERE cod_empresa = '" & vCodEmpresa  & "'"
	SQL = SQL & "  AND nomtabla = 'CENOPER' "
	SQL = SQL & "  AND codigo NOT IN ('TOD', '0000') " 
	SQL = SQL & "ORDER BY descripcion "
	
	
	depura("fn_regional...:" & SQL)

	resp = fn_combo(SQL)
	
	response.ContentType = "text/plain;"
	response.write(resp)	

    '~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
    '
     case  "fn_ciclo"

	SQL = " SELECT TRIM(COD_ATRIBUTO_INI) , TRIM(COD_ATRIBUTO_FIN)  "
	SQL = SQL & " FROM NUCSSB0014  "
	SQL = SQL & "WHERE COD_EMPRESA =  '" & vCodEmpresa   & "' "
	SQL = SQL & "  AND NOMTABLA = 'SOLSEC'  "
	SQL = SQL & "  AND CEN_OPERATIVO = '" & vCodRegional & "'  ORDER BY 1 "
	
    depura("fn_ciclo...:" & SQL)

	
    resp = fn_combo(SQL)
	response.ContentType = "text/plain;"
	response.write(resp)


	'~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
	'
    case  "fn_ruta"

	
	SQL = "SELECT trim(nuc14.cod_atributo_fin), nuc11.descripcion ciclo "
	SQL = SQL & "  FROM nucssb0014 nuc14, nucssb0011 nuc11 "
	SQL = SQL & " WHERE nuc14.cod_empresa = "& vCodEmpresa
	SQL = SQL & "   AND nuc14.nomtabla = 'RECIRU' "
	SQL = SQL & "   AND nuc14.cod_agrupacion = 'CIRU' "
	SQL = SQL & "   AND nuc14.cen_operativo = '"& vCodRegional &"'"
	SQL = SQL & "   AND trim(nuc14.cod_atributo_ini) = '"& vCiclo &"'"
	SQL = SQL & "   AND nuc11.cod_empresa = nuc14.cod_empresa "
	SQL = SQL & "   AND nuc11.nomtabla = 'RUTA' "
	SQL = SQL & "   AND nuc11.codigo = trim(nuc14.cod_atributo_fin) "
	SQL = SQL & " ORDER BY  1 "
	
	
	depura("fn_ruta...:" & SQL)
	
	resp = fn_combo(SQL)
	
	response.ContentType = "text/plain;"
	response.write(resp)


	'~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
	'
    case  "fn_lector"

	SQL = "	SELECT t6.cod_inspector, t6.cod_inspector ||' - '||t6.nom_inspector "
	SQL = SQL &  " 	 FROM   tasssb0007 t7, tasssb0006 t6, nucssb0011 n11 "
	SQL = SQL &  " 	WHERE   t7.cod_sistema = 'LECT' "
	SQL = SQL &  " 	  AND   t7.cod_empresa = " & vCodEmpresa
	SQL = SQL &  " 	  AND   t6.cod_contratista = t7.cod_contratista "
	SQL = SQL &  " 	  AND   t6.cod_inspector = t7.cod_inspector "
	SQL = SQL &  " 	  AND   t6.cod_empresa = t7.cod_empresa "
	SQL = SQL &  " 	  AND   n11.cod_empresa = t7.cod_empresa "
	SQL = SQL &  " 	  AND   n11.nomtabla = 'CODESP' "
	SQL = SQL &  " 	  AND   n11.codigo = t7.cod_especialidad "
	SQL = SQL &  " 	  AND   length(t6.cod_inspector) = 4 "
    SQL = SQL &  " 	  ORDER BY  t6.nom_inspector " 	
	
	depura("fn_lector...:" & SQL)

	
    resp = fn_combo(SQL)
	response.ContentType = "text/plain;"
	response.write(resp)

	'~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	'
	case "fn_valida_clave"
	
    
	SQL = "SELECT count(clave_lectura)  "
	SQL = SQL & "  FROM nucssb0080 "
	SQL = SQL & " WHERE clave_lectura = '" & vClaveLec & "' "
	
	depura("fn_valida_clave...:" & SQL)

	set rsdav = Server.CreateObject("ADODB.Recordset")
	
	rsdav.Open SQL,db
	
	strhtml = ""
	if not(rsdav.EOF) then
		strhtml = rsdav.Fields(0)
	end if
	
	rsdav.Close()
	Set rsdav = Nothing					
	
	response.ContentType = "text/plain;"	
	response.write(strhtml)
	
    '~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	'
    case  "fn_validafecha"
	
	response.ContentType = "text/plain;"
	
	SQL = " SELECT distinct "
	SQL = SQL & "   to_char(f8.fec_lectura,'dd/mm/yyyy') fechalec "
	SQL = SQL & " , to_char(f8.fec_factura,'dd/mm/yyyy') fechafact "
	SQL = SQL & " , (CASE WHEN to_date('"&vFecha&"','dd/mm/yyyy') BETWEEN f8.fec_lectura AND f8.fec_factura THEN 'S' ELSE 'N' END)  verifica "
	SQL = SQL & "  FROM ciassb0001 c1, facssb0008 f8 "
	SQL = SQL & " WHERE c1.cod_empresa = "&vCodEmpresa
	SQL = SQL & "   AND   c1.recorr1 = '"&vCiclo&"'"
	sql = sql & "   AND   f8.fec_proceso = c1.fec_proceso "
	sql = sql & "   AND   f8.recorr1 = c1.recorr1 "
	sql = sql & "   AND   f8.cod_empresa = c1.cod_empresa"
	
	'validaFecha = SYNSelect(sql)
	
	depura("fn_validaFecha...:" & SQL)

	
	set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open SQL,db
	
	strdata  = ""
	if not (rs.EOF and rs.BOF) then 
		strdata  = rs.GetString(,10,"|","|*","")		
	end if
 	
	rs.close 
	set rs=nothing

	response.write(strdata)

	
	
end select

%>
