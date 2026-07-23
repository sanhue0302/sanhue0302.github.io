// 註冊「凜」故事的角色與立繪
monogatari.characters({
  'rin': {
    name: '凜',
    color: '#818cf8',
    sprites: {
      normal: 'assets/stories/story_rin/assets/rin_normal.png',
      proud: 'assets/stories/story_rin/assets/rin_proud.png',
      blush: 'assets/stories/story_rin/assets/rin_blush.png',
      surprised: 'assets/stories/story_rin/assets/rin_surprised.png'
    }
  }
});

// 註冊故事劇情節點
monogatari.script({
  'Start': [
    $ => {
      // 1. 初始化全名與小名的儲存變數 (若未輸入，預設值)
      monogatari.storage({
        player_fullname: '張小明',    // 主角全名預設值
        player_nickname: '小明',      // 主角小名預設值
        heroine_fullname: '櫻木花子',  // 女主角全名預設值
        heroine_nickname: '花花'       // 女主角小名預設值
      });
    },

    'show scene assets/stories/story_rin/assets/bg_council.jpg with fadeIn',
    '旁白 在開學前夕，請確認或調整本章節主角與女主角的姓名。',

    // 2. 互動式輸入引導 (可跳過直接使用預設值)
    {
      'Input': {
        'Text': '請輸入你的主角全名：',
        'Storage': 'player_fullname',
        'Default': '張小明'
      }
    },
    {
      'Input': {
        'Text': '請輸入你的主角小名 / 暱稱：',
        'Storage': 'player_nickname',
        'Default': '小明'
      }
    },
    {
      'Input': {
        'Text': '請輸入女主角的全名：',
        'Storage': 'heroine_fullname',
        'Default': '櫻木花子'
      }
    },
    {
      'Input': {
        'Text': '請輸入女主角的小名 / 暱稱：',
        'Storage': 'heroine_nickname',
        'Default': '花花'
      }
    },

    '放學後的學生會室裡，只有紙張翻閱的沙沙聲。',
    'show character rin proud at center with fadeIn animated character-idle',
    'rin 你終於來了，{{player.name}}。作為學生會輔導對象，今天可不能偷懶！',
    'rin 順便自我介紹一下，我是學生會長{{heroine_fullname}}，熟人通常都叫我{{heroine_nickname}}！',

    {
      'Choice': {
        'Option_A': {
          'Text': '認真聽{{heroine_nickname}}指導功課。 (好感度 +15)',
          'Do': 'jump Route_Rin_Study'
        },
        'Option_B': {
          'Text': '邀{{heroine_nickname}}去頂樓露臺吹吹風。 (好感度 +8)',
          'Do': 'jump Route_Rin_Balcony'
        },
        'Option_C': {
          'Text': '敷衍過去，想早點回家。',
          'Do': 'jump Route_Rin_Lazy'
        }
      }
    }
  ],

  'Route_Rin_Study': [
    'show character rin surprised at center',
    'rin 沒想到{{player_nickname}}你居然這麼配合... 咳、那、那我就好好教你這幾道數學題吧！',
    $ => {
      monogatari.storage().favorability += 15;
      monogatari.storage().flags.study_hard = true;
    },
    'show scene assets/stories/story_rin/assets/bg_library.jpg with fadeIn',
    '轉眼夜幕低垂，兩人在安靜的圖書館完成了長達兩小時的特訓。',
    'show character rin blush at center animated character-idle',
    'rin 哼，表現得還算勉強合格啦... {{player_nickname}}，下次如果還有不懂的，我可以破例再教你一次。',
    'jump Ending_Evaluate'
  ],

  'Route_Rin_Balcony': [
    'show character rin blush at center',
    'rin 露臺？...好吧，既然是{{player_fullname}}你提出來的，就稍微休息十分鐘。',
    $ => {
      monogatari.storage().favorability += 8;
    },
    'show scene assets/stories/story_rin/assets/bg_balcony.jpg with fadeIn',
    '夜風撫過兩人的髮絲，露臺上的皎潔月光分外溫柔。',
    'jump Ending_Evaluate'
  ],

  'Route_Rin_Lazy': [
    'show character rin proud at center',
    'rin {{player_fullname}}真是沒救了！今天訓練到此結束，你現在可以回去了！',
    $ => {
      monogatari.storage().favorability = 0;
    },
    '{{heroine_nickname}}有些失望地轉過身去繼續整理文件。',
    'jump Ending_Evaluate'
  ],

  'Ending_Evaluate': [
    $ => {
      const fav = monogatari.storage().favorability;
      if (fav >= 15) {
        return 'jump Ending_Good';
      } else if (fav >= 8) {
        return 'jump Ending_Normal';
      } else {
        return 'jump Ending_Bad';
      }
    }
  ],

  'Ending_Good': [
    'show scene assets/stories/story_rin/assets/cg_rin_starry.jpg with fadeIn',
    'rin 其實...只有在{{player_nickname}}面前，我才不想強裝堅強...約好了，以後也要一直在我身邊喔！',
    '恭喜通關：{{heroine_nickname}} - 真愛結局 (True Ending)',
    $ => {
      // 解鎖全域 CG 記憶與紀錄通關
      unlockGlobalMemory('rin_true_end');
      window.app.registerEndingCleared('story_rin', 'Ending_Good');
    },
    'end'
  ],

  'Ending_Normal': [
    'show scene assets/stories/story_rin/assets/bg_balcony.jpg with fadeIn',
    '星空下的約定，成為了{{player_fullname}}與{{heroine_nickname}}之間秘密的記憶。',
    '通關：{{heroine_nickname}} - 普通結局 (Normal Ending)',
    $ => {
      window.app.registerEndingCleared('story_rin', 'Ending_Normal');
    },
    'end'
  ],

  'Ending_Bad': [
    '會長依然高冷繁忙，兩人的距離似乎未曾拉近。',
    '通關：{{heroine_nickname}} - 疏離結局 (Bad Ending)',
    $ => {
      window.app.registerEndingCleared('story_rin', 'Ending_Bad');
    },
    'end'
  ]
});
