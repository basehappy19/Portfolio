import {
    Mail,
    Phone,
    MapPin,
    Facebook,
    Github,
    Instagram,
    LucideIcon
} from "lucide-react";
import { getTranslations } from 'next-intl/server';
import FormContact from "../FormContact";

const Contact = async () => {
    const t = await getTranslations("Index.Contact");
    const iconMap: Record<string, LucideIcon> = {
        Mail,
        Phone,
        MapPin,
        Facebook,
        Github,
        Instagram
    };

    const contactInfo = t.raw("ContactInfos") as Array<{
        icon: string;
        label: string;
        value: string;
        href: string | null;
        gradient: string;
        type: string;
    }>;

    const socialLinks = t.raw("SocialLinks") as Array<{
        name: string;
        icon: string;
        href: string;
        color: string;
        hoverColor: string;
    }>;

    return (
        <div
            className="
                md:min-h-screen w-full
                text-gray-900
                dark:text-white
            "
        >
            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1
                        className="
                            text-4xl md:text-5xl lg:text-6xl font-bold mb-4
                            text-red-600 
                            dark:bg-clip-text
                            dark:text-transparent
                            dark:bg-linear-to-r
                            dark:from-white dark:via-orange-200 dark:to-red-200
                            
                        "
                    >
                        {t("Heading")}
                    </h1>

                    <p className="text-lg max-w-2xl mx-auto text-gray-600 dark:text-white/60">
                        {t("Description")}
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Contact Info Cards */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                            {t("ContactInfo")}
                        </h2>

                        {contactInfo.map((info, index) => {
                            const Icon = iconMap[info.icon];

                            return (
                                <div
                                    key={index}
                                    className="
                                        group rounded-2xl p-6 transition-all duration-300
                                        bg-white border border-gray-200
                                        hover:bg-gray-100

                                        dark:bg-white/5 dark:border-white/10
                                        dark:backdrop-blur-md dark:hover:bg-white/10
                                    "
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`
                                                    p-3 rounded-xl shadow-lg
                                                    bg-linear-to-br ${info.gradient}
                                                `}
                                            >
                                                <Icon className="w-6 h-6 text-white" />
                                            </div>

                                            <div>
                                                <p className="text-sm mb-1 text-gray-500 dark:text-white/50">
                                                    {info.label}
                                                </p>
                                                {info.href ? (
                                                    <a
                                                        href={info.href}
                                                        className="
                                                            text-lg font-semibold
                                                            text-gray-900 hover:text-purple-600
                                                            dark:text-white dark:hover:text-purple-300
                                                            transition-colors
                                                        "
                                                    >
                                                        {info.value}
                                                    </a>
                                                ) : (
                                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                                        {info.value}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Social Links */}
                        <div className="pt-4">
                            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                                {t("SocialLink")}
                            </h3>
                            <div className="grid grid-cols-3 gap-3">
                                {socialLinks.map((social, index) => {
                                    const Icon = iconMap[social.icon];

                                    return (
                                        <a
                                            key={index}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`
                                                group relative p-4 rounded-xl transition-all duration-300 hover:shadow-2xl
                                                bg-linear-to-br ${social.color} ${social.hoverColor}
                                            `}
                                        >
                                            <Icon className="w-8 h-8 text-white mx-auto mb-2" />
                                            <p className="text-xs text-white text-center font-medium">
                                                {social.name}
                                            </p>
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <FormContact />
                </div>
            </div>
        </div>
    );
};

export default Contact;
