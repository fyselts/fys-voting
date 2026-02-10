import React from 'react'

interface TableColumn<T> {
    header: string
    accessor: keyof T | ((row: T) => React.ReactNode)
    className?: string
}

interface UserAdminTableProps<T> {
    data: T[]
    columns: TableColumn<T>[]
    emptyMessage?: string
}

export function UserAdminTable<T extends { id: string | number }>({ data, columns, emptyMessage = 'No data found' }: UserAdminTableProps<T>) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                        {columns.map((col, idx) => (
                            <th key={idx} className={col.className || 'py-3 px-4'}>{col.header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row) => (
                        <tr key={row.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-zinc-700/50">
                            {columns.map((col, idx) => (
                                <td key={idx} className={col.className || 'py-3 px-4'}>
                                    {typeof col.accessor === 'function' ? col.accessor(row) : row[col.accessor] as React.ReactNode}
                                </td>
                            ))}
                        </tr>
                    ))}
                    {data.length === 0 && (
                        <tr>
                            <td colSpan={columns.length} className="py-4 text-center text-gray-500">{emptyMessage}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}
