var g_modulo="Facturación de Clientes - Lecturas y Consumos";
var g_tit = "Consulta Agenda de Facturación";
var $grid_principal;
var $grid_2;
var $grid_ruta;
var parameters = {};
var Filtros = [];
var sql_grid_prim = "";
var sql_grid_dos = "";
var sql_grid_3 = "";
//var my_url = "con_age_fac.asp";

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
$(document).keydown(function(e) {

	if (e.keyCode === 8 ) {
		var element = e.target.nodeName.toLowerCase();
		if ((element != 'input' && element != 'textarea') || $(e.target).attr("readonly")) {
			return false;
		}
	}
});

$(document).ready(function() {
    
    // PARA ELIMINAR EL SUBMIT
	$("button").on("click", function(){return false;});

    //INGRESA LOS TITULOS
    document.title = g_tit ;
	document.body.scroll = "yes";
    
	$("#div_header").load("header.htm", function() {  ///raiz/syn_globales/
		$("#div_mod0").html(g_modulo);
		$("#div_tit0").html(g_tit);	
	}); 
	
    $("#excel_archivo").val("Agenda_facturacion.xls");
	
	//Se cargan las variables que vienen desde el server
	$("#tx_empresa").val(SYNSegCodEmpresa);
	$("#tx_rol").val(SYNSegRol);
	$("#tx_ip").val(SYNSegIP);
	$("#tx_rolfun").val(SYNSegRolFuncion);
	//ojo colocar cuando se active el asp --- NO quitar */
    
    
    // INICIA CON EL CURSOR EN EL CAMPO FECHA
	$("#fec_proc_ini").focus();
	$("._input_selector").inputmask("dd/mm/yyyy");
    
    
    
	$("#form_info").hide();
    //DEFINE LA GRILLA PRINCIPAL
    fn_setea_grid_principal();
	//fn_carga_periodo();
    $("#div_footer").load("footer.htm"); ///raiz/syn_globales/
    //DIBUJA LOS ICONOS DE LOS BOTONES     
    
    $("#co_filtro").html("<span class='glyphicon glyphicon-search'></span> Filtros");
    $("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
    $("#co_volver_2").html("<span class='glyphicon glyphicon-chevron-left'></span> Volver");
    $("#co_volver_3").html("<span class='glyphicon glyphicon-chevron-left'></span> Volver");
    $("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");    
    //$("#co_excel2").html("<span class='glyphicon glyphicon-save'></span> Excel");
    //$("#co_excel3").html("<span class='glyphicon glyphicon-save'></span> Excel");

    
        //borrar cuando se haga asp - halarlo de la consulta sql
   
    //EVENTO BOTONES
	
    $("#co_filtro").on("click", fn_Muestra_Filtro);
    
     $("#co_cerrar").on("click", function (e) {
        window.close(); 
    });    
    
    fn_tipolectura();
    /*$("#co_volver_2").on("click", function (e) {
		$("#div_prim0").show();
		$("#div_ciclo_ruta").hide();
		//$grid_principal.pqGrid( "refreshDataAndView" );
		$(window).scrollTop(0);
    });
	
	$("#co_volver_3").on("click", function (e) {
		$("#div_ruta").hide();
		$("#div_ciclo_ruta").show();
		//$grid_principal.pqGrid( "refreshDataAndView" );
		$(window).scrollTop(0);
    });*/

	$("#co_close").on("click", function (e) {
        $('#div_filtro_bts').modal('hide'); 
		fn_limpia_filtro();
    });
	
	$("#co_fil_aceptar").on("click", function (e) {
        
         
        if($("#fec_proc_ini").val() != ""){
		if (fn_validar_fecha($("#fec_proc_ini").val()) == false){
			fn_mensaje_boostrap("INFORMACIÓN INCORRECTA EN EL CAMPO FECHA DE PROCESO INICIAL. EL FORMATO ES DD/MM/YYYY", g_tit, $("#fec_proc_ini") );
			return false;
		   }
	    }
        if($("#fec_proc_fin").val() != ""){
		if (fn_validar_fecha($("#fec_proc_fin").val()) == false){
			fn_mensaje_boostrap("INFORMACIÓN INCORRECTA EN EL CAMPO FECHA DE PROCESO FINAL. EL FORMATO ES DD/MM/YYYY", g_tit, $("#fec_proc_fin") );
			return false;
		   }
	    }
        
        /*if( $("#fec_proc_ini").val() == "" && $("#fec_proc_fin").val() != "") {
                fn_mensaje_boostrap("Debe diligenciar las dos fechas", g_tit, $("#fec_proc_ini"));
                return;
            }
        if( $("#fec_proc_ini").val() != "" && $("#fec_proc_fin").val() == "") {
                fn_mensaje_boostrap("Debe diligenciar las dos fechas", g_tit, $("#fec_proc_fin"));
                return;
            }
*/
        if($("#fec_libro_ini").val() != ""){
		if (fn_validar_fecha($("#fec_libro_ini").val()) == false){
			fn_mensaje_boostrap("INFORMACIÓN INCORRECTA EN EL CAMPO FECHA DE LIBRO INICIAL. EL FORMATO ES DD/MM/YYYY", g_tit, $("#fec_libro_ini") );
			return false;
		   }
	    }
        if($("#fec_libro_fin").val() != ""){
		if (fn_validar_fecha($("#fec_libro_fin").val()) == false){
			fn_mensaje_boostrap("INFORMACIÓN INCORRECTA EN EL CAMPO FECHA DE LIBRO FINAL. EL FORMATO ES DD/MM/YYYY", g_tit, $("#fec_libro_fin") );
			return false;libro
		   }
	    }
        /*if( $("#fec_libro_ini").val() == "" && $("#fec_libro_fin").val() != "") {
                fn_mensaje_boostrap("Debe diligenciar las dos fechas", g_tit, $("#fec_libro_ini"));
                return;
            }
        if( $("#fec_libro_ini").val() != "" && $("#fec_libro_fin").val() == "") {
                fn_mensaje_boostrap("Debe diligenciar las dos fechas", g_tit, $("#fec_libro_fin"));
                return;
            }
*/
         if($("#fec_lec_ini").val() != ""){
		if (fn_validar_fecha($("#fec_lec_ini").val()) == false){
			fn_mensaje_boostrap("INFORMACIÓN INCORRECTA EN EL CAMPO FECHA DE LECTURA INICIAL. EL FORMATO ES DD/MM/YYYY", g_tit, $("#fec_lec_ini") );
			return false;
		   }
	    }
        if($("#fec_lec_fin").val() != ""){
		if (fn_validar_fecha($("#fec_lec_fin").val()) == false){
			fn_mensaje_boostrap("INFORMACIÓN INCORRECTA EN EL CAMPO FECHA DE LECTURA FINAL. EL FORMATO ES DD/MM/YYYY", g_tit, $("#fec_lec_fin") );
			return false;
		   }
	    }
        /*if( $("#fec_lec_ini").val() == "" && $("#fec_lec_fin").val() != "") {
                fn_mensaje_boostrap("Debe diligenciar las dos fechas", g_tit, $("#fec_lec_ini"));
                return;
            }
        if( $("#fec_lec_ini").val() != "" && $("#fec_lec_fin").val() == "") {
                fn_mensaje_boostrap("Debe diligenciar las dos fechas", g_tit, $("#fec_lec_fin"));
                return;
            }*/
        
         if($("#fec_fac_ini").val() != ""){
		if (fn_validar_fecha($("#fec_fac_ini").val()) == false){
			fn_mensaje_boostrap("INFORMACIÓN INCORRECTA EN EL CAMPO FECHA DE FACTURACIÓN INICIAL. EL FORMATO ES DD/MM/YYYY", g_tit, $("#fec_fac_ini") );
			return false;
		   }
	    }
        if($("#fec_fac_fin").val() != ""){
		if (fn_validar_fecha($("#fec_fac_fin").val()) == false){
			fn_mensaje_boostrap("INFORMACIÓN INCORRECTA EN EL CAMPO FECHA DE FACTURACIÓN FINAL. EL FORMATO ES DD/MM/YYYY", g_tit, $("#fec_fac_fin") );
			return false;
		   }
	    }
        /*
        if( $("#fec_fac_ini").val() == "" && $("#fec_fac_fin").val() != "") {
                fn_mensaje_boostrap("Debe diligenciar las dos fechas", g_tit, $("#fec_fac_ini"));
                return;
            }
        if( $("#fec_fac_ini").val() != "" && $("#fec_fac_fin").val() == "") {
                fn_mensaje_boostrap("Debe diligenciar las dos fechas", g_tit, $("#fec_fac_fin"));
                return;
            }
        
       if( $("#fec_proc_ini").val() == ""  && $("#fec_proc_fin").val() == "" &&
           $("#fec_libro_ini").val() == "" && $("#fec_libro_fin").val() == "" &&
           $("#fec_lec_ini").val() == ""   && $("#fec_lec_fin").val() == "" &&
           $("#fec_fac_ini").val() == ""   && $("#fec_fac_fin").val() == ""){
              fn_mensaje_boostrap("Debe seleccionar un rango de fechas !!!", g_tit, $("#fec_proc_ini"));
		        return;
            }
        */
        
        	//fn_carga_grid_principal();
		
		
        
    });
	
	/*$("#tx_fil_periodo").on("change", function (e){
		if($("#tx_fil_periodo").val() != ""){
			fn_carga_regional();
		}
		else{
			$("#cb_fil_regional").html("");
			$("#cb_fil_ciclo").html("");
		}
	});*/
	
	/*$("#cb_fil_regional").on("change", function (e){
		if($("#cb_fil_regional").val() != ""){
			fn_carga_ciclo();
		}
		else
			$("#cb_fil_ciclo").html("");
	});*/
	
	$("#co_fil_limpiar").on("click", function (e) {
        fn_limpia_filtro(); 
    });
    
    //EVENTO DBL_CLICK DE LA GRILLA
    /*$grid_principal.pqGrid({
		rowDblClick: function( event, ui ) {
			if (ui.rowData) 
				{
					var dataCell = ui.rowData;
					//g_cliente_selec = dataCell.c2;
					//$("#div_ciclo_ruta").show();
    				$("#div_prim0").hide();
					$grid_2.pqGrid("refreshView");
					//fn_grilla_dos(dataCell.C1, dataCell.C2, dataCell.C3, dataCell.C5);
				}
			}
	});*/
	
	
	$("#div_filtro_bts").draggable({
        handle: ".modal-header"
    });
	    
	$("#co_excel").on("click", function (e) {
		fn_filtro();
		e.preventDefault();
        var col_model=$( "#div_grid_principal" ).pqGrid( "option", "colModel" );
		var cabecera = "";
		for (i=0; i< col_model.length; i++){
			if(col_model[i].hidden != true) cabecera += "<th>"+col_model[i].title+ "</th>";
		}
		$("#excel_cabecera").val(cabecera);
		var element =$grid_principal.pqGrid("option","dataModel.data");
		if (element)
			a= element.length;
		else 
			a= 0;
		if(a>0){
			$("#tituloexcel").val(g_tit);
			$("#sql").val(sql_grid_prim);	
			$("#frm_Exel").submit();
			return;
		}	
    });
	
    
	
});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_validar_fecha(value){
	var real, info;
	if (/^(0?[1-9]|[12][0-9]|3[01])[\/](0?[1-9]|1[012])[\/]\d{4}$/.test(value)) {
		info = value.split(/\//);
		var fecha = new Date(info[2], info[1]-1, info[0]);
		if ( Object.prototype.toString.call(fecha) === '[object Date]' ){
			real = fecha.toISOString().substr(0,10).split('-');
			if (info[0] === real[2] && info[1] === real[1] && info[2] === real[0]) {
				return true;
			}			
			return false;
		} else {
			return false;
		}
	}
	else {
		return false;
	}
	
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_setea_grid_principal()
{     
	var data =  [
		  { C1: '01/08/2019', C2: '04', C3: 'PANAMA METRO', C4: '04/08/2019', C5:'05/08/2019', C6:'15/08/2019',
		   C7:'25/08/2019', C8:'25/08/2019', C9:'30/08/2019', C10:'25/08/2019', C11:'30/08/2019'},
		 { C1: '01/07/2019', C2: '04', C3: 'PANAMA METRO', C4: '04/07/2019', C5:'05/07/2019', C6:'15/07/2019',
		   C7:'25/07/2019', C8:'25/07/2019', C9:'30/07/2019', C10:'25/07/2019', C11:'30/07/2019'},
		 { C1: '01/06/2019', C2: '04', C3: 'PANAMA METRO', C4: '04/06/2019', C5:'05/06/2019', C6:'15/06/2019',
		   C7:'25/06/2019', C8:'25/06/2019', C9:'30/06/2019', C10:'25/06/2019', C11:'30/06/2019'},
		 ]
    var obj = {  
	        height: "100%",
            showTop: true,
			showBottom:true,
            showTitle : false,
			title: "Consulta de Agenda de Facturación",
            roundCorners: true,
            rowBorders: true,
            columnBorders: true,
            collapsible:true,
			editable:false,
            selectionModel: { type: 'row',mode:'single'},
            numberCell: { show: true },
			pageModel: { rPP: 200, type: "local", rPPOptions: [100, 200, 500]},
        	scrollModel:{theme:true},
			toolbar:
           {
               cls: "pq-toolbar-export",
               items:
               [
                   { type: "button", label: " Filtros"      ,  attr:"id=co_filtro", cls:"btn btn-primary"},
                   { type: "button", label: " Excel"        ,  attr:"id=co_excel"       , cls:"btn btn-primary"},
                   { type: "button", label: " Cerrar"       ,  attr:"id=co_cerrar"      , cls:"btn btn-default"},
               ]
           }
        };
		
		obj.colModel = [		
          { title: "Periodo", width: 100, dataType: "string", dataIndx: "C1", halign:"center", align:"center"},
        { title: "Ciclo", width: 80, dataType: "string", dataIndx: "C2", halign:"center", align:"center" },
        //{ title: "Ruta", width: 100, dataType: "string", dataIndx: "C4", halign:"center", align:"center" },
        { title: "Tipo Lectura", width: 140, dataType: "string", dataIndx: "C3", halign:"center", align:"center" },
        { title: "Fecha Libro", width: 100, dataType: "string", dataIndx: "C4", halign:"center", align:"center"},
        { title: "Fecha Lectura", width: 140, dataType: "string", dataIndx: "C5", halign:"center", align:"center" },
        { title: "Fecha Facturación", width: 130, dataType: "string", dataIndx: "C6", halign:"center", align:"center" },
        { title: "Fecha Reparto", width: 130, dataType: "string", dataIndx: "C7", halign:"center", align:"center" },
        
        { title: "Vcto. Normal ", width: 100, dataType: "string", dataIndx: "C8", halign:"center", align:"center" },
        { title: "Corte Normal", width: 100, dataType: "string", dataIndx: "C9", halign:"center", align:"center" },
        { title: "Vcto. Gobierno ", width: 120, dataType: "string", dataIndx: "C10", halign:"center", align:"center" },
        { title: "Corte Gobierno", width: 130, dataType: "string", dataIndx: "C11", halign:"center", align:"center" }
        ];
	obj.dataModel = { data: data };	
	
    $grid_principal = $("#div_grid_principal").pqGrid(obj);
	

	
}
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_Muestra_Filtro()
{
	fn_limpia_filtro();
     $("#fec_proc_fin").val(Date());
    $("#fec_libro_fin").val(Date());
    $("#fec_lec_fin").val(Date());
    $("#fec_fac_fin").val(Date());

    $("#div_filtro_bts").modal({backdrop: "static",keyboard:false});
	$("#div_filtro_bts").on("shown.bs.modal", function () {
		$("#div_filtro_bts div.modal-footer button").focus();
		//Aplicar trabajo cuando esta visible el objeto	
	});

}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
/*function fn_grilla_dos(per, reg, ciclo, sec)
{
    fn_filtro_2(per, reg, ciclo, sec);
	var total_register;
	
    var dataModel = 
    {        
        location: "remote",
        sorting: "local",
        dataType: "json",
        method: "POST",
        sortDir: ["up", "down"],
		async:false,
        url: my_url+"?"+jQuery.param( parameters ),
        getData: function (dataJSON) 
        {
			total_register = $.trim(dataJSON.totalRecords);
			var data = dataJSON.data;
			sql_grid_dos=dataJSON.sql;
			if(total_register>=1)
			{
				$("#co_excel2").attr("disabled", false);
			}
            return { data: dataJSON.data};
        },
        error: function(jqErr, err_stat, err_str) // ERROR EN EL ASP
        {
			fn_mensaje_boostrap(jqErr.responseText, g_tit, $("") );
        }        
    }

	$grid_2.pqGrid( "option", "dataModel", dataModel );
    $grid_2.pqGrid( "refreshDataAndView" );
    $grid_2.pqGrid( "option", "title", "Clientes Medidos Agrupados por Ciclo y Ruta - [ Periodo: "+ per +" - Regional: "+ reg +" - Ciclo: "+ ciclo+" )");

}*/

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_carga_grid_principal()
{
	fn_filtro();
	var total_register;
   var dataModel = 
    {
        location: "remote",
        sorting: "local",
        dataType: "json",
        method: "POST",
        sortDir: ["up", "down"],
		async:false,
        url: my_url+"?"+jQuery.param( parameters ),
        getData: function (dataJSON) 
        {
			total_register = $.trim(dataJSON.totalRecords);
			var data = dataJSON.data;
			sql_grid_prim = dataJSON.sql;
			
			if(total_register>=1)
			{
				$("#co_excel").attr("disabled", false);
			}
            return { data: dataJSON.data};
        },
        error: function(jqErr, err_stat, err_str) // ERROR EN EL ASP
        {
			fn_mensaje_boostrap(jqErr.responseText, g_tit, $("") );
        }
    }
	
	$grid_principal.pqGrid( "option", "dataModel", dataModel );				
    $grid_principal.pqGrid( "refreshDataAndView" );
	$grid_principal.pqGrid( "option", "title", "Total Registros: "+total_register);
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
/*function fn_grilla_tres(per, reg, ciclo, ruta)
{
    fn_filtro_3(per, reg, ciclo, ruta);
	
    var dataModel = 
    {        
        location: "remote",
        sorting: "local",
        dataType: "json",
        method: "POST",
        sortDir: ["up", "down"],
		async:false,
        url: my_url+"?"+jQuery.param( parameters ),
        getData: function (dataJSON) 
        {
			total_register = $.trim(dataJSON.totalRecords);
			var data = dataJSON.data;
			sql_grid_3=dataJSON.sql;
			if(total_register>=1)
			{
				$("#co_excel2").attr("disabled", false);
			}
            return { data: dataJSON.data};
        },
        error: function(jqErr, err_stat, err_str) // ERROR EN EL ASP
        {
			fn_mensaje_boostrap(jqErr.responseText, g_tit, $("") );
        }        
    }

	$grid_ruta.pqGrid( "option", "dataModel", dataModel );
    $grid_ruta.pqGrid( "refreshDataAndView" );
    $grid_ruta.pqGrid( "option", "title", "Clientes Facturados por Ruta - [ Periodo: "+ per +" - Regional: "+ reg +" - Ciclo: "+ ciclo+" - Ruta: "+ruta+" )");

}*/

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_filtro()
{
	parameters = 
    {
		"func":"fn_grid_principal",
		"empresa":$("#tx_empresa").val(),
		"p_periodo":$("#tx_fil_periodo").val(),
        "p_cod_regional":$("#cb_fil_regional").val(),
        "p_ciclo":$("#cb_fil_ciclo").val()
		
    };
	
	Filtros = [];
	
	if ($("#fec_proc_ini").val()!='') Filtros.push('Fecha Proceso = '+$("#fec_proc_ini").val() + ' hasta ' +$("#fec_proc_fin").val());
	if ($("#fec_libro_ini").val()!='') Filtros.push('Fecha Libro = '+$("#fec_libro_ini").val() + ' hasta ' +$("#fec_libro_fin").val());
	if ($("#fec_lec_ini").val()!='') Filtros.push('Fecha Lectura = '+$("#fec_lec_ini").val() + ' hasta ' +$("#fec_lec_fin").val());
	if ($("#fec_fac_ini").val()!='') Filtros.push('Fecha Facturación = '+$("#fec_fac_ini").val() + ' hasta ' +$("#fec_fac_fin").val());
	
	$("#filtro").val(Filtros);
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_tipolectura()
	{
		/*$("#cb_tipo_lec").html("");
		//$("#cb_ciclo").html("");
		//$("#tx_desc").val("");
		//if($.trim($("#cb_tarifa").val())=="")
		//	return false;
		
		var param= 
			{
				"func":"fn_tipolectura",
				"empresa":$("#tx_empresa").val()  
			};
		HablaServidor(url, param, "text", function(text) 
			{
              if(text != "")
				 $("#cb_tipo_lec").html(text);
				
			});
        */
        $("#cb_tipo_lec").html("<option value =''>  </option><option value='8100' selected>lectura 1</option><option value='1000'  >lactura 2</option><option value='4000'>lectura 3</option><option value='2000'>lectura 4</option><option value='3000'  >lectura 5</option>");
	}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_limpia_filtro() 
{
	$("#fec_proc_ini").val("");
	$("#fec_proc_fin").val("");
	$("#fec_libro_ini").val("");
	$("#fec_libro_fin").val("");
	$("#fec_lec_ini").val("");
	$("#fec_lec_fin").val("");
	$("#fec_fac_ini").val("");
	$("#fec_fac_fin").val("");
    $("#cb_tipo_lec").val("");
	
}


