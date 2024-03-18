import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  child,
  query,
  limitToFirst,
  startAt,
  orderByKey,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";



const app = initializeApp(firebaseConfig);

//Configuração do Banco de dados
const db = getDatabase(app);

//Cria tabela com elementos 
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

//Paginação
const elementosPorPagina = 10;
let paginaAtual = 1;

//Adiciona e retorna dados da tabela
function getAllData(paginaAtual) {
  const startingKey =
    paginaAtual === 1 ? "1" : (paginaAtual - 1) * elementosPorPagina;
  //Query que limita quantidade de itens na pagina e inicia paginação em 1
    const queryRef = query(
    ref(db, "ramais_casa_civil"),
    orderByKey(),
    startAt(startingKey.toString()),
    limitToFirst(elementosPorPagina)
  );

  get(queryRef)
    .then((snapshot) => {
      let tabela = document.getElementById("table-ramais");
      //Limpa a tabela para os proximos 10 itens
      const ths = tabela.querySelectorAll("th");
      document.getElementById("table-ramais").innerHTML = "";
      ths.forEach((th) => tabela.appendChild(th));
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
//Quantidade total de paginas que aplicação irá ter
let totalPaginas;
//Faz calculo de quantas paginas a tabela terá
function calcularTotalPaginas() {
  const dbRef = ref(db, "ramais_casa_civil");

  get(dbRef).then((snapshot) => {
    let totalItens = 0;
    snapshot.forEach(() => {
      //Armazena quantidade de itens que o bd possui
      totalItens++;
    });
    //Separa 10 itens por pagina e retorna quantas paginas tabela terá
    totalPaginas = Math.ceil(totalItens / elementosPorPagina);
    return totalPaginas;
  });
}

const anterior = document.getElementById("anterior");
const proxima = document.getElementById("proxima");

anterior.onclick = () => {
  if (paginaAtual > 1) {
    paginaAtual--;
    getAllData(paginaAtual);
  }
};

proxima.onclick = () => {
  //Verifica se chegou a pagina final e se for verdadeiro retorna a primeira pagina
  if (paginaAtual >= totalPaginas) {
    paginaAtual = 1;
  } else {
    paginaAtual++;
  }
  getAllData(paginaAtual);
};

//Busca por nome usuário, setor e local
function filter(str) {
  const dbRef = ref(db);

  get(child(dbRef, "ramais_casa_civil")).then((snapshot) => {
    const tabela = document.getElementById("table-ramais");
    const ths = tabela.querySelectorAll("th");
    // Limpar o conteúdo da tabela, mas mantem os cabeçalhos
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
    getAllData(paginaAtual);
  }
};

//Carrega a primeira pagina e calcula quantidade de paginas
window.onload = getAllData(paginaAtual);
window.onload = calcularTotalPaginas();
