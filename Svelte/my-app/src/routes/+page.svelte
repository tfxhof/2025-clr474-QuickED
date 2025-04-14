<script>
  import "../routes/page.css";
  import { diffWords } from 'diff';

  // Enumerado para los estados
  const States = {
    Inicio: "Inicio",
    Editando: "Editando",
    MostrarAmbos: "MostrarAmbos",
    MostrarFinal: "MostrarFinal",
  };
  let estado = States.Inicio;
  let text = ""; 
  let baseText = "";
  let finalText = "";

  // Función para guardar el texto
  function startEditing() {
    baseText = text;
    estado = States.Editando;
  }

  // Función para confirmar los cambios
  function confirmChanges() {
    finalText = text;
    estado = States.MostrarAmbos
  }

  // Función para confirmar los cambios
  function backEdit() {
    finalText = text;
    estado = States.Editando
  }

  //Modificar color si se llega al limite de caracteres
  $: isMax400 = estado === States.Inicio && text.length >= 400;
  $: isMax600 = estado === States.Editando && text.length >= 600;

  //URL
  let URL = "";
  let mostrarURLModal = false;
  function generateURL() {
    let base = encodeURIComponent(baseText);
    let final = encodeURIComponent(finalText);
    URL = `/resultado?base=${base}&final=${final}`;
    mostrarURLModal = true;
  }

  function copiarURL() {
  navigator.clipboard.writeText(URL)
    .then(() => {
      alert("URL copied to clipboard!");
    })
    .catch(err => {
      console.error("Failed to copy: ", err);
    });
  }

  function closeURL() {
    mostrarURLModal = false;
  }

  //Diff 
  $: diffResult = diffWords(baseText, finalText);

  // Alterar mostrar cambios o no
  let mostrarCambios = true;
  function toggleMostrarCambios() {
    mostrarCambios = !mostrarCambios;
  }
  function toggleEstadoFinal() {
    if (estado === States.MostrarAmbos) {
      estado = States.MostrarFinal;
    } else if (estado === States.MostrarFinal) {
      estado = States.MostrarAmbos;
    }
  }

</script>

<main>
  <!-- Título -->
  <h1>QuickED</h1>

  <!-- Caja de texto -->
  <div class="content">
    {#if estado === States.Inicio}
    <div class="box">
      <h2>Insert the base text before start</h2>
        <span class="limit" class:reached={isMax400}> (400 char max)</span>
      <textarea 
        bind:value={text} 
        class="edit"
        placeholder="Insert the base text (400 char max)"
        maxlength="400">
      </textarea>
    </div>
    {/if}
    {#if estado === States.Editando}
      <div class="box">
        <h2>You are editing...</h2>
        <span class="limit" class:reached={isMax600}> (600 char max)</span>
        <textarea 
          bind:value={text} 
          class="edit"
          maxlength="600">
        </textarea>
      </div>
    {/if}

    {#if estado === States.MostrarAmbos}
      <!-- Con cambios-->
      {#if mostrarCambios}
        <div class="box">
          <h2>Base Text</h2>
          <div class="diff-textarea">
            {#each diffResult as part}
              {#if !part.added}
                <span class:removed={part.removed}>
                  {@html part.value.replace(/\n/g, '<br>')} <!-- Reemplazar saltos de línea por <br> -->
                </span>
              {/if}  
            {/each}
          </div>
        </div>  
        <div class="box">
          <h2>Final Text</h2>
          <div class="diff-textarea">
            {#each diffResult as part}
              {#if !part.removed}
                <span class:added={part.added}>
                  {@html part.value.replace(/\n/g, '<br>')}
                </span>
              {/if}  
            {/each}
          </div>
        </div>
      {/if}
      <!-- Sin cambios-->
      {#if !mostrarCambios}
        <div class="box">
          <h2>Base Text</h2>
          <textarea readonly value={baseText}></textarea>
        </div>
        <div class="box">
          <h2>Final Text</h2>
          <textarea readonly value={finalText}></textarea>
        </div>
      {/if}        
    {/if}

    {#if estado === States.MostrarFinal}
      <!-- Con cambios-->
      {#if mostrarCambios}
        <div class="box">
          <h2>Final Text</h2>
          <div class="diff-textarea">
            {#each diffResult as part}
              <span class:added={part.added} class:removed={part.removed}>
                {@html part.value.replace(/\n/g, '<br>')}
              </span>
            {/each}
          </div>
        </div>  
      {/if}
      {#if !mostrarCambios}
        <!-- Sin cambios-->
        <div class="box">
          <h2>Final Text</h2>
          <textarea readonly value={finalText}></textarea>
        </div>
      {/if}
    {/if}

	</div>

  <!-- Botón para mostrar/ocultar cambios -->
  {#if estado === States.MostrarAmbos || estado === States.MostrarFinal}
    <!-- Botón para mostrar/ocultar cambios -->
    <!-- Toggle Switch -->
    <div class="toggle-container">
      <label class="switch">
        <input type="checkbox" bind:checked={mostrarCambios} />
        <span class="slider"></span>
      </label>
      <span class="toggle-label">Highlight Changes</span>

      <!-- Nuevo checkbox -->
      <label class="checkbox-label">
        <input type="checkbox" on:change={toggleEstadoFinal}/>
        Show only final text
      </label>
    </div>
  {/if}

  <!-- Pie de página con los botones -->
  <div class="footer">
    {#if estado === States.Inicio}
      <button class="start-editing" on:click={startEditing}>Start editing</button>
    {/if}

    {#if estado === States.Editando}
      <button class="confirm-changes" on:click={confirmChanges}>Confirm changes</button>
    {/if}

    {#if estado === States.MostrarAmbos || estado === States.MostrarFinal}
      <div class="footer-section">
        <button class="back-edit" on:click={backEdit}>&#8592; Back to Edit</button>
      </div>
      <div class="footer-section">
        <button class="copy-url" on:click={generateURL}>Generate and copy URL</button>
      </div>
      <!--Ventana copiarURL-->
      {#if mostrarURLModal}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div class="modal-backdrop" on:click={closeURL}>
        <div class="modal" on:click|stopPropagation>
          <h2>Generated URL</h2>
          <input type="text" readonly value={URL} class="url-display" />
          <div class="modal-buttons">
            <button class="copy-url" on:click={copiarURL}>Copy</button>
            <button class="close-url-modal" on:click={closeURL}>Close</button>
          </div>
        </div>
        </div> 
      {/if}
    {/if}
  </div>
</main>

