import { parsePrice } from '../lib/parsePrice';

function ChattingDetail({ app, back }) {
  let timeId;
  interface StateObj {
    user: string;
    modal: string;
    chatting: string;
    roomId: string;
  }
  const stateObj: StateObj = {
    user: 'user',
    modal: 'modal',
    chatting: 'chatting',
    roomId: 'roomId',
  };

  const $target = document.createElement('div');
  $target.className = 'chattingDetail slidein';
  $target.innerHTML = `
  <div class="top-bar off-white">
    <div>
      <div class="js-back icon icon-left"></div>
    </div>
    <div>
      <div class="id top-bar__text"></div>
    </div>
    <div>
      <div class="js-modal icon icon-logout"></div>
    </div>
  </div>
  <div class="chat-header">
    <div class="js-img img-box-small"></div>
    <div class="chat-header-text">
      <p class="title chat-list-item__name"></p>
      <p class="price chat-list-item__message"></p>
    </div>
    <div class="chat-list-item__content-right">
      <button class="btn-status">
        <span></span>
      </button>
    </div>
  </div>

  <div class="chat-inner">
    <div class="chat-itme you">안녕하세ㅛㅇ 궁금한게</div>
    <div class="chat-itme you">안녕하세ㅛㅇ 궁금한게</div>
    <div class="chat-itme me">응 안뇽</div>
  </div>

  <form>
    <div class="chat-bar">
      <input
        type="text"
        class="content input-medium"
        placeholder="메세지를 입력하세요."
      />
      <button type="submit" class="btn-chat-send empty">
        <div class=" icon icon-send"></div>
      </button>
    </div>
  </form>
  <div class="js-dropdown blind">
    <div class="popup popup-alert">
      <p class="popup--title">정말로 이 채팅방을 나가시겠습니까?</p>
      <div class="popup--btns">
        <button class="js-cancel popup--btn">취소</button>
        <button class="js-out popup--btn error">나가기</button>
      </div>
    </div>
  </div>

  `;
  // 엠티를 없애고 만들고 위에 send버튼

  const status = {
    0: '판매중',
    1: '예약중',
    2: '판매완료',
  };

  const $id = $target.querySelector('.id');
  const $img: HTMLLIElement = $target.querySelector('.js-img');
  const $title = $target.querySelector('.title');
  const $price = $target.querySelector('.price');
  const $btnStatus = $target.querySelector('.btn-status');
  const $btnStatusSpan = $btnStatus.querySelector('span');
  const $content: HTMLInputElement = $target.querySelector('.content');
  const $dropDown = $target.querySelector('.js-dropdown');
  const $chatInner = $target.querySelector('.chat-inner');

  $target.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const classList = target.classList;
    if (classList.contains('js-cancel')) {
      this.setState(stateObj.modal, false);
    } else if (classList.contains('js-out')) {
      // 나가기 fetch
      this.setState(stateObj.modal, false);
      back();
    } else if (classList.contains('js-modal')) {
      this.setState(stateObj.modal, true);
    }
  });

  $target.addEventListener('submit', (e) => {
    e.preventDefault();
    const content = $content.value;
    fetch(`/api/goods-chatting/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        roomId: this.state.roomId,
        content,
      }),
    })
      .then((res) => res.json())
      .then(({ message }) => {
        console.log(message);
        $content.value = '';
      })
      .catch((e) => {
        console.log(e);
      });
  });

  const makeChatInner = (content, tf) => {
    const $div = document.createElement('div');
    $div.className = 'chat-item';
    if (tf) $div.classList.add('me');
    else $div.classList.add('you');
    $div.textContent = content;
    return $div;
  };

  const getApi = (dbId, fn) => {
    fetch(`/api/goods-chatting/detail?roomId=${dbId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then(({ result, data, message }) => {
        console.log(message);
        if (result === 0) {
          console.log(data, '나중에 삭제');
          const price = parsePrice(data.price);
          $id.textContent = data.seller_id;
          $img.style.backgroundImage = `url(${data.thumbnail})`;
          $title.textContent = data.title;
          $btnStatusSpan.textContent = status[data.sale_state];
          $price.textContent = price;
          this.setState(stateObj.roomId, data.room_id);
          this.setState(stateObj.chatting, data.chattingList);
          fn();
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getChatting = () => {
    const loc = location.href.split('/');
    if (
      loc[loc.length - 1].slice(0, loc[loc.length - 1].indexOf('#')) !==
      'chattingDetail'
    )
      clearInterval(timeId);

    fetch(
      `/api/goods-chatting/detail?roomId=${this.state.roomId}&lastIndex=${
        this.state.chatting[this.state.chatting.length - 1] &&
        this.state.chatting[this.state.chatting.length - 1].id
      }`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
      .then((res) => res.json())
      .then(({ result, data, message }) => {
        console.log(message);
        if (result === 0) {
          if (data.chattingList.length) {
            const $fragment = document.createDocumentFragment();
            data.chattingList.forEach((v) => {
              const { user_id, content } = v;
              $fragment.appendChild(
                makeChatInner(content, user_id === this.state.user.id),
              );
            });
            $chatInner.appendChild($fragment);
          }
          this.state = {
            ...this.state,
            chatting: [...this.state.chatting, ...data.chattingList],
          };
          // this.setState(stateObj.chatting, data.chattingList);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  this.state = {
    user: undefined,
    modal: false,
    chatting: [],
    roomId: undefined,
  };

  this.setState = (nextStateName, nextState) => {
    this.state = { ...this.state, [nextStateName]: nextState };
    this.rerender(nextStateName);
  };

  this.render = (dbId) => {
    $chatInner.innerHTML = '';
    app.appendChild($target);
    getApi(dbId, () => setTimeout(() => $target.classList.add('slidein'), 0));
    timeId = setInterval(() => getChatting(), 500);
  };

  this.rerender = (changeStateName) => {
    console.log(changeStateName);
    switch (changeStateName) {
      case stateObj.user:
      case stateObj.roomId:
        return;
      case stateObj.modal:
        if (this.state.modal) $dropDown.classList.remove('blind');
        else $dropDown.classList.add('blind');
        return;
      case stateObj.chatting:
        const $fragment = document.createDocumentFragment();
        if (this.state.chatting) {
          this.state.chatting.forEach((v) => {
            const { user_id, content } = v;
            $fragment.appendChild(
              makeChatInner(content, user_id === this.state.user.id),
            );
          });
          $chatInner.appendChild($fragment);
        }
        return;
      default:
        console.log('state name is not found');
    }
  };
}
export default ChattingDetail;
