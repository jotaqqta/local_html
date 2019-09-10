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
	
	//Footer
	$("#div_footer").load("/syn_globales/footer.htm");
  //DEFINE LA GRILLA PRINCIPAL
    fn_setea_grid_principal();
  //DIBUJA LOS ICONOS DE LOS BOTONES     
    $("#co_filtro").html("<span class='glyphicon glyphicon-search'></span> Filtros");
    $("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
    $("#co_volver_2").html("<span class='glyphicon glyphicon-chevron-left'></span> Volver");
    $("#co_volver_3").html("<span class='glyphicon glyphicon-chevron-left'></span> Volver");
    $("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");    
   
    

    
    
    $("#co_filtro").on("click", function (e) {
		$("#cb_ciclo").prop("disabled",true);
		$("#cb_ruta").prop("disabled",true);
		fn_Muestra_Filtro();
        fn_period();

    });

      $("._input_selector").inputmask("dd/mm/yyyy");
    
  	jQuery('#tx_lec_ant').keypress(function(tecla) {
		if(tecla.charCode < 48 || tecla.charCode > 57) return false;
	});

	$("#co_aceptar").on("click", function(){
		//Validación de informacion
     if ($.trim($("#co_aceptar").text())=="Aceptar"){
			if( $("#fec_proc").val() == ""){
				fn_mensaje_boostrap("DIGITE LA FECHA DE PROCESO", g_titulo, $("#fec_proc"));
				return;
            }else{
                   if(fn_validar_fecha($("#fec_proc").val())){
                    fn_carga_grilla();
                    
                    }else{
                      fn_mensaje_boostrap("POR FAVOR DIGITE LA FECHA EN FORMATO DD/MM/YYYY.", g_titulo, $("#fec_proc"));
				        return;
                    
                    }
                }
			if((fn_validar_fecha($("#fec_proc").val()))){
                 /*&& $("#cb_period").val())) && (($("#cb_ciclo").val())&&($("#cb_ruta").val())))*/
           $('#div_filtro_bts').modal('hide'); 
        fn_limpiar();}
          fn_carga_grilla();
     }
	});
        $("#co_limpiar").on("click",function(){
		if ($.trim($("#co_limpiar").text())=="Limpiar"){
			fn_limpiar();
			return;
		}
		else
			window.close();
	});
 
	$("#co_close").on("click", function (e) {
        $('#div_filtro_bts').modal('hide'); 		
    });	
    $("#co_excel").on("click", function (e) {
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
    $("#cb_period").on("change", function(evt){
        if($(this).val() ==""){
				//$("#cb_ruta").prop("disabled",true);
		 fn_lim_period(); 
        }
			else{
                fn_ciclo();
				$("#cb_ciclo").prop("disabled",false);
				$("#cb_ruta").prop("disabled",true);
				$("#cb_ciclo").focus();	
            }
    });

        $("#cb_ciclo").on("change", function(evt){
        if($(this).val() ==""){
				//$("#cb_ruta").prop("disabled",true);
				fn_lim_ciclo();
            
            $("#cb_ruta").prop("disabled",true);
        }
			else{
			fn_ruta();
				$("#cb_ruta").prop("disabled",false);
				$("#cb_ruta").focus();
            }
    });
   	
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
            height: 800,
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
				{ type: "button", label: "Excel", attr:"id=co_excel", cls:"btn btn-primary btn-sm"}
				
            ]
        }
        };
		obj.colModel = [     
            { title: "Regional",  resizable: false, width: 100, dataType: "number", dataIndx: "C1",halign:"center", align:"center" },
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
	
		$("#fec_proc").val("");
		$("#cb_period").val("");
		$("#cb_ciclo").val("");
        $("#cb_ruta").val("");
        $("#fec_proc").focus();
}
function fn_carga_opc_conve(){
var options='<option value="1"selected="selected">--- CHOOSE CITY --- </option>';    
$("#tx_fil_ciclo").html(options);
}
function fn_carga_grilla(){
    
}
//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
//FUNCIONES MODAL

function fn_period(){

    /*parameters = 
    {
		"func":"fn_regional",
		"empresa":$("#tx_empresa").val(),
		"rol":$("#tx_rol").val()
    };
    HablaServidor(my_url,parameters,'text', function(text) 
    {
        if(text != "")
            $("#cb_regional").html(text);
    });*/    

$("#cb_period").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
function fn_ciclo(){

    /*parameters = 
    {
		"func":"fn_regional",
		"empresa":$("#tx_empresa").val(),
		"rol":$("#tx_rol").val()
    };
    HablaServidor(my_url,parameters,'text', function(text) 
    {
        if(text != "")
            $("#cb_regional").html(text);
    });*/    

$("#cb_ciclo").html("<option value='' selected></option><option value='1'>10</option> <option value='2' >20</option> <option value='3'>30</option>");
}

function fn_ruta(){

    /*parameters = 
    {
		"func":"fn_regional",
		"empresa":$("#tx_empresa").val(),
		"rol":$("#tx_rol").val()
    };
    HablaServidor(my_url,parameters,'text', function(text) 
    {
        if(text != "")
            $("#cb_regional").html(text);
    });*/    

$("#cb_ruta").html("<option value='' selected></option><option value='1'>005</option> <option value='2' >010</option> <option value='3'>015</option>");
}
//FUNCIONES LIMPIAR-MODAL
function fn_lim_period(){
  $("#cb_ciclo").val("");
  $("#cb_ruta").val("");
  $("#cb_ciclo").prop("disabled",true);
  $("#cb_ruta").prop("disabled",true);
}


function fn_lim_ciclo(){
$("#cb_ruta").val("");
$("#cb_ruta").prpr("disabled",true);
}
//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
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
		}else{
		return false;
		}
	}
	else {
	return false;
	}
}


