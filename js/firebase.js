import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {getDatabase,ref,get, child} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

const firebaseConfig = {
 
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
