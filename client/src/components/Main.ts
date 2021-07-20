function Main({ app, setPrimaryRegion }) {
  interface Goods {
    id: number;
    url: string;
    title: string;
    region: string;
    time: string;
    price: number;
    chat: number;
    wish: number;
    myWish: boolean;
  }
  interface StateObj {
    user: string;
    category: string;
    post: string;
    primaryRegion: string;
    modal: string;
  }
  const stateObj: StateObj = {
    user: 'user',
    category: 'category',
    post: 'post',
    primaryRegion: 'primaryRegion',
    modal: 'modal',
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
  <div class="product-list"></div>
  <button class="js-write render btn-fab">
    <div class="icon icon-add"></div>
  </button>`;

  const $listItems = $target.querySelector('.product-list');
  const $auth = $target.querySelector('.auth');
  const $region = $target.querySelector('.top-bar__text');
  const $dropDwon = $target.querySelector('.drop-down-list');

  const makeListItem = ({
    id,
    thumbnail,
    title,
    region_name,
    price,
    chat_count,
    wish_count,
    isWish,
    created,
  }) => {
    price = price.toLocaleString('ko-KR') + '원';
    const chatElm = chat_count
      ? `<div class="icon icon-message"></div><p>${chat_count}</p>`
      : '';
    const wishElm = wish_count
      ? `<div class="icon icon-heart"></div><p>${wish_count}</p>`
      : '';
    return `
    <div class="js-post#${id} render product-list-item">
      <div class="img-box-large">
        <img src="${thumbnail}" alt="이미지">
      </div>
      <div class="product-list-item__content">
        <div class="icon icon-heart product-list-item__heart ${
          isWish && 'active'
        }"></div>
        <p class="product-list-item__title">${title}</p>
        <p class="product-list-item__info">${region_name} - ${created}</p>
        <p class="product-list-item__price">${price}</p>
        <div class="product-list-item__bottom">
          ${chatElm}${wishElm}
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

  const getApi = (): void => {
    if (this.state.user && this.state.category && this.state.primaryRegion) {
      // /api/goods/list?regionId=3&lastIndex=13
      // 카테고리 추가하기
      console.log('getapi', this.state);
      fetch(
        `/api/goods/list?regionId=${
          this.state.user.region_id[this.state.primaryRegion]
        }`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
        .then((res) => res.json())
        .then(({ data, text }) => {
          this.setState(stateObj.post, data);
          if (text) console.log(text);
        })
        .catch((e) => {
          console.error(e);
        });
      // fake
      // const post: Goods[] = [
      //   {
      //     id: 1,
      //     url: '/',
      //     title: '제목',
      //     region: '석수동',
      //     time: '1일전',
      //     price: 10000,
      //     chat: 1,
      //     wish: 2,
      //     myWish: false,
      //   },
      //   {
      //     id: 2,
      //     url: '/',
      //     title: '제목',
      //     region: '석수동',
      //     time: '1일전',
      //     price: 10000,
      //     chat: 1,
      //     wish: 2,
      //     myWish: true,
      //   },
      //   {
      //     id: 3,
      //     url: '/',
      //     title: '제목',
      //     region: '석수동',
      //     time: '2일전',
      //     price: 10000,
      //     chat: 0,
      //     wish: 2,
      //     myWish: true,
      //   },
      //   {
      //     id: 3,
      //     url: '/',
      //     title: '제목',
      //     region: '석수동',
      //     time: '2일전',
      //     price: 10000,
      //     chat: 0,
      //     wish: 0,
      //     myWish: true,
      //   },
      // ];
      // const post = [['1', '', '반팔', '석수동', '1일전', '10,000', '1', '2']];
      // this.setState(stateObj.post, post);
    } else if (this.state.user === null) {
      $listItems.innerHTML =
        '<div class="need-login"><div>로그인해주세요!!!</div></div>';
    }
  };

  $target.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const classList = target.classList;
    const renderClosest = target.closest('.render');
    if (renderClosest && renderClosest.classList.contains('render')) {
      this.setState(stateObj.modal, false);
    } else if (classList.contains('js-modal')) {
      this.setState(stateObj.modal, !this.state.modal);
    } else if (classList.contains('region')) {
      setPrimaryRegion(target.classList[1]);
      this.setState(stateObj.modal, false);
    }
  });

  this.state = {
    user: undefined,
    category: undefined,
    post: undefined,
    primaryRegion: undefined,
    modal: false,
  };

  this.setState = (nextStateName, nextState) => {
    this.state = { ...this.state, [nextStateName]: nextState };
    this.rerender(nextStateName);
  };

  this.render = () => {
    app.appendChild($target);
  };

  this.rerender = (changeStateName) => {
    switch (changeStateName) {
      case stateObj.user:
        if (this.state.user) {
          $auth.classList.replace('js-login', 'js-account');
          $region.textContent =
            this.state.user.region[this.state.primaryRegion];
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
          .map(
            ({
              id,
              thumbnail,
              title,
              region_name,
              price,
              chat_count,
              wish_count,
              isWish,
              created,
            }) =>
              makeListItem({
                id,
                thumbnail,
                title,
                region_name,
                price,
                chat_count,
                wish_count,
                isWish,
                created,
              }),
          )
          .join('');
        return;
      case stateObj.primaryRegion:
        $region.textContent = this.state.user.region[this.state.primaryRegion];
        getApi();
        return;
      case stateObj.modal:
        if (this.state.modal) $dropDwon.classList.remove('blind');
        else $dropDwon.classList.add('blind');
        return;
      default:
        console.log('state name is not found');
    }
  };

  this.render();
}
export default Main;
