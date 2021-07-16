// import '../styles/menu.scss'

interface IProduct {
  id: number;
  name: string;
  region: string;
  time: string;
  price: string;
  chat: number;
  heart: boolean;
  url: string;
}

interface IChat {
  id: number;
  name: string;
  time: string;
  message: string;
  url: string;
  chatCount: number;
}

const createHeader = (): string => {
  return `
  <div class="top-bar off-white">
  <div>
    <div class="icon icon-left js-back"></div>
  </div>
  <div>
    <div class="top-bar__text">메뉴</div>
  </div>
  <div>
    <div class="icon"></div>
  </div>
</div>`;
};

const createGNB = (index: number): string => {
  return `
    <div class="gnb-container">
      <button class="btn-tap ${index === 0 ? 'active' : ''}">판매목록</button>
      <button class="btn-tap ${index === 1 ? 'active' : ''}">채팅</button>
      <button class="btn-tap ${index === 2 ? 'active' : ''}">관심목록</button>
    </div>
    `;
};

const tmpProductList = [
  {
    id: 0,
    name: '다용도 캐비넷',
    region: '역삼동',
    time: '방금 전',
    price: '15,000원',
    chat: 3,
    heart: false,
    url: '',
  },
  {
    id: 1,
    name: '여행용 치약 칫솔 세트',
    region: '방이동',
    time: '1일 전',
    price: '0원',
    chat: 0,
    heart: true,
    url: '',
  },
  {
    id: 2,
    name: '버거킹 와퍼 기프티콘',
    region: '법정동',
    time: '1일 전',
    price: '3,000원',
    chat: 4,
    heart: true,
    url: '',
  },
  {
    id: 3,
    name: '롯데타워 아쿠아리움 연간 회원권',
    region: '등촌동',
    time: '3일 전',
    price: '80,000원',
    chat: 11,
    heart: true,
    url: '',
  },
];

const tmpChatList: IChat[] = [
  {
    id: 0,
    name: 'User A',
    message: '혹시 팔렸나요?',
    time: '15분 전',
    url: '',
    chatCount: 5,
  },
  {
    id: 1,
    name: 'User B',
    message: '내일 오후 2시 어떠신가요?!',
    time: '2시간 전',
    url: '',
    chatCount: 2,
  },
  {
    id: 2,
    name: 'User C',
    message: '쿨거래 감사합니다~!',
    time: '3일 전',
    url: '',
    chatCount: 0,
  },
];

const isBackButton = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  return target.classList.contains('js-back');
};

function Menu({ app, user, back }) {
  this.state = {
    tap: 0,
    chatList: tmpChatList,
    productList: tmpProductList,
  };

  const $target = document.createElement('div');

  const handleTap = (e: MouseEvent) => {
    e.preventDefault();
    const target = e.target as HTMLButtonElement;
    if (target.classList.contains('active')) return;
    const btns = document.querySelectorAll('.gnb-container .btn-tap');
    console.log(btns);
    btns.forEach((btn, index) => {
      if (btn !== target) return btn.classList.remove('active');
      btn.classList.add('active');
      this.setState('tap', index);
    });
  };

  const rerenderMenuBody = () => {
    document.querySelector('.product-list, .chat-list')?.remove();
    $target.insertAdjacentHTML('beforeend', createMenuBodyHandler());
  };

  const createMenuBodyHandler = () => {
    switch (this.state.tap) {
      case 0:
        return çreteSaleBody();
      case 1:
        return createChatBody();
      case 2:
        return createHeartBody();
    }
  };

  const çreteSaleBody = (): string => {
    return (
      tmpProductList.reduce(
        (acc, cur) => acc + createProductItem(cur, true),
        '<div class="product-list">',
      ) + '</div>'
    );
  };

  const createChatBody = (): string => {
    return (
      this.state.chatList.reduce(
        (acc, cur) => acc + createChatItem(cur),
        '<div class="chat-list">',
      ) + '</div>'
    );
  };

  const createHeartBody = (): string => {
    return (
      this.state.productList.reduce(
        (acc, cur) => (cur.heart ? acc + createProductItem(cur, false) : acc),
        '<div class="product-list">',
      ) + '</div>'
    );
  };

  const createProductItem = (product: IProduct, sale: boolean): string => {
    return `
      <div class="product-list-item">
        <div class="img-box-large"></div>
        <div class="product-list-item__content">
          <div class="icon ${
            sale ? 'icon-more' : 'icon-heart'
          } product-list-item__heart active"></div>
          <p class="product-list-item__title">${product.name}</p>
          <p class="product-list-item__info">${product.region} - ${
      product.time
    }</p>
          <p class="product-list-item__price">${product.price}</p>
          <div class="product-list-item__bottom">
            <div class="icon icon-message"></div>
            <p>${product.chat ? product.chat : ''}</p>
          </div>
        </div>
      </div>
    `;
  };

  const createChatItem = (chat: IChat): string => {
    return `
    <div class="chat-list-item">
      <div>
        <p class="chat-list-item__name">${chat.name}</p>
        <p class="chat-list-item__message">${chat.message}</p>
      </div>
      <div class="chat-list-item__content-right">
        <div class="chat-list-item__info">
          <p class="chat-list-item__time">${chat.time}</p>
          ${
            chat.chatCount
              ? '<div class="chat-badge">' + chat.chatCount + '</div>'
              : ''
          }
        </div>
        <div class="img-box-small"></div>
      </div>
    </div>
    `;
  };

  const handleClickEvent = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('icon-heart')) {
      const name = target.nextElementSibling.textContent;
      const value = this.state.productList.filter(
        (product) => product.name !== name,
      );
      this.setState('productList', value);
    } else if (target.classList.contains('icon-more')) {
      createPopup(target);
    }
  };

  const createPopup = (target: HTMLElement) => {
    const output = `
      <ul class="drop-down-list product-popup">
        <li class="drop-down-item btn-product_edit">수정하기</li>
        <li class="drop-down-item btn-product_delete">삭제하기</li>
      </ul>
    `;
  };

  this.setState = (name, value) => {
    this.state = {
      ...this.state,
      [name]: value,
    };
    this.rerender();
  };

  this.render = () => {
    $target.className = 'menu slidein';
    $target.innerHTML = createHeader() + createGNB(this.state.tap);
    $target.classList.replace('slideout', 'slidein');
    app.appendChild($target);
    rerenderMenuBody();
    const gnbContainer: HTMLDivElement =
      document.querySelector('.gnb-container');
    gnbContainer?.addEventListener('click', (e) => handleTap(e));
  };

  this.rerender = rerenderMenuBody;
  $target.addEventListener('click', (e) => {
    if (isBackButton(e) && back()) {
      return;
    }
    handleClickEvent(e);
    this.rerender();
  });
}
export default Menu;
