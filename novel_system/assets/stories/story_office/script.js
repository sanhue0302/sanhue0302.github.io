// ============================================================================
// 《職場重啟：逆襲黑絲經理與冰山總裁》 完整劇本 (自動由 levels.js 轉譯)
// 適用於 Monogatari 視覺小說引擎
// ============================================================================

monogatari.characters({
  'player': {
    name: '{{player_fullname}}',
    color: '#38bdf8'
  },
  'linwei': {
    name: '林薇',
    color: '#ec4899',
    sprites: {
      normal: 'assets/stories/story_office/assets/linwei_normal.png',
      flustered: 'assets/stories/story_office/assets/linwei_flustered.png',
      shy: 'assets/stories/story_office/assets/linwei_shy.png',
      dark: 'assets/stories/story_office/assets/linwei_dark.png'
    }
  },
  'gulingfrost': {
    name: '顧冷霜',
    color: '#a855f7',
    sprites: {
      normal: 'assets/stories/story_office/assets/gulingfrost_normal.png',
      flustered: 'assets/stories/story_office/assets/gulingfrost_flustered.png',
      shy: 'assets/stories/story_office/assets/gulingfrost_shy.png',
      dark: 'assets/stories/story_office/assets/gulingfrost_dark.png'
    }
  },
  'chairman': {
    name: '老董事長',
    color: '#eab308'
  },
  'marketing_head': {
    name: '行銷處長',
    color: '#ef4444'
  },
  'financier': {
    name: '財閥二代',
    color: '#10b981'
  }
});

monogatari.script({
  'Start': [
    $ => {
      monogatari.storage({
        player_fullname: '陸天成',
        linwei_subservience: 0,
        gulingfrost_favor: 0,
        power_index: 0,
        flags: {}
      });
    },
    'show scene assets/stories/story_office/assets/bg_office.jpg with fadeIn',
    '【重生記憶加載中】 睜開眼，熟悉的咖啡味與高跟鞋敲擊大理石地板的聲音傳來……',
    '【重生記憶加載中】 這一世，你不再是任人宰割的底層社畜。',
    {
      'Input': {
        'Text': '請輸入你在前世與今生的名字：',
        'Storage': 'player_fullname',
        'Validation': (input) => {
          return input.trim().length > 0;
        },
        'Save': (input) => {
          const name = input.trim() || '陸天成';
          monogatari.storage({
            player_fullname: name
          });
        },
        'Warning': '名字不能為空喔！'
      }
    },
    'player （很好的名字。從今天起，我將以 {{player_fullname}} 的身份重奪屬於我的一切！）',
    'jump Level_1'
  ],

  // ---------------------------------------------------------------------------
  // 關卡 1：1-1：刁難與反向拿捏
  // ---------------------------------------------------------------------------
  'Level_1': [
    'show banner 關卡 1-1 | 刁難與反向拿捏',
    'show scene assets/stories/story_office/assets/bg_office.jpg with fadeIn',
    'linwei 「喲，新來的菜鳥？長得倒是挺乾淨的，可惜進了我的部門就得懂規矩。去，幫我泡杯拿鐵，要脫脂奶、三分糖、溫度精確控制在 65 度！辦不到今天你就自己遞辭呈！」',
    'linwei （一邊說著，一邊故意調整了一下腿上的黑絲襪，眼神充滿輕蔑與傲慢。嘴角勾起一抹不易察覺的壞笑。）',
    'linwei （哼，先給這小子一個下馬威，看他長得白白淨淨的，稍微嚇一下應該就會乖乖聽話了，以後洗杯子跑腿的事全丟給他。）',
    'player （微微一笑，眼神毫不避諱地打量著 {{linwei.name}} 玲瓏有致的身材，眼神充滿侵略性。）',
    'player 「林經理放心，我不僅會泡茶，還知道妳很多『小秘密』，保證讓妳滿意。」',
    'player （雙手插口袋，顯得氣定神閒。）',
    'player （前世妳就用這招整跑了無數新人來立威。可惜啊 {{linwei.name}}，妳那點貪污和私生活的爛帳，我早就瞭若指掌了。）',
    $ => {
      monogatari.storage({ coffee_score: 0 });
    },
    '【咖啡考驗 1/4】 你走到茶水間，首先選擇調製咖啡的基底種類：',
    {
      'Choice': {
        'Opt1_A': {
          'Text': '☕ 經典義式濃縮拿鐵（Espresso + Steam Milk） (+25分)',
          'Do': $ => {
            monogatari.storage().coffee_score += 25;
            return 'jump Coffee_Q2';
          }
        },
        'Opt1_B': {
          'Text': '☕ 美式黑咖啡（Americano） (+0分)',
          'Do': 'jump Coffee_Q2'
        },
        'Opt1_C': {
          'Text': '☕ 特調焦糖瑪奇朵 (+10分)',
          'Do': $ => {
            monogatari.storage().coffee_score += 10;
            return 'jump Coffee_Q2';
          }
        }
      }
    }
  ],

  'Coffee_Q2': [
    '【咖啡考驗 2/4】 {{linwei.name}} 要求的牛奶種類是：',
    {
      'Choice': {
        'Opt2_A': {
          'Text': '🥛 低脂 / 脫脂鮮奶 (Skim Milk) (+25分)',
          'Do': $ => {
            monogatari.storage().coffee_score += 25;
            return 'jump Coffee_Q3';
          }
        },
        'Opt2_B': {
          'Text': '🥛 香濃全脂鮮奶 (+5分)',
          'Do': $ => {
            monogatari.storage().coffee_score += 5;
            return 'jump Coffee_Q3';
          }
        },
        'Opt2_C': {
          'Text': '🥛 健康燕麥奶 (+0分)',
          'Do': 'jump Coffee_Q3'
        }
      }
    }
  ],

  'Coffee_Q3': [
    '【咖啡考驗 3/4】 對於砂糖與甜度的調配比例：',
    {
      'Choice': {
        'Opt3_A': {
          'Text': '🍬 三分糖 / 微糖 (30% Sugar) (+25分)',
          'Do': $ => {
            monogatari.storage().coffee_score += 25;
            return 'jump Coffee_Q4';
          }
        },
        'Opt3_B': {
          'Text': '🍬 完全無糖 (0% Sugar) (+5分)',
          'Do': $ => {
            monogatari.storage().coffee_score += 5;
            return 'jump Coffee_Q4';
          }
        },
        'Opt3_C': {
          'Text': '🍬 半糖 (50% Sugar) (+10分)',
          'Do': $ => {
            monogatari.storage().coffee_score += 10;
            return 'jump Coffee_Q4';
          }
        }
      }
    }
  ],

  'Coffee_Q4': [
    '【咖啡考驗 4/4】 蒸汽打奶泡與溫度的精密控制：',
    {
      'Choice': {
        'Opt4_A': {
          'Text': '🔥 精確溫控至 65 度 (65°C Perfect Steam) (+25分)',
          'Do': $ => {
            monogatari.storage().coffee_score += 25;
            return 'jump Coffee_Evaluate';
          }
        },
        'Opt4_B': {
          'Text': '🔥 滾燙蒸煮至 85 度 (+0分)',
          'Do': 'jump Coffee_Evaluate'
        },
        'Opt4_C': {
          'Text': '🔥 溫熱 50 度 (+10分)',
          'Do': $ => {
            monogatari.storage().coffee_score += 10;
            return 'jump Coffee_Evaluate';
          }
        }
      }
    }
  ],

  'Coffee_Evaluate': [
    $ => {
      const score = monogatari.storage().coffee_score;
      if (score >= 75) {
        return 'jump Level_1_Success';
      } else {
        return 'jump Level_1_BadEnd';
      }
    }
  ],

'Level_1_BadEnd': [
    'show scene assets/stories/story_office/assets/bg_office.jpg with fadeIn',
    'linwei 「這什麼難喝的垃圾咖啡！？甜度不對、奶泡過燙、連奶的種類都搞錯！你這無能的菜鳥也敢進我們部門！？」',
    'linwei （啪的一聲將整杯燙咖啡甩在你的胸口，冰冷地踩著黑絲高跟鞋踏在你的背上，將你狠狠踩進地板。）',
    'linwei 「給我趴在地上洗乾淨地板！從今天開始，你就是我最下賤的奴隸！」',

    'player （你試圖反抗，卻被林薇一腳踩住後腦，整個人貼在地上動彈不得。）',
    'linwei （蹲下來抓住你的頭髮，強迫你抬起臉，語氣充滿輕蔑與支配欲。）',
    'linwei 「先學會怎麼跪好。再來是擦鞋——用你的舌頭。」',
    'linwei （她脫下沾滿咖啡的高跟鞋，直接壓在你嘴邊。）',
    'linwei 「舔乾淨，一點灰塵都不准留。每天早上第一件事就是給我跪舔鞋子、泡咖啡、提包、按摩。如果再犯錯，我就讓整個公司都知道你是我的擦鞋奴！」',

    'player （在林薇的淫威與羞辱下，你逐漸失去反抗的意志，開始卑微地伸出舌頭……）',
    'player （因為第一次下馬威失敗，你徹底淪為了 {{linwei.name}} 最下賤的奴隸與擦鞋奴，每天活在她的調教與羞辱之中，威嚴蕩然無存……）',

    '【💀 BAD ENDING 💀】 泡咖啡考驗未通過（得分未達 75 分），你淪為了奴隸社畜。',
    'end'
  ]

  'Level_1_Success': [
    'linwei （喝了一口咖啡後露出震驚的神色，隨後因為主角的突然靠近而驚慌失措。）',
    'linwei 「這……這口感！？你怎麼可能調得這麼完美？脫脂奶、三分糖、精確 65 度……等一下，你送咖啡過來就送過來，手摸哪裡呢！？放開……」',
    'linwei （身體劇烈僵硬了一下，呼吸變得急促。）',
    'linwei （天哪……這味道跟我在法國喝到的一模一樣！不對，這小子剛才指尖碰到了我的大腿……好燙！他、他想幹什麼！？）',
    'player （故意將少許咖啡灑在 {{linwei.name}} 緊繃的套裝窄裙上，隨後抽起紙巾，強勢而緩慢地替她擦拭大腿處的污漬，指尖隔著薄薄的黑絲傳遞溫度。）',
    'player 在她耳邊低語',
    'player 「林經理，妳大腿內側那顆紅痣，跟前世一樣性感呢。」',
    'linwei （臉頰瞬間通紅，雙手無力地抵在主角胸口，意圖反抗卻使不上力。）',
    'linwei 「你、你怎麼會知道……你到底是什麼人……快住手……要是被人看到……」',
    'linwei （嬌軀微微發軟，眼神開始迷離，雙唇輕啟。）',
    'linwei （他怎麼連我大腿內側有痣都知道！？難道他一直在暗中偷窺我？好羞恥……被他這樣碰著，我竟然有些心慌意亂……）',
    'linwei 「你……你給我等著！這件事沒完！」',
    'linwei （羞憤地推開主角，踩著高跟鞋倉皇逃出茶水間，心跳加速。）',
    'player （看著 {{linwei.name}} 慌亂逃跑的背影，嘴角勾起一抹玩味的冷笑：這只是個開始。）',
    'jump Level_2'
  ],

  // ---------------------------------------------------------------------------
  // 關卡 2：1-2：甩鍋文件的財務黑洞
  // ---------------------------------------------------------------------------
  'Level_2': [
    'show banner 關卡 1-2 | 甩鍋文件的財務黑洞',
    'show scene assets/stories/story_office/assets/bg_office.jpg with fadeIn',
    'linwei （啪的一聲將一份厚厚的文件摔在主角辦公桌上。）',
    'linwei 「哼！剛才的事算你走運！現在把這份跟遠大集團的合作書簽了！這專案今天必須送上去，你做負責人！」',
    'linwei （揉著仍有些發燙的臉頰，眼神閃過一絲狠毒。）',
    'linwei （遠大集團下個月就要爆雷倒閉了，我故意讓你當人頭負責人，到時候法律責任全在你身上，看你還怎麼囂張！）',
    'player （好整以暇地接過合約，打量著上面的條款。）',
    'player 「沒問題，林經理交代的事，我身為下屬，一定『好好處理』。」',
    'player （嘴角掛著自信而冰冷的冷笑。）',
    'player （想讓我背黑鍋？上輩子我就是這樣被妳害慘的。可惜妳不知道，遠大的對沖漏洞我早就倒背如流了，等著自食惡果吧。）',
    {
      'choice': {
        'Text': '【甩鍋合約決策】面對林薇甩出的遠大陷害合約，你打算如何回應？',
        'Option1': {
          'Text': '【反向對沖條款】重新擬定條款，將爆雷風險轉嫁至林薇個人股份擔保',
          'Do': 'jump Level_2_Success'
        },
        'Option2': {
          'Text': '【直接簽字提交】聽從經理交代，原封不動簽署合約',
          'Do': 'jump Level_2_BadEnd'
        }
      }
    }
  ],

  'Level_2_BadEnd': [
    'show scene assets/stories/story_office/assets/bg_office.jpg with fadeIn',
    'linwei （嘴角露出一抹狠毒冷笑。）',
    'linwei 「蠢貨！竟然真的原封不動簽了！下個月遠大爆雷，全公司五十億債務都由你這個負責人承擔！」',
    'player （幾週後，司法機關強制搜索辦公室，將你戴上手銬帶走。）',
    '【💀 BAD ENDING 💀】 替罪羊的悲慘下場 盲目相信敵人的後果，就是替人背負鉅額黑鍋，下半生在監獄中度過。',
    'end'
  ],

  'Level_2_Success': [
    'player （將平板電腦遞到 {{linwei.name}} 面前，上面顯示著已經蓋好數位印章的最終確認書。）',
    'player 「報告林經理，合約我重新擬定了。我利用反向對沖條款，把爆雷風險全部轉移到了妳個人的私人股份擔保上，而且已經送進總裁室審核了。」',
    'linwei （看著條款，嚇得臉色慘白，倒退了兩步。）',
    'linwei 「你說什麼！？你竟然私自改了條款！？那如果遠大集團倒閉，我豈不是要破產賠清全家產！？你瘋了！」',
    'linwei （雙腿一軟差點站不穩，扶著牆壁大口喘氣。）',
    'linwei （完蛋了……這條款封死了我所有的退路，要是顧總裁追查下來，我貪污的事情也會曝光……我該怎麼辦……）',
    'player （順勢將 {{linwei.name}} 推到辦公桌前，雙手撐在她的身體兩側，居高臨下地看著她因為恐懼而劇烈起伏的胸口。主角伸手輕捏她的下巴，邪魅一笑。）',
    'player 「林姐，別怕。只要妳乖乖聽我的話，下班後跟我好好『談談』，我就教妳怎麼解套。」',
    'linwei （咬著下唇，雙眼含淚又羞又怒地看著主角，最終低下驕傲的頭。）',
    'linwei 「好……我聽你的……只要你能幫我解套……」',
    'player （看著強撐高傲的經理終於向自己妥協低頭，嘴角勾起一抹冰冷的笑意：這只是第一步。）',
    '（因為在合約中展現了驚人的風險控制能力，你的名字第一次傳進了{{gulingfrost.name}}總裁的耳中。而{{linwei.name}}此時已落入你的手中。）',
    'show award 職位晉升通知 | 🎖️ 核心專案組員 | 🎖️',
    'jump Level_3'
  ],

  // ---------------------------------------------------------------------------
  // 關卡 3：2-1：冰山總裁的靈魂審判
  // ---------------------------------------------------------------------------
    'Level_3': [
    'show banner 關卡 2-1 | 冰山總裁的靈魂審判',
    'show scene assets/stories/story_office/assets/bg_office.jpg with fadeIn',
    'gulingfrost （踩著紅色高跟鞋，冷酷地走進會議室，冰冷的目光直射主角。）',
    'gulingfrost 「誰是新來的專案負責人？聽說你私自更改了遠大的合約？我們顧氏集團不需要自作聰明的人，給我滾出去！」',
    'gulingfrost （居高臨下地俯視著主角，雙手抱胸。）',
    'gulingfrost （一個剛入職的新人竟然敢動核心合約，現在的年輕人真是不知天高地厚。如果不嚴懲，我總裁的威嚴何在？）',
    {
      'choice': {
        'Text': '【面對總裁審判】冰山總裁要你立刻滾出去，你打算如何應對？',
        'Option1': {
          'Text': '【亮出五十億秘密流水帳】按下簡報筆，展示遠大私下轉移資產的實時流水',
          'Do': 'jump Level_3_Success'
        },
        'Option2': {
          'Text': '【當場拍桌大罵頂撞】斥責總裁不懂基層辛苦',
          'Do': 'jump Level_3_BadEnd'
        }
      }
    }
  ],

  'Level_3_BadEnd': [
    'show scene assets/stories/story_office/assets/bg_office.jpg with fadeIn',
    'gulingfrost （眼神瞬間冰冷刺骨，冷酷地按下保安對講機。）',
    'gulingfrost 「不知死活的人。保安，把他拖出去，通知 HR 發出全行業封殺令！」',
    '【💀 BAD ENDING 💀】 衝動的代價 在絕對的權勢面前毫無準備地咆哮，你被業界全面封殺，再也無法翻身。',
    'end'
  ],

  'Level_3_Success': [
    'player （不慌不忙地按下簡報筆，螢幕上跳出密密麻麻的財務線索圖。）',
    'player 「顧總，先別急著趕人。看看大螢幕吧，這是遠大集團私下轉移資產的秘密流水帳。如果按照原合約簽署，下個月顧氏將面臨五十億的虧損。」',
    'player （好整以暇地拉開椅子坐下。）',
    'player （上輩子妳高高在上，視我們如草芥。這輩子，我一上來就給妳送一份五十億的大禮，看妳還怎麼保持那副冰山臉。）',
    'gulingfrost （盯著實時數據與證據，冰冷的臉孔徹底皸裂，呼吸開始變得有些急促。）',
    'gulingfrost 「這……這些核心機密，你到底是從哪裡拿到的？這不可能……你究竟想要什麼？」',
    'gulingfrost （下意識地用文件擋在胸前，試圖阻擋主角那具有侵略性的視線。）',
    'gulingfrost （這份資料連我們高層動用私家偵探都查不到，他居然能弄到手……這個男人，到底藏了多少秘密？而且……他看我的眼神好放肆……）',
    'player （踏前一步，毫無畏懼地直視這位平日內無人敢對視的冰山美眸。因為距離極近，{{gulingfrost.name}}身上冷冽的香水味撲鼻而來。主角故意在遞交文件時，指尖挑逗般地在{{gulingfrost.name}}白皙細緻的手背上劃過，甚至大膽地幫她理了理胸前略微歪掉的套裝領口。）',
    'gulingfrost （耳根爬滿紅暈，急忙後退一步，惱羞成怒地喊。）',
    'gulingfrost 「放肆！你敢冒犯我！？明天早上，來我辦公室單獨匯報！」',
    'gulingfrost （緊緊抓著自己的衣領，羞怒交加地瞪著主角，酥胸劇烈起伏。）',
    'gulingfrost （心跳得好快……他剛剛竟然碰了我的領口！從來沒有男人敢對我做這種事，好大膽、好無禮……可是，為什麼我竟然沒有第一時間給他一巴掌……）',
    'player （看著高傲總裁失控紅透的耳根，嘴角微微揚起：明天早上？我很期待。）',
    'jump Level_4'
  ],

  // ---------------------------------------------------------------------------
  // 關卡 4：2-2：總裁辦公室的深夜封閉開發
  // ---------------------------------------------------------------------------
  'Level_4': [
    'show banner 關卡 4 | 深夜封閉開發',
    'show scene assets/stories/story_office/assets/bg_office.jpg with fadeIn',
    'gulingfrost （雙眼布滿血絲，在總裁辦公室內焦躁踱步，長髮凌亂。）',
    'gulingfrost 「伺服器核心防護網被鎖死，明早九點開盤若無法解鎖，顧氏將直接破產！你真的有把握嗎？」',
    'gulingfrost （緊張地站在你身後，雙手緊抓椅背，身體微微前傾。）',
    '$ score = 0',

    'player （你開始快速敲擊鍵盤，顧冷霜的吐息與體溫不斷從身後傳來。）',

    // 第一階段互動
    'gulingfrost （俯身靠近螢幕，柔軟的胸部輕輕壓在你肩上。）',
    {
      'Choice': {
        'Option1_1': {
          'Text': '專心分析病毒結構',
          'Do': 'jump Level_4_Interact1_A'
        },
        'Option1_2': {
          'Text': '回頭安撫她並順勢靠近',
          'Do': 'jump Level_4_Interact1_B'
        }
      }
    }
  ],

  'Level_4_Interact1_A': [
    '$ score += 25',
    'player （強迫自己專注在螢幕上，無視肩上的柔軟觸感。）',
    'jump Level_4_Stage2'
  ],

  'Level_4_Interact1_B': [
    '$ score += 5',
    'player （忍不住回頭，鼻尖幾乎碰上她的臉頰，兩人呼吸交錯。）',
    'gulingfrost （臉頰微紅，卻沒後退。）',
    'jump Level_4_Stage2'
  ],

  'Level_4_Stage2': [
    'gulingfrost （隨著時間過去，她越來越緊張，不自覺把手放在你另一邊肩膀上。）',

    // 第二階段互動
    {
      'Choice': {
        'Option2_1': {
          'Text': '快速輸入解鎖指令',
          'Do': 'jump Level_4_Interact2_A'
        },
        'Option2_2': {
          'Text': '低聲告訴她「相信我」並輕拍她的手',
          'Do': 'jump Level_4_Interact2_B'
        }
      }
    }
  ],

  'Level_4_Interact2_A': [
    '$ score += 25',
    'player （手指飛快操作，強忍住身後的誘人氣息。）',
    'jump Level_4_Stage3'
  ],

  'Level_4_Interact2_B': [
    '$ score += 10',
    'player （輕拍她的手背安慰，卻讓兩人貼得更近。）',
    'gulingfrost （心跳明顯加速，卻沒有抽開手。）',
    'jump Level_4_Stage3'
  ],

  'Level_4_Stage3': [
    'gulingfrost （時間越來越緊迫，她整個人幾乎貼在你背上，聲音帶著顫抖。）',

    // 第三階段互動
    {
      'Choice': {
        'Option3_1': {
          'Text': '冷靜排除最後防火牆',
          'Do': 'jump Level_4_Interact3_A'
        },
        'Option3_2': {
          'Text': '心急之下直接執行高風險指令',
          'Do': 'jump Level_4_Interact3_B'
        }
      }
    }
  ],

  'Level_4_Interact3_A': [
    '$ score += 25',
    'player （深呼吸保持冷靜，精準操作。）',
    'jump Level_4_Stage4'
  ],

  'Level_4_Interact3_B': [
    '$ score += 5',
    'player （因為心急，手指出現失誤，差點觸發警報。）',
    'gulingfrost （敏銳地發現你的異常，眼神瞬間銳利起來。）',
    'jump Level_4_Stage4'
  ],

  'Level_4_Stage4': [
    'gulingfrost （已經快到極限，雙手緊緊抓住你的肩膀，身體幾乎完全貼著你後背。）',

    // 第四階段互動（最終衝刺）
    {
      'Choice': {
        'Option4_1': {
          'Text': '穩穩執行最終解鎖',
          'Do': 'jump Level_4_Interact4_A'
        },
        'Option4_2': {
          'Text': '冒險使用最快速但危險的路徑',
          'Do': 'jump Level_4_Interact4_B'
        }
      }
    }
  ],

  'Level_4_Interact4_A': [
    '$ score += 25',
    'jump Level_4_Result'
  ],

  'Level_4_Interact4_B': [
    '$ score += 10',
    'player （心急之下操作略顯慌亂，時間大幅消耗。）',
    'jump Level_4_Result'
  ],

  'Level_4_Result': [
    // 分數判定
    {
      'If': 'score >= 70',
      'Then': 'jump Level_4_Success'
    },
    {
      'If': 'score < 70',
      'Then': 'jump Level_4_BadEnd'
    }
  ],

  'Level_4_BadEnd': [
    'show scene assets/stories/story_office/assets/bg_office.jpg with fadeIn',
    'gulingfrost （看著倒數計時歸零，系統仍未完全解鎖，臉色瞬間慘白。）',
    'gulingfrost 「時間……來不及了……你到底在做什麼！？」',
    'player （因為多次分心與心急操作，最終超時，病毒未能徹底清除。）',
    '【💀 BAD ENDING 💀】 救援失敗 因分心與操作失誤導致解鎖超時，顧氏集團於隔日開盤崩盤。',
    'end'
  ],

  'Level_4_Success': [
    'gulingfrost （看著最後一道防線被解除，系統恢復正常，整個人瞬間癱軟下來。）',
    'gulingfrost （她無力地向前倒去，直接倒進主角的懷裡，柔軟的身體緊緊貼著你。）',
    'player （你下意識伸手抱住她纖細的腰肢，兩人因為慣性而靠得極近。）',
    'player （她的臉龐幾乎貼上你的下巴，淡淡的清香與急促的呼吸交織在一起。）',

    'gulingfrost （突然抬頭想要說話，卻因為太過靠近，嘴唇不小心輕輕擦過你的唇角。）',
    'gulingfrost （！！）',
    'gulingfrost （雙眼瞬間睜大，臉頰以肉眼可見的速度迅速染上緋紅，冰山總裁的冷靜徹底崩壞。）',
    'gulingfrost 「……剛、剛才……那是……」',

    'player （你也因為這突如其來的柔軟觸感而心跳加速，卻裝作鎮定地低頭看著她。）',
    'player 「抱歉……剛才太緊張，沒注意距離。」',
    'player （嘴角卻忍不住微微上揚，手依然輕輕扶在她腰上沒有鬆開。）',

    'gulingfrost （耳根通紅，心跳如雷，卻沒有立刻推開你，只是低著頭輕聲喃喃。）',
    'gulingfrost （這個笨蛋……明明是意外……為什麼心跳得這麼厲害……）',
    'gulingfrost （她偷偷抬眼看了你一眼，眼神中多了前所未有的羞澀與異樣光彩。）',

    'show award 職位晉升通知 | 👔 專案組長 (Team Lead) | 👔',
    'player （你成功在最後一刻拯救了顧氏集團。{{gulingfrost.name}}對你的態度出現明顯改變，每次見到你時，眼神總會不自覺地飄忽，臉頰也會微微泛紅。）',
    'jump Level_5'
  ]

  // ---------------------------------------------------------------------------
  // 關卡 5：3-1：辦公桌下的主僕契約
  // ---------------------------------------------------------------------------
  'Level_5': [
    'show banner 關卡 3-1 | 辦公桌下的主僕契約',
    'show scene assets/stories/story_office/assets/bg_office.jpg with fadeIn',
    'linwei （將主角堵在無人的小會議室，雙手抱胸，氣勢凌人。）',
    'linwei 「{{player.name}}！你別以為你現在當了組長就能騎在我頭上！妳在外面收購遠大股份的事，要是被我知道有違法，我一定舉報你！」',
    'linwei （死死盯著主角，試圖從他的表情中找出破綻。）',
    'linwei （這小子晉升速度太快了，再這樣下去，我遲早會被他踩在腳下，必須抓到他的把柄反制他！）',
    {
      'choice': {
        'Text': '【林薇威脅舉報】被威脅舉報違法收購，你如何下達殺手鐧？',
        'Option1': {
          'Text': '【亮出三千萬帳本】掏出手機展示她私吞公款與回扣的流水紀錄',
          'Do': 'jump Level_5_Success'
        },
        'Option2': {
          'Text': '【向她低頭哀求】乞求經理高抬貴手手下留情',
          'Do': 'jump Level_5_BadEnd'
        }
      }
    }
  ],

  'Level_5_BadEnd': [
    'show scene assets/stories/story_office/assets/bg_office.jpg with fadeIn',
    'linwei （得意地大笑起來，眼神充滿嘲諷。）',
    'linwei 「哈哈！果然軟弱無能！既然被我抓到了小尾巴，我就順便讓你身敗名裂！」',
    '【💀 BAD ENDING 💀】 軟弱的代價 向敵人展示軟弱只會引來無情的宰割，你再次被林薇踩在腳下。',
    'end'
  ],

  'Level_5_Success': [
    'player （從口袋掏出手機，漫不經心地在{{linwei.name}}面前晃了晃，嘴角帶著嘲弄的微笑。）',
    'player 「林姐，省省吧。妳去年私吞外包商三千萬回扣、挪用公款給妳小白臉買跑車的帳本，現在就在我手機裡。只要我點個發送，妳下半輩子就在監獄裡度過吧。」',
    'linwei （臉色瞬間慘白，雙腿一軟，直接跪倒在主角面前，死死抓住主角的西裝褲管。）',
    'linwei 「你……你怎麼會有那些東西！？不要……求你不要發給總裁……我求你了……」',
    'linwei （絕望地低下頭，身體不斷顫抖。）',
    'linwei （全完了……他手裡的數據太詳細了，連銀行流水都有……要是曝光，我這輩子就全毀了……不，只要能保住地位，我付出什麼代價都可以！）',
    'player （{{linwei.name}}踩著高跟鞋，順從地蹲跪在辦公桌下，雙手交疊放在主角的膝蓋上，仰起那張精緻嫵媚的面孔，眼神迷離而順從。主角伸出皮鞋，輕輕勾起她的下巴：『很好，薇姐。以後開會時，妳就站在我身後，好好看著我是怎麼把這家公司吃下去的。』）',
    'linwei （溫順地閉上雙眼，任由主角的手指擺弄，臉頰泛起病態的潮紅。）',
    'linwei 「我知道了……主人……以後我什麼都聽你的……絕不背叛……」',
    'linwei （認命地吐出一口熱氣，雙手抓緊了主角的膝蓋。）',
    'linwei （屈辱……可是被他用腳尖挑著下巴，我的身體為什麼會興奮得在發抖……這個男人好可怕，我已經徹底淪為他的奴隸了……）',
    'player （主角拉開拉鍊，將粗硬肉棒送到她嘴邊。{{linwei.name}}順從張開紅唇，含住龜頭用力吸吮，舌頭靈活舔弄，逐漸深喉吞吐。）',
    'linwei （一邊深喉一邊用手指偷偷揉自己的濕潤蜜穴。）',
    'linwei 「咕……主人……好大……喉嚨要被插壞了……下面好癢……」',
    'player （主角將她拉起壓在桌上，從後面撕開黑絲猛烈插入，邊抽插邊拍打屁股。）',
    'linwei （高潮痙攣，蜜穴緊緊絞吸肉棒。）',
    'linwei 「啊……主人……幹我……把我當成肉便器……射進來……全部射給我……」',
    'jump Level_6'
  ],

  // ---------------------------------------------------------------------------
  // 關卡 6：3-2：派系大會的反間計
  // ---------------------------------------------------------------------------
  'Level_6': [
    'show banner 關卡 3-2 | 派系大會的反間計',
    'show scene assets/stories/story_office/assets/bg_office.jpg with fadeIn',
    'marketing_head （在大型高層會議上猛然拍桌，指著主角大聲斥責，眼神挑釁。）',
    'marketing_head 「顧總！這個新來的組長手伸得太長了，竟然干涉我們行銷部的預算！{{linwei.name}}經理，妳說，這傢伙是不是在挪用資源？妳最了解他了！」',
    'marketing_head （得意地靠回椅背上，等待著{{linwei.name}}落井下石。）',
    'marketing_head （哈哈，{{linwei.name}}跟我是一條船上的，只要{{linwei.name}}一開口附和，這小子今天必死無疑！）',
    {
      'choice': {
        'Text': '【派系逼宮】行銷處長挑釁質問林薇打壓你，你如何反擊？',
        'Option1': {
          'Text': '【眼神示意林薇倒戈突襲】令林薇將行銷部三年假帳摔在會議桌上',
          'Do': 'jump Level_6_Success'
        },
        'Option2': {
          'Text': '【當場自己與處長硬槓】拍桌咆哮咆哮與處長理論',
          'Do': 'jump Level_6_BadEnd'
        }
      }
    }
  ],

  'Level_6_BadEnd': [
    'show scene assets/stories/story_office/assets/bg_office.jpg with fadeIn',
    'marketing_head （冷笑一聲，獲得其他派系元老一致支持。）',
    'marketing_head 「顧總，您看到了，這種缺乏教養的人根本不配留在大廳！我建議立刻將他調往邊疆偏遠分公司！」',
    '【💀 BAD ENDING 💀】 邊疆流放的困局 缺乏內應的孤立無援，讓你被派系聯合流放至偏遠分公司。',
    'end'
  ],

  'Level_6_Success': [
    'linwei （立刻挺身而出，冷笑著打開資料夾，將一疊厚厚的行銷部弊端證據摔在桌中央。）',
    'linwei 「處長請自重！主角組長的方案完全是為了集團利益，反則是你們行銷部連續三年報表作假，這是我整理的行銷部爛帳，請總裁過目！」',
    'linwei （偷偷對著主席台上的主角眨了眨眼。）',
    'linwei （敢動我的人？處長，這份投名狀我就拿來送給主人當晉升的踏腳石了！）',
    'marketing_head （臉色由紅轉青，指著{{linwei.name}}的手指劇烈顫抖，整個人癱倒在椅子上。）',
    'marketing_head 「{{linwei.name}}！？妳這臭女人竟然背叛我！？虧我以前還給妳這麼多好處！」',
    'player （高層會議散會後的無人會議室內，{{linwei.name}}軟癱在主角懷裡，勾著主角的脖子，黑絲大腿跨坐在主角膝蓋上吐氣如蘭：『主人，人家剛剛表現得好不好？行銷處長那個老傢伙當場嚇傻了呢……今晚，要怎麼獎勵人家？』）',
    'linwei （被主角在大腿上狠狠捏了一把，發出一聲嬌嗔，隨後將頭埋進主角頸窩。）',
    'linwei 「啊……痛……主人輕一點……人家今晚隨便您折騰就是了……」',
    'linwei （迷醉地緊貼著主角，放棄了一切經理的自尊。）',
    'linwei （在剛剛開過高層會議的辦公桌上被他這樣抱著，真的好刺激……我已經離不開主人的調教了……）',
    'player （將她壓在會議桌上，撕開黑絲，粗大肉棒整根插入濕透蜜穴，大力抽插。）',
    'linwei （主動扭腰迎合，淫水四濺。）',
    'linwei 「啊……主人……好粗……插到最深處了……打我……把我當成母狗操……」',
    'linwei （全身痙攣達到劇烈高潮。）',
    'linwei 「主人……我好騷……要高潮了……射進來……把我子宮灌滿……」',
    'show award 職位晉升通知 | 💼 部門處長 (Director) | 💼',
    'player （你成功將前世的死對頭{{linwei.name}}變成了自己最忠誠的犬與床伴。在兩人的聯手下，敵對派系土崩瓦解，你成功晉升為行銷研發大處長。）',
    'jump Level_7'
  ],

  // ---------------------------------------------------------------------------
  // 關卡 7：4-1：高端酒會的英雄救美
  // ---------------------------------------------------------------------------
  'Level_7': [
    'show banner 關卡 4-1 | 高端酒會的英雄救美',
    'show scene assets/stories/story_office/assets/bg_office.jpg with fadeIn',
    'financier （端著一杯加了料的紅酒，不懷好意地逼近{{gulingfrost.name}}，眼神極度猥瑣。）',
    'financier 「冷霜啊，今晚這杯酒妳不喝，明天的董事會上，我們家族就會全面撤資，讓妳那個快破產的顧氏集團直接清算！哈哈，乖乖陪我過夜吧！」',
    'gulingfrost （穿著高檔露背晚禮服，氣得嬌軀發抖，美眸中滿是絕望與無助。）',
    'gulingfrost 「你無恥……放開我……」',
    'gulingfrost （絕望地閉上雙眼，正要強撐著接過酒杯。）',
    'gulingfrost （爸爸最近投資失敗，家族真的需要這筆資金……難道我{{gulingfrost.name}}今天真的要毀在這個人渣手裡嗎？誰來……誰來救救我……）',
    {
      'choice': {
        'Text': '【酒會危機】財閥二代拿撤資威脅顧總裁過夜，你如何抉擇？',
        'Option1': {
          'Text': '【奪酒潑臉 + 宣告51%控股】當眾將對方解僱並強勢護下總裁',
          'Do': 'jump Level_7_Success'
        },
        'Option2': {
          'Text': '【隱忍退縮旁觀】害怕得罪財閥巨頭不敢出頭',
          'Do': 'jump Level_7_BadEnd'
        }
      }
    }
  ],

  'Level_7_BadEnd': [
    'show scene assets/stories/story_office/assets/bg_office.jpg with fadeIn',
    'gulingfrost （美眸中滿是絕望與死寂，最終被財閥二代強行拉走。）',
    'gulingfrost （回頭看了遠處低頭懦弱的主角一眼，心徹底涼透。）',
    '【💀 BAD ENDING 💀】 失去一切的屈辱 懦弱讓你失去了最心愛的女人，顧氏集團隨後被清算吞併。',
    'end'
  ],

  'Level_7_Success': [
    'player （一隻有力的手臂橫空出世，奪過酒杯狠狠倒在財閥二代臉上，順勢將{{gulingfrost.name}}護在身後。）',
    'player 「撤資？好啊。因為就在十分鐘前，我已經用海外對沖基金，反向收購了你們家族企業 51% 的絕對控股權。現在，你被解僱了，滾！」',
    '（酒會酒店的總統套房內，{{gulingfrost.name}}因為後怕與酒精的催化，雙眼迷離。）',
    '（主角粗暴地將她按在奢華的大床上，刺啦一聲，撕開了那件昂貴的晚禮服，露出大片雪白細膩的肌膚。）',
    'player (俯身 me 在她耳邊吹氣)',
    'player 「冷霜，上輩子妳欠我的，今晚用妳的身體來還！」',
    'gulingfrost （美眸中溢出羞澀的淚水，軟綿綿地勾住主角的肩膀，熱烈地迎合上去。）',
    'gulingfrost 「輕、輕一點……主人……以後我什麼都聽你的……顧氏集團是你的，我……也是你的……」',
    'gulingfrost （雙腿緊緊纏住主角的腰，任由欲望將理智淹沒。）',
    'gulingfrost （我的禮服……被他撕開了……好羞恥……可是為什麼，看到他如此霸道的一面，我內心壓抑多年的情感竟然徹底爆發了……只要是他，被他怎樣對待都無所謂了……）',
    'player （將她修長美腿架在肩上，粗大肉棒對準濕滑穴口猛地整根插入，開始大力抽送。）',
    'gulingfrost （腰肢瘋狂扭動，主動迎合抽插。）',
    'gulingfrost 「啊……好深……主人……插到子宮了……好粗……我……我受不了……要高潮了……」',
    'player （將她翻成後入式，抓住馬尾大力撞擊，同時手指玩弄後庭。）',
    'gulingfrost（全身劇烈痙攣，高潮噴水。）',
    'gulingfrost 「後面……也想要……主人……把我兩個洞都操壞吧……射進來……灌滿我……」',
    'jump Level_8'
  ],

  // ---------------------------------------------------------------------------
  // 關卡 8：4-2：辦公室的禁斷之戀
  // ---------------------------------------------------------------------------
  'Level_8': [
    'show banner 關卡 4-2 | 辦公室的禁斷之戀',
    'show scene assets/stories/story_office/assets/bg_office.jpg with fadeIn',
    'gulingfrost （白天坐在總裁辦公椅上，看著走進來的主角，神色無比焦慮，眼眶微紅。）',
    'gulingfrost 「處長，我聯絡過董事會，我父親（老董事長）發現我們的關係了，他明天要召開全體股東大會，以『以權謀私』的罪名罷免你！你……你快逃吧！」',
    'gulingfrost （緊緊抓著辦公桌邊緣，指甲發白。）',
    'gulingfrost （我不要他離開我！如果老爸非要逼走他，我大不了這個總裁不做了！但我好怕他受傷害……）',
    {
      'choice': {
        'Text': '【罷免危機】老董事長明日將全體罷免你，你如何選擇？',
        'Option1': {
          'Text': '【反手鎖門霸道宣誓】宣示拿下董事長之位，白天秘書深夜主宰',
          'Do': 'jump Level_8_Success'
        },
        'Option2': {
          'Text': '【聽從勸告連夜收拾行李】選擇避其鋒芒離開總部逃跑',
          'Do': 'jump Level_8_BadEnd'
        }
      }
    }
  ],

  'Level_8_BadEnd': [
    'show scene assets/stories/story_office/assets/bg_office.jpg with fadeIn',
    'gulingfrost （看著主角離去的背影，眼淚流乾，徹底失望。）',
    'player （你再次踏上了流浪的街頭，重蹈前世碌碌無為的社畜慘狀。）',
    '【💀 BAD ENDING 💀】 逃跑者的餘生 臨陣脫逃讓你失去了踏上巔峰的唯一機會，終生平庸。',
    'end'
  ],

  'Level_8_Success': [
    'player （走過去反手鎖上辦公室大門，拉上百葉窗，緩步走到{{gulingfrost.name}}辦公椅後方。）',
    'player 「逃？在我的字典裡沒有這個字。冷霜，既然妳父親想玩，那我就把他的董事長之位也給拿下來。不過現在，是白天的辦公時間吧？」',
    'gulingfrost （嘴上抗拒著，卻順從地跨坐在主角大腿上，雙手緊緊抓著主角的肩膀。）',
    'gulingfrost 「你、你想幹嘛？這可是總裁辦公室，隨時會有人進來匯報工作……啊！唔……」',
    'gulingfrost （死死埋進主角頸窩，全身軟得像一灘水。）',
    'gulingfrost （他、他竟然要在辦公桌上……天啊，外面隨時會有秘書走過……好刺激……不要……）',
    'player （坐在巨大的總裁辦公椅上，掀起{{gulingfrost.name}}的高檔套裝窄裙，將她緊緊拉進懷裡。）',
    'linwei （辦公桌上的內線電話突然響起{{linwei.name}}經理的聲音。）',
    'linwei 「總裁，老董事長在會議室催您過去了……」',
    'player （嘴角勾起一抹壞笑，手上的動作完全沒有停下，反而加大了衝擊的力道。）',
    'gulingfrost （一邊承受著主角粗暴的衝擊，一邊死死咬著下唇，聲音顫抖地對著電話回應。）',
    'gulingfrost 「知、知道了……我……我馬上過去……嗯啊……」',
    'gulingfrost （極致的背德與刺激感讓她的理智瞬間徹底淪陷。）',
    'gulingfrost （全身緊縮，達到劇烈高潮。）',
    'gulingfrost 「嗯啊……要去了……外面有人……好刺激……主人射吧……射滿我……」',
    'player （將她壓在辦公桌上，從後面猛插，同時伸手玩弄乳頭和陰蒂。）',
    'gulingfrost （連續高潮，迎接內射。）',
    'gulingfrost 「主人……我已經是你的了……隨時在辦公室操我……啊——！」',
    'show award 職位晉升通知 | 👑 副總經理 (VP) | 👑',
    'player （你已經將這棟大廈最美麗、最高貴的兩位女性變成了妳的私產。妳正式升任副總經理，與老董事長的最終決戰即將來臨。）',
    'jump Level_9'
  ],

  // ---------------------------------------------------------------------------
  // 關卡 9：5-1：終局董事會逼宮
  // ---------------------------------------------------------------------------
  'Level_9': [
    'show banner 關卡 5-1 | 終局董事會逼宮',
    'show scene assets/stories/story_office/assets/bg_office.jpg with fadeIn',
    'chairman （在最高股東大會上重重敲擊法槌，眼神冰冷嚴厲。）',
    'chairman 「各位股東，這個新升上來的副總經理狼子野心，竟然妄想侵吞我們顧氏家族的控制權！我代表 48% 的保守派股權，提議立刻將他罷免並移送法辦！」',
    'gulingfrost （作為執行總裁坐在主席台旁，嬌軀微顫，眼神中卻滿是對主角的堅定與愛意。）',
    'linwei （作為行銷大處長站在主角身後，手中緊握著足以一擊必殺的核心資料。）',
    {
      'choice': {
        'Text': '【終局股東會逼宮】老董事長聯合48%保守派發起最終罷免，你如何絕殺？',
        'Option1': {
          'Text': '【顧總15%股權轉讓 + 林薇司法帳本】雙管齊下反手收購控制權打倒老董事長',
          'Do': 'jump Level_9_Success'
        },
        'Option2': {
          'Text': '【言語感化老董事長】講溫情商道試圖勸服老股東',
          'Do': 'jump Level_9_BadEnd'
        }
      }
    }
  ],

  'Level_9_BadEnd': [
    'show scene assets/stories/story_office/assets/bg_office.jpg with fadeIn',
    'chairman （冷笑著重重敲擊法槌。）',
    'chairman 「講道理？商業戰場只看股權！投票結束，48%反對，正式將你逐出董事會！」',
    '【💀 BAD ENDING 💀】 功虧一潰 在最終決戰心慈手軟，讓你痛失大好河山，被老派勢力清理出局。',
    'end'
  ],

  'Level_9_Success': [
    'player （冷笑著站起身，將一份股份轉讓書與司法舉報信重重拍在會議桌中央。）',
    'player 「董事長，您的 48% 很了不起嗎？顧總裁已經將她名下的 15% 股權全部轉讓給我，加上我海外收購的 38%，我手裡擁有 53% 的絕對控股權！現在，被解僱的人是您！」',
    'linwei （立刻走上前，將老董事長過去二十年逃稅漏稅的財務帳本交給現場的司法稽查人員。）',
    'chairman （癱倒在椅上，老臉慘白無血色。）',
    'chairman 「你……你竟然把我女兒也洗腦了……我輸了……」',
    'gulingfrost+linwei 「恭喜主人登頂帝國主宰！」',
    'jump Level_10'
  ],

  // ---------------------------------------------------------------------------
  // 關卡 10：5-2：主宰一切的王座
  // ---------------------------------------------------------------------------
  'Level_10': [
    'show banner 關卡 5-2 | 主宰一切的王座',
    'show scene assets/stories/story_office/assets/bg_office.jpg with fadeIn',
    'player （站在這棟大廈頂層的奢華總裁辦公室，俯瞰著全城市的夜景。）',
    'gulingfrost （身穿緊身總裁黑絲套裝，溫順地半跪在主角右腿旁，為主角遞上紅酒。）',
    'linwei （身穿熱辣處長套裝，嬌媚地貼在主角左臂旁，幫主角揉肩。）',
    {
      'choice': {
        'Text': '【王座抉擇】站在商業權力的頂峰，你打算如何書寫未來的命運？',
        'Option1': {
          'Text': '【登頂帝國至高主宰】獨攬大權，收雙美入後宮，成為商界神話',
          'Do': 'jump Ending_Master'
        },
        'Option2': {
          'Text': '【金盆洗手瀟灑退隱】將公司交給雙美管理，帶走百億資產環遊世界',
          'Do': 'jump Ending_Freedom'
        }
      }
    }
  ],

'Ending_Freedom': [
    'show scene assets/stories/story_office/assets/bg_office.jpg with fadeIn',
    'player （夜色籠罩頂層辦公室，你看著眼前兩位曾經高高在上的女人，如今卻徹底屬於你。）',
    'player 「這座大廈就交給妳們了。我要去享受我真正的自由人生。」',
    'linwei+gulingfrost （眼神瞬間黯淡，卻帶著深深的不捨與依戀。）',
    'gulingfrost 「主人……真的要走嗎？」',
    'linwei 「至少……在離開之前，讓我們最後一次好好侍奉您……」',

    'player （你點頭微笑，一把將兩人拉進懷裡。這將會是最後一次，卻也是最激烈的一次。）',

    {
      'Choice': {
        'Option1_1': {
          'Text': '【最後的寵愛】同時愛撫兩女',
          'Do': 'jump Ending_Freedom_Stage1_A'
        },
        'Option1_2': {
          'Text': '【激烈告別】把她們壓在辦公桌上',
          'Do': 'jump Ending_Freedom_Stage1_B'
        }
      }
    }
  ],

  'Ending_Freedom_Stage1_A': [
    'player （你坐在總裁椅上，讓顧冷霜坐在你左腿，林薇坐在右腿，雙手同時伸進她們的裙底，熟練地玩弄兩人早已濕潤的蜜穴。）',
    'gulingfrost （輕咬下唇，冰山臉龐染上紅暈，腰肢無助地扭動。）',
    'linwei （主動親吻你的脖子，豐滿的胸部在你胸前磨蹭，嬌喘連連。）',
    'jump Ending_Freedom_Stage2'
  ],

  'Ending_Freedom_Stage1_B': [
    'player （你將兩女同時壓在寬大的辦公桌上，從後方輪流猛烈抽插，啪啪的撞擊聲響徹整個辦公室。）',
    'gulingfrost 「啊……主人……好深……最後一次也要把冷霜操壞……！」',
    'linwei 「用力……！把薇薇的騷穴操腫……讓我們記住主人一輩子……！」',
    'jump Ending_Freedom_Stage2'
  ],

  'Ending_Freedom_Stage2': [
    'player （激情持續升溫，你不斷更換姿勢，把她們操得高潮連連，愛液把桌面弄得一片狼藉。）',
    {
      'Choice': {
        'Option2_1': {
          'Text': '【專注顧冷霜】最後一次徹底征服冰山總裁',
          'Do': 'jump Ending_Freedom_Choice2_A'
        },
        'Option2_2': {
          'Text': '【專注林薇】最後一次狂幹傲慢經理',
          'Do': 'jump Ending_Freedom_Choice2_B'
        },
        'Option2_3': {
          'Text': '【三人同時】最後的極致交融',
          'Do': 'jump Ending_Freedom_Choice2_C'
        }
      }
    }
  ],

  'Ending_Freedom_Choice2_A': [
    'gulingfrost （被你抱起對著窗戶猛烈抽插，整個人懸空，被你操得哭叫出聲，平時的冰冷形象徹底崩壞。）',
    'gulingfrost 「主人……！冷霜愛你……永遠只屬於你……啊——！！」',
    'jump Ending_Freedom_Stage3'
  ],

  'Ending_Freedom_Choice2_B': [
    'linwei （被你壓在玻璃窗前，從後方猛幹，胸部緊貼冰冷的玻璃，浪叫聲幾乎傳遍整棟大樓。）',
    'linwei 「主人……操死我吧……！最後一次也要射滿薇薇……！」',
    'jump Ending_Freedom_Stage3'
  ],

  'Ending_Freedom_Choice2_C': [
    'player （你躺在桌上，讓顧冷霜坐在你臉上讓你舔弄，林薇則跨坐在你腰上狂野地上下套弄。）',
    'gulingfrost+linwei （兩女互相親吻、揉胸，在你身上徹底放縱，達到一次又一次的高潮。）',
    'jump Ending_Freedom_Stage3'
  ],

  'Ending_Freedom_Stage3': [
    'player （你感覺即將到達頂點，將兩女拉到面前跪好。）',
    'player （粗長的肉棒在兩女臉前跳動，她們主動伸出舌頭，熱情地舔弄侍奉。）',
    {
      'Choice': {
        'Option3_1': {
          'Text': '【內射告別】輪流中出她們',
          'Do': 'jump Ending_Freedom_Finale'
        },
        'Option3_2': {
          'Text': '【顏射吞精】射滿她們的臉與嘴巴',
          'Do': 'jump Ending_Freedom_Finale'
        }
      }
    }
  ],

  'Ending_Freedom_Finale': [
    'gulingfrost+linwei （高潮中緊緊抱住你，身體劇烈顫抖，接受你最後的熱燙贈禮。）',
    'gulingfrost 「主人……我們會好好守住這一切……等您隨時回來……」',
    'linwei 「不管您在世界的哪個角落……我們永遠是您的……」',
    'player 「這座大廈就交給妳們了。我要去享受我真正的自由人生。」',
    'linwei+gulingfrost 「主人……我們會為您守護好這片江山，隨時等您歸來！」',
    '',
    '【🎉 SPECIAL GOOD ENDING 🎉】 瀟灑神仙眷侶',
    '你選擇了超脫權力，功成身退。在離開前給予了她們最激烈、最難忘的最後一次激情。',
    '帶著無限的財富與愛人的忠誠，你開啟了無拘無束環遊世界的浪漫傳奇。',
    'end'
  ]

  'Ending_Master': [
    'show scene assets/stories/story_office/assets/bg_office.jpg with fadeIn',
    'player （你坐在象徵權力巔峰的總裁椅上，左右兩邊分別是曾經高高在上的顧冷霜與林薇。）',
    'player （如今她們都換上了極度性感的秘書服裝，黑色吊帶絲襪、開胸短裙，溫順地跪坐在你身側。）',
    {
      'Choice': {
        'Option1_1': {
          'Text': '【命令顧冷霜】讓冰山總裁為你倒酒',
          'Do': 'jump Ending_Master_Choice1_A'
        },
        'Option1_2': {
          'Text': '【命令林薇】讓傲慢經理為你捶腿',
          'Do': 'jump Ending_Master_Choice1_B'
        }
      }
    }
  ],

  'Ending_Master_Choice1_A': [
    'gulingfrost （雙手捧著酒杯，恭敬地跪行上前，將杯沿抵在你唇邊，冰藍眼眸中滿是迷戀。）',
    'gulingfrost 「主人，請用……冷霜親自用嘴暖過的紅酒。」',
    'jump Ending_Master_Stage2'
  ],

  'Ending_Master_Choice1_B': [
    'linwei （跪在你腿邊，豐滿胸部貼著你大腿，纖手熟練按摩，同時故意用乳溝夾住你的小腿磨蹭。）',
    'linwei 「主人，力道如何？薇薇可以用身體任何部位為您服務……」',
    'jump Ending_Master_Stage2'
  ],

  'Ending_Master_Stage2': [
    'player （看著兩人爭寵的模樣，你嘴角揚起冷笑，決定進一步測試她們的順從度。）',
    {
      'Choice': {
        'Option2_1': {
          'Text': '【服從測試】命令她們互相深吻並愛撫',
          'Do': 'jump Ending_Master_Choice2_A'
        },
        'Option2_2': {
          'Text': '【姿態展示】命令她們同時脫衣跪伏',
          'Do': 'jump Ending_Master_Choice2_B'
        },
        'Option2_3': {
          'Text': '【口技侍奉】讓她們輪流為你口交',
          'Do': 'jump Ending_Master_Choice2_C'
        }
      }
    }
  ],

  'Ending_Master_Choice2_A': [
    'gulingfrost （臉頰微紅，仍順從地捧住林薇的臉，兩人唇瓣交疊，舌頭激烈糾纏，口水拉絲。）',
    'linwei （主動伸手探入顧冷霜的衣領，揉捏她雪白的胸部，發出嬌媚的喘息。）',
    'player （兩女在你面前上演淫靡的百合戲碼，逐漸情動，身體發燙。）',
    'jump Ending_Master_Stage3'
  ],

  'Ending_Master_Choice2_B': [
    'gulingfrost+linwei （同時脫下秘書外套與上衣，只剩性感內衣與吊帶襪，跪伏在你腳邊，高高翹起豐滿的臀部。）',
    'gulingfrost+linwei 「主人……請盡情欣賞與使用我們的身體……」',
    'jump Ending_Master_Stage3'
  ],

  'Ending_Master_Choice2_C': [
    'gulingfrost （主動含住你的龜頭，冰山臉龐卻極度淫蕩地深喉。）',
    'linwei （在旁舔弄你的囊袋與棒身，兩人輪流吞吐，舌技高超，口水四溢。）',
    'jump Ending_Master_Stage3'
  ],

  'Ending_Master_Stage3': [
    'player （你將兩女拉到寬大的辦公桌上，命令她們呈現各種下流姿勢。）',
    'player （你粗暴地撕開她們最後的遮蔽，露出早已濕透的粉嫩蜜穴。）',
    {
      'Choice': {
        'Option3_1': {
          'Text': '【專注顧冷霜】狠狠侵犯冰山總裁',
          'Do': 'jump Ending_Master_Choice3_A'
        },
        'Option3_2': {
          'Text': '【專注林薇】狂幹傲慢經理',
          'Do': 'jump Ending_Master_Choice3_B'
        },
        'Option3_3': {
          'Text': '【雙飛前戲】同時玩弄兩女',
          'Do': 'jump Ending_Master_Choice3_C'
        }
      }
    }
  ],

  'Ending_Master_Choice3_A': [
    'gulingfrost （被你壓在桌上，雙腿被扛在肩上，你粗長的肉棒猛地整根沒入她緊窄的穴內。）',
    'gulingfrost 「啊……！好粗……主人……要把冷霜的子宮頂穿了……！」',
    'gulingfrost （一向冰冷的總裁此刻浪叫連連，陰道劇烈收縮，死死吸吮著入侵者。）',
    'jump Ending_Master_Stage4'
  ],

  'Ending_Master_Choice3_B': [
    'linwei （被你從後方狗爬式插入，肥美的臀肉被撞得啪啪作響，浪水順著大腿狂流。）',
    'linwei 「主人……操死薇薇吧……！啊……好深……騷穴要壞掉了……！」',
    'jump Ending_Master_Stage4'
  ],

  'Ending_Master_Choice3_C': [
    'player （你一手手指抽插顧冷霜的蜜穴，一手揉捏林薇的陰蒂，同時讓她們互相親吻。）',
    'gulingfrost+linwei （兩女被你玩弄得嬌喘連連，身體不停顫抖，很快便同時達到小高潮。）',
    'jump Ending_Master_Stage4'
  ],

  'Ending_Master_Stage4': [
    'player （你將兩女徹底調教成只剩下情慾的樣子，房間內充滿淫靡的水聲與肉體碰撞聲。）',
    {
      'Choice': {
        'Option4_1': {
          'Text': '【變換姿勢】後入式同時抽插',
          'Do': 'jump Ending_Master_Choice4_A'
        },
        'Option4_2': {
          'Text': '【語言調教】讓她們大聲說出臣服誓言',
          'Do': 'jump Ending_Master_Choice4_B'
        },
        'Option4_3': {
          'Text': '【高潮連鎖】強制她們連續高潮',
          'Do': 'jump Ending_Master_Choice4_C'
        }
      }
    }
  ],

  'Ending_Master_Choice4_A': [
    'player （你讓她們並排跪在桌上，從後方輪流猛烈抽插，時而連續衝刺同一人，時而快速切換。）',
    'gulingfrost+linwei （兩女同時被操得神志模糊，浪叫不斷，蜜穴不斷噴出淫水。）',
    'jump Ending_Master_Stage5'
  ],

  'Ending_Master_Choice4_B': [
    'gulingfrost 「主人……冷霜永遠是您的性奴……子宮只接受您的精液……！」',
    'linwei 「薇薇的騷穴和嘴巴……全部都是主人的玩具……請隨時使用……！」',
    'player （聽著她們下賤的宣言，你更加興奮地加速衝刺。）',
    'jump Ending_Master_Stage5'
  ],

  'Ending_Master_Choice4_C': [
    'player （你熟練地刺激她們的G點與陰蒂，很快將兩女送上接連不斷的高潮，身體劇烈痙攣，失禁般噴出大量愛液。）',
    'gulingfrost+linwei （高潮中眼淚直流，卻露出極度滿足的痴態。）',
    'jump Ending_Master_Stage5'
  ],

  'Ending_Master_Stage5': [
    'player （你感覺即將到達極限，決定給予她們最終的獎賞。）',
    {
      'Choice': {
        'Option5_1': {
          'Text': '【內射高潮】同時中出兩人',
          'Do': 'jump Ending_Master_Finale'
        },
        'Option5_2': {
          'Text': '【顏射吞精】讓她們跪著接受',
          'Do': 'jump Ending_Master_Finale'
        },
        'Option5_3': {
          'Text': '【無盡之夜】宣告這才只是開始',
          'Do': 'jump Ending_Master_Finale'
        }
      }
    }
  ],

  'Ending_Master_Finale': [
    'gulingfrost （雙腿死死纏住你的腰，子宮口被龜頭狠狠撞開。）',
    'gulingfrost 「啊……好深……要去了……主人射進來……把冷霜灌滿……！」',
    'linwei （跪在旁邊舔弄結合處，同時被你手指玩弄得再次高潮。）',
    'linwei 「主人……射給我們……我們要喝您的精液……！」',
    'gulingfrost+linwei （同時達到最強高潮，身體劇烈抽搐）「主人——！！我們永遠是您的寵物……一生一世侍奉您！」',
    '【🏆 完美結局 🏆】 👑 帝國大廈至高神格',
    '恭喜通關！你成功將昔日高高在上的兩女徹底調教成只屬於你的專屬性奴。從今以後，她們將在這間頂層辦公室裡，日夜侍奉你，滿足你所有的慾望。',
    'end'
  ]
});
