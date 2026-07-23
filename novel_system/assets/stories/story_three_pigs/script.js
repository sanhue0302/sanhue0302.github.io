/**
 * 第一本書：《三隻小豬與大野狼》
 * 核心機制：選項影響磚頭數量 (brickCount)、防禦成功率與結局
 */

// 1. 註冊故事角色與立繪表情差分
monogatari.characters({
  'pig_brother': {
    name: '豬大哥',
    color: '#ffb3ba',
    sprites: {
      normal: 'assets/stories/story_three_pigs/assets/pig_brother_normal.png',
      scared: 'assets/stories/story_three_pigs/assets/pig_brother_scared.png'
    }
  },
  'pig_brick': {
    name: '豬小弟',
    color: '#ffdfba',
    sprites: {
      smile: 'assets/stories/story_three_pigs/assets/pig_brick_smile.png'
    }
  },
  'wolf': {
    name: '大野狼',
    color: '#baffc9',
    sprites: {
      angry: 'assets/stories/story_three_pigs/assets/wolf_angry.png'
    }
  }
});

// 2. 註冊劇情節點
monogatari.script({
  'Start': [
    // 初始化故事專屬儲存變數
    $ => {
      monogatari.storage().brickCount = 0; // 磚頭儲備數
      monogatari.storage().hasTrap = false; // 是否設置陷阱
    },

    'show scene assets/stories/story_three_pigs/assets/bg_forest.png with fadeIn',
    'play music bgm_daily loop',
    '旁白 在很久很久以前，有三隻小豬長大了，豬媽媽讓他們離開家獨立生活。',
    
    'show character pig_brother normal at center with fadeIn animated character-idle',
    'pig_brother 我決定用稻草隨便蓋一間屋子，這樣很快就可以去玩了！',
    'pig_brother 兄弟，你要怎麼蓋你的房子？',

    // 【第一個分支選擇】：決定起步基礎
    {
      'Choice': {
        'Option_Straw': {
          'Text': '跟大哥一樣，用稻草蓋（省時省力）',
          'Do': 'jump Choice_Straw'
        },
        'Option_Brick': {
          'Text': '勸說大哥，並一起認真搬磚頭蓋石屋（穩紮穩打）',
          'Do': 'jump Choice_Brick'
        }
      }
    }
  ],

  // 分支 A：草率蓋房
  'Choice_Straw': [
    'show character pig_brother normal at center',
    'pig_brother 太棒了！我們蓋完草屋後一起去打電玩吧！',
    '旁白 兩隻小豬很快就蓋好了草屋，開心地玩了一整天。',
    'jump Night_Event'
  ],

  // 分支 B：勤勞蓋房
  'Choice_Brick': [
    'show character pig_brick smile at center with fadeIn',
    'pig_brick 沒錯！穩固的石屋才能抵禦野狼！我也來幫忙搬磚頭！',
    $ => {
      // 增加關鍵變數
      monogatari.storage().brickCount += 10;
    },
    'pig_brother 雖然好累喔...但大家一起幫忙，磚頭屋終於蓋好囉！',
    'jump Night_Event'
  ],

  // 夜間事件：大野狼襲擊
  'Night_Event': [
    'show scene assets/stories/story_three_pigs/assets/bg_straw_house.png with fadeIn',
    'play music bgm_suspense loop',
    'show character pig_brother scared at center animated character-shocked',
    'pig_brother 不好了！大野狼來了！他正在門外敲門！',

    'show character wolf angry at right with fadeIn',
    'wolf 哼哼哼！小豬們快開門！不然我就吹個大風，把你們的房子吹倒！',

    // 【第二個分支選擇】：戰術對策
    {
      'Choice': {
        'Option_Run': {
          'Text': '不管三七二十一，往豬小弟的磚頭屋逃跑！',
          'Do': 'jump Route_Run_To_Brick'
        },
        'Option_Trap': {
          'Text': '在門口準備滾燙的大熱水設置陷阱！',
          'Do': 'jump Route_Prepare_Trap'
        }
      }
    }
  ],

  // 路線：直接逃跑
  'Route_Run_To_Brick': [
    'wolf 呼——呼——！',
    '旁白 大野狼用力一吹，稻草屋瞬間飛上了天！',
    'show character pig_brother scared at center',
    'pig_brother 快跑啊啊啊！！',
    'jump Ending_Evaluate'
  ],

  // 路線：設置陷阱
  'Route_Prepare_Trap': [
    'show character pig_brick smile at center',
    'pig_brick 趁大野狼在門外嗆聲，我們趕快在煙囪底下燒一鍋熱水！',
    $ => {
      monogatari.storage().hasTrap = true;
    },
    'jump Ending_Evaluate'
  ],

  // 【結局判定邏輯】
  'Ending_Evaluate': [
    'show scene assets/stories/story_three_pigs/assets/bg_brick_house.png with fadeIn',
    $ => {
      const bricks = monogatari.storage().brickCount;
      const trap = monogatari.storage().hasTrap;

      // 判定完美結局：勤勞蓋房 + 成功設下陷阱
      if (bricks >= 10 && trap) {
        return 'jump Ending_Good';
      } 
      // 判定普通結局：雖然逃到磚屋，但沒有主動反擊
      else if (bricks >= 10 || trap) {
        return 'jump Ending_Normal';
      } 
      // 壞結局：兩邊都沒做好準備
      else {
        return 'jump Ending_Bad';
      }
    }
  ],

  // 🌟 完美結局 (True / Good Ending)
  'Ending_Good': [
    'show character wolf angry at right',
    'wolf 可惡的房子太堅固吹不倒...我從煙囪爬進去！',
    '旁白 大野狼順著煙囪溜了下來，正好跌進了小豬們準備好的滾燙熱水鍋裡！',
    'wolf 哇啊啊啊！燙死我啦！',
    'hide character wolf with fadeOut',
    
    'show character pig_brick smile at center',
    'pig_brick 我們成功擊退大野狼了！這就是團結與勤勞的力量！',
    'show scene assets/stories/story_three_pigs/assets/cg_ending_good.png with fadeIn',
    '恭喜通關：三隻小豬 - 完美大勝利結局！',
    $ => {
      // 呼叫全域解鎖函數，將這張 CG 寫入主選單畫廊
      if (typeof unlockGlobalMemory === 'function') {
        unlockGlobalMemory('cg_three_pigs_good');
      }
      if (window.app && window.app.registerEndingCleared) {
        window.app.registerEndingCleared('story_three_pigs', 'Ending_Good');
      }
    },
    'end'
  ],

  // 🟢 普通結局 (Normal Ending)
  'Ending_Normal': [
    'wolf 吹不倒...咬不動...這間磚頭屋太堅固了啦！',
    'wolf 肚子好餓，算了，我去抓別的獵物！',
    'hide character wolf with fadeOut',
    'pig_brother 呼，雖然驚險，但總算是保住了性命呢。',
    '通關：普通結局 - 避難成功',
    $ => {
      if (window.app && window.app.registerEndingCleared) {
        window.app.registerEndingCleared('story_three_pigs', 'Ending_Normal');
      }
    },
    'end'
  ],

  // 🔴 壞結局 (Bad Ending)
  'Ending_Bad': [
    'wolf 哈哈哈！這房子蓋得一點都不紮實！吹一下就倒了！',
    'show character pig_brother scared at center',
    'pig_brother 救命啊！大野狼把我們通通抓走啦！',
    '通關：壞結局 - 被野狼吃掉',
    $ => {
      if (window.app && window.app.registerEndingCleared) {
        window.app.registerEndingCleared('story_three_pigs', 'Ending_Bad');
      }
    },
    'end'
  ]
});
