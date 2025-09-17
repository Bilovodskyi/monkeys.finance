export const Reviews = () => {
    return <section className="bg-black px-24 mt-8 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:8px_8px] h-1/2 flex flex-col justify-center items-center gap-12">
        <h1 className="text-3xl font-title mb-6">
            What our <span className="text-highlight">users</span> say
        </h1>
        <div className="flex justify-center gap-4 items-center">
            <div className="flex flex-col gap-2 w-[300px] border border-zinc-800 p-8 bg-[#050505] rotate-[5deg] translate-x-[25px] hover:translate-y-[-20px] hover:z-30 transition-all duration-300 ease-in-out">
                <h2 className="text-xl font-title">"With Algo Squid I've got so much more free time."</h2>
                <p className="text-sm text-secondary">With Algo Squid I'm not longer need to spend hours on monitoring markets manualy to open positions in the right time. I can focus on other things while bot is working for me.</p>
                <p className="text-sm pt-2">Pawel Kowalski</p>
                <p className="text-sm text-secondary">Warsaw <span className="px-3">•</span> Poland</p>
            </div>
            <div className="flex flex-col gap-2 w-[300px] border border-zinc-800 p-8 bg-[#050505] rotate-[-3deg] translate-x-[10px] translate-y-[-50px] hover:translate-y-[-70px] hover:z-30 transition-all duration-300 ease-in-out">
                <h2 className="text-xl font-title">"I'm so glad I found Algo Squid. The precision of the algorithms and bot is amazing."</h2>
                <p className="text-sm pt-2">Omar El-Sayed</p>
                <p className="text-sm text-secondary">Dubai<span className="px-3">•</span>United Arab Emirates</p>
            </div>
            <div className="flex flex-col gap-2 w-[300px] border border-zinc-800 p-8 bg-[#050505] rotate-[3deg] translate-x-[-10px] hover:translate-y-[-20px] hover:z-30 transition-all duration-300 ease-in-out">
                <h2 className="text-xl font-title">"It has completely transformed my trading."</h2>
                <p className="text-sm text-secondary">From generating trading signals to tracking algorithms performance over time and automatically open positions.</p>
                <p className="text-sm pt-2">Alexey Kuznetsov</p>
                <p className="text-sm text-secondary">Kyiv<span className="px-3">•</span>Ukraine</p>
            </div>
            <div className="flex flex-col gap-2 w-[300px] border border-zinc-800 p-8 bg-[#050505] rotate-[-5deg] translate-x-[-30px] translate-y-[-20px] hover:translate-y-[-40px] hover:z-30 transition-all duration-300 ease-in-out">
                <h2 className="text-xl font-title">Machine Learning moved algorithm performance to level I never thought possible."</h2>
                <p className="text-sm text-secondary">Having machine learning to reduce number of false signals is a game changer.</p>
                <p className="text-sm pt-2">Steve Smith</p>
                <p className="text-sm text-secondary">New York<span className="px-3">•</span>United States</p>
            </div>

        </div>

    </section>;
};