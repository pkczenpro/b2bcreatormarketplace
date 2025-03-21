/* eslint-disable @next/next/no-img-element */
"use client";

import CarouselEditor from "@/components/Dashboard/Editor";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type CarouselMakerProps = object;

export default function CarouselMaker({ }: CarouselMakerProps) {

    return (
        <div className="w-fullbg-neutral-50 flex flex-col min-h-screen px-8 py-5 bg-neutral-50">
            <Link
                href="/dashboard"
                className="flex items-center mt-4">
                <ArrowLeft className="text-neutral-900 mr-2" />
                <p className="text-xl text-neutral-900 font-bold">Carousel Maker</p>
            </Link>

            <div className="flex flex-col md:flex-row mt-4 space-x-0 md:space-x-4 space-y-4 md:space-y-0 rounded-md">
                <CarouselEditor />
            </div>
        </div>
    );
}
