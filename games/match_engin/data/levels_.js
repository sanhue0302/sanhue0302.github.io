const LEVELS = [
  {
    id: 1,
    title: '1-1：填寫新人資料',
    bossName: '人事行政阿姨',
    bossAvatar: '👩‍💼',
    bossHp: 50,
    bossAtk: 1,
    bossMaxTimer: 5,
    gridRows: 4,
    gridCols: 4,
    layout: [ '1111', '1111', '1111', '1111' ],
    allowedBlocks: [ 'MAIL', 'PPT', 'TEA' ],
    dialogues: {
      start: [
        {
          name: '人事阿姨',
          avatar: '👩‍💼',
          text: '快把這疊表格填一填！字寫端正點，別耽誤我團購水餃的時間！'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '呃，好的……（天啊，這表格居然要連我小學得過什麼獎都寫？）'
        }
      ],
      win: [
        {
          name: '人事阿姨',
          avatar: '👩‍💼',
          text: '哼，手腳還算挺快的嘛。拿去，這是你的識別證，別弄丟了。'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '謝謝阿姨！那我接下來該……（阿姨已經轉過去看水餃網頁了）。'
        }
      ]
    }
  },
  {
    id: 2,
    title: '1-2：壞掉的影印機',
    bossName: '卡紙怪獸',
    bossAvatar: '👾',
    bossHp: 100,
    bossAtk: 5,
    bossMaxTimer: 4,
    gridRows: 5,
    gridCols: 5,
    layout: [ '11111', '11111', '11111', '11111', '11111' ],
    allowedBlocks: [ 'MAIL', 'PPT', 'TEA' ],
    dialogues: {
      start: [
        {
          name: '直屬小組長',
          avatar: '😤',
          text: '新人，把這疊規格書印 50 份，半小時後開會要用。'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '沒問題！……等一下，這台影印機怎麼在冒煙？而且發出『卡卡卡』的聲音？！'
        }
      ],
      win: [
        { name: '主角', avatar: '🧑‍💻', text: '哈……哈……終於印好了，差點被碳粉噴滿臉。' },
        {
          name: '影印機',
          avatar: '👤',
          text: '（吐出最後一張紙，發出虛弱的逼逼聲後徹底死機……）'
        }
      ]
    }
  },
  {
    id: 3,
    title: '1-3：認清座位環境',
    bossName: '堆積如山的文件夾',
    bossAvatar: '📁',
    bossHp: 150,
    bossAtk: 8,
    bossMaxTimer: 4,
    gridRows: 5,
    gridCols: 5,
    layout: [ '11111', '11111', '11111', '11111', '11111' ],
    allowedBlocks: [ 'MAIL', 'PPT', 'TEA' ],
    dialogues: {
      start: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '這……這真的是我的辦公桌嗎？為什麼堆滿了前任員工留下來的陳年合約？'
        },
        {
          name: '隔壁棚老鳥',
          avatar: '👴',
          text: '哎呀新人，別介意，前任走得急。你不把那些移開，你連滑鼠都沒地方放喔，呵呵。'
        }
      ],
      win: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '（把合約排得整整齊齊）呼，總算看到桌面的大理石紋路了。不過……前任到底為什麼走得那麼急？'
        }
      ]
    }
  },
  {
    id: 4,
    title: '1-4：幫大家訂下午茶',
    bossName: '選擇困難的同事們',
    bossAvatar: '🤔',
    bossHp: 200,
    bossAtk: 10,
    bossMaxTimer: 5,
    gridRows: 6,
    gridCols: 6,
    layout: [ '111111', '111111', '111111', '111111', '111111', '111111' ],
    allowedBlocks: [ 'MAIL', 'PPT', 'TEA' ],
    dialogues: {
      start: [
        {
          name: '前輩 A',
          avatar: '👨‍💼',
          text: '新人，幫忙訂手搖飲！我要微糖微冰，啊不，改成無糖去冰！'
        },
        {
          name: '前輩 B',
          avatar: '👨‍💼',
          text: '幫我點加椰果的奶茶，糖度要固定，如果不行的話換布丁，謝謝喔～'
        },
        { name: '主角', avatar: '🧑‍💻', text: '等一下，每個人都要改，我拿筆記都快來不及了！' }
      ],
      win: [
        {
          name: '前輩 A',
          avatar: '👨‍💼',
          text: '哎呀，我剛剛說去冰，你怎麼還是幫我點微冰？算了啦，新人就是這樣。'
        },
        { name: '主角', avatar: '🧑‍💻', text: '（手握拳頭）明明是你自己剛剛改口三次的……' }
      ]
    }
  },
  {
    id: 5,
    title: '1-5：這不是我的工作',
    bossName: '隔壁棚的老鳥',
    bossAvatar: '👴',
    bossHp: 250,
    bossAtk: 15,
    bossMaxTimer: 3,
    gridRows: 6,
    gridCols: 6,
    layout: [ '111111', '111111', '111111', '111111', '111111', '111111' ],
    allowedBlocks: [ 'MAIL', 'PPT', 'TEA', 'PHONE' ],
    dialogues: {
      start: [
        {
          name: '隔壁棚老鳥',
          avatar: '👴',
          text: '哎呀新人很優秀嘛！這個客戶的催收單你順便幫我處理一下，我相信你！'
        },
        { name: '主角', avatar: '🧑‍💻', text: '可是前輩，這好像是你們那一組的專案……' },
        {
          name: '隔壁棚老鳥',
          avatar: '👴',
          text: '大家都是同一個公司的，計較那麼多幹嘛？年輕人多吃苦當作吃補啦！'
        }
      ],
      win: [
        { name: '主角', avatar: '🧑‍💻', text: '前輩，催收單我都結案了，客戶說非常滿意。' },
        {
          name: '隔壁棚老鳥',
          avatar: '👴',
          text: '（愣了一下）喔……喔！很好，那我拿去跟處長報告了，辛苦你啦！'
        }
      ]
    }
  },
  {
    id: 6,
    title: '1-6：被迫提早一小時開會',
    bossName: '隔壁棚的老鳥(精英)',
    bossAvatar: '👴',
    bossHp: 350,
    bossAtk: 20,
    bossMaxTimer: 4,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [ 'MAIL', 'PPT', 'TEA', 'PHONE' ],
    dialogues: {
      start: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '（盯著手機通知屏）這老鳥竟然在深夜十一點 tag 所有人，說明天要提早到早上八點開晨會對齊進度？！這傢伙自己報告沒寫完，憑什麼拉所有人陪葬？！'
        }
      ],
      win: [
        { name: '隔壁棚老鳥', avatar: '👴', text: '（會上狂打哈欠）好，那大家都對齊了，散會。' },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '（眼睛充滿血絲）這整整一小時你到底講了什麼有建設性的話……'
        }
      ]
    }
  },
  {
    id: 7,
    title: '1-7：撰寫第一份會議記錄',
    bossName: '專案邊緣人',
    bossAvatar: '👤',
    bossHp: 300,
    bossAtk: 10,
    bossMaxTimer: 5,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [ 'MAIL', 'PPT', 'TEA' ],
    dialogues: {
      start: [
        {
          name: '直屬小組長',
          avatar: '😤',
          text: '那個新人，把剛剛大家開會講的重點整理成 Email 發給所有人。'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '重點？（剛剛不是都在聽老鳥講他當年多厲害嗎？）呃，好的，我盡量。'
        }
      ],
      win: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '搞定，用了大量『積極拉通』、『對齊顆粒度』等高大上詞彙，終於拼湊出一千字的精美廢話。'
        }
      ]
    }
  },
  {
    id: 8,
    title: '1-8：下午交給我，這很簡單吧？',
    bossName: '直屬小組長',
    bossAvatar: '😤',
    bossHp: 500,
    bossAtk: 25,
    bossMaxTimer: 4,
    bossSkill: '需求微調',
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [ 'MAIL', 'PPT', 'TEA', 'PHONE', 'KPI' ],
    dialogues: {
      start: [
        {
          name: '直屬小組長',
          avatar: '😤',
          text: '（下午五點五十五分走到主角身後）這個企劃隨便改改就好，這很簡單吧？下午交給我喔。'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '老大……現在已經要下班了，而且這個需求要大改啊！'
        },
        {
          name: '直屬小組長',
          avatar: '😤',
          text: '年輕人要展現狼性嘛！我相信你，那我先去聚餐囉，等你的好消息！'
        }
      ],
      win: [
        {
          name: '直屬小組長',
          avatar: '😤',
          text: '（隔天早上看到完美的報告）哇靠，你居然真的做出來了……處長剛剛大力誇獎我們這組呢！'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '（頂著巨大的黑眼圈，露出冷笑）老大，那我的試用期考核……'
        },
        {
          name: '直屬小組長',
          avatar: '😤',
          text: '沒問題！你用執行力震懾了我，恭喜你正式留下來了！'
        }
      ]
    },
    systemPostWin: {
      title: '【職位晉升通知】',
      badge: '🎖️ 正式組員',
      story: '成為正式員工後，你被推入一個延宕半年的核心專案。客戶天天改需求，協力廠商天天擺爛，你必須學會使用「道具組合技」來強力清盤！對了，前任工程師剛跑路，系統明天就要交改版囉，衝吧！'
    }
  },
  {
    id: 9,
    title: '2-1：重構前人的大便 code',
    bossName: '失聯的前任工程師',
    bossAvatar: '👻',
    bossHp: 400,
    bossAtk: 15,
    bossMaxTimer: 4,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [ 'MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE' ],
    dialogues: {
      start: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '（打開原始碼）這什麼鬼？變數名稱叫 a1, a2, aaaa？完全沒註解，還有一萬行的無限迴圈？！等等，畫面彈出警告了，歷史業障大便 Code 正全面侵蝕我的系統盤面！'
        }
      ],
      win: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '呼……終於刪掉死迴圈，把基礎架構理順了。前任工程師，你真的走得太有道理了。'
        }
      ]
    }
  },
  {
    id: 10,
    title: '2-2：外包又斷線了',
    bossName: '難搞的協力廠商',
    bossAvatar: '🤷',
    bossHp: 500,
    bossAtk: 20,
    bossMaxTimer: 3,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [ 'MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE' ],
    dialogues: {
      start: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '歪？張經理嗎？你們昨天給的 API 串接資料是錯的，系統狂報錯啊！'
        },
        {
          name: '外包張經理',
          avatar: '🤷',
          text: '啊？訊號不好，我這邊在地下室……喂？喂？（掛斷並關機）。'
        }
      ],
      win: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '居然直接不讀不回？看我的奪命連環 Call 搭配三消炸彈，逼你浮出水面！'
        }
      ]
    }
  },
  {
    id: 11,
    title: '2-3：客戶說方向不對',
    bossName: '平行部門的 PM',
    bossAvatar: '🗣️',
    bossHp: 600,
    bossAtk: 18,
    bossMaxTimer: 4,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [ 'MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE' ],
    dialogues: {
      start: [
        {
          name: '平行 PM',
          avatar: '🗣️',
          text: '客戶說，我們目前做的藍色調太死板，要『精緻中帶點活潑，低調中帶點奢華』，要求全部重做。'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '他到底是買軟體還是買藝術品？叫他把具體規格寫出來！'
        }
      ],
      win: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '用光束加十字直接把不合理的需求全部轟掉！叫客戶重新對齊方向。'
        }
      ]
    }
  },
  {
    id: 12,
    title: '2-4：對齊顆粒度',
    bossName: '難搞的協力廠商',
    bossAvatar: '🤷‍♂️',
    bossHp: 800,
    bossAtk: 25,
    bossMaxTimer: 4,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [ 'MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE' ],
    dialogues: {
      start: [
        {
          name: '外包張經理',
          avatar: '🤷',
          text: '（終於回電）哎呀總經理，我們進度很正常啊，只是資料還在封裝……'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '張經理，我們今天就來線上拉通，好好對齊一下底層邏輯與顆粒度，別再找藉口了！'
        }
      ],
      win: [
        {
          name: '外包張經理',
          avatar: '🤷',
          text: '好啦好啦，文件現在傳給你，別再打電話來了，算我怕了你。'
        }
      ]
    }
  },
  {
    id: 13,
    title: '2-5：這個先放一邊',
    bossName: '過期需求單',
    bossAvatar: '🧾',
    bossHp: 1200,
    bossAtk: 15,
    bossMaxTimer: 5,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [ 'MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE' ],
    dialogues: {
      start: [
        {
          name: '直屬小組長',
          avatar: '😤',
          text: '新人，這些是半年前客戶提的單子，前任沒做完。客戶最近又提起來了，你今天順便結案吧。'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '半年前？！這早就不在當初的 Spec 裡了吧！'
        }
      ],
      win: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '（瘋狂疊 Combo）看我的終極連續爆發！管你多舊的單子，通通給我結案！'
        }
      ]
    }
  },
  {
    id: 14,
    title: '2-6：拉通一場對齊會議',
    bossName: '無效會議召集人',
    bossAvatar: '📅',
    bossHp: 900,
    bossAtk: 20,
    bossMaxTimer: 4,
    bossSkill: '聽君一席話',
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [ 'MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE' ],
    dialogues: {
      start: [
        {
          name: '會議召集人',
          avatar: '📅',
          text: '今天召集大家，主要是想分享我十年前在矽谷開拓市場的輝狂事蹟，這對目前的專案很有幫助……'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '（內心大喊）那跟我們現在的 Bug 有什麼關係？！時間要來不及了！'
        }
      ],
      win: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '聽君一席話，如聽一席話。幸好我一邊開會一邊偷偷消除方塊，不然今天就廢了。'
        }
      ]
    }
  },
  {
    id: 15,
    title: '2-7：突然插入的緊急修復',
    bossName: '線上大 Bug',
    bossAvatar: '🐛',
    bossHp: 1000,
    bossAtk: 30,
    bossMaxTimer: 2,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [ 'MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE' ],
    dialogues: {
      start: [
        {
          name: '直屬小組長',
          avatar: '😤',
          text: '不好了！生產環境的資料庫突然亮紅燈，使用者全部登入失敗！高層都在盯著，快修！'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '什麼？！我的天，心跳快飆到 150 了，所有人讓開，我來 debug！'
        }
      ],
      win: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '（手指瘋狂滑動）改掉那個分母為零的致命錯誤！呼……網頁終於綠燈了。'
        }
      ]
    }
  },
  {
    id: 16,
    title: '2-8：我們來腦力激盪一下',
    bossName: '無效會議召集人(精英)',
    bossAvatar: '📅',
    bossHp: 1200,
    bossAtk: 25,
    bossMaxTimer: 4,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [ 'MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE' ],
    dialogues: {
      start: [
        {
          name: '會議召集人',
          avatar: '📅',
          text: '專案遇到瓶頸，大家來玩『便簽貼貼樂』腦力激盪！把所有想法貼滿牆壁，不貼完不准走！'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '這根本是浪費實體便利貼！我的盤面都被這些亂七八糟的便簽封印住了！'
        }
      ],
      win: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '（觸發自動洗牌）把所有沒建設性的便利貼大洗牌！我要回座位寫 code 了！'
        }
      ]
    }
  },
  {
    id: 17,
    title: '2-9：客戶說要改回第一版',
    bossName: '朝令夕改的業主',
    bossAvatar: '👑',
    bossHp: 1500,
    bossAtk: 30,
    bossMaxTimer: 5,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [ 'MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE' ],
    dialogues: {
      start: [
        {
          name: '業主客戶',
          avatar: '👑',
          text: '在經歷了這三十次的修改後，我們還是覺得……你們半年前做的第一版最耐看。我們改用那一版吧。'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '（晴天霹靂）那我這三個月來每天熬夜改的三十個版本到底算什麼？！'
        }
      ],
      win: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '（咬牙切齒）好……改回初版是吧？盤面隨便你吹，我還是能把你擊潰！'
        }
      ]
    }
  },
  {
    id: 18,
    title: '2-10：壓測伺服器崩潰',
    bossName: '紅燈警告燈號',
    bossAvatar: '🚨',
    bossHp: 2000,
    bossAtk: 40,
    bossMaxTimer: 4,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [ 'MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE' ],
    dialogues: {
      start: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '不好，模擬十萬名用戶同時湧入！伺服器 CPU 使用率飆破 99%！風扇快燒毀了！部署代碼優化，給我在瞬間釋放所有記憶體！'
        }
      ],
      win: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '（伺服器風扇聲音漸漸變小）呼，成功撐過十萬流量衝擊，架構安全落地。'
        }
      ]
    }
  },
  {
    id: 19,
    title: '2-11：上線前的最後通宵',
    bossName: '咖啡因過載的肝',
    bossAvatar: '🫀',
    bossHp: 1800,
    bossAtk: 50,
    bossMaxTimer: 3,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [ 'MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE' ],
    dialogues: {
      start: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '（看著時鐘顯示 03:00）第三罐能量飲料喝完了，心跳好快，眼睛好乾。不行，明天早上九點就要點頭上線，一定要撐住！'
        }
      ],
      win: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '（乾下一大口水，消除健康方塊）肝……我們贏了，太陽升起來了。'
        }
      ]
    }
  },
  {
    id: 20,
    title: '2-12：這需求很急，客戶說的',
    bossName: 'PM 總監',
    bossAvatar: '😎',
    bossHp: 2500,
    bossAtk: 35,
    bossMaxTimer: 4,
    bossSkill: '規格變更',
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [ 'MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE' ],
    dialogues: {
      start: [
        {
          name: 'PM 總監',
          avatar: '😎',
          text: '（甩出一疊新文件）這需求真的很急，客戶說如果明天沒看到這個功能，就要跟我們解約！今晚一定要弄出來！'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '總監，現在系統都已經在打包了，這時候改 Spec 是要大家一起死嗎？今天我絕對不退讓！'
        }
      ],
      win: [
        {
          name: 'PM 總監',
          avatar: '😎',
          text: '（看著完美運作的系統，狂擦冷汗）呃，你太厲害了。客戶那邊我已經打發走了，這專案穩了。'
        },
        { name: '主角', avatar: '🧑‍💻', text: '（冷笑）那總監，功勞可別忘了是誰的。' }
      ]
    },
    systemPostWin: {
      title: '【職位晉升通知】',
      badge: '👔 專案組長 (Team Lead)',
      story: '專案奇蹟般地上線了！高層看到了你的帶隊潛力。升任主管的你同時解鎖了【部屬系統】，你可以帶領下屬上陣，但下屬隨時會躺平，上面的處長又瘋狂壓榨 KPI。處長冷笑著對你說：『帶兩個剛畢業的新人，年底前業績沒翻倍就一起走人。』'
    }
  },
  {
    id: 21,
    title: '3-1：與新團隊破冰',
    bossName: '尷尬的沉默氣氛',
    bossAvatar: '😎',
    bossHp: 1100,
    bossAtk: 22,
    bossMaxTimer: 4,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK'
    ],
    dialogues: {
      start: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '嗨，大家早啊！今天天氣不錯，我們今天來對一下週報……（全場低頭玩手機）。'
        },
        {
          name: 'Z世代新人',
          avatar: '🎧',
          text: '……（默默縮在角落戴著耳機，嚼著珍珠，完全不理人）。'
        }
      ],
      win: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '好，看來只能靠消除特定顏色來累積你們的能量條，用實力讓你們開口了。'
        }
      ]
    }
  },
  {
    id: 22,
    title: '3-2：週五下午四點半請假',
    bossName: '隨時想躺平的下屬',
    bossAvatar: '😎',
    bossHp: 1200,
    bossAtk: 24,
    bossMaxTimer: 4,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK'
    ],
    dialogues: {
      start: [
        {
          name: '組員 A',
          avatar: '👦',
          text: '老大，我下午四點半肚子痛，要請假去看偶像的演唱會，先走囉～'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '等一下！五點處長要看進度，你現在走，工作誰做？！'
        }
      ],
      win: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '可惡，下屬一請假，部屬技能直接進冷卻！幸好我自己戰力夠強。'
        }
      ]
    }
  },
  {
    id: 23,
    title: '3-3：幫屬下擦屁股',
    bossName: '新人的低級錯誤',
    bossAvatar: '😎',
    bossHp: 1300,
    bossAtk: 26,
    bossMaxTimer: 4,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK'
    ],
    dialogues: {
      start: [
        {
          name: '組員 B',
          avatar: '👦',
          text: '老大不好了……我剛剛不小心把測試環境的資料庫給全刪了，還把密碼發到了公開群組……'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '（倒吸一口涼氣）你……你先離開電腦，放著我來！'
        }
      ],
      win: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '（連夜還原資料庫）呼，還好有備份。帶新人真的是在修身養性……'
        }
      ]
    }
  },
  {
    id: 24,
    title: '3-4：跨部門搶資源',
    bossName: '其他小隊的組長',
    bossAvatar: '😎',
    bossHp: 1400,
    bossAtk: 28,
    bossMaxTimer: 4,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK'
    ],
    dialogues: {
      start: [
        {
          name: '隔壁組長',
          avatar: '👨‍💼',
          text: '哎呀不好意思，這十台高規格測試機我們這週都要用，你們下週再排吧。'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '下週？我們專案這週就要封測！資源是看績效搶的，別想霸佔！'
        }
      ],
      win: [
        {
          name: '隔壁組長',
          avatar: '👨‍💼',
          text: '好啦好啦，分你們五台就是了，沒看過脾氣這麼硬的主管。'
        }
      ]
    }
  },
  {
    id: 25,
    title: '3-5：我想準點下班',
    bossName: '隨時想躺平的下屬',
    bossAvatar: '👹',
    bossHp: 2000,
    bossAtk: 30,
    bossMaxTimer: 3,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK'
    ],
    dialogues: {
      start: [
        {
          name: '全體組員',
          avatar: '👦',
          text: '（下午五點整，集體開始收拾包包，眼神飄向大門）老大，我們打卡鐘在呼喚我們了。'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '各位，我知道大家想下班，但今天的 Bug 沒清完，明天上線會崩潰。大家加把勁，過這關我請吃宵夜！'
        }
      ],
      win: [ { name: '全體組員', avatar: '👦', text: '老大萬歲！看在雞排的份上，今晚跟你拼了！' } ]
    }
  },
  {
    id: 26,
    title: '3-6：報告寫不完',
    bossName: '空白的 PPT 簡報',
    bossAvatar: '😎',
    bossHp: 1600,
    bossAtk: 32,
    bossMaxTimer: 4,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK'
    ],
    dialogues: {
      start: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '（盯著銀幕）明天處長要聽季度匯報。為什麼我盯了這張空白簡報一小時，標題還是只有一個 Title……'
        }
      ],
      win: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '（瘋狂消除）灌入大量數據、圖表與圓餅圖！精美簡報誕生，搞定！'
        }
      ]
    }
  },
  {
    id: 27,
    title: '3-7：同期在背後嚼舌根',
    bossName: '抓耙子同期主管',
    bossAvatar: '😎',
    bossHp: 1700,
    bossAtk: 34,
    bossMaxTimer: 4,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK'
    ],
    dialogues: {
      start: [
        {
          name: '同期主管',
          avatar: '🤡',
          text: '（在茶水間對處長悄悄話）處長，不是我愛說，隔壁那一組最近紀律很差，主管好像管不太動下屬……'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '（推開門）大老遠就聞到茶水間有長舌婦的味道，有意見當面跟我說！'
        }
      ],
      win: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '敢偷我的道具？用實力當場打腫你的臉，看你還敢不敢打小報告！'
        }
      ]
    }
  },
  {
    id: 28,
    title: '3-8：跨年夜的排班問題',
    bossName: '群組集體已讀不回',
    bossAvatar: '😎',
    bossHp: 1800,
    bossAtk: 36,
    bossMaxTimer: 4,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK'
    ],
    dialogues: {
      start: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '【群組發出訊息：跨年夜晚上需要兩個人留守機房，有人自願嗎？】……等等，系統顯示已讀 5，目前群組陷入死一般的寂靜，大家都在裝死嗎？！'
        }
      ],
      win: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '（嘆氣）好吧，抽籤決定，外加留守的人明年多給三天年假，這總行了吧！'
        }
      ]
    }
  },
  {
    id: 29,
    title: '3-9：搶奪年度優秀員工',
    bossName: '抓耙子同期主管',
    bossAvatar: '👹',
    bossHp: 2400,
    bossAtk: 38,
    bossMaxTimer: 3,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK'
    ],
    dialogues: {
      start: [
        {
          name: '同期主管',
          avatar: '🤡',
          text: '處長～我們組今年辦了三場跨部門聯誼，對公司文化貢獻巨大，優秀員工應該給我們組。'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '優秀員工看的是產值和業績，不是看誰馬屁拍得好！處長，看數據吧！'
        }
      ],
      win: [
        {
          name: '處長',
          avatar: '👨‍💼',
          text: '嗯……數據上確實是主角這一組完全碾壓。優秀員工名額就給主角組了。'
        }
      ]
    }
  },
  {
    id: 30,
    title: '3-10：主管群組的明爭暗鬥',
    bossName: '抓耙子同期主管 (精英狀態)',
    bossAvatar: '😎',
    bossHp: 2000,
    bossAtk: 40,
    bossMaxTimer: 4,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK'
    ],
    dialogues: {
      start: [
        {
          name: '同期主管',
          avatar: '🤡',
          text: '【大群組 tag 所有人】針對這次專案進度落後，我覺得主要是因為主角組的 API 延遲提供導致的。'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '你居然在大群組甩鍋？明明是你們規格書遲到了一個月！看我怎麼反擊！'
        }
      ],
      win: [
        {
          name: '主角',
          avatar: '🧑💻',
          text: '直接丟出郵件證據，啪啪兩下當場打臉，看你還怎麼在群組作怪。'
        }
      ]
    }
  },
  {
    id: 31,
    title: '3-11：季度績效面談 (一)',
    bossName: '冷酷的考核表',
    bossAvatar: '😎',
    bossHp: 2100,
    bossAtk: 42,
    bossMaxTimer: 4,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK'
    ],
    dialogues: {
      start: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '（看著面談表）KPI 指標、OKR 達成率、360度互評……這不是面談，這是靈魂審判。'
        }
      ],
      win: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '每一項指標都用消除拿到了 A+，第一階段面談順利過關。'
        }
      ]
    }
  },
  {
    id: 32,
    title: '3-12：季度績效面談 (二)',
    bossName: '無感的數據落差',
    bossAvatar: '😎',
    bossHp: 2200,
    bossAtk: 44,
    bossMaxTimer: 4,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK'
    ],
    dialogues: {
      start: [
        {
          name: '中階處長',
          avatar: '👹',
          text: '主角啊，雖然你們達成了原本的目標，但對比去年沒有爆發性成長啊，這樣我考核很難給很高。'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '處長，去年的專案規模只有今年的三分之一，這種對比不合理吧？！'
        }
      ],
      win: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '用精準的同比增長率反駁他！逼得處長不得不點頭承認我們的價值。'
        }
      ]
    }
  },
  {
    id: 33,
    title: '3-13：部門預算被砍',
    bossName: '刪減通知書',
    bossAvatar: '😎',
    bossHp: 2300,
    bossAtk: 46,
    bossMaxTimer: 4,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK'
    ],
    dialogues: {
      start: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '等等，剛收到總部 Email 晴天霹靂！因應策略調配，我們部門下半年的經費與授權預算被砍 30%？！沒有資源、工具被限制，這要我怎麼帶兵打仗？！'
        }
      ],
      win: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '（精細計算每一步消除）就算頂著預算削減的負面狀態，我也能帶團隊殺出一條血路！'
        }
      ]
    }
  },
  {
    id: 34,
    title: '3-14：倒數計時的考評壓力',
    bossName: '處長的奪命連環 Call',
    bossAvatar: '👹',
    bossHp: 2900,
    bossAtk: 48,
    bossMaxTimer: 3,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK'
    ],
    dialogues: {
      start: [
        {
          name: '中階處長',
          avatar: '👹',
          text: '主角，半小時前的數據怎麼還沒更新？快點！董事長等一下要看！'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '處長，電話鈴聲又響了……你每十分鐘打一通，我根本沒時間坐下來做報表啊！'
        }
      ],
      win: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '（掛斷電話，全速消除）一鍵自動生成實時看板，處長你以後自己上去看，別再打來了！'
        }
      ]
    }
  },
  {
    id: 35,
    title: '3-15：不要跟我談過程，我只要數字',
    bossName: '數字至上的中階處長',
    bossAvatar: '👹',
    bossHp: 3000,
    bossAtk: 50,
    bossMaxTimer: 3,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK'
    ],
    dialogues: {
      start: [
        {
          name: '滅絕處長',
          avatar: '👹',
          text: '（將報表重重摔在桌上）我不管你們熬了幾天夜，業績沒達標就是沒達標！今晚拿不出數字，明天全組走人！'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '處長，你坐在冷氣房裡只會看 Excel！今天我就用最終的成果數字，讓你徹底閉嘴！'
        }
      ],
      win: [
        {
          name: '中階處長',
          avatar: '👹',
          text: '（看著飆升的利潤曲線，手在發抖）這……這不可能……你竟然完成了不可能的指標……'
        },
        { name: '主角', avatar: '🧑‍💻', text: '處長，數字就在這裡。現在，換你聽我開條件了。' }
      ]
    },
    systemPostWin: {
      title: '【職位晉升通知】',
      badge: '💼 部門處長',
      story: '你挺過了夾心餅乾的煎熬，部門業績超標，處長直接被你逼退，由你接替他的位置！你正式踏入總公司高層政治圈。這裡的戰鬥不再是做不完的雜事，而是派系與派系之間爭奪千萬預算、互推責任、合規審查的權力賽局。不是他們死，就是你走人。'
    }
  },
  {
    id: 36,
    title: '4-1：高層會議的座位學問',
    bossName: '派系站隊空氣',
    bossAvatar: '😎',
    bossHp: 2600,
    bossAtk: 52,
    bossMaxTimer: 4,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '（走進長型大理石會議室）這座位……坐得太靠近副總壓力大，坐得太遠又顯得邊緣，敵對派系都在盯著我，每一步都是學問。'
        }
      ],
      win: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '安穩坐在核心斜對角，進可攻退可守，完美融入高層氣場。'
        }
      ]
    }
  },
  {
    id: 37,
    title: '4-2：搶奪年度總預算',
    bossName: '行銷處長',
    bossAvatar: '👹',
    bossHp: 3200,
    bossAtk: 54,
    bossMaxTimer: 3,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [
        {
          name: '行銷處長',
          avatar: '👺',
          text: '副總，明年的海外推廣需要大量資金，我們行銷處必須拿走 70% 的總預算。'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '行銷處去年拿了過半預算，轉換率卻低得可憐！副總，這筆錢應該投入核心產品研發，看我的數據分析！'
        }
      ],
      win: [
        { name: '行銷處長', avatar: '👺', text: '你……你竟然把我過去三年的爛帳全部算出來了？！' }
      ]
    }
  },
  {
    id: 38,
    title: '4-3：被抓去當跨部門評委',
    bossName: '互吹捧的各處室主管',
    bossAvatar: '😎',
    bossHp: 2800,
    bossAtk: 56,
    bossMaxTimer: 4,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [
        { name: '處長 C', avatar: '👨‍💼', text: '哎呀，行銷處這個專案太有創意了！' },
        { name: '行銷處長', avatar: '👺', text: '哪裡哪裡，研發處的架構也是業界頂尖啊～' },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '（內心白眼）這群人又在商業互吹了。在這種虛偽的套路中，我必須保持清醒、找出他們的漏洞！'
        }
      ],
      win: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '一針見血指出他們專案的致命缺陷，互吹泡泡當場破裂。'
        }
      ]
    }
  },
  {
    id: 39,
    title: '4-4：這不符合經濟效益',
    bossName: '審計小組',
    bossAvatar: '😎',
    bossHp: 2900,
    bossAtk: 58,
    bossMaxTimer: 4,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [
        {
          name: '審計組長',
          avatar: '🧐',
          text: '處長，你們上個月有一張高鐵票的報銷時間不符合常規，請寫一份三頁的說明書。'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '連 500 元的車票都要卡？你們這是在限制我們團隊的研發效率！'
        }
      ],
      win: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '雖然連鎖消除範圍被限制，但靠精準的單點引爆，順利通過財務審查。'
        }
      ]
    }
  },
  {
    id: 40,
    title: '4-5：非正式的煙囪談話',
    bossName: '探聽口風的秘書',
    bossAvatar: '😎',
    bossHp: 3000,
    bossAtk: 60,
    bossMaxTimer: 4,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [
        {
          name: '副總秘書',
          avatar: '👩‍💼',
          text: '處長，最近副總在考慮新的人事調動，不知道你對行銷處長最近的作風有什麼看法呀？'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '（內心一驚）這是一場政治試探！說錯一個字可能就萬劫不復，必須小心應答。'
        }
      ],
      win: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '用太極拳式的完美官話打太極，既沒得罪人，又展現了高情商。'
        }
      ]
    }
  },
  {
    id: 41,
    title: '4-6：合規性審查',
    bossName: '法務部擋箭牌',
    bossAvatar: '👹',
    bossHp: 3600,
    bossAtk: 62,
    bossMaxTimer: 3,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [
        {
          name: '法務總監',
          avatar: '⚖️',
          text: '處長，你們這個新專案涉嫌違反公司第 404 條內部合規守則，無限期擱置，回去重新評估吧。'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '法務總監，這守則已經十年沒更新了！你這是在用官僚條款阻礙公司創新！今天我非要把你這面合規護盾給擊碎不可！'
        }
      ],
      win: [
        {
          name: '法務總監',
          avatar: '⚖️',
          text: '（揉揉眼睛）好吧，既然你們有特批文件，外加特殊道具組合技的強大威力……這次就放行。'
        }
      ]
    }
  },
  {
    id: 42,
    title: '4-7：應付董事長的大排場報告',
    bossName: '100頁的精美 PPT 簡報',
    bossAvatar: '😎',
    bossHp: 3200,
    bossAtk: 64,
    bossMaxTimer: 4,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '全處不眠不休做了一份極度奢華、帶有 3D 動畫轉場的 PPT。董事長已經坐下了，絕對不能出任何差錯！'
        }
      ],
      win: [
        {
          name: '董事長',
          avatar: '🎩',
          text: '（點點頭）嗯，報告做得很有格局，想法很宏觀。處長，好好幹。'
        }
      ]
    }
  },
  {
    id: 43,
    title: '4-8：被抓去調查職場霸凌',
    bossName: '黑函投訴信',
    bossAvatar: '😎',
    bossHp: 3300,
    bossAtk: 66,
    bossMaxTimer: 4,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [
        {
          name: '人資總監',
          avatar: '👩‍💼',
          text: '處長，我們收到匿名黑函，檢舉你在公開場合對其他主管出言不遜，涉嫌職場霸凌，我們必須依規定凍結你的盤面方塊。'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '這絕對是惡意栽贓！敵對派系竟然使出這種下三濫的手段？！'
        }
      ],
      win: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '用水平光束直接掃清黑函！人資那邊也查明真相，投訴不成立。'
        }
      ]
    }
  },
  {
    id: 44,
    title: '4-9：出差旅費被刁難',
    bossName: '財務部實習生',
    bossAvatar: '😎',
    bossHp: 3400,
    bossAtk: 68,
    bossMaxTimer: 4,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [
        {
          name: '財務實習生',
          avatar: '🤓',
          text: '處長，你這次去美國住的飯店，比公司規定超標了 50 元台幣，請找副總重新簽核才能報銷。'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '（不可置信）我堂堂一個處長，幫公司談了千萬合約，高層出差你跟我卡 50 元台幣？！這背後絕對是財務總監在指使！'
        }
      ],
      win: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '直接拿出副總的特批 Email，實習生當場嚇得乖乖蓋章。'
        }
      ]
    }
  },
  {
    id: 45,
    title: '4-10：部門績效被刻意拉低',
    bossName: '不公的常態分配曲線',
    bossAvatar: '😎',
    bossHp: 3500,
    bossAtk: 70,
    bossMaxTimer: 4,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [
        {
          name: '行銷處長',
          avatar: '👺',
          text: '副總，今年公司規定必須有 10% 的人拿考績 C。我覺得主角那一處的團隊今年太激進，這 C 的額度應該給他們。'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '我們拼死拼活拿業績，你居然想把不公的常態分配套在我們頭上？休想！'
        }
      ],
      win: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '在常態分配曲線前強勢突圍，用無可挑剔的績效把考績 C 甩回行銷處。'
        }
      ]
    }
  },
  {
    id: 46,
    title: '4-11：獵人頭公司的秘密挖角',
    bossName: '動搖的忠誠度',
    bossAvatar: '😎',
    bossHp: 3600,
    bossAtk: 72,
    bossMaxTimer: 4,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [
        {
          name: '獵人頭顧問',
          avatar: '🕵️',
          text: '處長您好，競爭對手那邊開出了兩倍薪水與專屬期權，想邀請您過去擔任副總，不知道您有沒有興趣……'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '（心跳加速）兩倍薪水……這確實非常有誘惑力。不行，我的內心開始產生雜念了，必須消除這些干擾色方塊、保持專注！'
        }
      ],
      win: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '感謝您的厚愛，但我這個人習慣在哪裡跌倒，就在哪裡把對手踩在腳下。我決定留在這裡登頂。'
        }
      ]
    }
  },
  {
    id: 47,
    title: '4-12：成本效益分析',
    bossName: '財力部毒舌總監',
    bossAvatar: '🐍',
    bossHp: 4200,
    bossAtk: 74,
    bossMaxTimer: 3,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [
        {
          name: '財務部總監',
          avatar: '🐍',
          text: '（開啟嘲諷模式）你們處花這麼多預算，到底能幫公司賺回多少？在我看來，你們做的事情根本毫無價值。下半年的預算直接對半砍吧。'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '總監，你只會坐在辦公室看支出，根本不懂未來的戰略價值！今天我就用成本效益分析的最終爆發，把你這毒舌總監給炸翻！'
        }
      ],
      win: [
        {
          name: '財務部總監',
          avatar: '🐍',
          text: '（看著暴增的投報率預估，狂擦冷汗）呃……好吧，算你說得有道理，預算一毛不刪！'
        }
      ]
    }
  },
  {
    id: 48,
    title: '4-13：空降的皇親國戚',
    bossName: '董事長的遠房親戚',
    bossAvatar: '👹',
    bossHp: 4300,
    bossAtk: 76,
    bossMaxTimer: 3,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [
        {
          name: '空降副處長',
          avatar: '👨‍💼',
          text: '大家好，我是新來的副處長。雖然我以前沒做過研發，但我覺得這個系統應該要加個聊天功能，大家都聽我的吧～'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '董事長的姪子？一來就瞎指揮，把原本排好的方塊全部打亂！看我怎麼收拾你！'
        }
      ],
      win: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '用專業的架構把空降部隊架空，讓他乖乖坐在辦公室喝茶看報紙。'
        }
      ]
    }
  },
  {
    id: 49,
    title: '4-14：尾牙敬酒的攻防戰',
    bossName: '灌酒大隊',
    bossAvatar: '😎',
    bossHp: 3900,
    bossAtk: 78,
    bossMaxTimer: 4,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [
        {
          name: '行銷處長',
          avatar: '👺',
          text: '（帶著一眾部屬圍過來）來，處長！今年辛苦了，這杯 58 度高粱乾了！不喝就是不給我和副總面子喔！'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '（眼神一凜）車輪戰灌酒？計時開始，看我如何在酒精過載前用超高速消除把你們全部放倒！'
        }
      ],
      win: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '（把空酒杯倒過來）前輩們都倒在桌子底下了，那我就先告辭囉。'
        }
      ]
    }
  },
  {
    id: 50,
    title: '4-15：組織架構大重組傳言',
    bossName: '人心惶惶的辦公室氣氛',
    bossAvatar: '😎',
    bossHp: 4000,
    bossAtk: 80,
    bossMaxTimer: 4,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [
        {
          name: '組員 A',
          avatar: '👦',
          text: '處長，聽說高層要把我們跟行銷部合併，行銷處長要來當我們的大老闆，這是真的嗎？'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '（拍拍桌子）大家別聽信謠言，專心手頭的工作。只要有我在，沒人動得了我們部門！'
        }
      ],
      win: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '穩住團隊士氣，用無可動搖的向心力打破大重組的政治陰謀。'
        }
      ]
    }
  },
  {
    id: 51,
    title: '4-16：安插自己的人馬',
    bossName: '人事凍結令',
    bossAvatar: '😎',
    bossHp: 4100,
    bossAtk: 82,
    bossMaxTimer: 4,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [
        {
          name: '人資總監',
          avatar: '👩‍💼',
          text: '處長，總部剛發佈人事凍結，你提報的副處長晉升名額恐怕要被取消了。'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '我的得力助手今年拼死拼活，你跟我說人事凍結？今天不管繞過多少重規則，我非要把自己人提拔上去！'
        }
      ],
      win: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '巧妙利用組織特權漏洞，成功將親信安插到核心管理層。'
        }
      ]
    }
  },
  {
    id: 52,
    title: '4-17：迎接副總的視察',
    bossName: '表面功夫展示牆',
    bossAvatar: '😎',
    bossHp: 4200,
    bossAtk: 84,
    bossMaxTimer: 4,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '副總十分鐘後到辦公區巡視！所有人注意，桌面不能有飲料杯、穿上正裝、銀幕全面切換到公司宣傳影片！開始大掃除！'
        }
      ],
      win: [
        {
          name: '副總',
          avatar: '👔',
          text: '（滿意地拍拍主角）嗯，處長，你們部門很有紀律，精神面貌非常好。'
        }
      ]
    }
  },
  {
    id: 53,
    title: '4-18：派系鬥爭的犧牲品',
    bossName: '行銷處長',
    bossAvatar: '👹',
    bossHp: 4800,
    bossAtk: 86,
    bossMaxTimer: 3,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [
        { name: '行銷處長', avatar: '👿', text: '你們部門的預算我全砍了！' },
        { name: '主角', avatar: '🧑‍💻', text: '預算是照規定走的，你憑什麼公報私仇？' }
      ],
      win: [ { name: '主角', avatar: '🧑‍💻', text: '帶著你的私心離開會議室吧。' } ]
    },
    systemPostWin: {
      title: '【職位晉升通知】',
      badge: '🌏 海外分公司總經理 (GM)',
      story: '你成功在派系鬥爭中勝出，連 VP 都不得不對你敬畏三分。這時董事長親自召見你，決定把你發配/外派到業績吊車尾、連續虧損兩年的海外分公司。這裡天高皇帝遠，你解鎖了強大的【企業特權系統】，必須在語言不通、法規水土不服、以及當地的惡性價格戰中，大刀闊斧整頓爛攤子。當地的競爭對手甚至放出話來，說三個月內要把你們趕出市場！'
    }
  },
  {
    id: 54,
    title: '4-19：臨時董事會的質詢',
    bossName: '獨立董事',
    bossAvatar: '🧐',
    bossHp: 5000,
    bossAtk: 90,
    bossMaxTimer: 3,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [
        { name: '獨立董事', avatar: '🧐', text: '這份預算案的風險評估完全不合格。' },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '請看附加的避險模型，我們已經準備好所有應對方案了。'
        }
      ],
      win: [ { name: '獨立董事', avatar: '🧐', text: '非常詳細的數據，我無話可說。' } ]
    },
    systemPostWin: {
      title: '【職位晉升通知】',
      badge: '🌏 海外分公司總經理 (GM)',
      story: '你成功在派系鬥爭中勝出，連 VP 都不得不對你敬畏三分。這時董事長親自召見你，決定把你發配/外派到業績吊車尾、連續虧損兩年的海外分公司。這裡天高皇帝遠，你解鎖了強大的【企業特權系統】，必須在語言不通、法規水土不服、以及當地的惡性價格戰中，大刀闊斧整頓爛攤子。當地的競爭對手甚至放出話來，說三個月內要把你們趕出市場！'
    }
  },
  {
    id: 55,
    title: '4-20：權力的交接',
    bossName: '副總經理 (VP)',
    bossAvatar: '👔',
    bossHp: 5500,
    bossAtk: 95,
    bossMaxTimer: 3,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [
        {
          name: '副總經理 (VP)',
          avatar: '👔',
          text: '你以為你能贏我？我可是公司的創始元老！'
        },
        { name: '主角', avatar: '🧑‍💻', text: '我不是要贏你，我是要證明你的時代已經過去了。' }
      ],
      win: [
        {
          name: '副總經理 (VP)',
          avatar: '👔',
          text: '算你狠...未來的公司就交給你了...'
        },
        { name: '主角', avatar: '🧑‍💻', text: '謝謝副總的指教。' }
      ]
    },
    systemPostWin: {
      title: '晉升通告',
      badge: '副總經理 (VP)',
      story: '你成功在總公司的政治風暴中存活下來，並用實力證明了自己。董事會正式任命你為：副總經理 (VP)！'
    }
  },
  {
    id: 56,
    title: '5-1：跨國時差的考驗',
    bossName: '凌晨三點的總部連線會議',
    bossAvatar: '😎',
    bossHp: 4400,
    bossAtk: 88,
    bossMaxTimer: 4,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [
        {
          name: '總部高層',
          avatar: '🏢',
          text: '總經理，請匯報海外分公司本週的整頓計劃，我們在聽。'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '（灌下濃茶，強撐著沉重的眼皮）總部各位領導好……（天啊，時差還沒對好，盤面好晃，必須保持清醒！）。'
        }
      ],
      win: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '呼……報告完畢。總部的人真的站著說話不腰疼，現在可是海外凌晨三點啊。'
        }
      ]
    }
  },
  {
    id: 57,
    title: '5-2：雞同鴨講的跨國溝通',
    bossName: '翻譯年糕怪獸',
    bossAvatar: '😎',
    bossHp: 4500,
    bossAtk: 90,
    bossMaxTimer: 4,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [
        {
          name: '當地員工',
          avatar: '👱‍♂️',
          text: 'Manager, our synergy is not aligning with the global template...'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '（拿著翻譯軟體）等一下，你這句到底是想表達系統壞了，還是想表達你想請假？這爛軟體把盤面顏色搞得一團亂，逼得我得重新整理代碼！'
        }
      ],
      win: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '排除語言障礙，直接用最直觀的 KPI 數據跟他們溝通，世界清靜了。'
        }
      ]
    }
  },
  {
    id: 58,
    title: '5-3：整頓一盤散沙的當地團隊',
    bossName: '各懷鬼胎的外籍員工',
    bossAvatar: '😎',
    bossHp: 4600,
    bossAtk: 92,
    bossMaxTimer: 4,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [
        {
          name: '當地資深員工',
          avatar: '🧔',
          text: '這個新來的總經理懂什麼在地市場？反正總部每兩年就換一個經理，我們隨便應付一下就好啦。'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '覺得我是來鍍金的軟柿子？今天我就要在團隊裡大刀闊斧，開除幾個刺頭、重新建立威信！'
        }
      ],
      win: [
        {
          name: '當地員工',
          avatar: '👱‍♂️',
          text: '（集體端正坐好）總經理早！請問今天有什麼指示？'
        }
      ]
    }
  },
  {
    id: 59,
    title: '5-4：尋找當地的代理商',
    bossName: '油腔滑調的中介人',
    bossAvatar: '😎',
    bossHp: 4700,
    bossAtk: 94,
    bossMaxTimer: 4,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [
        {
          name: '花襯衫代理商',
          avatar: '🌺',
          text: 'My friend! 只要把當地的獨家經銷權交給我，我保證通路暢通！不過這中間的手續費嘛……'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '眼神閃爍、漫天開價，顯然是個想狠狠敲肥羊的騙子。看我怎麼在談判桌上擊潰你！'
        }
      ],
      win: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '合約重簽，利潤對半。想坑總部的錢，你還太嫩了。'
        }
      ]
    }
  },
  {
    id: 60,
    title: '5-5：租用新的海外辦公室',
    bossName: '漫天開價的房東',
    bossAvatar: '😎',
    bossHp: 4800,
    bossAtk: 96,
    bossMaxTimer: 4,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [
        {
          name: '當地地產大亨',
          avatar: '🤑',
          text: '總經理，我們這棟大樓是金融區地標。既然是跨國大企業要租，租金每年翻倍，這很合理吧？'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '分公司本來的辦公室漏水，你想趁火打劫？看我用消除特權逼你降價！'
        }
      ],
      win: [
        {
          name: '當地地產大亨',
          avatar: '🤑',
          text: '好吧好吧，看在你們一次簽五年的份上，給你們打個七折。'
        }
      ]
    }
  },
  {
    id: 61,
    title: '5-6：應付當地勞檢',
    bossName: '水土不服的法規',
    bossAvatar: '👹',
    bossHp: 5400,
    bossAtk: 98,
    bossMaxTimer: 3,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [
        {
          name: '勞動局官員',
          avatar: '👮',
          text: '總經理，有人檢舉你們分公司加班超標，而且下午茶休息時間不符合本地法規。我要啟動限時法規條例限制你們！'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '等等，盤面居然變成奇數回合只能水平移動，偶數回合只能垂直移動？！在地法規限制也管得太寬了吧！看我照樣破局！'
        }
      ],
      win: [
        {
          name: '勞動局官員',
          avatar: '👮',
          text: '嗯……檢查過關，你們的加班費發放完全合法，打擾了。'
        }
      ]
    }
  },
  {
    id: 62,
    title: '5-7：當地的工會抗議',
    bossName: '罷工糾察隊',
    bossAvatar: '😎',
    bossHp: 5000,
    bossAtk: 100,
    bossMaxTimer: 4,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [
        {
          name: '工會代表',
          avatar: '📢',
          text: '總經理！因為你取消了每週五的下午茶免費甜點，我們決定發動抗議，部屬集體罷工！'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '慘了，部屬技能全部被鎖定了？！竟然因為甜點鬧罷工……看來這關只能靠我自己單打獨鬥了！'
        }
      ],
      win: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '把罷工首領單獨請進辦公室加薪，工會當場解散，部屬技能回歸。'
        }
      ]
    }
  },
  {
    id: 63,
    title: '5-8：供應鏈斷貨危機',
    bossName: '卡在海關的貨櫃',
    bossAvatar: '😎',
    bossHp: 5100,
    bossAtk: 102,
    bossMaxTimer: 4,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [
        {
          name: '物流主管',
          avatar: '📦',
          text: '總經理不好了！聖誕節旺季到了，我們的核心產品貨櫃卻因為文件少蓋了一個在地商會的章，被卡在海關碼頭進不來！'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '海關官僚主義卡我？啟動行、列光束大絕招，直接給我把海關通路清空！'
        }
      ],
      win: [
        {
          name: '物流主管',
          avatar: '📦',
          text: '太強了，海關那邊竟然特批放行，貨櫃正在運往倉庫！'
        }
      ]
    }
  },
  {
    id: 64,
    title: '5-9：打入本土社交圈',
    bossName: '尷尬的異國晚宴',
    bossAvatar: '😎',
    bossHp: 5200,
    bossAtk: 104,
    bossMaxTimer: 4,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [
        {
          name: '商會大佬',
          avatar: '🥂',
          text: '歡迎總經理。在我們這裡談生意，必須先穿上我們的傳統羽毛服，並且吃下這盤在地百年美食——涼拌發酵昆蟲！'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '（看著盤子裡還在動的蟲子，狂擦冷汗）這……這為了分公司的未來，我拼了！'
        }
      ],
      win: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '（一臉鐵青地抹抹嘴）味道……意外地像炸雞。大佬，現在可以談合約了吧？'
        }
      ]
    }
  },
  {
    id: 65,
    title: '5-10：總部無情的業績催促',
    bossName: '跨海催收催繳信',
    bossAvatar: '😎',
    bossHp: 5300,
    bossAtk: 106,
    bossMaxTimer: 4,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '（看著董事會發來的無情 Email）『本月營收要是沒有成長 20%，總部將考慮撤換負責人。』這群只看利潤的吸血鬼，逼我開啟最高檔位消除！'
        }
      ],
      win: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '營收月成長 25% 甩回總部，讓董事會那群老傢伙閉嘴。'
        }
      ]
    }
  },
  {
    id: 66,
    title: '5-11：當地媒體的文化質疑',
    bossName: '公關危機新聞稿',
    bossAvatar: '😎',
    bossHp: 5400,
    bossAtk: 108,
    bossMaxTimer: 4,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '電視新聞竟然在抵制我們！說我們最新的廣告台詞疑似帶有刻板印象。這只是翻譯誤會！公關團隊立刻動起來，撰寫澄清新聞稿，消除負面輿論方塊！'
        }
      ],
      win: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '危機處理成功，甚至利用這次誤會辦了一場在地化慈善活動，品牌形象不降反升。'
        }
      ]
    }
  },
  {
    id: 67,
    title: '5-12：匯率暴跌的金融危機',
    bossName: '震盪的匯率走勢圖',
    bossAvatar: '😎',
    bossHp: 5500,
    bossAtk: 110,
    bossMaxTimer: 4,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '突發財經新聞，在地貨幣今日無預警暴跌 15%？！昨天賺的一百萬，今天直接對半折。在這種經濟波動亂流下，每一步消除都要格外小心！'
        }
      ],
      win: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '迅速將資產轉為美金避險，在匯率走勢圖的亂流中保住分公司財產。'
        }
      ]
    }
  },
  {
    id: 68,
    title: '5-13：市佔率爭奪戰',
    bossName: '當地惡性競爭對手',
    bossAvatar: '👹',
    bossHp: 6100,
    bossAtk: 112,
    bossMaxTimer: 3,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [
        {
          name: '本地地頭蛇 CEO',
          avatar: '🐍',
          text: '這個外來的總經理撐不了多久的。傳令下去，我們啟動『買一送二』策略，打惡性價格戰，我要把他們活活耗死！'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '想用本土地頭蛇的資本優勢把我趕走？你太小看總經理的企業特權了！看我的超高速高爆發消除，當場把你的價格戰打崩！'
        }
      ],
      win: [
        {
          name: '本地地頭蛇 CEO',
          avatar: '🐍',
          text: '（臉色慘白）買一送二竟然還打不贏？他們到底哪來這麼高效率的供應鏈……'
        }
      ]
    }
  },
  {
    id: 69,
    title: '5-14：開闢全新銷售渠道',
    bossName: '電商平台演算法',
    bossAvatar: '😎',
    bossHp: 5700,
    bossAtk: 114,
    bossMaxTimer: 4,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '既然本地的地頭蛇封鎖了我們的實體店面通路，那分公司就全面轉戰線上電商！不過這平台的演算法每小時都在變，看我怎麼破解它！'
        }
      ],
      win: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '成功摸透演算法權重，分公司旗艦店直接衝上熱搜榜第一名！'
        }
      ]
    }
  },
  {
    id: 70,
    title: '5-15：黑客惡意攻擊伺服器',
    bossName: 'DDOS 流量怪獸',
    bossAvatar: '😎',
    bossHp: 5800,
    bossAtk: 116,
    bossMaxTimer: 4,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [
        {
          name: '資安主管',
          avatar: '🛡️',
          text: '總經理！我們的電商網站突然遭到不明來源的黑客發動 DDOS 惡意攻擊，每秒幾百萬的虛假流量正灌滿伺服器，網頁全面癱瘓了！'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '一定是對手眼紅找來的黑客！啟用網絡特權，給我佈署最強防火牆、消除惡意流量方塊！'
        }
      ],
      win: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '（黑客流量歸零）追蹤到黑客 IP，直接把證據發給當地警方，抓人！'
        }
      ]
    }
  },
  {
    id: 71,
    title: '5-16：總部派來的空降督導',
    bossName: '指手畫腳的總部欽差',
    bossAvatar: '✈️',
    bossHp: 5900,
    bossAtk: 118,
    bossMaxTimer: 4,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [
        {
          name: '總部督導',
          avatar: '✈️',
          text: '總經理啊，我是總部派來的督導。我覺得你們在海外搞什麼電商根本是不務正業，總部開會覺得你們應該回歸傳統店面。'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '你在總部吹冷氣，根本不懂海外的市場現狀！少在這邊外行指導內行，看我用亮眼的業績數字把你送回總部！'
        }
      ],
      win: [
        {
          name: '總部督導',
          avatar: '✈️',
          text: '（看著單日百萬業績）呃……看來總經理的做法非常有前瞻性，我回總部一定幫你美言幾句。'
        }
      ]
    }
  },
  {
    id: 72,
    title: '5-17：異國文化的聖誕長假',
    bossName: '集體人間蒸發的客服',
    bossAvatar: '😎',
    bossHp: 6000,
    bossAtk: 120,
    bossMaxTimer: 4,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '（看著空無一人的辦公室）等一下，聖誕假期一到，客服和物流人員竟然集體關機度假去了？！倉庫裡還有幾萬張訂單啊！逼我動用自動化消除系統硬撐！'
        }
      ],
      win: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '還好我提早寫了 AI 客服模組與自動發貨指令，終於撐過長假衝擊。'
        }
      ]
    }
  },
  {
    id: 73,
    title: '5-18：分公司年度財報逆轉',
    bossName: '由紅轉綠的業績線',
    bossAvatar: '🧮',
    bossHp: 6100,
    bossAtk: 122,
    bossMaxTimer: 4,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [
        {
          name: '會計主管',
          avatar: '🧮',
          text: '總經理，今天是海外分公司的年終結算日。只要能跨過這關，我們的財報曲線就能徹底由紅轉綠！'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '十一個月的努力，成敗就看這最後一躍了，給我全盤引爆吧！'
        }
      ],
      win: [
        {
          name: '會計主管',
          avatar: '🧮',
          text: '（興奮大喊）轉綠了！赤字全面轉為盈餘！我們分公司創造了跨國奇蹟！'
        }
      ]
    }
  },
  {
    id: 74,
    title: '5-19：準備回總部述職的報告',
    bossName: '豐收的拓荒戰果',
    bossAvatar: '😎',
    bossHp: 6200,
    bossAtk: 124,
    bossMaxTimer: 4,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '明天就要搭專機返回總部進行年度述職報告了。我要讓當初把我發配到這裡的派系高層，外行老傢伙們，睜大眼睛看清楚什麼叫真正的拓荒戰果！'
        }
      ],
      win: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '報告整理完畢。總部的老傢伙們，準備迎接新風暴的降臨吧。'
        }
      ]
    }
  },
  {
    id: 75,
    title: '5-20：清算前任的呆帳',
    bossName: '前分公司主管的幽靈',
    bossAvatar: '👹',
    bossHp: 6800,
    bossAtk: 126,
    bossMaxTimer: 3,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [
        {
          name: '審計總監',
          avatar: '🧐',
          text: '總經理不好了！會計師突然查出前任總經理挪用公款，留下了高達數千萬的呆帳漏洞。這個債務幽靈正拋出無法消除的債務方塊污染盤面！'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '前任留下來的歷史共業？！老主管陰魂不散是吧！今天我就動用分公司的全部特權備用金，製造彩色黑洞把你這顆毒瘤徹底清算！'
        }
      ],
      win: [
        {
          name: '前任總經理幽靈',
          avatar: '👻',
          text: '（慘叫一聲後消散）不……我的呆帳竟然被你全部填平了……'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '（拍拍手上的灰塵）前任的爛攤子清理完畢。分公司現在，徹底屬於我了。'
        }
      ]
    },
    systemPostWin: {
      title: '【職位晉升通知】',
      badge: '👑 首席執行長 (CEO)',
      story: '你成功讓虧損兩年的海外分公司起死回生，獲利全集團第一！總部董事會全體起立為你鼓掌。在全體股東的推舉下，你強勢回歸總部，坐上了 CEO 的王座。但外部禿鷹基金與激進股東正聯合發動逼宮，你將在總部頂樓，與公司的最高權力——董事長，進行最後的資本決戰！'
    }
  },
  {
    id: 76,
    title: '6-1：應對媒體惡意抹黑',
    bossName: '腥風血雨的小報記者',
    bossAvatar: '😎',
    bossHp: 6400,
    bossAtk: 128,
    bossMaxTimer: 4,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [
        {
          name: '小報記者',
          avatar: '📸',
          text: '執行長，有人匿名爆料你海外學歷造假、且在分公司涉嫌內線交易，請問你有什麼要澄清的嗎？'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '我剛上任第一天就搞輿論抹黑？背後顯然有人在操縱！公關團隊聽令，正面迎擊、打破大範圍鎖定！'
        }
      ],
      win: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '直接甩出官方公證的學歷與第三方審計財報，謠言當場不攻自破。'
        }
      ]
    }
  },
  {
    id: 77,
    title: '6-2：外資大舉倒貨',
    bossName: '賣單牆',
    bossAvatar: '😎',
    bossHp: 6500,
    bossAtk: 130,
    bossMaxTimer: 4,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [
        {
          name: '財務總監',
          avatar: '💼',
          text: '執行長！華爾街的外資機構突然無預警集體拋售我們公司的股票，股價瞬間暴跌 15%！那堵拋售的賣單牆太厚了！'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '惡意砸盤？組織護盤基金，部屬技能全開，給我把那堵恐怖的賣單牆全部吃掉！'
        }
      ],
      win: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '（看著股價 V 型反彈）外資倒多少我們就吃多少，成功穩住基本盤。'
        }
      ]
    }
  },
  {
    id: 78,
    title: '6-3：穩定員工信心',
    bossName: '內部動盪傳言',
    bossAvatar: '😎',
    bossHp: 6600,
    bossAtk: 132,
    bossMaxTimer: 4,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [
        {
          name: '組員 A',
          avatar: '👦',
          text: '聽說公司快被惡意收購了，CEO 位置可能不保，我們要不要先丟履歷啊？'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '（開啟全體員工廣播）各位同仁，我是執行長。只要我還在這個辦公室一天，公司的股價與你們的年終就不會少！大家跟我一起穩住！'
        }
      ],
      win: [ { name: '主角', avatar: '🧑‍💻', text: '全體員工士氣大振，內部動盪傳言全面平息。' } ]
    }
  },
  {
    id: 79,
    title: '6-4：惡意做空陰謀',
    bossName: '禿鷹基金經理人',
    bossAvatar: '👹',
    bossHp: 7200,
    bossAtk: 134,
    bossMaxTimer: 3,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [
        {
          name: '禿鷹基金經理人',
          avatar: '🦅',
          text: '（在電視財經節目上得意大笑）這家公司的架構已經腐爛了！我已經做空了五百萬股，他們死定啦！'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '惡意做空機構？竟然還鎖定我的血條上限、阻止我補血？看我怎麼發動超級軋空（Short Squeeze），讓你賠到破產！'
        }
      ],
      win: [
        {
          name: '禿鷹基金經理人',
          avatar: '🦅',
          text: '（看著暴漲的股價，雙手發抖）不……這不可能……我被爆倉了……我破產了……'
        }
      ]
    }
  },
  {
    id: 80,
    title: '6-5：臨時股東大會',
    bossName: '散戶代表們',
    bossAvatar: '😎',
    bossHp: 6800,
    bossAtk: 136,
    bossMaxTimer: 4,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [
        {
          name: '憤怒的散戶',
          avatar: '😡',
          text: '股價前幾天跌成那樣，執行長你要負責！還我血汗錢！'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '（走上發言台）各位股東請冷靜。請看大螢幕上我們海外分公司的獲利報告，以及下一季度的全球戰略。我會用股利向大家證明我的能力！'
        }
      ],
      win: [
        {
          name: '散戶代表',
          avatar: '🙌',
          text: '（台下掌聲雷動）執行長太棒了！我們全力支持執行長！'
        }
      ]
    }
  },
  {
    id: 81,
    title: '6-6：爭取創投大老支持',
    bossName: '冷漠的明星投資人',
    bossAvatar: '😎',
    bossHp: 6900,
    bossAtk: 138,
    bossMaxTimer: 4,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [
        {
          name: '明星投資人',
          avatar: '⭐',
          text: '執行長，要我相信你、成為你的白衣騎士投入百億資金，你必須在三分鐘內證明你有超越董事長的眼光。'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '沒問題。這場頂級資本對決，就用實力向你證明誰才是未來的掌舵者！'
        }
      ],
      win: [
        {
          name: '明星投資人',
          avatar: '⭐',
          text: '有意思。這張百億元支票你拿去吧，董事會上我投你一票。'
        }
      ]
    }
  },
  {
    id: 82,
    title: '6-7：準備抗辯資料',
    bossName: '堆積如山的法律訴狀',
    bossAvatar: '😎',
    bossHp: 7000,
    bossAtk: 140,
    bossMaxTimer: 4,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [
        {
          name: '法務總監',
          avatar: '⚖️',
          text: '執行長，反對派股東向法院聲請了暫時停止您的 CEO 職權，甩過來一千多頁的法律訴狀，我們必須在明天開庭前全部駁回！'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '法律戰是吧？所有人連夜加班，把對方的違法收購證據做成反訴狀，給我狠狠打回去！'
        }
      ],
      win: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '法院正式駁回對方的假處分聲請，職權保衛戰成功。'
        }
      ]
    }
  },
  {
    id: 83,
    title: '6-8：發動董事會彈劾案',
    bossName: '激進的外部股東',
    bossAvatar: '👹',
    bossHp: 7600,
    bossAtk: 142,
    bossMaxTimer: 3,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [
        {
          name: '激進外部股東',
          avatar: '🐺',
          text: '（在董事會上站起來）執行長，我們已經聯合了 30% 的股權。今天正式發動彈劾案！5 回合內你沒辦法自證清白，當場下台！'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '彈劾案倒數計時逼宮？！看我如何在倒數歸零前把你們的股權全部稀釋、徹底粉碎這場政變！'
        }
      ],
      win: [
        {
          name: '激進外部股東',
          avatar: '🐺',
          text: '（臉色慘白地坐下）彈劾案……被否決了……怎麼會這樣……'
        }
      ]
    }
  },
  {
    id: 84,
    title: '6-11：內部審查風暴',
    bossName: '法務總監',
    bossAvatar: '⚖️',
    bossHp: 7200,
    bossAtk: 144,
    bossMaxTimer: 4,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [
        { name: '法務總監', avatar: '⚖️', text: '你的這些擴張計畫，法務部全面封殺。' },
        { name: '主角', avatar: '🧑‍💻', text: '公司不能因為害怕風險而停止成長！' }
      ],
      win: [ { name: '法務總監', avatar: '⚖️', text: '你這是在玩火...但我無話可說了。' } ]
    }
  },
  {
    id: 85,
    title: '6-12：預算凍結',
    bossName: '財務長 (CFO)',
    bossAvatar: '💰',
    bossHp: 7800,
    bossAtk: 146,
    bossMaxTimer: 3,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [
        {
          name: '財務長 (CFO)',
          avatar: '💰',
          text: '我不管你想要創造什麼未來，現在一毛錢都不會批給你。'
        },
        { name: '主角', avatar: '🧑‍💻', text: '那我們就來看看誰掌握的數字比較真實。' }
      ],
      win: [
        {
          name: '財務長 (CFO)',
          avatar: '💰',
          text: '這...這個投資回報率...你是怎麼辦到的？'
        }
      ]
    }
  },
  {
    id: 86,
    title: '6-11：股權爭奪終局戰',
    bossName: '董事會投票權分配表',
    bossAvatar: '😎',
    bossHp: 7400,
    bossAtk: 148,
    bossMaxTimer: 4,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '糟糕！終局股權投票大會開始，盤面上卡紙、甩鍋、大餅、債務方塊隨機瘋狂湧現！這是我職涯五年來所有的夢魘大混戰……很好，今天新仇舊恨一併解決！'
        }
      ],
      win: [
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '（盤面大清空）所有的干擾垃圾全部清除，投票權過半，大局已定！'
        }
      ]
    }
  },
  {
    id: 87,
    title: '6-12：這家公司是我創立的',
    bossName: '創辦人暨董事長',
    bossAvatar: '👹',
    bossHp: 8000,
    bossAtk: 150,
    bossMaxTimer: 3,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [
        {
          name: '創辦人董事長',
          avatar: '🎩',
          text: '（坐在真皮沙發上，抽著雪茄冷笑）年輕人，你確實很厲害，竟然能走到我面前。但別忘了，這家公司是我創立的，我能把你扶上來當 CEO，就能把你徹底毀掉！接下資本市場的終局崩盤吧！'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '董事長，你的時代已經過去了！這家公司是無數每天通宵爆肝的員工撐起來的！今天，我就要用這兩個彩色黑洞的萬象坍縮，徹底改寫這家公司的規則！王座，換人坐了！'
        }
      ],
      win: [
        {
          name: '創辦人董事長',
          avatar: '🎩',
          text: '（雪茄掉在地上，雙眼失神）不……我的帝國……我的股份……竟然在瞬間全被清空了……'
        },
        {
          name: '主角',
          avatar: '🧑‍💻',
          text: '（緩緩坐上董事長的真皮辦公椅，雙手交叉）董事長，辛苦了。從今天起，您可以安心退休了。這家公司，現在由我接管。'
        }
      ]
    },
    systemPostWin: {
      title: '【🏆 完美結局 🏆】',
      badge: '👑 帝國大廈最高主宰',
      story: '大理石會議桌前，全體股東與員工向你鞠躬。背景的落地窗外，清晨的第一道曙光照亮了整座城市。你從當年的垃圾桶菜鳥，經歷無數次爆肝與政治洗禮，最終成為這棟帝國大廈的最高主宰。恭喜通關——全劇終！'
    }
  },
  {
    id: 88,
    title: '6-13：供應鏈斷鏈危機',
    bossName: '營運長 (COO)',
    bossAvatar: '⚙️',
    bossHp: 8200,
    bossAtk: 150,
    bossMaxTimer: 3,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [ { name: '營運長 (COO)', avatar: '⚙️', text: '你要的資源全被我調走了。' } ],
      win: [ { name: '營運長 (COO)', avatar: '⚙️', text: '你這傢伙根本是瘋子！' } ]
    }
  },
  {
    id: 89,
    title: '6-14：股價崩盤的威脅',
    bossName: '總經理 (President)',
    bossAvatar: '👨‍💼',
    bossHp: 8400,
    bossAtk: 150,
    bossMaxTimer: 3,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [ { name: '總經理', avatar: '👨‍💼', text: '明天股價就會崩盤！' } ],
      win: [ { name: '總經理', avatar: '👨‍💼', text: '你毀了我...' } ]
    }
  },
  {
    id: 90,
    title: '6-15：股東大會的前夕',
    bossName: '激進派大股東',
    bossAvatar: '🐺',
    bossHp: 8600,
    bossAtk: 150,
    bossMaxTimer: 3,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [ { name: '激進派大股東', avatar: '🐺', text: '我們會全面否決你的議案。' } ],
      win: [ { name: '激進派大股東', avatar: '🐺', text: '居然藏了這一手！' } ]
    }
  },
  {
    id: 91,
    title: '6-16：媒體的惡意併購風暴',
    bossName: '財經媒體大亨',
    bossAvatar: '📰',
    bossHp: 8800,
    bossAtk: 150,
    bossMaxTimer: 3,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [ { name: '財經媒體大亨', avatar: '📰', text: '頭條寫好了：『明星CEO慘遭逼宮』。' } ],
      win: [ { name: '主角', avatar: '🧑‍💻', text: '現在，我是你們的老闆了。' } ]
    }
  },
  {
    id: 92,
    title: '6-17：背叛的盟友',
    bossName: '前任副總經理',
    bossAvatar: '👔',
    bossHp: 9000,
    bossAtk: 150,
    bossMaxTimer: 3,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [ { name: '前任副總經理', avatar: '👔', text: '沒想到吧？我回來復仇了！' } ],
      win: [ { name: '前任副總經理', avatar: '👔', text: '不...我的復仇大計...' } ]
    }
  },
  {
    id: 93,
    title: '6-18：市場的劇烈震盪',
    bossName: '無形的金融風暴',
    bossAvatar: '⚠️',
    bossHp: 9200,
    bossAtk: 150,
    bossMaxTimer: 3,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [ { name: '系統提示', avatar: '⚠️', text: '全球市場崩盤！' } ],
      win: [ { name: '系統提示', avatar: '✅', text: '危機解除！' } ]
    }
  },
  {
    id: 94,
    title: '6-19：最後的談判桌',
    bossName: '神祕收購者',
    bossAvatar: '🕶️',
    bossHp: 9500,
    bossAtk: 150,
    bossMaxTimer: 3,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [ { name: '神祕收購者', avatar: '🕶️', text: '放棄抵抗吧。' } ],
      win: [ { name: '神祕收購者', avatar: '🕶️', text: '看來我低估了你。' } ]
    }
  },
  {
    id: 95,
    title: '6-20：王座的重量',
    bossName: '董事長 (Chairman)',
    bossAvatar: '👑',
    bossHp: 10000,
    bossAtk: 150,
    bossMaxTimer: 3,
    gridRows: 7,
    gridCols: 7,
    layout: [
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111',
      '1111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [
        { name: '董事長', avatar: '👑', text: '年輕人，這家公司還輪不到你做主。' },
        { name: '主角', avatar: '🧑‍💻', text: '時代變了，請您交出印信！' }
      ],
      win: [ { name: '董事長', avatar: '👑', text: '哈哈哈哈！好！交給你了！' } ]
    },
    systemPostWin: {
      title: '終極晉升',
      badge: '董事長 (Chairman)',
      story: '你擊敗了最後的阻礙，成功奪下了全公司的最高權力。你現在是這座商業帝國的唯一主宰：董事長 (Chairman)！\n\n感謝您的遊玩！'
    }
  },
  {
    id: 96,
    title: '測試關卡：和平沙盒',
    bossName: '測試專用木樁',
    bossAvatar: '🎯',
    bossHp: 999999,
    bossAtk: 0,
    bossMaxTimer: 99,
    gridRows: 8,
    gridCols: 8,
    layout: [
      '11111111',
      '11111111',
      '11111111',
      '11111111',
      '11111111',
      '11111111',
      '11111111',
      '11111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [
        {
          name: '開發者',
          avatar: '🛠️',
          text: '歡迎來到和平沙盒測試區！這裡會自動生成所有道具，供你自由測試與引爆。木樁不會攻擊，沒有時間壓力！'
        }
      ],
      win: []
    },
    isTest: true
  },
  {
    id: 99,
    title: '測試關卡：地獄沙盒',
    bossName: '奪命木樁',
    bossAvatar: '💀',
    bossHp: 999999,
    bossAtk: 99,
    bossMaxTimer: 1,
    gridRows: 8,
    gridCols: 8,
    layout: [
      '11111111',
      '11111111',
      '11111111',
      '11111111',
      '11111111',
      '11111111',
      '11111111',
      '11111111'
    ],
    allowedBlocks: [
      'MAIL',  'PPT',
      'TEA',   'PHONE',
      'KPI',   'FILE',
      'CLOCK', 'MONEY'
    ],
    dialogues: {
      start: [
        {
          name: '開發者',
          avatar: '🛠️',
          text: '歡迎來到地獄測試區！木樁現在每回合都會造成 99 點傷害，準備好測試 Game Over 介面了嗎？'
        }
      ],
      win: []
    },
    isTest: true
  }
];
