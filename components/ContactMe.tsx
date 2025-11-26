import React from 'react'

const ContactMe = () => {
    return (
        <section className="w-full px-4 md:px-8 lg:px-16" id='ContactMe'>
            <div className="max-w-9xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-4">ติดต่อผม</h1>

                <p className="text-lg mb-1 text-white">📧 pakpoom.td@gmail.com</p>
                <p className="text-lg mb-6 text-white">📱 064-303-8963</p>

                <div className="flex gap-2">
                    <a
                        href="http://facebook.com/basehappy19"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex justify-center py-2 rounded-lg font-semibold border bg-blue-600 text-white"
                    >
                        FACEBOOK
                    </a>

                    <a
                        href="https://github.com/basehappy19"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex justify-center py-2 rounded-lg font-semibold border bg-gray-800 text-white"
                    >
                        GITHUB
                    </a>

                    <a
                        href="https://www.instagram.com/base_happy19"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex justify-center py-2 rounded-lg font-semibold border bg-pink-500"
                    >
                        INSTAGRAM
                    </a>
                </div>
            </div>
        </section>

    )
}

export default ContactMe
