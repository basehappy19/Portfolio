'use client'
import React from 'react'
import { scrollToSection } from '../Layout/Navbar'

const WarpToContact = ({ text }: { text: string }) => {
    return (
        <button
            onClick={() => scrollToSection("Contact")}
            className="flex-1 block text-center px-6 py-3 bg-red-400 hover:bg-red-500 text-white font-medium rounded-lg transition duration-300 shadow-lg hover:shadow-red-400/50 transform hover:-translate-y-0.5"
        >
            {text}
        </button>
    )
}

export default WarpToContact