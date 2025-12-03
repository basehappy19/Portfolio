import { supabaseServerClient } from "@/lib/supabaseServer";

export const uploadAchievementImageDirect = async (
    file: File,
    achievementId: string | null
) => {
    const path = `${achievementId ?? "_temp"}/${Date.now()}-${file.name}`;

    const { error } = await supabaseServerClient.storage
        .from("achievements")
        .upload(path, file);

    if (error) throw error;

    const { data: publicUrlData } = supabaseServerClient.storage
        .from("achievements")
        .getPublicUrl(path);

    return {
        fileName: file.name,
        url: publicUrlData.publicUrl,
    };
};
