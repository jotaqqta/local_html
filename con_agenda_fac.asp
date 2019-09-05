<!--#include virtual="/raiz/Syn_Conexion/conexion0.asp" -->
<%

dim SQL,SQL2, strJson, strhtml, n

dim vCodEmpresa, vRol, vIp
dim vTipoLectura, vCiclo, vRuta, vPeriodo, vFechaEst

vCodEmpresa = Request("empresa")
vRol = Request("rol")
vIp  = Request ("ip")
vFecProcIni   = Request ("p_fec_proc_ini")
vFecProcFin   = Request ("p_fec_proc_fin")
vFecLibroIni  = Request ("p_fec_libro_ini")
vFecLibroFin  = Request ("p_fec_libro_fin")
vFecLecIni    = Request ("p_fec_lec_ini")
vFecLecFin    = Request ("p_fec_lec_fin")
vFecFacIni    = Request ("p_fec_fac_ini")
vFecFacFin    = Request ("p_fec_fac_fin")

vTipoLectura = Request("p_cb_tipo_lec")

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

'#####################################################################################'
select case Request("func")	

 	case "fn_tipolectura"

	SQL =       " SELECT codigo, descripcion "
	SQL = SQL & " FROM nucssb0011  "
	SQL = SQL & " WHERE cod_empresa = " & vCodEmpresa
	SQL = SQL & " AND nomtabla = 'TIPOLIB' "
	SQL = SQL & " AND estado = 'A' " 
	SQL = SQL & " ORDER BY descripcion "
	
	
	depura("fn_tipolectura...:" & SQL)

	resp = fn_combo(SQL)
	
	response.ContentType = "text/plain;"
	response.write(resp)	

    '****************************************
    case "fn_grid_principal"
	
	Response.ContentType = "application/json;"
	
	SQL = "SELECT "
	SQL = SQL & "'""C1"":""'||to_char(f8.fec_proceso,'dd/mm/yyyy')||'""', "
	SQL = SQL & "'""C2"":""'||f8.recorr1 ||'""', "
	SQL = SQL & "'""C3"":""'||n11.descripcion||'""', "
	SQL = SQL & "'""C4"":""'||to_char(f8.fec_gener_libro,'dd/mm/yyyy')||'""', "
	SQL = SQL & "'""C5"":""'||to_char(f8.fec_lectura,'dd/mm/yyyy')||'""', "
	SQL = SQL & "'""C6"":""'||to_char(f8.fec_factura,'dd/mm/yyyy')||'""',"
	SQL = SQL & "'""C7"":""'||to_char(f8.fec_reparto,'dd/mm/yyyy')||'""', "
	SQL = SQL & "'""C8"":""'||(SELECT to_char(f29.fec_vencimiento,'dd/mm/yyyy') FROM facssb0029 f29 WHERE f29.cod_empresa = f8.cod_empresa AND f29.tip_vencimiento = 1 AND f29.fec_proceso = f8.fec_proceso AND f29.recorr1 = f8.recorr1)||'""', "
    SQL = SQL & "'""C9"":""'||(SELECT to_char(f29.fec_corte,'dd/mm/yyyy') FROM facssb0029 f29 WHERE f29.cod_empresa = f8.cod_empresa AND f29.tip_vencimiento = 1 AND f29.fec_proceso = f8.fec_proceso AND f29.recorr1 = f8.recorr1)||'""', "
    SQL = SQL & "'""C10"":""'||(SELECT to_char(f29.fec_vencimiento,'dd/mm/yyyy') FROM facssb0029 f29 WHERE f29.cod_empresa = f8.cod_empresa AND f29.tip_vencimiento = 2 AND f29.fec_proceso = f8.fec_proceso AND f29.recorr1 = f8.recorr1)||'""', "
    SQL = SQL & "'""C11"":""'||(SELECT to_char(f29.fec_corte,'dd/mm/yyyy') FROM facssb0029 f29 WHERE f29.cod_empresa = f8.cod_empresa AND f29.tip_vencimiento = 2 AND f29.fec_proceso = f8.fec_proceso AND f29.recorr1 = f8.recorr1)||'""' "

	
	SQL2 = ""
	SQL2 = SQL2 & " FROM facssb0008 f8, nucssb0011 n11"
	SQL2 = SQL2 & " WHERE f8.cod_empresa = "& vCodEmpresa
	SQL2 = SQL2 & " AND f8.cod_empresa = n11.cod_empresa"
	SQL2 = SQL2 & " AND f8.tip_lectura = n11.codigo"
	SQL2 = SQL2 & " AND n11.nomtabla = 'TIPOLIB'"
	SQL2 = SQL2 & " AND n11.estado = 'A'"
	
	'fecha proceso
	if not (vFecProcIni = "") and not(vFecProcFin = "") Then
		SQL2 = SQL2 & " AND f8.fec_proceso BETWEEN to_date('" & vFecProcIni &"','dd/mm/yyyy')"
		SQL2 = SQL2 & " AND to_date('"& vFecProcFin &"','dd/mm/yyyy')"
	
	elseif not (vFecProcIni = "") Then
				SQL2 = SQL2 & " AND f8.fec_proceso >= to_date('" & vFecProcIni &"','dd/mm/yyyy')"
	'elseif not (vFecProcFin = "") Then
	'			SQL2 = SQL2 & " AND f8.fec_proceso <= to_date('" & vFecProcFin &"','dd/mm/yyyy')"
	end if			
	'fecha libro			
	if not (vFecLibroIni = "") and not(vFecLibroFin = "") Then
		SQL2 = SQL2 & " AND f8.fec_gener_libro BETWEEN to_date('" & vFecLibroIni &"','dd/mm/yyyy')"
		SQL2 = SQL2 & " AND to_date('"& vFecLibroFin &"','dd/mm/yyyy')"
	
	elseif not (vFecLibroIni = "") Then
			SQL2 = SQL2 & " AND f8.fec_gener_libro >= to_date('" & vFecLibroIni &"','dd/mm/yyyy')"
	'elseif not (vFecLibroFin = "") Then
	'		SQL2 = SQL2 & " AND f8.fec_gener_libro <= to_date('" & vFecLibroFin &"','dd/mm/yyyy')"
	end if
	'sql = sql&" and trim(f8.recorr1)||trim(f8.recorr2)"
				'sql = sql&" between '"&PAR(8+k-1)&""&PAR(10+k-1)&"' "
				'sql = sql&" and '"&PAR(9+k-1)&""&PAR(11+k-1)&"' "
    'fecha lectura
	if not(vFecLecIni = "") and not(vFecLecFin = "") Then
		SQL2 = SQL2 & " AND f8.fec_lectura BETWEEN to_date('" & vFecLecIni &"','dd/mm/yyyy')"		
		SQL2 = SQL2 & " AND to_date('"& vFecLecFin &"','dd/mm/yyyy')"
	
	elseif not (vFecLecIni = "") Then
			
		SQL2 = SQL2 & " AND f8.fec_lectura >= to_date('" & vFecLecIni &"','dd/mm/yyyy')"
	'elseif not (vFecLecFin = "") Then
			
	'	SQL2 = SQL2 & " AND f8.fec_lectura <= to_date('" & vFecLecFin &"','dd/mm/yyyy')"
	end if			
	'fecha facturacion			
	if not(vFecFacIni = "") and not(vFecFacFin = "") Then
		
		SQL2 = SQL2 & " AND f8.fec_factura BETWEEN to_date('" & vFecFacIni &"','dd/mm/yyyy')"
		
		SQL2 = SQL2 & " AND to_date('"& vFecFacFin &"','dd/mm/yyyy')"
	
	elseif not (vFecFacIni = "") Then
			
		SQL2 = SQL2 & " AND f8.fec_factura >= to_date('" & vFecFacIni &"','dd/mm/yyyy')"
	'elseif not (vFecFacFin = "") Then
			
	'	SQL2 = SQL2 & " AND f8.fec_factura <= to_date('" & vFecFacFin &"','dd/mm/yyyy')"
    end if 
    'tipo lectura	
	if not (vTipoLectura = "") Then
	     
		SQL2 = SQL2 & " AND f8.tip_lectura = '"& vTipoLectura &"'"
	end if
	
	
		SQL2 = SQL2 & " ORDER BY f8.fec_proceso desc, f8.recorr1 asc"
	

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
	SQL = SQL & "to_char(f8.fec_proceso,'dd/mm/yyyy'), "
	SQL = SQL & "f8.recorr1 , "
	SQL = SQL & "n11.descripcion, "
	SQL = SQL & "to_char(f8.fec_gener_libro,'dd/mm/yyyy'), "
	SQL = SQL & "to_char(f8.fec_lectura,'dd/mm/yyyy'), "
	SQL = SQL & "to_char(f8.fec_factura,'dd/mm/yyyy'),"
	SQL = SQL & "to_char(f8.fec_reparto,'dd/mm/yyyy'), "
	SQL = SQL & "(SELECT to_char(f29.fec_vencimiento,'dd/mm/yyyy') FROM facssb0029 f29 WHERE f29.cod_empresa = f8.cod_empresa AND f29.tip_vencimiento = 1 AND f29.fec_proceso = f8.fec_proceso AND f29.recorr1 = f8.recorr1), "
	SQL = SQL & "(SELECT to_char(f29.fec_corte,'dd/mm/yyyy') FROM facssb0029 f29 WHERE f29.cod_empresa = f8.cod_empresa AND f29.tip_vencimiento = 1 AND f29.fec_proceso = f8.fec_proceso AND f29.recorr1 = f8.recorr1), "
	SQL = SQL & "(SELECT to_char(f29.fec_vencimiento,'dd/mm/yyyy') FROM facssb0029 f29 WHERE f29.cod_empresa = f8.cod_empresa AND f29.tip_vencimiento = 2 AND f29.fec_proceso = f8.fec_proceso AND f29.recorr1 = f8.recorr1),"
	SQL = SQL & "(SELECT to_char(f29.fec_corte,'dd/mm/yyyy') FROM facssb0029 f29 WHERE f29.cod_empresa = f8.cod_empresa AND f29.tip_vencimiento = 2 AND f29.fec_proceso = f8.fec_proceso AND f29.recorr1 = f8.recorr1)"
	
	SQL = SQL & SQL2
	
	
	depura("fn_principal excel...:" & SQL)
%>
{		
	"data": [<%=strJson%>],
	"sql":"<%=SQL%>",
	"totalRecords":<%=n%>
}
<%
	
		
   case "fn_fechaservidor"
   
	response.ContentType = "text/plain;"

	SQL = "SELECT to_char(sysdate,'dd/mm/yyyy') "
	SQL = SQL & "FROM dual "

	depura("fn_fechaservidor...:" & SQL)

	set rsdav = Server.CreateObject("ADODB.Recordset")
	rsdav.Open SQL,db

	if not(rsdav.EOF) then
	strhtml = rsdav.Fields(0)
	end if

	rsdav.Close()
	Set rsdav = Nothing	

	response.write(strhtml) 

	
end select

%>
