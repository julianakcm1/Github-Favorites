export class GithubUser {
  static search(username) {
    const endpoint = `https://api.github.com/users/${username}`
    // endpoint: local onde eu vou chegar com a minha aplicação
  
    return fetch(endpoint)
    .then(data => data.json()) // ----- > PROMESSA
    // porque transformar em json, pq json é o tipo de dado
    // que eu espero desse endpoint
    /*.then(data => ({
      login: data.login,
      name: data.name,
      public_repos: data.public_repos,
      followers: data.followers
    })) */

    // DESESTRUTURANDO COMO ARGUMENTO
    /*.then(({ login, name, public_repos, followers }) => ({
      login,
      name,
      public_repos,
      followers
    })) */

    // OUTRO TIPO DE DESESTRUTURAÇÃO
    .then((data) => {
      const { login, name, public_repos, followers } = data

      return { // retornará um obj
        login: login,
        name: name,
        public_repos: public_repos,
        followers: followers
      }
    })
  }
}