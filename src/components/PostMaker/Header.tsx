import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const Header = () => (
    <Link href="/dashboard" className="flex items-center w-[90%] py-4 mt-4 h-[5vh]">
        <ArrowLeft className="text-neutral-900 mr-2" />
        <p className="text-xl text-neutral-900 font-bold">Post Maker</p>
    </Link>
);

export default Header;