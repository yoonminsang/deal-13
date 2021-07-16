import '../styles/Account.scss';
function Account({ app, back, authProcess }) {
  interface StateObj {
    user: string;
  }
  const stateObj: StateObj = {
    user: 'user',
  };

  const $target = document.createElement('div');
  $target.className = 'account slidein';
  $target.innerHTML = `
  <div class="top-bar off-white">
    <div>
      <div class="js-back icon icon-left"></div>
    </div>
    <div>
      <div class="top-bar__text">내 계정</div>
    </div>
    <div></div>
  </div>
  <div class="account-inner auth-inner">
    <div class="user-id"></div>
    <button class="js-logout btn-large" type="submit">로그아웃</button>
  </div>
  `;
  const $userId = $target.querySelector('.user-id');
  const $logout = $target.querySelector('.js-logout');
  $target.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const classList = target.classList;
    if (classList.contains('js-back')) {
      back();
    }
  });
  $logout.addEventListener('click', (e) => {
    fetch('/api/auth/logout', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.ok) {
          authProcess(null);
          back();
          localStorage.removeItem('user');
          console.log('로그아웃');
        } else console.error('로그아웃 에러');
      })
      .catch((e) => {
        console.log(e);
      });
  });
  this.state = {
    user: undefined,
  };
  this.setState = (nextStateName, nextState) => {
    this.state = { ...this.state, [nextStateName]: nextState };
    this.rerender(nextStateName);
  };
  this.render = () => {
    $target.classList.replace('slideout', 'slidein');
    app.appendChild($target);
  };
  this.rerender = (changeStateName) => {
    console.log('account rerender', this.state, changeStateName);
    switch (changeStateName) {
      case stateObj.user:
        if (this.state.user) $userId.textContent = this.state.user.id;
        else console.log('account this.state rerender error');
        return;
      default:
        console.log('state name is not found');
    }
  };
}
export default Account;
