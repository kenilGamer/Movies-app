import React from "react";

const Dropdown = ({ title, options, func }) => {
    return (
        <div className="select mt-5 transition-all duration-300 hover:scale-105">
            <select defaultValue="0" onChange={func} name="format" id="format" className="cursor-pointer transition-all duration-300 hover:bg-[#3a2d5a] focus:bg-[#3a2d5a]">
                <option value="0" disabled>
                    {title}
                </option>
                {options.map((o, i) => (
                    <option key={i} value={o}>
                        {o.toUpperCase()}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Dropdown;