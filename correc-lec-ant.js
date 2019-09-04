var g_modulo="Facturación Clientes - Lecturas y Consumos";
var g_titulo="Facturación de Clientes";
var parameters = {};
var my_url = "reasigna_ajuste.asp";
var $grid_conve;
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
    document.title = g_titulo ;
	document.body.scroll = "yes";
    
	$("#div_header").load("/syn_globales/header.htm", function() {
		$("#div_mod0").html(g_modulo);
		$("#div_tit0").html(g_titulo);	
	});
		
	//Se cargan las variables que vienen desde el server
	/*
	$("#tx_empresa").val(SYNSegCodEmpresa);
	$("#tx_rol").val(SYNSegRol);
	$("#tx_ip").val(SYNSegIP);
	$("#tx_rolfun").val(SYNSegRolFuncion);
	*/
	//fn_carga_roles();
	// INICIA CON EL CURSOR EN EL CAMPO No. ORDEN
	$("#tx_orden").focus();

	// EL CAMPO No. Orden lo limito a 8 digitos y solo numeros
	
	jQuery('#tx_orden').keypress(function(tecla) {
        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
	
	$("#tx_orden").on("keydown", function(event) {
        var tecla =  event.which || event.keyCode;
        if(tecla==13)
        {
			if(!$("#tx_cliente").prop("readonly"))  //Readonly se deshabilita el enter
			{	
				$("#co_leer").trigger( "click" );
				return false;
			}
        }
    });
	//Footer
	$("#div_footer").load("/syn_globales/footer.htm");
	// SE INHABILITAN LOS IMPUT
	$("#co_reasignar").prop("disabled",true);
	$("#tx_cod_cliente").prop("disabled",true);
	$("#tx_nombre").prop("disabled",true);
	$("#tx_rol_actual").prop("disabled",true);
	$("#cb_reasigna_nuevo").prop("disabled",true);
	$("#tx_tarifa").prop("disabled",true);
	$("#tx_actividad").prop("disabled",true);
	$("#tx_estado").prop("disabled",true);
	$("#tx_ruta").prop("disabled",true);
    //DIBUJA LOS ICONOS DE LOS BOTONES     
    
   // $("#co_filtro").html("<span class='glyphicon glyphicon-search'></span> Filtros");
    $("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
    $("#co_volver_2").html("<span class='glyphicon glyphicon-chevron-left'></span> Volver");
   //$("#co_volver_3").html("<span class='glyphicon glyphicon-chevron-left'></span> Volver");
   //$("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");    
   //$("#co_excel2").html("<span class='glyphicon glyphicon-save'></span> Excel");
   //$("#co_excel3").html("<span class='glyphicon glyphicon-save'></span> Excel");
    
   

	$("#co_leer").on("click", function(){
		//Validación de informacion
		if ($.trim($("#co_leer").text())=="Leer"){
			if( $("#tx_orden").val() == ""){
				fn_mensaje_boostrap("DIGITE EL NÚMERO DE ORDEN", g_titulo, $("#tx_orden"));
				return;
			}
			$("#co_leer").html("<span class='glyphicon glyphicon-floppy-disk'></span> Actualizar");
			$("#co_cancelar").html("<span class='glyphicon glyphicon-log-out'></span> Cancelar");
			//fn_carga_orden();
		}
		else{
			
			if( $("#cb_reasigna_nuevo").val() == ""){
				fn_mensaje_boostrap("SELECCIONE EL USUARIO PARA REALIZAR LA ASIGNACIÓN", g_titulo, $("#cb_reasigna_nuevo"));
				return;
			}

			if($("#tx_rol_actual").val() == $("#cb_reasigna_nuevo").val())
			{
				fn_mensaje_boostrap("DEBE SELECCIONAR UN USUARIO DIFERENTE AL ACTUAL", g_titulo, $("#cb_reasigna_nuevo"));
				return;
			}
			//////////////////////////////////////////////////////////////
			/////////////////SE ACTUALIZA EL REGISTRO/////////////////////
			//////////////////////////////////////////////////////////////
			fn_act_orden();
			return;	
		}
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
	$("#co_cancelar").on("click",function(){
		if ($.trim($("#co_cancelar").text())=="Cancelar"){
			fn_limpiar();
			return;
		}
		else
			window.close();
	});
    
    	$("#co_auditar").on("click",function(){
		if ($.trim($("#co_auditar").text())=="Ver Auditoria"){
			$("#grilla_uno").hide();
            $("#grilla_dos").show();
            $("#div_grid_dos").pqGrid("refreshView");
		}
		
	});
 
    $("#co_volver_2").on("click", function (e) {
		if ($.trim($("#co_volver_2").text())=="Volver"){
        $("#div_grid").show();
		$("#div_grid_dos").hide();
		$("#div_grid").pqGrid("refreshDataAndView");
	
        }
    });
	
	$("#co_reasignar").on("click",function(){
		if( $("#cb_reasigna_nuevo").val() == ""){
			fn_mensaje_boostrap("FAVOR INDIQUE EL ROL", g_titulo, $("#cb_reasigna_nuevo"));
			return;
		}

		if($("#tx_rol_actual").val() == $("#cb_reasigna_nuevo").val())
		{
			fn_mensaje_boostrap("DEBE SELECCIONAR UN USUARIO DIFERENTE AL ACTUAL", g_titulo, $("#cb_reasigna_nuevo"));
			return;
		}
		//////////////////////////////////////////////////////////////
		/////////////////SE ACTUALIZA EL REGISTRO/////////////////////
		//////////////////////////////////////////////////////////////
		fn_act_orden();

		//$("#tx_orden").focus();
		return;			
	});	
	
    var data = [
        { c1:8000, c2:2000, c3: 'MCUB', c4:2014, c5:97985,c6:1000, c7: 0,c8:89,c9:30},
    { c1:0, c2:0, c3: '', c4:0, c5:0,c6:0, c7: 0,c8:0,c9:0},
    ];
	
	var obj = {
            width: '100%',
            height: 200,
            showTop: true,
			showBottom:false,
            showHeader: true,
            roundCorners: true,
            rowBorders: true,
            columnBorders: true,
			editable:true,
            selectionModel: { type: 'cell' },
            numberCell: { show: false },
            title: "",
			pageModel: {type:"local"},
        	scrollModel:{autoFit:true, theme:true},
			toolbar:
           {
               cls: "pq-toolbar-export",
               items:
               [
                  // { type: "button", label: " Agregar Rol",  attr:"id=co_rol", cls:"btn btn-primary btn-sm glyphicon glyphicon-plus"},
               ]
           }
        };
		
		
		obj.colModel = [
            { title: "Numero medidor",  resizable: false, width: 80, dataType: "number", dataIndx: "c1",halign:"center", align:"right",editable:false },
            { title: "Enteros Decimales", width: 80, dataType: "number", dataIndx: "c2",halign:"center", align:"right",editable:false },
            { title: "Tipo Medida", width: 80, dataType: "string", dataIndx: "c3",halign:"center", align:"right",editable:false },
            { title: "Lectura Anterior", width: 80, dataType: "number", dataIndx: "c4",halign:"center", align:"right"},
            { title: "Lectura Actual", width: 80, dataType: "number", dataIndx: "c4",halign:"center", align:"right",editable:false,editable:false },
            { title: "Consumo", width: 80, dataType: "number", dataIndx: "c5",halign:"center", align:"right",editable:false },
            { title: "CONSUMO A FACTURAR GLS",width: 80, dataType: "number", dataIndx: "c6",halign:"center", align:"right",editable:false },
            { title: "Factor Conversión Consumo",width: 80, dataType: "number", dataIndx: "c7",halign:"center", align:"right",editable:false },
            { title: "Periodo Dias Promediados",width: 80, dataType: "number", dataIndx: "c8",halign:"center", align:"right",editable:false },
             { title: "Periodo Dias Normalizados",width: 80, dataType: "number", dataIndx: "c9",halign:"center", align:"right",editable:false }
             
             //align: "center", editable: false, minWidth: 100, sortable: false,
				
             //render: function (ui) {
				//	return "<button class='btn btn-primary btn-sm'>Eliminar</button>";
				//}
			//}
        ];
		
		obj.dataModel = { data: data };

var grid = pq.grid("#div_grid", obj);

    var data = [
        { c1:8000, c2:2000, c3: 'MCUB', c4:2014, c5:97985,c6:1000, c7: 0,c8:89,c9:30},
    { c1:0, c2:0, c3: '', c4:0, c5:0,c6:0, c7: 0,c8:0,c9:0},
    ];
var obj = {
            width: '100%',
            height: 200,
            showTop: true,
			showBottom:false,
            showHeader: true,
            roundCorners: true,
            rowBorders: true,
            columnBorders: true,
			editable:false,
            selectionModel: { type: 'cell' },
            numberCell: { show: false },
            title: "",
			pageModel: {type:"local"},
        	scrollModel:{autoFit:true, theme:true},
			toolbar:
       {
            cls: "pq-toolbar-export",
            items:
            [
				{ type: "button", label: "Excel", attr:"id=co_excel2", cls:"btn btn-primary btn-sm"},
				{ type: "button", label: "Volver", attr:"id=co_volver_2", cls:"btn btn-default btn-sm"}
            ]
        }
        };
		
		
		obj.colModel = [
            { title: "Rol",  resizable: false, width: 80, dataType: "number", dataIndx: "c1",halign:"center", align:"right" },
            { title: "Cliente", width: 80, dataType: "number", dataIndx: "c2",halign:"center", align:"right" },
            { title: "Fecha Modificación", width: 80, dataType: "string", dataIndx: "c3",halign:"center", align:"right" },
            { title: "Tipo Modificación", width: 80, dataType: "number", dataIndx: "c4",halign:"center", align:"right" },
            { title: "Dato Anterior", width: 80, dataType: "number", dataIndx: "c5",halign:"center", align:"right" },
            { title: "Dato Actual",width: 80, dataType: "number", dataIndx: "c6",halign:"center", align:"right"},
            { title: "Observación",width: 80, dataType: "number", dataIndx: "c7",halign:"center", align:"right"},
           
             
             //align: "center", editable: false, minWidth: 100, sortable: false,
				
             //render: function (ui) {
				//	return "<button class='btn btn-primary btn-sm'>Eliminar</button>";
				//}
			//}
        ];
		
		obj.dataModel = { data: data };

var grid = pq.grid("#div_grid_dos", obj);

    
});


function fn_carga_orden()
{
	dato_ori = [];
    parameters = 
    {
		"func":"fn_lee_orden",
		"empresa":$("#tx_empresa").val(),
		"p_orden":$("#tx_orden").val()
    };
    HablaServidor(my_url,parameters,'text', function(text) 
    {
        if(text != ""){
			$("#co_leer").html("<span class='glyphicon glyphicon-user'></span> Reasignar");
			dato_ori = text.split("|");
			//$("#co_leer").prop("disabled",true);
			$("#tx_orden").prop("disabled",true);
			$("#tx_cod_cliente").val(dato_ori[1]);
			$("#tx_rol_actual").val(dato_ori[3]);
			$("#tx_nombre").val(dato_ori[4]);
			$("#tx_estado").val(dato_ori[5]);
			$("#tx_ruta").val(dato_ori[6]);
			$("#tx_tarifa").val(dato_ori[7]);
			$("#tx_actividad").val(dato_ori[8]);
		}
		else{
			fn_mensaje_boostrap("No se encontro la orden indicada!!!", g_titulo, $(""));
			return;
		}
		if(dato_ori[0] == "F"){
			$("#co_leer").prop("disabled",true);
			fn_mensaje_boostrap("ESTA ORDEN YA FUE FINALIZADA, NO PUEDE SER REASIGNADA !", g_titulo, $(""));
			return;
		}
		
		//$("#co_reasignar").prop("disabled",false);
		$("#cb_reasigna_nuevo").prop("disabled",false);
	         
    });
	
}


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_carga_roles()
{
    var param= 
    {
        "func":"fn_roles_ajuste",
        "empresa":$("#tx_empresa").val()
    };
    HablaServidor(my_url, param, "text", function(text) 
    {
        $("#cb_reasigna_nuevo").html(text);
    }); 
}

function fn_act_orden(){
	
	var param= 
    {
        "func":"fn_actualiza",
        "empresa":$("#tx_empresa").val(),
		"p_orden":$("#tx_orden").val(),
		"rol":$("#tx_rol").val(),
		"p_rol_nuevo":$("#cb_reasigna_nuevo").val()
    };
    HablaServidor(my_url, param, "text", function(text) 
    {
        if(text == ""){
			$("#cb_reasigna_nuevo").prop("disabled", true);
			$("#cb_reasigna_nuevo").prop("disabled",true);
			fn_mensaje_boostrap("ACCIÓN REALIZADA !", g_titulo, $(""));
			fn_limpiar();
		}
		else
			fn_mensaje_boostrap(text, g_tit, $(""));
    }); 
}

function fn_limpiar(){
	$("#tx_orden").val("");
	$("#tx_cod_cliente").val("");
	$("#tx_nombre").val("");
	$("#tx_rol_actual").val("");
	$('#cb_reasigna_nuevo').val("");
	$("#tx_tarifa").val("");
	$("#tx_actividad").val("");
	$("#tx_estado").val("");
	$("#tx_ruta").val("");

	$("#tx_orden").prop("disabled",false);
	$("#co_leer").html("<span class='glyphicon glyphicon-search'></span> Leer");
	$("#co_leer").prop("disabled",false);
	$("#co_cancelar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");
	//$("#co_reasignar").prop("disabled",true);
	$("#cb_reasigna_nuevo").prop("disabled",true);
	$("#tx_orden").focus();
}
	