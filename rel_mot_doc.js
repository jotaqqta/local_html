var g_modulo = "Atención Integral de Clientes";
var g_tit = "Relación Motivo Documentos";
var $grid_principal;
var sql_grid_prim = "";
var parameters = {};

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
$(document).keydown(function (e) {

    if (e.keyCode === 8) {
        var element = e.target.nodeName.toLowerCase();
        if ((element != 'input' && element != 'textarea') || $(e.target).attr("readonly")) {
            return false;
        }
    }
});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

$(document).ready(function () {
    jQuery('#tx_cod').keypress(function (tecla){
        if (tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
    jQuery('#tx_cons').keypress(function (tecla){
        if (tecla.charCode < 48 || tecla.charCode > 57) return false;
    });

    //COMBOS

    fn_tipo_atencion();
    fn_mot_cliente();
    fn_mot_empresa();
    fn_documento();

    // PARA ELIMINAR EL SUBMIT
    $("button").on("click", function () { return false; });
    //INGRESA LOS TITULOS
    document.title = g_tit;
    document.body.scroll = "yes";
    ///raiz/
    $("#div_header").load("syn_globales/header.htm", function () {
        $("#div_mod0").html(g_modulo);
        $("#div_tit0").html(g_tit);
    });

    //Footer  ///raiz/
    $("#div_footer").load("syn_globales/footer.htm");
    $("#excel_archivo").val("tablas_generales.xls");
    $("#tx_empresa").val("1");
    $("#tx_rol").val("SYNERGIA");
    $("#tx_ip").val("127.0.0.1");

    //DEFINE LA GRILLA PRINCIPAL
    fn_setea_grid_principal();

    //DIBUJA LOS ICONOS DE LOS BOTONES

    $("#co_nuevo").html("<span class='glyphicon glyphicon-plus'></span> Nuevo");
    $("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
    $("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
//BOTONES-EVENTOS

    $("#co_nuevo").on("click", fn_nuevo)

    $("#co_guardar").on("click", function() {

        // Nuevo
        if ($.trim($("#co_guardar").text()) == "Guardar") {

            if ($("#cb_tipo_atencion").val() == "") {

                fn_mensaje('#mensaje_new','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UN TIPO DE ATENCIÓN!!!</strong></div>',3000);
                $("#cb_tipo_atencion").focus();
                return;
            }

            if ($("#cb_mot_cliente").val() == "") {

                fn_mensaje('#mensaje_new','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UN MOTIVO CLIENTE!!!</strong></div>',3000);
                $("#cb_mot_cliente").focus();
                return;
            }

            if ($("#cb_mot_empresa").val() == "") {

                fn_mensaje('#mensaje_new','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UN MOTIVO EMPRESA!!!</strong></div>',3000);
                $("#cb_mot_empresa").focus();
                return;
            }

            if ($("#cb_documento").val() == "") {

                fn_mensaje('#mensaje_new','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UN DOCUMENTO!!!</strong></div>',3000);
                $("#cb_documento").focus();
                return;
            }

            fn_mensaje_boostrap("Se genero", g_tit, $("#co_guardar"));
            $("#div_prin").slideDown();
            $("#div_new_bts").slideUp();
            $('#div_new_bts').modal('hide');
            $(window).scrollTop(0);

        }
    });

    $("#co_borrard").on("click", function( ) {

        $("#dlg_confirm").modal({backdrop: "static",keyboard:false});
        $("#dlg_confirm").on("shown.bs.modal", function () {
            $("#dlg_confirm div.modal-footer button").focus();

        });
    });

    $("#co_limpiar").on("click", function () {
        if ($.trim($("#co_limpiar").text()) == "Limpiar") {
            fn_limpiar();
            return;
        }
        else
            window.close();
    });

    $("#co_cancel").on("click", function (){
        $('#div_new_bts').modal('hide');
    });

    $("#co_cerrar").on("click", function (){ window.close(); });

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
//EXCEL
    $("#co_excel").on("click", function (e) {

        fn_filtro();
        e.preventDefault();
        var col_model=$( "#div_grid_principal" ).pqGrid( "option", "colModel" );
        var cabecera = "";
        for (i = 0; i < col_model.length; i++){
            if(col_model[i].hidden != true) cabecera += "<th>"+col_model[i].title+ "</th>";
        }
        $("#excel_cabecera").val(cabecera);
        var element =$grid_principal.pqGrid("option","dataModel.data");
        if (element)
            a= element.length;
        else
            a = 0;
        if(a > 0){
            $("#tituloexcel").val(g_tit);
            $("#sql").val(sql_grid_prim);
            $("#frm_Exel").submit();
            return;
        }
    });

});



//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
function fn_setea_grid_principal() {

    var data =  [
        { C1: 'CONSULTA', C2: 'CALIDAD PRODUCTO TECNICO', C3: 'TURBIEDAD EN EL AGUA', C4: 'COPIA CEDULA' },
        { C1: 'CONSULTA', C2: 'CALIDAD PRODUCTO TECNICO', C3: 'TURBIEDAD EN EL AGUA', C4: 'NOTIFICACION' },
        { C1: 'CONSULTA', C2: 'CONVENIOS DE PAGO', C3: 'SOLICITUD DE CONVENIOS DE PAGO', C4: 'COPIA CEDULA' },
        { C1: 'CONSULTA', C2: 'FACTURACION', C3: 'ALTO CONSUMO', C4: 'CONTRATO' },
        { C1: 'CONSULTA', C2: 'FACTURACION', C3: 'ALTO CONSUMO', C4: 'COPIA CEDULA' },
        { C1: 'CONSULTA', C2: 'MEDICION', C3: 'CAMBIO DE MEDIDOR', C4: 'NOTIFICACION' },
        { C1: 'RECLAMO', C2: 'CONVENIOS DE PAGO', C3: 'SOLICITUD DE CONVENIOS DE PAGO', C4: 'CONTRATO' },
        { C1: 'RECLAMO', C2: 'CONVENIOS DE PAGO', C3: 'SOLICITUD DE CONVENIOS DE PAGO', C4: 'COPIA CEDULA' },
        { C1: 'RECLAMO', C2: 'FACTURACION', C3: 'ALTO CONSUMO', C4: 'CARTA' },
        { C1: 'RECLAMO', C2: 'FACTURACION', C3: 'ALTO CONSUMO', C4: 'CONTRATO' },
    ];

    var obj = {
        height: "100%",
        showTop: true,
        showBottom:true,
        showTitle : false,
        title: "",
        roundCorners: true,
        rowBorders: true,
        columnBorders: true,
        collapsible:true,
        editable:false,
        selectionModel: { type: 'row',mode:'single'},
        numberCell: { show: true },
        pageModel: { rPP: 100, type: "local", rPPOptions: [100, 200, 500]},
        scrollModel:{theme:true},
        toolbar: {
            cls: "pq-toolbar-export",
            items:[
                { type: "button", label: "Nuevo",    attr: "id=co_nuevo",  cls: "btn btn-primary btn-sm" },
                { type: "button", label: "Excel", attr:"id=co_excel", cls:"btn btn-primary btn-sm"},
                { type: "button", label: "Cerrar",   attr: "id=co_cerrar", cls: "btn btn-secondary btn-sm"},
            ]
        },
    };

    obj.colModel = [
        { title: "Tipo de Atención", width: 250, dataType: "string", dataIndx: "C3", halign: "center", align: "left" },
        { title: "Motivo Cliente", width: 250, dataType: "strig", dataIndx: "C1", halign: "center", align: "left", },
        { title: "Motivo Empresa", width: 250, dataType: "string", dataIndx: "C2", halign: "center", align: "left" },
        { title: "Documento", width: 250, dataType: "string", dataIndx: "C4", halign: "center", align: "left" },
        { title: "",  width: 108, dataType: "string", align: "center", editable: false, sortable: false,
            render: function (ui) {
                return "<button name='co_borrar' class='btn btn-primary btn-sm'><img src='/galeria/trash-solid.png'/>&nbsp;Eliminar</button>";
            },
        },
    ];
    obj.dataModel = { data: data };

    $grid_principal = $("#div_grid_principal").pqGrid(obj);

}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~

function fn_nuevo(){

    $("#div_new_bts").modal({backdrop: "static",keyboard:false});
    $("#div_new_bts").on("shown.bs.modal", function () {
        $("#div_new_bts div.modal-footer button").focus();

    });
}

/////////////////////////////////FUNCIONES COMBOS///////////////////////////////////////////

function fn_tipo_atencion(){

    $("#cb_tipo_atencion").html("<option value='' selected></option><option value='1'>CONSULTA</option> <option value='2' >RECLAMO</option>  <option value='3' >OPCION 03</option>");
}

function fn_mot_cliente(){

    $("#cb_mot_cliente").html("<option value='' selected></option><option value='1'>CALIDAD PRODUCTO TECNICO</option> <option value='2' >CONVENIOS DE PAGO</option> <option value='3' >FACTURACION</option> <option value='4' >MEDICION</option>");
}

function fn_mot_empresa(){

    $("#cb_mot_empresa").html("<option value='' selected></option><option value='1'>TURBIEDAD DEL AGUA</option> <option value='2' >SOLICITUD DE CONVENIOS DE PAGO</option>  <option value='3' >ALTO CONSUMO</option> <option value='4' >CAMBIO DE MEDIDOR</option>");
}

function fn_documento(){

    $("#cb_documento").html("<option value='' selected></option><option value='1'>COPIA CEDULA</option> <option value='2' >NOTIFICACION</option>  <option value='3' >CONTRATO 03</option> <option value='4' >CARTA</option>");
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~

function fn_carga_grilla() {

    var total_register;

    $grid_principal.pqGrid( "option", "dataModel", dataModel );
    $grid_principal.pqGrid( "refreshDataAndView" );
    $grid_principal.pqGrid( "option", "title", "Total Registros: " + total_register);

}

// Limpiar Filtro
function fn_limpiar(){

    $("#cb_tipo_atencion").val("");
    $("#cb_mot_cliente").val("");
    $("#cb_mot_empresa").val("");
    $("#cb_documento").val("");
}

function fn_mensaje(id,mensaje,segundos)
{
    $(id).show();
    $(id).html(mensaje);
    setTimeout(function(){$(id).html("");$(id).hide(); }, segundos);
}

