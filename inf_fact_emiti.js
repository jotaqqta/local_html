var g_modulo="Facturación Clientes - Lecturas y Consumos";
var g_titulo="Informe de Facturas Emitidas";
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
    $("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");    
    
    $("#co_filtro").on("click", function (e) {
		$("#cb_ciclo").prop("disabled",true);
		$("#cb_ruta").prop("disabled",true);
		fn_Muestra_Filtro();
        fn_period();

    });

    $("#fec_proc").inputmask("dd/mm/yyyy");
    
  	jQuery('#tx_lec_ant').keypress(function(tecla) {
		if(tecla.charCode < 48 || tecla.charCode > 57) return false;
	});

	$("#co_aceptar").on("click", function(){
		//Validación de informacion
     if ($.trim($("#co_aceptar").text())=="Aceptar"){
		if( $("#fec_proc").val() == ""){
			fn_mensaje_boostrap("DIGITE LA FECHA DE PROCESO", g_titulo, $("#fec_proc"));
			return;
		}
		else{
		   if(fn_validar_fecha($("#fec_proc").val())){
				$('#div_filtro_bts').modal('hide'); 
			   	fn_carga_grilla();  	
			}
			else{
			  	fn_mensaje_boostrap("POR FAVOR DIGITE LA FECHA EN FORMATO DD/MM/YYYY.", g_titulo, $("#fec_proc"));
				return;
			}
		}
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
 
	$("#co_cancelar").on("click", function (e) {
        $('#div_filtro_bts').modal('hide');	
    });
	
	$("#co_cancelar").on("click", function (e) {
       window.close();
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
            height: 540,
            showTop: true,
			showBottom:true,
            showHeader: true,
            roundCorners: true,
            rowBorders: true,
            columnBorders: true,
			editable:false,
            selectionModel: { type: 'cell' },
            numberCell: { show: false },
            title: "Auditoria de Modificaciones",
			pageModel: {type:"local"},
        	scrollModel:{theme:true},
			toogle: false,
			toolbar:
        {
            cls: "pq-toolbar-export",
            items:
            [  { type: "button", label: " Filtros",attr:"id=co_filtro", cls:"btn btn-primary"},
				{ type: "button", label: "Excel", attr:"id=co_excel", cls:"btn btn-primary btn-sm"},
			 	{ type: "button", label: "Cerrar", attr:"id=co_cerrar", cls:"btn btn-default btn-sm"}
				
            ]
        }
        };
		obj.colModel = [     
            { title: "Regional",  resizable: false, width: 120, dataType: "number", dataIndx: "C1",halign:"center", align:"center" },
            { title: "Ciclo", width: 120, dataType: "string", dataIndx: "C2",halign:"center", align:"center" },
            { title: "Ruta", width: 120, dataType: "number", dataIndx: "C3",halign:"center", align:"center" },
            { title: "Estado de Cliente", width: 140, dataType: "number", dataIndx: "C4",halign:"center", align:"center" },
            { title: "Estado de Suministro",width: 160, dataType: "number", dataIndx: "C5",halign:"center", align:"center"},
            { title: "Tipo de Reparto",width: 160, dataType: "number", dataIndx: "C6",halign:"center", align:"center"},
            { title: "Cantidad",width: 100, dataType: "number", dataIndx: "C7",halign:"center", align:"center"}  
        ];
		
		obj.dataModel = { data: data };
		$grid = $("#div_grid_dos").pqGrid(obj);
		$grid.pqGrid( "refreshDataAndView" );
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

//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
function fn_lim_period(){
	$("#cb_ciclo").val("");
	$("#cb_ruta").val("");
	$("#cb_ciclo").prop("disabled",true);
	$("#cb_ruta").prop("disabled",true);
}

//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
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


