import '../styles/Region.scss';
function Region({ app, back, setPrimaryRegion, autoLogin }) {
  interface StateObj {
    user: string;
    primaryRegion: string;
    modal: string;
  }
  const stateObj: StateObj = {
    user: 'user',
    primaryRegion: 'primaryRegion',
    modal: 'modal',
  };

  const $target = document.createElement('div');
  $target.className = 'region';
  $target.innerHTML = `
  <div class="top-bar off-white">
    <div>
      <div class="js-back icon icon-left"></div>
    </div>
    <div>
      <div class="top-bar__text">내 동네 설정하기</div>
    </div>
    <div></div>
  </div>
  <div class="region-inner">
    <div class="text">
      <p>지역은 최소 1개이상</p>
      <p>최대 2개까지 설정 가능해요.</p>
    </div>
    <div class="btn-inner">
      <button class="btn-location">
        <span>역삼동</span>
        <div class="icon icon-close"></div>
      </button>
      <button class="btn-location active">
        <span>역삼동</span>
        <div class="icon icon-close"></div>
      </button>
      <button class="btn-location noraml">
        <div class="icon icon-add"></div>
      </button>
    </div>
  </div>
  <div class="modal blind">
    <div class="popup popup-input">
      <form>
        <p class="popup--title">현재 위치를 입력하세요.</p>
        <input
          type="text"
          class="js-input input-medium"
          placeholder="시 구 제외, 동만 입력"
        />
        <div class="popup--btns">
          <button type="button" class="js-modal-cancel popup--btn">취소</button>
          <button type="submit" class="js-modal-confirm popup--btn">확인</button>
        </div>
      </form>
    </div>
  </div>
  `;

  const $btnInner = $target.querySelector('.btn-inner');
  const $modal = $target.querySelector('.modal');
  const $form = $modal.querySelector('form');
  const $input: HTMLInputElement = $form.querySelector('.js-input');

  const makeRegion = (region: string, index: number) => {
    return `
    <button class="region-${index} js-region btn-location">
      <span>${region}</span>
      <div class="icon icon-close"></div>
    </button> 
    `;
  };

  const makeAddBtn = () => {
    return `
    <button class="js-add btn-location noraml">
      <div class="icon icon-add"></div>
    </button>
    `;
  };

  $target.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const classList = target.classList;
    const regionClosest = target.closest('.js-region');
    const addClosest = target.closest('.js-add');
    if (classList.contains('js-back')) {
      back();
    } else if (classList.contains('icon-close')) {
      if (regionClosest.classList.contains('active')) {
        alert('현재 이용중인 동네는 삭제할 수 없습니다');
      } else {
        // 삭제
        const region = $input.value;
        fetch('/api/region/delete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            region,
          }),
        })
          .then((res) => {
            if (res.ok || res.status === 409) return res.json();
          })
          .then(({ text, error }) => {
            if (error) alert(error);
            else if (text) {
              console.log(text);
              autoLogin();
            }
          })
          .catch((e) => {
            console.log(e);
          });
      }
    } else if (regionClosest && !regionClosest.classList.contains('active')) {
      const index = target.classList[0].slice(7);
      setPrimaryRegion(index);
    } else if (addClosest) {
      this.setState(stateObj.modal, true);
    } else if (classList.contains('js-modal-cancel')) {
      this.setState(stateObj.modal, false);
    }
  });

  $modal.addEventListener('input', (e) => {
    const target = e.target as HTMLInputElement;
    target.value = target.value.replace(/[^ㄱ-ㅎ|ㅏ-ㅣ|가-힣0-9]/gi, '');
  });

  $form.addEventListener('submit', (e) => {
    e.preventDefault();
    const region = $input.value;
    if (!/동$/.test(region)) {
      alert('우리 동네를 확안하세요!!');
      $input.value = '';
    } else if (this.state.user.region[0] === region) {
      alert('이미 존재하는 지역입니다');
      $input.value = '';
    } else
      fetch('/api/region/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          region,
        }),
      })
        .then((res) => {
          if (res.ok || res.status === 409) return res.json();
        })
        .then(({ text, error }) => {
          if (error) alert(error);
          else if (text) {
            console.log(text);
            autoLogin();
          }
        })
        .catch((e) => {
          console.log(e);
        });
  });

  this.state = {
    user: undefined,
    primaryRegion: undefined,
    modal: false,
  };

  this.setState = (nextStateName, nextState) => {
    this.state = { ...this.state, [nextStateName]: nextState };
    this.rerender(nextStateName);
  };

  this.render = () => {
    app.appendChild($target);
    setTimeout(() => $target.classList.add('slidein'), 0);
  };

  this.rerender = (changeStateName) => {
    switch (changeStateName) {
      case stateObj.user:
        if (
          this.state.user &&
          this.state.user.region &&
          this.state.user.region[0]
        ) {
          if (this.state.user.region.length === 1) {
            $btnInner.innerHTML =
              this.state.user.region
                .map((region, i) => makeRegion(region, i))
                .join('') + makeAddBtn();
          } else {
            $btnInner.innerHTML = this.state.user.region
              .map((region, i) => makeRegion(region, i))
              .join('');
          }
          this.setState(stateObj.modal, false);
        }
        return;
      case stateObj.primaryRegion:
        if (this.state.primaryRegion) {
          const cls = `.region-${this.state.primaryRegion}`;
          const $primary = $target.querySelector(cls);
          $primary.classList.add('active');
        } else console.log('account primary rerender error');
        return;
      case stateObj.modal:
        if (this.state.modal) {
          $input.value = '';
          $modal.classList.remove('blind');
        } else {
          $modal.classList.add('blind');
        }
        return;
      default:
        console.log('state name is not found');
    }
  };
}
export default Region;
