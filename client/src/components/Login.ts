import '../styles/Login.scss';
function Login({ app, go, back, authProcess }) {
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
          if (res.ok || res.status === 409) return res.json();
        })
        .then(({ user, error }) => {
          if (error) alert(error);
          else if (user) {
            authProcess(user);
            back();
            localStorage.setItem('user', 'true');
            console.log('로그인 성공');
          }
        })
        .catch((e) => {
          console.log(e);
        });
  });

  this.state = { user: undefined };
  this.render = () => {
    $id.value = '';
    $password.value = '';
    $target.classList.replace('slideout', 'slidein');
    app.appendChild($target);
  };
}
export default Login;
