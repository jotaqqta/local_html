var g_modulo="Facturación Clientes - Lecturas y Consumos";
var g_titulo="Correción de Lectura Anterior";
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

	$("#tx_actividad").prop("disabled",true);
	$("#tx_estado").prop("disabled",true);
	$("#tx_ruta").prop("disabled",true);
    $("#tx_orden").prop("disabled",false);
	$("#tx_cod_cliente").prop("disabled",true);
	$("#tx_dir").prop("disabled",true);
	$("#tx_est_client").prop("disabled",true);
	$('#tx_est_conex').prop("disabled",true);
	$("#tx_reg").prop("disabled",true);
	$("#tx_ruta").prop("disabled",true);
	$("#tx_tarif").prop("disabled",true);
	$("#tx_actividad").prop("disabled",true);
    $("#tx_num_medidor").prop("disabled",true);          
    $("#tx_ent-decim").prop("disabled",true);
    $("#tx_tipo_med").prop("disabled",true);
    $("#tx_lec-ant").prop("disabled",false);
    $("#tx_lec-actu").prop("disabled",true);
    $("#tx_consum").prop("disabled",true);
    $("#tx_num_medidor2").prop("disabled",true);          
    $("#tx_ent-decim2").prop("disabled",true);
    $("#tx_tipo_med2").prop("disabled",true);
    $("#tx_lec-ant2").prop("disabled",false);
    $("#tx_lec-actu2").prop("disabled",true);
    $("#tx_consum2").prop("disabled",true);
    $("#tx_regional").prop("disabled",true);
    $("#tx_ruta").prop("disabled",true);
    $("#tx_tarifa").prop("disabled",true); 
    $("#tx_regional").prop("disabled",true); 
    $("#tx_ruta").prop("disabled",true); 
    $("#tx_tarifa").prop("disabled",true); 
    $("#tx_fac_conv_consum").prop("disabled",true); 
    $("#tx_consum_fact_gls").prop("disabled",true); 
    $("#tx_peri_dia_prom").prop("disabled",true);
    $("#tx_peri_dia_norm").prop("disabled",true);
   




    
     //DEFINE LA GRILLA PRINCIPAL
    fn_setea_grid_principal();
  //DIBUJA LOS ICONOS DE LOS BOTONES     
    
    $("#co_filtro").html("<span class='glyphicon glyphicon-search'></span> Filtros");
    $("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
    $("#co_volver_2").html("<span class='glyphicon glyphicon-chevron-left'></span> Volver");
    $("#co_volver_3").html("<span class='glyphicon glyphicon-chevron-left'></span> Volver");
    $("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");    
    $("#co_excel2").html("<span class='glyphicon glyphicon-save'></span> Excel");
    $("#co_excel3").html("<span class='glyphicon glyphicon-save'></span> Excel");

    
    
  

	$("#co_leer").on("click", function(){
		//Validación de informacion
     
         
		if ($.trim($("#co_leer").text())=="Leer"){
			if( $("#tx_orden").val() == ""){
				fn_mensaje_boostrap("DIGITE EL NÚMERO DE SUMINISTRO", g_titulo, $("#tx_orden"));
				return;
                
			}else{
                   fn_leer()
                
            }
			$("#co_leer").html("<span class='glyphicon glyphicon-floppy-disk'></span> Actualizar");
			$("#co_cancelar").html("<span class='glyphicon glyphicon-log-out'></span> Cancelar");
			 fn_carga_orden();
          
           
		}
			////else{
			
				////if( $("#cb_reasigna_nuevo").val() == ""){
				////	fn_mensaje_boostrap("SELECCIONE EL USUARIO PARA REALIZAR LA ASIGNACIÓN", g_titulo, $("#cb_reasigna_nuevo"));
					////return;
				////}
	////
				////if($("#tx_rol_actual").val() == $("#cb_reasigna_nuevo").val())
				////{
				////	fn_mensaje_boostrap("DEBE SELECCIONAR UN USUARIO DIFERENTE AL ACTUAL", g_titulo, $("#cb_reasigna_nuevo"));
					////return;
			////	}
			//////////////////////////////////////////////////////////////
			/////////////////SE ACTUALIZA EL REGISTRO/////////////////////
			//////////////////////////////////////////////////////////////
				////fn_act_orden();
				////return;	
			////}
	});
    
    
		$("#tx_orden").bind("keydown",function(e){
			if(e.keyCode == 13){
				tab = true;
				fn_leer();
				return false;
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
    
  //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_setea_grid_principal()
{ 
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
            title: "Auditoria de Modificaciones",
			pageModel: {type:"local"},
        	scrollModel:{autoFit:true, theme:true},
            toolbar:
        {
            cls: "pq-toolbar-export",
            items:
            [
				{ type: "button", label: "Excel", attr:"id=co_excel2", cls:"btn btn-primary btn-sm"},
				
            ]
        }
        };
		
		
		obj.colModel = [
            { title: "Numero medidor",  resizable: false, width: 80, dataType: "number", dataIndx: "c1",halign:"center", align:"right",editable:false},
            { title: "Enteros Decimales", width: 80, dataType: "number", dataIndx: "c2",halign:"center", align:"right",editable:false},
            { title: "Tipo Medida", width: 80, dataType: "string", dataIndx: "c3",halign:"center", align:"right",editable:false},
            { title: "Lectura Anterior", width: 80, dataType: "number", dataIndx: "c4",halign:"center", align:"right" },
            { title: "Lectura Actual", width: 80, dataType: "number", dataIndx: "c4",halign:"center", align:"right",editable:false },
            { title: "Consumo", width: 80, dataType: "number", dataIndx: "c5",halign:"center", align:"right",editable:false},
            { title: "CONSUMO A FACTURAR GLS",width: 80, dataType: "number", dataIndx: "c6",halign:"center", align:"right",editable:false},
            { title: "Factor Conversión Consumo",width: 80, dataType: "number", dataIndx: "c7",halign:"center", align:"right",editable:false},
            { title: "Periodo Dias Promediados",width: 80, dataType: "number", dataIndx: "c8",halign:"center", align:"right",editable:false},
             { title: "Periodo Dias Normalizados",width: 80, dataType: "number", dataIndx: "c9",halign:"center", align:"right",editable:false}
             
             //align: "center", editable: false, minWidth: 100, sortable: false,
				
             //render: function (ui) {
				//	return "<button class='btn btn-primary btn-sm'>Eliminar</button>";
				//}
			//}
        ];
		
		obj.dataModel = { data: data };

var grid = pq.grid("#div_grid", obj);

    var data = [
        { c1:'RCARVAJAL', c2:'23455', c3: '01/03/2019', c4:'CORECCION', c5:97985,c6:7985, c7: 'SE CAMBIA LECTURA'},
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
            title: "Auditoria de Modificaciones",
			pageModel: {type:"local"},
        	scrollModel:{autoFit:true, theme:true},
			toolbar:
        {
            cls: "pq-toolbar-export",
            items:
            [
				{ type: "button", label: "Excel", attr:"id=co_excel2", cls:"btn btn-primary btn-sm"}
				
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
}
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
    
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
			fn_mensaje_boostrap("ESTA ORDEN YA FUE FINALIZADA, NO PUEDE SER REASIGNADA !", g_titulo,$(""));
			return;
		}
		
		//$("#co_reasignar").prop("disabled",false);
		$("#cb_reasigna_nuevo").prop("disabled",false);
	         
    });
	
}


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_leer(){
		if ($.trim($("#co_leer").text()) == "Leer")
			{
				
			$("#tx_orden").val("");
	$("#tx_cod_cliente").val("45223");
	$("#tx_dir").val("Maria");
	$("#tx_est_client").val("Rol-1");
	$('#tx_est_conex').val("Si");
	$("#tx_reg").val("3000");
	$("#tx_ruta").val("Si");
	$("#tx_tarif").val("Activo");
	$("#tx_actividad").val("1");
    $("#tx_num_medidor").val("23");            
    $("#tx_ent-decim").val("23"); 
    $("#tx_tipo_med").val("Tipo_1");  
    $("#tx_lec-ant").val("23444"); 
 
    $("#tx_lec-actu").val("5552");  
    $("#tx_consum").val("23000"); 
    $("#tx_regional").val("Region");  
    $("#tx_ruta").val("23");  
    $("#tx_tarifa").val("");  
    $("#tx_regional").val("");  
    $("#tx_ruta").val("23");  
    $("#tx_tarifa").val("");  
    $("#tx_fac_conv_consum").val("10002");  
    $("#tx_consum_fact_gls").val("1000");  
    $("#tx_peri_dia_prom").val("2"); 
    $("#tx_peri_dia_norm ").val("2"); 
    $("#tx_num_medidor2").val("");         
    $("#tx_ent-decim2").val(""); 
    $("#tx_tipo_med2").val(""); 
    $("#tx_lec-ant2").val(""); 
    $("#tx_lec-actu2").val(""); 
    $("#tx_consum2").val(""); 












          
			}
	}




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
	