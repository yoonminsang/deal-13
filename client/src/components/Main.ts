function Main({ app, go }) {
  interface StateObj {
    user: string;
    category: string;
    posts: string;
  }
  const stateObj: StateObj = {
    user: 'user',
    category: 'category',
    posts: 'posts',
  };
  const $target = document.createElement('div');
  $target.className = 'main';
  $target.innerHTML = `
  <div class="top-bar main">
    <div>
      <div class="js-category render icon icon-category"></div>
    </div>
    <div class="js-modal">
      <div class="icon icon-pin"></div>
      <div class="top-bar__text">장소</div>
    </div>
    <div>
      <div class="js-login auth render icon icon-user"></div>
      <div class="js-menu render icon icon-menu"></div>
    </div>
  </div>
  // svg에 fill 하얀색, js-modal 밑에 모달칸을 미리 만들어두자. absolute blind로
  <div>여기에 글 불러오기</div>`;
  $target.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const classList = target.classList;
    if (classList.contains('render')) {
      go(classList[0].slice(3));
    }
    // if (e.target.className === 'auth') {
    //   go('auth');
    // }
  });
  this.state = {
    user: undefined,
    category: undefined,
  };
  this.setState = (nextStateName, nextState) => {
    this.state = { ...this.state, [nextStateName]: nextState };
    this.rerender(nextStateName);
  };
  this.render = () => {
    app.appendChild($target);
  };
  this.rerender = (changeStateName) => {
    console.log('main rerender', this.state);
    const $auth = $target.querySelector('.auth');
    switch (changeStateName) {
      case stateObj.user:
        if (this.state.user) $auth.classList.replace('js-login', 'js-account');
        else $auth.classList.replace('js-account', 'js-login');
        return;
      // case stateObj.category:
      //   if(this.state.category)
      // 나중에 카테고리 바뀌면 api 호출하고 거기서 setState로 posts 하자
      // case stateObj.posts:
      //~~
      default:
        console.log('state name is not found');
    }
    // category에 따라 api 불러와서 map으로 innerhtml(밑에 div)
  };
  this.render();
}
export default Main;
