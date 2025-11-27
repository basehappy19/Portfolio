import { auth } from '@/auth'
import { SignOutButton } from '@/components/SignOutButton'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Admin() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        redirect('/auth')
    }
    return (
        <section className="p-10">
            <h1 className="text-2xl font-bold">Welcome, Admin!</h1>
            <p className="mt-2">You made it to the protected area. 🎉</p>
            <SignOutButton />
        </section>
    )
}
