import loader from "/loading.gif";

const Loading = () => {
    return (
        <div className="w-full h-full flex justify-center items-center bg-black">
            <img className="md:h-[80%] max-sm:[30vw] object-cover" src={loader} alt="" />
        </div>
    );
};

export default Loading;