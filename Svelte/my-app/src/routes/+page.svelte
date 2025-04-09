<script>
  import "../routes/page.css";

  // Enumerado para los estados
  const States = {
    Inicio: "Inicio",
    Editando: "Editando",
    MostrarAmbos: "MostrarAmbos",
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

  //Generar URL
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
      <button class="start-editing" on:click={startEditing}>Start editing</button>
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
        <button class="confirm-changes" on:click={confirmChanges}>Confirm changes</button>
      </div>
    {/if}

    {#if estado === States.MostrarAmbos}
      <div class="content">
        <div class="box">
          <h2>Base Text</h2>
          <textarea readonly class="initial-text" value={baseText}></textarea>
          <button class="back-edit" on:click={backEdit}>&#8592; Back to Edit</button>
        </div>
        <div class="box">
          <h2>Final Text</h2>
          <textarea readonly class="confirmed-text" value={finalText}></textarea>
          <button class="copy-url" on:click={generateURL}>Generate and copy URL</button>
        </div>
        {#if mostrarURLModal}
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div class="modal-backdrop" on:click={closeURL}>
            <div class="modal" on:click|stopPropagation>
              <h2>Generated URL</h2>
              <input type="text" readonly value={URL} class="url-display" />
              <div class="modal-buttons">
                <button class="cop" on:click={copiarURL}>Copy</button>
                <button class="close-url-modal" on:click={closeURL}>Close</button>
              </div>
            </div>
           </div> 
        {/if}
      </div>
    {/if}
	</div>
</main>

