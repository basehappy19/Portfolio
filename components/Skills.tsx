import React from 'react'
import SectionHeader from './SectionHeader'
import { getTranslations } from 'next-intl/server';

const Skills = async () => {
    const t = await getTranslations("Index");

    return (
        <section className="min-h-screen w-full px-4 md:px-8 lg:px-16">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <SectionHeader text={t("Skills.Heading")} />
            </div>
        </section>
    )
}

export default Skills