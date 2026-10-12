import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs,
  Timestamp
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { SurveyResponse } from '../types/survey';

const COLLECTION_NAME = 'surveys';

export async function saveSurveyResponse(response: SurveyResponse): Promise<void> {
  const path = `${COLLECTION_NAME}/${response.id}`;
  try {
    const docRef = doc(db, COLLECTION_NAME, response.id);
    await setDoc(docRef, {
      ...response,
      createdAt: response.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateSurveyEmailStatus(
  surveyId: string,
  emailStatus: 'sent' | 'pending' | 'failed' | 'draft'
): Promise<void> {
  const path = `${COLLECTION_NAME}/${surveyId}`;
  try {
    const docRef = doc(db, COLLECTION_NAME, surveyId);
    await updateDoc(docRef, {
      emailStatus,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteSurveyResponse(surveyId: string): Promise<void> {
  const path = `${COLLECTION_NAME}/${surveyId}`;
  try {
    const docRef = doc(db, COLLECTION_NAME, surveyId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeToSurveyResponses(
  userId: string,
  isAdmin: boolean,
  onSuccess: (data: SurveyResponse[]) => void,
  onError: (err: any) => void
) {
  const path = COLLECTION_NAME;
  try {
    // If not admin, strictly query by userId to satisfy security rules
    const q = isAdmin
      ? query(collection(db, COLLECTION_NAME))
      : query(collection(db, COLLECTION_NAME), where('userId', '==', userId));

    return onSnapshot(
      q,
      (snapshot) => {
        const items: SurveyResponse[] = [];
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data() as SurveyResponse);
        });
        // Sort in memory by createdAt descending
        items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        onSuccess(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}
