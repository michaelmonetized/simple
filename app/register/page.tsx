'use client';
import {
  SignUpForm,
  LogoutButton,
  ConnectFacebookButton,
  ConnectGoogleButton,
  ConnectTwitterButton,
} from '@/firebase/auth';
import { useAuth } from '@/firebase/context';
import Link from 'next/link';

export default function RegisterPage() {
  const authContext = useAuth();
  console.log(authContext);

  if (authContext.user) {
    return (
      <div className="flex flex-col h-dvh items-center justify-center">
        <LogoutButton />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-dvh items-center justify-center gap-md">
      <SignUpForm />
      <div className="flex gap-md">
        <ConnectTwitterButton />
        <ConnectFacebookButton />
        <ConnectGoogleButton />
      </div>
      <p>
        Already have an account? <Link href="/login">Login</Link>
      </p>
    </div>
  );
}
