// 註冊角色與立繪
monogatari.characters({
  'player': {
    name: '{{player_fullname}}',
    color: '#38bdf8'
  },
  'hoshino': {
    name: '星野燈',
    color: '#ec4899',
    sprites: {
      normal: 'assets/stories/story_hoshino/assets/hoshino_normal.png',
      flustered: 'assets/stories/story_hoshino/assets/hoshino_flustered.png',
      shy: 'assets/stories/story_hoshino/assets/hoshino_shy.png',
      dark: 'assets/stories/story_hoshino/assets/hoshino_dark.png'
    }
  }
});

// 註冊故事劇本
monogatari.script({
  'Start': [
    $ => {
      // 初始化數值與儲存變數
      monogatari.storage({
        player_fullname: '觀看者',
        player_nickname: '主角',
        heroine_fullname: '星野燈',
        heroine_nickname: '小燈',
        favorability: 0, // 好感度 / 依賴度
        pressure: 0,     // 心理壓迫感 / 支配度
        vigilance: 50,   // 戒心值
        distance: 50,    // 距離感
        flags: {}
      });
    },

    'jump Chapter1_Encounter'
  ],

  // ---------------------------------------------------------------------------
  // 第一章：邂逅篇 (後台見面會與防線擊破)
  // ---------------------------------------------------------------------------
  'Chapter1_Encounter': [
    'show scene assets/stories/story_hoshino/assets/bg_backstage.jpg with fadeIn',
    'play music bgm_suspense loop',
    '演唱會場館 – 休息室後台通道。空氣中瀰漫著剛結束熱烈演出的輕微汗香與舞台煙霧餘溫，走廊燈光有些昏暗。',
    '（演唱會結束的廣播聲在後台迴盪。作為獲得 VIP 幸運抽獎特權的「幸運粉絲」，你被工作人員引導至後台休息室門前。）',
    '（門輕輕開啟，剛結束高強度表演的國民偶像星野燈站在裡面。她身穿白色舞台短裙，柔順的長髮略顯凌亂地披在肩頭，鎖骨微濕，正用毛巾輕輕擦拭著細汗。）',

    'show character hoshino normal at center with fadeIn animated character-idle',
    'hoshino 那個……你是今天的幸運粉絲對吧？很高興見到你！',
    'hoshino 對了，我該怎麼稱呼你呢？方便告訴我你的全名和小名嗎？',

    // 🎯 女主角親自詢問名稱的動態輸入框
    {
      'Input': {
        'Text': '星野燈：「能告訴我你的全名是...？」',
        'Storage': 'player_fullname',
        'Default': '觀看者'
      }
    },
    {
      'Input': {
        'Text': '星野燈：「那平常大家或朋友都怎麼叫你的小名暱稱呢...？」',
        'Storage': 'player_nickname',
        'Default': '主角'
      }
    },

    'hoshino {{player_fullname}}……還有朋友叫你{{player_nickname}}對吧？辛苦你了，特地等到這麼晚……',
    '（她抬起頭，露出標誌性的清純微笑。但那雙清澈的眼眸深處，隱約透出一絲長期面對鏡頭與公眾的疲憊與習慣性的防備。）',

    'player 不辛苦。能近距離見到妳，對我來說是夢想成真。從妳三年前出道第一場地下 Live 開始，我就一直關注著妳。',
    '（你平靜地看著她，眼神沒有一般粉絲見到偶像時的狂熱，反而帶著一種異常的冷靜。這份冷靜讓燈微微一愣。）',

    'show character hoshino flustered at center',
    'hoshino 三年前……？原來這麼早以前就在支持我了呀，真的很謝謝你……',

    'player 我關注的不只是舞台上的妳。例如……妳剛才在舞台上跳第三首歌時，左邊第三顆扣子稍微鬆脫了；還有，妳今天用的香水是 Diptyque 的無花果味——這好像不是妳官方採訪時說過喜歡的柑橘香。',
    '（燈的表情瞬間凍結，微笑微微僵住，雙手下意識地縮回胸前。）',

    'hoshino 你知道得……好像比我經紀人還多呢。這算是……極致粉絲的觀察力嗎？',
    'player 我只是比任何人都想了解『真正的星野燈』。包含舞台下、鏡頭外，最真實的妳。',
    '（你從懷中取出預先準備好的禮物盒，遞到了她的面前。）',
    'player 這是我準備的小禮物，希望妳會喜歡。',
    '（燈猶豫了一下，指尖輕微顫抖地接過禮物盒。當她的指尖不小心觸碰到你的手背時，能明顯感受到她皮膚的滾燙與緊繃。）',
    '（她打開盒子的瞬間，呼吸驟然停頓——裡面放著一張稍微泛黃的照片複本，那是她小學時期尚未褪去青澀、甚至有些陰沉與黑歷史感的照片。）',

    'hoshino 這、這張……你從哪裡拿到的！？',
    '（她的聲音因為慌亂而微微提高，雙眼睜大看向你，眼裡滿是驚恐與動搖。）',

    {
      'Choice': {
        'Option_A': {
          'Text': '「別緊張，這代表我連妳最不完美的一面都完全接納。」 (戒心值 -10 / 依賴值 +15 / 壓迫感 +10)',
          'Do': 'jump Chapter1_OptionA'
        },
        'Option_B': {
          'Text': '「這只是證明我有能力找到妳所有祕密的第一步。」 (戒心值 +20 / 支配度 +25 / 恐懼與服從)',
          'Do': 'jump Chapter1_OptionB'
        },
        'Option_C': {
          'Text': '「抱歉嚇到妳了，我只是想表達——在同班同學面前，妳不用一直戴著偶像的面具。」 (距離感 -30 / 好感度 +10 / 校園秘密共犯)',
          'Do': 'jump Chapter1_OptionC'
        }
      }
    }
  ],

  'Chapter1_OptionA': [
    $ => {
      monogatari.storage().vigilance -= 10;
      monogatari.storage().favorability += 15;
      monogatari.storage().pressure += 10;
      monogatari.storage().flags.obsessive_path = true;
    },
    '（你往前邁出一步，將距離縮短到半步之遙，語氣溫柔卻帶著不容拒絕的壓迫感。）',
    'player 舞台上的星野燈很完美……但我更喜歡現在這種慌張、真實的妳。無論是過去還是現在，妳的一切在我眼裡都極具吸引力。',
    'show character hoshino shy at center animated character-idle',
    '（燈咬著下唇，臉頰浮現紅暈。她將照片緊緊貼在胸口，眼神在動搖中閃過一絲被「全盤理解」的奇妙解脫感。）',
    'jump Chapter1_Continuation'
  ],

  'Chapter1_OptionB': [
    $ => {
      monogatari.storage().vigilance += 20;
      monogatari.storage().pressure += 25;
      monogatari.storage().flags.complicity_path = true;
    },
    '（你雙手插口袋，嘴角勾起一抹神秘的微笑，聲音降低到只有兩人能聽見的分貝。）',
    'player 我不只知道這個，我還知道妳剛才上台前因為緊張吃了兩顆抗焦慮錠。想保護好這個祕密的話，我們需要更多『交流』。',
    'show character hoshino dark at center animated character-idle',
    '（燈的瞳孔微微放大，呼吸變得急促起來，背脊撞到後方的桌緣，感到了前所未有的被掌控感與危機感。）',
    'jump Chapter1_Continuation'
  ],

  'Chapter1_OptionC': [
    $ => {
      monogatari.storage().distance -= 30;
      monogatari.storage().favorability += 10;
      monogatari.storage().flags.secret_path = true;
    },
    '（你微微一笑，點出兩人隱秘的「同級生」關係。）',
    'player 在學校裡，妳總是坐在窗邊不說話對吧？比起遙不可及的偶像星野燈，我更想認識作為同學的星野燈。',
    'show character hoshino flustered at center animated character-idle',
    'hoshino 你……你是那個坐在後排的……？你怎麼會……',
    '（隱藏的同級生身份被揭開，燈的防線瞬間崩解。）',
    'jump Chapter1_Continuation'
  ],

  'Chapter1_Continuation': [
    '（燈低著頭，胸口劇烈起伏。在狹小的休息室空間內，空氣彷彿變得稀薄而黏稠。）',
    '【此處應有肢體接觸與試探情節】',
    '情節概要：你利用燈動搖的瞬間靠近，藉由幫她接過毛巾或整理領口的動作進行近距離接觸。燈在極度震驚與錯愕下未能第一時間推開你，兩人在曖昧與緊張的氣氛中完成了情報的初步交換。',

    'show character hoshino shy at center',
    'hoshino ……你真的很奇怪。今天的事情……不准跟任何人說。這是我們之間的……秘密。',
    'player 當然，這本來就是專屬於我們兩個人的事情。',

    '（離開後台時，你的手機跳出了提示通知。剛才的互動中，你已經成功取得了她的個人私密手機號碼、入住飯店的資訊，以及後續行動所需的關鍵情報。）',
    '【第一章 結算】已取得星野燈個人手機號碼、今晚入住飯店地點與房間資訊，並成功掌控其對黑歷史與偶像形象破滅的焦慮弱點。',

    'jump Chapter2_InfoGathering'
  ],

  // ---------------------------------------------------------------------------
  // 第二章：情報收集篇 (房間發現與脆弱揭露)
  // ---------------------------------------------------------------------------
  'Chapter2_InfoGathering': [
    'show scene assets/stories/story_hoshino/assets/bg_hotel.jpg with fadeIn',
    '（深夜，奢華飯店的走廊一片寂靜，只有厚重地毯吸收步伐聲的悶響。）',
    '（憑藉著之前掌握的飯店入住資訊與相關途徑，你順利來到了星野燈入住的頂樓套房門口。你沒有選擇破壞或硬闖，而是利用手頭掌握的資訊與巧思，順利開啟了這扇門。）',
    '（房間內瀰漫著淡雅的無花果香氣，與後台休息室裡的味道一模一樣。燈似乎剛洗完澡，浴室傳來陣陣微弱的水聲與水蒸氣的熱氣。）',
    '（你冷靜地掃視著房間——隨意擺放的高級品牌外衣、散落的劇本、還有放在梳妝台上的一本精裝手帳。你走過去輕手輕腳地翻開，裡面記滿了她對演藝圈生活的恐懼、對經紀公司嚴苛要求的不滿，以及極度缺乏安全感的內心獨白。）',

    '（心中暗想：『果然……舞台上完美無瑕的國民偶像，私底下也不過是個隨時處於崩潰邊緣的普通女孩。』）',

    '【此處應有隱私探索與近距離觀察情節】',
    '情節概要：你在房間內收集情報時，浴室的水聲停止。你並未急於離開，而是在暗處觀察到剛洗完澡、卸下所有防備與偶像包裝的燈。燈對房間內有人全然不知，展現出最真實、脆弱的姿態。你藉此記錄下更多關於她私人習慣的細節。',

    '（就在此時，燈的私人手機突然收到一則訊息，螢幕亮起。是經紀公司傳來的下週行程變更通知，伴隨著冷酷的業績要求。燈看著手機，輕輕嘆了一口氣，眼神中充滿了無助。）',
    '（你從暗處緩緩走出，聲音打破了房間裡的沉寂。）',

    'player 深夜還要做這種類型的心理拉鋸，當國民偶像還真是辛苦呢，星野同學。',

    'show character hoshino flustered at center with fadeIn',
    'hoshino ——！？你……你怎麼會在這裡！？',
    '（燈嚇了一大跳，身體下意識地後退，撞到了身後的梳妝台。當她看清是你之後，臉上除了驚恐，更多了一層被看穿所有脆弱的狼狽。）',

    {
      'Choice': {
        'Option_A': {
          'Text': '「別害怕，我只是來聽妳傾訴的。在別的地方妳必須是偶像，但在這裡妳只是妳。」 (戒心值 -20 / 依賴值 +30 / 情感寄託與軟化)',
          'Do': 'jump Chapter2_OptionA'
        },
        'Option_B': {
          'Text': '「妳看，要掌握妳的一切對我來說太容易了。妳根本無處可躲。」 (戒心值 +10 / 主導度 +35 / 無力抵抗與服從)',
          'Do': 'jump Chapter2_OptionB'
        },
        'Option_C': {
          'Text': '「明天學校的課後輔導，我在舊校舍等妳。把這當成我們之間的秘密約會吧。」 (距離感 -20 / 好感度 +20 / 期待與校園暗戀感)',
          'Do': 'jump Chapter2_OptionC'
        }
      }
    }
  ],

  'Chapter2_OptionA': [
    $ => {
      monogatari.storage().vigilance -= 20;
      monogatari.storage().favorability += 30;
      monogatari.storage().flags.support_path = true;
    },
    '（你放慢腳步，保持無害的姿態，語氣極盡溫柔。）',
    'player 我知道妳很累，這本日記寫滿了妳的壓抑。我不打算拿這些去威脅妳，我只想成為妳唯一可以卸下偽裝的避風港。',
    'show character hoshino shy at center animated character-idle',
    '（燈的眼眶瞬間紅了起來，原本緊繃防備的肩膀鬆弛下來。她壓抑已久的孤獨感被這句話擊中，對你的防線開始產生質的轉變。）',
    'jump Chapter2_Continuation'
  ],

  'Chapter2_OptionB': [
    $ => {
      monogatari.storage().vigilance += 10;
      monogatari.storage().pressure += 35;
      monogatari.storage().flags.complicity_path = true;
    },
    '（你拿起梳妝台上的手帳，當著她的面輕輕合上，眼神帶著掌控一切的自信。）',
    'player 無論是後台、飯店，還是學校，只要我想，隨時都能來到妳身邊。妳現在能信任的人，只有我。',
    'show character hoshino dark at center animated character-idle',
    '（燈緊緊握住拳頭，呼吸急促，眼中滿是無奈與絕望，但同時也產生了一種「既然已經完全被看穿，乾脆放棄抵抗」的危險心理。）',
    'jump Chapter2_Continuation'
  ],

  'Chapter2_OptionC': [
    $ => {
      monogatari.storage().distance -= 20;
      monogatari.storage().favorability += 20;
      monogatari.storage().flags.secret_path = true;
    },
    '（你沒有過多停留，而是優雅地將房間備用卡放在桌上，留下一個邀請。）',
    'player 今晚只是來確認妳是否平安。想聊聊日記裡寫的那些煩惱的話，明天放學後，舊校舍見。',
    'show character hoshino flustered at center animated character-idle',
    '（燈看著你放下的卡片與轉身離開的背影，心跳不自覺地加快。這種帶有神秘感與校園風格的拉扯，讓她對明天的見面產生了期待。）',
    'jump Chapter2_Continuation'
  ],

  'Chapter2_Continuation': [
    '【第二章 結算】已掌握星野燈私密日記內容與心理弱點焦慮源頭，確認其私底下極度缺乏安全感、渴望被理解的性格特質，雙方關係突破「粉絲與偶像」，進入「掌握祕密的同級生」階段。',
    'jump Chapter3_Approaching'
  ],

  // ---------------------------------------------------------------------------
  // 第三章：接近篇 (舊校舍祕密基地與感情升溫)
  // ---------------------------------------------------------------------------
  'Chapter3_Approaching': [
    'show scene assets/stories/story_hoshino/assets/bg_rooftop.jpg with fadeIn',
    '（放學後的鐘聲在校園內迴盪。一般的學生已經陸續離校，原本喧鬧的教學樓逐漸歸於平靜。）',
    '（你依照約定來到舊校舍後方的樹蔭下。這裡平時極少有人經過，是個能夠避開其他人視線的絕佳場所。）',
    '（沒過多久，一道輕盈但略顯猶豫的腳步聲傳來。星野燈戴著鴨舌帽與口罩，壓低了帽沿，神色警惕地四周張望後，才緩緩朝你走來。）',

    'show character hoshino flustered at center with fadeIn animated character-idle',
    'hoshino ……我來了。這樣你滿意了吧？',
    '（她摘下口罩，露出那張在電視上經常出現、此時卻略帶倦意與複雜神情的臉龐。）',

    'player 妳很準時。看來妳比我想像中更在乎我們之間的『約定』。',
    'hoshino 我只是……不想讓事情變得更複雜而已。你到底想怎樣？在飯店看到那些東西……你現在是不是覺得我很假？很可笑？',
    '（燈緊咬著下唇，雙手緊握成拳，眼神中帶著防禦性的敵意，但深處卻透露出渴望被理解的脆弱。）',

    'player 恰恰相反。舞台上的偶像星野燈固然耀眼，但這個會焦慮、會不安、坐在舊校舍後方和我說話的星野燈，才更真實。',
    '（你往前走了兩步，停在她身前，夕陽將兩人的影子拉得很長。）',

    '【此處應有肢體接觸與感情升溫情節】',
    '情節概要：你在相談過程中，察覺到燈因為緊張而有些微顫抖。你順勢拉近距離，進行輕微的肢體接觸（如輕輕撫平她因緊張而皺起的衣角，或在耳邊低語）。燈在強烈的心情波動下並未推開你，心跳加速，兩人之間的距離大幅縮短，情感依賴感顯著提升。',

    'show character hoshino shy at center',
    'hoshino 你……你別靠這麼近……',
    '（她的聲音有些發顫，臉頰泛起一絲紅暈，但眼神卻沒有移開，反倒像是在確認著什麼。）',
    'hoshino 從小到大，所有人看我的眼神都是『星野燈好棒』、『星野燈是完美的偶像』……從來沒有人像你一樣，直接看穿我最想隱藏的地方。跟你在一起，總覺得很可怕……但又有一種奇怪的輕鬆感。',

    {
      'Choice': {
        'Option_A': {
          'Text': '「因為在我面前，妳不需要扮演任何人，只要做你自己就好。」 (依賴值 +35 / 戒心值 -15 / 完全打開心扉)',
          'Do': 'jump Chapter3_OptionA'
        },
        'Option_B': {
          'Text': '「這代表妳已經開始習慣我的存在了，妳注定無法逃離我。」 (主導度 +40 / 戒心值 +5 / 心靈臣服與沉溺)',
          'Do': 'jump Chapter3_OptionB'
        },
        'Option_C': {
          'Text': '「既然這樣，那從今天開始，我們就是共享秘密的『特別同級生』了。」 (好感度 +30 / 距離感 -20 / 專屬秘密約定)',
          'Do': 'jump Chapter3_OptionC'
        }
      }
    }
  ],

  'Chapter3_OptionA': [
    $ => {
      monogatari.storage().favorability += 35;
      monogatari.storage().vigilance -= 15;
      monogatari.storage().flags.support_path = true;
    },
    '（你眼神真摯而專注地看著她，聲音低沉且充滿包容。）',
    'player 既然覺得輕鬆，那就把所有的壓力都卸給我吧。無論是好的妳還是壞的妳，我都會全部接受。',
    'show character hoshino shy at center animated character-idle',
    '（燈的眼神徹底軟化，一直以來獨自承受壓力的孤獨感在這一刻潰堤，她微微低頭，輕輕靠向你，內心防線進一步瓦解。）',
    'jump Chapter3_Continuation'
  ],

  'Chapter3_OptionB': [
    $ => {
      monogatari.storage().pressure += 40;
      monogatari.storage().vigilance += 5;
      monogatari.storage().flags.complicity_path = true;
    },
    '（你微微一笑，語氣帶著強烈的掌控欲與自信。）',
    'player 可怕是因為妳無法掌控我，輕鬆是因為妳不必再裝模作樣。承認吧，妳已經離不開這種被我看穿的感覺了。',
    'show character hoshino dark at center animated character-idle',
    '（燈微微一震，清澈的雙眼閃過一絲慌亂與迷惘，但隨後化為一種默認般的順從，輕輕點了點頭。）',
    'jump Chapter3_Continuation'
  ],

  'Chapter3_OptionC': [
    $ => {
      monogatari.storage().favorability += 30;
      monogatari.storage().distance -= 20;
      monogatari.storage().flags.secret_path = true;
    },
    '（你伸出手，以同級生的輕鬆姿態對她發出邀請。）',
    'player 偶像星野燈屬於大家，但同學星野燈……屬於我們之間的秘密。以後放學，這裡就是我們的秘密基地。',
    'show character hoshino normal at center animated character-idle',
    '（燈噗哧一聲笑了出來，緊繃的表情終於放鬆下來，伸出纖細的手指與你輕輕拉鉤，眼中充滿了青春獨有的暗戀與雀躍。）',
    'jump Chapter3_Continuation'
  ],

  'Chapter3_Continuation': [
    '【第三章 結算】星野燈對主角產生強烈的心理依賴與感情寄託，解鎖專屬場景：舊校舍祕密基地。雙方關係正式從「掌握弱點」升華為「深刻的情感綁定與秘密共犯」。',
    'jump Chapter4_WeaknessConfrontation'
  ],

  // ---------------------------------------------------------------------------
  // 第四章：弱點攻略篇 (雨中音樂教室與防線全面臣服)
  // ---------------------------------------------------------------------------
  'Chapter4_WeaknessConfrontation': [
    'show scene assets/stories/story_hoshino/assets/bg_backstage.jpg with fadeIn',
    'play music bgm_suspense loop',
    '（外頭突然下起了暴雨，密集的雨滴狂亂地拍打著窗戶，將整個世界與這間舊音樂教室隔開。）',
    '（燈坐在鋼琴椅上，雙腳微縮，看著窗外的雨景。雨水的滴答聲與遠處的雷鳴，讓室內的氣氛變得極度安靜且壓抑。）',

    'show character hoshino shy at center with fadeIn animated character-idle',
    'hoshino 雨下得好大……經紀人的車子大概接不到我了。今天……好像哪裡也去不了呢。',

    '（你走到她身側，居高臨下地看著她。你沒有像平常一樣保留，而是將之前收集到的所有資訊整理成一份清單，平靜地擺在鋼琴蓋上。）',
    'player 演藝圈的壓力、對完美的強迫症、童年時期的陰影，還有妳每次感到不安時會下意識咬下唇的小習慣……星野同學，妳所有的祕密與弱點，現在都在這裡了。',
    '（燈看著鋼琴蓋上的東西，瞳孔劇烈收縮。她抬起頭看向你，身體因為極度的緊張而微顫，但出乎意料地，她的眼中沒有憤怒，只有一種被徹底看透後的解脫與迷惘。）',

    'show character hoshino flustered at center',
    'hoshino 你……把我的全部都摸得這麼清楚了。在你看來，我現在是不是像個剝了殼的雞蛋一樣，完全沒有任何隱私了？',
    'player 正因為看透了妳的一切，我才知道最真實的妳有多吸引人。對妳來說，這不是被威脅，而是妳終於不需要在任何人面前偽裝了。',

    '【此處應有高互動性的強烈親密情節】',
    '情節概要：在封閉且安靜的環境下，你以主導的姿態靠近燈，進行更進一步的情感與肢體互動。燈在情緒釋放與巨大的解脫感下，徹底放棄了最後抵抗，選擇依賴你，兩人發生了深度且緊密的親密接觸，關係在此刻產生質的躍升。',

    'show character hoshino dark at center',
    'hoshino ……你說得對。在全世界面前我都要扮演完美的星野燈……只有在你面前，我可以不用當偶像。',
    '（她伸出雙手，輕輕抓住了你的衣角，臉頰貼在你的胸口，聽著你的心跳聲。）',
    'hoshino 我的弱點、我的秘密……還有我的全部，都給你了。所以……不可以拋下我喔。',

    {
      'Choice': {
        'Option_A': {
          'Text': '「放心吧，妳的一切都由我來支配與保護，誰也無法搶走。」 (依賴值 MAX / 主導度 +50 / 導向 獨佔籠中鳥 或 共犯關係)',
          'Do': 'jump Chapter4_OptionA'
        },
        'Option_B': {
          'Text': '「繼續當妳高高在上的國民偶像吧，而我會一直在陰影處掌控著妳。」 (主導度 MAX / 刺激度 +40 / 導向 雙面偶像秘密)',
          'Do': 'jump Chapter4_OptionB'
        },
        'Option_C': {
          'Text': '「如果這份束縛讓妳感到痛苦，我可以隨時放手，讓妳回歸正常生活。」 (好感度 MAX / 戒心值 0 / 導向 失控執著 或 距離外的守護)',
          'Do': 'jump Chapter4_OptionC'
        }
      }
    }
  ],

  'Chapter4_OptionA': [
    $ => {
      monogatari.storage().favorability += 40;
      monogatari.storage().pressure += 50;
      monogatari.storage().flags.obsessive_path = true;
    },
    '（你緊緊擁抱住她，語氣帶著強烈的獨佔欲與承諾。）',
    'player 無論是舞台上閃耀的妳，還是私底下脆弱的妳，從今天起都只屬於我一個人。',
    'jump Chapter4_Continuation'
  ],

  'Chapter4_OptionB': [
    $ => {
      monogatari.storage().pressure += 60;
      monogatari.storage().flags.secret_path = true;
    },
    '（你抬起她的下巴，眼神帶著玩味與冷靜。）',
    'player 在大眾面前展現妳最完美的一面，但在鏡頭看不到的後台，妳只需要對我展現真實。',
    'jump Chapter4_Continuation'
  ],

  'Chapter4_OptionC': [
    $ => {
      monogatari.storage().favorability += 40;
      monogatari.storage().vigilance = 0;
      monogatari.storage().flags.support_path = true;
    },
    '（你溫柔地摸了摸她的頭，給了她最後選擇的自由。）',
    'player 我掌握這些不是為了傷害妳。如果有一天妳想離開這種關係，隨時告訴我。',
    'jump Chapter4_Continuation'
  ],

  'Chapter4_Continuation': [
    '【第四章 結算】星野燈的心理防線完全瓦解，心理與情感皆歸屬於主角。故事進入最後的「第五章：墜落篇與結局分歧」。',
    'jump Chapter5_FallDown'
  ],

  // ---------------------------------------------------------------------------
  // 第五章：墜落篇 (關係轉折與終局)
  // ---------------------------------------------------------------------------
  'Chapter5_FallDown': [
    'show scene assets/stories/story_hoshino/assets/bg_backstage.jpg with fadeIn',
    'play music bgm_suspense loop',
    '（演唱會最終場的彩帶在體育館空中漫天飛舞，萬人齊聲高喊著「星野燈」的名字。舞台上的她宛如不可侵犯的神聖存在，綻放著無與倫比的光芒。）',
    '（然而，當演出結束、休息室的大門重重關上那一刻——）',
    '（燈謝絕了經紀人與工作人員的跟隨，獨自一人脫下高跟鞋，整個人有些虛脫地蜷縮在軟沙發上。她沒有去拿冰敷袋，也沒有去檢查社群媒體上的熱搜，而是第一時間拿起手機，解開了那個唯有你才知道的私人加密通道。）',

    'show character hoshino shy at center with fadeIn animated character-idle',
    'hoshino ……我做到了喔。剛才在台上最後一首歌的時候，我一直看著你的方向……你看到了嗎？',

    '（你從休息室內側的隔間慢慢走出來，腳步聲在安靜的空間裡格外清晰。）',
    'player 看到了。全場數萬人都在為妳瘋狂，但只有我知道，妳剛才在唱到副歌時，眼神裡寫滿了對我的渴望。',

    'show character hoshino dark at center',
    'hoshino 嗯……因為舞台上的星野燈是屬於大家的，但離開舞台後……我的全部，早就已經被你佔有了。',
    '（她主動站起身，有些搖搖晃晃地走向你，伸出雙手環住你的脖子，將頭深深埋進你的胸口。她的呼吸急促，帶著剛下舞台的體溫與汗香。）',
    'hoshino 現在的我，已經完全離不開你了……無論是作為同班同學，還是作為你的偶像……請繼續掌控我的一切吧。',

    'show scene assets/stories/story_hoshino/assets/cg_hoshino_secret.jpg with fadeIn',
    '（暴風雨與喧囂漸漸停歇，歸於安寧與無與倫比的私密。燈的心與靈魂完全歸屬於你，故事迎來最終的分歧與結算。）',

    $ => {
      const storage = monogatari.storage();
      const fav = storage.favorability;
      const pressure = storage.pressure;

      if (storage.flags.overly_obsessive) {
        return 'jump Ending_D'; // 失控 Bad End
      } else if (storage.flags.obsessive_path && pressure >= 40) {
        return 'jump Ending_A'; // 獨佔的籠中鳥
      } else if (storage.flags.secret_path && pressure >= 30) {
        return 'jump Ending_B'; // 雙面偶像的秘密
      } else if (storage.flags.complicity_path || (pressure >= 20 && fav >= 30)) {
        return 'jump Ending_C'; // 共犯關係
      } else {
        return 'jump Ending_E'; // 距離外的守護 (Normal)
      }
    }
  ],

  // ---------------------------------------------------------------------------
  // 5 大結局分歧 (完整演出)
  // ---------------------------------------------------------------------------
  'Ending_A': [
    'show scene assets/stories/story_hoshino/assets/cg_hoshino_secret.jpg with fadeIn',
    'show character hoshino dark at center',
    '（星野燈在人氣巔峰時期突如其來地宣布「因個人因素無期限暫停演藝活動」。消息震撼了整個娛樂圈，無數粉絲落淚遺憾。）',
    '（然而，在遠離市區的一棟高層公寓內，陽光透過薄紗窗簾灑在寬敞的客廳裡。燈穿著鬆垮的居家服，坐在你懷裡，正由你親手餵她吃著早餐。她的手機被關機放在抽屜深處，不再有經紀人的催促，不再有社群媒體的評價。）',
    '【此處應有長篇日常生活與深度依附親密情節】',
    '情節概要：描繪兩人在封閉空間內高度依賴、無微不至的日常生活互動。燈完全拋開了過往的強迫症與焦慮感，將自己的生活起居與情感完全寄托在主角身上，獲得了前所未有的安寧與歸屬感。',
    'hoshino 大家都在找我呢……但沒關係，我現在只屬於你一個人了。這就是我夢寐以求的……最幸福的籠牢。',
    '恭喜通關：星野燈 - 結局 A：獨佔的籠中鳥 (Exclusive Cage Ending)',
    $ => {
      unlockGlobalMemory('cg_hoshino_secret');
      window.app.registerEndingCleared('story_hoshino', 'Ending_A');
    },
    'end'
  ],

  'Ending_B': [
    'show scene assets/stories/story_hoshino/assets/bg_stage.jpg with fadeIn',
    'show character hoshino normal at center',
    '（星野燈繼續擔任她的國民級偶像，人氣蒸蒸日上，甚至登上了國際舞台。在鏡頭與鎂光燈前，她是清純高冷、無懈可擊的女神。）',
    '（但在鏡頭之外，她是屬於你的秘密存在。每次演唱會後台、電視台的私人休息室、甚至是車載後座——只要在沒有人的角落，她都會展現出唯有你能看見的另一面。）',
    '【此處應有冒險與雙重身份切換之親密情節】',
    '情節概要：描繪在隨時可能被發現的緊張環境下（如後台倒數登場前的幾分鐘），兩人在暗處進行極高壓與刺激的情感拉扯與親密互動。這種極致的雙重生活，成為了燈解壓與沉溺的唯一途徑。',
    'hoshino 台下的大家都在叫我的名字……但只有你叫我名字的時候，我的心跳才會這麼快。這個祕密……我們要一輩子守下去喔。',
    '恭喜通關：星野燈 - 結局 B：雙面偶像的秘密 (Two-faced Idol Ending)',
    $ => {
      unlockGlobalMemory('cg_hoshino_secret');
      window.app.registerEndingCleared('story_hoshino', 'Ending_B');
    },
    'end'
  ],

  'Ending_C': [
    'show scene assets/stories/story_hoshino/assets/bg_backstage.jpg with fadeIn',
    'show character hoshino dark at center',
    '（燈沒有退出演藝圈，但也擺脫了經紀公司的掌控。你成為了她的個人特別助理與幕後籌劃者。所有關於她的行程、採訪、公關甚至是私生活，全數由你一手主導。）',
    '（兩人在校園畢業後，正式結成了精神與事業上不可分割的「共犯結構」。她依靠你的冷靜與掌控，你享受著她的依賴與歸屬。）',
    '【此處應有主導與順從風格的儀式感親密情節】',
    '情節概要：描繪兩人在簽署或決定重大契約後，於私人空間進行帶有主導與獻祭意味的深度親密互動，展現兩人關係從心理到肉體的全面綁定。',
    'hoshino 我把我的事業、我的未來、還有我的心……通通交給你了。如果是你的話，帶我走向哪裡我都願意。',
    '恭喜通關：星野燈 - 結局 C：共犯關係 (Complicity Relation Ending)',
    $ => {
      unlockGlobalMemory('cg_hoshino_secret');
      window.app.registerEndingCleared('story_hoshino', 'Ending_C');
    },
    'end'
  ],

  'Ending_D': [
    'show scene assets/stories/story_hoshino/assets/bg_hotel.jpg with fadeIn',
    '（過度的掌控與密不透風的感情，最終引發了經紀公司的懷疑與警覺。在一次秘密見面中，經紀人帶著保全介入，強制將燈帶離，並為她安排了海外留學與轉移星途的計畫。）',
    '（在機場離境大廳，燈被數名工作人員簇擁著，回頭看著遠處無法靠近的你，眼眶裡滿是淚水。秘密被公開撕裂，兩人被強行拆散，留下永恆的遺憾與未竟的執念。）',
    '通關：星野燈 - 結局 D：失控的執著 (Bad Ending)',
    $ => {
      window.app.registerEndingCleared('story_hoshino', 'Ending_D');
    },
    'end'
  ],

  'Ending_E': [
    'show scene assets/stories/story_hoshino/assets/bg_rooftop.jpg with fadeIn',
    '（你選擇將所有掌握的資料徹底刪除，退回到普通同級生與默默支持的粉絲位置。）',
    '（畢業典禮那天，燈在台上作為學生代表發言，眼神在人群中看到了你，並對你露出了一個只有你們兩人懂的、真摯而感激的微笑。她繼續在舞台上發光發熱，而你則在台下，成為那個唯一知道她過往秘密、並默默守護著她的「特別存在」。）',
    '通關：星野燈 - 結局 E：距離外的守護 (Normal Ending)',
    $ => {
      window.app.registerEndingCleared('story_hoshino', 'Ending_E');
    },
    'end'
  ]
});
