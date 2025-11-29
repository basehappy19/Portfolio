import React from 'react'

const ViewCV = ({ text }: { text: string }) => {
    return (
        <button className="cursor-pointer px-8 py-4 bg-white/10 backdrop-blur-md rounded-full text-white font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300">
            {text}
        </button>
    )
}

export default ViewCV