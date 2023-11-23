import { GitHubUser } from "./GitHubUser.js";

// Classe que vai conter a logica de dados
// Como os dados serao estruturados
export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.tbody = this.root.querySelector("table tbody");
    this.load();

    GitHubUser.searche("felipe0402").then((user) => console.log(user));
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) || [];
    console.log(this.entries);
  }
  save() {
    localStorage.setItem("@github-favorites:", JSON.stringify(this.entries));
  }

  async add(username) {
    try {
      const userExists = this.entries.find((entry) => entry.login === username);

      if (userExists) {
        throw new Error("Usuario ja cadastrado");
      }

      const user = await GitHubUser.searche(username);

      if (user.login === undefined) {
        throw new Error("Usuario nao Encontrado");
      }

      this.entries = [user, ...this.entries];
      this.update();
      this.save();
    } catch (error) {
      alert(error.message);
    }
  }

  delete(user) {
    const filteRedRentries = this.entries.filter(
      (entry) => entry.login !== user.login
    );
    this.entries = filteRedRentries;
    this.update();
    this.save();
  }
}

// Classe que vai cria a visualizaçao e evento Html
export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);
    this.update();
    this.onadd();
  }

  onadd() {
    const addButton = this.root.querySelector(".search button");
    addButton.onclick = () => {
      const { value } = this.root.querySelector(".search input");

      this.add(value);
    };
  }

  update() {
    this.removeAllTr();

    this.entries.forEach((user) => {
      const row = this.creareRow();
      row.querySelector(
        ".user img"
      ).src = `https://github.com/${user.login}.png`;

      row.querySelector(".user img").alt = `imagem de ${user.name}`;
      row.querySelector(".user p").textContent = user.nome;
      row.querySelector(".user a").href = `https://github.com/${user.login}`;
      row.querySelector(".user span").textContent = user.login;
      row.querySelector(".repositories").textContent = user.public_repos;
      row.querySelector(".followers").textContent = user.followers;
      row.querySelector(".remove").onclick = () => {
        const isOk = confirm("Tem certeza que deseja deleta essa linha?");
        if (isOk) {
          this.delete(user);
        }
      };

      this.tbody.append(row);

      console.log(row);
    });
  }

  creareRow() {
    const tr = document.createElement("tr");
    const content = `  
    <td class="user">
      <img src="https://github.com/felipe0402.png" alt="" />
      <a href="https://github.com/felipe0402" target="_blank">
        <p>Felipe Andrade</p>
        <span>Felipe0402</span>
      </a>
    </td>
    <td class="repositories">98</td>
    <td class="followers">20892</td>
    <td><button class="remove">&times;</button></td>`;

    tr.innerHTML = content;
    return tr;
  }

  removeAllTr() {
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove();
    });
  }
}
