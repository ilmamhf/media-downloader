export function SupportedPlatforms() {
    return (
        <div className="mt-12 flex flex-col items-center gap-4">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Supported Platforms</p>
            <div className="flex flex-wrap justify-center gap-8 grayscale opacity-50 dark:opacity-40">
                <div className="flex items-center gap-2 font-bold text-lg">
                    <span className="material-symbols-outlined">smart_display</span> YouTube
                </div>
                <div className="flex items-center gap-2 font-bold text-lg">
                    <span className="material-symbols-outlined">photo_camera</span> Instagram
                </div>
                <div className="flex items-center gap-2 font-bold text-lg">
                    <span className="material-symbols-outlined">music_video</span> TikTok
                </div>
            </div>
        </div>
    )
}
