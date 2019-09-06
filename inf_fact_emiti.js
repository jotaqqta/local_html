var g_modulo="Facturación Clientes - Lecturas y Consumos";
var g_titulo="Informe de Facturas Emitidas";
var parameters={};
var my_url="reasigna_ajuste.asp";
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
    $("#co_filtro").html("<span class='glyphicon glyphicon-search'></span> Filtros");
    $("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
    $("#co_volver_2").html("<span class='glyphicon glyphicon-chevron-left'></span> Volver");
    $("#co_volver_3").html("<span class='glyphicon glyphicon-chevron-left'></span> Volver");
    $("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");    
    $("#co_excel2").html("<span class='glyphicon glyphicon-save'></span> Excel");
    $("#co_excel3").html("<span class='glyphicon glyphicon-save'></span> Excel");
    

      $("#co_filtro").on("click", fn_Muestra_Filtro);
    
  	jQuery('#tx_lec_ant').keypress(function(tecla) {
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
                }
			$("#co_leer").html("<span class='glyphicon glyphicon-floppy-disk'></span> Actualizar");
			$("#co_cancelar").html("<span class='glyphicon glyphicon-log-out'></span> Limpiar");
			//fn_carga_orden();
          }
	});
    
    $("#co_cancelar").on("click",function(){
		if ($.trim($("#co_cancelar").text())=="Limpiar"){
			fn_limpiar();
			return;
		}
		else
			window.close();
	});
     $("._input_selector").inputmask("dd/mm/yyyy");
    
   
 
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
    { C1:'30000', C2: '29', C3:'316', C4:"ACTIVO", C5:"CON SUMINISTRO", C6:"001-SUMINISTRO", C7:7},
         { C1:'30000', C2: '29', C3:'317', C4:"ACTIVO", C5:"CON SUMINISTRO", C6:"001-SUMINISTRO", C7:4},
         { C1:'30000', C2: '29', C3:'318', C4:"ACTIVO", C5:"CON SUMINISTRO", C6:"001-SUMINISTRO", C7:6},
         { C1:'30000', C2: '29', C3:'321', C4:"ACTIVO", C5:"CON SUMINISTRO", C6:"001-SUMINISTRO", C7:3},
         { C1:'30000', C2: '29', C3:'328', C4:"ACTIVO", C5:"CON SUMINISTRO", C6:"001-SUMINISTRO", C7:2}
    ];
    var obj = {
            width: '100%',
            height: 400,
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
            [  { type: "button", label: " Filtros",attr:"id=co_filtro", cls:"btn btn-primary"},
				{ type: "button", label: "Excel", attr:"id=co_excel2", cls:"btn btn-primary btn-sm"}
				
            ]
        }
        };
		obj.colModel = [     
            { title: "Region",  resizable: false, width: 100, dataType: "number", dataIndx: "C1",halign:"center", align:"center" },
            { title: "Ciclo", width: 80, dataType: "string", dataIndx: "C2",halign:"center", align:"center" },
            { title: "Ruta", width: 80, dataType: "number", dataIndx: "C3",halign:"center", align:"center" },
            { title: "Est.Cliente", width: 80, dataType: "number", dataIndx: "C4",halign:"center", align:"center" },
            { title: "Est.Suministro",width: 80, dataType: "number", dataIndx: "C5",halign:"center", align:"center"},
            { title: "Tipo Reparto",width: 80, dataType: "number", dataIndx: "C6",halign:"center", align:"center"},
            { title: "Cantidad",width: 80, dataType: "number", dataIndx: "C7",halign:"center", align:"center"}
           
           
             
           
        ];
		
		obj.dataModel = { data: data };

var grid = pq.grid("#div_grid_dos", obj);
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
function fn_Muestra_Filtro()
{
    $("#div_filtro_bts").modal({backdrop: "static",keyboard:false});
	$("#div_filtro_bts").on("shown.bs.modal", function () {
		$("#div_filtro_bts div.modal-footer button").focus();
			
	});
    

}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_leer(){
	if ($.trim($("#co_leer").text()) == "Leer")
	{
        $("#tx_fil_periodo").val("");
		$("#cb_fil_regional").val("");
		$("#cb_fil_ciclo").val("");
		$('#tx_ruta').val("");
	
	
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
	
		$("#tx_fil_periodo").val("");
		$("#cb_fil_regional").val("");
		$("#cb_fil_ciclo").val("");
		$('#tx_est_conex').val("");
		$("#tx_reg").val("");
		$("#tx_ruta").val("");
	
}
	