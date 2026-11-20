import { getTranslations } from "next-intl/server";
import Copyright from "./Copyright";
import FooterAuth from "./FooterAuth";

export default async function Footer() {
    const t = await getTranslations("Index.Footer");

    return (
        <footer className="bg-zinc-950 text-zinc-400">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-white/10 px-5 pb-32 pt-8 sm:px-8 md:flex-row md:pb-10">
                <Copyright copyright_text={t("copyright")} />
                <FooterAuth />
            </div>
        </footer>
    );
}
