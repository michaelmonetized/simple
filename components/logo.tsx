import Image from "next/image";
import Link from "next/link";

export default function Logo({ multiplier = 1 }: { multiplier?: number }) {
  return (
    <h1>
      <Link
        className="block"
        href="/"
        rel="home"
        title="AI Powered Digital Marketing Automation, Optimization, Analysis and Content Generation + Scheduling by Hustle Launch"
      >
        <Image
          src="/hustle-launch-animated.svg"
          alt="Hustke Launch logo"
          title="AI Powered Digital Marketing Automation, Optimization, Analysis and Content Generation + Scheduling by Hustle Launch"
          width={300 * multiplier}
          height={105 * multiplier}
          priority
        />
      </Link>
    </h1>
  );
}
