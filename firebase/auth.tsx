'use client';
import {
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  TwitterAuthProvider,
  updatePassword,
  UserCredential,
  User,
  linkWithPopup,
} from 'firebase/auth';
import { auth, db } from './config';
import { read, create, update } from './crud';
import { useRef, useState } from 'react';
import EmailInput from '@/components/ui/form/email';
import PasswordInput from '@/components/ui/form/password';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import {
  PiFacebookLogoLight,
  PiGoogleLogoLight,
  PiTwitterLogoLight,
} from 'react-icons/pi';
import { useAuth } from './context';

export type user = {
  id?: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  password: string;
  created: string;
  updated: string;
  last_login?: string;
};

export type functionResult = {
  status: number;
  message: string;
  data: any;
};

export function signup(data: user) {
  const created = (userCredential: UserCredential) => {
    console.log(userCredential);

    const uid = userCredential.user.uid;
    console.log(uid);

    data.id = uid;
    console.log(data);

    const docRef = doc(collection(db, 'users'), uid);

    try {
      setDoc(docRef, data);
    } catch (error) {
      return {
        status: 400,
        message: 'An error occurred creating the user document',
        data: error,
      };
    }

    return {
      status: 200,
      message: 'User document created successfully',
      data: data as user,
    };
  };

  const rejected = (reason: any) => {
    let message =
      'An error occurred while creating your account, please try again.';

    switch (reason.code) {
      case 'auth/email-already-in-use':
        message =
          'Please try logging in or resetting your password if you already have an account.';
        break;
      case 'auth/invalid-email':
        message = 'Please enter a valid email address.';
        break;
      case 'auth/operation-not-allowed':
        message =
          'Please try logging in or resetting your password if you already have an account.';
        break;
      case 'auth/weak-password':
        message = 'Your password is too weak.';
        break;
      default:
        message =
          'An error occurred while creating your account, please try again.';
        break;
    }

    const didGetRejected = { status: 400, message: message, data: reason };

    console.log(didGetRejected);

    return didGetRejected;
  };

  const getUserCredential = async () => {
    return await createUserWithEmailAndPassword(auth, data.email, data.password)
      .then(
        (userCredential) => {
          console.log(userCredential);
          return created(userCredential);
        },
        (reason) => {
          console.log(reason);
          return rejected(reason);
        }
      )
      .catch((error) => {
        console.log(error);
        return rejected(error);
      });
  };

  console.log(getUserCredential);

  return getUserCredential;
}

export function SignUpForm() {
  const [values, setValues] = useState<user>({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    password: '',
    created: '',
    updated: '',
  });

  const ref = useRef(null);

  const updateForm = (key: string, value: string) => {
    setValues({
      ...values,
      [key]: value,
    });

    console.log('values:', values);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(e);

    const getUserCredential = signup(values);
    console.log(getUserCredential);

    const userCredential = await getUserCredential();
    console.log(userCredential);

    const { status, data, message } = userCredential;
    console.log({ status, data, message });
  };

  return (
    <>
      <div className="flex flex-col gap-md rounded-md border border-white-200 divide-y divide-white-200">
        <h1 className="text-xl font-bold text-gray-700 p-md">
          Create Your Account
        </h1>
        <form onSubmit={handleSubmit} ref={ref}>
          <div className="flex flex-col gap-md divide-y divide-white-200">
            <div className="flex flex-col gap-md p-md">
              <EmailInput updateForm={updateForm} />
              <PasswordInput updateForm={updateForm} />
            </div>
            <div className="flex flex-col gap-md p-md items-end">
              <button
                type="submit"
                className="rounded-lg bg-cyan-400 px-md py-sm text-md text-white hover:bg-cyan-500"
              >
                Create Account
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export function signin(email: string, password: string) {
  const userCredential = signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const uid = userCredential.user.uid;
      const data = read('users', uid);

      return data;
    })
    .catch((error) => {
      let message = 'An error occurred while logging in, please try again.';

      switch (error.code) {
        case 'auth/user-not-found':
          message = 'The email address and password you entered do not match.';
          break;
        case 'auth/wrong-password':
          message = 'The email address and password you entered do not match.';
          break;
        case 'auth/too-many-requests':
          message = 'Too many requests, please try again later.';
          break;
        default:
          message = 'An error occurred while logging in, please try again.';
          break;
      }

      return { status: 400, message: message, data: error };
    });

  return userCredential;
}

export function LoginForm() {
  const [values, setValues] = useState<Partial<user>>({
    email: '',
    password: '',
  });

  const ref = useRef(null);

  const updateForm = (key: string, value: string) => {
    setValues({
      ...values,
      [key]: value,
    });

    console.log('values:', values);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(e);

    const { email, password } = values;

    if (!email || !password) {
      return;
    }

    const userCredential = await signin(email, password).then((result) => {
      const { status, data, message } = result;
      console.log({ status, data, message });
      return result;
    });

    console.log(userCredential);
    const { status, data, message } = userCredential;
  };

  return (
    <>
      <div className="flex flex-col gap-md rounded-md border border-white-200 divide-y divide-white-200">
        <h1 className="text-xl font-bold text-gray-700 p-md">Sign In</h1>
        <form onSubmit={handleSubmit} ref={ref}>
          <div className="flex flex-col gap-md divide-y divide-white-200">
            <div className="flex flex-col gap-md p-md">
              <EmailInput updateForm={updateForm} />
              <PasswordInput updateForm={updateForm} />
            </div>
            <div className="flex flex-col gap-md p-md">
              <button
                type="submit"
                className="w-full rounded-lg bg-cyan-400 px-md py-sm text-md text-white hover:bg-cyan-500"
              >
                Sign In
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export function logout() {
  signOut(auth);

  const didLogout = { status: 200, message: 'Logged out successfully.' };
  console.log(didLogout);

  return didLogout;
}

export function LogoutButton() {
  const handleClick = async () => {
    console.log('logout clicked');
    await signOut(auth);
  };

  return (
    <button
      type="button"
      className="rounded-lg bg-cyan-400 px-md py-sm text-md text-white hover:bg-cyan-500"
      onClick={handleClick}
    >
      Logout
    </button>
  );
}

export function coerceeUserCredntialObjectintoUserType(
  userCredential: UserCredential
) {
  const { user }: { user: User } = userCredential;
  const { displayName, phoneNumber, email, uid, metadata } = user;
  const { creationTime, lastSignInTime } = metadata;

  const first_name = displayName?.split(' ')[0];

  // last_name = displayName with the first_name removed
  const last_name = displayName?.replace(`${first_name} `, '');

  return {
    id: uid,
    first_name,
    last_name,
    phone: phoneNumber,
    email,
    created: creationTime,
    updated: lastSignInTime,
  };
}

export function coerceeUserObjectintoUserType(user: User) {
  const { displayName, phoneNumber, email, uid, metadata } = user;
  const { creationTime, lastSignInTime } = metadata;

  const first_name = displayName?.split(' ')[0];

  // last_name = displayName with the first_name removed
  const last_name = displayName?.replace(`${first_name} `, '');

  return {
    id: uid,
    first_name,
    last_name,
    phone: phoneNumber,
    email,
    created: creationTime,
    updated: lastSignInTime,
  };
}

export function signinWithFacebook() {
  const { currentUser } = auth;

  return async () => {
    // Sign in using a popup.
    const provider = new FacebookAuthProvider();
    const result = currentUser
      ? await linkWithPopup(currentUser, provider)
      : await signInWithPopup(auth, provider);

    // The signed-in user info.
    const user = result.user;
    // This gives you a Facebook Access Token.
    const credential = FacebookAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;

    let data = coerceeUserObjectintoUserType(user);

    const prev = await getDoc(doc(collection(db, 'users'), user.uid));

    if (prev.exists()) {
      const prevData = prev.data();
      data = { ...prevData, ...data };
    }

    await setDoc(doc(collection(db, 'users'), user.uid), data);

    return { user, credential, token };
  };
}

export function signinWithGoogle() {
  const { currentUser } = auth;

  return async () => {
    // Sign in using a popup.
    const provider = new GoogleAuthProvider();
    const result = currentUser
      ? await linkWithPopup(currentUser, provider)
      : await signInWithPopup(auth, provider);

    // The signed-in user info.
    const user = result.user;
    // This gives you a Google Access Token.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;

    let data = coerceeUserObjectintoUserType(user);

    const prev = await getDoc(doc(collection(db, 'users'), user.uid));

    if (prev.exists()) {
      const prevData = prev.data();
      data = { ...prevData, ...data };
    }

    await setDoc(doc(collection(db, 'users'), user.uid), data);

    return { user, credential, token };
  };
}

export function signinWithTwitter() {
  const { currentUser } = auth;
  return async () => {
    // Sign in using a popup.
    const provider = new TwitterAuthProvider();
    const result = currentUser
      ? await linkWithPopup(currentUser, provider)
      : await signInWithPopup(auth, provider);

    // The signed-in user info.
    const user = result.user;
    // This gives you a Twitter Access Token.
    const credential = TwitterAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;

    let data = coerceeUserObjectintoUserType(user);

    const prev = await getDoc(doc(collection(db, 'users'), user.uid));

    if (prev.exists()) {
      const prevData = prev.data();
      data = { ...prevData, ...data };
    }

    await setDoc(doc(collection(db, 'users'), user.uid), data);

    return { user, credential, token };
  };
}

export function ConnectGoogleButton() {
  return (
    <button
      type="button"
      className="w-full rounded-lg bg-cyan-400 px-md py-sm text-md text-white hover:bg-cyan-500"
      onMouseDown={signinWithGoogle()}
    >
      <PiGoogleLogoLight />
    </button>
  );
}

export function ConnectFacebookButton() {
  return (
    <button
      type="button"
      className="w-full rounded-lg bg-cyan-400 px-md py-sm text-md text-white hover:bg-cyan-500"
      onMouseDown={signinWithFacebook()}
    >
      <PiFacebookLogoLight />
    </button>
  );
}

export function ConnectTwitterButton() {
  return (
    <button
      type="button"
      className="w-full rounded-lg bg-cyan-400 px-md py-sm text-md text-white hover:bg-cyan-500"
      onMouseDown={signinWithTwitter()}
    >
      <PiTwitterLogoLight />
    </button>
  );
}

//export function resetPassword(email?: string, code?: string) {
//  const settings = { url: window.location.href, handleCodeInApp: true };
//
//  if (email) async () => await sendPasswordResetEmail(auth, email, settings);
//
//  if (code) async () => await confirmPasswordReset(email, code);
//}

export function changePassword(newPass: string, confirmPass: string) {
  const currUser: User | null = auth.currentUser;

  if (!currUser) {
    return {
      status: 403,
      message: 'You must be logged in to change your password.',
    };
  }

  if (newPass !== confirmPass) {
    return {
      status: 400,
      message: 'New password and confirmation password do not match.',
    };
  }

  async () => {
    let result = {
      status: 0,
      message: '',
      data: null,
    };

    if (currUser) {
      try {
        const updatedUser = await updatePassword(currUser, newPass);
      } catch (error) {
        result.status = 400;
        result.message =
          'An error occurred while updating your password, please try again.';
      }
    }

    if (result.status === 0) {
      result.status = 200;
      result.message = 'Password updated successfully.';
    }

    return result;
  };
}
