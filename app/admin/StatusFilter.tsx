"use client"

import { Eye } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Select from "./ui/Select";

const OPTIONS = [
    { value: "", label: "ทุกสถานะ", color: "" },
    { value: "PUBLIC", label: "เผยแพร่แล้ว", color: "#16a34a" },
    { value: "DRAFT", label: "แบบร่าง", color: "#f59e0b" },
];

export default function StatusFilter() {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const current = searchParams.get("status") ?? "";

    const handleChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value) params.set("status", value);
        else params.delete("status");

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    return (
        <Select
            value={current}
            options={OPTIONS}
            onChange={handleChange}
            label="สถานะ"
            ariaLabel="กรองตามสถานะ"
            icon={<Eye className="h-4 w-4" />}
        />
    );
}
