// 註冊「櫻」故事的角色與立繪
monogatari.characters({
  'sakura': {
    name: '櫻',
    color: '#ffb3c6',
    sprites: {
      normal: 'assets/stories/story_sakura/assets/sakura_normal.png',
      smile: 'assets/stories/story_sakura/assets/sakura_smile.png',
      blush: 'assets/stories/story_sakura/assets/sakura_blush.png',
      shock: 'assets/stories/story_sakura/assets/sakura_shock.png'
    }
  }
});

// 註冊故事劇情節點
monogatari.script({
  'Start': [
    'show scene assets/stories/story_sakura/assets/bg_school.jpg with fadeIn',
    'play music bgm_daily loop',
    '微風吹過校門口，飄落的粉色櫻花瓣灑滿了整條小徑。',
    'show character sakura smile at center with fadeIn animated character-idle',
    'sakura {{player.name}}！真的是你...好久不見！今天放學後有空嗎？',

    {
      'Choice': {
        'Option_A': {
          'Text': '有空啊，要一起去公園走走嗎？ (好感度 +10)',
          'Do': 'jump Route_Sakura_Park'
        },
        'Option_B': {
          'Text': '聊聊童年的往事吧。 (好感度 +5)',
          'Do': 'jump Route_Sakura_Talk'
        },
        'Option_C': {
          'Text': '抱歉，我今天還有社團活動。',
          'Do': 'jump Route_Solo_Home'
        }
      }
    }
  ],

  'Route_Sakura_Park': [
    'show character sakura blush at center',
    'sakura 太好了！那...那我們放學後在公園那棵大櫻花樹下見囉，{{player.nickname}}！',
    $ => {
      monogatari.storage().favorability += 10;
      monogatari.storage().flags.met_at_park = true;
    },
    'show scene assets/stories/story_sakura/assets/bg_sunset.jpg with fadeIn',
    '夕陽將天空染成金橙色，櫻站在大樹下等候著{{player.name}}。',
    'show character sakura blush at center animated character-idle',
    'sakura 其實...從很久以前開始，我就一直期待著能再次見到{{player.nickname}}...',
    'jump Ending_Evaluate'
  ],

  'Route_Sakura_Talk': [
    'show character sakura smile at center',
    'sakura 小時候我們經常在教室裡畫畫呢，真懷念～{{player.nickname}}當時畫得超棒的！',
    $ => {
      monogatari.storage().favorability += 5;
    },
    'show scene assets/stories/story_sakura/assets/bg_classroom.jpg with fadeIn',
    '兩人在放學後的教室裡聊得相當投機。',
    'jump Ending_Evaluate'
  ],

  'Route_Solo_Home': [
    'show character sakura shock at center',
    'sakura 這樣啊... 那好吧，{{player.name}}明天學校見囉！',
    $ => {
      monogatari.storage().favorability = 0;
    },
    '獨自一人走在回家的路上，感覺似乎錯過了些什麼。',
    'jump Ending_Evaluate'
  ],

  'Ending_Evaluate': [
    $ => {
      const fav = monogatari.storage().favorability;
      if (fav >= 10) {
        return 'jump Ending_Good';
      } else if (fav >= 5) {
        return 'jump Ending_Normal';
      } else {
        return 'jump Ending_Bad';
      }
    }
  ],

  'Ending_Good': [
    'show scene assets/stories/story_sakura/assets/cg_sakura_sunset.jpg with fadeIn',
    'sakura 其實...我一直都很喜歡{{player.name}}！請和我交往吧！',
    '恭喜通關：櫻 - 完美結局 (Perfect Ending)',
    $ => {
      // 解鎖全域 CG 記憶與紀錄通關
      unlockGlobalMemory('sakura_true_end');
      window.app.registerEndingCleared('story_sakura', 'Ending_Good');
    },
    'end'
  ],

  'Ending_Normal': [
    'show scene assets/stories/story_sakura/assets/bg_classroom.jpg with fadeIn',
    '普通的一天結束了，兩人的關係似乎更近了一步。',
    '通關：櫻 - 普通結局 (Normal Ending)',
    $ => {
      window.app.registerEndingCleared('story_sakura', 'Ending_Normal');
    },
    'end'
  ],

  'Ending_Bad': [
    '天色暗了下來，擦身而過的兩人未能傳達彼此的心意。',
    '通關：櫻 - 遺撼結局 (Bad Ending)',
    $ => {
      window.app.registerEndingCleared('story_sakura', 'Ending_Bad');
    },
    'end'
  ]
});
