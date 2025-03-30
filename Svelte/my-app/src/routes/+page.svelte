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
</script>

<main>
  <!-- Título -->
  <h1>QuickED</h1>


  <!-- Caja de texto -->
  <div class="content">
    {#if estado === States.Inicio}
    <div class="box">
      <h2>Insert the base text before start</h2>
      <textarea 
        bind:value={text} 
        class="edit"
        placeholder="Insert the base text (400 char max)">
      </textarea>
    </div>
    {/if}
    {#if estado === States.Editando}
      <div class="box">
        <h2>You are editing...</h2>
        <textarea 
          bind:value={text} 
          class="edit">
        </textarea>
      </div>
    {/if}
    {#if estado === States.MostrarAmbos}
      <div class="content">
        <div class="box">
          <h2>Base Text</h2>
          <textarea readonly class="initial-text" value={baseText}></textarea>
        </div>
        <div class="box">
          <h2>Final Text</h2>
          <textarea readonly class="confirmed-text" value={finalText}></textarea>
        </div>
      </div>
    {/if}
	</div>

  <!-- Pie de página con los botones -->
  <div class="footer">
    {#if estado === States.Inicio}
      <button class="start-editing" on:click={startEditing}>Start editing</button>
    {/if}
    {#if estado === States.Editando}
      <button class="confirm-changes" on:click={confirmChanges}>Confirm changes</button>
    {/if}
    {#if estado === States.MostrarAmbos}
      <button class="back-edit" on:click={backEdit}>&#8592; Back to Edit</button>
    {/if}
  </div>
</main>

