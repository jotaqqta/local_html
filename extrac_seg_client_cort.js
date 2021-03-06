var g_modulo = "Corte y Reposición";
var g_tit = "Extractor de Seguimiento Clientes a Corte";
var $grid_principal;
var $grid_secundaria;
var grid_principal;
var grid_secundaria;
var update = false;

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

$(document).keydown(function (e) {

    if (e.keyCode === 8) {
        var element = e.target.nodeName.toLowerCase();
        if ((element !== 'input' && element !== 'textarea') || $(e.target).attr("readonly")) {
            return false;
        }
    }
});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

$(document).ready(function () {

    // PARA ELIMINAR EL SUBMIT
    $("button").on("click", function () { return false; });
    //INGRESA LOS TITULOS
    document.title = g_tit;
    document.body.scroll = "yes";
    // Raiz
    $("#div_header").load("syn_globales/header.htm", function () {
        $("#div_mod0").html(g_modulo);
        $("#div_tit0").html(g_tit);
    });

    $(".number").inputmask("integer");
    $(".number_float").inputmask("decimal",{
        radixPoint:".",
        groupSeparator: ",",
        digits: 2,
        autoUnmask: true,
        autoGroup: true
    });

    fn_set_grid();
    fn_radio_change();

    // Footer  // Raiz
    $("#div_footer").load("syn_globales/footer.htm");
    $("#excel_archivo").val("tablas_generales.xls");
    $("#tx_empresa").val("1");
    $("#tx_rol").val("SYNERGIA");
    $("#tx_ip").val("127.0.0.1");

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                              <-- Buttons - Listeners -->

    $("#co_actualizar").on("click", function () {

        if ($.trim($("#co_actualizar").text() === "Actualizar")) {

            if ($("#tx_dias_ant").val() === "") {
                fn_mensaje_boostrap("Error, por favor indique los días anteriores.", g_tit, $("#tx_dias_ant"));
                return;
            }

            if (parseInt($("#tx_dias_ant").val()) < 4) {
                fn_mensaje_boostrap("Error, el numero de días debe ser mayor o igual a 4.", g_tit, $("#tx_dias_ant"));
                return;
            }

            var data = $grid_secundaria.pqGrid("option","dataModel.data");

            if (data.length < 1) {
                fn_mensaje_boostrap("Error, por favor seleccione una Situación Encontrada (Debe seleccionar almenos 1).", g_tit, $(""));
                return;
            }

            if ($('input[type=radio][name=opt_sector][value=opt_2]').is(":checked")) {

                if ($("#tx_sector_inicial").val() === "") {
                    fn_mensaje_boostrap("Error, por favor indique el sector Inicial.", g_tit, $("#tx_sector_inicial"));
                    return;
                }

                if ($("#tx_sector_final").val() === "") {
                    fn_mensaje_boostrap("Error, por favor indique el sector Final.", g_tit, $("#tx_sector_final"));
                    return;
                }

                if (parseInt($("#tx_sector_inicial").val()) > parseInt($("#tx_sector_final").val())) {
                    fn_mensaje_boostrap("Error, el Sector Inicial debe ser menor o igual que el Sector Final.", g_tit, $("#tx_sector_inicial"));
                    return;
                }
            }

            if ($("#tx_deuda_inicial").val() === "") {
                fn_mensaje_boostrap("Error, por favor indique la Deuda Inicial.", g_tit, $("#tx_deuda_inicial"));
                return;
            }

            if ($("#tx_deuda_final").val() === "") {
                fn_mensaje_boostrap("Error, por favor indique la Deuda Final.", g_tit, $("#tx_deuda_final"));
                return;
            }

            if (parseFloat($("#tx_deuda_inicial").val()) > parseFloat($("#tx_deuda_final").val())) {
                fn_mensaje_boostrap("Error, la Deuda Inicial debe ser menor o igual que Deuda Final.", g_tit, $("#tx_sector_inicial"));
                return;
            }

            if ($("#tx_mail_para").val() === "") {
                fn_mensaje_boostrap("Error, el Correo no cuenta con destinatario.", g_tit, $("#co_env_aviso"));
                return;
            }

            if ($("#tx_mail_asunto").val() === "") {
                fn_mensaje_boostrap("Error, el Correo no cuenta con asunto.", g_tit, $("#co_env_aviso"));
                return;
            }

            if ($("#tx_mail_cuerpo").val() === "") {
                fn_mensaje_boostrap("Error, el Correo no cuenta con cuerpo.", g_tit, $("#co_env_aviso"));
                return;
            }

            if ($("#tx_mail_cuerpo").val().length <= 30) {
                fn_mensaje_boostrap("Error, el cuerpo del Correo es demasiado corto.", g_tit, $("#co_env_aviso"));
                return;
            }

            fn_mensaje_boostrap("Se actualizo.", g_tit, $("#co_ingresar"));
        }

    });

    $("#co_eliminar").on("click", function () {

        if ($.trim($("#co_eliminar").text() === "Eliminar")) {

            fn_mensaje_boostrap("Evento funcionando.", g_tit, $("#co_ingresar"));
        }

    });

    $("#co_nuevo").on("click", function () {

        if ($.trim($("#co_nuevo").text() === "Nuevo")) {

            fn_limpiar();
        }
    });

    $("#co_guardar").on("click", function () {
        if ($.trim($("#co_guardar").text() === "Guardar")) {

            if ($("#tx_mail_para").val() === "") {
                fn_mensaje('#mensaje_env_aviso','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>Error, por favor indica un destinatario.</strong></div>',3000);
                $("#tx_mail_para").focus();
                return;
            }

            if ($("#tx_mail_asunto").val() === "") {
                fn_mensaje('#mensaje_env_aviso','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>Error, por favor indica un asunto.</strong></div>',3000);
                $("#tx_mail_asunto").focus();
                return;
            }

            if ($("#tx_mail_cuerpo").val() === "") {
                fn_mensaje('#mensaje_env_aviso','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>Error, por favor ingrese el cuerpo del correo.</strong></div>',3000);
                $("#tx_mail_cuerpo").focus();
                return;
            }

            if ($("#tx_mail_cuerpo").val().length <= 30) {
                fn_mensaje('#mensaje_env_aviso','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>Error, el cuerpo del correo es demasiado corto.</strong></div>',3000);
                $("#tx_mail_cuerpo").focus();
                return;
            }

            fn_mensaje_boostrap("Mensaje creado.", g_tit, $("#co_guardar"));
            $("#div_env_aviso_bts").modal('hide');
        }
    });

    $("#co_env_aviso").on("click", function () {
        $("#div_env_aviso_bts").modal({backdrop: "static",keyboard:false});
        $("#div_env_aviso_bts").on("shown.bs.modal", function () {
            $("#div_env_aviso_bts div.modal-footer button").focus();

        });
    });

    $('input[type=radio][name=opt_sector]').change(function() {

        fn_radio_change(this.value);
    });

    $("#tx_sector_inicial").blur(function () {
        if ($("#tx_sector_inicial").val() < 0) {
            $("#tx_sector_inicial").val("0")
        }
    });

    $("#tx_sector_final").blur(function () {
        if ($("#tx_sector_final").val() < 0) {
            $("#tx_sector_final").val("0")
        }
    });

    $("#co_flch_right").on("click", function () {

        // Lineas comentadas: funcionalidad para ocultar y desocultar filas de la grilla izquierda al moverlas.

        update = true;

        $grid_principal.pqGrid("refreshView");
        $grid_secundaria.pqGrid("refreshView");

        update = false;

        var checked_prin = [];  // Rows checked tabla derecha
        var row_id_second = [];  // ID de las Rows de la tabla izquierda

        var data_grid_second = grid_secundaria.getData();

        var Checked = grid_principal.Checkbox('checkBox').getCheckedNodes();
        /*var ids = grid_principal.SelectRow().getSelection().map(function(rowList){ // Obtiene las rows para ocultarlas.
            return rowList.rowIndx
        });*/

        for (var i = 0; i < Checked.length; i++) {

            checked_prin.push(parseInt(Checked[i].C1));
        }

        if (data_grid_second.length > 0) {

            for (var j = 0; j < data_grid_second.length; j++) {

                row_id_second.push(parseInt(data_grid_second[j].C1))
            }

            for (var y = 0; y < checked_prin.length; y++) {

                if (!row_id_second.includes(checked_prin[y])) {
                    $grid_secundaria.pqGrid( "addRow", { rowData: { C1: Checked[y].C1, C2: Checked[y].C2 }, checkEditable: false } );

                    //grid_principal.addClass( {rowIndx: ids[y], cls: 'pq-hide'} ); //<-- Clase para ocultarlas -->
                }
            }

        } else {
            for (var x = 0; x < checked_prin.length; x++) {
                $grid_secundaria.pqGrid( "addRow", { rowData: { C1: Checked[x].C1, C2: Checked[x].C2 }, checkEditable: false } );

                //grid_principal.addClass( {rowIndx: ids[x], cls: 'pq-hide'} ); //<-- Clase para ocultarlas -->
            }
        }

        /*var rowToHide = grid_principal.getRowsByClass( { cls : 'pq-hide' } ); // Variable que obtiene las rows con esa clase

        for (var k = 0; k < rowToHide.length; k++) { // Función que oculta las rows con la clase pq-hide
            rowToHide[k].rowData.pq_hidden = true;
        }*/

        grid_principal.Checkbox('checkBox').unCheckAll();

        $grid_principal.pqGrid("refreshView");

    });

    $("#co_flch_left").on("click", function () {

        // Lineas comentadas: funcionalidad para ocultar y desocultar filas de la grilla izquierda al moverlas.

        var checked_second = [];
        //var rowsToUnHide = [];

        var Checked = grid_secundaria.Checkbox('checkBox').getCheckedNodes();
        //var rowsWithHide = grid_principal.getRowsByClass( { cls : 'pq-hide' } ); // Obtiene las rows para desocultar
        var ids = grid_secundaria.SelectRow().getSelection().map(function(rowList){
            return rowList.rowIndx
        });

        for (var i = 0; i < Checked.length; i++) {

            checked_second.push(parseInt((Checked[i].C1)));
        }

        /*for (var x = 0; x < rowsWithHide.length; x++) { // Función para obtener el ID de las rows a desocultar

            rowsToUnHide.push(parseInt(rowsWithHide[x].rowData.C1))
        }*/

        if (checked_second.length === 1) {
            grid_secundaria.addClass( {rowIndx: ids[0], cls: 'pq-delete'} ); // En caso de usar la manera para ocultar moverlo a donde se encuentra el comentario <- AQUI ->
            /*for (var y = 0; y < rowsToUnHide.length; y++) { // Función que compara las rows ocultas con las seleccionadas para mover a la izquierda (Unicamente una seleccionada)
                if (rowsToUnHide[y] === checked_second[0]) { // Compara el ID de la row oculta con el ID de la row seleccionada (Es 0 por que es unicamente 1).
                    if (parseInt(rowsWithHide[y].rowData.C1) === checked_second[0]) {
                        //rowsWithHide[y].rowData.pq_hidden = false; // Desoculta
                        //grid_principal.removeClass( {rowIndx: rowsWithHide[y].rowIndx, cls: 'pq-hide'} ); // Remueve la clase pq-hide
                        // <- AQUI ->
                    }
                }
            }*/
        } else {
            for (var m = 0; m <= checked_second.length; m++) {
                grid_secundaria.addClass( {rowIndx: ids[m], cls: 'pq-delete'} ); // En caso de usar la manera para ocultar moverlo a donde se encuentra el comentario <- AQUI 2 ->
                /*for (var z = 0; z < rowsToUnHide.length; z++) { // Función que compara las rows ocultas con las seleccionadas para mover a la izquierda (Varias seleccionadas)
                    if (rowsToUnHide[z] === checked_second[m]) { // Compara el ID de la row oculta con el ID de la row seleccionada.
                        if (parseInt(rowsWithHide[z].rowData.C1) === checked_second[m]) {
                            //rowsWithHide[z].rowData.pq_hidden = false; // Desoculta la row
                            //grid_principal.removeClass( {rowIndx: rowsWithHide[z].rowIndx, cls: 'pq-hide'} ); // Remueve la clase pq-hide
                            // <- AQUI 2 ->
                        }
                    }
                }*/
            }
        }

        var rows = [];

        var rowsToDelete = grid_secundaria.getRowsByClass( {cls: "pq-delete"} );

        if (rowsToDelete.length <= 1) {
            $grid_secundaria.pqGrid("deleteRow", { rowIndx: rowsToDelete[0].rowIndx });
        } else {
            for (var d = 0; d < rowsToDelete.length; d++) {
                rows.push({ rowIndx: rowsToDelete[d].rowIndx})
            }

            $grid_secundaria.pqGrid("deleteRow", { rowList: rows });
        }


        grid_secundaria.Checkbox('checkBox').unCheckAll();

        $grid_principal.pqGrid("refreshView");
        $grid_secundaria.pqGrid("refreshView");

    });

    $("#co_cancel").on("click", function () {
        $("#div_env_aviso_bts").modal('hide');
    });

    $("#co_cerrar").on("click", function (){ window.close(); });

    $grid_principal.pqGrid( {
        refresh: function () {
            if (update) {
                grid_principal = this;
            }
        }
    });

    $grid_secundaria.pqGrid( {
        refresh: function () {
            if (update) {
                grid_secundaria = this;
            }
        }
    });

});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                                  <-- Grids -->

function fn_set_grid() {

    // GRID PRINCIPAL

    var data =  [
        { C1: '1', C2: 'CON ARANDELA CIEGA' },
        { C1: '2', C2: 'CASA DEMOLIDA CON SUMINISTRO' },
        { C1: '3', C2: 'CXO HABITADA' },
        { C1: '4', C2: 'CON BYPASS' },
        { C1: '5', C2: 'NO LOCALISE LA CONEXIÓN' },
        { C1: '6', C2: 'CXO DESHABITADA' },
        { C1: '7', C2: 'CON CONEXIÓN CLANDESTINA' },
    ];

    var obj = {
        height: 219,
        showtop: true,
        showBottom: false,
        showTitle: false,
        roundCorners: true,
        rowBorders: true,
        columnBorders: true,
        collapsible: true,
        scrollModel: {theme: true},
        numberCell: {show: false},
        selectionModel: {type: 'row', mode: 'block'},
        pageModel: {rPP: 500, type: "local", rPPOptions: [500, 1000, 2000]},
        toolbar: false,
    };

    obj.colModel = [
        { dataIndx: "checkBox", maxWidth: 30, minWidth: 30, align: "center", resizable: false, title: "", dataType: 'bool', editable: true,
            type: 'checkBoxSelection', cls: 'ui-state-default', sortable: false, editor: false,
            cb: {
                all: true,
                select: true,
                header: false,
            }
        },
        { title: "id", width: 30, dataType: "string", dataIndx: "C1", halign: "center", align: "center", editable: false, hidden: true },
        { title: "Descripción", width: 359, dataType: "strig", dataIndx: "C2", halign: "center", align: "left", editable: false },
    ];

    obj.dataModel = { data: data };

    $grid_principal = $("#div_grid_principal").pqGrid(obj);

    // GRID SECUNDARIA

    var obj2 = {
        height: 219,
        showtop: true,
        showBottom: false,
        showTitle: false,
        roundCorners: true,
        rowBorders: true,
        columnBorders: true,
        collapsible: true,
        scrollModel: {theme: true},
        numberCell: {show: false},
        selectionModel: {type: 'row', mode: 'block'},
        pageModel: {rPP: 500, type: "local", rPPOptions: [500, 1000, 2000]},
        toolbar: false,
    };

    obj2.colModel = [
        { dataIndx: "checkBox", maxWidth: 30, minWidth: 30, align: "center", resizable: false, title: "", dataType: 'bool', editable: true,
            type: 'checkBoxSelection', cls: 'ui-state-default', sortable: false, editor: false,
            cb: {
                all: true,
                select: true,
                header: false,
            }
        },
        { title: "id", width: 30, dataType: "string", dataIndx: "C1", halign: "center", align: "center", editable: false, hidden: true },
        { title: "Descripción", width: 359, dataType: "strig", dataIndx: "C2", halign: "center", align: "left", editable: false },
    ];

    $grid_secundaria = $("#div_grid_secundaria").pqGrid(obj2);
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                                  <-- Combos -->

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                                  <-- Functions -->

function fn_radio_change(value) {

    $("#tx_sector_inicial").val("");
    $("#tx_sector_final").val("");

    $("#div_radio_sector").hide();

    if (value === "opt_2") {
        $("#div_radio_sector").show();
    }
}

function fn_limpiar(type) {

    if (type === 1) {
        $("#tx_mail_para").val("");
        $("#tx_mail_asunto").val("");
        $("#tx_mail_cuerpo").val("");
    }

    if (type === undefined) {

        $("#tx_num_secuen").val("");
        $("#tx_dias_ant").val("");
        $("#tx_sector_inicial").val("");
        $("#tx_sector_final").val("");
        $("#tx_deuda_inicial").val("");
        $("#tx_deuda_final").val("");
        $('input[type=radio][name=opt_sector][value=opt_1]').prop('checked', true);
        $("#div_radio_sector").hide();

        $("#tx_mail_para").val("");
        $("#tx_mail_asunto").val("");
        $("#tx_mail_cuerpo").val("");
    }

}

function fn_mensaje(id,mensaje,segundos) {

    $(id).show();
    $(id).html(mensaje);
    setTimeout(function(){$(id).html("");$(id).hide(); }, segundos);
}


