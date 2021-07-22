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
    price =
      typeof price === 'number'
        ? price.toLocaleString('ko-KR') + '원'
        : '가격미정';
    // console.log(created);
    // const [year, month, date] = created.slice(0, 10).split('-');
    // const [hour, minute] = created.slice(11).split(':');
    // console.log(year, month, date, hour, minute);
    // const now = new Date();
    // const year2 = now.getFullYear();
    // const month2 = now.getMonth();
    // const date2 = now.getDate();
    // const hour2 = now.getHours();
    // if(year==year2)

    const chatElm = chat_count
      ? `<div class="icon icon-message"></div><p>${chat_count}</p>`
      : '';
    const wishElm = wish_count
      ? `<div class="icon icon-heart"></div><p>${wish_count}</p>`
      : '';
    return `
    <div class="js-post#${id} render product-list-item">
      <div class="img-box-large" style="background-image:url(${thumbnail})">
      </div>
      <div class="product-list-item__content">
        <div class="js-wish  icon icon-heart product-list-item__heart ${
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

  this.getApi = (): void => {
    if (this.state.user && this.state.category && this.state.primaryRegion) {
      // /api/goods/list?regionId=3&lastIndex=13
      // 카테고리 추가하기
      fetch(
        `/api/goods/list?regionId=${
          this.state.user.region_id[this.state.primaryRegion]
        }${
          this.state.category.id > -1
            ? `&categoryId=${this.state.category.id}`
            : ''
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
    } else if (this.state.user === null) {
      $listItems.innerHTML =
        '<div class="need-login"><div>로그인해주세요!!!</div></div>';
    }
  };

  const postIsWish = (type, id) => {
    fetch('/api/goods-wish', {
      method: type,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        goodsId: id,
      }),
    })
      .then((res) => {
        if (res.ok || res.status === 409) return res.json();
      })
      .then(({ result, message, data }) => {
        console.log(message, data);
        if (result == 0) {
          const index = this.state.post.findIndex((post) => post.id == id);
          const changePost = Object.assign({}, this.state.post[index]);
          changePost.isWish = !changePost.isWish;
          changePost.wish_count = data.wish_count;
          console.log(data, data.wish_count);
          const nextPost = [
            ...this.state.post.slice(0, index),
            changePost,
            ...this.state.post.slice(index + 1),
          ];
          console.log(nextPost);
          this.setState(stateObj.post, nextPost);
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  $target.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const classList = target.classList;
    const renderClosest = target.closest('.render');
    if (classList.contains('js-wish')) {
      const closest = target.closest('.render');
      const id = closest.classList[0].slice(8);
      if (classList.contains('active')) {
        postIsWish('DELETE', id);
        // this.getApi();
        // classList.remove('active');
      } else {
        postIsWish('POST', id);
        // this.getApi();
        // classList.add('active');
      }
      e.stopPropagation();
    } else if (renderClosest && renderClosest.classList.contains('render')) {
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
        this.getApi();
        return;
      case stateObj.category:
        if (this.state.category) this.getApi();
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
        this.getApi();
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
