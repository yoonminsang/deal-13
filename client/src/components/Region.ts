function Region({ app, user, back }) {
  const target = document.createElement('div');
  target.className = 'region slidein';
  target.innerHTML = `region`;
  target.addEventListener('click', back);
  this.state = user;
  this.render = () => {
    target.classList.replace('slideout', 'slidein');
    app.appendChild(target);
  };
}
export default Region;
