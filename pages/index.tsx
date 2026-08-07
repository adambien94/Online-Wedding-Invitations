import Head from 'next/head'
import InviteForm from '../components/InviteForm'

export default function Home() {
  return (
    <>
      <Head>
        <title>Online Invitations</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-xl w-full">
          <h1 className="text-3xl font-bold mb-4">Online Invitations — Starter</h1>
          <InviteForm />
        </div>
      </main>
    </>
  )
}
