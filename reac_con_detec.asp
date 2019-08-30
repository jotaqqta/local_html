<!--#include virtual="/raiz/Syn_Conexion/conexion0.asp" -->
<%

dim SQL, strJson, strhtml, n
dim vCodEmpresa, vRol, vIp
dim vCodRegional, vCiclo, vRuta, vPeriodo, vFechaEst

vCodEmpresa = Request("empresa")
vRol = Request("rol")
vIp  = Request ("Ip")
vPeriodo  = Request ("p_periodo")
vFechaEst = Request ("p_fechaest")
vCodRegional = Request ("p_cod_regional")
vCiclo  = Request ("p_ciclo")
vRuta   = Request ("p_ruta")
vTarifa = Request("p_tarifa")
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
	case "fn_regional"

	SQL = " select nuc11.codigo, nuc11.descripcion "
	SQL = SQL & "from nucssb0011 nuc11 "
	SQL = SQL & "where nuc11.cod_empresa = " & vCodEmpresa
	SQL = SQL & " and nuc11.nomtabla = 'CENOPER' "
	SQL = SQL & "and nuc11.codigo NOT IN ('TOD', '0000') " 
	SQL = SQL & "order by nuc11.descripcion "
	
	
	depura("fn_regional...:" & SQL)

	resp = fn_combo(SQL)
	
	response.ContentType = "text/plain;"
	response.write(resp)	

'~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
	case  "fn_ciclo"

	SQL = " SELECT TRIM(COD_ATRIBUTO_INI) , TRIM(COD_ATRIBUTO_FIN)  "
	SQL = SQL & "FROM NUCSSB0014  "
	SQL = SQL & "WHERE COD_EMPRESA =  " & vCodEmpresa
	SQL = SQL & "AND NOMTABLA = 'SOLSEC'  "
	SQL = SQL & "AND CEN_OPERATIVO = '"&vCodRegional&"'  ORDER BY 1 "
	
		depura("fn_ciclo...:" & SQL)

	
    resp = fn_combo(SQL)
	response.ContentType = "text/plain;"
	response.write(resp)


	'~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
	case  "fn_tarifa"

	
	SQL = "SELECT id_relacion, nemotecnico"
	SQL = SQL & "  FROM nucssb0037 "
	SQL = SQL & " WHERE cod_empresa = " & vCodEmpresa
	SQL = SQL & "   AND tip_nodo = 'H' "	
	SQL = SQL & " ORDER BY nemotecnico"
	
		depura("fn_tarifa...:" & SQL)

	
    resp = fn_combo(SQL)
	response.ContentType = "text/plain;"
	response.write(resp)

	'~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	case "fn_excel"

	Response.ContentType = "application/json;"	
	
	SQL = "" 
	SQL = SQL & "SELECT TO_CHAR (FEC_PROCESO, 'dd/mm/yyyy') FEC_PROCESO"  
	SQL = SQL & "     , TO_CHAR (FEC_INGRESO, 'dd/mm/yyyy') FEC_PAGO"  
	SQL = SQL & "     , (SELECT DESCRIPCION"  
	SQL = SQL & "          FROM NUCSSB0011"  
	SQL = SQL & "         WHERE NOMTABLA = 'CENOPER'"  
	SQL = SQL & "           AND CODIGO = M22.CEN_OPERATIVO)"  
	SQL = SQL & "        CEN_OPERATIVO"  
	SQL = SQL & "     , RECORR1"  
	SQL = SQL & "     , RECORR2"  
	SQL = SQL & "     , (SELECT N37.NEMOTECNICO"  
	SQL = SQL & "          FROM NUCSSB0037 N37"  
	SQL = SQL & "         WHERE N37.COD_EMPRESA = M22.COD_EMPRESA"  
	SQL = SQL & "           AND N37.ID_RELACION = M22.ID_RELACION)"  
	SQL = SQL & "        TARIFA"  
	SQL = SQL & "     , NVL ("  
	SQL = SQL & "            (SELECT DESCRIPCION"  
	SQL = SQL & "               FROM NUCSSB0011 N11_A"  
	SQL = SQL & "              WHERE N11_A.COD_EMPRESA = M22.COD_EMPRESA"  
	SQL = SQL & "                AND N11_A.NOMTABLA = 'ACTECO'"  
	SQL = SQL & "                AND N11_A.CODIGO = M22.ACT_ECONOMICA)"  
	SQL = SQL & "          , 'NO REGISTRADA'"  
	SQL = SQL & "           )"  
	SQL = SQL & "        ACT_ECONOMICA"  
	SQL = SQL & "     , NRO_SUMINISTRO"  	
	SQL = SQL & "     , LECTURA_ANT"  
	SQL = SQL & "     , LECTURA"  
	SQL = SQL & "     , (SELECT DESCRIPCION"  
	SQL = SQL & "          FROM NUCSSB0011"  
	SQL = SQL & "         WHERE NOMTABLA = 'DIAMET'"  
	SQL = SQL & "           AND CODIGO = M22.COD_DIAMETRO)"  
	SQL = SQL & "        COD_DIAMETRO"  
	SQL = SQL & "     , MTO_CARGO_CON_IMPTOS"  
	SQL = SQL & "     , NRO_APARATO || ' - ' || MARCA_APARATO || ' - ' || COD_MODELO AS MEDIDOR"  
	SQL = SQL & "     , OBSERVACION"  
	SQL = SQL & "  FROM MODSSB0022 M22"  
	SQL = SQL & " WHERE M22.COD_EMPRESA = 1"
	
	if vPeriodo <> "" then
		SQL = SQL & "   AND M22.FEC_PROCESO = TO_DATE('"&vPeriodo&"', 'DD/MM/YYYY')"
	end if
	
	if vFechaEst <> "" then
		SQL = SQL & "   AND TRUNC(M22.FEC_INGRESO) = TO_DATE('"&vFechaEst&"', 'DD/MM/YYYY')"
	end if
	
	if vCodRegional <> "" then
		SQL = SQL & "   AND M22.Cen_Operativo = " & vCodRegional
	end if
	
	if vCiclo <> "" then
		SQL = SQL & "   AND M22.Recorr1 = " & vCiclo
	end if
	
	if vRuta <> "" then
		SQL = SQL & "   AND M22.Recorr2 = " & vRuta
	end if
	
	if vTarifa <> "" then
		SQL = SQL & "   AND M22.ID_RELACION = " & vTarifa
	end if
	
	
	
	depura("fn_consulta_excel...:" & SQL)

	response.ContentType = "text/plain;"
	response.write(SQL)


	
end select

%>
