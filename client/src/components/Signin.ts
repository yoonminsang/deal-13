function Signin({ app, user, back, goMain }) {
  const target = document.createElement('div');
  target.className = 'signin slidein';
  target.innerHTML = `signin`;
  target.addEventListener('click', back);
  this.state = user;
  this.render = () => {
    target.classList.replace('slideout', 'slidein');
    app.appendChild(target);
  };
}
export default Signin;
