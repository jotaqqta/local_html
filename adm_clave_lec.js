var g_modulo="Facturación de Clientes - Lecturas y Consumos";
var g_tit = "Administrador de Claves de Lectura";
var $grid_principal;
//var $grid_2;
//var $grid_ruta;
var parameters = {};
var Filtros = [];
var sql_grid_prim = "";
//var sql_grid_dos = "";
//var sql_grid_3 = "";
//var url = "adm_clave_lec.asp";

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
    
	$("#div_header").load("syn_globales/header.htm", function() {  //  /raiz/
		$("#div_mod0").html(g_modulo);
		$("#div_tit0").html(g_tit);	
	}); 
	$("#excel_archivo").val("Agenda_facturacion.xls");
	
	//Se cargan las variables que vienen desde el server
	/*$("#tx_empresa").val(SYNSegCodEmpresa);
	$("#tx_rol").val(SYNSegRol);
	$("#tx_ip").val(SYNSegIP);
	$("#tx_rolfun").val(SYNSegRolFuncion);
	  */  
    $("#tx_empresa").val("1");
	  
    // INICIA CON EL CURSOR EN EL CAMPO FECHA
	//$("#fec_proc_ini").focus();
	$("._input_selector").inputmask("dd/mm/yyyy");
    
    
    
	$("#form_info").hide();
    //DEFINE LA GRILLA PRINCIPAL
    fn_setea_grid_principal();
	//fn_carga_periodo();
    $("#div_footer").load("syn_globales/footer.htm");  //  /raiz/ 
    //DIBUJA LOS ICONOS DE LOS BOTONES     
    
    $("#co_nuevo").html("<span class='glyphicon glyphicon-plus'></span> Nuevo");
    $("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
    //$("#co_volver_2").html("<span class='glyphicon glyphicon-chevron-left'></span> Volver");
    //$("#co_volver_3").html("<span class='glyphicon glyphicon-chevron-left'></span> Volver");
    $("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");    
    //$("#co_excel2").html("<span class='glyphicon glyphicon-save'></span> Excel");
    //$("#co_excel3").html("<span class='glyphicon glyphicon-save'></span> Excel");

    
        //borrar cuando se haga asp - halarlo de la consulta sql
   
    //EVENTO BOTONES
	
    $("#co_nuevo").on("click", fn_nuevo);
    
     $("#co_cerrar").on("click", function (e) {
        window.close(); 
    });    
    
    //fn_tipolectura();
	
	
	$("#co_close").on("click", function (e) {
        $('#div_filtro_bts').modal('hide'); 
		fn_limpia_filtro();
    });
	
	$("#co_fil_aceptar").on("click", function (e) {
        
         
        /*if($("#fec_proc_ini").val() != ""){
		if (fn_validar_fecha($("#fec_proc_ini").val()) == false){
			fn_mensaje_boostrap("INFORMACI�N INCORRECTA EN EL CAMPO FECHA DE PROCESO INICIAL. EL FORMATO ES DD/MM/YYYY", g_tit, $("#fec_proc_ini") );
			return false;
		   }
	    }
        if($("#fec_proc_fin").val() != ""){
		if (fn_validar_fecha($("#fec_proc_fin").val()) == false){
			fn_mensaje_boostrap("INFORMACI�N INCORRECTA EN EL CAMPO FECHA DE PROCESO FINAL. EL FORMATO ES DD/MM/YYYY", g_tit, $("#fec_proc_fin") );
			return false;
		   }
	    }
        
        if( $("#fec_proc_ini").val() == "" && $("#fec_proc_fin").val() != "") {
                fn_mensaje_boostrap("Debe diligenciar las dos fechas", g_tit, $("#fec_proc_ini"));
                return;
            }
        /*if( $("#fec_proc_ini").val() != "" && $("#fec_proc_fin").val() == "") {
                fn_mensaje_boostrap("Debe diligenciar las dos fechas", g_tit, $("#fec_proc_fin"));
                return;
            }*/

        /*if($("#fec_libro_ini").val() != ""){
		if (fn_validar_fecha($("#fec_libro_ini").val()) == false){
			fn_mensaje_boostrap("INFORMACI�N INCORRECTA EN EL CAMPO FECHA DE LIBRO INICIAL. EL FORMATO ES DD/MM/YYYY", g_tit, $("#fec_libro_ini") );
			return false;
		   }
	    }
        if($("#fec_libro_fin").val() != ""){
		if (fn_validar_fecha($("#fec_libro_fin").val()) == false){
			fn_mensaje_boostrap("INFORMACI�N INCORRECTA EN EL CAMPO FECHA DE LIBRO FINAL. EL FORMATO ES DD/MM/YYYY", g_tit, $("#fec_libro_fin") );
			return false;libro
		   }
	    }
        if( $("#fec_libro_ini").val() == "" && $("#fec_libro_fin").val() != "") {
                fn_mensaje_boostrap("Debe diligenciar las dos fechas", g_tit, $("#fec_libro_ini"));
                return;
           }
       /*  if( $("#fec_libro_ini").val() != "" && $("#fec_libro_fin").val() == "") {
                fn_mensaje_boostrap("Debe diligenciar las dos fechas", g_tit, $("#fec_libro_fin"));
                return;
            }
*/
         /*if($("#fec_lec_ini").val() != ""){
		if (fn_validar_fecha($("#fec_lec_ini").val()) == false){
			fn_mensaje_boostrap("INFORMACI�N INCORRECTA EN EL CAMPO FECHA DE LECTURA INICIAL. EL FORMATO ES DD/MM/YYYY", g_tit, $("#fec_lec_ini") );
			return false;
		   }
	    }
        if($("#fec_lec_fin").val() != ""){
		if (fn_validar_fecha($("#fec_lec_fin").val()) == false){
			fn_mensaje_boostrap("INFORMACI�N INCORRECTA EN EL CAMPO FECHA DE LECTURA FINAL. EL FORMATO ES DD/MM/YYYY", g_tit, $("#fec_lec_fin") );
			return false;
		   }
	    }
        if( $("#fec_lec_ini").val() == "" && $("#fec_lec_fin").val() != "") {
                fn_mensaje_boostrap("Debe diligenciar las dos fechas", g_tit, $("#fec_lec_ini"));
                return;
            }
/*if( $("#fec_lec_ini").val() != "" && $("#fec_lec_fin").val() == "") {
                fn_mensaje_boostrap("Debe diligenciar las dos fechas", g_tit, $("#fec_lec_fin"));
                return;
            }*/
        
         /*if($("#fec_fac_ini").val() != ""){
		if (fn_validar_fecha($("#fec_fac_ini").val()) == false){
			fn_mensaje_boostrap("INFORMACI�N INCORRECTA EN EL CAMPO FECHA DE FACTURACI�N INICIAL. EL FORMATO ES DD/MM/YYYY", g_tit, $("#fec_fac_ini") );
			return false;
		   }
	    }
        if($("#fec_fac_fin").val() != ""){
		if (fn_validar_fecha($("#fec_fac_fin").val()) == false){
			fn_mensaje_boostrap("INFORMACI�N INCORRECTA EN EL CAMPO FECHA DE FACTURACI�N FINAL. EL FORMATO ES DD/MM/YYYY", g_tit, $("#fec_fac_fin") );
			return false;
		   }
	    }
        
        if( $("#fec_fac_ini").val() == "" && $("#fec_fac_fin").val() != "") {
                fn_mensaje_boostrap("Debe diligenciar las dos fechas", g_tit, $("#fec_fac_ini"));
                return;
            }
       /* if( $("#fec_fac_ini").val() != "" && $("#fec_fac_fin").val() == "") {
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
        
        fn_carga_grid_principal();
		
		$('#div_filtro_bts').modal('hide'); //cerrar modal
		
		
        
    });
	
	
	$("#co_fil_limpiar").on("click", function (e) {
        fn_limpia_filtro(); 
    });
    
    //EVENTO DBL_CLICK DE LA GRILLA
    $grid_principal.pqGrid({
		rowDblClick: function( event, ui ) {
			if (ui.rowData) 
				{
					var dataCell = ui.rowData;
					g_cod_select = dataCell.C1;
                    g_desc_select = dataCell.C2;
					//$("#div_ciclo_ruta").show();
    				//$("#div_prim0").hide();
                    
                    $("#tx_codigo").val(g_cod_select);
					$("#tx_desc").val(g_desc_select);
                    $("#div_filtro_bts").modal({backdrop: "static",keyboard:false});
                    $("#div_filtro_bts").on("shown.bs.modal", function () {
                    $("#div_filtro_bts div.modal-footer button").focus();
                    });
                    //$grid_2.pqGrid("refreshView");
					//fn_grilla_dos(dataCell.C1, dataCell.C2, dataCell.C3, dataCell.C5);
				}
			}
	});
	
	
	$("#div_filtro_bts").draggable({
        handle: ".modal-header"
    });
	
    Filtros = [];
    
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
            //$("filtro").val(Filtros);		 --lo coloque por si las pero no funciono	
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
        { C1: '000', C2: 'LECTURA SIN NOVEDAD',   C3: 'ACTIVO' }, 
        { C1: '004', C2: 'MEDIDOR REGISTRO ROTO', C3:'ACTIVO' },
        { C1: '005', C2: 'MEDIDOR REGISTRO PARADO', C3:'ACTIVO'}, 
        { C1: '009', C2: 'TAPA NO ABRE',            C3:'ACTIVO' },	 
    ]  
    var obj = {  
	        height: "100%",
            showTop: true,
			showBottom:true,
            showTitle : false,
			title: "Administrador de Claves de Lectura",
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
                   { type: "button", label: " Nuevo"        ,  attr:"id=co_nuevo"       , cls:"btn btn-primary"},
                   { type: "button", label: " Excel"        ,  attr:"id=co_excel"       , cls:"btn btn-primary"},
                   { type: "button", label: " Cerrar"       ,  attr:"id=co_cerrar"      , cls:"btn btn-secondary"},
               ]
           }
        };
		
		obj.colModel = [		
          { title: "C�digo", width: 150, dataType: "string", dataIndx: "C1", halign:"center", align:"center"},
        { title: "Descripci�n", width: 250, dataType: "string", dataIndx: "C2", halign:"center", align:"left" },
        { title: "Estado", width: 150, dataType: "string", dataIndx: "C3", halign:"center", align:"center" },
        /*{ title: "Fecha Libro", width: 120, dataType: "string", dataIndx: "C4", halign:"center", align:"center"},
        { title: "Fecha Lectura", width: 120, dataType: "string", dataIndx: "C5", halign:"center", align:"center" },
        { title: "Fecha Facturaci�n", width: 125, dataType: "string", dataIndx: "C6", halign:"center", align:"center" },
        { title: "Fecha Reparto", width: 120, dataType: "string", dataIndx: "C7", halign:"center", align:"center" },
        
        { title: "Vcto. Normal ", width: 120, dataType: "string", dataIndx: "C8", halign:"center", align:"center" },
        { title: "Corte Normal", width: 120, dataType: "string", dataIndx: "C9", halign:"center", align:"center" },
        { title: "Vcto. Gobierno ", width: 120, dataType: "string", dataIndx: "C10", halign:"center", align:"center" },
        { title: "Corte Gobierno", width: 130, dataType: "string", dataIndx: "C11", halign:"center", align:"center" }*/
        ];
	obj.dataModel = { data: data };	
	
    $grid_principal = $("#div_grid_principal").pqGrid(obj);
	

	
}
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_nuevo()
{
	fn_limpia();
    fn_tipolectura();
       /*var parameters = {
				"func":"fn_fechaservidor"
				
                };

		HablaServidor(url,parameters,"text", function(text) 
		{
			var param = text.split("|");
			$("#fec_proc_fin").val(param[0]);
    		 $("#fec_libro_fin").val(param[0]);
			$("#fec_lec_fin").val(param[0]);
			$("#fec_fac_fin").val(param[0]);

		});		
      */
   
   
    $("#div_filtro_bts").modal({backdrop: "static",keyboard:false});
	$("#div_filtro_bts").on("shown.bs.modal", function () {
		$("#div_filtro_bts div.modal-footer button").focus();
		//Aplicar trabajo cuando esta visible el objeto	
		
	});

}


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
        url: url+"?"+jQuery.param( parameters ),
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
function fn_filtro()
{
	parameters = 
    {
		"func":"fn_grid_principal",
		"empresa":$("#tx_empresa").val(),
		"p_fec_proc_ini":$("#fec_proc_ini").val(),
        "p_fec_proc_fin":$("#fec_proc_fin").val(),
        "p_fec_libro_ini":$("#fec_libro_ini").val(),
        "p_fec_libro_fin":$("#fec_libro_fin").val(),
        "p_fec_lec_ini":$("#fec_lec_ini").val(),
        "p_fec_lec_fin":$("#fec_lec_fin").val(),
        "p_fec_fac_ini":$("#fec_fac_ini").val(),
        "p_fec_fac_fin":$("#fec_fac_fin").val(),
		"p_cb_tipo_lec":$("#cb_tipo_lec").val(),
        
    };
	
	Filtros = [];
	
	if ($("#fec_proc_ini").val()!='') Filtros.push('Fecha Proceso = '+$("#fec_proc_ini").val() + ' hasta ' +$("#fec_proc_fin").val());
	if ($("#fec_libro_ini").val()!='') Filtros.push('Fecha Libro = '+$("#fec_libro_ini").val() + ' hasta ' +$("#fec_libro_fin").val());
	if ($("#fec_lec_ini").val()!='') Filtros.push('Fecha Lectura = '+$("#fec_lec_ini").val() + ' hasta ' +$("#fec_lec_fin").val());
	if ($("#fec_fac_ini").val()!='') Filtros.push('Fecha Facturaci�n = '+$("#fec_fac_ini").val() + ' hasta ' +$("#fec_fac_fin").val());
	if ($("#cb_tipo_lec").val()!='') Filtros.push('Tipo Lectura = '+$("#cb_tipo_lec").val() );
	
	$("#filtro").val(Filtros);
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_tipolectura()
	{
		$("#cb_tipo_lec").html("");
		
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
       
        //$("#cb_tipo_lec").html("<option value =''>  </option><option value='8100' selected>lectura 1</option><option value='1000'  >lactura 2</option><option value='4000'>lectura 3</option><option value='2000'>lectura 4</option><option value='3000'  >lectura 5</option>");
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


