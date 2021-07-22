function Write({ app, goMain }) {
  interface StateObj {
    user: string;
    primaryRegion: string;
    urls: string;
    category: string;
    selectCategory: string;
    thumbnail: string;
    mode: string;
    id: string;
  }
  const stateObj: StateObj = {
    user: 'user',
    primaryRegion: 'primaryRegion',
    urls: 'urls',
    category: 'category',
    selectCategory: 'selectCategory',
    thumbnail: 'thumbnail',
    mode: 'mode',
    id: 'id',
  };
  const mode = {
    write: 'write',
    modify: 'modify',
  };

  const $target = document.createElement('div');
  $target.className = 'write';
  $target.innerHTML = `
  <div class="top-bar off-white">
    <div>
      <div class="js-back icon icon-left"></div>
    </div>
    <div>
      <div class="mode top-bar__text"></div>
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
  const $mode = $target.querySelector('.mode');

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
      <input class="input-file" type="file" multiple accept=".jpg, .png, .jpeg" name="file"/>
    </button>
    `;
  };

  const makeImgItem = (index, url) => {
    return `
    <div class="btn-img active" data-index="${index}" style="background-image:url(${url})">

      <div class="js-delete btn-img__close">
        <div class="icon icon-close"></div>
      </div>
    </div>
    `;
  };

  const priceValidation = (value) => {
    if (typeof value === 'number') return value;
    console.log(value);
    value = value.replace(/[^0-9]/g, '');
    value = value.slice(0, 9);
    if (value.length > 0)
      value = '₩ ' + parseInt(value).toLocaleString('ko-KR');
    return value;
  };

  const validation = (e) => {
    const target = e.target as HTMLInputElement;
    switch (target) {
      case $title:
        target.value = target.value.slice(0, 60);
        return;
      case $price:
        target.value = priceValidation(target.value);
        return;
    }
  };

  const resize = (obj) => {
    obj.style.height = '1px';
    obj.style.height = 12 + obj.scrollHeight + 'px';
  };

  const fetchSubmit = (
    type,
    regionId,
    categoryId,
    thumbnail,
    title,
    price,
    content,
    urls,
  ) => {
    const obj = {
      regionId,
      categoryId,
      thumbnail,
      title,
      price,
      content,
      urls,
    };
    if (type === 'PUT') obj['id'] = this.state.id;
    fetch(`/api/goods`, {
      method: `${type}`,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(obj),
    })
      .then((res) => res.json())
      .then(({ result, message }) => {
        if (message) console.log(message);
        if (result == 0) goMain();
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const getApi = (dbId) => {
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
        if (error) alert(error);
        else if (data) {
          this.setState(stateObj.id, data.id);
          this.setState(stateObj.urls, data.urls);
          this.setState(stateObj.selectCategory, data.category_id);
          const thumbnailIndex = data.urls.indexOf(data.thumbnail) + '';
          this.setState(stateObj.thumbnail, thumbnailIndex);
          this.setState(stateObj.mode, mode.modify);
          $title.value = data.title;
          $price.value = priceValidation(data.price);
          $content.value = data.content;
          // $imgInner.innerHTML = makeImgBtn(data.urls.length);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const onSumbit = (title, price, content) => {
    const thumbnail = this.state.urls[this.state.thumbnail];
    const regionId = this.state.user.region_id[this.state.primaryRegion];
    const { selectCategory: categoryId, urls } = this.state;
    if (this.state.mode === mode.write) {
      fetchSubmit(
        'POST',
        regionId,
        categoryId,
        thumbnail,
        title,
        price,
        content,
        urls,
      );
    } else {
      fetchSubmit(
        'PUT',
        regionId,
        categoryId,
        thumbnail,
        title,
        price,
        content,
        urls,
      );
    }
  };

  $target.addEventListener('input', validation);

  $imgInner.addEventListener('change', (e) => {
    const target = e.target as HTMLElement;
    const $inputFile: HTMLInputElement = $target.querySelector('.input-file');
    if (target.classList.contains('input-file')) {
      if ($inputFile.files.length + this.state.urls.length > 10) {
        alert('이미지를 10개 초과 등록할 수 없습니다');
        return;
      }
      const data = new FormData();
      for (const file of $inputFile.files) {
        data.append('file', file, file.name);
      }
      fetch('/api/goods-photo', {
        method: 'POST',
        headers: {},
        body: data,
      })
        .then((res) => res.json())
        .then(({ data }) => {
          this.setState(stateObj.urls, [...this.state.urls, ...data]);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  });

  $imgInner.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const insertClosest = target.closest('.js-insert-img');
    const deleteClosest = target.closest('.js-delete');
    const btnImg: HTMLElement | null = target.closest('.btn-img');
    const $inputFile: HTMLInputElement = $target.querySelector('.input-file');

    if (insertClosest) {
      $inputFile.click();
    } else if (deleteClosest) {
      const deleteIndex = deleteClosest.parentElement.dataset.index;
      const nextUrls = this.state.urls.slice();
      nextUrls.splice(deleteIndex, 1);
      this.setState(stateObj.urls, nextUrls);
      if (this.state.thumbnail == deleteIndex) {
        this.setState(stateObj.thumbnail, null);
      } else if (this.state.thumbnail > deleteIndex) {
        this.setState(stateObj.thumbnail, this.state.thumbnail - 1);
      }
    } else if (btnImg) {
      const index = btnImg.dataset.index;
      if (index != this.state.thumbnail)
        this.setState(stateObj.thumbnail, index);
    }
  });

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
    if (!title) alert('제목을 입력하세요');
    else if (!content) alert('내용을 입력하세요');
    else if (!this.state.selectCategory) alert('카테고리를 선택하세요');
    else if (this.state.urls.length === 0) alert('사진을 올려주세요');
    else if (!this.state.thumbnail) alert('썸네일을 선택하세요');
    else {
      onSumbit(title, price, content);
    }
  });

  $categoryInner.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const id = target.dataset.id;
    if (id != this.state.selectCategory)
      this.setState(stateObj.selectCategory, id);
  });

  this.state = {
    user: undefined,
    primaryRegion: undefined,
    urls: [],
    category: undefined,
    selectCategory: null,
    thumbnail: null,
    mode: undefined,
    id: undefined,
  };

  this.setState = (nextStateName, nextState) => {
    this.state = { ...this.state, [nextStateName]: nextState };
    this.rerender(nextStateName);
  };

  this.render = (dbId, modify) => {
    if (modify) {
      getApi(dbId);
    } else {
      $title.value = '';
      $price.value = '';
      $content.value = '';
      $imgInner.innerHTML = makeImgBtn(0);
      this.setState(stateObj.mode, mode.write);
    }
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
      case stateObj.urls:
        $imgInner.innerHTML =
          makeImgBtn(this.state.urls.length) +
          this.state.urls.map((v, i) => makeImgItem(i, v)).join('');
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
        [...$categoryInner.children].forEach((v) => {
          const target = v as HTMLElement;
          if (target.dataset.id == this.state.selectCategory)
            target.classList.add('active');
          else target.classList.remove('active');
        });
        return;
      case stateObj.mode:
        if (this.state.mode === mode.write) $mode.textContent = '글쓰기';
        else $mode.textContent = '업데이트';
        return;
      case stateObj.id:
        return;
      default:
        console.log('state name is not found');
    }
  };
}
export default Write;
