function Post({ app }) {
  interface StateObj {
    user: string;
    modal: string;
    tab: string;
    goods: string;
  }
  const stateObj: StateObj = {
    user: 'user',
    modal: 'modal',
    tab: 'tab',
    goods: 'goods',
  };

  const $target = document.createElement('div');
  $target.className = 'post';

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
        '/2',
      ],
      title: '롤러스케이트',
      content:
        '어린시절 추억의 향수를 아어린시절 추억의 향수를 아어린시절 추억의 향수를 아어린시절 추억의 향수를 아어린시절 추억의 향수를 아어린시절 추억의 향수를 아어린시절 추억의 향수를 아',
      category: '기타 중고물품',
      updated: '1일전',
      user_id: 'id',
      region: '관양동',
      wish_count: 1,
      view_count: 10,
      chatting_count: 2,
      myWish: true,
      id: 2,
      price: 10000,
    };
    this.setState(stateObj.goods, goods);
  };

  const makeHeader = () => {
    return `
    <div class="top-bar invisible">
      <div>
        <div class="js-back icon icon-left"></div>
      </div>
      <div></div>
      <div>
        ${
          this.state.user.id === this.state.goods.user_id
            ? '<div class="icon icon-more"></div>'
            : ''
        }
      </div>
    </div>
    `;
  };

  const makeTab = (index) => {
    return `
    <li class="img-nav ${this.state.tab == index && 'active'}"></li>
    `;
  };

  const makeInner = () => {
    const tab = this.state.goods.urls.map((_, i) => makeTab(i)).join('');
    // urls: [
    //   'http://localhost:9000/assets/left.svg?61fcb0929393162a8893332a3fff53de',
    //   '/2',
    // ],
    // title: '롤러스케이트',
    // content:
    //   '어린시절 추억의 향수를 아어린시절 추억의 향수를 아어린시절 추억의 향수를 아어린시절 추억의 향수를 아어린시절 추억의 향수를 아어린시절 추억의 향수를 아어린시절 추억의 향수를 아',
    // category: '기타 중고물품',
    // updated: '1일전',
    // user_id: 'id',
    // region: '관양동',
    // wish_count: 1,
    // view_count: 10,
    // chatting_count: 2,
    // myWish: true,
    // id: 2,
    // price: 10000,
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
      myWish,
      id,
    } = this.state.goods;
    const price = this.state.goods.price.toLocaleString('ko-KR') + '원';
    return `
    <div class="img-box-large">
      <img src="${urls[0]}" alt="이미지"/>
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
        <div class="icon icon-heart ${myWish && 'active'}"></div>
        <div class="separator"></div>
        <div class="product-bar__price">${price}</div>
        <button class="js-chattingDetail#${id} render btn-medium">문의하기</button>
      </div>
    </div>
    `;
  };

  // const $userId = $target.querySelector('.user-id');
  // const $logout = $target.querySelector('.js-logout');

  this.state = {
    user: undefined,
    goods: undefined,
    tab: 0,
  };

  this.setState = (nextStateName, nextState) => {
    this.state = { ...this.state, [nextStateName]: nextState };
    console.log('post', this.state);
    this.rerender(nextStateName);
  };

  this.render = (dbId) => {
    console.log('post render', dbId);
    getApi(dbId);
    setTimeout(() => $target.classList.add('slidein'), 0);
  };

  this.rerender = (changeStateName) => {
    switch (changeStateName) {
      case stateObj.user:
        return;
      case stateObj.goods:
        $target.innerHTML = makeHeader() + makeInner();
        app.appendChild($target);
        return;
      case stateObj.modal:
        return;
      case stateObj.tab:
        return;
      default:
        console.log('state name is not found');
    }
  };
}
export default Post;
