function Main({ app, user, go }) {
  const $target = document.createElement('div');
  $target.className = 'main';
  $target.innerHTML = `main`;
  $target.addEventListener('click', () => go('category'));
  this.state = user;
  this.render = () => {
    app.appendChild($target);
  };
}
export default Main;
