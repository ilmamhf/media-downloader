export function Header() {
    return (
        <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 lg:px-20 py-4 bg-white/50 dark:bg-background-dark/50 backdrop-blur-md sticky top-0 z-50">
            <div className="flex items-center gap-2">
                <div className="bg-primary p-1.5 rounded-lg text-white">
                    <span className="material-symbols-outlined block text-2xl">movie_edit</span>
                </div>
                <h2 className="text-xl font-bold tracking-tight">MediaConvert</h2>
            </div>
            <div className="flex items-center gap-3">
                <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center p-2 rounded-lg text-slate-500 hover:text-slate-900 transition-colors dark:hover:text-white"
                >
                    <span className="material-symbols-outlined">code</span>
                </a>
            </div>
        </header>
    )
}
