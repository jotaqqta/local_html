var g_modulo="Facturación Clientes - Lecturas y Consumos";
var g_titulo="Correción de Lectura Anterior";
var parameters={};
var my_url="reasigna_ajuste.asp";
var $grid;
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

	$("#tx_orden").focus();
	
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
    $("#tx_lec_ant").prop("disabled", true);
	$("#tx_lec_ant2").prop("disabled", true);
  //DEFINE LA GRILLA PRINCIPAL
    fn_setea_grid_principal();
    //DIBUJA LOS ICONOS DE LOS BOTONES     
    
  //DIBUJA LOS ICONOS DE LOS BOTONES     
    $("#co_filtro").html("<span class='glyphicon glyphicon-search'></span> Filtros");
    $("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
    $("#co_volver_2").html("<span class='glyphicon glyphicon-chevron-left'></span> Volver");
    $("#co_volver_3").html("<span class='glyphicon glyphicon-chevron-left'></span> Volver");
    $("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");    
    $("#co_excel2").html("<span class='glyphicon glyphicon-save'></span> Excel");
    $("#co_excel3").html("<span class='glyphicon glyphicon-save'></span> Excel");

  	jQuery('#tx_lec_ant').keypress(function(tecla) {
		if(tecla.charCode < 48 || tecla.charCode > 57) return false;
	});
	jQuery('#tx_lec_ant2').keypress(function(tecla) {
		if(tecla.charCode < 48 || tecla.charCode > 57) return false;
	});

	$("#co_leer").on("click", function(){
		//Validación de informacion
     if ($.trim($("#co_leer").text())=="Leer"){
			if( $("#tx_orden").val() == ""){
				fn_mensaje_boostrap("DIGITE EL NÚMERO DE SUMINISTRO", g_titulo, $("#tx_orden"));
				return;
                
			}else{

            	fn_leer()
            	$("#tx_orden").prop("disabled",true);
            	$("#tx_lec_ant").focus();                
            }
			$("#co_leer").html("<span class='glyphicon glyphicon-floppy-disk'></span> Actualizar");
			$("#co_cancelar").html("<span class='glyphicon glyphicon-log-out'></span> Cancelar");
			//fn_carga_orden();
          }
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
			$("#co_leer").html("<span class='glyphicon glyphicon-search'></span> Leer");
			$("#co_cancelar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");			     
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

		return;			
	});	
    
  //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_setea_grid_principal()
{ 
    var data = [
    { C1:'RCARVAJAL', C2: '01/03/2019', C3:'CORECCION', C4:97985, C5:7985, C6: 'SE CAMBIA LECTURA'},
    ];
    var obj = {
            height: 540,
			width: "100%",
            showTop: true,
			showBottom:true,
            showTitle : false,
			title: "Resumen Historico de Clientes Medidos por Ciclo y Ruta",
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
				{ type: "button", label: "Excel", attr:"id=co_excel2", cls:"btn btn-primary btn-sm"}
				
            ]
        }
        };
		obj.colModel = [
            { title: "Funcionario",  resizable: false, width: 140, dataType: "number", dataIndx: "C1",halign:"center", align:"right" },
            { title: "Fecha", width: 160, dataType: "string", dataIndx: "C2",halign:"center", align:"right" },
            { title: "Tipo", width: 240, dataType: "number", dataIndx: "C3",halign:"center", align:"right" },
            { title: "Dato Anterior", width: 120, dataType: "number", dataIndx: "C4",halign:"center", align:"right" },
            { title: "Dato Actual",width: 120, dataType: "number", dataIndx: "C5",halign:"center", align:"right"},
            { title: "Observación",width: 500, dataType: "number", dataIndx: "C6",halign:"center", align:"right"}, 
        ];
		
		obj.dataModel = { data: data };
		$grid = $("#div_grid_dos").pqGrid(obj);
}

    
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
				
		
		$("#tx_cod_cliente").val("45223");
		$("#tx_dir").val("Maria");
		$("#tx_est_client").val("Activo");
		$('#tx_est_conex').val("Si");
		$("#tx_reg").val("Panamá Metro");
		$("#tx_ruta").val("8000-01-244");
		$("#tx_tarif").val("Residencial");
		$("#tx_actividad").val("Residencial");
		$("#tx_num_medidor").val("23234345");            
		$("#tx_ent_decim").val("5/1"); 
		$("#tx_tipo_med").val("MCUB");  
		$("#tx_lec_ant").val("2344");
		$("#tx_lec_actu").val("152");  
		$("#tx_consum").val("23000"); 
		$("#tx_fac_conv_consum").val("10002");  
		$("#tx_consum_fact_gls").val("1000");  
		$("#tx_peri_dia_prom").val("2"); 
		$("#tx_peri_dia_norm ").val("2"); 
		$("#tx_num_medidor2").val("");         
		$("#tx_ent_decim2").val(""); 
		$("#tx_tipo_med2").val(""); 
        $("#tx_lec_actu2").val(""); 
		$("#tx_consum2").val(""); 

		if($("#tx_lec_ant").val() > $("#tx_lec_actu").val()){
			fn_mensaje_boostrap("La lectura anterior 1 ("+$("#tx_lec_ant").val()+") es superior a la lectura actual 1 ("+$("#tx_lec_actu").val()+"). Verifique si se ha producido una vuelta del reloj del medidor.", "ADVERTENCIA!!!", $("#tx_lec_ant"));
		}

		if($("#tx_lec_ant2").val() > $("#tx_lec_actu2").val()){
			fn_mensaje_boostrap("La lectura anterior 2 ("+$("#tx_lec_ant2").val()+") es superior a la lectura actual 2 ("+$("#tx_lec_actu2").val()+"). Verifique si se ha producido una vuelta del reloj del medidor.", "ADVERTENCIA!!!", $("#tx_lec_ant2"));
		}
		
		$("#tx_lec_ant").prop("disabled", false);
        $("#tx_lec_ant2").prop("disabled", false); //Para habilitar

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
	
	$("#tx_cod_cliente").val("");
	$("#tx_dir").val("");
	$("#tx_est_client").val("");
	$('#tx_est_conex').val("");
	$("#tx_reg").val("");
	$("#tx_ruta").val("");
	$("#tx_tarif").val("");
	$("#tx_actividad").val("");
	$("#tx_num_medidor").val("");            
	$("#tx_ent_decim").val(""); 
	$("#tx_tipo_med").val("");  
	$("#tx_lec_ant").val(""); 
	$("#tx_lec_ant2").val(""); 

	$("#tx_lec-actu").val("");  
	$("#tx_consum").val(""); 
	$("#tx_regional").val("");  
	$("#tx_ruta").val("");  
	$("#tx_tarifa").val("");  
	$("#tx_regional").val("");  
	$("#tx_ruta").val("");  
	$("#tx_tarifa").val("");  
	$("#tx_fac_conv_consum").val("");  
	$("#tx_consum_fact_gls").val("");  
	$("#tx_peri_dia_prom").val(""); 
	$("#tx_peri_dia_norm ").val(""); 
	$("#tx_num_medidor2").val("");         
	$("#tx_ent_decim2").val(""); 
	$("#tx_tipo_med2").val(""); 
	$("#tx_lec_actu").val("");  
	$("#tx_lec_actu2").val(""); 
	$("#tx_consum2").val(""); 
	
	$("#tx_orden").val("");
	$("#tx_orden").prop("disabled",false);
	$("#tx_orden").focus();
}
	