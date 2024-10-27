// app/actions/chat.ts
'use server';

import { sendQuery, loadKnowledge, deleteKnowledge } from '../services/api';

export async function handleQuery(query: string) {
    try {
        const data = await sendQuery(query);
        return { success: true, data };
    } catch (error) {
        console.error('Query error:', error);
        return { success: false, error: 'Failed to get response' };
    }
}

export async function handleLoad() {
    try {
        const data = await loadKnowledge();
        return { success: true, data };
    } catch (error) {
        console.error('Load error:', error);
        return { success: false, error: 'Failed to load knowledge base' };
    }
}

export async function handleDelete() {
    try {
        const data = await deleteKnowledge();
        return { success: true, data };
    } catch (error) {
        console.error('Delete error:', error);
        return { success: false, error: 'Failed to delete knowledge base' };
    }
}