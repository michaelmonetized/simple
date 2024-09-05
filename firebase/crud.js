import { auth, db } from './config';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';

export function randomID() {
  const chars =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const length = 16;
  let result = '';
  for (let i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

export async function getAll(collectionName) {
  const c = collection(db, collectionName);

  if (!c) {
    return {
      status: 404,
      message: `Collection ${collectionName} not found`,
      data: { collection: collectionName },
    };
  }

  const q = query(c);

  if (!q) {
    return {
      status: 500,
      message: 'Invalid query',
      data: { collection: collectionName },
    };
  }

  const querySnapshot = await getDocs(q)
    .catch((err) => {
      return {
        status: 500,
        message: err.message,
        data: { collection: collectionName },
        error: err,
      };
    })
    .then((querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => doc.data());
      return { status: 200, message: 'Success', data: data };
    });

  return querySnapshot;
}

export async function queryAll(collectionName, key, value) {
  const c = collection(db, collectionName);
  const q = query(c, where(key, '==', value));

  if (!q) {
    return {
      status: 500,
      message: 'Invalid query',
      data: {
        collection: collectionName,
        key: key,
        value: value,
      },
    };
  }

  const querySnapshot = await getDocs(q)
    .catch((err) => {
      return {
        status: 500,
        message: err.message,
        data: { collection: collectionName, key: key, value: value },
      };
    })
    .then((querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => doc.data());
      return { status: 200, message: 'Success', data: data };
    });

  return querySnapshot;
}

export async function getOne(collectionName, id) {
  const docRef = doc(db, collectionName, id);

  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { status: 200, message: 'Success', data: docSnap.data() };
  } else {
    return {
      status: 404,
      message: `Data id: ${id} not found`,
      data: { collection: collectionName, id: id },
    };
  }
}

export async function create(collectionName, data) {
  let id = auth.currentUser.uid || data.id || randomID();
  data.id = id;

  const docRef = doc(db, collectionName, id);
  const docExists = await getOne(collectionName, id);

  if (docExists.status === 200) {
    const prev = docExists.data;

    data = { ...prev, ...data };

    try {
      await updateDoc(docRef, data);
    } catch (err) {
      return {
        status: 500,
        message: err.message,
        data: { collection: collectionName, error: err },
      };
    }

    return { status: 200, message: 'Success', data: data };
  }

  const added = await addDoc(docRef, data)
    .then((docRef) => {
      return getOne(collectionName, docRef.id);
    })
    .catch((err) => {
      return {
        status: 500,
        message: err.message,
        data: { collection: collectionName, error: err },
      };
    });

  return added;
}

export async function read(collectionName, id = '', key = '', value = '') {
  const c = collection(db, collectionName);

  if (!c) {
    return {
      status: 404,
      message: `Collection ${collectionName} not found`,
      data: { collection: collectionName, id: id, key: key, value: value },
    };
  }

  if (id !== '') {
    return getOne(collectionName, id);
  }

  if (key !== '' && value !== '') {
    return queryAll(collectionName, key, value);
  }

  return getAll(collectionName);
}

export async function update(collectionName, id, data) {
  const docRef = doc(db, collectionName, id);
  const docExists = await getOne(collectionName, id);

  if (docExists.status === 200) {
    const prev = docExists.data;

    data = { ...prev, ...data };

    try {
      await updateDoc(docRef, data);
    } catch (err) {
      return {
        status: 500,
        message: err.message,
        data: { collection: collectionName, id: id, error: err, data: data },
      };
    }

    return { status: 200, message: 'Success', data: data };
  }

  try {
    await addDoc(docRef, data);
  } catch (err) {
    return {
      status: 500,
      message: err.message,
      data: { collection: collectionName, id: id, error: err, data: data },
    };
  }

  return { status: 200, message: 'Success', data: data };
}

export async function del(collectionName, id = '') {
  const c = collection(db, collectionName);

  if (!c) {
    return {
      status: 404,
      message: `Collection ${collectionName} not found`,
      data: {
        collection: collectionName,
        id: id,
      },
    };
  }

  if (!id) {
    const q = query(c);

    if (!q) {
      return {
        status: 500,
        message: 'Invalid query',
        data: { collection: collectionName },
      };
    }

    try {
      await deleteDoc(q);
    } catch (err) {
      return {
        status: 500,
        message: err.message,
        data: { collection: collectionName, error: err },
      };
    }

    return {
      status: 200,
      message: 'All documents deleted',
      data: { collection: collectionName },
    };
  }

  const docRef = doc(db, collectionName, id);
  const docExists = await getOne(collectionName, id);

  if (docExists.status === 200) {
    try {
      await deleteDoc(docRef);
    } catch (err) {
      return {
        status: 500,
        message: err.message,
        data: { collection: collectionName, id: id, error: err },
      };
    }

    return {
      status: 200,
      message: `Document ${id} deleted`,
      data: docExists.data,
    };
  }
}

export async function listenOne(collectionName, id) {
  const docRef = doc(db, collectionName, id);

  if (!docRef) {
    return {
      status: 404,
      message: `Collection ${collectionName} not found`,
      data: { collection: collectionName, id: id },
    };
  }

  const unsubscribe = docRef.onSnapshot((doc) => {
    if (doc.exists()) {
      return { status: 200, message: 'Success', data: doc.data() };
    } else {
      return {
        status: 404,
        message: `Data id: ${id} not found`,
        data: { collection: collectionName, id: id },
      };
    }
  });

  return unsubscribe;
}

export async function listenAll(collectionName) {
  const c = collection(db, collectionName);

  if (!c) {
    return { status: 404, message: `Collection ${collectionName} not found` };
  }

  const unsubscribe = c.onSnapshot((docs) => {
    if (docs.size > 0) {
      return { status: 200, data: docs.docs.map((doc) => doc.data()) };
    } else {
      return {
        status: 404,
        message: `Collection ${collectionName} has no documents`,
        data: { collection: collectionName, id: id },
      };
    }
  });

  return unsubscribe;
}

export async function listen(collectionName, id = null) {
  if (id) {
    return listenOne(collectionName, id);
  } else {
    return listenAll(collectionName);
  }
}

export async function getSize(collectionName) {
  const c = collection(db, collectionName);

  if (!c) {
    return {
      status: 404,
      message: `Collection ${collectionName} not found`,
      data: { collection: collectionName },
    };
  }

  const size = await getDocs(c)
    .then((querySnapshot) => {
      return {
        status: 200,
        message: 'Success',
        data: querySnapshot.size,
      };
    })
    .catch((err) => {
      return {
        status: 500,
        message: err.message,
        data: { collection: collectionName, error: err },
      };
    });

  return size;
}
