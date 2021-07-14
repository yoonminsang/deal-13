function Chatting({ app, user, go, back }) {
  const target = document.createElement('div');
  target.className = 'chatting slidein';
  target.innerHTML = `chatting`;
  target.addEventListener('click', back);
  this.state = user;
  this.render = () => {
    target.classList.replace('slideout', 'slidein');
    app.appendChild(target);
  };
}
export default Chatting;
