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
    sale: string;
  }
  const stateObj: StateObj = {
    user: 'user',
    modal: 'modal',
    tab: 'tab',
    goods: 'goods',
    own: 'own',
    isWish: 'isWish',
    isAuthor: 'isAuthor',
    sale: 'sale',
  };
  const saleState = {
    0: '판매중',
    1: '예약중',
    2: '판매완료',
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

  const getApi = (dbId, fn) => {
    fetch(`/api/goods/detail?goodsId=${dbId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.ok || res.status === 409) return res.json();
      })
      .then(({ data, error }) => {
        console.log('post get api', data);
        if (error) alert(error);
        else if (data) {
          this.setState(stateObj.goods, data);
          this.setState(stateObj.isWish, data.isWish);
          this.setState(stateObj.isAuthor, data.isAuthor);
          fn();
        }
      })
      .catch((e) => {
        console.log(e);
      });

    //test
    // const goods = {
    //   urls: [
    //     'http://localhost:9000/assets/left.svg?61fcb0929393162a8893332a3fff53de',
    //   ],
    //   title: '롤러스케이트',
    //   content:
    //     '어린시절 추억의 향수를 아어린시절 추억의 향수를 아어린시절 추억의 향수를 아어린시절 추억의 향수를 아어린시절 추억의 향수를 아어린시절 추억의 향수를 아어린시절 추억의 향수를 아',
    //   category: '기타 중고물품',
    //   created: '1일전',
    //   user_id: 'qwe',
    //   region_name: '관양동',
    //   wish_count: 1,
    //   view_count: 10,
    //   chatting_count: 2,
    //   myWish: true,
    //   id: '1',
    //   price: 10000,
    //   isWish: true,
    //   isAuthor: true,
    //   sale_state: 0,
    // };
    // this.setState(stateObj.goods, goods);
    // this.setState(stateObj.isAuthor, goods.isAuthor);
    // this.setState(stateObj.isWish, goods.isWish);
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
    const urls = this.state.goods.urls;
    const tab = urls.map((_, i) => makeTab(i)).join('');
    const {
      // urls,
      // title,
      // content,
      // category,
      // updated,
      // user_id,
      // region,
      // wish_count,
      // view_count,
      // chatting_count,
      // // id,
      category,
      content,
      created,
      region_name,
      sale_state,
      title,
      user_id,
      view_count,
      wish_count,
    } = this.state.goods;
    const price = this.state.goods.price
      ? this.state.goods.price.toLocaleString('ko-KR') + '원'
      : '가격미정';
    const chatting_count = 0; // 임시

    return `
    <div class="img-box-large">
    <img class="image" src="${urls[0]}" alt="이미지"/>
      <ul class="img-navigation">${tab}</ul>
    </div>
    <div class="goods-inner">
      <div class="goods-margin">
        <button class="btn-status">
          <span>${saleState[sale_state]}</span>
          <div class="icon icon-down"></div>
        </button>
        <div class="title">${title}</div>
        <div class="sub">
          <div>${category}</div>
          <div>${created}</div>
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
          <p class="info-saler__region">${region_name}</p>
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
    getApi(dbId, () => setTimeout(() => $target.classList.add('slidein'), 0));
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
