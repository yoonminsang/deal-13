function Post({ app, go, back }) {
  const target = document.createElement('div');
  target.className = 'post slidein';
  target.innerHTML = `post`;
  target.addEventListener('click', back);
  // this.state = user;
  this.render = () => {
    target.classList.replace('slideout', 'slidein');
    app.appendChild(target);
  };
}
export default Post;
