// goods안에 isWish, isAuthor
function Post({ app }) {
  interface StateObj {
    user: string;
    modal: string;
    tab: string;
    goods: string;
    own: string;
    isWish: string;
    isAuthor: string;
  }
  const stateObj: StateObj = {
    user: 'user',
    modal: 'modal',
    tab: 'tab',
    goods: 'goods',
    own: 'own',
    isWish: 'isWish',
    isAuthor: 'isAuthor',
  };

  const $target = document.createElement('div');
  $target.className = 'post';

  $target.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const classList = target.classList;
    this.setState(stateObj.modal, false);
    if (classList.contains('js-tab')) {
      this.setState(stateObj.tab, target.dataset.index);
    } else if (classList.contains('js-wish')) {
      // this.state.isWish 가 true이면 지우기 아니면 추가하기 fetch
      // this.setState(~~)
      //test
      // this.setState(stateObj.isWish, false);
    } else if (classList.contains('js-modal')) {
      this.setState(stateObj.modal, !this.state.modal);
    } else if (classList.contains('js-delete')) {
      // fetch delete
      // back
    }
  });

  const getApi = (dbId) => {
    // fetch(`/api/goods/${dbId}`, {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // })
    //   .then((res) => {
    //     if (res.ok || res.status === 409) return res.json();
    //   })
    //   .then(({ goods, error }) => {
    //     if (error) alert(error);
    //     else if (goods) {
    //       this.setState(stateObj.isWish, goods.isWish);
    //       this.setState(stateObj.isAuthor, goods.isAuthor);
    //       this.setState(stateObj.goods, goods);
    //     }
    //   })
    //   .catch((e) => {
    //     console.log(e);
    //   });

    //test
    const goods = {
      urls: [
        'http://localhost:9000/assets/left.svg?61fcb0929393162a8893332a3fff53de',
        'data:image/jpeg;base64,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',
      ],
      title: '롤러스케이트',
      content:
        '어린시절 추억의 향수를 아어린시절 추억의 향수를 아어린시절 추억의 향수를 아어린시절 추억의 향수를 아어린시절 추억의 향수를 아어린시절 추억의 향수를 아어린시절 추억의 향수를 아',
      category: '기타 중고물품',
      updated: '1일전',
      user_id: 'qwe',
      region: '관양동',
      wish_count: 1,
      view_count: 10,
      chatting_count: 2,
      myWish: true,
      id: '1',
      price: 10000,
      isWish: true,
      isAuthor: true,
    };
    this.setState(stateObj.goods, goods);
    this.setState(stateObj.isAuthor, goods.isAuthor);
    this.setState(stateObj.isWish, goods.isWish);
  };

  const makeHeader = () => {
    return `
    <div class="top-bar invisible">
      <div>
        <div class="js-back icon icon-left"></div>
      </div>
      <div></div>
      <div class="for-author"></div>
    </div>
    `;
  };

  const makeTab = (index) => {
    return `
    <li class="js-tab img-nav ${
      this.state.tab == index ? 'active' : ''
    }" data-index=${index}></li>
    `;
  };

  const makeInner = () => {
    const tab = this.state.goods.urls.map((_, i) => makeTab(i)).join('');
    const {
      urls,
      title,
      content,
      category,
      updated,
      user_id,
      region,
      wish_count,
      view_count,
      chatting_count,
      // id,
    } = this.state.goods;
    const price = this.state.goods.price
      ? this.state.goods.price.toLocaleString('ko-KR') + '원'
      : '가격미정';
    return `
    <div class="img-box-large">
    <img class="image" src="${urls[0]}" alt="이미지"/>
      <ul class="img-navigation">${tab}</ul>
    </div>
    <div class="goods-inner">
      <div class="goods-margin">
        <div class="title">${title}</div>
        <div class="sub">
          <div>${category}</div>
          <div>${updated}</div>
        </div>
        <div class="content">${content}</div>
        <div class="sub sub2">
          <div>채팅 ${chatting_count}</div>
          <div>관심 ${wish_count}</div>
          <div>조회 ${view_count}</div>
        </div>
        <div class="info-saler">
          <p class="info-saler__label">판매자 정보</p>
          <p class="info-saler__name">${user_id}</p>
          <p class="info-saler__region">${region}</p>
        </div>
      </div>
      <div class="product-bar">
        <div class="js-wish icon icon-heart"></div>
        <div class="separator"></div>
        <div class="product-bar__price">${price}</div>
        ${
          this.state.isAuthor
            ? '<button class="js-chatting#${id} render btn-medium">채팅 목록보기</button>'
            : '<button class="js-chattingDetail#${id} render btn-medium">문의하기</button>'
        }
      </div>
    </div>
    `;
  };

  this.state = {
    user: undefined,
    goods: undefined,
    tab: 0,
    isAuthor: undefined,
    isWish: undefined,
  };

  this.setState = (nextStateName, nextState) => {
    this.state = { ...this.state, [nextStateName]: nextState };
    console.log('post setstate', nextStateName, nextState, this.state);
    this.rerender(nextStateName);
  };

  this.render = (dbId) => {
    console.log('post render', dbId);
    getApi(dbId);
    setTimeout(() => $target.classList.add('slidein'), 0);
  };

  this.rerender = (changeStateName) => {
    switch (changeStateName) {
      case stateObj.isAuthor:
        const $forAuthor = $target.querySelector('.for-author');
        if (this.state.isAuthor)
          $forAuthor.innerHTML = `
          <div class="js-modal icon icon-more"></div>
          <ul class="drop-down-list blind">
          <li class="js-modify#${this.state.goods.id} render drop-down-item">수정하기</li>
          <li class="js-delete drop-down-item">삭제하기</li>
          </ul>`;
        return;
      case stateObj.isWish:
        const $wish = $target.querySelector('.js-wish');
        if (this.state.isWish) $wish.classList.add('active');
        else $wish.classList.remove('active');
        return;
      case stateObj.goods:
        $target.innerHTML = makeHeader() + makeInner();
        app.appendChild($target);
        return;
      case stateObj.modal:
        const $dropDown = $target.querySelector('.drop-down-list');
        if (this.state.modal) $dropDown.classList.remove('blind');
        else $dropDown.classList.add('blind');
        return;
      case stateObj.tab:
        const $tabNav = $target.querySelector('.img-navigation');
        const $img: HTMLImageElement = $target.querySelector('.image');
        $tabNav.innerHTML = this.state.goods.urls
          .map((_, i) => makeTab(i))
          .join('');
        $img.src = this.state.goods.urls[this.state.tab];
      default:
        console.log('state name is not found');
    }
  };
}
export default Post;
