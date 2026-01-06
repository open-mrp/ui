import type { SortDirection } from './index';

// Sample data for stories
export const invoices = [
    {
        invoice: 'INV001',
        paymentStatus: 'Paid',
        totalAmount: '$250.00',
        paymentMethod: 'Credit Card',
    },
    {
        invoice: 'INV002',
        paymentStatus: 'Pending',
        totalAmount: '$150.00',
        paymentMethod: 'PayPal',
    },
    {
        invoice: 'INV003',
        paymentStatus: 'Unpaid',
        totalAmount: '$350.00',
        paymentMethod: 'Bank Transfer',
    },
    {
        invoice: 'INV004',
        paymentStatus: 'Paid',
        totalAmount: '$450.00',
        paymentMethod: 'Credit Card',
    },
    {
        invoice: 'INV005',
        paymentStatus: 'Paid',
        totalAmount: '$550.00',
        paymentMethod: 'PayPal',
    },
    {
        invoice: 'INV006',
        paymentStatus: 'Pending',
        totalAmount: '$200.00',
        paymentMethod: 'Bank Transfer',
    },
    {
        invoice: 'INV007',
        paymentStatus: 'Unpaid',
        totalAmount: '$300.00',
        paymentMethod: 'Credit Card',
    },
];

// Generate sample data for pagination
export const generateSampleData = (count: number) => {
    const statuses = ['Active', 'Inactive', 'Pending', 'Completed'];
    const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'];
    const roles = ['Developer', 'Designer', 'Manager', 'Analyst', 'Coordinator'];

    return Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        department: departments[i % departments.length],
        role: roles[i % roles.length],
        status: statuses[i % statuses.length],
        joinDate: new Date(2020 + (i % 4), i % 12, (i % 28) + 1).toLocaleDateString(),
        salary: `$${(50000 + i * 1000).toLocaleString()}`,
    }));
};

// Sorting utility functions
export const sortData = <T extends Record<string, any>>(
    data: T[],
    sortKey: keyof T,
    sortDirection: SortDirection,
): T[] => {
    if (!sortDirection) return data;

    return [...data].sort((a, b) => {
        const aValue = a[sortKey];
        const bValue = b[sortKey];

        // Handle different data types
        if (typeof aValue === 'string' && typeof bValue === 'string') {
            const comparison = aValue.localeCompare(bValue);
            return sortDirection === 'asc' ? comparison : -comparison;
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
            const comparison = aValue - bValue;
            return sortDirection === 'asc' ? comparison : -comparison;
        }

        if (
            aValue &&
            bValue &&
            typeof aValue === 'object' &&
            typeof bValue === 'object' &&
            'getTime' in aValue &&
            'getTime' in bValue
        ) {
            const comparison = (aValue as Date).getTime() - (bValue as Date).getTime();
            return sortDirection === 'asc' ? comparison : -comparison;
        }

        // Fallback to string comparison
        const aStr = String(aValue);
        const bStr = String(bValue);
        const comparison = aStr.localeCompare(bStr);
        return sortDirection === 'asc' ? comparison : -comparison;
    });
};

// Column reordering utility functions
export const reorderColumns = <T extends Record<string, any>>(
    columns: T[],
    fromIndex: number,
    toIndex: number,
): T[] => {
    const result = Array.from(columns);
    const [removed] = result.splice(fromIndex, 1);
    result.splice(toIndex, 0, removed);
    return result;
};

export const reorderDataColumns = <T extends Record<string, any>>(
    data: T[],
    columnOrder: string[],
): T[] => {
    return data.map((row) => {
        const reorderedRow: Partial<T> = {};
        columnOrder.forEach((key) => {
            if (key in row) {
                reorderedRow[key as keyof T] = row[key as keyof T];
            }
        });
        return reorderedRow as T;
    });
};
