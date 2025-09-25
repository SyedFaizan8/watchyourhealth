// 'use client';
// import { useState } from 'react';

// export default function GeneratePage() {
//     const [sessionId, setSessionId] = useState('');
//     const [msg, setMsg] = useState('');

//     async function generate() {
//         setMsg('Generating...');
//         const token = localStorage.getItem('token');
//         const res = await fetch('/api/generate-report', {
//             method: 'POST',
//             body: JSON.stringify({ session_id: sessionId }),
//             headers: {
//                 'Content-Type': 'application/json',
//                 ...(token ? { Authorization: `Bearer ${token}` } : {})
//             }
//         });
//         const j = await res.json();
//         if (j.ok) {
//             setMsg(`Saved: ${j.path}`);
//         } else {
//             setMsg('Error: ' + j.message);
//         }
//     }

//     return (
//         <div>
//             <h1 className="text-xl font-semibold mb-4">Generate Report</h1>
//             <div className="space-y-3 max-w-md">
//                 <input value={sessionId} onChange={e => setSessionId(e.target.value)} placeholder="session_001" className="w-full p-2 border rounded" />
//                 <div>
//                     <button onClick={generate} className="px-4 py-2 bg-indigo-600 text-white rounded">Generate PDF</button>
//                 </div>
//                 <div className="mt-2 text-sm text-gray-700">{msg}</div>
//             </div>
//             <div className="mt-6 text-xs text-gray-500">Generated PDFs saved to <code>/generated-reports/</code> on the server.</div>
//         </div>
//     );
// }

'use client';
import { useState } from 'react';

export default function GeneratePage() {
    const [sessionId, setSessionId] = useState('');
    const [msg, setMsg] = useState('');

    async function generate() {
        setMsg('Generating...');
        const token = localStorage.getItem('token');
        const res = await fetch('/api/generate-report', {
            method: 'POST',
            body: JSON.stringify({ session_id: sessionId }),
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            }
        });
        const j = await res.json();
        if (j.ok) {
            setMsg(`✅ Saved: ${j.path}`);
        } else {
            setMsg('❌ Error: ' + j.message);
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-6">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
                    Generate Report
                </h1>

                <div className="space-y-4">
                    <input
                        value={sessionId}
                        onChange={e => setSessionId(e.target.value)}
                        placeholder="Enter Session ID (e.g., session_001)"
                        className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100"
                    />

                    <button
                        onClick={generate}
                        className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
                    >
                        Generate PDF
                    </button>

                    {msg && (
                        <div
                            className={`mt-2 text-sm font-medium text-center ${msg.startsWith('✅')
                                    ? 'text-green-600 dark:text-green-400'
                                    : msg.startsWith('❌')
                                        ? 'text-red-600 dark:text-red-400'
                                        : 'text-gray-600 dark:text-gray-300'
                                }`}
                        >
                            {msg}
                        </div>
                    )}
                </div>

                <div className="mt-6 text-xs text-gray-500 dark:text-gray-400 text-center">
                    Generated PDFs will be saved to <code>/generated-reports/</code> on the server.
                </div>
            </div>
        </main>
    );
}

