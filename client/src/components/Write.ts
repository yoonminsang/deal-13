function Write({ app, goMain, back }) {
  const target = document.createElement('div');
  target.className = 'write slidein';
  target.innerHTML = `write`;
  target.addEventListener('click', back);
  // this.state =
  this.render = () => {
    target.classList.replace('slideout', 'slidein');
    app.appendChild(target);
  };
}
export default Write;
