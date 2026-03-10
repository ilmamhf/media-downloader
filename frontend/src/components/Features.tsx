export function Features() {
    return (
        <section className="w-full max-w-6xl px-6 py-20 mt-10 mx-auto">
            <div className="rounded-3xl overflow-hidden bg-primary p-8 md:p-12 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-blue-600"></div>
                {/* Decorative background pattern */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "24px 24px" }}></div>

                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="flex flex-col items-center text-center group">
                        <div className="size-16 rounded-2xl bg-white/20 text-white flex items-center justify-center mb-6 border border-white/20 group-hover:scale-110 transition-transform backdrop-blur-sm">
                            <span className="material-symbols-outlined text-3xl">high_quality</span>
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-white">Highest Quality</h3>
                        <p className="text-white/80">Download videos in up to 4K resolution and audio in 320kbps crystal clear quality.</p>
                    </div>
                    <div className="flex flex-col items-center text-center group">
                        <div className="size-16 rounded-2xl bg-white/20 text-white flex items-center justify-center mb-6 border border-white/20 group-hover:scale-110 transition-transform backdrop-blur-sm">
                            <span className="material-symbols-outlined text-3xl">speed</span>
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-white">Instant Processing</h3>
                        <p className="text-white/80">Our cloud-based servers process your requests in seconds without taxing your device.</p>
                    </div>
                    <div className="flex flex-col items-center text-center group">
                        <div className="size-16 rounded-2xl bg-white/20 text-white flex items-center justify-center mb-6 border border-white/20 group-hover:scale-110 transition-transform backdrop-blur-sm">
                            <span className="material-symbols-outlined text-3xl">lock</span>
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-white">Secure &amp; Private</h3>
                        <p className="text-white/80">No account required. Your downloads are encrypted and deleted from our servers after 24 hours.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
