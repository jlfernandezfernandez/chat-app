// loading-dots.tsx
export function LoadingDots() {
    return (
        <div className="flex justify-start">
            <div className="flex space-x-1">
                <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" />
            </div>
        </div>
    );
}