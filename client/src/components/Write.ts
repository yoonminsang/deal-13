function Write({ app, user, goMain, back }) {
  const target = document.createElement('div');
  target.className = 'write slidein';
  target.innerHTML = `write`;
  target.addEventListener('click', back);
  this.state = user;
  this.render = () => {
    target.classList.replace('slideout', 'slidein');
    app.appendChild(target);
  };
}
export default Write;
