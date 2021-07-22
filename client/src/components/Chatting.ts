import { parseTime } from '../lib/parseTime';
function Chatting({ app, go, back }) {
  interface StateObj {
    user: string;
    chatting: string;
  }
  const stateObj: StateObj = {
    user: 'user',
    chatting: 'chatting',
  };

  const $target = document.createElement('div');
  $target.className = 'chatting slidein';
  $target.innerHTML = `
  <div class="top-bar off-white">
    <div>
      <div class="js-back icon icon-left"></div>
    </div>
    <div>
      <div class="id top-bar__text">채팅하기</div>
    </div>
    <div>
    </div>
  </div>
  <div class="chatting-inner">
    <div class="chat-list">
      <div class="chat-list-item">
        <div>
          <p class="chat-list-item__name">Title</p>
          <p class="chat-list-item__message">Message</p>
        </div>
        <div class="chat-list-item__content-right">
          <div class="chat-column">
            <p class="chat-list-item__info">Timestamp</p>
            <div class="chat-badge">9</div>
          </div>
          <div class="img-box-small"></div>
        </div>
      </div>
    </div>
  </div>
  `;

  const $chattingInner = $target.querySelector('.chatting-inner');

  const makeChat = (
    room_id,
    partner_id,
    last_content,
    last_created,
    chat_count,
    thumbnail,
  ) => {
    last_created = parseTime(last_created);
    return `
    <div class="js-chattingDetail${room_id} render chat-list">
      <div class="chat-list-item">
        <div>
          <p class="chat-list-item__name">${partner_id}</p>
          <p class="chat-list-item__message">${last_content}</p>
        </div>
        <div class="chat-list-item__content-right">
          <div class="chat-column">
            <p class="chat-list-item__info">1분전</p>
            <div class="chat-badge">${chat_count}</div>
          </div>
          <div class="img-box-small" style="background-image:url(${thumbnail})"></div>
        </div>
      </div>
    </div>
    `;
  };

  const getApi = (dbId, fn) => {
    fetch(`/api/goods-chatting?goodsId=${dbId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then(({ result, data, message }) => {
        console.log(message);
        if (result === 0) {
          console.log(data);
          this.setState(stateObj.chatting, data);
          fn();
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  this.state = {
    chatting: [],
  };

  this.setState = (nextStateName, nextState) => {
    this.state = { ...this.state, [nextStateName]: nextState };
    this.rerender(nextStateName);
  };

  this.render = (dbId) => {
    app.appendChild($target);
    getApi(dbId, () => setTimeout(() => $target.classList.add('slidein'), 0));
  };

  this.rerender = (changeStateName) => {
    switch (changeStateName) {
      case stateObj.chatting:
        $chattingInner.innerHTML = this.state.chatting.map(
          ({
            room_id,
            partner_id,
            last_content,
            last_created,
            chat_count,
            thumbnail,
          }) =>
            makeChat(
              room_id,
              partner_id,
              last_content,
              last_created,
              chat_count,
              thumbnail,
            ),
        );
        return;
      default:
        console.log('state name is not found');
    }
  };
}
export default Chatting;
