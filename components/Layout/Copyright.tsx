'use client'

import { useLocale } from "next-intl";

const Copyright = ({copyright_text}: {copyright_text : string}) => {
    const locale = useLocale();
    const yearAD = new Date().getFullYear();
    const yearToDisplay = locale === "th" ? yearAD + 543 : yearAD;

    return (
        <p className="text-gray-500 text-sm">
            © {yearToDisplay} {copyright_text}
        </p>
    )
}

export default Copyright