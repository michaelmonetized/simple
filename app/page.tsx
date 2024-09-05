'use client';
import { useAuth } from '@/firebase/context';
import {
  ConnectFacebookButton,
  ConnectGoogleButton,
  ConnectTwitterButton,
  LogoutButton,
} from '@/firebase/auth';
import Link from 'next/link';

export default function Home() {
  const authContext = useAuth();
  console.log(authContext);

  return authContext.user ? (
    <div className="flex flex-col h-dvh items-center justify-center gap-md">
      <div className="flex gap-md">
        <ConnectTwitterButton />
        <ConnectFacebookButton />
        <ConnectGoogleButton />
      </div>
      <LogoutButton />
    </div>
  ) : (
    <div className="flex flex-col h-dvh items-center justify-center gap-md">
      <Link href="/register">Get Started</Link>

      <div className="flex gap-md">
        <ConnectTwitterButton />
        <ConnectFacebookButton />
        <ConnectGoogleButton />
      </div>

      <LogoutButton />
    </div>
  );
}
