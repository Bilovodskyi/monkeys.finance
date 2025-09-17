import { CustomButton } from "../CustomButton";

export default function Footer() {
    return (
        <footer className="flex flex-col px-24 pt-32 gap-12">
            <div className="flex flex-col w-1/3 h-full justify-center">
                <h1 className="text-3xl font-title mb-6">
                    Ready to <span className="text-highlight">Trade</span> ?
                </h1>
                <p className="text-secondary mb-8">
                    Login or register to join our trading community and get access to our trading algorithms backtest algorithms and machine learning models.
                </p>
                <div className="flex gap-4 items-center">
                    <CustomButton isBlue={true}>Start Trading</CustomButton>
                    <CustomButton isBlue={false}>Contact Us</CustomButton>
                </div>
            </div>
            <div className="flex items-center justify-between w-full border-t border-zinc-800 py-2">
                <div className="flex flex-col items-center gap-8">
                    <img src="/main-logo.png" alt="Main Logo" className="w-24" />
                    <p className="text-secondary text-sm">Trading platform for automated crypto trading</p>
                </div>
                <div className="flex items-start justify-end gap-24 py-12 w-full">

                    <ul className="flex flex-col items-start gap-4">
                        <li><a href="/" className="text-secondary text-sm">Products</a></li>
                        <li><a href="/" className="text-sm hover:underline">AI Investor</a></li>
                        <li><a href="/" className="text-sm hover:underline">AI Trading Journal</a></li>
                        <li><a href="/" className="text-sm hover:underline">Trading Competition</a></li>
                    </ul>
                    <ul className="flex flex-col items-start gap-4">
                        <li><a href="/" className="text-secondary text-sm">Tools</a></li>
                        <li><a href="/" className="text-sm hover:underline">Algorithms</a></li>
                        <li><a href="/" className="text-sm hover:underline">Backtesting</a></li>
                        <li><a href="/" className="text-sm hover:underline">Machine Learning</a></li>
                        <li><a href="/" className="text-sm hover:underline">Trading Bot</a></li>
                    </ul>
                    <ul className="flex flex-col items-start gap-4">
                        <li><a href="/" className="text-secondary text-sm">Socials</a></li>
                        <li><a href="/" className="text-sm hover:underline">Telegram</a></li>
                        <li><a href="/" className="text-sm hover:underline">LinkedIn</a></li>
                        <li><a href="/" className="text-sm hover:underline">Github</a></li>
                    </ul>
                    <ul className="flex flex-col items-start gap-4">
                        <li><a href="/" className="text-secondary text-sm">Company</a></li>
                        <li><a href="/" className="text-sm hover:underline">About</a></li>
                        <li><a href="/" className="text-sm hover:underline">Careers</a></li>
                        <li><a href="/" className="text-sm hover:underline">Contact</a></li>

                    </ul>

                </div>
            </div>
            <div className="flex items-center justify-between w-full border-t border-zinc-800 pt-2 pb-12">
                <p className="text-secondary text-sm">© 2025 Algo Squid. All rights reserved.</p>
                <p className="flex items-center gap-2 text-green-500 text-sm "><span className="h-2 w-2 bg-green-500 animate-pulse"></span> All systems are operational.</p>
            </div>

        </footer>
    );
}