import './styles/App.scss';
import './styles/index.scss';
import Main from './components/Main';
import Category from './components/Category';
import Login from './components/Login';
import Account from './components/Account';
import Chatting from './components/Chatting';
import ChattingDetail from './components/ChattingDetail';
import Menu from './components/Menu';
import Post from './components/Post';
import Region from './components/Region';
import Write from './components/Write';
import Signup from './components/Signup';
interface ActionObj {
  go: string;
  back: string;
  goMain: string;
  goLogin: string;
  user: string;
  category: string;
  categoryList: string;
  primaryRegion: string;
  dbId: string;
}
interface RenderObj {
  login: string;
  account: string;
  signup: string;
  category: string;
  menu: string;
  write: string;
  post: string;
  chatting: string;
  chattingDetail: string;
  region: string;
  modify: string;
}
const actionObj: ActionObj = {
  go: 'go',
  back: 'back',
  goMain: 'goMain',
  goLogin: 'goLogin',
  user: 'user',
  category: 'category',
  categoryList: 'categoryList',
  primaryRegion: 'primaryRegion',
  dbId: 'dbId',
};
const renderObj: RenderObj = {
  login: 'login',
  account: 'account',
  signup: 'signup',
  category: 'category',
  menu: 'menu',
  write: 'write',
  post: 'post',
  chatting: 'chatting',
  chattingDetail: 'chattingDetail',
  region: 'region',
  modify: 'modify',
};
const AUTO = 'auto';
function App() {
  const app = document.querySelector('#app');
  app.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const classList = target.classList;
    const closest = target.closest('.render');
    if (classList.contains('js-back')) back();
    else if (closest) go(closest.classList[0].slice(3));
  });
  const go = (next: string): void => {
    document.querySelector('.loading').classList.add('active');
    setTimeout(
      () => document.querySelector('.loading').classList.remove('active'),
      600,
    );
    const nextDepth = [...this.state.depth, next];
    this.setState(actionObj.go, { ...this.state, depth: nextDepth });
  };
  const back = (): void => {
    document.querySelector('.loading').classList.add('active');
    setTimeout(
      () => document.querySelector('.loading').classList.remove('active'),
      600,
    );
    const nextDepth = this.state.depth.slice(0, this.state.depth.length - 1);
    this.setState(actionObj.back, { ...this.state, depth: nextDepth });
  };
  const goMain = (): void => {
    const nextDepth = [];
    this.setState(actionObj.goMain, { ...this.state, depth: nextDepth });
    main.getApi();
  };
  const goLogin = (): void => {
    alert('로그인해주세요');
    const nextDepth = [renderObj.login];
    this.setState(actionObj.goLogin, { ...this.state, depth: nextDepth });
  };
  const historyPush = (): void => {
    const nextUrl = this.state.depth.join('/') || '/';
    console.log(nextUrl);
    console.log(location.href);
    history.pushState('', '', nextUrl);
    console.log(location.href);
  };
  const userReRender = () => {
    this.setState(actionObj.user, { ...this.state });
  };
  const setCategory = (
    category: object,
    auto: string = null,
  ): object | void => {
    localStorage.setItem(actionObj.category, JSON.stringify(category));
    if (auto) return category;
    this.setState(actionObj.category, {
      ...this.state,
      category,
    });
  };
  const autoGetCategory = (): void => {
    const storageCategory = localStorage.getItem(actionObj.category);
    const category = storageCategory
      ? JSON.parse(storageCategory)
      : setCategory({ id: -1, category: '' }, AUTO);
    this.setState(actionObj.category, { ...this.state, category });
  };
  const setPrimaryRegion = (
    primaryRegion: string = '0',
    auto: string = null,
  ): string | void => {
    localStorage.setItem(actionObj.primaryRegion, primaryRegion);
    if (auto) return primaryRegion;
    this.setState(actionObj.primaryRegion, { ...this.state, primaryRegion });
  };
  const autoGetPrimaryRegion = (): void => {
    let primaryRegion =
      localStorage.getItem(actionObj.primaryRegion) ||
      setPrimaryRegion('0', AUTO);
    const num: number = +primaryRegion;
    if (!this.state.user.region[num]) {
      setPrimaryRegion('0');
      userReRender();
      return;
    }
    this.setState(actionObj.primaryRegion, { ...this.state, primaryRegion });
  };
  const authProcess = (user: string) => {
    this.setState(actionObj.user, { ...this.state, user });
    if (user) {
      autoGetCategory();
      autoGetPrimaryRegion();
    }
  };
  const autoLogin = (getUrl): void => {
    if (localStorage.getItem('user'))
      fetch('/api/auth', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          if (res.ok || res.status === 401) return res.json();
        })
        .then(({ user, error }) => {
          if (user) authProcess(user);
          if (error) console.log(error);
          if (getUrl) {
            getUrl();
          }
        })
        .catch((e) => {
          console.error(e);
        });
    else {
      authProcess(null);
      if (getUrl) {
        getUrl();
      }
    }
  };
  const main = new Main({ app, setPrimaryRegion });
  const login = new Login({
    app,
    back,
    authProcess,
  });
  const signup = new Signup({
    app,
    goMain,
  });
  const account = new Account({ app, back, authProcess });
  const category = new Category({
    app,
    setCategory,
    back,
  });
  const menu = new Menu({ app });
  const write = new Write({ app, goMain });
  const post = new Post({ app, goMain, go });
  const chatting = new Chatting({ app, go, back });
  const chattingDetail = new ChattingDetail({
    app,
    back,
  });
  const region = new Region({ app, setPrimaryRegion, autoLogin });
  this.state = {
    user: undefined,
    category: undefined,
    primaryRegion: undefined,
    depth: [],
  };
  this.setState = (action: string, nextState: any): any => {
    console.log('app setstate');
    this.state = nextState;
    switch (action) {
      case actionObj.go:
      case actionObj.back:
      case actionObj.goMain:
      case actionObj.goLogin:
        historyPush();
      case actionObj.user:
      case actionObj.category:
      case actionObj.primaryRegion:
        return this.render(action);
      default:
        console.log('action name is not found');
    }
  };
  this.render = (action: string): any => {
    console.log('app render', 'action: ', action, 'state: ', this.state);
    switch (action) {
      case actionObj.go:
        const lastDepth = this.state.depth[this.state.depth.length - 1];
        const idx = lastDepth.search(/\#/g);
        const name = idx === -1 ? lastDepth : lastDepth.slice(0, idx);
        const dbId = this.state.depth[this.state.depth.length - 1].slice(
          idx + 1,
        );
        // case문을 if문으로 바꿀까 고민중
        switch (name) {
          case renderObj.category:
            if (!this.state.user) return goLogin();
            return category.render();
          case renderObj.login:
            if (this.state.user) return goMain();
            return login.render();
          case renderObj.signup:
            if (this.state.user) return goMain();
            return signup.render();
          case renderObj.account:
            if (!this.state.user) return goLogin();
            return account.render();
          case renderObj.menu:
            if (!this.state.user) return goLogin();
            return menu.render();
          case renderObj.write:
            if (!this.state.user) return goLogin();
            return write.render();
          case renderObj.modify:
            if (!this.state.user) return goLogin();
            return write.render(dbId, renderObj.modify);
          case renderObj.post:
            if (!this.state.user) return goLogin();
            return post.render(dbId);
          case renderObj.chatting:
            if (!this.state.user) return goLogin();
            return chatting.render(dbId);
          case renderObj.chattingDetail:
            if (!this.state.user) return goLogin();
            return chattingDetail.render(dbId);
          case renderObj.region:
            if (!this.state.user) return goLogin();
            return region.render();
          default:
            goMain();
            return;
        }
      case actionObj.back:
        const lastChild = app.lastElementChild;
        lastChild.classList.remove('slidein');
        setTimeout(() => {
          lastChild.remove();
        }, 300);
        return;
      case actionObj.goMain:
        while (app.children.length !== 1) {
          app.children[1].remove();
        }
        return;
      case actionObj.goLogin:
        while (app.children.length !== 1) {
          app.children[1].remove();
        }
        login.render();
        return;
      case actionObj.user:
        main.setState(actionObj.user, this.state.user);
        login.setState(actionObj.user, this.state.user);
        account.setState(actionObj.user, this.state.user);
        region.setState(actionObj.user, this.state.user);
        write.setState(actionObj.user, this.state.user);
        chattingDetail.setState(actionObj.user, this.state.user);
        return;
      case actionObj.category:
        main.setState(actionObj.category, this.state.category);
        category.setState(actionObj.category, this.state.category);
        return;
      case actionObj.primaryRegion:
        main.setState(actionObj.primaryRegion, this.state.primaryRegion);
        region.setState(actionObj.primaryRegion, this.state.primaryRegion);
        write.setState(actionObj.primaryRegion, this.state.primaryRegion);
        return;
    }
  };
  const getCategory = () => {
    fetch('/api/category', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then(({ data, error }) => {
        if (error) alert(error);
        if (data) {
          category.setState(actionObj.categoryList, data);
          write.setState(actionObj.category, data);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const getUrl = () => {
    const href = location.href.slice(location.origin.length + 1);
    const parse = href.split('/');
    for (let i = 0; i < parse.length; i++) {
      if (app.children.length > i) go(parse[i]);
      else setTimeout(() => go(parse[i]), 400);
    }
  };

  const backChange = () => {
    window.onpopstate = (e) => {
      e.preventDefault();
      back();
    };
  };

  const init = (): void => {
    document.querySelector('.loading').classList.add('active-hard');
    setTimeout(
      () => document.querySelector('.loading').classList.remove('active-hard'),
      800,
    );
    getCategory();
    autoLogin(getUrl);
    backChange();
  };
  init();
}
new App();
