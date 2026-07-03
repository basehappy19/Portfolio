import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Github,
  Instagram,
  LucideIcon,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import FormContact from '../FormContact';
import Link from 'next/link';

const Contact = async () => {
  const t = await getTranslations('Index.Contact');
  const iconMap: Record<string, LucideIcon> = {
    Mail,
    Phone,
    MapPin,
    Facebook,
    Github,
    Instagram,
  };

  const contactInfo = t.raw('ContactInfos') as Array<{
    icon: string;
    label: string;
    value: string;
    href: string | null;
    gradient: string;
    type: string;
  }>;

  const socialLinks = t.raw('SocialLinks') as Array<{
    name: string;
    icon: string;
    href: string;
    color: string;
    hoverColor: string;
  }>;

  return (
    <div className="w-full text-zinc-800 dark:text-zinc-100 py-4">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 bg-gradient-to-r from-rose-600 via-amber-500 to-rose-500 dark:from-rose-400 dark:via-amber-300 dark:to-sky-400 bg-clip-text text-transparent">
            {t('Heading')}
          </h1>

          <p className="text-base md:text-lg max-w-2xl mx-auto text-zinc-600 dark:text-zinc-400">
            {t('Description')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Contact Info Cards */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4 text-zinc-800 dark:text-zinc-100">
              {t('ContactInfo')}
            </h2>

            {contactInfo.map((info, index) => {
              const Icon = iconMap[info.icon] || Mail;
              const gradientClass = info.gradient
                ? info.gradient.replace('from-', 'from-').replace('to-', 'to-')
                : 'from-rose-500 to-amber-500';

              return (
                <div
                  key={index}
                  className="group rounded-2xl p-5 transition-all duration-300 bg-white/90 dark:bg-zinc-800/60 border border-rose-100 dark:border-zinc-700/80 hover:border-rose-300 dark:hover:border-rose-500 shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3.5 rounded-2xl shadow-md bg-gradient-to-br ${gradientClass} text-white group-hover:scale-105 transition-transform duration-300`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>

                      <div>
                        <p className="text-xs font-medium mb-1 text-zinc-500 dark:text-zinc-400">
                          {info.label}
                        </p>
                        {info.href ? (
                          <a
                            href={info.href}
                            className="text-base sm:text-lg font-semibold text-zinc-800 hover:text-rose-600 dark:text-zinc-100 dark:hover:text-amber-400 transition-colors break-all"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-base sm:text-lg font-semibold text-zinc-800 dark:text-zinc-100 break-all">
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
              <h3 className="text-xl font-bold mb-4 text-zinc-800 dark:text-zinc-100">
                {t('SocialLink')}
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {socialLinks.map((social, index) => {
                  const Icon = iconMap[social.icon] || Mail;
                  const colorClass = social.color || 'from-rose-500 to-amber-500';

                  return (
                    <Link
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group relative p-4 rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-gradient-to-br ${colorClass} text-white flex flex-col items-center justify-center`}
                    >
                      <Icon className="w-7 h-7 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
                      <p className="text-xs font-semibold text-center truncate w-full">
                        {social.name}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-zinc-800/60 p-6 sm:p-8 rounded-3xl border border-rose-100 dark:border-zinc-700/80 shadow-md">
            <FormContact />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
