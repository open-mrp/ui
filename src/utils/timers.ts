export class TimerBag {
    private readonly handles = new Map<string, ReturnType<typeof setTimeout>>();

    set(key: string, callback: () => void, delay: number): void {
        this.clear(key);
        this.handles.set(
            key,
            setTimeout(() => {
                this.handles.delete(key);
                callback();
            }, delay)
        );
    }

    clear(key: string): void {
        const handle = this.handles.get(key);
        if (handle !== undefined) clearTimeout(handle);
        this.handles.delete(key);
    }

    clearAll(): void {
        this.handles.forEach(handle => clearTimeout(handle));
        this.handles.clear();
    }
}
