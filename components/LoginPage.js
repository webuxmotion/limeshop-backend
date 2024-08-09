import {signIn} from "next-auth/react"
import Head from "next/head";

const LoginPage = () => {
    return (
        <>
            <Head>
                <title>Limeshop</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="bg-blue-900 w-screen h-screen flex items-center">
                <div className="text-center w-full">
                    <button
                        className="bg-white py-2 px-4 rounded-lg"
                        onClick={() => signIn('google')}
                    >Login with Google</button>
                </div>
            </div>
        </>
    )
}

export default LoginPage;