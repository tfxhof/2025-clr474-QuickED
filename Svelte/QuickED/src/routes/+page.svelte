<script>
  import QuickED from '$lib/QuickED.svelte';
  import { readURLParameters } from '$lib/URLfunctions.js';
  import "../routes/page.css";

  let baseText = "";
  let finalText = "";

  if (typeof window !== "undefined") {
    const { baseT, finalT } = readURLParameters(window.location.search);
    baseText = baseT || "";
    finalText = finalT || "";
  }

  let editorMode = !(baseText || finalText);
</script>

<QuickED {baseText} {finalText} {editorMode}/>