import { useEffect, useState } from 'react'

export function useRole() {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const checkRole = async () => {
      await Promise.resolve()

      const match = document.cookie.match(
        new RegExp('(^| )accessToken=([^;]+)'),
      )

      if (match) {
        const token = match[2]
        try {
          const payloadBase64 = token.split('.')[1]
          const decodedPayload = JSON.parse(atob(payloadBase64))

          const role = decodedPayload.role || decodedPayload.roles

          if (
            role === 'admin' ||
            role === 'ADMIN' ||
            (Array.isArray(role) &&
              (role.includes('admin') || role.includes('ADMIN')))
          ) {
            setIsAdmin(true)
          }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          console.error('Failed to parse token payload')
        }
      }
    }

    checkRole()
  }, [])

  return { isAdmin }
}
