'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { setSession } from '@/features/auth/actions'

export default function CallbackPage() {
    const router = useRouter()
    const [message, setMessage] = useState('Authenticating...')

    useEffect(() => {
        const handleAuth = async () => {
            const hash = window.location.hash
            let accessToken = ''

            if (hash) {
                const params = new URLSearchParams(hash.substring(1))
                accessToken = params.get('access_token') || ''
            }

            if (!accessToken) {
                const params = new URLSearchParams(window.location.search)
                accessToken = params.get('access_token') || ''
            }

            if (accessToken) {
                try {
                    const result = await setSession(accessToken)
                    if (result.success) {
                        router.push('/user')
                        router.refresh()
                    } else {
                        setMessage('Failed to create session')
                    }
                } catch (e) {
                    setMessage('Error during authentication.')
                }
            } else {
                const params = new URLSearchParams(window.location.search)
                const error = params.get('error_description')
                if (error) {
                    setMessage('Auth Error: ' + error)
                } else {
                    setMessage('No access token found. Please try scanning the code again.')
                }
            }
        }
        handleAuth()
    }, [router])

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <h1 className="text-2xl font-bold mb-4">{message}</h1>
        </div>
    )
}
