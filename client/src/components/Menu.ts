function Menu({ app, user, back }) {
  const target = document.createElement('div');
  target.className = 'menu slidein';
  target.innerHTML = `menu`;
  target.addEventListener('click', back);
  this.state = user;
  this.render = () => {
    target.classList.replace('slideout', 'slidein');
    app.appendChild(target);
  };
}
export default Menu;
