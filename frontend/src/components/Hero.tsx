import { ConverterWidget } from "./ConverterWidget"
import { SupportedPlatforms } from "./SupportedPlatforms"

export function Hero() {
    return (
        <section className="w-full max-w-5xl px-6 pt-16 pb-12 text-center">
            <div className="mb-8 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-sm">bolt</span>
                Ultra-Fast Processing
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                Convert Social Media to <br /><span className="text-primary">MP4 or MP3</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto mb-12">
                Paste your video link below to download high-quality content from YouTube, Instagram, and TikTok instantly.
            </p>

            <ConverterWidget />
            <SupportedPlatforms />
        </section>
    )
}
