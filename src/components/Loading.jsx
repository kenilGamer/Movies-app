import loader from "/loading.gif";

const Loading = ({ message = "Loading...", fullScreen = true }) => {
    const containerClass = fullScreen 
        ? "w-full min-h-screen flex justify-center items-center bg-[#0f0b20]"
        : "w-full flex justify-center items-center py-12";

    return (
        <div className={containerClass}>
            <div className="flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                    <img 
                        className="md:h-[80%] max-sm:h-[30vw] object-cover animate-pulse" 
                        src={loader} 
                        alt="Loading..." 
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                    </div>
                </div>
                <div className="flex flex-col items-center space-y-2">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <p className="text-zinc-400 text-sm font-medium animate-pulse">{message}</p>
                </div>
            </div>
        </div>
    );
};

export default Loading;
