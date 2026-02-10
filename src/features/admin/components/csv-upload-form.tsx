'use client'

import React, { useState, useTransition } from 'react'
import { createBulkUsers } from '@/features/user/actions/admin'
import { useLanguage } from '@/context/LanguageContext'

export function CsvUploadForm() {
    const [isPending, startTransition] = useTransition()
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
    const { t } = useLanguage()

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = async (event) => {
            const text = event.target?.result as string
            const rows = text.split('\n').map(row => row.trim()).filter(row => row)

            if (rows.length < 2) {
                setMessage({ text: t('csv_invalid'), type: 'error' })
                return
            }

            const header = rows[0] // Guaranteed by length check
            if (!header) return

            let separator = '\t'
            if (header.split('\t').length < 2) {
                separator = ','
            }
            if (header.split(separator).length < 2) {
                separator = ';'
            }

            const headerParts = header.split(separator).map(h => h.trim())

            const emailIndex = headerParts.indexOf('E-mail')
            const firstNameIndex = headerParts.indexOf('Eesnimi')
            const lastNameIndex = headerParts.indexOf('Perekonnanimi')

            if (emailIndex === -1 || firstNameIndex === -1 || lastNameIndex === -1) {
                setMessage({ text: t('missing_columns'), type: 'error' })
                return
            }

            const users = rows.slice(1).map(row => {
                const cols = row.split(separator).map(c => c.trim())
                if (cols.length < headerParts.length) return null

                return {
                    full_name: `${cols[firstNameIndex]} ${cols[lastNameIndex]}`,
                    email: cols[emailIndex]
                }
            }).filter((u): u is { full_name: string; email: string } => u !== null && !!u.email && !!u.full_name)

            startTransition(async () => {
                const result = await createBulkUsers(users)
                setMessage({
                    text: result.success ? t('users_imported') : (result.message || 'Error'),
                    type: result.success ? 'success' : 'error'
                })
            })
        }
        reader.readAsText(file)
    }

    return (
        <div className="flex flex-col gap-4 w-full max-w-md bg-white dark:bg-zinc-800 p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-2">{t('upload_csv')}</h3>
            <p className="text-sm text-gray-500 mb-2">
                {t('upload_csv_subtitle')}
            </p>
            <input
                type="file"
                accept=".csv,.tsv,.txt"
                onChange={handleFileUpload}
                disabled={isPending}
                className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100 dark:file:bg-zinc-700 dark:file:text-gray-200"
            />
            {isPending && <p className="text-blue-500">{t('processing')}</p>}
            {message && (
                <p className={`mt-2 text-sm font-semibold ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                    {message.text}
                </p>
            )}
        </div>
    )
}
