// import '../styles/menu.scss'
import { parsePrice } from '../lib/parsePrice';
import { parseTime } from '../lib/parseTime';
interface IProduct {
  id: number;
  title: string;
  region_name: string;
  created: string;
  price: number | string;
  thumbnail: string;
  chat_count?: number;
  wish_count?: number;
  isWish: boolean;
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

// const isBackButton = (e: MouseEvent) => {
//   const target = e.target as HTMLElement;
//   return target.classList.contains('js-back');
// };

function Menu({ app }) {
  this.state = {
    tap: 0,
    chatList: [],
    sellList: [] as IProduct[],
    wishList: [] as IProduct[],
  };

  const $target = document.createElement('div');

  const handleTap = (e: MouseEvent) => {
    e.preventDefault();
    const target = e.target as HTMLButtonElement;
    if (target.classList.contains('active')) return;
    const btns = document.querySelectorAll('.gnb-container .btn-tap');
    btns.forEach((btn, index) => {
      if (btn !== target) return btn.classList.remove('active');
      btn.classList.add('active');
      this.setState('tap', index);
    });
  };

  const rerenderMenuBody = () => {
    $target.querySelector('.product-list, .chat-list')?.remove();
    $target.insertAdjacentHTML('beforeend', createMenuBodyHandler());
  };

  const createMenuBodyHandler = () => {
    switch (this.state.tap) {
      case 0:
        return çreteSaleBody();
      case 1:
        return createChatBody();
      case 2:
        return createWishBody();
    }
  };

  const çreteSaleBody = (): string => {
    return (
      this.state.sellList.reduce(
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

  const createWishBody = (): string => {
    return (
      this.state.wishList.reduce(
        (acc, cur) => acc + createProductItem(cur, false),
        '<div class="product-list">',
      ) + '</div>'
    );
  };

  const getMenuItems = () => {
    fetch('/api/goods/menu', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => (res.ok || res.status === 401) && res.json())
      .then((data) => this.setState('', '', '1', data.data));
  };

  const createProductItem = (product: IProduct, sale: boolean): string => {
    let {
      id,
      thumbnail,
      title,
      region_name,
      price,
      chat_count,
      wish_count,
      isWish,
      created,
    } = product;
    price = parsePrice(price);
    created = parseTime(created);

    const chatElm = chat_count
      ? `<div class="icon icon-message"></div><p>${chat_count}</p>`
      : '';
    const wishElm = wish_count
      ? `<div class="icon icon-heart"></div><p>${wish_count}</p>`
      : '';
    return `
      <div class="js-post#${id} render product-list-item">
        <div class="img-box-large" style="background-image: url(${thumbnail})">
        </div>
        <div class="product-list-item__content">
          <div class="
            ${
              sale
                ? 'js-more icon icon-more product-list-item__heart'
                : 'js-wish icon icon-heart product-list-item__heart active'
            }
          " data-id="${id}">
          ${
            sale
              ? `<ul class="drop-down-list product-popup modal">
            <li class="js-modify#${id} render drop-down-item btn-product_edit">수정하기</li>
            <li class="js-delete drop-down-item btn-product_delete">삭제하기</li>`
              : ''
          }
            </ul>
          </div>
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
    if (target.classList.contains('js-wish')) {
      const id = Number(target.dataset.id);
      const value = this.state.wishList.filter((goods) => goods.id !== id);
      deleteWish(id, value);
    } else {
      togglePopup(target);
    }
  };

  const deleteWish = (id, nextWishList) => {
    console.log('next');
    console.log(nextWishList);
    fetch('/api/goods-wish', {
      method: 'DELETE',
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
      .then(({ result }) => {
        if (Number(result) === 0) {
          this.setState('wishList', nextWishList);
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const deleteProduct = () => {
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
        if (result == 0) {
          this.rerender();
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const togglePopup = (target: HTMLElement) => {
    $target.querySelector('.js-more')?.classList.remove('active');
    target.classList.add('active');
  };

  this.setState = (name, value, type = 'common', listObject) => {
    if (type === 'common') {
      this.state = {
        ...this.state,
        [name]: value,
      };
    } else {
      for (const key of Object.keys(listObject)) {
        if (listObject[key] === null) listObject[key] = [];
      }
      this.state = {
        ...this.state,
        ...listObject,
      };
    }
    console.log(this.state);
    this.rerender();
  };

  this.render = () => {
    $target.className = 'menu';
    $target.innerHTML = createHeader() + createGNB(this.state.tap);
    app.appendChild($target);
    getMenuItems();
    const gnbContainer: HTMLDivElement =
      document.querySelector('.gnb-container');
    gnbContainer?.addEventListener('click', (e) => handleTap(e));
    setTimeout(() => $target.classList.add('slidein'), 0);
  };

  this.rerender = rerenderMenuBody;
  $target.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const classList = target.classList;
    if (classList.contains('js-wish') || classList.contains('js-more')) {
      e.preventDefault();
      e.stopPropagation();
      return handleClickEvent(e);
    }

    $target.querySelector('.js-more.active')?.classList.remove('active');
    if (classList.contains('js-delete')) {
      e.preventDefault();
      e.stopPropagation();
      const closestTag = target.closest('.js-more') as HTMLElement;
      const goodsId = closestTag?.dataset?.id;
      if (!goodsId) return;
      // fetch delete
      fetch('/api/goods', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goodsId,
        }),
      })
        .then((res) => {
          if (res.ok || res.status === 409) return res.json();
        })
        .then(({ result, message }) => {
          if (result == 0) {
            getMenuItems();
          }
        })
        .catch((e) => {
          console.error(e);
        });
    }
  });
}
export default Menu;
