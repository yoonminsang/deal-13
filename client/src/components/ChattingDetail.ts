function ChattingDetail({ app, user, back }) {
  const target = document.createElement('div');
  target.className = 'chattingDetail slidein';
  target.innerHTML = `chattingDetail`;
  target.addEventListener('click', back);
  this.state = user;
  this.render = () => {
    target.classList.replace('slideout', 'slidein');
    app.appendChild(target);
  };
}
export default ChattingDetail;
