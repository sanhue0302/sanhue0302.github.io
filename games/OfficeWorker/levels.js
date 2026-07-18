const LEVELS = [
    // Chapter 1: 菜鳥降臨 —— 職涯的震撼教育（共 8 關）
    {
        id: 1,
        title: "1-1：填寫新人資料",
        bossName: "人事行政阿姨",
        bossAvatar: "👩‍💼",
        bossHp: 50,
        bossAtk: 1,
        bossMaxTimer: 5,
        gridRows: 4,
        gridCols: 4,
        layout: ["1111","1111","1111","1111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA'],
        dialogues: {
            start: [{ name: "前輩", avatar: "👨‍💼", text: "行政阿姨一臉不耐煩地丟過來一疊表格：「快填一填，別耽誤我團購水餃的時間！」玩家必須在時限內填完資料，證明自己不是電腦黑客。" }],
            win: [{ name: "系統", avatar: "✨", text: "新人資料填寫完成。" }]
        }
    },
    {
        id: 2,
        title: "1-2：壞掉的影印機",
        bossName: "卡紙怪獸",
        bossAvatar: "👾",
        bossHp: 100,
        bossAtk: 5,
        bossMaxTimer: 4,
        gridRows: 5,
        gridCols: 5,
        layout: ["11111","11111","11111","11111","11111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA'],
        dialogues: {
            start: [{ name: "前輩", avatar: "👨‍💼", text: "組長叫你影印 50 份規格書，但公司的影印機自從 2022 年就沒維修過。它開始劇烈震動，並發出「卡卡卡」的怪聲！" }],
            win: [{ name: "系統", avatar: "✨", text: "影印機恢復正常。" }]
        }
    },
    {
        id: 3,
        title: "1-3：認清座位環境",
        bossName: "堆積如山的文件夾",
        bossAvatar: "📁",
        bossHp: 150,
        bossAtk: 8,
        bossMaxTimer: 4,
        gridRows: 5,
        gridCols: 5,
        layout: ["11111","11111","11111","11111","11111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA'],
        dialogues: {
            start: [{ name: "前輩", avatar: "👨‍💼", text: "你的位置堆滿了前任員工留下來的陳年合約。不把它們排整齊，你連滑鼠都沒地方放！" }],
            win: [{ name: "系統", avatar: "✨", text: "座位終於乾淨一點了。" }]
        }
    },
    {
        id: 4,
        title: "1-4：幫大家訂下午茶",
        bossName: "選擇困難的同事們",
        bossAvatar: "🤔",
        bossHp: 200,
        bossAtk: 10,
        bossMaxTimer: 5,
        gridRows: 6,
        gridCols: 6,
        layout: ["111111","111111","111111","111111","111111","111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA'],
        dialogues: {
            start: [{ name: "前輩", avatar: "👨‍💼", text: "老鳥們高喊：「新人，幫忙訂手搖飲！我要微糖微冰，啊不，改成無糖去冰，還是珍珠換椰果？」每個人意見都不一樣，你的腦袋快打結了。" }],
            win: [{ name: "系統", avatar: "✨", text: "下午茶訂購完畢。" }]
        }
    },
    {
        id: 5,
        title: "1-5：這不是我的工作",
        bossName: "隔壁棚的老鳥",
        bossAvatar: "👴",
        bossHp: 250,
        bossAtk: 15,
        bossMaxTimer: 3,
        gridRows: 6,
        gridCols: 6,
        layout: ["111111","111111","111111","111111","111111","111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE'],
        dialogues: {
            start: [{ name: "前輩", avatar: "👨‍💼", text: "隔壁棚的老鳥一邊摸魚一邊踱步過來：「哎呀新人很優秀嘛，這個客戶的催收單你順便幫我處理一下，我相信你！」" }],
            win: [{ name: "系統", avatar: "✨", text: "成功推掉不屬於你的工作。" }]
        }
    },
    {
        id: 6,
        title: "1-6：被迫提早一小時開會",
        bossName: "隔壁棚的老鳥(精英)",
        bossAvatar: "👴",
        bossHp: 350,
        bossAtk: 20,
        bossMaxTimer: 4,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE'],
        dialogues: {
            start: [{ name: "前輩", avatar: "👨‍💼", text: "老鳥自己沒準備報告，竟然在群組標註所有人：「為了展現團隊積極度，我們明天提早一小時、早上八點開晨會對齊！」" }],
            win: [{ name: "系統", avatar: "✨", text: "會議終於結束了。" }]
        }
    },
    {
        id: 7,
        title: "1-7：撰寫第一份會議記錄",
        bossName: "專案邊緣人",
        bossAvatar: "👤",
        bossHp: 300,
        bossAtk: 10,
        bossMaxTimer: 5,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA'],
        dialogues: {
            start: [{ name: "前輩", avatar: "👨‍💼", text: "長達三小時的無效會議結束了，組長丟下一句：「那個新人，把剛剛大家講的重點整理成 Email 發出來。」重點是，剛剛根本沒人講重點啊！" }],
            win: [{ name: "系統", avatar: "✨", text: "完美的會議記錄。" }]
        }
    },
    {
        id: 8,
        title: "1-8：下午交給我，這很簡單吧？",
        bossName: "直屬小組長",
        bossAvatar: "😤",
        bossHp: 500,
        bossAtk: 25,
        bossMaxTimer: 4,
        bossSkill: "需求微調",
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI'],
        dialogues: {
            start: [{ name: "小組長", avatar: "😤", text: "小組長在下班前五分鐘走到你身後，拍拍你的肩膀：「這個企劃隨便改改就好，這很簡單吧？下午交給我喔。」等等，現在已經是下午五點五十五分了！" }],
            win: [
                { name: "系統", avatar: "🎉", text: "小組長被你的超強執行力震懾到了！你順利通過試用期，並被調入核心專案組，榮升：正式組員！" }
            ]
        }
    },
    // Chapter 2: 專案泥潭 —— 沒人想接的燙手山芋（共 12 關）
    {
        id: 9,
        title: "2-1：重構前人的大便 code",
        bossName: "失聯的前任工程師",
        bossAvatar: "👻",
        bossHp: 400,
        bossAtk: 15,
        bossMaxTimer: 4,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE'],
        dialogues: {
            start: [{ name: "同事", avatar: "😟", text: "你打開系統原始碼，發現裡面充斥著毫無註解的變數名、無限迴圈以及上萬行的混亂邏輯。這不是程式碼，這是一座充滿地雷的廢墟！" }],
            win: [{ name: "系統", avatar: "✨", text: "成功重構了一部分程式碼。" }]
        }
    },
    {
        id: 10,
        title: "2-2：外包又斷線了",
        bossName: "難搞的協力廠商",
        bossAvatar: "🤷",
        bossHp: 500,
        bossAtk: 20,
        bossMaxTimer: 3,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "系統出了大 Bug，你瘋狂撥打外包廠商的電話，卻只聽到「您撥的電話未開機」。對方在最關鍵的時刻集體人間蒸發了！" }],
            win: [{ name: "系統", avatar: "✨", text: "終於聯繫上外包了。" }]
        }
    },
    {
        id: 11,
        title: "2-3：客戶說方向不對",
        bossName: "平行部門的 PM",
        bossAvatar: "🗣️",
        bossHp: 600,
        bossAtk: 18,
        bossMaxTimer: 4,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE'],
        dialogues: {
            start: [{ name: "前輩", avatar: "👨‍💼", text: "平行部門的 PM 跑來說客戶看完展示後大發雷霆，覺得整體的色調與字體「不夠大氣、缺乏靈魂」，要求立刻推翻重來。" }],
            win: [{ name: "系統", avatar: "✨", text: "成功穩住客戶的方向。" }]
        }
    },
    {
        id: 12,
        title: "2-4：對齊顆粒度",
        bossName: "難搞的協力廠商(小 Boss)",
        bossAvatar: "🤷‍♂️",
        bossHp: 800,
        bossAtk: 25,
        bossMaxTimer: 4,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "外包廠商終於上線了，但他卻不願意提供正確的資料格式。你必須在線上會議用專業術語狠狠地「對齊顆粒度」，逼他交出權限。" }],
            win: [{ name: "系統", avatar: "✨", text: "API 對接成功。" }]
        }
    },
    {
        id: 13,
        title: "2-5：這個先放一邊",
        bossName: "過期需求單",
        bossAvatar: "🧾",
        bossHp: 1200,
        bossAtk: 15,
        bossMaxTimer: 5,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "信箱裡躺著半年前的未處理單據。主管說：「這些雖然過期了，但客戶最近又提起來，你今天順便把它們全部結案。」" }],
            win: [{ name: "系統", avatar: "✨", text: "過期需求單已結案。" }]
        }
    },
    {
        id: 14,
        title: "2-6：拉通一場對齊會議",
        bossName: "無效會議召集人",
        bossAvatar: "📅",
        bossHp: 900,
        bossAtk: 20,
        bossMaxTimer: 4,
        bossSkill: "聽君一席話",
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "主導會議的召集人開始講述他十年前的輝煌戰績，台下所有人集體放空。眼看時間一分一秒過去，事情卻毫無進展！" }],
            win: [{ name: "系統", avatar: "✨", text: "會議終於散會了。" }]
        }
    },
    {
        id: 15,
        title: "2-7：突然插入的緊急修復",
        bossName: "線上大 Bug",
        bossAvatar: "🐛",
        bossHp: 1000,
        bossAtk: 30,
        bossMaxTimer: 2,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "生產環境的資料庫突然亮起紅燈！使用者無法登入，客服電話被打爆，高層正盯著螢幕，你只有 60 秒可以救場！" }],
            win: [{ name: "系統", avatar: "✨", text: "Bug 修復上線。" }]
        }
    },
    {
        id: 16,
        title: "2-8：我們來腦力激盪一下",
        bossName: "無效會議召集人(精英)",
        bossAvatar: "📅",
        bossHp: 1200,
        bossAtk: 25,
        bossMaxTimer: 4,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "召集人又開會了，這次他要求所有人玩「便簽貼貼樂」，把所有沒建設性的便利貼貼滿牆壁，美其名曰：激發創意。" }],
            win: [{ name: "系統", avatar: "✨", text: "腦力激盪結束。" }]
        }
    },
    {
        id: 17,
        title: "2-9：客戶說要改回第一版",
        bossName: "朝令夕改的業主",
        bossAvatar: "👑",
        bossHp: 1500,
        bossAtk: 30,
        bossMaxTimer: 5,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "在經歷了三十次的修改後，客戶推了推眼鏡冷冷地說：「看來看去，還是你們一開始做的第一版最耐看，我們就用那一版吧。」主角當場吐血。" }],
            win: [{ name: "系統", avatar: "✨", text: "成功說服業主接受當前版本。" }]
        }
    },
    {
        id: 18,
        title: "2-10：壓測伺服器崩潰",
        bossName: "紅燈警告燈號",
        bossAvatar: "🚨",
        bossHp: 2000,
        bossAtk: 40,
        bossMaxTimer: 4,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "系統準備上線，正在進行壓力測試。十萬個虛擬用戶同時湧入，伺服器風扇瘋狂運轉，溫度飆破 90 度，隨時要燒毀！" }],
            win: [{ name: "系統", avatar: "✨", text: "伺服器重新穩定。" }]
        }
    },
    {
        id: 19,
        title: "2-11：上線前的最後通宵",
        bossName: "咖啡因過載的肝",
        bossAvatar: "🫀",
        bossHp: 1800,
        bossAtk: 50,
        bossMaxTimer: 3,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "凌晨三點，辦公室只剩銀幕的藍光。你已經喝了三罐能量飲料，心跳飆到 120，你必須靠意志力（消除健康方塊）撐到天亮。" }],
            win: [{ name: "系統", avatar: "✨", text: "撐過今晚了..." }]
        }
    },
    {
        id: 20,
        title: "2-12：這需求很急，客戶說的",
        bossName: "PM 總監",
        bossAvatar: "😎",
        bossHp: 2500,
        bossAtk: 35,
        bossMaxTimer: 4,
        bossSkill: "規格變更",
        gridRows: 7,
        gridCols: 7,
        layout: [
            "1111111",
            "1111111",
            "1111111",
            "1111111",
            "1111111",
            "1111111",
            "1111111"
        ],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE'],
        dialogues: {
            start: [{ name: "PM總監", avatar: "😎", text: "PM 總監拿著厚厚一疊新文件衝進來：「這需求真的很急，客戶說如果明天沒看到，就要跟我們解約！」" }],
            win: [
                { name: "系統", avatar: "🎉", text: "專案奇蹟般地上線了！高層看到了你的抗壓性與帶隊潛力。榮升：專案組長 (Team Lead)！" }
            ]
        }
    },
    // 🥪 第三章：夾心餅乾 —— 升官發財，各憑本事（共 15 關）
    {
        id: 21,
        title: "3-1：與新團隊破冰",
        bossName: "尷尬的沉默氣氛",
        bossAvatar: "😎",
        bossHp: 1100,
        bossAtk: 22,
        bossMaxTimer: 4,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "面對剛進公司的 Z 世代新人，你試圖講個冷笑話熱絡氣氛，結果全場陷入死一般的寂靜。你必須用行動證明你不是個過時的老古董。" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 22,
        title: "3-2：週五下午四點半請假",
        bossName: "隨時想躺平的下屬",
        bossAvatar: "😎",
        bossHp: 1200,
        bossAtk: 24,
        bossMaxTimer: 4,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "眼看週末就要到了，下屬突然遞出假單：「老大，我下午四點半肚子痛，要請假去看演唱會。」專案還沒收尾啊！" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 23,
        title: "3-3：幫屬下擦屁股",
        bossName: "新人的低級錯誤",
        bossAvatar: "😎",
        bossHp: 1300,
        bossAtk: 26,
        bossMaxTimer: 4,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "新人把測試環境的資料誤刪了，還順便把密碼發到了公開群組。你一邊嘆氣，一邊挽起袖子幫他收拾殘局。" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 24,
        title: "3-4：跨部門搶資源",
        bossName: "其他小隊的組長",
        bossAvatar: "😎",
        bossHp: 1400,
        bossAtk: 28,
        bossMaxTimer: 4,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "公司的測試設備有限，隔壁棚的小組長正準備把所有機器佔為己有。為了你的團隊，你必須去把資源搶回來！" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 25,
        title: "3-5：我想準點下班",
        bossName: "隨時想躺平的下屬 (小 Boss)",
        bossAvatar: "👹",
        bossHp: 2000,
        bossAtk: 30,
        bossMaxTimer: 3,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "一到下午五點，組員們就開始收拾包包、眼神飄向大門。你必須施展管理藝術，讓他們心甘情願把今天的工作做完。" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 26,
        title: "3-6：報告寫不完",
        bossName: "空白的 PPT 簡報",
        bossAvatar: "😎",
        bossHp: 1600,
        bossAtk: 32,
        bossMaxTimer: 4,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "處長明天要聽季度匯報。你盯著第一頁只有「Title」的空白簡報，陷入了沉思。" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 27,
        title: "3-7：同期在背後嚼舌根",
        bossName: "抓耙子同期主管",
        bossAvatar: "😎",
        bossHp: 1700,
        bossAtk: 34,
        bossMaxTimer: 4,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "你在茶水間外，聽到跟你同期升職的主管正在向處長打小報告，說你管理無方、縱容下屬。這傢伙竟然在背後捅刀！" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 28,
        title: "3-8：跨年夜的排班問題",
        bossName: "群組集體已讀不回",
        bossAvatar: "😎",
        bossHp: 1800,
        bossAtk: 36,
        bossMaxTimer: 4,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "跨年夜需要有人留守機房。你在部門群組發出詢問，結果畫面上出現了一排默默的「已讀 5」，卻沒有任何一個人回覆。" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 29,
        title: "3-9：搶奪年度優秀員工",
        bossName: "抓耙子同期主管 (小 Boss)",
        bossAvatar: "👹",
        bossHp: 2400,
        bossAtk: 38,
        bossMaxTimer: 3,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "年度優秀員工的名額只有一個，這關乎到明年的加薪幅度。那個抓耙子又在處長面前狂拍馬屁，你必須用硬實力擊敗他！" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 30,
        title: "3-10：主管群組的明爭暗鬥",
        bossName: "抓耙子同期主管 (精英狀態)",
        bossAvatar: "😎",
        bossHp: 2000,
        bossAtk: 40,
        bossMaxTimer: 4,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "大群組裡風起雲湧，同期主管開始發動連環 tag 攻勢，試圖把專案失敗的責任全推到你的小隊頭上。" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 31,
        title: "3-11：季度績效面談 (一)",
        bossName: "冷酷的考核表",
        bossAvatar: "😎",
        bossHp: 2100,
        bossAtk: 42,
        bossMaxTimer: 4,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "面談開始了，考核表上的各項指標密密麻麻。這是一場數據與心靈的拉鋸戰。" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 32,
        title: "3-12：季度績效面談 (二)",
        bossName: "無感的數據落差",
        bossAvatar: "😎",
        bossHp: 2200,
        bossAtk: 44,
        bossMaxTimer: 4,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "處長看著報表搖搖頭：「雖然你們達成了目標，但對比去年沒有爆發性成長啊。」面對這種玄學標準，你只能繼續消除。" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 33,
        title: "3-13：部門預算被砍",
        bossName: "刪減通知書",
        bossAvatar: "😎",
        bossHp: 2300,
        bossAtk: 46,
        bossMaxTimer: 4,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "一封 Email 傳來，你們部門下半年的活動經費與零用金被砍了 30%。沒有資源，你要怎麼帶兵？" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 34,
        title: "3-14：倒數計時的考評壓力",
        bossName: "處長的奪命連環 Call",
        bossAvatar: "👹",
        bossHp: 2900,
        bossAtk: 48,
        bossMaxTimer: 3,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "處長每隔十分鐘就打電話來催進度，電話鈴聲變成了恐怖的背景音樂。" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 35,
        title: "3-15：不要跟我談過程，我只要數字",
        bossName: "大 Boss：數字至上的中階處長",
        bossAvatar: "👹",
        bossHp: 3000,
        bossAtk: 50,
        bossMaxTimer: 3,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "處長將報表重重摔在桌上：「我不管你們熬了幾天夜，業績沒達標就是沒達標！今晚拿不出數字，明天就不用來了！」" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    // 🗳️ 第四章：權力遊戲 —— 總公司的政治風暴（共 18 關）
    {
        id: 36,
        title: "4-1：高層會議的座位學問",
        bossName: "派系站隊空氣",
        bossAvatar: "😎",
        bossHp: 2600,
        bossAtk: 52,
        bossMaxTimer: 4,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK', 'MONEY'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "走進長型大理石會議室，座位的安排暗藏玄機。坐得太靠近副總壓力大，坐得太遠又顯得邊緣，你必須精準找到自己的定位。" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 37,
        title: "4-2：搶奪年度總預算",
        bossName: "行銷處長",
        bossAvatar: "👹",
        bossHp: 3200,
        bossAtk: 54,
        bossMaxTimer: 3,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK', 'MONEY'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "行銷處長一開口就要拿走 70% 的公司預算。你必須拿出更強大的效益分析，當場把預算攔截下來！" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 38,
        title: "4-3：被抓去當跨部門評委",
        bossName: "互吹捧的各處室主管",
        bossAvatar: "😎",
        bossHp: 2800,
        bossAtk: 56,
        bossMaxTimer: 4,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK', 'MONEY'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "其他部門的處長們在評審會上瘋狂互相吹捧、商業互吹。你必須在虛偽的客套中保持清醒，找出對己方有利的突破口。" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 39,
        title: "4-4：這不符合經濟效益",
        bossName: "審計小組",
        bossAvatar: "😎",
        bossHp: 2900,
        bossAtk: 58,
        bossMaxTimer: 4,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK', 'MONEY'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "審計小組拿著放大鏡來查核你們處的開銷，連一張高鐵票的報銷都要你寫三頁說明書。" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 40,
        title: "4-5：非正式的煙囪談話",
        bossName: "探聽口風的秘書",
        bossAvatar: "😎",
        bossHp: 3000,
        bossAtk: 60,
        bossMaxTimer: 4,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK', 'MONEY'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "副總的秘書在茶水間偶遇你，看似閒聊地問起你對新政策的看法。小心！這是一場政治試探。" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 41,
        title: "4-6：合規性審查",
        bossName: "小 Boss：法務部擋箭牌",
        bossAvatar: "👹",
        bossHp: 3600,
        bossAtk: 62,
        bossMaxTimer: 3,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK', 'MONEY'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "法務部總監冷冷地甩出一份法規條例：「你們這個新專案涉嫌違反公司第 404 條合規守則，無限期擱置。」你必須展現大招打破他的官僚護盾！" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 42,
        title: "4-7：應付董事長的大排場報告",
        bossName: "100頁的精美 PPT 簡報",
        bossAvatar: "😎",
        bossHp: 3200,
        bossAtk: 64,
        bossMaxTimer: 4,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK', 'MONEY'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "為了在董事長面前露臉，整個處室不眠不休做了一份極度奢華、帶有 3D 動畫轉場的 PPT。你必須流暢地把它講完。" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 43,
        title: "4-8：被對手匿名檢舉",
        bossName: "黑函投訴信",
        bossAvatar: "😎",
        bossHp: 3300,
        bossAtk: 66,
        bossMaxTimer: 4,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK', 'MONEY'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "有人向人資部投訴，說你曾在公開場合對別的派系出言不遜。人資立刻展開調查，你的盤面遭到黑函污染！" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 44,
        title: "4-9：出差旅費被刁難",
        bossName: "財務部實習生",
        bossAvatar: "😎",
        bossHp: 3400,
        bossAtk: 68,
        bossMaxTimer: 4,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK', 'MONEY'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "財務部的實習生拿到你的出差單，推推眼鏡說：「處長，你住的飯店超標了 50 元，請重新簽核。」你堂堂處長竟然被實習生卡關！" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 45,
        title: "4-10：部門績效被刻意拉低",
        bossName: "不公的常態分配曲線",
        bossAvatar: "😎",
        bossHp: 3500,
        bossAtk: 70,
        bossMaxTimer: 4,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK', 'MONEY'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "明明大家都很拼，公司卻規定必須有 10% 的人拿考績 C。其他派系企圖把這個 C 額度全推給你的團隊。" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 46,
        title: "4-11：獵人頭公司的秘密挖角",
        bossName: "動搖的忠誠度",
        bossAvatar: "😎",
        bossHp: 3600,
        bossAtk: 72,
        bossMaxTimer: 4,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK', 'MONEY'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "深夜接到獵人頭公司的電話，開出兩倍薪水挖你跳槽。你的內心產生了動搖，這關考驗你的專注力（必須消除特定雜色）。" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 47,
        title: "4-12：成本效益分析",
        bossName: "精英 Boss：財務部毒舌總監",
        bossAvatar: "👹",
        bossHp: 4200,
        bossAtk: 74,
        bossMaxTimer: 3,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK', 'MONEY'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "財務部總監在預算大會上開啟嘲諷模式：「你們處花這麼多錢，到底能幫公司賺回多少？我看下半年的預算直接對半砍吧。」" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 48,
        title: "4-13：空降的皇親國戚",
        bossName: "董事長的遠房親戚",
        bossAvatar: "👹",
        bossHp: 4300,
        bossAtk: 76,
        bossMaxTimer: 3,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK', 'MONEY'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "公司突然空降了一位什麼都不懂、卻享有最高特權的副處長——據說是董事長的姪子。他一來就瞎指揮，把盤面搞得一團亂。" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 49,
        title: "4-14：尾牙敬酒的攻防戰",
        bossName: "灌酒大隊",
        bossAvatar: "😎",
        bossHp: 3900,
        bossAtk: 78,
        bossMaxTimer: 4,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK', 'MONEY'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "尾牙宴上，敵對派系的主管帶著一眾部屬圍過來：「來，處長！今年辛苦了，這杯高粱乾了，不喝就是不給面子！」" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 50,
        title: "4-15：組織架構大重組傳言",
        bossName: "人心惶惶的辦公室氣氛",
        bossAvatar: "😎",
        bossHp: 4000,
        bossAtk: 80,
        bossMaxTimer: 4,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK', 'MONEY'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "高層傳出要將你們部門與行銷部合併。組員們無心工作，紛紛私下打聽消息，你必須出面穩住大局。" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 51,
        title: "4-16：安插自己的人馬",
        bossName: "人事凍結令",
        bossAvatar: "😎",
        bossHp: 4100,
        bossAtk: 82,
        bossMaxTimer: 4,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK', 'MONEY'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "你想把得力助手升上來，總部卻突然發佈人事凍結。你必須繞過重重規則，幫自己人爭取位置。" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 52,
        title: "4-17：迎接副總的視察",
        bossName: "表面功夫展示牆",
        bossAvatar: "😎",
        bossHp: 4200,
        bossAtk: 84,
        bossMaxTimer: 4,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK', 'MONEY'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "副總要來巡視辦公區。桌面上不能有任何飲料杯、每個人都要穿著正裝、銀幕上必須放著公司的宣傳影片。" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 53,
        title: "4-18：這是公司未來的戰略藍圖",
        bossName: "大 Boss：副總經理 (VP)",
        bossAvatar: "👹",
        bossHp: 4800,
        bossAtk: 86,
        bossMaxTimer: 3,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK', 'MONEY'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "VP 站在台上激情演講：「我們三年內要上市、五年內要收購競爭對手！大家跟著我，每個人都能分到股票！」面對這種世紀大餅，點破它就會受重傷！" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    // 🌏 第五章：疆土擴張 —— 臨危受命的拓荒者（共 20 關）
    {
        id: 54,
        title: "5-1：跨國時差的考驗",
        bossName: "凌晨三點的總部連線會議",
        bossAvatar: "😎",
        bossHp: 4400,
        bossAtk: 88,
        bossMaxTimer: 4,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK', 'MONEY'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "剛下飛機時差還沒對好，總部就要求你視訊匯報。你必須一邊喝濃茶，一邊在昏昏欲睡的狀態下應答。" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 55,
        title: "5-2：雞同鴨講的跨國溝通",
        bossName: "翻譯年糕怪獸",
        bossAvatar: "😎",
        bossHp: 4500,
        bossAtk: 90,
        bossMaxTimer: 4,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK', 'MONEY'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "你對當地員工說東，他們理解成西。開會全靠比手畫腳和破爛的翻譯軟體。" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 56,
        title: "5-3：整頓一盤散沙的當地團隊",
        bossName: "各懷鬼胎的外籍員工",
        bossAvatar: "😎",
        bossHp: 4600,
        bossAtk: 92,
        bossMaxTimer: 4,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK', 'MONEY'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "當地的老員工覺得你只是總部派來鍍金的，根本不把你放在眼裡。你必須開除幾個刺頭，重新建立威信。" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 57,
        title: "5-4：尋找當地的代理商",
        bossName: "油腔滑調的中介人",
        bossAvatar: "😎",
        bossHp: 4700,
        bossAtk: 94,
        bossMaxTimer: 4,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK', 'MONEY'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "一個穿著花襯衫的代理商拍胸脯保證能搞定通路，但他的眼神閃爍，顯然想狠狠敲你一筆。" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 58,
        title: "5-5：租用新的海外辦公室",
        bossName: "漫天開價的房東",
        bossAvatar: "😎",
        bossHp: 4800,
        bossAtk: 96,
        bossMaxTimer: 4,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK', 'MONEY'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "分公司原本的辦公室又破又漏水。你想換地方，當地的房地產大亨卻把你當成肥羊，租金直接翻倍。" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 59,
        title: "5-6：應付當地勞檢",
        bossName: "小 Boss：水土不服的法規",
        bossAvatar: "👹",
        bossHp: 5400,
        bossAtk: 98,
        bossMaxTimer: 3,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK', 'MONEY'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "當地的勞動局官員帶著法規文件上門，指控你們加班超標、喝咖啡時間不夠。你必須嚴格遵守當地的「規矩」才能過關。" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 60,
        title: "5-7：當地的工會抗議",
        bossName: "罷工糾察隊",
        bossAvatar: "😎",
        bossHp: 5000,
        bossAtk: 100,
        bossMaxTimer: 4,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK', 'MONEY'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "員工們因為不滿你取消了下午茶福利，竟然在公司門口拉布條抗議。部屬們集體罷工，技能全部失效！" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 61,
        title: "5-8：供應鏈斷貨危機",
        bossName: "卡在海關的貨櫃",
        bossAvatar: "😎",
        bossHp: 5100,
        bossAtk: 102,
        bossMaxTimer: 4,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK', 'MONEY'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "聖誕節旺季到了，你們的旗艦產品卻因為文件少蓋了一個章，被扣留在海關碼頭。" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 62,
        title: "5-9：打入本土社交圈",
        bossName: "尷尬的異國晚宴",
        bossAvatar: "😎",
        bossHp: 5200,
        bossAtk: 104,
        bossMaxTimer: 4,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK', 'MONEY'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "為了結交當地的商會大佬，你不得不穿上奇怪的傳統服飾，吃下你從未見過的在地黑暗料理。" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 63,
        title: "5-10：總部無情的業績催促",
        bossName: "跨海催收催繳信",
        bossAvatar: "😎",
        bossHp: 5300,
        bossAtk: 106,
        bossMaxTimer: 4,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK', 'MONEY'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "董事會才不管海外的困難，他們在 Email 裡發出最後通牒：本月營收要是沒有成長 20%，就撤換總經理。" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 64,
        title: "5-11：當地媒體的文化質疑",
        bossName: "公關危機新聞稿",
        bossAvatar: "😎",
        bossHp: 5400,
        bossAtk: 108,
        bossMaxTimer: 4,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK', 'MONEY'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "因為一句廣告詞的翻譯誤會，分公司被當地媒體貼上了「不尊重在地文化」的標籤。你必須立刻發表公關稿澄清。" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 65,
        title: "5-12：匯率暴跌的金融危機",
        bossName: "震盪的匯率走勢圖",
        bossAvatar: "😎",
        bossHp: 5500,
        bossAtk: 110,
        bossMaxTimer: 4,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK', 'MONEY'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "當地的貨幣突然瘋狂貶值！昨天賺的一百萬，今天只值五十萬。在這種經濟動盪下，每一步消除都充滿未知數。" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 66,
        title: "5-13：市佔率爭奪戰",
        bossName: "精英 Boss：當地惡性競爭對手",
        bossAvatar: "👹",
        bossHp: 6100,
        bossAtk: 112,
        bossMaxTimer: 3,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK', 'MONEY'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "本地的地頭蛇企業啟動了破壞性的「買一送二」策略，試圖用資本把你們這家外來企業活活耗死。" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 67,
        title: "5-14：開闢全新銷售渠道",
        bossName: "電商平台演算法",
        bossAvatar: "😎",
        bossHp: 5700,
        bossAtk: 114,
        bossMaxTimer: 4,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK', 'MONEY'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "實體通路被封鎖，你決定轉戰線上。但電商平台的流量演算法每小時都在變，你必須破解它！" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 68,
        title: "5-15：黑客惡意攻擊伺服器",
        bossName: "DDOS 流量怪獸",
        bossAvatar: "😎",
        bossHp: 5800,
        bossAtk: 116,
        bossMaxTimer: 4,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK', 'MONEY'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "正當銷售額暴增時，分公司的官方網站突然遭到不明來源的黑客瘋狂攻擊，網頁全面癱瘓。" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 69,
        title: "5-16：總部派來的空降督導",
        bossName: "指手畫腳的總部欽差",
        bossAvatar: "😎",
        bossHp: 5900,
        bossAtk: 118,
        bossMaxTimer: 4,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK', 'MONEY'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "總部派了一位高高在上的督導過來「指導工作」。他根本不懂在地市場，卻坐在辦公室指手畫腳。" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 70,
        title: "5-17：異國文化的聖誕長假",
        bossName: "集體人間蒸發的客服",
        bossAvatar: "😎",
        bossHp: 6000,
        bossAtk: 120,
        bossMaxTimer: 4,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK', 'MONEY'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "聖誕假期一到，當地的客服和物流人員集體關機度假去了，留下滿倉庫的訂單和憤怒的客戶留言。" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 71,
        title: "5-18：分公司年度財報逆轉",
        bossName: "由紅轉綠的業績線",
        bossAvatar: "😎",
        bossHp: 6100,
        bossAtk: 122,
        bossMaxTimer: 4,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK', 'MONEY'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "經過十一指月的奮鬥，分公司的財報曲線終於突破了損益平衡點，赤字全面轉為盈餘！" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 72,
        title: "5-19：準備回總部述職的報告",
        bossName: "豐收的拓荒戰果",
        bossAvatar: "😎",
        bossHp: 6200,
        bossAtk: 124,
        bossMaxTimer: 4,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK', 'MONEY'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "你將帶著完美的海外成績單重返總部。你要讓那些當初排擠你的人，睜大眼睛看清楚你的實力。" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 73,
        title: "5-20：清算前任的呆帳",
        bossName: "大 Boss：前任留下的爛攤子（前分公司主管的幽靈）",
        bossAvatar: "👹",
        bossHp: 6800,
        bossAtk: 126,
        bossMaxTimer: 3,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK', 'MONEY'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "在你準備交接前，會計師突然查出前任總經理私底下挪用公款、留下了高達數千萬的呆帳漏洞。這個隱藏的幽靈試圖把你一起拉入地獄！" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    // 👑 第六章：巔峰對決 —— 頂樓的終極賽局（共 12 關）
    {
        id: 74,
        title: "6-1：應對媒體惡意抹黑",
        bossName: "腥風血雨的小報記者",
        bossAvatar: "😎",
        bossHp: 6400,
        bossAtk: 128,
        bossMaxTimer: 4,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK', 'MONEY'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "你剛上任，八卦媒體就登出頭條，指控你海外資歷造假、涉嫌內線交易。背後顯然有人在操縱輿論，你必須用消除正面迎擊！" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 75,
        title: "6-2：外資大舉倒貨",
        bossName: "賣單牆",
        bossAvatar: "😎",
        bossHp: 6500,
        bossAtk: 130,
        bossMaxTimer: 4,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK', 'MONEY'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "華爾街的外資機構突然無預警集體拋售公司股票，股價瞬間暴跌 15%。你必須組織保衛戰，把那堵恐怖的賣單牆全部吃掉！" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 76,
        title: "6-3：穩定員工信心",
        bossName: "內部動盪傳言",
        bossAvatar: "😎",
        bossHp: 6600,
        bossAtk: 132,
        bossMaxTimer: 4,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK', 'MONEY'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "股價暴跌引發總部員工集體恐慌，甚至有人開始偷偷投履歷。你必須發表全體員工大會演講，重新點燃大家的鬥志。" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 77,
        title: "6-4：惡意做空陰謀",
        bossName: "小 Boss：禿鷹基金經理人",
        bossAvatar: "👹",
        bossHp: 7200,
        bossAtk: 134,
        bossMaxTimer: 3,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK', 'MONEY'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "著名的空頭機構發表了長達百頁的做空報告。做空頭子在電視上得意地大笑，試圖扼殺公司的信用。" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 78,
        title: "6-5：臨時股東大會",
        bossName: "散戶代表們",
        bossAvatar: "😎",
        bossHp: 6800,
        bossAtk: 136,
        bossMaxTimer: 4,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK', 'MONEY'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "憤怒的菜籃族與散戶股東塞爆了體育館大會現場，紛紛高舉看板抗議。你必須展現專業經理人的風範，平息他們的怒火。" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 79,
        title: "6-6：爭取創投大老支持",
        bossName: "冷漠的明星投資人",
        bossAvatar: "😎",
        bossHp: 6900,
        bossAtk: 138,
        bossMaxTimer: 4,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK', 'MONEY'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "為了反收購，你需要百億級別的白衣騎士。你隻身前往矽谷，向那位從不眨眼的明星風險投資家尋求金援。" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 80,
        title: "6-7：準備抗辯資料",
        bossName: "堆積如山的法律訴狀",
        bossAvatar: "😎",
        bossHp: 7000,
        bossAtk: 140,
        bossMaxTimer: 4,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK', 'MONEY'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "對方派系使出法律戰，向法院聲請暫時停止你的 CEO 職權。你跟法務團隊連夜準備幾千頁的抗辯文件。" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 81,
        title: "6-8：發動董事會彈劾案",
        bossName: "精英 Boss：激進的外部股東",
        bossAvatar: "👹",
        bossHp: 7600,
        bossAtk: 142,
        bossMaxTimer: 3,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK', 'MONEY'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "外部激進股東聯合了部分反叛的董事，正式在董事會上提出對你的「不信任與彈劾案」。生死一戰，就在這幾步之間！" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 82,
        title: "6-9：增資反收購計劃",
        bossName: "百億元資本缺口",
        bossAvatar: "😎",
        bossHp: 7200,
        bossAtk: 144,
        bossMaxTimer: 4,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK', 'MONEY'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "你要發行新股來稀釋對方的股權，但資金缺口巨大。盤面方塊種類增加到 6 種，製造彩色黑洞的難度達到史詩級！" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 83,
        title: "6-10：頂樓的深夜對話",
        bossName: "董事長的黑衣保鏢",
        bossAvatar: "👹",
        bossHp: 7800,
        bossAtk: 146,
        bossMaxTimer: 3,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK', 'MONEY'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "深夜，你搭乘專屬電梯來到總部頂樓。推開大門，董事長的私人保鏢們面無表情地攔住了你的去路。" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 84,
        title: "6-11：股權爭奪終局戰",
        bossName: "董事會投票權分配表",
        bossAvatar: "😎",
        bossHp: 7400,
        bossAtk: 148,
        bossMaxTimer: 4,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK', 'MONEY'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "決戰當天，股權投票開始。卡紙、甩鍋、大餅、債務方塊隨機在盤面上瘋狂湧現，這是一場過去 5 章所有職涯夢魘的終極大亂鬥！" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 85,
        title: "6-12：這家公司是我創立的",
        bossName: "最終魔王：創辦人暨董事長",
        bossAvatar: "👹",
        bossHp: 8000,
        bossAtk: 150,
        bossMaxTimer: 3,
        gridRows: 7,
        gridCols: 7,
        layout: ["1111111","1111111","1111111","1111111","1111111","1111111","1111111"],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK', 'MONEY'],
        dialogues: {
            start: [{ name: "系統", avatar: "⚠️", text: "董事長坐在真皮沙發上，抽著雪茄冷笑：「年輕人，你確實很厲害。但別忘了，這家公司是我創立的。我能把你扶上來，就能把你徹底毀掉。」" }],
            win: [{ name: "系統", avatar: "✨", text: "勝利！" }]
        }
    },
    {
        id: 99,
        title: "測試關卡：無限沙盒",
        bossName: "測試專用木樁",
        bossAvatar: "🎯",
        bossHp: 999999,
        bossAtk: 0,
        bossMaxTimer: 99,
        gridRows: 8,
        gridCols: 8,
        layout: [
            "11111111",
            "11111111",
            "11111111",
            "11111111",
            "11111111",
            "11111111",
            "11111111",
            "11111111"
        ],
        allowedBlocks: ['MAIL', 'PPT', 'TEA', 'PHONE', 'KPI', 'FILE', 'CLOCK', 'MONEY'],
        dialogues: {
            start: [
                { name: "開發者", avatar: "🛠️", text: "歡迎來到無限沙盒測試區！這裡會自動生成所有道具，供你自由測試與引爆。木樁不會攻擊，沒有時間壓力！" }
            ],
            win: []
        },
        isTest: true
    }
];
