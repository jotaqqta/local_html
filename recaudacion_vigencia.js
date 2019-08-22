var g_modulo="Ajustes";
var g_tit ="Permisos de Ajuste para usuarios";
var $grid_principal, $grid2, $grid3;
var g_rol_selec = "";
var g_alto_aux = 0;

$(document).ready(function() {
    
    // PARA ELIMINAR EL SUBMIT
	$("button").on("click", function(){return false;});

    //INGRESA LOS TITULOS
    document.title = g_tit ;
    
    $("#div_mod0").html(g_modulo);
    $("#div_tit0").html(g_tit );
    $("#tituloexcel").val(g_tit );
	$("#excel_archivo").val("ajustes_rol.xls");
	$("#Rol").val(fn_get_param("Rol"));

	$("#tx_empresa").val(fn_get_param("Empresa"));
	$("#tx_rol").val(fn_get_param("Rol"));
	$("#tx_rolfun").val(fn_get_param("RolFun"));
	$("#tx_ip").val(fn_get_param("Ip"));
        
    //DEFINE LA GRILLA PRINCIPAL
    fn_setea_grid_principal();
    
    //DIBUJA LOS ICONOS DE LOS BOTONES     
    
    $("#co_nuevo").html("<span class='glyphicon glyphicon-plus'></span> Filtro");
    $("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
    $("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");    
    $("#co_excel2").html("<span class='glyphicon glyphicon-save'></span> Excel");

    //EVENTO BOTONES
    $("#co_filtro").on("click", fn_Muestra_Filtro);
    
    $("#co_nuevo").on("click", fn_filtro);
    
    $("#co_excel").on("click", function (e) {
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
			$("#frm_Exel").submit();
			return;
		}
		e.preventDefault();		
    });
    
    $("#co_cerrar").on("click", function (e) {
        if($.trim($("#co_cerrar").text()) == "Cerrar")
            window.close(); 
    });    
    
    $("#co_volver2").on("click", function (e) {
        if($.trim($("#co_volver2").text()) == "Volver")
        {
            fn_volver();
        }
    });
    
    $("#co_volver3").on("click", fn_volver);

    $("#co_close").on("click", function (e) {
        $('#div_filtro_bts').modal('hide'); 
    });
    
    //EVENTO DBL_CLICK DE LA GRILLA
    $grid_principal.pqGrid({
		rowDblClick: function( event, ui ) {
			if (ui.rowData) 
				{
					var dataCell = ui.rowData;
					g_rol_selec = dataCell.c1;
                    fn_muestra_edicion();
				}
			}
	});
    
    $("#co_cancelar1").click(function(){
        if($.trim($("#co_cancelar1").text()) == "Volver"){
            fn_volver();    
        } else{
            fn_limpiar();
            $("#tx_rol1").prop("readonly", false);
            $("#co_leer1").prop("disabled",false);
            $("#tx_rol1").focus();
            $("#co_cancelar1").html("<span class='glyphicon glyphicon-chevron-left'></span> Volver");
        }
    });
    
    $("#co_cancelar2").click(function(){
        $("#tx_rol2").val("");
        $("#tx_nombre2").val("");
        $("#tx_rol2").prop("readonly", false);
        $("#co_leer2").prop("disabled", false);
        $("#tx_rol2").focus();
    });
    
    $("#co_guardar").click(function(){
        if($.trim($("#co_guardar").text()) == "Guardar"){
            if( ! fn_valida_guardar() ) return;
			$("#tx_obs_apr").val("");
            $("#dlg_obs h4.modal-title").html("Ingrese la observación para el ingreso a realizar:");
			$("#dlg_obs").modal({backdrop: "static",keyboard:false});
			$("#dlg_obs").on("shown.bs.modal", function () {
				$("#tx_obs_apr").focus();
			});	
		}else{
            if( ! fn_valida_actualizar() ) return;
            $("#tx_obs_apr").val("");
            $("#dlg_obs h4.modal-title").html("Ingrese la observación para la actualización a realizar:");
			$("#dlg_obs").modal({backdrop: "static",keyboard:false});
			$("#dlg_obs").on("shown.bs.modal", function () {
				$("#tx_obs_apr").focus();
			});	
        }
		
    });
    
    $("#co_anular").click(function(){
		$("#tx_obs_anu").val("");
		$("#dlg_obs_anu").modal({backdrop: "static",keyboard:false});
		$("#dlg_obs_anu").on("shown.bs.modal", function () {
			$("#tx_obs_anu").focus();
		});	
    });
    
    
    $("#co_leer1").on("click", fn_leer_rol);
    
    $("#tx_rol1").on("keydown", function(event) {
        var tecla =  event.which || event.keyCode;
        if(tecla==13)
        {		
            $("#co_leer1").trigger( "click" );
            return false;
        }
    });
    
    $("#co_leer2").on("click", fn_leer_rol2);
    
    $("#tx_rol2").on("keydown", function(event) {
        var tecla =  event.which || event.keyCode;
        if(tecla==13)
        {		
            $("#co_leer2").trigger( "click" );
            return false;
        }
    });
	
	$("#co_confirmar_anu").click(function(){
		fn_anular();
	});
	
	$("#co_confirmar").click(function(){
        if($.trim($("#co_guardar").text()) == "Guardar"){
            fn_ingresar();
        }else{
            fn_actualizar();
        }
	});
	
	$("#co_can_con").click(function(){
		$("#dlg_obs").modal("hide");
	});
	
	$("#co_can_anu").click(function(){
		$("#dlg_obs_anu").modal("hide");
	});
    
    
    $("#toolbar_pr").hide();
    
    setTimeout(function(){ fn_carga_grid_principal()  }, 0);
    
    setTimeout(function(){ fn_carga_grid2()  }, 0);
    
    g_alto_aux =$("#bd_prin").height();
    
    /*$("#div_filtro_bts").draggable({
        handle: ".modal-header"
    });*/
    
});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_setea_grid_principal()
{
        
    var obj = {
        //width:'100%',     
        height: '100%',
        showTop: true,
        showBottom:true,
        showTitle : false,
        roundCorners: true,
        rowBorders: true,
        columnBorders: true,
        collapsible:false,
        editable:false,
        fillHandle: "",
        filterModel: { on: true, mode: "AND", header: true },
        selectionModel: { type: 'row',mode:'single'},
        numberCell: { show: true },
        //title: "<b>Convenios pendientes por aprobar</b>",
        pageModel: { rPP: 50, type: "local", rPPOptions: [20, 50, 100]},
        scrollModel:{theme:true},
        toolbar:
       {
           cls: "pq-toolbar-export",
           items:
           [
               { type: "button", label: " Filtro"      ,  attr:"id=co_nuevo"     , cls:"btn btn-primary"},
               { type: "button", label: " Excel"        ,  attr:"id=co_excel"       , cls:"btn btn-primary"},
               { type: "button", label: " Cerrar"       ,  attr:"id=co_cerrar"      , cls:"btn btn-primary"},
           ]
       }
    };


    obj.colModel = [            
        { title: "Año", width: 120, dataType: "string", dataIndx: "c1", halign:"center", align:"left"},
        { title: "Mes", width: 120, dataType: "string", dataIndx: "c2", halign:"center", align:"left"},
        { title: "Año Documento", width: 140, dataType: "float", dataIndx: "c3", halign:"center", align:"left",
            filter: { type: "textbox", condition: "contain", listeners: ["keyup"]} },
        { title: "Agua", width: 200, dataType: "string", dataIndx: "c4", halign:"center", align:"left"},
        { title: "Alcantarillado", width: 200, dataType: "string", dataIndx: "c5", halign:"center", align:"left"},
        { title: "Tasa Trata Agua", width: 200, dataType: "string", dataIndx: "c6", halign:"center", align:"left"},
        { title: "Valorización", width: 200, dataType: "string", dataIndx: "c7", halign:"center", align:"left"},
        { title: "Otros", width: 200, dataType: "string", dataIndx: "c7", halign:"center", align:"left"}
    ];
		

    $grid_principal = $("#div_grid_principal").pqGrid(obj);
	$grid_principal.pqGrid( "scrollRow", { rowIndxPage: 21 } );     
	
    
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_filtro()
{
    $("#dlg_obs").modal({backdrop: "static",keyboard:false});
			$("#dlg_obs").on("shown.bs.modal", function () {
				$("#tx_fil_fec_ini").focus();
			});
}


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_Muestra_Filtro()
{
    $("#div_filtro_bts").modal({backdrop: "static",keyboard:false});
    $("#div_filtro_bts").modal("show");
	$("#div_filtro_bts").on("shown.bs.modal", function () {
		$("#div_filtro_bts div.modal-footer button").focus();
		//Aplicar trabajo cuando esta visible el objeto	
	});
    $("#tit_filtro").text("Prueba");
// $('#div_filtro_bts').modal('show');

}


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_carga_grid_principal()
{
    
    parameters = {
        "func":"fn_dat_grilla_prin",
        "empresa":$("#Empresa").val(),
        "RolFun":$("#RolFun").val(),
        "rol":$("#Rol").val(),
        "ip":$("#Ip").val(),
        "p_rol_usu":$("#tx_rol1").val()
    };

    
    HablaServidor("ajuste_rol_grid1.json",parameters,"json", function(text) 
    {
        $grid_principal.pqGrid( "option", "dataModel.data", text);
        $grid_principal.pqGrid( "refreshDataAndView" );
    });
    
}


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_ingresar()
{
	var dato_id;
	
	if($("#tx_obs_apr").val().length <15)
	{
		fn_mensaje_boostrap("LA OBSERVACIÓN DEBE TENER AL MENOS 15 CARACTERES", g_tit, $("#tx_obs_apr"));
		return false;
	}
	
	var param= 
	{
		"func": "fn_graba_rol_aju",
		"empresa":$("#tx_empresa").val(),
		"rol":$("#tx_rol").val(),
		"ip":$("#tx_ip").val(),
		"p_rol_usu":$("#tx_rol1").val(),
        "p_rol_pad":$("#tx_rol2").val(),
        "p_permisos":$("#tx_permisos").val(),
		"p_observacion":$("#tx_obs_apr").val()
	};
	
	$("#dlg_obs").modal("hide");
	
	HablaServidor(my_url, param, "text", function(resp_serv) 
	{
		if($.trim(resp_serv)=="")
		{
			resp_serv = "ACCIÓN REALIZADA!!!";
			fn_carga_grid2();
		}
		
		fn_mensaje_boostrap(resp_serv, g_tit, $(""));		
	});
	
}


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_actualizar()
{
	var dato_id;
	
	if($("#tx_obs_apr").val().length <15)
	{
		fn_mensaje_boostrap("LA OBSERVACIÓN DEBE TENER AL MENOS 15 CARACTERES", g_tit, $("#tx_obs_apr"));
		return false;
	}
	
	var param= 
	{
		"func": "fn_actualiza_rol_aju",
		"empresa":$("#tx_empresa").val(),
		"rol":$("#tx_rol").val(),
		"ip":$("#tx_ip").val(),
		"p_rol_usu":$("#tx_rol1").val(),
        "p_rol_pad":$("#tx_rol2").val(),
        "p_permisos":$("#tx_permisos").val(),
		"p_observacion":$("#tx_obs_apr").val()
	};
	
	$("#dlg_obs").modal("hide");
	
	HablaServidor(my_url, param, "text", function(resp_serv) 
	{
		if($.trim(resp_serv)=="")
		{
			resp_serv = "ACCIÓN REALIZADA!!!";
			fn_carga_grid2();
		}
		
		fn_mensaje_boostrap(resp_serv, g_tit, $(""));		
	});
	
}


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_anular()
{
	var dato_id;
	
	if($("#tx_obs_anu").val().length <15)
	{
		fn_mensaje_boostrap("LA OBSERVACIÓN DEBE TENER AL MENOS 15 CARACTERES", g_tit, $("#tx_obs_anu"));
		return false;
	}
	
	var param= 
	{
		"func": "fn_elimina_rol_aju",
		"empresa":$("#tx_empresa").val(),
		"rol":$("#tx_rol").val(),
		"ip":$("#tx_ip").val(),
		"p_rol_usu":$("#tx_rol1").val(),
        "p_rol_pad":$("#tx_rol2").val(),
        "p_permisos":$("#tx_permisos").val(),
		"p_observacion":$("#tx_obs_anu").val()
	};
	
	$("#dlg_obs_anu").modal("hide");
	
	HablaServidor(my_url, param, "text", function(resp_serv) 
	{
		if($.trim(resp_serv)=="") 
		{
			resp_serv = "ACCIÓN REALIZADA!!!";
			fn_carga_grid_principal();
		}
		
		fn_mensaje_boostrap(resp_serv, g_tit, $(""));		
	});
	
}


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_leer_rol()
{
    if ($.trim($(this).text()) == "Leer")
    {
        if($.trim($("#tx_rol1").val()) != "")
        {
            $("#co_cancelar1").html("<span class='glyphicon glyphicon-remove'></span> Cancelar");
            fn_carga_datos();
            if($.trim($("#tx_rol2").val()) != "" ){
                fn_carga_datos2();
            }
            if( ($.trim($("#tx_rol2").val()) != "" && $.trim($("#tx_nombre2").val())!== "") || parseInt($("#tx_per_can").val()) >0 ){
                $("#co_guardar").html("<span class='glyphicon glyphicon-check'></span> Actualizar");
                fn_mensaje_boostrap("EL ROL DIGITADO YA EXISTE EN LA CONFIGURACIÓN DE AJUSTES, SE MUESTRA LA INFORMACIÓN PARA QUE ACTUALICE O COMPLETE LOS DATOS", g_tit, $(""));
            }
            if($.trim($("#tx_rol2").val()) == "" || $.trim($("#tx_nombre2").val()) == ""){
                $("#tx_rol2").prop("readonly", false);
                $("#tx_rol2").focus();
            }
            
        }
        else
            fn_mensaje_boostrap("DEBE DIGITAR EL ROL", g_tit, $("#tx_rol1"));
    }		

}


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_leer_rol2()
{
    if($.trim($("#tx_rol2").val()) != "")
    {
        fn_carga_datos2();
    }
    else
        fn_mensaje_boostrap("DEBE DIGITAR EL ROL PADRE", g_tit, $("#tx_rol2"));
    
}


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_carga_datos()
{
    dato_original = [];

    parameters = {
        "func":"fn_generales",
        "empresa":$("#tx_empresa").val(),
        "RolFun":$("#tx_rolfun").val(),
        "rol":$("#tx_rol").val(),
        "ip":$("#tx_ip").val(),
        "p_rol_usu":$("#tx_rol1").val()
    };

    HablaServidor("ajuste_rol_dat.txt",parameters,'text', function(text) 
    {
        if($.trim(text)=="") {
            fn_mensaje("ROL NO EXISTE", g_tit, $("#tx_rol1"));
            return 0;
        }

        dato_original = text.split("|");
        $("#tx_nombre").val(dato_original[1]);
        $("#tx_area").val(dato_original[2]);
        $("#tx_regional").val(dato_original[3]);
        $("#tx_cod_area").val(dato_original[4]);
        $("#tx_cod_regional").val(dato_original[5]);
        
        $("#tx_rol2").val(dato_original[6]);
        $("#tx_rol_padre").val(dato_original[6]);
        $("#tx_per_can").val(dato_original[7]);
        
        
        $("#co_leer1").prop("disabled", true);
        $("#tx_rol1").prop("readonly", true);
        $("#co_leer2").prop("disabled", false);
        $("#co_cancelar2").prop("disabled", false);
    });

}


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_carga_datos2()
{
    dato_original = [];

    parameters = {
                    "func":"fn_generales2",
                    "empresa":$("#tx_empresa").val(),
                    "RolFun":$("#tx_rolfun").val(),
                    "rol_padre":$("#tx_rol2").val(),
                    "rol":$("#tx_rol").val(),
                    "ip":$("#tx_ip").val()
                };

    HablaServidor("ajuste_rol_dat.txt",parameters,'text', function(text) 
    {

        if($.trim(text)=="") {
            fn_mensaje("ROL NO EXISTE", g_tit, $("#tx_rol2"));
            return 0;
        }

        dato_original = text.split("|");
        $("#tx_rol2").val(dato_original[0]);
        $("#tx_nombre2").val(dato_original[1]);
        $("#co_leer2").prop("disabled", true);
        $("#tx_rol2").prop("readonly", true);			
        
    });

}



//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_limpiar()
{
    $("#tx_rol1").val("");
    $("#tx_rol_edit").val("");
    $("#tx_nombre").val("");
    $("#tx_area").val("");
    $("#tx_regional").val("");
    $("#tx_cod_area").val("");
    $("#tx_cod_regional").val("");  
    $("#tx_permisos").val("");
    $("#tx_per_can").val("");
    $("#tx_rol2").val("");  
    $("#tx_rol_padre").val("");  
    $("#tx_nombre2").val("");

}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_volver()
{
    $("#bd_prin").slideDown();
    $("#div_secun").slideUp();
    $("#toolbar_pr").hide();
    $("#bd_prin").height(g_alto_aux);
    $grid_principal.pqGrid( "reset", { group: true, filter: true } );	//se limpian los filtros
    $grid_principal.pqGrid( "refreshView" );
    $(window).scrollTop(0);
}


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_valida_guardar()
{
    if( $.trim( $("#tx_rol1").val() ) == "" || $.trim( $("#tx_nombre").val() ) == "" ){
        fn_mensaje_boostrap("DEBE SUMINISTRAR LA INFORMACIÓN DEL ROL", g_tit , $("#tx_rol1"));
        return false;    
    }
    if( $.trim( $("#tx_rol2").val() ) == "" || $.trim( $("#tx_nombre2").val() ) == "" ){
        fn_mensaje_boostrap("DEBE SUMINISTRAR LA INFORMACIÓN DEL ROL PADRE", g_tit , $("#tx_rol2"));
        return false;    
    }
    
    var a = 0;
	var coleccionDatos="";
    var per_sel = 0;
	var element =$grid2.pqGrid("option","dataModel.data");
	
	if (element)
		a= element.length;
	else 
		a= 0;
	
	for (var i = 0; i < a; i++) {
		var row = element[i];
        if(row.c3 == true) {
            per_sel++;
            coleccionDatos = coleccionDatos + row.c1 + "|" //id
        }
	}
    
    $("#tx_permisos").val(coleccionDatos);
    
    if(per_sel == 0){
        fn_mensaje_boostrap("DEBE SELECCIONAR POR LO MENOS UN PERMISO DE AJUSTE", g_tit , $(""));
        return false;
    }
    
    return true;
}


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_valida_actualizar()
{
    if( $.trim( $("#tx_rol1").val() ) == "" || $.trim( $("#tx_nombre").val() ) == "" ){
        fn_mensaje_boostrap("DEBE SUMINISTRAR LA INFORMACIÓN DEL ROL", g_tit , $("#tx_rol1"));
        return false;    
    }
    if( $.trim( $("#tx_rol2").val() ) == "" || $.trim( $("#tx_nombre2").val() ) == "" ){
        fn_mensaje_boostrap("DEBE SUMINISTRAR LA INFORMACIÓN DEL ROL PADRE", g_tit , $("#tx_rol2"));
        return false;    
    }
    
    var a = 0;
    var cambios = 0;
	var coleccionDatos="";
    var per_sel = 0;
	var element =$grid2.pqGrid("option","dataModel.data");
	
	if (element)
		a= element.length;
	else 
		a= 0;
	
	for (var i = 0; i < a; i++) {
		var row = element[i];
        if(row.c3 == true) {
            per_sel++;
            coleccionDatos=coleccionDatos + row.c1 + "|" //id
        }
        if(row.c3 != row.c4){
            cambios++;
            coleccionDatos=coleccionDatos + row.c1 + "|" //id
        }
	}
    
    if(cambios == 0 && $("#tx_rol2").val() == $("#tx_rol_padre").val() ){
        fn_mensaje_boostrap("NO EXISTEN CAMBIOS PARA GUARDAR", g_tit , $(""));
        return false;
    }
    
    $("#tx_permisos").val(coleccionDatos);
    
    if(per_sel == 0){
        fn_mensaje_boostrap("DEBE SELECCIONAR POR LO MENOS UN PERMISO DE AJUSTE", g_tit , $(""));
        return false;
    }
    
    return true;
}


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
	