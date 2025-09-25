// 'use client';
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';

// export default function Signup() {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [msg, setMsg] = useState('');
//     const router = useRouter();

//     async function submit(e: any) {
//         e.preventDefault();
//         setMsg('Creating...');
//         const res = await fetch('/api/auth/signup', {
//             method: 'POST',
//             body: JSON.stringify({ email, password }),
//             headers: { 'Content-Type': 'application/json' }
//         });
//         const j = await res.json();
//         if (j.ok) {
//             setMsg('Created — logging in...');
//             router.push('/login');
//         } else {
//             setMsg('Error: ' + j.message);
//         }
//     }

//     return (
//         <div>
//             <h1 className="text-xl font-semibold mb-4">Signup</h1>
//             <form onSubmit={submit} className="space-y-3 max-w-md">
//                 <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded" />
//                 <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" className="w-full p-2 border rounded" />
//                 <button className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer">Signup</button>
//             </form>
//             <div className="mt-3 text-sm">{msg}</div>
//             <div className='flex pt-4'>
//                 <button onClick={() => router.push('/login')} className="px-4 py-2 bg-green-600 text-white rounded cursor-pointer">already have a account</button>
//             </div>
//         </div>
//     );
// }

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');
    const router = useRouter();

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setMsg('Creating...');
        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: { 'Content-Type': 'application/json' },
        });
        const j = await res.json();
        if (j.ok) {
            setMsg('✅ Account created, redirecting...');
            setTimeout(() => router.push('/login'), 1500);
        } else {
            setMsg('❌ ' + j.message);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
            <div className="w-full max-w-md bg-white/10 backdrop-blur-md shadow-xl rounded-2xl p-8 border border-gray-700">
                <h1 className="text-3xl font-bold text-center text-white mb-6">Sign Up</h1>
                <form onSubmit={submit} className="space-y-4">
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        type="email"
                        required
                        className="w-full p-3 rounded-lg bg-gray-900/60 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        type="password"
                        required
                        className="w-full p-3 rounded-lg bg-gray-900/60 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                        type="submit"
                        className="w-full py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
                    >
                        Sign Up
                    </button>
                </form>
                {msg && (
                    <div className="mt-4 text-center text-sm text-gray-200">{msg}</div>
                )}
                <div className="mt-6 flex justify-center">
                    <button
                        onClick={() => router.push('/login')}
                        className="text-blue-400 hover:underline text-sm"
                    >
                        Already have an account? Log in
                    </button>
                </div>
            </div>
        </div>
    );
}

