import Image from "next/image";
import PineconeLogo from "../../../public/pinecone.svg";
import VercelLogo from "../../../public/vercel.svg";
import Logo from "../../../public/logo.png";

export default function Header({ className }: { className?: string }) {
  return (
    <header
      className={`flex items-center justify-center text-gray-200 text-2xl ${className}`}
    >
         <Image
        src={Logo}
        alt="vercel-logo"
        width="160"
        height="50"
        className="mr-3 mt-3"
      />
    </header>
  );
}
