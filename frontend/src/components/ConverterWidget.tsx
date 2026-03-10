import { useState, useEffect } from "react";

export function ConverterWidget() {
    const [url, setUrl] = useState("");
    const [format, setFormat] = useState("mp4");
    const [quality, setQuality] = useState("1080p");

    const [status, setStatus] = useState<"idle" | "queued" | "starting" | "downloading" | "processing" | "finished" | "failed">("idle");
    const [jobId, setJobId] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [errorMsg, setErrorMsg] = useState("");
    const [filename, setFilename] = useState<string | null>(null);
    const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

    // Poll for job status
    useEffect(() => {
        let interval: number;

        if (jobId && !["finished", "failed", "idle"].includes(status)) {
            interval = setInterval(async () => {
                try {
                    const res = await fetch(`/api/job/${jobId}`);
                    if (!res.ok) throw new Error("Job not found");

                    const data = await res.json();
                    setStatus(data.status);
                    setProgress(data.progress || 0);

                    if (data.thumbnail_url) {
                        setThumbnailUrl(data.thumbnail_url);
                    }

                    if (data.status === "failed") {
                        setErrorMsg(data.error || "Unknown error occurred.");
                    }
                    if (data.status === "finished") {
                        setFilename(data.filename);
                    }
                } catch (err: any) {
                    setStatus("failed");
                    setErrorMsg(err.message);
                }
            }, 2000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [jobId, status]);

    const handleConvert = async () => {
        if (!url) return;
        setStatus("queued");
        setProgress(0);
        setErrorMsg("");
        setFilename(null);
        setJobId(null);
        setThumbnailUrl(null);

        try {
            const res = await fetch("/api/download", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url, format, quality }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || "Failed to start conversion");
            }

            const data = await res.json();
            setJobId(data.job_id);
        } catch (error: any) {
            setStatus("failed");
            setErrorMsg(error.message);
        }
    };

    const getStatusText = () => {
        switch (status) {
            case "queued": return "In Queue...";
            case "starting": return "Starting Download...";
            case "downloading": return `Downloading (${progress}%)`;
            case "processing": return "Processing & Muxing...";
            case "finished": return "Completed!";
            case "failed": return "Error";
            default: return "";
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto bg-white dark:bg-slate-900/50 p-6 md:p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
            <div className="flex flex-col gap-6">
                {/* URL Input Group */}
                <div className="flex flex-col md:flex-row gap-3">
                    <div className="relative flex-1 group">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">link</span>
                        <input
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            disabled={["queued", "starting", "downloading", "processing"].includes(status)}
                            className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-base disabled:opacity-50"
                            placeholder="Paste YouTube or Instagram link here..."
                            type="text"
                        />
                    </div>
                    <button
                        onClick={handleConvert}
                        disabled={["queued", "starting", "downloading", "processing"].includes(status) || !url}
                        className="bg-primary text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
                    >
                        <span className="material-symbols-outlined">download</span>
                        {["queued", "starting", "downloading", "processing"].includes(status) ? 'Processing...' : 'Convert'}
                    </button>
                </div>

                {/* Progress & Error Display */}
                {status !== "idle" && (
                    <div className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 md:p-6 border border-slate-200 dark:border-slate-800">
                        {status === "failed" ? (
                            <div className="text-red-500 text-sm font-medium flex items-center gap-2">
                                <span className="material-symbols-outlined">error</span>
                                {errorMsg}
                            </div>
                        ) : (
                            <div className="flex flex-col gap-6">
                                {/* Thumbnail Display */}
                                {thumbnailUrl && (
                                    <div className="relative w-full overflow-hidden rounded-xl bg-slate-900 border border-slate-200 dark:border-slate-700 aspect-video md:aspect-[21/9] flex items-center justify-center">
                                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-10" />
                                        <img src={thumbnailUrl} alt="Video Thumbnail" className="absolute inset-0 w-full h-full object-cover opacity-70" />
                                        <img src={thumbnailUrl} alt="Preview" className="relative z-20 h-full w-auto max-w-full rounded-sm shadow-2xl object-contain drop-shadow-2xl" />
                                    </div>
                                )}

                                {/* Status Details */}
                                {status === "finished" && filename ? (
                                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                        <span className="text-green-500 font-bold flex items-center gap-2">
                                            <span className="material-symbols-outlined">check_circle</span> Ready to Download
                                        </span>
                                        <a
                                            href={`/api/file/${filename}`}
                                            download
                                            className="bg-green-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20 w-full sm:w-auto text-center"
                                        >
                                            Save File
                                        </a>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between text-sm font-bold text-slate-700 dark:text-slate-300">
                                            <span>{getStatusText()}</span>
                                            <span>{progress}%</span>
                                        </div>
                                        <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary transition-all duration-300 ease-out"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Format & Quality Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Format Toggle */}
                    <div className="flex flex-col gap-2 text-left">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Output Format</span>
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                            <button
                                onClick={() => setFormat("mp4")}
                                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${format === 'mp4' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                            >
                                MP4 (Video)
                            </button>
                            <button
                                onClick={() => setFormat("mp3")}
                                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${format === 'mp3' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                            >
                                MP3 (Audio)
                            </button>
                        </div>
                    </div>

                    {/* Quality Selection */}
                    <div className="flex flex-col gap-2 text-left">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Quality Preference</span>
                        <div className={`flex gap-2 ${format === 'mp3' ? 'opacity-50 pointer-events-none' : ''}`}>
                            <button
                                onClick={() => setQuality("1080p")}
                                className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${quality === '1080p' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 dark:border-slate-700 hover:border-primary text-slate-600 dark:text-slate-400'}`}
                            >
                                1080p
                            </button>
                            <button
                                onClick={() => setQuality("720p")}
                                className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${quality === '720p' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 dark:border-slate-700 hover:border-primary text-slate-600 dark:text-slate-400'}`}
                            >
                                720p
                            </button>
                            <button
                                onClick={() => setQuality("480p")}
                                className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${quality === '480p' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 dark:border-slate-700 hover:border-primary text-slate-600 dark:text-slate-400'}`}
                            >
                                480p
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
