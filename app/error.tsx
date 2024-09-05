"use client";

import Logo from "@/components/logo";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-stretch justify-center gap-md p-md w-full max-w-[1170px] text-center">
        <Logo />
        <p>{"We're currently working on this feature."}</p>
        <p><button onMouseDown={reset}>{"Click Here To Try Again"}</button> - or - <Link href="/">Start Over</Link></p>
      </div>
    </div>
  );
}

export const metadata = {
  title: "We're currently working on this feature.",
};
