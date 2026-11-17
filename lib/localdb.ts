// Lightweight localStorage CRUD helper for client-side-only data

export interface BaseEntity {
    id: number;
    createdAt: Date;
}

export interface LocalCrud<T extends BaseEntity> {
    list(): T[];
    create(data: Omit<T, 'id' | 'createdAt'>): T;
    update(id: number, data: Partial<Omit<T, 'id' | 'createdAt'>>): T | null;
    remove(id: number): boolean;
    findById(id: number): T | null;
    clear(): void;
}

export function createLocalCrud<T extends BaseEntity>(storageKey: string): LocalCrud<T> {
    const getStorageKey = () => `localdb_${storageKey}`;

    const loadData = (): T[] => {
        try {
            const data = localStorage.getItem(getStorageKey());
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading data from localStorage:', error);
            return [];
        }
    };

    const saveData = (data: T[]): void => {
        try {
            localStorage.setItem(getStorageKey(), JSON.stringify(data));
        } catch (error) {
            console.error('Error saving data to localStorage:', error);
        }
    };

    const generateId = (): number => {
        return Date.now() + Math.random();
    };

    return {
        list(): T[] {
            return loadData();
        },

        create(data: Omit<T, 'id' | 'createdAt'>): T {
            const items = loadData();
            const newItem = {
                ...data,
                id: generateId(),
                createdAt: new Date()
            } as T;

            items.push(newItem);
            saveData(items);
            return newItem;
        },

        update(id: number, data: Partial<Omit<T, 'id' | 'createdAt'>>): T | null {
            const items = loadData();
            const index = items.findIndex((item) => item.id === id);

            if (index === -1) {
                return null;
            }

            items[index] = {
                ...items[index],
                ...data,
                id: items[index].id, // Preserve original id
                createdAt: items[index].createdAt // Preserve original createdAt
            };

            saveData(items);
            return items[index];
        },

        remove(id: number): boolean {
            const items = loadData();
            const filteredItems = items.filter((item) => item.id !== id);

            if (filteredItems.length === items.length) {
                return false; // Item not found
            }

            saveData(filteredItems);
            return true;
        },

        findById(id: number): T | null {
            const items = loadData();
            return items.find((item) => item.id === id) || null;
        },

        clear(): void {
            localStorage.removeItem(getStorageKey());
        }
    };
}
