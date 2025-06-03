import { render, fireEvent } from '@testing-library/svelte';
import QuickED from '../lib/QuickED.svelte';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock window.navigator.clipboard to avoid copy errors in tests
beforeEach(() => {
  Object.assign(window, {
    navigator: {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined)
      }
    }
  });
});


describe('QuickED Component', () => {
  it('Shows textarea and "Start editing" button in the initial state', () => {
    const { getByPlaceholderText, getByText } = render(QuickED);
    expect(getByPlaceholderText('Insert the text to edit')).toBeTruthy();
    expect(getByText('Start editing')).toBeTruthy();
  });

  it('Shows warning if trying to edit with empty text', async () => {
    const { getByText, findByText } = render(QuickED);
    await fireEvent.click(getByText('Start editing'));
    expect(await findByText('Warning')).toBeTruthy();
    expect(await findByText('The text cannot be empty.')).toBeTruthy();
  });

  it('Shows warning if base text exceeds 400 characters', async () => {
    const { getByPlaceholderText, getByText, findByText } = render(QuickED);
    const textarea = getByPlaceholderText('Insert the text to edit');
    await fireEvent.input(textarea, { target: { value: 'a'.repeat(401) } });
    await fireEvent.click(getByText('Start editing'));
    expect(await findByText('Warning')).toBeTruthy();
    expect(await findByText('Text exceeds the 400-character limit.')).toBeTruthy();
  });

  it('Allows editing when base text is valid', async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(QuickED);
    const textarea = getByPlaceholderText('Insert the text to edit');
    await fireEvent.input(textarea, { target: { value: 'Valid base text' } });
    await fireEvent.click(getByText('Start editing'));
    expect(queryByText('Start editing')).toBeNull();
    expect(getByText('You are editing...')).toBeTruthy();
  });

  it('Shows warning if final text exceeds 600 characters', async () => {
    const { getByPlaceholderText, getByText, findByText } = render(QuickED);
    const textarea = getByPlaceholderText('Insert the text to edit');
    await fireEvent.input(textarea, { target: { value: 'Valid base text' } });
    await fireEvent.click(getByText('Start editing'));
    const editTextarea = document.querySelector('textarea.edit');
    if (editTextarea) {
      await fireEvent.input(editTextarea, { target: { value: 'b'.repeat(601) } });
    }
    await fireEvent.click(getByText('Confirm changes'));
    expect(await findByText('Warning')).toBeTruthy();
    expect(await findByText('Text exceeds the 600-character limit.')).toBeTruthy();
  });

  it('Copies final text to clipboard in non-editor mode', async () => {
    const { getByText} = render(QuickED, { baseText: 'A', finalText: 'B', editorMode: false });
    const copyButton = getByText('Copy Final Text');
    await fireEvent.click(copyButton);
    expect(window.navigator.clipboard.writeText).toHaveBeenCalledWith('B');
  });

  it('Shows both Base Text and Final Text in ShowBoth state', () => {
    const { getByText } = render(QuickED, { baseText: 'A', finalText: 'B' });
    expect(getByText('Base Text')).toBeTruthy();
    expect(getByText('Final Text')).toBeTruthy();
  });

  it('Back to edit button is visible in ShowBoth state', () => {
    const { getByText } = render(QuickED, { baseText: 'A', finalText: 'B' });
    expect(getByText('← Back to Edit')).toBeTruthy();
  });
  
  it('Toggle switch changes from ShowBoth to ShowFinal', async () => {
    const { getByText, container } = render(QuickED, { baseText: 'A', finalText: 'B' });
    expect(getByText('Base Text')).toBeTruthy();
    expect(getByText('Final Text')).toBeTruthy();
    const toggles = container.querySelectorAll('input[type="checkbox"]');
    const showFinalToggle = toggles[1];
    await fireEvent.change(showFinalToggle);
    expect(getByText('Final Text')).toBeTruthy();
    expect(() => getByText('Base Text')).toThrow();
  });

  it('Toggle switch returns from ShowFinal to ShowBoth', async () => {
    const { getByText, container } = render(QuickED, { baseText: 'A', finalText: 'B' });
    const toggles = container.querySelectorAll('input[type="checkbox"]');
    const showFinalToggle = toggles[1];
    await fireEvent.change(showFinalToggle);
    await fireEvent.change(showFinalToggle);
    expect(getByText('Base Text')).toBeTruthy();
    expect(getByText('Final Text')).toBeTruthy();
  });

  it('Highlight changes toggle shows plain textareas', async () => {
  const { container } = render(QuickED, { baseText: 'A', finalText: 'B' });
  const toggles = container.querySelectorAll('input[type="checkbox"]');
  const highlightToggle = toggles[0];
  await fireEvent.click(highlightToggle);
  const textareas = container.querySelectorAll('textarea[readonly]');
  expect(textareas.length).toBe(2);
  const values = Array.from(textareas).map(t => /** @type {HTMLTextAreaElement} */ (t).value);
  expect(values).toContain('A');
  expect(values).toContain('B');
});

  it('Highlight changes toggle returns to showing highlighted changes', async () => {
    const { container } = render(QuickED, { baseText: 'A', finalText: 'B' });
    const toggles = container.querySelectorAll('input[type="checkbox"]');
    const highlightToggle = toggles[0];
    await fireEvent.change(highlightToggle); 
    await fireEvent.change(highlightToggle); 
    expect(container.querySelector('.removed') || container.querySelector('.added')).toBeTruthy();
  });

});
