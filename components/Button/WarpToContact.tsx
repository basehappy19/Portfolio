'use client'
import React from 'react'
import { scrollToSection } from '../Layout/Navbar'

const WarpToContact = ({ text }: { text: string }) => {
    return (
        <button
            onClick={() => scrollToSection("Contact")}
            className="cursor-pointer flex-1 block text-center px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-lg shadow-xs transition duration-200"
        >
            {text}
        </button>
    )
}

export default WarpToContact