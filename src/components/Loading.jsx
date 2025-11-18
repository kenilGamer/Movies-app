import loader from "/loading.gif";

const Loading = () => (
    <div className="w-full min-h-screen flex justify-center items-center bg-[#0f0b20]">
        <div className="flex flex-col items-center justify-center">
            <img className="md:h-[80%] max-sm:h-[30vw] object-cover animate-pulse" src={loader} alt="Loading..." />
            <div className="mt-4 flex items-center space-x-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
        </div>
    </div>
);

export default Loading; 