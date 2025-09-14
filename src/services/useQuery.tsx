import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  setDoc,
  deleteDoc,
  DocumentData,
} from "firebase/firestore";
import { createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { db, auth } from "./firebase";
import { useLoader } from "src/components/Loader/useLoader";
import { CollectionName, Usuario } from "src/utils/typings";

function useQuery() {

  const { showLoader, hideLoader } = useLoader();

  async function getDataByCollection<T = DocumentData>(col: CollectionName): Promise<T[]> {
    showLoader();
    try {
      const snapshot = await getDocs(collection(db, col));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as T[];
      hideLoader();
      return data;
    } catch (error) {
      hideLoader();
      console.log(error);
      return [];
    }
  }

  async function getDataById(id: string, col: CollectionName) {
    showLoader();
    if (!id) {
      return {}
    }
    const ref = doc(db, col, id!);
    const snapshot = await getDoc(ref);
    hideLoader();
    return snapshot.exists() ? { ...snapshot.data(), id: snapshot.id } : null;
  }

  async function saveData(data: any, col: CollectionName) {
    showLoader();
    try {
      await addDoc(collection(db, col), data);
      hideLoader();
      return true;
    } catch (error: any) {
      console.log(error);
      hideLoader();
      return false;
    }
  }

  async function getUser(id?: string) {
    const userId = sessionStorage.getItem("clin-cash-user-uid");
    const usuario = await getDataById(id ?? userId!, "usuarios") as Usuario;
    return usuario;
  }

  async function saveUser(data: any, col: CollectionName) {
    showLoader();
    try {
      const user = await createUserWithEmailAndPassword(auth, data.email, data.senha);
      const id = user.user.uid;
      delete data.senha;
      await setDoc(doc(db, col, id), data);
      hideLoader();
      return true;
    } catch (error: any) {
      console.log(error);
      hideLoader();
      return false;
    }
  }

  async function resetPassword(email: string) {
    showLoader();
    try {
      await sendPasswordResetEmail(auth, email);
      hideLoader();
      return true;
    } catch (error: any) {
      console.log(error);
      hideLoader();
      return false;
    }
  }

  async function updateData(id: string, data: any, col: CollectionName) {
    showLoader();
    try {
      delete data.senha;
      const docRef = doc(db, col, id);
      await updateDoc(docRef, data);
      hideLoader();
      return true;
    } catch (error: any) {
      console.log(error);
      hideLoader();
      return false;
    }
  }

  async function deleteData(id: string, col: CollectionName) {
    showLoader();
    try {
      await deleteDoc(doc(db, col, id));
      hideLoader();
      return true;
    } catch (error: any) {
      console.log(error);
      hideLoader();
      return false;
    }
  }

  return {
    getDataByCollection,
    getDataById,
    saveData,
    saveUser,
    getUser,
    resetPassword,
    updateData,
    deleteData,
  }
}

export default useQuery;
