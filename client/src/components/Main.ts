function Main({ app, go }) {
  interface StateObj {
    user: string;
    category: string;
    post: string;
    primaryRegion: string;
  }
  const stateObj: StateObj = {
    user: 'user',
    category: 'category',
    post: 'post',
    primaryRegion: 'primaryRegion',
  };

  const $target = document.createElement('div');
  $target.className = 'main';
  $target.innerHTML = `
  <div class="top-bar main">
    <div>
      <div class="js-category render icon icon-category"></div>
    </div>
    <div>
      <div class="js-modal icon icon-pin"></div>
      <div class="js-modal top-bar__text">장소</div>
    </div>
    <ul class="drop-down-list blind">
      <li class="js-region render drop-down-item">내 동네 설정하기</li>
    </ul>
    <div>
      <div class="js-login auth render icon icon-user"></div>
      <div class="js-menu render icon icon-menu"></div>
    </div>
  </div>
  <div class="product-list"></div>`;

  const $listItems = $target.querySelector('.product-list');
  const $auth = $target.querySelector('.auth');
  const $region = $target.querySelector('.top-bar__text');
  const $dropDwon = $target.querySelector('.drop-down-list');

  const makeListItem = (
    id,
    url,
    name,
    region,
    time,
    price,
    chat,
    love,
  ): string => {
    return `
    <div class="js-post#${id} product-list-item">
      <div class="img-box-large">
        <img src="${url}" alt="이미지">
      </div>
      <div class="product-list-item__content">
        <div class="icon icon-heart product-list-item__heart"></div>
        <p class="product-list-item__title">${name}</p>
        <p class="product-list-item__info">${region} - ${time}</p>
        <p class="product-list-item__price">${price}</p>
        <div class="product-list-item__bottom">
          <div class="icon icon-message"></div>
          <p>${chat}</p>
          <div class="icon icon-heart"></div>
          <p>${love}</p>
        </div>
      </div>
    </div>
    `;
  };

  const makeRegionItem = (number: number, region: string): string => {
    return `<li class="region ${number} drop-down-item">${region}</li>`;
  };

  const makeMyRegion = (): string => {
    return '<li class="js-region render drop-down-item">내 동네 설정하기</li>';
  };

  const setPrimaryRegion = (primaryRegion: string = '0'): string => {
    localStorage.setItem('primaryRegion', primaryRegion);
    this.rerender(stateObj.primaryRegion);
    return primaryRegion;
    // return localStorage.getItem('primaryRegion');
  };

  const getPrimaryRegion = (): string => {
    const primaryRegion =
      localStorage.getItem('primaryRegion') || setPrimaryRegion();
    return primaryRegion;
  };
  // 지역 살제할땐 무조건 setPrimaryRegion('1'),
  // 아니 무조건 db에서 하는걸로 나중에 수정

  const getApi = (): void => {
    if (
      this.state.user &&
      this.state.user.region &&
      this.state.user.region[0] &&
      this.state.category
    ) {
      // this.state.user
      // fetch(
      //   `/api/post/${this.state.user.region[getPrimaryRegion()]}/${
      //     this.state.category
      //   }`,
      //   {
      //     method: 'GET',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //   },
      // )
      //   .then((res) => res.json())
      //   .then(({ post, text }) => {
      //     this.setState(stateObj.post, post);
      //     if (text) console.log(text);
      //   })
      //   .catch((e) => {
      //     console.error(e);
      //   });
      // fake
      const post = [
        ['1', 'github.com', '반팔', '석수동', '1일전', '10,000', '1', '2'],
      ];
      this.setState(stateObj.post, post);
    } else if (this.state.user === null) {
      $listItems.innerHTML =
        '<div class="need-login"><div>로그인해주세요!!!</div></div>';
    }
  };

  $target.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const classList = target.classList;
    if (classList.contains('render')) {
      $dropDwon.classList.add('blind');
      go(classList[0].slice(3));
    } else if (classList.contains('js-modal')) {
      $dropDwon.classList.toggle('blind');
    } else if (classList.contains('region')) {
      setPrimaryRegion(target.classList[1]);
      $dropDwon.classList.add('blind');
    }
  });
  this.state = {
    user: undefined,
    category: undefined,
    post: undefined,
  };

  this.setState = (nextStateName, nextState) => {
    this.state = { ...this.state, [nextStateName]: nextState };
    this.rerender(nextStateName);
  };

  this.render = () => {
    app.appendChild($target);
  };

  this.rerender = (changeStateName) => {
    console.log('main rerender', this.state, changeStateName);
    switch (changeStateName) {
      case stateObj.user:
        if (this.state.user) {
          $auth.classList.replace('js-login', 'js-account');
          $region.textContent = this.state.user.region[getPrimaryRegion()];
          $dropDwon.innerHTML =
            this.state.user.region
              .map((v, i) => makeRegionItem(i, v))
              .join('') + makeMyRegion();
        } else {
          $auth.classList.replace('js-account', 'js-login');
          $region.textContent = '장소';
          $dropDwon.innerHTML = makeMyRegion();
        }
        getApi();
        return;
      case stateObj.category:
        if (this.state.category) getApi();
        else console.log('localstorage category error or main state error');
        return;
      case stateObj.post:
        $listItems.innerHTML = this.state.post
          .map(([id, url, name, region, time, price, chat, love]: string[7]) =>
            makeListItem(id, url, name, region, time, price, chat, love),
          )
          .join('');
        return;
      case stateObj.primaryRegion:
        $region.textContent = this.state.user.region[getPrimaryRegion()];
        return;
      default:
        console.log('state name is not found');
    }
  };
  this.render();
}
export default Main;
