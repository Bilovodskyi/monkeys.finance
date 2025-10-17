import LedGridFlicker from "@/components/landing-page/LedGridAnimation";

export default function About() {
    return (
        <div>
            <div className="h-[420px] w-full relative overflow-hidden">
                <LedGridFlicker rows={80} cols={380} activeTarget={4000} className="absolute left-0 top-0 z-20 w-full h-full scale-130" />
            </div>
        </div>
    );
}