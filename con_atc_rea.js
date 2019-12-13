var g_modulo = "Atención Integral de Clientes";
var g_tit = "Atención Integral de Clientes";
var $grid_principal;
var $grid_2;
var sql_grid_prim = "";
var sql_grid_2 = "";
var sql_grid_3 = "";
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
    fn_regional();
    fn_canalcomu();
    fn_tipoaten();
    fn_mot_cliente();
    fn_mot_empresa();
    fn_fecha();
    fn_rango();
    fn_hasta();
    fn_desde();
    fn_estado();
    fn_plazos();
    fn_limpiar();

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

    // INICIA CON EL CURSOR EN EL CAMPO FECHA

    $("._input_selector").inputmask("dd/mm/yyyy");

    //DEFINE LA GRILLA PRINCIPAL
    fn_setea_grid_principal();

    //DIBUJA LOS ICONOS DE LOS BOTONES

    $("#co_filtro").html("<span class='glyphicon glyphicon-search'></span> Filtro");
    $("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
    $("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
//BOTONES-EVENTOS

    $("#co_filtro").on("click", fn_filtro);

    $("#co_cerrar_t").on("click", function(e){
        window.close();
    });

    $("#co_consultar").on("click", function() {

        if ($.trim($("#co_consultar").text()) == "Consultar") {
            if ($("#cb_regional").val() == "") {

                fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UNA REGIONAL!!!</strong></div>',3000);
                $("#cb_regional").focus();
                return;
            }
            if ($("#cb_tipoaten").val() == "") {

                fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UN TIPO DE ATENCIÓN!!!</strong></div>',3000);
                $("#cb_tipoaten").focus();
                return;
            }
            if ($("#cb_canalcomu").val() == "") {

                fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UN CANAL DE COMUNICACIÓN!!!</strong></div>',3000);
                $("#cb_canalcomu").focus();
                return;
            }
            if ($("#cb_mot_cliente").val() == ""){

                fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UN MOTIVO DEL CLIENTE!!!</strong></div>',3000);
                $("#cb_mot_cliente").focus();
                return;
            }
            if ($("#cb_mot_empresa").val() == ""){

                fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UN MOTIVO DE LA EMPRESA!!!</strong></div>',3000);
                $("#cb_mot_empresa").focus();
                return;
            }
            if ($("#cb_fecha").val() == ""){
                fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UNA FECHA!!!</strong></div>',3000);
                $("#cb_fecha").focus();
                return;
            }
            if ($("#cb_rango").val() == ""){
                fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UN RANGO DE FECHAS!!!</strong></div>',3000);
                $("#cb_rango").focus();
                return;
            }
            if ($("#cb_desde").val() == ""){
                fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UN VALOR DE INICIO!!!</strong></div>',3000);
                $("#cb_desde").focus();
                return;
            }
            if ($("#cb_hasta").val() == ""){
                fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UN VALOR DE FIN!!!</strong></div>',3000);
                $("#cb_hasta").focus();
                return;
            }
            if ($("#cb_estado").val() == "") {

                fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UN ESTADO!!!</strong></div>',3000);
                $("#cb_estado").focus();
                return;
            }
            if ($("#cb_plazos").val() == "") {

                fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UN PLAZO!!!</strong></div>',3000);
                $("#cb_plazos").focus();
                return;
            }

            fn_mensaje_boostrap("Se genero", g_tit, $("#co_consultar"));
            fn_carga_grilla();
            $("#div_prin").slideDown();
            $("#div_filtro_bts").slideUp();
            $('#div_filtro_bts').modal('hide');
            $(window).scrollTop(0);

        }
    })
    $("#co_limpiar").on("click", function () {
        if ($.trim($("#co_limpiar").text()) == "Limpiar") {
            fn_limpiar();
            return;
        }
        else
            window.close();
    });


    $("#co_cancel").on("click", function (e){
        $('#div_filtro_bts').modal('hide');
    });

    $("#co_cerrar").on("click", function (e){
        window.close();
    });

//BOTONES ELIMINAR DE LAS GRILLAS


    $("#co_filtro").on("click", function(e){
        fn_filtro();
    });

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

    var obj = {
        height: "100%",
        showTop: true,
        showBottom: true,
        showHeader: true,
        roundCorners: true,
        rowBorders: true,
        columnBorders: true,
        editable: false,
        editor: { type: "textbox", select: true, style: "outline:none;" },
        selectionModel: { type: 'cell' },
        numberCell: { show: true},
        title: "",
        showTitle: false,
        pageModel: { type: "local" },
        scrollModel: { theme: true },
        toolbar:
            {
                cls: "pq-toolbar-export",
                items:[
                    { type: "button", label: "Filtro",    attr: "id=co_filtro",  cls: "btn btn-primary" },
                    { type: "button", label: "Excel", attr:"id=co_excel", cls:"btn btn-primary btn-sm"},
                    { type: "button", label: "Cerrar",   attr: "id=co_cerrar", cls: "btn btn-secondary btn-sm"}
                ]
            },
        dataModel:{ data: [
                { C1: 'Normal', C2: '00/00/0000', C3: '31/12/2019', C4: '31/12/2019', C5: '(8000) PANAMÁ METRO', C6: 'TEXTO', C7: 'CIERRE', C8: '17/12/2019', C9: 15, C10: "Texto de Ejemplo", C11: "Texto de Ejemplo", C12: "Soporte", C13: "Prioritaria", C14: "INTERNA"},
                { C1: 'Prioritaria', C2: '12/02/2015',C3: '31/12/2049', C4: '31/12/2019', C5: '(6000) PANAMÁ SUR', C6:'TEXTO', C7: "CIERRE", C8: '17/12/2019', C9: 20, C10: "Texto de Ejemplo", C11: "Texto de Ejemplo", C12: "Soporte", C13: "Prioritaria", C14: "INTERNA"},
                { C1: 'Alta', C2: '15/05/2019', C3: '31/12/2019', C4: '31/12/2019', C5: '(7000) PANAMÁ NORTE', C6: 'TEXTO', C7: "CIERRE", C8: '17/12/2019', C9: 30, C10: "Texto de Ejemplo", C11: "Texto de Ejemplo", C12: "Soporte", C13: "Prioritaria", C14: "INTERNA" }

            ] }
    };

    obj.colModel = [
        { title: "Atención", width:65, dataType: "number", dataIndx: "C1", halign: "center", align: "center" },
        { title: "Inicio", width: 80, dataType: "string", dataIndx: "C2", halign: "center", align: "center"},
        { title: "Vencimiento Empresa",width: 85, dataType: "string", dataIndx: "C3", halign: "center", align: "center" },
        { title: "Vencimiento ASEP", width: 85, dataType: "number", dataIndx: "C4", halign: "center", align: "center"},
        { title: "Regional",width: 200, dataType: "string", dataIndx: "C5", halign: "center", align: "center" },
        { title: "Rol Resp.", width: 100, dataType: "string", dataIndx: "C6", halign: "center", align: "center"},
        { title: "Rol Cierre",width: 100, dataType: "string", dataIndx: "C7", halign: "center", align: "center" },
        { title: "Cierre", width: 80, dataType: "string", dataIndx: "C8", halign: "center", align: "center"},
        { title: "Nro. Suministro", width: 75, dataType: "string", dataIndx: "C9", halign: "center", align: "center"},
        { title: "Motivo Cliente", width: 200, dataType: "string", dataIndx: "C10", halign: "center", align: "left"},
        { title: "Motivo Empresa", width: 200, dataType: "string", dataIndx: "C11", halign: "center", align: "left"},
        { title: "Area", width: 120, dataType: "string", dataIndx: "C12", halign: "center", align: "center"},
        { title: "Tipo de Atención", width: 90, dataType: "string", dataIndx: "C13", halign: "center", align: "center"},
        { title: "Canal de Comunicación", width: 100, dataType: "string", dataIndx: "C14", halign: "center", align: "center"}
    ];

    $grid_principal = $("#div_grid_principal").pqGrid(obj);
    $grid_principal.pqGrid("refreshDataAndView");
}
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
function fn_filtro(){

    $("#div_filtro_bts").modal({backdrop: "static",keyboard:false});
    $("#div_filtro_bts").on("shown.bs.modal", function () {
        $("#div_filtro_bts div.modal-footer button").focus();


    });
}



/////////////////////////////////FUNCIONES COMBOS///////////////////////////////////////////
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
function fn_regional(){

    $("#cb_regional").html("<option value='' selected></option><option value='1'>(6000) PANAMÁ SUR</option> <option value='2' >(7000) PANAMÁ NORTE</option>  <option value='3' >(8000) PANAMÁ METRO</option>");
}
function fn_tipoaten() {

    $("#cb_tipoaten").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option>  <option value='3' >OPCION 03</option>");
}
function fn_canalcomu() {

    $("#cb_canalcomu").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option>  <option value='3' >OPCION 03</option>");
}
function fn_mot_cliente(){

    $("#cb_mot_cliente").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 03</option>  <option value='3' >OPCION 03</option>");
}
function fn_mot_empresa(){

    $("#cb_mot_empresa").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option>  <option value='3' >OPCION 03</option>");
}
function fn_fecha() {

    $("#cb_fecha").html("<option value='' selected></option><option value='1'>Todas</option> <option value='2' >OPCION 02</option>  <option value='3' >OPCION 03</option>");
}
function fn_rango() {

    $("#cb_rango").html("<option value='' selected></option><option value='1'>Todas</option> <option value='2' >OPCION 02</option>  <option value='3' >OPCION 03</option>");
}
function fn_desde() {

    $("#cb_desde").html("<option value='' selected></option><option value='1'>Todas</option> <option value='2' >OPCION 02</option>  <option value='3' >OPCION 03</option>");
}
function fn_hasta() {

    $("#cb_hasta").html("<option value='' selected></option><option value='1'>Todas</option> <option value='2' >OPCION 02</option>  <option value='3' >OPCION 03</option>");
}
function fn_estado() {

    $("#cb_estado").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option>  <option value='3' >OPCION 03</option>");
}

function fn_plazos() {

    $("#cb_plazos").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option>  <option value='3' >OPCION 03</option>");
}


function fn_carga_grilla() {


}


function fn_gen() {
    alert('Se genero.');
}

function fn_limpiar(){
    $("#cb_regional").val("");
    $("#chk_retenidas").prop("checked", false)
    $("#cb_tipoaten").val("");
    $("#cb_canalcomu").val("");
    $("#cb_mot_cliente").val("");
    $("#cb_mot_empresa").val("");
    $("#cb_fecha").val("");
    $("#cb_rango").val("");
    $("#cb_desde").val("");
    $("#cb_hasta").val("");
    $("#cb_estado").val("");
    $("#cb_plazos").val("");
}
function fn_mensaje(id,mensaje,segundos)
{
    $(id).show();
    $(id).html(mensaje);
    setTimeout(function(){$(id).html("");$(id).hide(); }, segundos);
}

