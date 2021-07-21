// goods안에 isWish, isAuthor
function Post({ app, goMain }) {
  interface StateObj {
    user: string;
    modal: string;
    tab: string;
    goods: string;
    own: string;
    isWish: string;
    isAuthor: string;
    saleState: string;
    saleModal: string;
  }
  const stateObj: StateObj = {
    user: 'user',
    modal: 'modal',
    tab: 'tab',
    goods: 'goods',
    own: 'own',
    isWish: 'isWish',
    isAuthor: 'isAuthor',
    saleState: 'saleState',
    saleModal: 'saleModal',
  };
  const saleState = {
    0: '판매중',
    1: '예약중',
    2: '판매완료',
  };

  const $target = document.createElement('div');
  $target.className = 'post';

  const postIsWish = (type) => {
    fetch('/api/goods-wish', {
      method: type,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        goodsId: this.state.goods.id,
      }),
    })
      .then((res) => {
        if (res.ok || res.status === 409) return res.json();
      })
      .then(({ result, message, data }) => {
        console.log(message);
        if (result == 0) {
          // this.setState(stateObj.goods, {
          //   ...this.state.goods,
          //   wish_count: data.wish_count,
          // });
          this.setState(stateObj.isWish, !this.state.isWish);
        }
      });
  };

  $target.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const classList = target.classList;
    if (!classList.contains('js-modal') && this.state.modal)
      this.setState(stateObj.modal, false);
    if (classList.contains('js-tab')) {
      this.setState(stateObj.tab, target.dataset.index);
    } else if (classList.contains('js-wish')) {
      if (this.state.isWish) {
        postIsWish('DELETE');
      } else {
        postIsWish('POST');
      }
    } else if (classList.contains('js-modal')) {
      this.setState(stateObj.modal, !this.state.modal);
    } else if (classList.contains('js-delete')) {
      // fetch delete
      fetch('/api/goods', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goodsId: this.state.goods.id,
        }),
      })
        .then((res) => {
          if (res.ok || res.status === 409) return res.json();
        })
        .then(({ result, message }) => {
          console.log(message);
          if (result == 0) {
            console.log(message);
            goMain();
          }
        })
        .catch((e) => {
          console.error(e);
        });
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
          this.setState(stateObj.saleState, data.sale_state);
          fn();
        }
      })
      .catch((e) => {
        console.log(e);
      });
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
      category,
      content,
      created,
      region_name,
      title,
      user_id,
      view_count,
      wish_count,
    } = this.state.goods;
    const price =
      typeof this.state.goods.price === 'number'
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
        <div class="for-status"></div>
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

  const makeSaleList = (num) => {
    return `<li class="drop-down-item">${saleState[num]}</li>`;
  };

  this.state = {
    user: undefined,
    goods: undefined,
    tab: 0,
    isAuthor: undefined,
    isWish: undefined,
    saleState: undefined,
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
        const $forStatus = $target.querySelector('.for-status');
        if (this.state.isAuthor) {
          $forAuthor.innerHTML = `
          <div class="js-modal icon icon-more"></div>
          <ul class="drop-down-modal drop-down-list modal blind">
          <li class="js-modify#${this.state.goods.id} render drop-down-item">수정하기</li>
          <li class="js-delete drop-down-item">삭제하기</li>
          </ul>`;
          $forStatus.innerHTML = `
          <button class="btn-status">
            <span>${saleState[this.state.goods.sale_state]}</span>
            <div class="icon icon-down"></div>
          </button>
          <ul class="drop-down-sale drop-down-list blind"></ul>
          `;
        }
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
        const $dropDown = $target.querySelector('.drop-down-modal');
        if ($dropDown) {
          if (this.state.modal) $dropDown.classList.remove('blind');
          else $dropDown.classList.add('blind');
        }
        return;
      case stateObj.tab:
        const $tabNav = $target.querySelector('.img-navigation');
        const $img: HTMLImageElement = $target.querySelector('.image');
        $tabNav.innerHTML = this.state.goods.urls
          .map((_, i) => makeTab(i))
          .join('');
        $img.src = this.state.goods.urls[this.state.tab];
      case stateObj.saleState:
        const $dropDownSale = $target.querySelector('.drop-down-sale');
        if (this.state.isAuthor)
          $dropDownSale.innerHTML = [0, 1, 2]
            .map((v) => {
              if (v != this.state.saleState) return makeSaleList(v);
            })
            .join('');
        return;
      default:
        console.log('state name is not found');
    }
  };
}
export default Post;
