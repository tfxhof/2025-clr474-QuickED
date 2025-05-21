<script>
  import { onMount } from "svelte";
  import "../routes/page.css";
  import { diffWords } from 'diff';
  import { generateURL, readURLParameters } from '$lib/URLfunctions.js';

  // State Enumeration
  const States = {
    Init: "Init",
    Editing: "Editing",
    ShowBoth: "ShowBoth",
    ShowFinal: "ShowFinal",
  };

  // State Init and Editing
  let state = States.Init;
  let text = ""; 
  let baseText = "";
  let finalText = "";
  let warningMessage = "";
  let showWarningModal = false;


  // Check if the text length is less than or equal to limit characters
  /**
     * @param {string} inputText
     * @param {number} limit
     */
  function validateTextLength(inputText, limit) {
    if (inputText.length > limit) {
      return `Text exceeds the ${limit}-character limit.`;
    } else if (inputText.trim().length === 0) {
      return "The text cannot be empty.";
    }
    return null;
  }
  // Save base text function and change to editing state 
  // Check if the text length is less than or equal to 400 characters
  // If the text length exceeds 400 characters, show a warning modal
  function startEditing() {
    const error = validateTextLength(text, 400);
    if (error) {
      warningMessage = error;
      showWarningModal = true;
    } else {
      baseText = text;
      state = States.Editing;
    }
  }

  // Confirm changes, save final text and chanege to show both state
  // Check if the text length is less than or equal to 600 characters
  // If the text length exceeds 600 characters, show a warning modal
  function confirmChanges() {
    const error = validateTextLength(text, 600);
    if (error) {
      warningMessage = error;
      showWarningModal = true;
    } else {
      finalText = text;
      state = States.ShowBoth
      URL = generateURL(baseText, finalText, window.location.origin);
      // Change the URL without reloading the page
      window.history.pushState({}, "", URL);
    }  
  }

  // close warning modal
  function closeWarningModal() {
    showWarningModal = false;
  }

  // State ShowBoth and ShowFinal

  // non editor mode
  // Copy final text to clipboard
  function copyFinalText() {
  navigator.clipboard.writeText(finalText)
    .then(() => {
      alert("Final text copied to clipboard!");
    })
    .catch(err => {
      console.error("Failed to copy: ", err);
    });
  } 

  let showNewQuickEDModal = false;

  function openNewQuickEDModal() {
    showNewQuickEDModal = true;
  }

  function closeNewQuickEDModal() {
    showNewQuickEDModal = false;
  }

  // Create a new empty QuickED
  function newEmptyQuickED() {
    text = "";
    baseText = "";
    finalText = "";
    state = States.Init;
    editorMode = true;
    showNewQuickEDModal = false;
    window.history.pushState({}, "", `${window.location.origin}/`);
  }

  // Use final text as base text
  function useFinalTextAsBase() {
    text = finalText;
    baseText = finalText;
    finalText = "";
    state = States.Init;
    editorMode = true;
    showNewQuickEDModal = false;
    window.history.pushState({}, "", `${window.location.origin}/`);
  }

  // editor mode
  // Back to edit state
  function backEdit() {
    finalText = text;
    state = States.Editing
    // Change the URL without reloading the page
    window.history.pushState({}, "", `${window.location.origin}/`);
  }

  //URL
  let URL = "";
  let showURLModal = false;
  let editorMode = true

  // Show URL modal
  function showURL() {
    showURLModal = true;
  }

  // Copy URL to clipboard
  function copyURL() {
  navigator.clipboard.writeText(URL)
    .then(() => {
      alert("URL copied to clipboard!");
    })
    .catch(err => {
      console.error("Failed to copy: ", err);
    });
  }

  // Close URL modal
  function closeURL() {
    showURLModal = false;
  }
  
  // URL parameters
  function handleURLParameters() {
    const { baseT: base, finalT: final } = readURLParameters(window.location.search);
    baseText = base;
    finalText = final;
    if (baseText || finalText) {
      state = States.ShowBoth; // Change to ShowBoth state if there is data in the URL
      editorMode = false;
    }
    else {
      state = States.Init; 
      editorMode = true;
    }
  }
  
  // Check if there are parameters in the URL
  onMount(() => {
    handleURLParameters();
  });
  

  // Diff 
  $: diffResult = diffWords(baseText, finalText);

  // Toggle between showing both texts and only the final text
  let remarkChanges = true;

  function toggleFinalState() {
    if (state === States.ShowBoth) {
      state = States.ShowFinal;
    } else if (state === States.ShowFinal) {
      state = States.ShowBoth;
    }
  }

</script>

<main>
  <!-- Tittle -->
  <h1>QuickED</h1>

  <!-- Box for the text area -->
  <div class="content">
    {#if state === States.Init}
    <div class="box">
      <h2>Insert the text to edit</h2>
      <span class="limit" class:reached={text.length > 400}>{text.length}/400 characters</span>
      <textarea 
        bind:value={text} 
        class="edit"
        placeholder="Insert the text to edit">
      </textarea>
    </div>
    {/if}
    {#if state === States.Editing}
      <div class="box">
        <h2>You are editing...</h2>
        <span class="limit" class:reached={text.length > 600}>{text.length}/600 characters</span>
        <textarea 
          bind:value={text} 
          class="edit">
        </textarea>
      </div>
    {/if}

    {#if state === States.ShowBoth}
      <!-- Remark changes-->
      {#if remarkChanges}
        <div class="box">
          <h2>Base Text</h2>
          <div class="diff-textarea">
            {#each diffResult as part}
              {#if !part.added}
                <span class:removed={part.removed}>
                  {@html part.value.replace(/\n/g, '<br>')} <!-- Replace line breaks with <br> -->
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
      <!-- No remark changes-->
      {#if !remarkChanges}
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

    {#if state === States.ShowFinal}
      <!-- Remark changes-->
      {#if remarkChanges}
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
      {#if !remarkChanges}
        <!-- No remark changes-->
        <div class="box">
          <h2>Final Text</h2>
          <textarea readonly value={finalText}></textarea>
        </div>
      {/if}
    {/if}
	</div>

  <!--Toggle switch-->
  {#if state === States.ShowBoth || state === States.ShowFinal}
    <!-- Show/Hide changes button -->
    <div class="toggle-container">
      <label class="switch">
        <input type="checkbox" bind:checked={remarkChanges} />
        <span class="slider"></span>
      </label>
      <span class="toggle-label">Highlight Changes</span>

      <!-- Change final state -->
      <label class="switch">
        <input type="checkbox" on:change={toggleFinalState} />
        <span class="slider"></span>
      </label>
      <span class="toggle-label">Show only final text</span>
    </div>
  {/if}

  <!-- Footer with buttons -->
  <div class="footer">
    <!--Init state-->
    {#if state === States.Init}
      <button class="start-editing" on:click={startEditing}>Start editing</button>
    {/if}

    <!--Editing state-->
    {#if state === States.Editing}
      <button class="confirm-changes" on:click={confirmChanges}>Confirm changes</button>
    {/if}

    <!-- Warning modal-->
    {#if showWarningModal}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div class="modal-backdrop" on:click={closeWarningModal}>
        <div class="modal" on:click|stopPropagation>
          <h2>Warning</h2>
          <p>{warningMessage}</p>
          <button class="close-warning-modal" on:click={closeWarningModal}>Close</button>
        </div>
      </div>
    {/if}

    <!-- Show both and show final state-->
    {#if state === States.ShowBoth || state === States.ShowFinal}
      <!-- Editor mode-->
      {#if editorMode}
        <div class="footer-section">
          <button class="back-edit" on:click={backEdit}>&#8592; Back to Edit</button>
        </div>
        <div class="footer-section">
          <button class="copy-url" on:click={showURL}>Copy URL</button>
        </div>
      {/if}
      <!-- Non editor mode-->
      {#if !editorMode}
        <div class="footer-section">
          <button class="new-quicked" on:click={openNewQuickEDModal}>New QuickED</button>
        </div>
        <div class="footer-section">
          <button class="copy-text" on:click={copyFinalText}>Copy Final Text</button>
        </div> 
      {/if}

      {#if showNewQuickEDModal}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="modal-backdrop" on:click={closeNewQuickEDModal}>
          <div class="modal" on:click|stopPropagation>
            <h2>New QuickED</h2>
            <p>Choose an option:</p>
            <div class="modal-buttons">
              <button class="new-empty" on:click={newEmptyQuickED}>New Empty QuickED</button>
              <button class="use-final-as-base" on:click={useFinalTextAsBase}>Use current final text as base text</button>
            </div>
            <button class="close-modal" on:click={closeNewQuickEDModal}>Cancel</button>
          </div>
        </div>
      {/if}



      <!--Show URL Modal-->
      {#if showURLModal}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="modal-backdrop" on:click={closeURL}>
          <div class="modal" on:click|stopPropagation>
            <h2>URL:</h2>
            <input type="text" readonly value={URL} class="url-display" />
            <div class="modal-buttons">
              <button class="copy-url" on:click={copyURL}>Copy</button>
              <button class="close-url-modal" on:click={closeURL}>Close</button>
            </div>
          </div>
        </div> 
      {/if}
    {/if}
  </div>
</main>

