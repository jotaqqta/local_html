var g_modulo="Módulo de Cobranza";
var g_tit = "Bandeja de Cobranzas";
var g_tit2 = "Historial de Convenios de Pago";
var $grid_principal;
var $grid_todos;
var $grid_llamadas;
var $grid_avisos;
var $grid_insp_corte;
var $grid_judicial;
var $grid_obs;
var $grid_event;
var tipo_noti = "";
var g_cliente_selec = "";
var parameters = {};
var Filtros = [];
var sql_grid_prim = "";
var my_url = "cobra_accion.asp";
var my_url2 = "cobra_ingreso.asp";
var accion_btn;

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
    
    $("#div_mod0").html(g_modulo);
    $("#div_tit0").html(g_tit );
    
	$("#excel_archivo").val("cobranzas.xls");
	$("#Rol").val(fn_get_param("Rol"));

	$("#tx_empresa").val(fn_get_param("Empresa"));
	$("#tx_rol").val(fn_get_param("Rol"));
	$("#tx_rolfun").val(fn_get_param("RolFun"));
	$("#tx_ip").val(fn_get_param("ip"));
        
    //DEFINE LA GRILLA PRINCIPAL
    fn_setea_grid_principal();
	fn_grilla_principal();
    //fn_carga_tip_doc();
    //fn_carga_tip_doc2();
    //fn_carga_tipo_cli();
    //fn_carga_tipo_inspec();
    //fn_carga_tipo_resp();
    //fn_carga_motivo_insp();
    //fn_carga_motivo_corte();
    
    //DIBUJA LOS ICONOS DE LOS BOTONES     
    
    $("#co_filtro").html("<span class='glyphicon glyphicon-search'></span> Filtros");
    $("#co_asignar_mas").html("<span class='glyphicon glyphicon-user'></span> Asignar");
    $("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
    $("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");    

    //EVENTO BOTONES
    $("#co_filtro").on("click", fn_Muestra_Filtro);
    
	$("#co_aprobar").click(function(){
        if($.trim($("#co_aprobar").text()) == "Aprobar"){
			$("#tx_obs_apr").val("");
			$("#dlg_obs").modal({backdrop: "static",keyboard:false});
			$("#dlg_obs").on("shown.bs.modal", function () {
				$("#tx_obs_apr").focus();
			});	
		}
		else{
			window.open("contratoconv2.asp?par=0&emp="+$("#tx_empresa").val()+"&suministro="+$("#tx_cliente").val(),"_blank","toolbar=no,resizable=yes,menubar=no");
		}	
		
    });
	
	$("#co_confirmar_anu").click(function(){
		fn_anular();
	});
	
	$("#co_confirmar").click(function(){
		fn_aprobar();
	});
	
	$("#co_can_con").click(function(){
		$("#dlg_obs").modal("hide");
	});
	
	$("#co_can_anu").click(function(){
		$("#dlg_obs_anu").modal("hide");
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
    
    $("#cb_tipo_doc").on("change", function(evt) 
	{
        //fn_limpiar_dia();
        if($(this).val()==""){
            fn_habilita_dia(true);
            return;
        }
           
        fn_habilita_dia(false);
        if($(this).val()=="02"){ //cedula
            $("#no_cedula").hide(); 
            $("#cedula").show();
            $("#cedula").val();
        } 
        else{
            $("#no_cedula").show(); 
            $("#cedula").hide();
        }
          
      
	});
	
	$("#co_deuda").on('click', function (e) {
		var vAncho = 540;
		var vAlto = 810;
		var posX = (screen.availWidth-vAncho)/2;
		var posY = (screen.availHeight-vAlto)/2;
		var nombre = $("#tx_nombre").val();
        window.open("/raiz/atencion/atc_consultas/con_suministro/aconsum_0005b.htm?Suministro="+$("#tx_cliente").val()+"&Nombre="+nombre+"&Empresa="+$("#tx_empresa").val()+"&Rol="+$("#tx_rol").val(),"_blank", "width=810,height=540,left='"+posX+"',top='"+posY+"',menubar=no,location=no,resizable=no,scrollbars=no");
    });
    
     $("#co_can_analista").on("click", function (e) {
        $("#dlg_analista").modal("hide"); 
    });
    
	$("#co_ok_analista").on("click", function (e) {
        fn_act_analista();
        $("#dlg_analista").modal("hide");
    });
    
    $("#co_can_valorizar").on("click", function (e) {
        $("#dlg_valorizar").modal("hide"); 
    });
    
	$("#co_ok_valorizar").on("click", function (e) {
        if(fn_valida_valorizar()){
            fn_valorizar();
        }   
    });
    
    $("#co_can_obs").on("click", function (e) {
        $("#dlg_obs").modal("hide"); 
    });
    
	$("#co_ok_obs").on("click", function (e) {
        if(fn_valida_obs()){
            fn_acciones();
        }   
    });
    
    $("#co_asignar_mas").on("click", function (e) {
        fn_modal_analista();
    });
    
    $("#co_juzgado").on("click", function (e) {
        fn_modal_obs(1);
    });
    
    $("#co_anular").on("click", function (e) {
        fn_modal_obs(2);
    });
    
    $("#co_finalizar").on("click", function (e) {
        fn_modal_obs(3);
    });
    
    $("#co_valorizar").on("click", function (e) {
		fn_modal_valorizar(1);
    });
    
     $("#co_cerrar").on("click", function (e) {
        window.close(); 
    });    
    
    $("#co_volver1").on("click", function (e) {
        if($.trim($("#co_volver1").text()) == "Volver")
        {
            $("#div_prim0").slideDown();
            $("#div_cobranza").slideUp();
            $grid_principal.pqGrid( "refreshDataAndView" );
            $(window).scrollTop(0);
        }
    });

	$("#co_close").on("click", function (e) {
        $('#div_filtro_bts').modal('hide'); 
    });
	
	$("#co_fil_aceptar").on("click", function (e) {
        $('#div_filtro_bts').modal('hide'); 
        fn_grilla_principal(); 
    });
	
	$("#co_fil_limpiar").on("click", function (e) {
        fn_limpia_filtro(); 
    });
	    
    //EVENTO CLICK DE LA GRILLA
    $grid_principal.pqGrid({
        rowClick: function( event, ui ) {
		  if (ui.rowData) {
              var dataCell = ui.rowData;
              g_cliente_selec = dataCell.c2;					
            }
				
        }
    });
    
    //EVENTO DBL_CLICK DE LA GRILLA
    $grid_principal.pqGrid({
		rowDblClick: function( event, ui ) {
			if (ui.rowData) 
				{
					var dataCell = ui.rowData;
					g_cliente_selec = dataCell.c2;
					$("#div_cobranza").slideDown();
                    $("#div_prim0").slideUp();
                    fn_carga_datos(); 
                    $(window).scrollTop(0);
				}
			}
	});
    
    // MASCARAS
	//CAMPOS DE FECHA

	//SOLO NUMEROS
	$("#tx_cliente").inputmask("integer");
	$("#tx_ant_saldo").inputmask("integer");
	$("#tx_fil_cliente").inputmask("integer");
	
    $("#tx_telefono").inputmask({"mask": "999[9]-9999", greedy:false});
	$("#tx_fil_deu_min").inputmask( "currency",{radixPoint:".", groupSeparator: ",", digits: 2, autoGroup: true, autoUnmask: true, max: parseInt($("#tx_fil_deu_max").val()) });
	$("#tx_fil_deu_max").inputmask( "currency",{radixPoint:".", groupSeparator: ",", digits: 2, autoGroup: true, autoUnmask: true, max: parseInt($("#tx_fil_deu_max").val()) });
    $("#tx_deuda_total_ini").inputmask( "currency",{radixPoint:".", groupSeparator: ",", digits: 2, autoGroup: true, autoUnmask: true, max: parseInt($("#tx_fil_deu_max").val()) });
	$("#tx_deuda_total").inputmask( "currency",{radixPoint:".", groupSeparator: ",", digits: 2, autoGroup: true, autoUnmask: true, max: parseInt($("#tx_fil_deu_max").val()) });
	
	$("#div_filtro_bts").draggable({
        handle: ".modal-header"
    });
    
    $(".nav-tabs a").on("shown.bs.tab", function(event){
        var x = $(event.target).text();         // active tab
        //alert($(event.target).prop("href"));
        if(x == "Avisos")
            $grid_avisos.pqGrid( "refreshView" );
        if(x == "Inspecciones y Corte")
            $grid_insp_corte.pqGrid( "refreshView" );
        if(x = "Cobranza Teléfonica")
            $grid_llamadas.pqGrid( "refreshView" );
        if(x = "Proceso Judicial")
            $grid_judicial.pqGrid( "refreshView" );
        if(x = "Observaciones")
            $grid_obs.pqGrid( "refreshView" );
        
    });

    $("#tx_fil_fec_comp").datetimepicker({
		format: "dd/mm/yyyy",
		autoclose: true,
        container: "#dlg_llam_tel",   //se asigna el div del modal donde se va mostrar el datepicker
		todayBtn: false,
		startDate: "01/01/2017",
		minView : 2,
		language: 'es'
	});
    
    $("#tx_fil_fec_ini").datetimepicker({
		format: "dd/mm/yyyy",
		autoclose: true,
        //container: "#div_filtro_bts",   //se asigna el div del modal donde se va mostrar el datepicker
		todayBtn: false,
		startDate: "01/01/2017",
		minView : 2,
		language: 'es'
	});
    $("#tx_fil_fec_fin").datetimepicker({
		format: "dd/mm/yyyy",
		autoclose: true,
		todayBtn: false,
		startDate: "01/01/2017",
		minView : 2,
		language: 'es'
	});
    
    $("#tx_fecha_terr").datetimepicker({
		format: "dd/mm/yyyy",
		autoclose: true,
        container: "#dlg_noti_capt",   //se asigna el div del modal donde se va mostrar el datepicker
		todayBtn: false,
		startDate: "01/01/2017",
		minView : 2,
		language: 'es'
	});
    
    $("#tx_fecha_comp_noti").datetimepicker({
		format: "dd/mm/yyyy",
		autoclose: true,
        container: "#dlg_noti_capt",   //se asigna el div del modal donde se va mostrar el datepicker
		todayBtn: false,
		startDate: "01/01/2017",
		minView : 2,
		language: 'es'
	});
    
    fn_setea_grid_todos();
    $("#co_excel_todos").html("<span class='glyphicon glyphicon-save'></span> Excel");
    fn_setea_grid_llamadas();
    $("#co_llamada").html("<span class='glyphicon glyphicon-plus'></span> Nuevo");
    $("#co_excel_a").html("<span class='glyphicon glyphicon-save'></span> Excel");
    fn_setea_grid_avisos();
    $("#co_noti1").html("<span class='glyphicon glyphicon-plus'></span> Notificación 1");
    $("#co_noti2").html("<span class='glyphicon glyphicon-plus'></span> Notificación 2");
    $("#co_imp").html("<span class='glyphicon glyphicon-print'></span> Imprimir");
    $("#co_excel_e").html("<span class='glyphicon glyphicon-save'></span> Excel");
    fn_setea_grid_insp_corte();
    $("#co_insp").html("<span class='glyphicon glyphicon-plus'></span> Inspección");
    $("#co_corte").html("<span class='glyphicon glyphicon-plus'></span> Corte");
    $("#co_excel_ins").html("<span class='glyphicon glyphicon-save'></span> Excel");
    fn_setea_grid_judicial();
    fn_setea_grid_obs();  
    $("#co_obser").html("<span class='glyphicon glyphicon-plus'></span> Observación");
    $("#co_excel_obs").html("<span class='glyphicon glyphicon-save'></span> Excel");
    fn_setea_grid_eventos();   
    $("#co_excel_event").html("<span class='glyphicon glyphicon-save'></span> Excel");
    //fn_carga_datos();  //pruebas quitar
    //Eventos de dialogos
    //EVENTO DBL_CLICK DE LA GRILLA INSPEC
    $grid_insp_corte.pqGrid({
		rowDblClick: function( event, ui ) {
			if (ui.rowData) 
				{
					var dataCell = ui.rowData;
					alert("Mostrar Inspección o Corte");
				}
			}
	});
    $("#co_llamada").on("click", fn_modal_llamada);
    $("#co_insp").on("click", fn_modal_inspec); 
    $("#co_corte").on("click", fn_modal_corte);
    $("#co_noti1").on("click", function (){
                      fn_modal_noti(1);
    });
    $("#co_noti2").on("click", function (){
                      fn_modal_noti(2);
    });
    
    $("#co_can_noti").on("click", function (e) {
        $("#dlg_noti").modal("hide"); 
    });
    
	$("#co_ok_noti").on("click", function (e) {
        fn_ingresa_noti();
        $("#dlg_noti").modal("hide");
        fn_grilla_avisos(); 
    });
    
    $("#co_can_noti_cap").on("click", function (e) {
        $("#dlg_noti_capt").modal("hide"); 
    });
    
	$("#co_ok_noti_cap").on("click", function (e) {
        fn_ingresa_noti_cap();
        $("#dlg_noti_capt").modal("hide");
        fn_grilla_avisos(); 
    });
    
    $("#co_can_llam").on("click", function (e) {
        $("#dlg_llam_tel").modal("hide"); 
    });
    
	$("#co_ok_llama").on("click", function (e) {
        fn_ingresa_llamada();
        $("#dlg_llam_tel").modal("hide");
        fn_grilla_llamadas(); 
    });
    
    $("#co_can_inspec").on("click", function (e) {
        $("#dlg_inspec").modal("hide"); 
    });
    
	$("#co_ok_inspec").on("click", function (e) {
        $("#dlg_inspec").modal("hide"); 
        fn_grilla_inspec(); 
    });
    
    $("#co_can_corte").on("click", function (e) {
        $("#dlg_corte").modal("hide"); 
    });
    
	$("#co_ok_corte").on("click", function (e) {
        $("#dlg_corte").modal("hide"); 
        fn_grilla_inspec(); 
    });
    
    //EVENTO DBL_CLICK DE LA GRILLA NOTIFICACIONES
    $grid_avisos.pqGrid({
		rowDblClick: function( event, ui ) {
			if (ui.rowData) 
				{
					var dataCell = ui.rowData;
					g_cliente_selec = dataCell.c2;
                    fn_modal_noti_cap();
				}
			}
	});
    
    //$(".nav-tabs a:first").tab("show");
    
    
    
});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_setea_grid_principal()
{
        
    var obj = {  
	        height: "100%",
            showTop: true,
			showBottom:true,
            showTitle : false,
            roundCorners: true,
            rowBorders: true,
            columnBorders: true,
            collapsible:false,
			editable:false,
            selectionModel: { type: 'row',mode:'single'},
            numberCell: { show: true },
			pageModel: { rPP: 20, type: "local", rPPOptions: [20, 50, 100]},
        	scrollModel:{theme:true},
			toolbar:
           {
               cls: "pq-toolbar-export",
               items:
               [
                   { type: "button", label: " Filtros"      ,  attr:"id=co_filtro", cls:"btn btn-primary"},
                   { type: "button", label: " Asignar"      ,  attr:"id=co_asignar_mas", cls:"btn btn-primary"},
                   { type: "button", label: " Excel"        ,  attr:"id=co_excel"       , cls:"btn btn-primary"},
                   { type: "button", label: " Cerrar"       ,  attr:"id=co_cerrar"      , cls:"btn btn-primary"},
               ]
           }
        };
		
		obj.colModel = [
            { dataIndx: "c9", width: 40, maxWidth: 30, minWidth: 30, align: "center", resizable: false,
                    type: 'checkbox', cls: 'ui-state-default', sortable: false, editor: false, editable: true,
                    dataType: 'bool',
                    cb: {
                        header: true,
                        select: true,
                        all: true
                    }
                },
            { title: "N° Cliente", width: 100, dataType: "string", dataIndx: "C1"    , halign:"center", align:"center"},
            { title: "Nombre", width: 270, dataType: "string", dataIndx: "C2"    , halign:"center", align:"left"},
            { title: "Fecha Ingreso", width: 120, dataType: "string", dataIndx: "C3"    , halign:"center", align:"center"},
            { title: "Estado", width: 180, dataType: "string", dataIndx: "C4"    , halign:"center", align:"left"},
            { title: "Deuda Inicial", width: 120, dataType: "string",  dataIndx: "C5"    , halign:"center", align:"right"},
            { title: "Deuda Actual", width: 120, dataType: "string", dataIndx: "C6"    , halign:"center", align:"right"},
            { title: "Convenio", width: 100, dataType: "string", dataIndx: "C7"    , halign:"center", align:"center"},
            { title: "Tarifa", width: 280, dataType: "string", dataIndx: "C8"    , halign:"center", align:"left"}
            
        ];
		
    $grid_principal = $("#div_grid_principal").pqGrid(obj);
    
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_setea_grid_llamadas()
{  
    var obj = {  
	        height: "100%",
            showTop: true,
			showBottom:true,
            showTitle : false,
            roundCorners: true,
            rowBorders: true,
            columnBorders: true,
            collapsible:false,
			editable:false,
            selectionModel: { type: 'row',mode:'single'},
            numberCell: { show: true },
			pageModel: { rPP: 20, type: "local", rPPOptions: [20, 50, 100]},
        	scrollModel:{theme:true},
			toolbar:
           {
               cls: "pq-toolbar-export",
               items:
               [
                   { type: "button", label: " Nuevo"        ,  attr:"id=co_llamada"       , cls:"btn btn-default"},
                   { type: "button", label: " Excel"        ,  attr:"id=co_excel_a"       , cls:"btn btn-default"},
               ]
           }
        };
			
		obj.colModel = [            
            { title: "Fecha", width: 100, dataType: "string", dataIndx: "C1"    , halign:"center", align:"center", resizable:false},
            { title: "Analista", width: 220, dataType: "string", dataIndx: "C2"    , halign:"center", align:"left", resizable:false},
            { title: "Respuesta", width: 220, dataType: "string", dataIndx: "C3"    , halign:"center", align:"left", resizable:false},
            { title: "Fecha Comprometida", width: 120, dataType: "string", dataIndx: "C4"    , halign:"center", align:"center", resizable:false},
            { title: "Observación", width: 300, dataType: "string", dataIndx: "C5"    , halign:"center", align:"left", resizable:false},
            { title: "Deuda", width: 100, dataType: "string", dataIndx: "C6"    , halign:"center", align:"right", resizable:false},
            { title: "Antigüedad", width: 100, dataType: "string", dataIndx: "C7"    , halign:"center", align:"right", resizable:false},
            { title: "Convenio", width: 100, dataType: "string", dataIndx: "C8"    , halign:"center", align:"center", resizable:false},
            { title: "Estado Conexión", width: 160, dataType: "string", dataIndx: "C9"    , halign:"center", align:"center", resizable:false}
            
        ];
		
    $grid_llamadas = $("#div_grid_call_tel").pqGrid(obj);
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_setea_grid_avisos()
{  
    var obj = {  
	        height: "100%",
            showTop: true,
			showBottom:true,
            showTitle : false,
            roundCorners: true,
            rowBorders: true,
            columnBorders: true,
            collapsible:false,
			editable:false,
            selectionModel: { type: 'row',mode:'single'},
            numberCell: { show: true },
			pageModel: { rPP: 20, type: "local", rPPOptions: [20, 50, 100]},
        	scrollModel:{theme:true},
			toolbar:
           {
               cls: "pq-toolbar-export",
               items:
               [
                   { type: "button", label: " Notificación 1",  attr:"id=co_noti1", cls:"btn btn-default"},
                   { type: "button", label: " Notificación 2",  attr:"id=co_noti2", cls:"btn btn-default"},
                   { type: "button", label: " Imprimir",  attr:"id=co_imp", cls:"btn btn-default"},
                   { type: "button", label: " Excel",  attr:"id=co_excel_e", cls:"btn btn-default"},
               ]
           }
        };
			
		obj.colModel = [            
            { title: "Fecha Inicial", width: 100, dataType: "string", dataIndx: "C1", halign:"center", align:"center", resizable:false},
            { title: "Tipo Notificación", width: 200, dataType: "string", dataIndx: "C2", halign:"center", align:"left", resizable:false},
            { title: "Fecha Acción", width: 120, dataType: "string", dataIndx: "C3", halign:"center", align:"center", resizable:false},
            { title: "Entregada", width: 100, dataType: "string", dataIndx: "C4", halign:"center", align:"center", resizable:false},
            { title: "Tipo Respuesta", width: 200, dataType: "string", dataIndx: "C5", halign:"center", align:"left", resizable:false},
            { title: "Fecha Compromiso", width: 120, dataType: "string",  dataIndx: "C6", halign:"center", align:"center", resizable:false},       
            { title: "Observaciones", width: 360, dataType: "string", dataIndx: "C7", halign:"center", align:"left", resizable:false},
            { title: "Deuda", width: 100, dataType: "string", dataIndx: "C8"    , halign:"center", align:"right", resizable:false},
            { title: "Antigüedad", width: 100, dataType: "string", dataIndx: "C9"    , halign:"center", align:"right", resizable:false},
            { title: "Convenio", width: 100, dataType: "string", dataIndx: "C10"    , halign:"center", align:"center", resizable:false},
            { title: "Estado Conexión", width: 160, dataType: "string", dataIndx: "C11"    , halign:"center", align:"center", resizable:false}
            
        ];
		
    $grid_avisos = $("#div_grid_avisos").pqGrid(obj);
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_setea_grid_insp_corte()
{  
    var obj = {  
	        height: "100%",
            showTop: true,
			showBottom:true,
            showTitle : false,
            roundCorners: true,
            rowBorders: true,
            columnBorders: true,
            collapsible:false,
			editable:false,
            selectionModel: { type: 'row',mode:'single'},
            numberCell: { show: true },
			pageModel: { rPP: 20, type: "local", rPPOptions: [20, 50, 100]},
        	scrollModel:{theme:true},
			toolbar:
           {
               cls: "pq-toolbar-export",
               items:
               [
                   { type: "button", label: " Inspección"        ,  attr:"id=co_insp"       , cls:"btn btn-default"},
                   { type: "button", label: " Corte"        ,  attr:"id=co_corte"       , cls:"btn btn-default"},
                   { type: "button", label: " Excel"        ,  attr:"id=co_excel_ins"       , cls:"btn btn-default"},
               ]
           }
        };
			
		obj.colModel = [            
            { title: "Fecha Orden", width: 100, dataType: "string", dataIndx: "C1", halign:"center", align:"center", resizable:false},
            { title: "Tipo Orden", width: 120, dataType: "string", dataIndx: "C2", halign:"center", align:"center", resizable:false},
            { title: "Nro Orden", width: 100, dataType: "string", dataIndx: "C3", halign:"center", align:"center", resizable:false},
            { title: "Estado Orden", width: 140, dataType: "string", dataIndx: "C4", halign:"center", align:"center", resizable:false},
            { title: "Fecha Terreno", width: 120, dataType: "string", dataIndx: "C5", halign:"center", align:"center", resizable:false},
            { title: "Realizada", width: 100, dataType: "string",  dataIndx: "C6", halign:"center", align:"center", resizable:false},
            { title: "Observaciones", width: 320, dataType: "string", dataIndx: "C7", halign:"center", align:"left", resizable:false},
            { title: "Deuda", width: 100, dataType: "string", dataIndx: "C8"    , halign:"center", align:"right", resizable:false},
            { title: "Antigüedad", width: 100, dataType: "string", dataIndx: "C9"    , halign:"center", align:"right", resizable:false},
            { title: "Convenio", width: 100, dataType: "string", dataIndx: "C10"    , halign:"center", align:"center", resizable:false},
            { title: "Estado Conexión", width: 160, dataType: "string", dataIndx: "C11"    , halign:"center", align:"center", resizable:false}
            
        ];
		
    $grid_insp_corte = $("#div_grid_ins_cor").pqGrid(obj);
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_setea_grid_todos()
{  
    var obj = {  
	        height: "100%",
            showTop: true,
			showBottom:true,
            showTitle : false,
            roundCorners: true,
            rowBorders: true,
            columnBorders: true,
            collapsible:false,
			editable:false,
            selectionModel: { type: 'row',mode:'single'},
            numberCell: { show: true },
			pageModel: { rPP: 20, type: "local", rPPOptions: [20, 50, 100]},
        	scrollModel:{theme:true},
			toolbar:
           {
               cls: "pq-toolbar-export",
               items:
               [
                   { type: "button", label: " Excel"        ,  attr:"id=co_excel_todos"       , cls:"btn btn-default"},
               ]
           }
        };
			
		obj.colModel = [            
            { title: "Fecha Inicio", width: 100, dataType: "string", dataIndx: "C1", halign:"center", align:"center", resizable:false},
            { title: "Tipo Acción", width: 180, dataType: "string", dataIndx: "C2", halign:"center", align:"center", resizable:false},
            { title: "Realizada", width: 100, dataType: "string", dataIndx: "C3", halign:"center", align:"center", resizable:false},
            { title: "Fecha Acción", width: 120, dataType: "string", dataIndx: "C4", halign:"center", align:"center", resizable:false},
            { title: "Observación", width: 320, dataType: "string", dataIndx: "C5", halign:"center", align:"left", resizable:false},
            { title: "Deuda IDANN", width: 120, dataType: "string",  dataIndx: "C6", halign:"center", align:"right", resizable:false},
            { title: "Antigüedad de Saldo", width: 120, dataType: "string", dataIndx: "C7", halign:"center", align:"right", resizable:false},
            { title: "Tiene Convenio", width: 120, dataType: "string", dataIndx: "C8"    , halign:"center", align:"center", resizable:false},
            { title: "Estado Conexión", width: 140, dataType: "string", dataIndx: "C9"    , halign:"center", align:"center", resizable:false},
            { title: "Rol", width: 120, dataType: "string", dataIndx: "C10"    , halign:"center", align:"center", resizable:false},
            
        ];
		
    $grid_todos = $("#div_grid_todos").pqGrid(obj);
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_setea_grid_judicial()
{  
    var obj = {  
	        height: "100%",
            showTop: true,
			showBottom:true,
            showTitle : false,
            roundCorners: true,
            rowBorders: true,
            columnBorders: true,
            collapsible:false,
			editable:false,
            selectionModel: { type: 'row',mode:'single'},
            numberCell: { show: true },
			pageModel: { rPP: 20, type: "local", rPPOptions: [20, 50, 100]},
        	scrollModel:{theme:true},
			toolbar:
           {
               cls: "pq-toolbar-export",
               items:
               [
                   { type: "button", label: " Excel"        ,  attr:"id=co_excel_judicial"       , cls:"btn btn-default"},
               ]
           }
        };
			
		obj.colModel = [            
            { title: "Fecha Inicio", width: 100, dataType: "string", dataIndx: "C1", halign:"center", align:"center", resizable:false},
            { title: "Tipo Acción", width: 180, dataType: "string", dataIndx: "C2", halign:"center", align:"center", resizable:false},
            { title: "Realizada", width: 100, dataType: "string", dataIndx: "C3", halign:"center", align:"center", resizable:false},
            { title: "Fecha Acción", width: 120, dataType: "string", dataIndx: "C4", halign:"center", align:"center", resizable:false},
            { title: "Observación", width: 320, dataType: "string", dataIndx: "C5", halign:"center", align:"left", resizable:false},
            { title: "Deuda IDANN", width: 120, dataType: "string",  dataIndx: "C6", halign:"center", align:"right", resizable:false},
            { title: "Antigüedad de Saldo", width: 120, dataType: "string", dataIndx: "C7", halign:"center", align:"right", resizable:false},
            { title: "Tiene Convenio", width: 120, dataType: "string", dataIndx: "C8"    , halign:"center", align:"center", resizable:false},
            { title: "Estado Conexión", width: 140, dataType: "string", dataIndx: "C9"    , halign:"center", align:"center", resizable:false},
            { title: "Rol", width: 120, dataType: "string", dataIndx: "C10"    , halign:"center", align:"center", resizable:false},
            
        ];
		
    $grid_judicial = $("#div_grid_judicial").pqGrid(obj);
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_setea_grid_obs()
{  
    var obj = {  
	        height: "100%",
            showTop: true,
			showBottom:true,
            showTitle : false,
            roundCorners: true,
            rowBorders: true,
            columnBorders: true,
            collapsible:false,
			editable:false,
            selectionModel: { type: 'row',mode:'single'},
            numberCell: { show: true },
			pageModel: { rPP: 20, type: "local", rPPOptions: [20, 50, 100]},
        	scrollModel:{theme:true},
			toolbar:
           {
               cls: "pq-toolbar-export",
               items:
               [
                   { type: "button", label: " Excel"        ,  attr:"id=co_excel_obs"       , cls:"btn btn-default"},
                   { type: "button", label: " obser"        ,  attr:"id=co_obser"       , cls:"btn btn-default"},
               ]
           }
        };
			
		obj.colModel = [            
            { title: "Fecha Inicio", width: 100, dataType: "string", dataIndx: "C1", halign:"center", align:"center", resizable:false},
            { title: "Tipo Acción", width: 180, dataType: "string", dataIndx: "C2", halign:"center", align:"center", resizable:false},
            { title: "Realizada", width: 100, dataType: "string", dataIndx: "C3", halign:"center", align:"center", resizable:false},
            { title: "Fecha Acción", width: 120, dataType: "string", dataIndx: "C4", halign:"center", align:"center", resizable:false},
            { title: "Observación", width: 320, dataType: "string", dataIndx: "C5", halign:"center", align:"left", resizable:false},
            { title: "Deuda IDANN", width: 120, dataType: "string",  dataIndx: "C6", halign:"center", align:"right", resizable:false},
            { title: "Antigüedad de Saldo", width: 120, dataType: "string", dataIndx: "C7", halign:"center", align:"right", resizable:false},
            { title: "Tiene Convenio", width: 120, dataType: "string", dataIndx: "C8"    , halign:"center", align:"center", resizable:false},
            { title: "Estado Conexión", width: 140, dataType: "string", dataIndx: "C9"    , halign:"center", align:"center", resizable:false},
            { title: "Rol", width: 120, dataType: "string", dataIndx: "C10"    , halign:"center", align:"center", resizable:false},
            
        ];
		
    $grid_obs = $("#div_grid_obs").pqGrid(obj);
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_setea_grid_eventos()
{  
    var obj = {  
	        height: "100%",
            showTop: true,
			showBottom:true,
            showTitle : false,
            roundCorners: true,
            rowBorders: true,
            columnBorders: true,
            collapsible:false,
			editable:false,
            selectionModel: { type: 'row',mode:'single'},
            numberCell: { show: true },
			pageModel: { rPP: 20, type: "local", rPPOptions: [20, 50, 100]},
        	scrollModel:{theme:true},
			toolbar:
           {
               cls: "pq-toolbar-export",
               items:
               [
                   { type: "button", label: " Excel"        ,  attr:"id=co_excel_event"       , cls:"btn btn-default"},
               ]
           }
        };
			
		obj.colModel = [            
            { title: "Fecha", width: 120, dataType: "string", dataIndx: "C1", halign:"center", align:"center", resizable:false},
            { title: "Descripción", width: 220, dataType: "string", dataIndx: "C2", halign:"center", align:"center", resizable:false},
            { title: "Valor", width: 120, dataType: "string", dataIndx: "C3", halign:"center", align:"right", resizable:false},
            { title: "Estado Cobranza", width: 180, dataType: "string", dataIndx: "C4", halign:"center", align:"center", resizable:false},
            { title: "En Convenio", width: 120, dataType: "string", dataIndx: "C5", halign:"center", align:"center", resizable:false},
            { title: "Detalle", width: 520, dataType: "string",  dataIndx: "C6", halign:"center", align:"left", resizable:false},
            
        ];
		
    $grid_event = $("#div_grid_event").pqGrid(obj);
}


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_Muestra_Filtro()
{
    $("#div_filtro_bts").modal({backdrop: "static",keyboard:false});
	$("#div_filtro_bts").on("shown.bs.modal", function () {
		$("#div_filtro_bts div.modal-footer button").focus();
		//Aplicar trabajo cuando esta visible el objeto	
	});

}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_modal_llamada()
{
    fn_limpiar_llamada();
    $("#dlg_llam_tel").modal({backdrop: "static",keyboard:false});
	$("#dlg_llam_tel").on("shown.bs.modal", function () {
		//$("#dlg_llam_tel div.modal-body cb_tip_resp").focus();
		//Aplicar trabajo cuando esta visible el objeto	
	});
    

}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_modal_analista()
{
    fn_limpiar_analista();
    $("#dlg_analista").modal({backdrop: "static",keyboard:false});
	$("#dlg_analista").on("shown.bs.modal", function () {
		$("#cb_analista").focus();
	});  

}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_modal_obs(accion)
{
    accion_btn = accion;
    $("#tx_obs_obs").val("");
    $("#dlg_obs").modal({backdrop: "static",keyboard:false});
	$("#dlg_obs").on("shown.bs.modal", function () {
		$("#tx_obs_obs").focus();
	});  

}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_modal_valorizar()
{
    fn_limpiar_valorizar();
    $("#dlg_valorizar").modal({backdrop: "static",keyboard:false});
	$("#dlg_valorizar").on("shown.bs.modal", function () {
		$("#tx_nombre_val").focus();
	});  

}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_modal_inspec()
{
    //fn_limpiar_inspec();
    $("#dlg_inspec").modal({backdrop: "static",keyboard:false});
	$("#dlg_inspec").on("shown.bs.modal", function () {
        $("#cb_tip_insp").val("1");
        //$("#cb_motivo_ins").focus();
	});
} 

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_modal_corte()
{
    fn_limpiar_corte();
    $("#dlg_corte").modal({backdrop: "static",keyboard:false});
	$("#dlg_corte").on("shown.bs.modal", function () {
		$("#cb_motivo_cor").focus();
	});
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_modal_noti(noti)
{
    fn_limpiar_noti();
    tipo_noti = noti;
    $("#dlg_noti").modal({backdrop: "static",keyboard:false});
	$("#dlg_noti").on("shown.bs.modal", function () {
		$("#cb_ofi_con").focus();
	});
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_modal_noti_cap(noti)
{
    fn_limpiar_noti_cap();
    $("#dlg_noti_capt").modal({backdrop: "static",keyboard:false});
	$("#dlg_noti_capt").on("shown.bs.modal", function () {
		//$("#cb_ofi_con").focus();
	});
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_carga_datos()
{
    dato_original = [];

    parameters = {
                    "func":"fn_generales",
                    "empresa":$("#tx_empresa").val(),
                    "p_cliente":$("#tx_cliente").val()
                };

    HablaServidor("datos_cliente.txt",parameters,'text', function(text) 
    {

        if($.trim(text)=="") {
            fn_mensaje_boostrap("NÚMERO DE CLIENTE NO EXISTE", g_tit, $("#tx_cliente"));
            return 0;
        }

        dato_original = text.split("|");
        $("#tx_cliente").val(dato_original[0]);
        $("#tx_nombre").val(dato_original[1]);
        $("#tx_direccion").val(dato_original[2]);
        if(dato_original[4].length==7)
            $("#tx_telefono").val(dato_original[4].substring(0,3)+'-'+dato_original[4].substring(3,7));
        else
            $("#tx_telefono").val(dato_original[4]);
        $("#tx_correo").val(dato_original[5]);
        $("#tx_tarifa").val(dato_original[6]);
        $("#tx_act_eco").val(dato_original[7]);
        $("#tx_deuda_total_ini").val(dato_original[8]);
        $("#tx_ant_saldo_ini").val(dato_original[9]);
        $("#tx_deuda_total").val(dato_original[10]);
        $("#tx_ant_saldo").val(dato_original[11]);
        $("#tx_estado").val(dato_original[12]);
		
    });	
    
    fn_grilla_todos();
    fn_grilla_llamadas();
    fn_grilla_avisos();
    fn_grilla_inspec();
    fn_grilla_judicial();
    fn_grilla_obs();
    fn_grilla_event();
    	
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_grilla_principal()
{
	/*
	fn_filtro();
	
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
			setTimeout(function(){ fn_mensaje_boostrap(jqErr.responseText, g_tit, $("") ) }, 0);
        }

    }

    $grid_principal.pqGrid( "option", "dataModel", dataModel );				
    $grid_principal.pqGrid( "refreshDataAndView" );
    */
    
    //pruebas
    parameters = 
    {
        "func":"fn_grid_prin",
        "p_cliente":$("#tx_cliente").val(),
        "empresa" : $("#tx_empresa").val()
    };

    cadenajson="";
    HablaServidor("datos_principal.json",parameters,'text', function(text) 
    {
        $(".pq-loading").hide();
        try{
            $grid_principal.pqGrid( "option", "dataModel.data", eval(text));
            $grid_principal.pqGrid( "refreshDataAndView" );
        }
        catch(err) {
            console.log("Error en el formato de la cadena de respuesta grid llamadas");
            $grid_principal.pqGrid( "option", "dataModel.data", [] );
            $grid_principal.pqGrid( "refreshDataAndView" );
        }		
    });
    // fin pruebas
    
}


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
//Se cargan los datos del grid de llamadas teléfonicas
function fn_grilla_llamadas()
{
	
    //pruebas
    parameters = 
    {
        "func":"fn_hist_acciones",
        "p_cliente":$("#tx_cliente").val(),
        "empresa" : $("#tx_empresa").val()
    };

    cadenajson="";
    HablaServidor("datos_accion.json",parameters,'text', function(text) 
    {
        $(".pq-loading").hide();
        try{
            $grid_llamadas.pqGrid( "option", "dataModel.data", eval(text));
            $grid_llamadas.pqGrid( "refreshDataAndView" );
        }
        catch(err) {
            console.log("Error en el formato de la cadena de respuesta grid llamadas");
            $grid_llamadas.pqGrid( "option", "dataModel.data", [] );
            $grid_llamadas.pqGrid( "refreshDataAndView" );
        }		
    });
    // fin pruebas

}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
//Se cargan los datos del grid de notificaciones
function fn_grilla_avisos()
{
	
    //pruebas
    parameters = 
    {
        "func":"fn_hist_eventos",
        "p_cliente":$("#tx_cliente").val(),
        "empresa" : $("#tx_empresa").val()
    };

    cadenajson="";
    HablaServidor("datos_eventos.json",parameters,'text', function(text) 
    {
        $(".pq-loading").hide();
        try{
            $grid_avisos.pqGrid( "option", "dataModel.data", eval(text));
            $grid_avisos.pqGrid( "refreshDataAndView" );
        }
        catch(err) {
            console.log("Error en el formato de la cadena de respuesta grid avisos");
            $grid_avisos.pqGrid( "option", "dataModel.data", [] );
            $grid_avisos.pqGrid( "refreshDataAndView" );
        }		
    });
    // fin pruebas

}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
//Se cargan los datos del grid de inspecciones y cortes
function fn_grilla_inspec()
{
	
    //pruebas
    parameters = 
    {
        "func":"fn_hist_inspec",
        "p_cliente":$("#tx_cliente").val(),
        "empresa" : $("#tx_empresa").val()
    };

    cadenajson="";
    HablaServidor("datos_inspec.json",parameters,'text', function(text) 
    {
        $(".pq-loading").hide();
        try{
            $grid_insp_corte.pqGrid( "option", "dataModel.data", eval(text));
            $grid_insp_corte.pqGrid( "refreshDataAndView" );
        }
        catch(err) {
            console.log("Error en el formato de la cadena de respuesta grid inspec");
            $grid_insp_corte.pqGrid( "option", "dataModel.data", [] );
            $grid_insp_corte.pqGrid( "refreshDataAndView" );
        }		
    });
    // fin pruebas

}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
//Se cargan los datos del grid de todos - acciones
function fn_grilla_todos()
{
	
    //pruebas
    parameters = 
    {
        "func":"fn_hist_todo",
        "p_cliente":$("#tx_cliente").val(),
        "empresa" : $("#tx_empresa").val()
    };

    cadenajson="";
    HablaServidor("datos_todos.json",parameters,'text', function(text) 
    {
        $(".pq-loading").hide();
        try{
            $grid_todos.pqGrid( "option", "dataModel.data", eval(text));
            $grid_todos.pqGrid( "refreshDataAndView" );
        }
        catch(err) {
            console.log("Error en el formato de la cadena de respuesta grid todos");
            $grid_todos.pqGrid( "option", "dataModel.data", [] );
            $grid_todos.pqGrid( "refreshDataAndView" );
        }		
    });
    // fin pruebas
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
//Se cargan los datos del grid de cobranza judicial
function fn_grilla_judicial()
{
	
    //pruebas
    parameters = 
    {
        "func":"fn_hist_todo",
        "p_cliente":$("#tx_cliente").val(),
        "empresa" : $("#tx_empresa").val()
    };

    cadenajson="";
    HablaServidor("datos_todos.json",parameters,'text', function(text) 
    {
        $(".pq-loading").hide();
        try{
            $grid_judicial.pqGrid( "option", "dataModel.data", eval(text));
            $grid_judicial.pqGrid( "refreshDataAndView" );
        }
        catch(err) {
            console.log("Error en el formato de la cadena de respuesta grid judicial");
            $grid_judicial.pqGrid( "option", "dataModel.data", [] );
            $grid_judicial.pqGrid( "refreshDataAndView" );
        }		
    });
    // fin pruebas
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
//Se cargan los datos del grid de observaciones
function fn_grilla_obs()
{
	
    //pruebas
    parameters = 
    {
        "func":"fn_hist_todo",
        "p_cliente":$("#tx_cliente").val(),
        "empresa" : $("#tx_empresa").val()
    };

    cadenajson="";
    HablaServidor("datos_todos.json",parameters,'text', function(text) 
    {
        $(".pq-loading").hide();
        try{
            $grid_obs.pqGrid( "option", "dataModel.data", eval(text));
            $grid_obs.pqGrid( "refreshDataAndView" );
        }
        catch(err) {
            console.log("Error en el formato de la cadena de respuesta grid observaciones");
            $grid_obs.pqGrid( "option", "dataModel.data", [] );
            $grid_obs.pqGrid( "refreshDataAndView" );
        }		
    });
    // fin pruebas
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
//Se cargan los datos del grid de observaciones
function fn_grilla_event()
{
	
    //pruebas
    parameters = 
    {
        "func":"fn_hist_todo",
        "p_cliente":$("#tx_cliente").val(),
        "empresa" : $("#tx_empresa").val()
    };

    cadenajson="";
    HablaServidor("datos_event.json",parameters,'text', function(text) 
    {
        $(".pq-loading").hide();
        try{
            $grid_event.pqGrid( "option", "dataModel.data", eval(text));
            $grid_event.pqGrid( "refreshDataAndView" );
        }
        catch(err) {
            console.log("Error en el formato de la cadena de respuesta grid eventos");
            $grid_event.pqGrid( "option", "dataModel.data", [] );
            $grid_event.pqGrid( "refreshDataAndView" );
        }		
    });
    // fin pruebas
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
//Se carga combo tipo cliente para el filtro
function fn_carga_tipo_cli(){
    
    parameters = 
    {
		"func":"fn_tip_cliente",
		"empresa":$("#tx_empresa").val()
    };
    HablaServidor(my_url,parameters,'text', function(text) 
    {
        if(text != "")
            $("#cb_fil_tip_cli").html(text);
    });
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
//Se carga combo tipos de inspección a solicitar
function fn_carga_tipo_inspec(){
    
    parameters = 
    {
		"func":"fn_tip_inspec",
		"empresa":$("#tx_empresa").val()
    };
    HablaServidor(my_url,parameters,'text', function(text) 
    {
        if(text != "")
            $("#cb_tip_insp").html(text);
    });
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
//Se carga el combo tipo de respuesta telefonica y de la entrega de notificación
function fn_carga_tipo_resp(){
    
    parameters = 
    {
		"func":"fn_tip_resp",
		"empresa":$("#tx_empresa").val()
    };
    HablaServidor(my_url,parameters,'text', function(text) 
    {
        if(text != ""){
            $("#cb_tip_resp").html(text);
            $("#cb_tip_resp_noti").html(text);
        } 
    });
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
//Se carga el combo motivos de la inspección a generar
function fn_carga_motivo_insp(){
    
    parameters = 
    {
		"func":"fn_motivo_insp",
		"empresa":$("#tx_empresa").val()
    };
    HablaServidor(my_url,parameters,'text', function(text) 
    {
        if(text != "")
            $("#cb_motivo_ins").html(text);
    });
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
//Se carga combo motivos del corte a generar.
function fn_carga_motivo_corte(){
    
    parameters = 
    {
		"func":"fn_motivo_corte",
		"empresa":$("#tx_empresa").val()
    };
    HablaServidor(my_url,parameters,'text', function(text) 
    {
        if(text != "")
            $("#cb_motivo_cor").html(text);
    });
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
//Se carga el combo de las oficinas de contacto.
function fn_carga_oficina_cont(){
    
    parameters = 
    {
		"func":"fn_oficina",
		"empresa":$("#tx_empresa").val()
    };
    HablaServidor(my_url,parameters,'text', function(text) 
    {
        if(text != "")
            $("#cb_ofi_con").html(text);
    });
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_carga_tip_doc()
{
    $("#cb_tipo_doc").html("<option value ='' selected ></option><option value='01' >PASAPORTE</option><option value='02' >CÉDULA</option>");
    return;  //pruebas quitar
    var param= 
    {
        "func":"fn_tipo_doc",
        "empresa":$("#tx_empresa").val()
    };
    HablaServidor(url, param, "text", function(text) 
    {
        $("#cb_tipo_doc").html(text);
    });
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_carga_tip_doc2()
{
    $("#cb_tipo_doc2").html("<option value ='  ' selected >  </option><option value='AV' >AV</option><option value='E ' >E </option>");
    return;  //pruebas quitar
    var param= 
    {
        "func":"fn_tipo_cedula",
        "empresa":$("#tx_empresa").val()
    };
    HablaServidor(url, param, "text", function(text) 
    {
        $("#cb_tipo_doc2").html(text);
    });
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
//Se registra la llamada teléfonica
function fn_ingresa_llamada(){
    
    parameters = 
    {
		"func":"fn_ingresa_accion",
		"empresa":$("#tx_empresa").val(),
        "p_rol":$("#tx_rol").val(),
        "Ip":$("#tx_ip").val(),
        "p_cliente":$("#tx_cliente").val(),
        "p_accion":"3", //accion de llamada teléfonica
        "p_tipo_resp":$("#cb_tip_resp").val(),
        "p_fec_comp":$("#tx_fil_fec_comp").val(),
        "p_obs_ini":$("#tx_obs_llam").val()
        
    };
    HablaServidor(my_url,parameters,'text', function(text) 
    {
        if(text == ""){
            fn_mensaje_boostrap("ACCIÓN REALIZADA", g_tit, $("#"));
            $grid_llamadas.pqGrid( "refreshDataAndView" );
        }
            
    });
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
//Se registra la Inspección.
function fn_ingresa_inspec(){
    
    parameters = 
    {
		"func":"fn_ingresa_accion",
		"empresa":$("#tx_empresa").val(),
        "p_rol":$("#tx_rol").val(),
        "Ip":$("#tx_ip").val(),
        "p_cliente":$("#tx_cliente").val(),
        "p_accion":"2", //accion de llamada teléfonica
        "p_tipo_resp":$("#cb_tip_resp").val(),
        "p_fec_comp":$("#tx_fil_fec_comp").val(),
        "p_obs_ini":$("#tx_obs_llam").val()
        
    };
    HablaServidor(my_url,parameters,'text', function(text) 
    {
        if(text == ""){
            fn_mensaje_boostrap("ACCIÓN REALIZADA", g_tit, $("#"));
            $grid_insp_corte.pqGrid( "refreshDataAndView" );
        }
            
    });
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
//Se registra la Notificación.
function fn_ingresa_noti(){
    
    var notificacion = "4"; //Codigo de la Primera notificación
    if(tipo_noti == "2") //Segunda notificacion
        notificacion = "5";
    parameters = 
    {
		"func":"fn_ingresa_accion",
		"empresa":$("#tx_empresa").val(),
        "p_rol":$("#tx_rol").val(),
        "Ip":$("#tx_ip").val(),
        "p_cliente":$("#tx_cliente").val(),
        "p_accion":notificacion, //accion de la notificación
        "p_tipo_resp":$("#cb_tip_resp").val(),
        "p_fec_comp":$("#tx_fil_fec_comp").val(),
        "p_obs_ini":$("#tx_obs_llam").val()
        
    };
    HablaServidor(my_url,parameters,'text', function(text) 
    {
        if(text == ""){
            fn_mensaje_boostrap("ACCIÓN REALIZADA", g_tit, $("#"));
            $grid_avisos.pqGrid( "refreshDataAndView" );
        }
            
    });
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
//Se registra la Notificación.
function fn_ingresa_noti_cap(){
    
    parameters = 
    {
		"func":"fn_ingresa_accion",
		"empresa":$("#tx_empresa").val(),
        "p_rol":$("#tx_rol").val(),
        "Ip":$("#tx_ip").val(),
        "p_cliente":$("#tx_cliente").val(),
        "p_accion":"5", //accion de la notificación
        "p_entrega":$("#cb_entrega").val(),
        "p_tipo_resp":$("#cb_tip_resp_noti").val(),
        "p_fec_terreno":$("#tx_fecha_terr").val(),
        "p_fec_comp":$("#tx_fecha_comp_noti").val(),
        "p_obs_ini":$("#tx_obs_noti_cap").val()
        
    };

    HablaServidor(my_url,parameters,'text', function(text) 
    {
        if(text == ""){
            fn_mensaje_boostrap("ACCIÓN REALIZADA", g_tit, $("#"));
            $grid_avisos.pqGrid( "refreshDataAndView" );
        }
            
    });
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
//Se actualiza el analista de la cobranza.
function fn_act_analista(){
    
    parameters = 
    {
		"func":"fn_act_analista",
		"empresa":$("#tx_empresa").val(),
        "p_rol":$("#tx_rol").val(),
        "Ip":$("#tx_ip").val(),
        "p_cliente":$("#tx_cliente").val(),
        "p_accion":"5", //accion de actualizar analista
        "p_analista":$("#cb_analista").val(),
        "p_obs_ini":$("#tx_obs_analista").val()
        
    };

    HablaServidor(my_url,parameters,'text', function(text) 
    {
        if(text == "")
            fn_mensaje_boostrap("ACCIÓN REALIZADA", g_tit, $("#"));
            
    });
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
//Se actualiza los datos de valorización.
function fn_valorizar(){
    
    var dato_id;
    
    if( $("#cb_tipo_doc").val() == "02") 
        dato_id = $("#tx_doc1").val() + $("#cb_tipo_doc2").val() +  $("#tx_doc2").val() + $("#tx_doc3").val();
    else
        dato_id = $("#tx_doc").val();
    
    parameters = 
    {
		"func":"fn_valorizar",
		"empresa":$("#tx_empresa").val(),
        "p_rol":$("#tx_rol").val(),
        "Ip":$("#tx_ip").val(),
        "p_cliente":$("#tx_cliente").val(),
        "p_accion":"5", //accion de actualizar valorización
        "p_nombre_val":$("#tx_nombre_val").val(),
        "p_tipo_doc":$("#cb_tipo_doc").val(),
        "p_documento":dato_id,
        "p_finca":$("#tx_finca").val(),
        "p_tomo":$("#tx_tomo").val(),
        "p_folio":$("#tx_folio").val(),
        "p_obs":$("#tx_obs_valorizar").val()   
        
    };

    $("#dlg_valorizar").modal("hide");
    
    HablaServidor(my_url,parameters,'text', function(text) 
    {
        if(text == "")
            fn_mensaje_boostrap("ACCIÓN REALIZADA", g_tit, $("#"));
            
    });
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
//Se ejecuta la accion: anular - finalizar - juzgado.
function fn_acciones(){
    var eje_fun = "fn_juzgado"
    if(accion_btn == 2)
        eje_fun = "fn_anular";
    else
        if(accion_btn = 3)
            eje_fun = "fn_finalizar";
    
    parameters = 
    {
		"func":eje_fun,
		"empresa":$("#tx_empresa").val(),
        "p_rol":$("#tx_rol").val(),
        "Ip":$("#tx_ip").val(),
        "p_cliente":$("#tx_cliente").val(),
        "p_accion":"5", //accion de actualizar valorización
        "p_nombre_val":$("#tx_nombre_val").val(),
        "p_tipo_doc":$("#cb_tipo_doc").val(),
        "p_documento":dato_id,
        "p_finca":$("#tx_finca").val(),
        "p_tomo":$("#tx_tomo").val(),
        "p_folio":$("#tx_folio").val(),
        "p_obs":$("#tx_obs_valorizar").val()   
        
    };

    $("#dlg_valorizar").modal("hide");
    
    HablaServidor(my_url,parameters,'text', function(text) 
    {
        if(text == "")
            fn_mensaje_boostrap("ACCIÓN REALIZADA", g_tit, $("#"));
            
    });
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_filtro()
{

	parameters = 
    {
		"func":"fn_grilla_prin",
		"empresa":$("#tx_empresa").val(),
		"rol":$("#tx_rol").val(),
		"ip":$("#tx_ip").val(),
		"p_fec_ini":$("#tx_fil_fec_ini").val(),
		"p_fec_fin":$("#tx_fil_fec_fin").val(),
		"p_deu_min":$("#tx_fil_deu_min").val(),
		"p_deu_max":$("#tx_fil_deu_max").val(),
		"p_cliente":$("#tx_fil_cliente").val(),
        "p_conve":$("#cb_fil_conve").val()
    };
	
	Filtros = [];
	
	if ($("#tx_fil_cliente").val()!='') Filtros.push('N° Cliente = '+$("#tx_fil_cliente").val());
	if ($("#tx_fil_fec_ini").val()!='') Filtros.push('Fecha Desde = '+$("#tx_fil_fec_ini").val());
	if ($("#tx_fil_fec_fin").val()!='') Filtros.push('Fecha Hasta = '+$("#tx_fil_fec_fin").val());
	if ($("#tx_fil_deu_min").val()!='') Filtros.push('Deuda Min = '+$("#tx_fil_deu_min").val());
	if ($("#tx_fil_deu_max").val()!='') Filtros.push('Deuda Max = '+$("#tx_fil_deu_max").val());
    if ($("#cb_fil_conve").val()!='') Filtros.push('Tiene Conve = '+$("#tx_fil_deu_max").val());
	
	$("#filtro").val(Filtros);
}



//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_limpia_filtro()
{
	$("#tx_fil_fec_ini").val("");
	$("#tx_fil_fec_fin").val("");
	$("#cb_fil_opc_conve").val("");
	$("#tx_fil_deu_min").val("");
	$("#tx_fil_deu_max").val("");
	$("#cb_fil_tip_cli").val("");
    $("#cb_fil_conve").val("");
    $("#tx_fil_cliente").val("");
}


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_limpiar(){
    
    $("#tx_cliente").val("");
    $("#tx_nombre").val("");
    $("#tx_direccion").val("");
    $("#tx_estado").val("");
    $("#tx_telefono").val("");
    $("#tx_correo").val("");
    $("#tx_tarifa").val("");
    $("#tx_act_eco").val("");
    $("#tx_deuda_total_ini").val("");
    $("#tx_ant_saldo_ini").val("");
    $("#tx_deuda_total").val("");
    $("#tx_ant_saldo").val("");
		
	$("#co_deuda").prop("disabled", true);
    
}

function fn_limpiar_llamada(){
    $("#cb_tip_resp").val("");
    $("#tx_fil_fec_comp").val("");
    $("#tx_obs_llam").val("");
}

function fn_limpiar_analista(){
    $("#cb_analista").val("");
    $("#tx_obs_analista").val("");
}

function fn_limpiar_valorizar(){
    $("#tx_nombre_val").val("");
    $("#cb_tipo_doc").val("");
    $("#tx_doc").val("");
    $("#tx_doc1").val("");
    $("#cb_tipo_doc2").val("");
    $("#tx_doc2").val("");
    $("#tx_doc3").val("");
    $("#tx_finca").val("");
    $("#tx_tomo").val("");
    $("#tx_folio").val("");
    $("#tx_obs_valorizar").val("");
}

function fn_limpiar_inspec(){
    $("#cb_motivo_ins").val("");
    $("#cb_obs_insp").val("");
}

function fn_limpiar_corte(){
    $("#cb_motivo_cor").val("");
    $("#tx_obs_corte").val("");
}

function fn_limpiar_noti(){
    $("#cb_ofi_con").val("");
    $("#tx_obs_noti").val("");
}

function fn_limpiar_noti_cap(){
    $("#cb_ofi_con").val("");
    $("#tx_fecha_terr").val("");
    $("#cb_tip_resp_noti").val("");
    $("#tx_fecha_comp_noti").val("");
    $("#tx_obs_noti_cap").val("");
    $("#cb_entrega").val("");
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_habilita_dia(estado)
{
    $("#tx_doc").prop("disabled", estado);
    $("#tx_doc1").prop("disabled", estado);
    $("#tx_doc2").prop("disabled", estado);  
    $("#tx_doc3").prop("disabled", estado);   
    $("#cb_tipo_doc2").prop("disabled", estado);
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
function fn_valida_valorizar(){
    if($("#tx_nombre_val").val()==""){
        fn_mensaje_boostrap("Debe digitar el nombre", g_tit, $("#tx_nombre_val"));
        return false;  
    }
    
    if($("#cb_tipo_doc").val()==""){
        fn_mensaje_boostrap("Debe elegir un Tipo de Identidad", g_tit, $("#cb_tipo_doc"));
        return false;  
    }
       
    if($("#cb_tipo_doc").val()=="02" && ($("#tx_doc1").val()=="" || $("#tx_doc2").val()=="" || $("#tx_doc3").val()=="" || $("#cb_tipo_doc2").val()=="")){
        fn_mensaje_boostrap("Falta datos de identidad", g_tit, $(""));
        return false;  
    }
    else{
        if($("#cb_tipo_doc").val()!="02" && $("#tx_doc").val()==""){
            fn_mensaje_boostrap("Debe digitar el número de identidad", g_tit, $("#tx_doc"));
            return false;
        }
    }
    if($("#tx_finca").val()==""){
        fn_mensaje_boostrap("Debe digitar los datos de la finca", g_tit, $("#tx_finca"));
        return false;  
    }
    if($("#tx_tomo").val()==""){
        fn_mensaje_boostrap("Debe digitar los datos del tomo", g_tit, $("#tx_tomo"));
        return false;  
    }
    if($("#tx_folio").val()==""){
        fn_mensaje_boostrap("Debe digitar los datos del folio", g_tit, $("#tx_folio"));
        return false;  
    }
    return true;
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
function fn_valida_obs(){
    if($("#tx_obs_obs").val()==""){
        fn_mensaje_boostrap("Debe digitar una observación", g_tit, $("#tx_obs_obs"));
        return false;  
    }
    return true;
}
