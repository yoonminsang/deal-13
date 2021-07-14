function Category({ app, user, back }) {
  const $target = document.createElement('div');
  $target.className = 'category slidein';
  $target.innerHTML = `category`;
  $target.addEventListener('click', back);
  this.state = user;
  this.render = () => {
    $target.classList.replace('slideout', 'slidein');
    app.appendChild($target);
  };
}
export default Category;
