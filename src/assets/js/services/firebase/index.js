import firebaseApp from 'firebase/app';
import firebaseConfig from './config';
import 'firebase/auth';

if (Object.entries(firebaseConfig).length === 0 && firebaseConfig.constructor === Object) {
  throw new Error('Não há um objeto de configuração do Firebase. Por favor, insira seu acesso do Firebase em firebase/config.js.');
}

firebaseApp.initializeApp(firebaseConfig);

export const firebase = firebaseApp;
