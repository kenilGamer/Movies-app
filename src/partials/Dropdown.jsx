import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaCheck } from "react-icons/fa";

const Dropdown = ({ title, options, func, value }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(value || "0");
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (option) => {
        setSelectedValue(option);
        setIsOpen(false);
        if (func) {
            // Create a synthetic event object
            const syntheticEvent = {
                target: { value: option }
            };
            func(syntheticEvent);
        }
    };

    const displayText = selectedValue === "0" 
        ? title 
        : options.find(o => o === selectedValue)?.replace(/_/g, " ").toUpperCase() || title;

    return (
        <div ref={dropdownRef} className="relative mt-5 z-10">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full sm:w-auto min-w-[180px] px-4 py-3 bg-gradient-to-r from-zinc-800/90 to-zinc-900/90 backdrop-blur-sm border border-zinc-700/50 rounded-xl text-white font-medium text-sm sm:text-base flex items-center justify-between gap-3 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 group"
            >
                <span className="truncate flex-1 text-left">{displayText}</span>
                <FaChevronDown 
                    className={`text-xs sm:text-sm text-zinc-400 group-hover:text-indigo-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                />
            </button>

            {isOpen && (
                <>
                    <div 
                        className="fixed inset-0 z-[-1]" 
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900/95 backdrop-blur-md border border-zinc-700/50 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50 animate-fadeIn">
                        <div className="py-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                            {options.map((option, i) => {
                                const isSelected = selectedValue === option;
                                const displayOption = option.replace(/_/g, " ").toUpperCase();
                                
                                return (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => handleSelect(option)}
                                        className={`w-full px-4 py-3 text-left text-sm sm:text-base flex items-center justify-between gap-3 transition-all duration-200 ${
                                            isSelected
                                                ? "bg-indigo-500/20 text-indigo-400 font-semibold"
                                                : "text-zinc-300 hover:bg-zinc-800/50 hover:text-white"
                                        }`}
                                    >
                                        <span className="flex-1">{displayOption}</span>
                                        {isSelected && (
                                            <FaCheck className="text-indigo-400 text-xs" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Dropdown;