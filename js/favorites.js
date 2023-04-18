import { GithubUser } from "./GithubUser.js"

// classe que vai conter a lógica dos dados
// como os dados serão estruturados
export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()

    GithubUser.search('maykbrito').then(user => console.log(user)) // ----- > RETORNO DA PROMESSA
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
    // transforma o que era string para o tipo de dentro
    // exemplo: "[]" -> [] ; "{}" -> {}
  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    // transforma um objeto que está no js para um obj json do tipo string
  }

  // PROMISE FUNCTION
  async add(username) { // ASSÍNCRONO
    try {

      const userExists = this.entries.find(entry => entry.login === username)

      if(userExists) {
        throw new Error('Usuário já cadastrado')
      }

      const user = await GithubUser.search(username)
      // QUANDO CHEGAR NA LINHA DE CIMA, ELE IRÁ AGUARDAR A PROMESSA PARA AÍ CONTINUAR NAS PRÓXIMAS LINHAS
      // QUE É O MESMO QUE ESTÁ USANDO O FETCH

      if(user.login === undefined) {
        throw new Error('Usuário não encontrado')
      }

      this.entries = [user, ...this.entries]
      // põe o usuário e - espalha - coloca o resto depois
      this.update()
      this.save()

    } catch(error) {
      alert(error.message)
    }
  }

  delete(user) {
    // Higher-order functions (map, filter, reduce, find)
    const filteredEntries = this.entries.filter(entry => entry.login !== user.login)
    // Retornará true or false

    this.entries = filteredEntries
    this.update()
    this.save()
  }
}

// classe que vai criar a visualização e eventos do HTML
export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)

    this.tbody = this.root.querySelector('table tbody')

    this.update()
    this.onadd()
  }

  onadd() {
    const addButton = this.root.querySelector('.search button')
    addButton.onclick = () => {
      // const input = this.root.querySelector('#input-search')
      // DESESTRUTURANDO
      const { value } = this.root.querySelector('#input-search') // tiro somente o value do input
      // console.dir(input)
      this.add(value)
    }
  }

  update() {
    this.removeAllTr()

    this.entries.forEach( user => {
      const row = this.createRow()

      row.querySelector('.user img').src = `https://github.com/${user.login}.png`  
      row.querySelector('.user img').alt = `Imagem de ${user.name}`
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user span').textContent = user.login
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers

      row.querySelector('.remove').onclick = () => {
        const isOk = confirm('Tem certeza que deseja deletar essa linha?')
      
        if(isOk) {
          this.delete(user)
        }
      }

      this.tbody.append(row)
    })
  }

  createRow() {
    const tr = document.createElement('tr') // TR CRIADA PELA DOM

    // tr.innerHTML = `` PODERIA SER ASSIM TBM
    const content = `
    <td class="user">
      <img src="https://github.com/maykbrito.png" alt="Imagem de maykbrito">
      <a href="https://github.com/maykbrito" target="_blank">
        <p>Mayk Brito</p>
        <span>maykbrito</span>
      </a>
    </td>
    <td class="repositories">
      76
    </td>
    <td class="followers">
      9589
    </td>
    <td>
      <button class="remove">&times;</button>
    </td>
    `

    tr.innerHTML = content

    return tr
  }
  
  removeAllTr() {  
    this.tbody.querySelectorAll('tr').forEach((tr) => {
      tr.remove()
    })
  }
}