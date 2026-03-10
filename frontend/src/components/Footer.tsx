export function Footer() {
    return (
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark py-12 px-6">
            <div className="max-w-6xl mx-auto flex flex-col items-center justify-center text-center gap-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="bg-primary p-1 rounded text-white">
                        <span className="material-symbols-outlined block text-sm">movie_edit</span>
                    </div>
                    <h2 className="text-lg font-bold tracking-tight">MediaConvert</h2>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm">
                    The leading free media conversion tool. Save your favorite content directly to your device securely.
                </p>
                <div className="mt-8">
                    <p className="text-xs text-slate-400">© 2024 MediaConvert. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
