import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-dvh">
      <Image
        src="/loading.svg"
        alt="Loading..."
        width={256}
        height={256}
        className="animate-spin"
      />
    </div>
  )
};