const menuData = [
  {
    text: 'Home',
    icon: 'fas fa-home',
    link: 'pages/home.html'
  },
  {
    text: 'Games',
    icon: 'fas fa-gamepad',
    submenu: [
      {
        text: '弓箭射擊',
        link: 'games/arch.html'
      },
      {
        text: '水果合併',
        link: 'games/suika.html'
      },
      {
        text: '果汁合併',
        link: 'games/juice.html'
      }
    ]
  },
  {
    text: 'About',
    icon: 'fas fa-info-circle',
    link: 'pages/about.html'
  }
];