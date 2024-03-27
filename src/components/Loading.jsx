import loader from "/loading.gif";

const Loading = () => {
    return (
        <div className="w-screen h-screen flex justify-center items-center bg-black">
            <img className="h-[80%] object-cover" src={loader} alt="" />
        </div>
    );
};

export default Loading;