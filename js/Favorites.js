// Classe que vai conter a logica de dados
// Como os dados serao estruturados
export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
  }
}

// Classe que vai cria a visualizaçao e evento Html
export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);
  }
}
