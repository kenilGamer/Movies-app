import loader from "/loading.gif";

const Loading = () => (
    <div className="w-full h-full flex justify-center items-center bg-black">
        <img className="md:h-[80%] max-sm:h-[30vw] object-cover" src={loader} alt="Loading..." />
    </div>
);

export default Loading;