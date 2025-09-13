import { Link } from "react-router-dom";

export default function Logo({ hidden }) {
  return (
    <div
      className={`transition-opacity duration-300 flex-shrink-0 ${
        hidden ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <Link to="/">
        <img
          src="/BhramanGuru.svg"
          alt="BhramanGuru Logo"
          className="h-10 sm:h-12 md:h-12 lg:h-12 w-auto min-h-[40px] max-h-[64px]"
        />
      </Link>
    </div>
  );
}
