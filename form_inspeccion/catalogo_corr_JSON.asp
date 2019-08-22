<!--#include virtual="/raiz/Syn_Conexion/conexion0.asp" -->
<%
Response.ContentType = "application/json; charset=ISO-8859-1"

'~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~* 
Sub Exec_SQL(p_bandera, p_mysql)

    depura2("SQL: " & p_bandera & vbCrLf & p_mysql)
    db.execute p_mysql
    
End Sub


dim respuesta,SQL,vCodEmpresa,strJson

vCodEmpresa = Request("Empresa")
vCodigo = Request("p_codigo")
vDescripcion = Request("p_descripcion")
rol = Request("p_rol")
param = ""
cod = ""

select case Request("func")

case "fn_insert"
	db.BeginTrans
	SQL = "Insert into synergia.rol_cargo "
	SQL = SQL &  " (COD_EMPRESA, CODIGO, DESCRIPCION, ESTADO) Values "
	SQL = SQL &  " (" & vCodEmpresa & ",'" & vCodigo & "','"  & vDescripcion & "', 'A')"


	depura2 ("Commit Ingresar :: Posicion :: " & SQL)
	Exec_SQL "INSERT CIDAAN.rol_cargo", SQL
	
	db.CommitTrans
	response.write("ok")

case "fn_update"
	db.BeginTrans
	SQL = "UPDATE synergia.rol_cargo "
	SQL = SQL &  "    SET   DESCRIPCION = '" & vDescripcion & "'"
	SQL = SQL &  "  WHERE   CODIGO = '" & vCodigo & "'"
	SQL = SQL &  " AND COD_EMPRESA = " & vCodEmpresa

	depura2 ("Commit Ingresar :: Posicion :: " & SQL)
	Exec_SQL "UPDATE CIDAAN.rol_cargo", SQL
	
	db.CommitTrans
	response.write("ok")
	

case "fn_act_desc"
	
	vEstado = Request("p_estado")
	db.BeginTrans
	SQL = "UPDATE synergia.rol_cargo "
	SQL = SQL &  "    SET   ESTADO = '" & vEstado & "'"
	SQL = SQL &  "  WHERE   CODIGO = '" & vCodigo & "'"
	SQL = SQL &  " AND COD_EMPRESA = " & vCodEmpresa

	depura2 ("Commit Update :: Posicion :: " & SQL)
	Exec_SQL "UPDATE CIDAAN.rol_cargo", SQL
	
	db.CommitTrans
	response.write("ok")


case "fn_consulta_max"

	set rsdav = Server.CreateObject("ADODB.Recordset")
	
	SQL ="SELECT MIN (x) + 1 "
	SQL= SQL & "  FROM (SELECT CODIGO x, "
	SQL= SQL & "			   LEAD (CODIGO) OVER (ORDER BY CODIGO) next_x "
	SQL= SQL & "		  FROM synergia.rol_cargo "
	SQL= SQL & "		 WHERE cod_empresa = "&vCodEmpresa&") "
	SQL= SQL & " WHERE x <> NVL (next_x, 0) - 1 "
	
	rsdav.Open SQL,db
	depura(SQL)

	if not(rsdav.EOF) then
		strhtml = rsdav.Fields(0)
	end if
	
	rsdav.Close()
	Set rsdav = Nothing					
		
	response.write(strhtml)

case "grid_cat_corregimiento"
	SQL = "select c.codigo corregimiento, c.descripcion nombre, p.descripcion provincia, d.descripcion distrito, c.valor2 cont, "
	SQL = SQL & "nvl((select cen_operativo from nucssb0014 r where r.cod_empresa=c.cod_empresa and r.nomtabla= 'CENOPER' and  r.cod_agrupacion='AGR1' and r.cod_atributo_ini= c.codigo),'Sin Definir') regional_cliente, "
	SQL = SQL & "nvl((select cen_operativo from nucssb0014 r where r.cod_empresa=c.cod_empresa and r.nomtabla= 'CENOPER' and  r.cod_agrupacion='AGTC' and r.cod_atributo_ini= c.codigo),'Sin Definir') regional_aic,  "
	SQL = SQL & "decode (c.estado, 'A','ACTIVO','D','INACTIVO'), c.estado "
	SQL = SQL & "from nucssb0011  c, nucssb0011 d, nucssb0011 p "
	SQL = SQL & "where c.nomtabla = 'COMUNA'  "
	SQL = SQL & "and c.cod_empresa = 1 "
	SQL = SQL & "and c.codigo not in ('TOD','0000')  "
	SQL = SQL & "and d.nomtabla = 'DISTRIT' "
	SQL = SQL & "and d.cod_empresa = c.cod_empresa "
	SQL = SQL & "and d.codigo not in ('TOD','0000')  "
	SQL = SQL & "and d.codigo = c.valor1 "
	SQL = SQL & "and p.nomtabla = 'PROVIN' "
	SQL = SQL & "and p.cod_empresa = c.cod_empresa "
	SQL = SQL & "and p.codigo not in ('TOD','0000')  "
	SQL = SQL & "and p.codigo = d.valor1 "
	if (rol <> "") then 
		SQL = SQL & "and c.descripcion like '%" & rol &"%'" 
		par = par & " Nombre: " & rol
	end if
	if ((param <> "0") and (param <> "")) then 
		SQL = SQL & "and p.codigo =  '" & param &"'"  
		par = par & " Provincia: " & tipod
	end if	
	if ((cod <> "0") and (cod <> "")) then 
		SQL = SQL & "and d.codigo =  '" & cod &"'"
		par = par & " Distrito: " & codd 
	end if
	SQL = SQL & " order by 3,4,2 "
	
	depura("GRID DATA JSON...:" & SQL)
	dim n
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

	
SQL = "select "
SQL = SQL & "TRIM(CODIGO),"
SQL = SQL & "TRIM(InitCap(DESCRIPCION)), "
SQL = SQL & "TRIM(decode(ESTADO,'A','ACTIVO','D','INACTIVO',ESTADO)) "
SQL = SQL & " from synergia.rol_cargo "
SQL = SQL & " where COD_EMPRESA = "  & vCodEmpresa
SQL = SQL & " ORDER BY 2 "	

%>
{		
	"data": [<%=strJson%>],
	"sql":"<%=SQL%>",
	"totalRecords":<%=n%>
}
<%
end select
%>