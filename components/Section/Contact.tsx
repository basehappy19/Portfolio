import {
    Mail,
    Phone,
    MapPin,
    Facebook,
    Github,
    Instagram,
    LucideIcon
} from "lucide-react";
import FormContact from './FormContact';
import { getTranslations } from 'next-intl/server';

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
        <section className="md:min-h-screen w-full px-4 md:px-8 lg:px-16" id='Contact'>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-16">

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-linear-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-4">
                        {t("Heading")}
                    </h1>

                    <p className="text-lg text-white/60 max-w-2xl mx-auto">
                        {t("Description")}
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Contact Info Cards */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white mb-6">{t("ContactInfo")}</h2>

                        {contactInfo.map((info, index) => {
                            const Icon = iconMap[info.icon];

                            return (
                                <div
                                    key={index}
                                    className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-xl bg-linear-to-br ${info.gradient} shadow-lg`}>
                                                <Icon className="w-6 h-6 text-white" />
                                            </div>

                                            <div>
                                                <p className="text-sm text-white/50 mb-1">{info.label}</p>
                                                {info.href ? (
                                                    <a
                                                        href={info.href}
                                                        className="text-lg font-semibold text-white hover:text-purple-300 transition-colors"
                                                    >
                                                        {info.value}
                                                    </a>
                                                ) : (
                                                    <p className="text-lg font-semibold text-white">{info.value}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Social Links */}
                        <div className="pt-4">
                            <h3 className="text-xl font-bold text-white mb-4">{t("SocialLink")}</h3>
                            <div className="grid grid-cols-3 gap-3">
                                {socialLinks.map((social, index) => {
                                    const Icon = iconMap[social.icon];

                                    return (
                                        <a
                                            key={index}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`group relative p-4 rounded-xl bg-linear-to-br ${social.color} ${social.hoverColor} transition-all duration-300 hover:shadow-2xl`}
                                        >
                                            <Icon className="w-8 h-8 text-white mx-auto mb-2" />
                                            <p className="text-xs text-white text-center font-medium">{social.name}</p>
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <FormContact />
                </div>
            </div>
        </section>
    );
};

export default Contact;