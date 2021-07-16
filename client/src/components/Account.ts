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

/*
import '../styles/Login.scss';
function Login({ app, user, go, back, authProcess }) {
  const $target = document.createElement('div');
  $target.className = 'login slidein auth';
  $target.innerHTML = `
  <div class="top-bar off-white">
    <div>
      <div class="js-back icon icon-left"></div>
    </div>
    <div>
      <div class="top-bar__text">로그인</div>
    </div>
    <div></div>
  </div>
  <div class="login-inner auth-inner">
    <form class="js-form">
      <input
      type="text"
      class="js-id input-large"
      placeholder="아이디를 입력하세요."
      maxLength="20"
      />
      <input
      type="password"
      class="js-password input-large"
      placeholder="비밀번호를 입력하세요."
      maxLength="20"
      />
      <button class="btn-large" type="submit">로그인</button>
      <button class="js-signup render btn-transparent" type="button">회원가입</button>
    </form>
  </div>
  `;
  const $form = $target.querySelector('.js-form');
  const $id: HTMLInputElement = $form.querySelector('.js-id');
  const $password: HTMLInputElement = $form.querySelector('.js-password');
  $target.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const classList = target.classList;
    if (classList.contains('js-back')) {
      back();
    } else if (classList.contains('render')) {
      go(classList[0].slice(3));
    }
  });
  $form.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = $id.value;
    const password = $password.value;
    if (!id) alert('아이디를 입력하세요!!');
    else if (!password) alert('비밀번호를 입력하세요!!');
    else
      fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          password,
        }),
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else if (res.status === 409)
            alert('아이디 또는 비밀번호가 틀립니다');
        })
        .then(({ user }) => {
          if (user) {
            authProcess(user);
            back();
          }
        })
        .catch((e) => {
          console.log(e);
        });
  });
  this.state = user;
  this.render = () => {
    $id.value = '';
    $password.value = '';
    $target.classList.replace('slideout', 'slidein');
    app.appendChild($target);
  };
}
export default Login;

*/
