function Write({ app, goMain }) {
  interface StateObj {
    user: string;
    primaryRegion: string;
    url: string;
    category: string;
    selectCategory: string;
    thumbnail: string;
  }
  const stateObj: StateObj = {
    user: 'user',
    primaryRegion: 'primaryRegion',
    url: 'url',
    category: 'category',
    selectCategory: 'selectCategory',
    thumbnail: 'thumbnail',
  };

  const $target = document.createElement('div');
  $target.className = 'write';
  $target.innerHTML = `
  <div class="top-bar off-white">
    <div>
      <div class="js-back icon icon-left"></div>
    </div>
    <div>
      <div class="top-bar__text">글쓰기</div>
    </div>
    <div>
      <div class="js-btn-complete icon icon-check"></div>
    </div>
  </div>
  <div class="write-inner">
    <div class="inner img-inner"></div>
    <div class="inner">
      <input type="text" class="title input-text" placeholder="글 제목"/>
      <div class="caption">(필수) 카테고리를 선택해주세요.</div>
      <div class="category-inner"></div>
    </div>
    <div class="inner">
      <input type="text" class="price input-text" placeholder="₩ 가격(선택사항)"/>
    </div>
    <div class="inner">
      <textarea class="content input-text" placeholder="게시글 내용을 작성해주세요."></textarea>
    </div>
    <div class="location-bar">
      <div class="icon icon-pin"></div>
      <p class="location"></p>
    </div>
  </div>
  `;

  const $completeBtn = $target.querySelector('.js-btn-complete');
  const $title: HTMLInputElement = $target.querySelector('.title');
  const $price: HTMLInputElement = $target.querySelector('.price');
  const $content: HTMLTextAreaElement = $target.querySelector('.content');
  const $categoryInner = $target.querySelector('.category-inner');
  const $location: HTMLDivElement = $target.querySelector('.location');
  const $imgInner: HTMLDivElement = $target.querySelector('.img-inner');

  const makeCategoryItem = (id, name) => {
    return `
    <button class="btn-category" data-id="${id}">${name}</button>
    `;
  };

  const makeImgBtn = (count) => {
    return `
    <button class="js-insert-img btn-img">
      <div class="icon icon-image"></div>
      <p>${count}/10</p>
    </button>
    `;
  };

  const makeImgItem = (index, url) => {
    return `
    <div class="btn-img active" data-index="${index}">
      <img src="${url}"/>
      <div class="js-delete btn-img__close">
        <div class="icon icon-close"></div>
      </div>
    </div>
    `;
  };

  const validation = (e) => {
    const target = e.target as HTMLInputElement;
    switch (target) {
      case $title:
        target.value = target.value.slice(0, 60);
        return;
      case $price:
        target.value = target.value.replace(/[^0-9]/g, '');
        target.value = target.value.slice(0, 9);
        if (target.value.length > 0)
          target.value =
            '₩ ' + parseInt(target.value).toLocaleString('ko-KR') + '원';
        return;
    }
  };

  const resize = (obj) => {
    obj.style.height = '1px';
    obj.style.height = 12 + obj.scrollHeight + 'px';
  };

  const onSumbit = (title, price, content, region) => {
    console.log(
      title,
      this.state.selectCategory,
      price,
      content,
      region,
      this.state.url, // [{id,url}] 보낼때 id만
      this.state.thumbnail,
    );
    // 서버 받으면 fetch
  };

  $target.addEventListener('input', validation);

  $content.addEventListener('keyup', function () {
    resize(this);
  });

  $content.addEventListener('keydown', function () {
    resize(this);
  });

  $completeBtn.addEventListener('click', () => {
    const title = $title.value;
    const price = $price.value.replace(/[^0-9]/g, '');
    const content = $content.value;
    const region = this.state.user.region[this.state.primaryRegion];
    console.log(title, price, content, region);
    if (!title) alert('제목을 입력하세요');
    else if (!content) alert('내용을 입력하세요');
    else if (!this.state.selectCategory) alert('카테고리를 선택하세요');
    else if (this.state.url.length === 0) alert('사진을 올려주세요');
    else if (!this.state.thumbnail) alert('썸네일을 선택하세요');
    else {
      onSumbit(title, price, content, region);
    }
  });

  $imgInner.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const insertClosest = target.closest('.js-insert-img');
    const deleteClosest = target.closest('.js-delete');
    const btnImg: HTMLElement | null = target.closest('.btn-img');
    if (insertClosest) {
      console.log('파일 올리기 작업');
      // 그다음 setstae url
    } else if (deleteClosest) {
      const deleteIndex = deleteClosest.parentElement.dataset.index;
      console.log('fetfh 보내서 삭제');
      //
      // 그다음 state 변경
      const nextUrl = this.state.url.slice();
      nextUrl.splice(deleteIndex, 1);
      this.setState(stateObj.url, nextUrl);
      if (this.state.thumbnail == deleteIndex) {
        this.setState(stateObj.thumbnail, null);
      } else if (this.state.thumbnail > deleteIndex) {
        this.setState(stateObj.thumbnail, this.state.thumbnail - 1);
      }
    } else if (btnImg) {
      console.log(btnImg.dataset.index);
      const index = btnImg.dataset.index;
      if (index != this.state.thumbnail)
        this.setState(stateObj.thumbnail, index);
    }
  });

  $categoryInner.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const id = target.dataset.id;
    console.log(id);
    if (id != this.state.selectCategory)
      this.setState(stateObj.selectCategory, id);
  });

  this.state = {
    user: undefined,
    primaryRegion: undefined,
    url: [],
    category: undefined,
    selectCategory: null,
    thumbnail: null,
  };

  this.setState = (nextStateName, nextState) => {
    this.state = { ...this.state, [nextStateName]: nextState };
    this.rerender(nextStateName);
  };

  this.render = () => {
    $imgInner.innerHTML = makeImgBtn(this.state.url.length);
    app.appendChild($target);
    setTimeout(() => $target.classList.add('slidein'), 0);
  };

  // user랑 primaryRegion을 rerender를 계속하면 낭비인듯
  // 그냥 render될때만 불러오면 되는데
  this.rerender = (changeStateName) => {
    switch (changeStateName) {
      case stateObj.user:
      case stateObj.primaryRegion:
        if (this.state.user && this.state.primaryRegion)
          $location.textContent =
            this.state.user.region[this.state.primaryRegion];
        return;
      case stateObj.url:
        $imgInner.innerHTML =
          makeImgBtn(this.state.url.length) +
          this.state.url.map((v, i) => makeImgItem(i, v)).join('');
        return;
      case stateObj.category:
        $categoryInner.innerHTML = this.state.category
          .map(({ id, name }) => makeCategoryItem(id, name))
          .join('');
        return;
      case stateObj.thumbnail:
        $imgInner.querySelectorAll('div.btn-img').forEach((v) => {
          const target = v as HTMLElement;
          if (target.dataset.index == this.state.thumbnail)
            target.classList.replace('active', 'thumbnail');
          else target.classList.replace('thumbnail', 'active');
        });
        return;
      case stateObj.selectCategory:
        console.log('select render');
        [...$categoryInner.children].forEach((v) => {
          const target = v as HTMLElement;
          if (target.dataset.id == this.state.selectCategory)
            target.classList.add('active');
          else target.classList.remove('active');
        });
        return;
      default:
        console.log('state name is not found');
    }
  };
  // test
  // const testImg = ['/', '/', '/', '/'];
  // this.setState(stateObj.url, testImg);
}
export default Write;
