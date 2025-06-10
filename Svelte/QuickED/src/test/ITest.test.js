import { render, fireEvent } from '@testing-library/svelte';
import QuickED from '../lib/QuickED.svelte';
import { describe, expect, it, vi } from 'vitest';

describe('QuickED Integration', () => {
    it('Updates the URL when transitioning to ShowBoth state', async () => {
        // Mock window.history.pushState
        const pushStateMock = vi.spyOn(window.history, 'pushState');
        const { getByPlaceholderText, getByText } = render(QuickED);
        const textarea = getByPlaceholderText('Insert the text to edit');
        await fireEvent.input(textarea, { target: { value: 'Texto base de prueba' } });
        await fireEvent.click(getByText('Start editing'));
        // Simulate user editing and confirming changes
        const editTextarea = document.querySelector('textarea.edit') || getByPlaceholderText('Edit the text');
        await fireEvent.input(editTextarea, { target: { value: 'Texto final de prueba' } });
        await fireEvent.click(getByText('Confirm changes'));
        // Expect pushState to have been called (URL updated)
        expect(pushStateMock).toHaveBeenCalled();
        const lastCall = pushStateMock.mock.calls[pushStateMock.mock.calls.length - 1];
        expect(lastCall[2]).toContain(window.location.origin);
        pushStateMock.mockRestore();        
    });
});
