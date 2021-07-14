function Login({ app, user, go, back }) {
  const target = document.createElement('div');
  target.className = 'login slidein';
  target.innerHTML = `login`;
  target.addEventListener('click', back);
  this.state = user;
  this.render = () => {
    target.classList.replace('slideout', 'slidein');
    app.appendChild(target);
  };
}
export default Login;
