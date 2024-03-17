import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  child,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";


const app = initializeApp(firebaseConfig);

//Configuração do Banco de dados
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
//Adiciona e retorna dados da tabela
function getAllData() {
  const dbRef = ref(db);
  get(child(dbRef, "ramais_casa_civil"))
    .then((snapshot) => {
      let tabela = document.getElementById("table-ramais");
      snapshot.forEach((childSnapshot) => {
        let data = childSnapshot.val();
        let linha = addItemToTable(data);
        tabela.appendChild(linha);
      });
    })
    .catch((error) => {
      console.error("Error getting data: ", error);
    });
}
function filter(str) {
  const dbRef = ref(db);

  get(child(dbRef, "ramais_casa_civil")).then((snapshot) => {
    const tabela = document.getElementById("table-ramais");
    const ths = tabela.querySelectorAll("th");
    // Limpar o conteúdo da tabela, mas manter os cabeçalhos
    tabela.innerHTML = "";
    ths.forEach((th) => tabela.appendChild(th));

    snapshot.forEach((childSnapshot) => {
      const data = childSnapshot.val();
      const dataString = JSON.stringify(childSnapshot.val());
      if (dataString.toLowerCase().includes(str)) {
        const linha = addItemToTable(data);
        tabela.appendChild(linha);
      }
    });
  });
}

const busca = document.getElementById("busca");

busca.oninput = function () {
  //Valor digitado
  const str = this.value.toLowerCase();
  if (str.length >= 3) {
    filter(str);
  } else {
    getAllData();
  }
};

window.onload = getAllData;
