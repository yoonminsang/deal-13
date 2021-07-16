function Signup({ app, back, goMain }) {
  const $target = document.createElement('div');
  $target.className = 'signup slidein auth';
  $target.innerHTML = `
  <div class="top-bar off-white">
    <div>
      <div class="js-back icon icon-left"></div>
    </div>
    <div>
      <div class="top-bar__text">회원가입</div>
    </div>
    <div></div>
  </div>
  <div class="signup-inner auth-inner">
    <form class="js-form">
      <div>아이디</div>
      <input
      type="text"
      class="js-id input-large"
      placeholder="영문, 숫자 조합 20자 이하"
      maxLength="20"
      />
      <div>비밀번호</div>
      <input
      type="password"
      class="js-password input-large"
      placeholder="비밀번호를 입력하세요"
      maxLength="20"
      />
      <div>비밀번호 확인</div>
      <input
      type="password"
      class="js-password-confirm input-large"
      placeholder="비밀번호 확인을 입력하세요"
      maxLength="20"
      />
      <div>우리 동네</div>
      <input
      type="input"
      class="js-region input-large"
      placeholder="시・구 제외, 동만 입력"
      maxLength="20"
      />
      <button class="btn-large" type="submit">회원가입</button>
    </form>
  </div>
  `;

  const $form = $target.querySelector('.js-form');
  const $id: HTMLInputElement = $form.querySelector('.js-id');
  const $password: HTMLInputElement = $form.querySelector('.js-password');
  const $passwordConfirm: HTMLInputElement = $form.querySelector(
    '.js-password-confirm',
  );
  const $region: HTMLInputElement = $form.querySelector('.js-region');

  $target.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const classList = target.classList;
    if (classList.contains('js-back')) {
      back();
    }
  });

  $target.addEventListener('input', (e) => {
    const target = e.target as HTMLInputElement;
    switch (target) {
      case $id:
        target.value = target.value.replace(/[^0-9a-z]/gi, '');
        return;
      case $region:
        target.value = target.value.replace(/[^ㄱ-ㅎ|ㅏ-ㅣ|가-힣0-9]/gi, '');
        return;
    }
  });

  $form.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = $id.value;
    const password = $password.value;
    const passwordConfirm = $passwordConfirm.value;
    const region = $region.value;
    if (!id) alert('아이디를 입력하세요!!');
    else if (!password) alert('비밀번호를 입력하세요!!');
    else if (!passwordConfirm) alert('비밀번호 확인을 입력하세요!!');
    else if (!region) alert('우리 동네를 입력하세요!!');
    else if (password !== passwordConfirm) alert('비밀번호가 다릅니다!!');
    else if (!/동$/.test(region)) alert('우리 동네를 확안하세요!!');
    else
      fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          password,
          region,
        }),
      })
        .then((res) => {
          if (res.ok) {
            alert('회원가입 완료');
            goMain();
            return res.json();
          } else if (res.status === 409) alert('아이디가 존재합니다!!');
        })
        .catch((e) => {
          console.log(e);
        });
  });

  this.state = { user: undefined };
  this.render = () => {
    if (this.state.user) {
      // history 적용시키고 뒤로가기 또는 메인으로 리다이렉트
    }
    $id.value = '';
    $password.value = '';
    $passwordConfirm.value = '';
    $region.value = '';
    $target.classList.replace('slideout', 'slidein');
    app.appendChild($target);
  };
}
export default Signup;
