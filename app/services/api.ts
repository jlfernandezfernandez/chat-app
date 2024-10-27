// app/services/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function sendQuery(query: string) {
    const res = await fetch(`${API_URL}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim() }),
        // Necesario para SSR
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }

    return res.json();
}

export async function loadKnowledge() {
    const res = await fetch(`${API_URL}/load`, {
        method: 'POST',
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Failed to load knowledge base');
    }

    return res.json();
}

export async function deleteKnowledge() {
    const res = await fetch(`${API_URL}/delete`, {
        method: 'DELETE',
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Failed to delete knowledge base');
    }

    return res.json();
}