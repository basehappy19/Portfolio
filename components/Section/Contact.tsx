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
    <div className="w-full text-slate-800 py-2">
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-2.5 text-slate-900 tracking-tight">
            {t('Heading')}
          </h2>

          <p className="text-sm md:text-base max-w-xl mx-auto text-slate-600">
            {t('Description')}
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Contact Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-xl font-bold mb-3 text-slate-900">
              {t('ContactInfo')}
            </h3>

            <div className="space-y-3">
              {contactInfo.map((info, index) => {
                const Icon = iconMap[info.icon] || Mail;

                return (
                  <div
                    key={index}
                    className="rounded-lg p-4 transition-all duration-200 bg-white border border-slate-200 hover:border-slate-300 shadow-2xs"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="p-3 rounded-md bg-slate-100 text-rose-600 shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-500">
                          {info.label}
                        </p>
                        {info.href ? (
                          <a
                            href={info.href}
                            className="text-sm sm:text-base font-semibold text-slate-900 hover:text-rose-600 transition-colors break-all block"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-sm sm:text-base font-semibold text-slate-900 break-all">
                            {info.value}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Social Links */}
            <div className="pt-2">
              <h3 className="text-lg font-bold mb-3 text-slate-900">
                {t('SocialLink')}
              </h3>
              <div className="grid grid-cols-3 gap-2.5">
                {socialLinks.map((social, index) => {
                  const Icon = iconMap[social.icon] || Mail;

                  return (
                    <Link
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group p-3 rounded-lg transition-all duration-200 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 hover:text-slate-900 flex flex-col items-center justify-center shadow-2xs"
                    >
                      <Icon className="w-5 h-5 mx-auto mb-1.5 text-rose-600 group-hover:scale-105 transition-transform" />
                      <p className="text-xs font-semibold text-center truncate w-full">
                        {social.name}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-lg border border-slate-200 shadow-2xs">
            <FormContact />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
