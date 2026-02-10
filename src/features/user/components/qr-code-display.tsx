'use client'

import { QRCodeSVG } from 'qrcode.react'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'

export function QRCodeDisplay() {
    const [origin, setOrigin] = useState('')
    const { t } = useLanguage()

    useEffect(() => {
        setOrigin(window.location.origin)
    }, [])

    if (!origin) return null

    return (
        <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg shadow-md">
            <QRCodeSVG value={origin} size={256} />
            <p className="text-sm text-gray-500">{t('scan_to_vote')}</p>
        </div>
    )
}
