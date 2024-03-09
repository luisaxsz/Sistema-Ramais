import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {getDatabase,ref,get, child} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBHvlquMKHrNKWyb3BEoP4hvS_cUU_s6k8",

  authDomain: "ramais-casa-civil.firebaseapp.com",

  databaseURL: "https://ramais-casa-civil-default-rtdb.firebaseio.com",

  projectId: "ramais-casa-civil",

  storageBucket: "ramais-casa-civil.appspot.com",

  messagingSenderId: "438982792661",

  appId: "1:438982792661:web:d89e7f1733de49bbd6d95c",

  measurementId: "G-1S7YGSS23D",
};

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);

function addItemToTable(infoRamal) {
  let linha = document.createElement("tr");
  const tdLocal = document.createElement("td");
  const tdSetor = document.createElement("td");
  const tdUsuario = document.createElement("td");
  const tdRamal = document.createElement("td");

  tdLocal.innerHTML = infoRamal.local;
  tdSetor.innerHTML = infoRamal.setor;
  tdUsuario.innerHTML = infoRamal.usuario;
  tdRamal.innerHTML = infoRamal.ramal;

  linha.appendChild(tdLocal);
  linha.appendChild(tdSetor);
  linha.appendChild(tdUsuario);
  linha.appendChild(tdRamal);

  return linha;
}

function getAllData(){
  const dbRef = ref(db);

  get(child(dbRef , "ramais_casa_civil"))
    .then((snapshot) => {
      let tabela = document.getElementById("table-ramais");

      snapshot.forEach((childSnapshot) => {
        let element = childSnapshot.val();
        let linha = addItemToTable(element);
        tabela.appendChild(linha);
      });
    })
    .catch((error) => {
      console.error("Error getting data: ", error);
    });
}

window.onload = getAllData;
