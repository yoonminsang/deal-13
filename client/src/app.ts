import './styles/App.scss';
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
import Signin from './components/Signin';

// action에 로그인 로그아웃 생각중
interface ActionObj {
  go: string;
  back: string;
}
interface RenderObj {
  login: string;
  account: string;
  signin: string;
  category: string;
  menu: string;
  write: string;
  post: string;
  chatting: string;
  chattingDetail: string;
  region: string;
}

const actionObj: ActionObj = {
  go: 'go',
  back: 'back',
};
const renderObj: RenderObj = {
  login: 'login',
  account: 'account',
  signin: 'signin',
  category: 'category',
  menu: 'menu',
  write: 'write',
  post: 'post',
  chatting: 'chatting',
  chattingDetail: 'chattingDetail',
  region: 'region',
};

function App() {
  const app = document.querySelector('#app');

  const go = (next: string): void => {
    const nextDepth = [...this.state.depth, next];
    this.setState(actionObj.go, { ...this.state, depth: nextDepth });
  };
  const back = (): void => {
    const nextDepth = this.state.depth.slice(0, this.state.depth.length - 1);
    this.setState(actionObj.back, { ...this.state, depth: nextDepth });
  };
  const goMain = (): void => {
    const nextDepth = [];
    this.setState(actionObj.go, { ...this.state, depth: nextDepth });
  };
  const historyPush = (): void => {
    const nextUrl = this.state.depth.join('/') || '/';
    history.pushState('', '', nextUrl);
  };

  this.state = {
    user: null,
    category: null,
    depth: [],
  };
  const main = new Main({ app, user: this.state.user, go });
  const login = new Login({ app, user: this.state.user, go, back });
  const signin = new Signin({ app, user: this.state.user, back, goMain });
  const account = new Account({ app, user: this.state.user, back, goMain });
  const category = new Category({ app, user: this.state.user, back });
  const menu = new Menu({ app, user: this.state.user, back });
  const write = new Write({ app, user: this.state.user, back, goMain });
  const post = new Post({ app, user: this.state.user, go, back });
  const chatting = new Chatting({ app, user: this.state.user, go, back });
  const chattingDetail = new ChattingDetail({
    app,
    user: this.state.user,
    back,
  });
  const region = new Region({ app, user: this.state.user, back });

  this.setState = (action: string, nextState: any) => {
    console.log(
      'setstate',
      'action:',
      action,
      'this.state: ',
      this.state,
      'nextstate: ',
      nextState,
    );
    this.state = nextState;
    switch (action) {
      case actionObj.go:
      case actionObj.back:
        historyPush();
        return this.render(action);
      //   case LOGIN:
      //   case LOGOUT:
      //   case USER:
      //     return;
    }
  };
  this.render = (action: string) => {
    console.log('render', action, this.state);
    switch (action) {
      case actionObj.go:
        const name = this.state.depth[this.state.depth.length - 1];
        switch (name) {
          case renderObj.category:
            return category.render();
          case renderObj.login:
            return login.render();
          case renderObj.signin:
            return signin.render();
          case renderObj.account:
            return account.render();
          case renderObj.menu:
            return menu.render();
          case renderObj.write:
            return write.render();
          case renderObj.post:
            return post.render();
          case renderObj.chatting:
            return chatting.render();
          case renderObj.chattingDetail:
            return chattingDetail.render();
          case renderObj.post:
            return post.render();
          case renderObj.region:
            return region.render();
          default:
            console.log('render name is not found');
            return;
        }
      case actionObj.back:
        const lastChild = app.lastElementChild;
        lastChild.classList.replace('slidein', 'slideout');
        setTimeout(() => {
          app.removeChild(lastChild);
        }, 500);
        return;
      default:
        main.render();
    }
  };
  this.render();
}

new App();
