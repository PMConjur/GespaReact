$(document).ready(function () {
  let intervalo;

  // Función para manejar la cuenta regresiva y cambiar contenido
  function iniciarCuentaRegresiva() {
    let contador = 10;
    $("#contador").text(contador);

    // Mostrar el modal
    $("#modalCuentaRegresiva").modal("show");

    // Configuración del contador
    intervalo = setInterval(() => {
      contador--;
      $("#contador").text(contador);

      // Cuando el contador llega a 0
      if (contador === 0) {
        clearInterval(intervalo);
        cambiarContenidoContenedor();
        $("#modalCuentaRegresiva").modal("hide");
      }
    }, 1000);
  }

  // Contenedor Principal
  function cambiarContenidoContenedor() {
    $("#contenedor-principal").html(`
        <h5 class="card-title">Flujo</h5>
        <p class="text-white">¿Contestaron?</p>
        <form id="principal">
          <div class="col-sm-10">
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="principalRadios"
                id="radio-principal-01"
                value="si-contestaron"
              />
              <label
                class="form-check-label text-white"
                for="radio-principal-01"
                >(1) Sí contestaron</label
              >
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="principalRadios"
                id="radio-principal-02"
                value="no-contestaron"
              />
              <label
                class="form-check-label text-white"
                for="radio-principal-02"
                >(2) No contestaron</label
              >
            </div>
          </div>
        </form>
        <div
          class="card-footer"
          style="position: absolute; top: 10px; right: 10px;"
        >
          <small
            class="text-white"
            style="
              background-color: #1c1c1c;
              padding: 5px 10px;
              border-radius: 5px;
            "
          >
            [Teclea el número y presiona Enter]
          </small>
        </div>
      `);
  }
  // Contenedor si-contestaron
  function cambiarSiContestaron() {
    $("#contenedor-principal").html(`
        <h5 class="card-title">Flujo</h5>
        <p class="text-white">¿Contestaron? Sí.</p>
        <p class="text-white">¿Quién contestó?</p>
        <form id="si-contestaron">
          <div class="col-sm-10">
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="siContestaronRadios"
                id="radio-si-contestaron-01"
                value="titular"
              />
              <label
                class="form-check-label text-white"
                for="radio-si-contestaron-01"
                >(1) Titular</label
              >
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="siContestaronRadios"
                id="radio-si-contestaron-02"
                value="le-conoce"
              />
              <label
                class="form-check-label text-white"
                for="radio-si-contestaron-02"
                >(2) Le conoce</label
              >
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="siContestaronRadios"
                id="radio-si-contestaron-03"
                value="le-desconoce"
              />
              <label
                class="form-check-label text-white"
                for="radio-si-contestaron-03"
                >(3) Le desconoce</label
              >
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="siContestaronRadios"
                id="radio-si-contestaron-04"
                value="cuelgan"
              />
              <label
                class="form-check-label text-white"
                for="radio-si-contestaron-04"
                >(4) Cuelgan</label
              >
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="siContestaronRadios"
                id="radio-si-contestaron-05"
                value="menor-de-edad"
              />
              <label
                class="form-check-label text-white"
                for="radio-si-contestaron-05"
                >(5) Menor de edad</label
              >
            </div>
          </div>
        </form>
        <div
          class="card-footer"
          style="position: absolute; top: 10px; right: 10px;"
        >
          <small
            class="text-white"
            style="
              background-color: #1c1c1c;
              padding: 5px 10px;
              border-radius: 5px;
            "
          >
            [Teclea el número y presiona Enter]
          </small>
        </div>
      `);
  }
  // Contenedor Titular
  function cambiarTitular() {
    $("#contenedor-principal").html(`
        <h5 class="card-title">Flujo</h5>
        <p class="text-white">¿Quién contestó? Titular.</p>
        <p class="text-white">¿Causa de no pago?</p>
        <form id="titular">
          <div class="col-sm-10">
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="siContestaronRadios"
                id="radio-titular-01"
                value="sin-definir"
              />
              <label
                class="form-check-label text-white"
                for="radio-titular-01"
                >(1) Sin definir</label
              >
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="siContestaronRadios"
                id="radio-titular-02"
                value="desempleo"
              />
              <label
                class="form-check-label text-white"
                for="radio-titular-02"
                >(2) Desempleo</label
              >
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="siContestaronRadios"
                id="radio-titular-03"
                value="enfermedad"
              />
              <label
                class="form-check-label text-white"
                for="radio-titular-03"
                >(3) Enfermedad</label
              >
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="siContestaronRadios"
                id="radio-titular-04"
                value="sobreendeudamiento"
              />
              <label
                class="form-check-label text-white"
                for="radio-titular-04"
                >(4) Sobreendeudamiento</label
              >
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="siContestaronRadios"
                id="radio-titular-05"
                value="quiebra"
              />
              <label
                class="form-check-label text-white"
                for="radio-titular-05"
                >(5) Quiebra</label
              >
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="siContestaronRadios"
                id="radio-titular-06"
                value="desastre-natural"
              />
              <label
                class="form-check-label text-white"
                for="radio-titular-06"
                >(6) Desastre natural</label
              >
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="siContestaronRadios"
                id="radio-titular-07"
                value="delincuencia"
              />
              <label
                class="form-check-label text-white"
                for="radio-titular-07"
                >(7) Delincuencia</label
              >
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="siContestaronRadios"
                id="radio-titular-08"
                value="pensionado"
              />
              <label
                class="form-check-label text-white"
                for="radio-titular-08"
                >(8) Pensionado</label
              >
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="siContestaronRadios"
                id="radio-titular-09"
                value="menores-ingresos"
              />
              <label
                class="form-check-label text-white"
                for="radio-titular-09"
                >(9) Menores ingresos</label
              >
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="siContestaronRadios"
                id="radio-titular-00"
                value="mas-opciones"
              />
              <label
                class="form-check-label text-white"
                for="radio-titular-00"
                >(0) +Mas opciones....</label
              >
            </div>
          </div>
        </form>
        <div
          class="card-footer"
          style="position: absolute; top: 10px; right: 10px;"
        >
          <small
            class="text-white"
            style="
              background-color: #1c1c1c;
              padding: 5px 10px;
              border-radius: 5px;
            "
          >
            [Teclea el número y presiona Enter]
          </small>
        </div>
      `);
  }
  // Contenedor Titular
  function cambiarSinDefinir() {
    $("#contenedor-principal").html(`
        <h5 class="card-title">Flujo</h5>
        <p class="text-white">¿Causa de no pago? Sin definir.</p>
        <p class="text-white">¿En que situación queda?</p>
        <form id="sin-definir">
          <div class="col-sm-10">
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="siContestaronRadios"
                id="radio-sin-definir-01"
                value="igual-seguimiento"
              />
              <label
                class="form-check-label text-white"
                for="radio-sin-definir-01"
                >(1) Igual (seguimiento)</label
              >
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="siContestaronRadios"
                id="radio-sin-definir-02"
                value="insolvencia"
              />
              <label
                class="form-check-label text-white"
                for="radio-sin-definir-02"
                >(2) Insolvencia</label
              >
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="siContestaronRadios"
                id="radio-sin-definir-03"
                value="pago-insuficiente"
              />
              <label
                class="form-check-label text-white"
                for="radio-sin-definir-03"
                >(3) Pago insuficiente</label
              >
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="siContestaronRadios"
                id="radio-sin-definir-04"
                value="negociacion"
              />
              <label
                class="form-check-label text-white"
                for="radio-sin-definir-04"
                >(4) Negociación</label
              >
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="siContestaronRadios"
                id="radio-sin-definir-05"
                value="cargo-en-linea"
              />
              <label
                class="form-check-label text-white"
                for="radio-sin-definir-05"
                >(5) Cargo en línea</label
              >
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="siContestaronRadios"
                id="radio-sin-definir-06"
                value="reporte-de-pago"
              />
              <label
                class="form-check-label text-white"
                for="radio-sin-definir-06"
                >(6) Reporte de pago</label
              >
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="siContestaronRadios"
                id="radio-sin-definir-07"
                value="espera-de-documentos"
              />
              <label
                class="form-check-label text-white"
                for="radio-sin-definir-07"
                >(7) Espera de documentos</label
              >
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="siContestaronRadios"
                id="radio-sin-definir-08"
                value="definicion"
              />
              <label
                class="form-check-label text-white"
                for="radio-sin-definir-08"
                >(8) Definición</label
              >
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="siContestaronRadios"
                id="radio-sin-definir-09"
                value="restructura"
              />
              <label
                class="form-check-label text-white"
                for="radio-sin-definir-09"
                >(9) Restructura</label
              >
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="siContestaronRadios"
                id="radio-sin-definir-00"
                value="mas-opciones01"
              />
              <label
                class="form-check-label text-white"
                for="radio-sin-definir-00"
                >(0) +Más opciones....</label
              >
            </div>
          </div>
        </form>
        <div
          class="card-footer"
          style="position: absolute; top: 10px; right: 10px;"
        >
          <small
            class="text-white"
            style="
              background-color: #1c1c1c;
              padding: 5px 10px;
              border-radius: 5px;
            "
          >
            [Teclea el número y presiona Enter]
          </small>
        </div>
      `);
  }
  function manejarFormulario(event) {
    // Lista de posibles IDs en orden de prioridad
    const ids = ["#principal", "#si-contestaron", "#titular", "#sin-definir"];

    // Encontrar el primer formulario existente
    const formularioId = ids.find((id) => $(id).length > 0) || null;

    if (!formularioId) {
      console.warn("No se encontró ningún formulario válido.");
      return;
    }

    const radioButtons = $(formularioId).find("input[type='radio']");

    // Configuración de teclas para cada formulario
    const teclasFormulario = {
      "#principal": {
        1: "#radio-principal-01",
        2: "#radio-principal-02",
      },
      "#si-contestaron": {
        1: "#radio-si-contestaron-01",
        2: "#radio-si-contestaron-02",
        3: "#radio-si-contestaron-03",
        4: "#radio-si-contestaron-04",
        5: "#radio-si-contestaron-05",
      },
      "#titular": {
        1: "#radio-titular-01",
        2: "#radio-titular-02",
        3: "#radio-titular-03",
        4: "#radio-titular-04",
        5: "#radio-titular-05",
        6: "#radio-titular-06",
        7: "#radio-titular-07",
        8: "#radio-titular-08",
        9: "#radio-titular-09",
        0: "#radio-titular-00",
      },
      "#sin-definir": {
        1: "#radio-sin-definir-01",
        2: "#radio-sin-definir-02",
        3: "#radio-sin-definir-03",
        4: "#radio-sin-definir-04",
        5: "#radio-sin-definir-05",
        6: "#radio-sin-definir-06",
        7: "#radio-sin-definir-07",
        8: "#radio-sin-definir-08",
        9: "#radio-sin-definir-09",
        0: "#radio-sin-definir-00",
      },
    };

    // Verificar si la tecla presionada es válida para el formulario actual
    if (
      teclasFormulario[formularioId] &&
      teclasFormulario[formularioId][event.key]
    ) {
      $(teclasFormulario[formularioId][event.key]).prop("checked", true);
    }

    // Manejar la tecla "-" para regresar al formulario anterior
    if (event.key === "-") {
      // Buscar el índice del formulario actual
      const currentIndex = ids.indexOf(formularioId);
      if (currentIndex > 0) {
        // Ir al formulario anterior
        const previousFormId = ids[currentIndex - 1];
        $("#" + previousFormId.substring(1)).show();
        $("#" + formularioId.substring(1)).hide();
      } else {
        console.warn("No hay un formulario anterior al actual.");
      }
    }

    // Manejar Enter después de seleccionar radio button
    if (event.key === "Enter") {
      if (formularioId === "#principal") {
        if ($("#radio-principal-01").is(":checked")) {
          cambiarSiContestaron();
        } else if ($("#radio-principal-02").is(":checked")) {
          // Acción para "Se referenció"
        }
      } else if (formularioId === "#si-contestaron") {
        if ($("#radio-si-contestaron-01").is(":checked")) {
          cambiarTitular();
        } else if ($("#radio-si-contestaron-02").is(":checked")) {
          // Acción para "Se referenció"
        } else if ($("#radio-si-contestaron-03").is(":checked")) {
          // Acción para "No se referenció"
        } else if ($("#radio-si-contestaron-04").is(":checked")) {
          // Acción para "No se referenció"
        } else if ($("#radio-si-contestaron-05").is(":checked")) {
          // Acción para "No se referenció"
        }
      } else if (formularioId === "#titular") {
        if ($("#radio-titular-01").is(":checked")) {
          cambiarSinDefinir();
        } else if ($("#radio-titular-02").is(":checked")) {
          // Acción para "Se referenció"
        } else if ($("#radio-titular-03").is(":checked")) {
          // Acción para "No se referenció"
        } else if ($("#radio-titular-04").is(":checked")) {
          // Acción para "No se referenció"
        } else if ($("#radio-titular-05").is(":checked")) {
          // Acción para "No se referenció"
        } else if ($("#radio-titular-06").is(":checked")) {
          // Acción para "No se referenció"
        } else if ($("#radio-titular-07").is(":checked")) {
          // Acción para "No se referenció"
        } else if ($("#radio-titular-08").is(":checked")) {
          // Acción para "No se referenció"
        } else if ($("#radio-titular-09").is(":checked")) {
          // Acción para "No se referenció"
        } else if ($("#radio-titular-00").is(":checked")) {
          // Acción para "No se referenció"
        }
      } else if (formularioId === "#sin-definir") {
        if ($("#radio-sin-definir-01").is(":checked")) {
          // Acción para "Se referenció"
        } else if ($("#radio-sin-definir-02").is(":checked")) {
          // Acción para "Se referenció"
        } else if ($("#radio-sin-definir-03").is(":checked")) {
          // Acción para "No se referenció"
        } else if ($("#radio-sin-definir-04").is(":checked")) {
          // Acción para "No se referenció"
        } else if ($("#radio-sin-definir-05").is(":checked")) {
          // Acción para "No se referenció"
        } else if ($("#radio-sin-definir-06").is(":checked")) {
          // Acción para "No se referenció"
        } else if ($("#radio-sin-definir-07").is(":checked")) {
          // Acción para "No se referenció"
        } else if ($("#radio-sin-definir-08").is(":checked")) {
          // Acción para "No se referenció"
        } else if ($("#radio-sin-definir-09").is(":checked")) {
          // Acción para "No se referenció"
        } else if ($("#radio-sin-definir-00").is(":checked")) {
          // Acción para "No se referenció"
        }
      }
    }
  }

  // Enlace para abrir el modal
  $("#enlaceModal").on("click", function (event) {
    event.preventDefault(); // Evita que el enlace navegue a otra página
    iniciarCuentaRegresiva();
  });

  // Manejar la tecla ESC
  $(document).on("keydown", function (event) {
    if (event.key === "Escape") {
      clearInterval(intervalo); // Detener el contador
      $("#contador").text(0); // Forzar el contador a 0
      cambiarContenidoContenedor(); // Cambiar el contenido del contenedor
      $("#modalCuentaRegresiva").modal("hide"); // Cerrar el modal
    }
  });

  // Manejar las teclas para seleccionar los radio buttons
  $(document).on("keydown", manejarFormulario);
});
