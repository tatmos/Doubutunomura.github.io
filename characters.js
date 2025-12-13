/**
 * どうぶつの村 〜音の絆〜
 * キャラクター定義（全5章）
 */

// 章の定義
const CHAPTERS = {
    1: {
        id: 1,
        title: '第1章：はじめての対面',
        subtitle: '音で話す村のなかまたち',
        description: '村の猫たちと音であいさつしよう',
        unlocked: true,
        hideNoteNames: false,    // 音名を表示
        randomizePhrases: false, // 固定フレーズ
        hasBlackKeys: false,     // 白鍵のみ
        availableNotes: ['do', 're', 'mi', 'fa', 'so', 'la', 'ti']
    },
    2: {
        id: 2,
        title: '第2章：音を覚えて',
        subtitle: '耳をすませて聞いてみよう',
        description: '初めての音は名前がわからない！仲間になると覚えられるよ',
        unlocked: false,
        hideNoteNames: true,     // 最初は音名非表示
        randomizePhrases: true,  // ランダムフレーズ
        hasBlackKeys: false,
        availableNotes: ['do', 're', 'mi', 'fa', 'so', 'la', 'ti']
    },
    3: {
        id: 3,
        title: '第3章：ふたりの声',
        subtitle: '双子猫との出会い',
        description: '同時に話しかけてくる双子猫が登場！',
        unlocked: false,
        hideNoteNames: true,
        randomizePhrases: true,
        hasBlackKeys: false,
        hasTwins: true,          // 双子猫あり
        availableNotes: ['do', 're', 'mi', 'fa', 'so', 'la', 'ti']
    },
    4: {
        id: 4,
        title: '第4章：個性豊かな仲間',
        subtitle: '早口猫と魔女猫',
        description: '速い鳴き声や長い呪文に挑戦！',
        unlocked: false,
        hideNoteNames: true,
        randomizePhrases: true,
        hasBlackKeys: false,
        hasFastCat: true,        // 早口猫あり
        hasWitchCat: true,       // 魔女猫あり
        availableNotes: ['do', 're', 'mi', 'fa', 'so', 'la', 'ti']
    },
    5: {
        id: 5,
        title: '第5章：森の調べ',
        subtitle: '新しい音との出会い',
        description: 'シ♭やファ#など、黒鍵の音も登場！',
        unlocked: false,
        hideNoteNames: true,
        randomizePhrases: true,
        hasBlackKeys: true,      // 黒鍵あり
        hasTwins: true,
        hasFastCat: true,
        hasWitchCat: true,
        availableNotes: ['do', 'do#', 're', 're#', 'mi', 'fa', 'fa#', 'so', 'so#', 'la', 'la#', 'ti']
    },
    6: {
        id: 6,
        title: '裏モード：狂気の調べ',
        subtitle: '全ての音を使いこなせ',
        description: '最初から12音すべてが使える！狂った猫たちが待っている...',
        unlocked: false,  // 5章クリア後に解放
        hideNoteNames: false,  // 最初から全部表示
        randomizePhrases: true,
        hasBlackKeys: true,
        hasTwins: true,
        hasFastCat: true,
        hasWitchCat: true,
        isSecretMode: true,  // 裏モードフラグ
        availableNotes: ['do', 'do#', 're', 're#', 'mi', 'fa', 'fa#', 'so', 'so#', 'la', 'la#', 'ti']
    },
    7: {
        id: 7,
        title: '裏モード2章：ダンスパーティ',
        subtitle: '村祭りの大騒動',
        description: 'ダンスパーティ開催中！音名表示が一部盗まれてる...リズムや音が変わる！',
        unlocked: false,  // 6章クリア後に解放
        hideNoteNames: true,  // 一部ランダムに非表示
        randomHideNoteNames: true,  // ランダムに一部非表示
        randomizePhrases: true,
        hasBlackKeys: true,
        hasTwins: true,
        hasFastCat: true,
        hasWitchCat: true,
        isSecretMode: true,
        hasDanceParty: true,  // ダンスパーティモード
        availableNotes: ['do', 'do#', 're', 're#', 'mi', 'fa', 'fa#', 'so', 'so#', 'la', 'la#', 'ti']
    }
};

// 章ごとのキャラクター定義
const CHAPTER_CHARACTERS = {
    // ===== 第1章：はじめての対面 =====
    1: {
        cats: [
            {
                id: 'cat_mimi',
                name: 'ミミ',
                type: 'cat',
                emoji: '🐱',
                personality: 'シンプル',
                description: '村の入り口にいる おとなしい猫',
                position: { x: 15, y: 55 },
                phrases: [['do', 're'], ['re', 'do']],
                currentPhrase: 0,
                tempo: 0.5,
                difficulty: 1,
                dialogue: {
                    greeting: 'ニャ〜 ニャ♪\n（こんにちは、って言ってるみたい）',
                    success: 'ニャー！♪\n（喜んでいる！なかまになった！）',
                    failure: 'ニャ...？\n（首をかしげて去っていった...）'
                }
            },
            {
                id: 'cat_tama',
                name: 'タマ',
                type: 'cat',
                emoji: '😺',
                personality: '同じ音を繰り返す',
                description: '木の下でひなたぼっこしている猫',
                position: { x: 30, y: 62 },
                phrases: [['mi', 'mi'], ['so', 'so']],
                currentPhrase: 0,
                tempo: 0.4,
                difficulty: 1,
                dialogue: {
                    greeting: 'ミャーミャー！\n（同じ音を繰り返しているね）',
                    success: 'ミャ〜♪\n（うれしそう！なかまになった！）',
                    failure: 'ミャ...\n（がっかりして木の上に登っていった...）'
                }
            },
            {
                id: 'cat_sora',
                name: 'ソラ',
                type: 'cat',
                emoji: '😸',
                personality: '上昇音',
                description: '屋根の上から見下ろしている猫',
                position: { x: 50, y: 48 },
                phrases: [['do', 'mi'], ['re', 'fa']],
                currentPhrase: 0,
                tempo: 0.45,
                difficulty: 2,
                dialogue: {
                    greeting: 'ニャニャ〜ン♪\n（高いところが好きみたい）',
                    success: 'ニャ〜ン！\n（飛び降りてきた！なかまになった！）',
                    failure: 'フン...\n（興味なさそうに目をそらした...）'
                }
            },
            {
                id: 'cat_yuki',
                name: 'ユキ',
                type: 'cat',
                emoji: '😻',
                personality: '少女猫',
                description: '花畑で遊んでいる白い猫',
                position: { x: 40, y: 70 },
                phrases: [['la', 'ti'], ['so', 'la']],
                currentPhrase: 0,
                tempo: 0.55,
                difficulty: 2,
                dialogue: {
                    greeting: 'ニャ♪ニャ♪\n（かわいい声で話しかけてきた）',
                    success: 'ニャーン♡\n（すりすりしてきた！なかまになった！）',
                    failure: 'ニャッ！\n（恥ずかしそうに逃げていった...）'
                }
            },
            {
                id: 'cat_kuro',
                name: 'クロ',
                type: 'cat',
                emoji: '😼',
                personality: '気まぐれ',
                description: '路地裏をうろうろしている黒猫',
                position: { x: 65, y: 58 },
                phrases: [['fa', 'do'], ['ti', 'mi']],
                currentPhrase: 0,
                tempo: 0.4,
                difficulty: 3,
                dialogue: {
                    greeting: 'フニャ...ニャッ！\n（気まぐれな音を出した）',
                    success: 'ニャッ！\n（満足げ。なかまになった！）',
                    failure: 'フン！\n（プイッと横を向いて去った...）'
                }
            }
        ],
        wolf: createWolf(1)
    },
    
    // ===== 第2章：音を覚えて =====
    2: {
        cats: [
            {
                id: 'cat_hana',
                name: 'ハナ',
                type: 'cat',
                emoji: '🌸',
                personality: 'のんびり',
                description: '花壇の近くでうたた寝している猫',
                position: { x: 20, y: 60 },
                phrases: [['do', 're', 'mi']],  // ランダム化される
                currentPhrase: 0,
                tempo: 0.5,
                difficulty: 2,
                teachesNote: 'mi',  // 仲間になると「ミ」を覚える
                dialogue: {
                    greeting: 'ニャー ニャー ニャ〜♪\n（3つの音で話しかけてきた）',
                    success: 'ニャーン♪\n（うれしそう！「ミ」の音を覚えた！）',
                    failure: 'ニャ...zzz\n（眠そうにどこかへ行った...）'
                }
            },
            {
                id: 'cat_mochi',
                name: 'モチ',
                type: 'cat',
                emoji: '🍡',
                personality: 'もちもち',
                description: 'まるまる太った猫',
                position: { x: 45, y: 55 },
                phrases: [['so', 'fa', 'mi']],
                currentPhrase: 0,
                tempo: 0.55,
                difficulty: 2,
                teachesNote: 'fa',
                dialogue: {
                    greeting: 'ニャ〜ン ニャン ニャ♪\n（下がっていく音だ）',
                    success: 'ニャ〜♪\n（満足げ！「ファ」の音を覚えた！）',
                    failure: 'ニャ...\n（おなかすいたみたいで去っていった...）'
                }
            },
            {
                id: 'cat_rin',
                name: 'リン',
                type: 'cat',
                emoji: '🔔',
                personality: '鈴の音',
                description: '首輪に鈴をつけた猫',
                position: { x: 70, y: 65 },
                phrases: [['la', 'la', 'so']],
                currentPhrase: 0,
                tempo: 0.45,
                difficulty: 2,
                teachesNote: 'la',
                dialogue: {
                    greeting: 'リンリン ニャン♪\n（鈴のような高い音だ）',
                    success: 'リーン♪\n（鈴を鳴らして喜んでる！「ラ」を覚えた！）',
                    failure: 'リン...\n（鈴の音を残して去っていった...）'
                }
            },
            {
                id: 'cat_kai',
                name: 'カイ',
                type: 'cat',
                emoji: '🌊',
                personality: '海が好き',
                description: '青い目の猫',
                position: { x: 35, y: 72 },
                phrases: [['do', 'so', 'do']],
                currentPhrase: 0,
                tempo: 0.5,
                difficulty: 3,
                teachesNote: 'so',
                dialogue: {
                    greeting: 'ニャー ニャーン ニャー♪\n（波のような音だ）',
                    success: 'ニャ〜ン！\n（海のような目が輝く！「ソ」を覚えた！）',
                    failure: 'ニャ...\n（遠くを見つめて去っていった...）'
                }
            },
            {
                id: 'cat_yoru',
                name: 'ヨル',
                type: 'cat',
                emoji: '🌙',
                personality: '夜行性',
                description: '夜になると元気になる猫',
                position: { x: 55, y: 50 },
                phrases: [['ti', 're', 'ti']],
                currentPhrase: 0,
                tempo: 0.45,
                difficulty: 3,
                teachesNote: 'ti',
                dialogue: {
                    greeting: 'ニャ〜ン ニャ ニャ〜ン♪\n（神秘的な音だ）',
                    success: 'ニャーン♪\n（月のように微笑む！「シ」を覚えた！）',
                    failure: 'ニャ...\n（影の中に消えていった...）'
                }
            }
        ],
        wolf: createWolf(2)
    },
    
    // ===== 第3章：ふたりの声 =====
    3: {
        cats: [
            {
                id: 'cat_twins_a',
                name: 'ミケ & トラ',
                type: 'cat',
                emoji: '🐱🐱',
                personality: '双子',
                isTwin: true,
                description: 'いつも一緒の双子猫',
                position: { x: 30, y: 58 },
                phrases: [['do', 'mi'], ['mi', 'so']],  // 2つ同時に鳴らす
                twinPhrases: [['mi', 'so'], ['so', 'ti']], // ペアのフレーズ
                currentPhrase: 0,
                tempo: 0.5,
                difficulty: 3,
                dialogue: {
                    greeting: 'ニャニャー♪ ニャニャー♪\n（二人同時に話しかけてきた！）',
                    success: 'ニャーニャー！！\n（二人とも喜んでる！なかまになった！）',
                    failure: 'ニャ...ニャ...\n（二人で顔を見合わせて去っていった...）'
                }
            },
            {
                id: 'cat_choco',
                name: 'チョコ',
                type: 'cat',
                emoji: '🍫',
                personality: 'あまえんぼう',
                description: '茶色いふわふわの猫',
                position: { x: 55, y: 65 },
                phrases: [['re', 'mi', 'fa']],
                currentPhrase: 0,
                tempo: 0.5,
                difficulty: 2,
                dialogue: {
                    greeting: 'ニャ〜ン ニャン ニャ♪\n（甘えた声で話しかけてきた）',
                    success: 'ニャーン♡\n（すりすりしてきた！なかまになった！）',
                    failure: 'ニャ...\n（しょんぼりして去っていった...）'
                }
            },
            {
                id: 'cat_twins_b',
                name: 'シロ & クロ',
                type: 'cat',
                emoji: '⚪⚫',
                personality: '白黒双子',
                isTwin: true,
                description: '白猫と黒猫の双子',
                position: { x: 70, y: 55 },
                phrases: [['la', 'so'], ['so', 'fa']],
                twinPhrases: [['do', 're'], ['re', 'mi']],
                currentPhrase: 0,
                tempo: 0.45,
                difficulty: 4,
                dialogue: {
                    greeting: 'ニャ〜♪ ニャ〜♪\n（対照的な二人が同時に話しかけてきた！）',
                    success: 'ニャニャ！！\n（仲良く寄り添った！なかまになった！）',
                    failure: 'フン...フン...\n（正反対の方向へ去っていった...）'
                }
            },
            {
                id: 'cat_suu',
                name: 'スウ',
                type: 'cat',
                emoji: '💫',
                personality: 'ふしぎ',
                description: '不思議な雰囲気の猫',
                position: { x: 20, y: 70 },
                phrases: [['ti', 'la', 'so', 'fa']],
                currentPhrase: 0,
                tempo: 0.5,
                difficulty: 3,
                dialogue: {
                    greeting: 'ニャ〜ン ニャン ニャン ニャ♪\n（4つの音で話しかけてきた）',
                    success: 'ニャ〜♪\n（ふわっと微笑んだ！なかまになった！）',
                    failure: 'ニャ...\n（ふわりと消えてしまった...）'
                }
            },
            {
                id: 'cat_pochi',
                name: 'ポチ',
                type: 'cat',
                emoji: '🐕',
                personality: '犬っぽい',
                description: '犬みたいな猫',
                position: { x: 45, y: 48 },
                phrases: [['do', 'do', 'so', 'so']],
                currentPhrase: 0,
                tempo: 0.4,
                difficulty: 2,
                dialogue: {
                    greeting: 'ワンニャ！ワンニャ！\n（犬のように元気な猫だ）',
                    success: 'ワンニャーン！\n（しっぽを振って喜んでる！なかまになった！）',
                    failure: 'クゥン...\n（しょんぼりして去っていった...）'
                }
            }
        ],
        wolf: createWolf(3)
    },
    
    // ===== 第4章：個性豊かな仲間 =====
    4: {
        cats: [
            {
                id: 'cat_hayate',
                name: 'ハヤテ',
                type: 'cat',
                emoji: '💨',
                personality: '早口',
                isFast: true,
                description: 'ものすごく速くしゃべる猫',
                position: { x: 25, y: 55 },
                phrases: [['do', 're', 'mi', 'fa', 'so']],
                currentPhrase: 0,
                tempo: 0.25,  // 速い！
                difficulty: 4,
                dialogue: {
                    greeting: 'ニャニャニャニャニャ！！\n（ものすごく速い！）',
                    success: 'ニャー！\n（ちゃんと聞き取れた！なかまになった！）',
                    failure: 'ニャ...！\n（風のように去っていった...）'
                }
            },
            {
                id: 'cat_majo',
                name: 'マジョ',
                type: 'witch',
                emoji: '🧙‍♀️',
                personality: '魔女猫',
                isWitch: true,
                description: '呪文のような鳴き声の猫',
                position: { x: 60, y: 60 },
                phrases: [['la', 'ti', 'la', 'so', 'fa', 'mi', 're']],
                currentPhrase: 0,
                tempo: 0.45,
                difficulty: 5,
                dialogue: {
                    greeting: 'ニャ〜ン ニャン ニャ〜ン ニャン ニャン ニャン ニャ〜♪\n（長い呪文のような鳴き声だ...）',
                    success: 'ニャーーン♪\n（魔法がかかった！なかまになった！）',
                    failure: 'フシュー！\n（煙とともに消えてしまった...）'
                }
            },
            {
                id: 'cat_twins_speed',
                name: 'ビュン & ゴー',
                type: 'cat',
                emoji: '⚡⚡',
                personality: '高速双子',
                isTwin: true,
                isFast: true,
                description: '速すぎる双子猫',
                position: { x: 40, y: 68 },
                phrases: [['do', 'mi', 'so']],
                twinPhrases: [['re', 'fa', 'la']],
                currentPhrase: 0,
                tempo: 0.3,
                difficulty: 5,
                dialogue: {
                    greeting: 'ニャニャニャ！ニャニャニャ！\n（二人とも速い！！）',
                    success: 'ニャー！！\n（二人とも認めてくれた！なかまになった！）',
                    failure: 'ビューン...\n（光の速さで去っていった...）'
                }
            },
            {
                id: 'cat_nemu',
                name: 'ネム',
                type: 'cat',
                emoji: '😴',
                personality: 'ねむりねこ',
                description: 'いつも眠そうな猫',
                position: { x: 75, y: 50 },
                phrases: [['do', 're', 'do', 're', 'do']],
                currentPhrase: 0,
                tempo: 0.6,  // ゆっくり
                difficulty: 3,
                dialogue: {
                    greeting: 'ニャ〜...ニャ〜...ニャ〜...♪\n（とてもゆっくりだ）',
                    success: 'ニャ〜ン♪zzz\n（眠りながらも喜んでる！なかまになった！）',
                    failure: 'zzz...\n（寝たまま転がっていった...）'
                }
            },
            {
                id: 'cat_kage',
                name: 'カゲ',
                type: 'witch',
                emoji: '👤',
                personality: '影猫',
                isWitch: true,
                description: '影のような謎の猫',
                position: { x: 15, y: 72 },
                phrases: [['ti', 'la', 'ti', 'la', 'ti', 'so']],
                currentPhrase: 0,
                tempo: 0.4,
                difficulty: 4,
                dialogue: {
                    greeting: 'シャー...ニャ〜ン...シャー...♪\n（不気味だけど美しい音...）',
                    success: 'ニャ...♪\n（影から現れた！なかまになった！）',
                    failure: 'シャー...\n（影に溶けて消えた...）'
                }
            }
        ],
        wolf: createWolf(4)
    },
    
    // ===== 第5章：森の調べ =====
    5: {
        cats: [
            {
                id: 'cat_jazz',
                name: 'ジャズ',
                type: 'cat',
                emoji: '🎷',
                personality: 'ジャズ好き',
                description: 'ジャズが大好きな猫',
                position: { x: 20, y: 55 },
                phrases: [['do', 're', 're#', 'mi', 'so']],  // ブルーノート
                currentPhrase: 0,
                tempo: 0.45,
                difficulty: 4,
                teachesNote: 're#',
                dialogue: {
                    greeting: 'ニャ〜ン ニャン ニャ〜ン♪\n（ジャジーな音だ...レ#が聞こえる）',
                    success: 'ニャーン♪\n（スウィングしてる！「レ#」を覚えた！）',
                    failure: 'ニャ...\n（ため息をついて去っていった...）'
                }
            },
            {
                id: 'cat_opera',
                name: 'オペラ',
                type: 'cat',
                emoji: '🎭',
                personality: 'オペラ歌手',
                description: 'ドラマチックな猫',
                position: { x: 50, y: 60 },
                phrases: [['la', 'la#', 'ti', 'la#', 'la']],
                currentPhrase: 0,
                tempo: 0.5,
                difficulty: 4,
                teachesNote: 'la#',
                dialogue: {
                    greeting: 'ニャ〜〜〜ン♪\n（ドラマチック！シ♭が聞こえる）',
                    success: 'ブラーボ！ニャーン♪\n（称賛！「シ♭」を覚えた！）',
                    failure: 'ニャ...！\n（ドラマチックに去っていった...）'
                }
            },
            {
                id: 'cat_sharp',
                name: 'シャープ',
                type: 'cat',
                emoji: '♯',
                personality: 'シャープ好き',
                description: '半音上げるのが好きな猫',
                position: { x: 35, y: 70 },
                phrases: [['fa', 'fa#', 'so', 'so#', 'la']],
                currentPhrase: 0,
                tempo: 0.45,
                difficulty: 5,
                teachesNote: 'fa#',
                dialogue: {
                    greeting: 'ニャ♯ニャ♯♪\n（シャープな音！ファ#とソ#が聞こえる）',
                    success: 'ニャーン♯♪\n（キラキラ！「ファ#」と「ソ#」を覚えた！）',
                    failure: 'ニャ...♭\n（フラットな気分で去っていった...）'
                }
            },
            {
                id: 'cat_twins_chromatic',
                name: 'クロマ & チック',
                type: 'cat',
                emoji: '🎹🎹',
                personality: '半音双子',
                isTwin: true,
                description: '半音階が得意な双子',
                position: { x: 65, y: 52 },
                phrases: [['do', 'do#', 're']],
                twinPhrases: [['mi', 'fa', 'fa#']],
                currentPhrase: 0,
                tempo: 0.4,
                difficulty: 5,
                teachesNote: 'do#',
                dialogue: {
                    greeting: 'ニャニャニャ♪\n（複雑な和音！ド#が聞こえる）',
                    success: 'ハーモニー♪\n（完璧な和音！「ド#」を覚えた！）',
                    failure: 'ニャ...\n（不協和音で去っていった...）'
                }
            },
            {
                id: 'cat_maestro',
                name: 'マエストロ',
                type: 'witch',
                emoji: '🎼',
                personality: '指揮者猫',
                isWitch: true,
                description: '全ての音を操る猫',
                position: { x: 80, y: 65 },
                phrases: [['do', 'do#', 're', 're#', 'mi', 'fa', 'fa#', 'so']],
                currentPhrase: 0,
                tempo: 0.35,
                difficulty: 6,
                dialogue: {
                    greeting: 'ニャーーーン♪♪♪\n（すべての音が響く...最も難しい試練だ）',
                    success: 'ブラーヴォ！！\n（完璧な演奏！真の音楽家だ！）',
                    failure: 'ニャ...\n（指揮棒を振って去っていった...）'
                }
            }
        ],
        wolf: createWolf(5)
    },
    
    // ===== 裏モード：狂気の調べ =====
    6: {
        cats: [
            {
                id: 'cat_kyojin',
                name: '狂人猫',
                type: 'cat',
                emoji: '😵',
                personality: '狂気',
                isCrazy: true,  // 狂った鳴き声フラグ
                description: '狂ったような鳴き声を発する猫',
                position: { x: 25, y: 55 },
                phrases: [['do', 're#', 'fa#', 'ti', 'do#', 'la']],  // 不規則な音列
                currentPhrase: 0,
                tempo: 0.35,
                difficulty: 6,
                wobbleAnimation: true,  // うろうろアニメーション
                dialogue: {
                    greeting: 'ギャオオオオ！ニャニャニャニャ！\n（狂ったような鳴き声が響く...）',
                    success: 'ニャ〜♡♡♡♡\n（すごくデレデレになってきた！めちゃくちゃ甘えたがってる！）',
                    failure: 'ギャオオ...！\n（さらに狂気が増した...）',
                    retry: 'ニャニャ...♡\n（もう一度話しかけてくれた...嬉しい...）'
                }
            },
            {
                id: 'cat_uchuu',
                name: '宇宙猫',
                type: 'witch',
                emoji: '👽',
                personality: '宇宙',
                isCrazy: true,
                description: '宇宙から来た猫のようなもの',
                position: { x: 50, y: 60 },
                phrases: [['do#', 'mi', 'fa#', 'la#', 're', 'so#', 'ti']],
                currentPhrase: 0,
                tempo: 0.4,
                difficulty: 6,
                wobbleAnimation: true,
                dialogue: {
                    greeting: 'ピピピ...ビービー...プププ...\n（宇宙のような音を出している...）',
                    success: 'ピピピ♡♡♡♡♡♡\n（宇宙から来た猫は最高にデレデレになった！すりすりしてくる！）',
                    failure: 'ピピ...？\n（困惑した音を発して消えた...）',
                    retry: 'ピピ♡...？\n（戻ってきた...もしかして寂しかった？）'
                }
            },
            {
                id: 'cat_hangyojin',
                name: '半魚人猫',
                type: 'cat',
                emoji: '🧜‍♀️',
                personality: '半魚人',
                isCrazy: true,
                description: '半魚人と猫が合体したような存在',
                position: { x: 35, y: 70 },
                phrases: [['re#', 'fa', 'so#', 'la#', 'do', 'mi', 'fa#']],
                currentPhrase: 0,
                tempo: 0.38,
                difficulty: 6,
                wobbleAnimation: true,
                dialogue: {
                    greeting: 'ブクブク...ニャブクブク...\n（水中のような泡の音と猫の鳴き声が混じっている...）',
                    success: 'ブク♡ブク♡♡♡♡♡\n（半魚人猫が最高にデレデレになった！めちゃくちゃ甘えたがってる！）',
                    failure: 'ブクブク...\n（泡の中に消えていった...）',
                    retry: 'ブク♡...？\n（戻ってきた...もっと話したい？）'
                }
            },
            {
                id: 'cat_shinpi',
                name: '神秘猫',
                type: 'witch',
                emoji: '🔮',
                personality: '神秘',
                isCrazy: true,
                description: '神秘的な力を持つ狂気の猫',
                position: { x: 70, y: 50 },
                phrases: [['ti', 'la#', 'fa#', 'do#', 're#', 'so#', 'mi']],
                currentPhrase: 0,
                tempo: 0.35,
                difficulty: 7,
                wobbleAnimation: true,
                dialogue: {
                    greeting: 'フワフワ...ニャオオオオ...\n（神秘的で狂ったような音が響く...）',
                    success: 'フワ♡♡♡♡♡♡♡\n（神秘猫が最高にデレデレになった！魔法のように甘えたがってる！）',
                    failure: 'フワ...？\n（煙とともに消えた...）',
                    retry: 'フワ♡...？\n（再び現れた...あなたを待っていた...）'
                }
            },
            {
                id: 'cat_kimyo',
                name: '奇妙猫',
                type: 'cat',
                emoji: '🎭',
                personality: '奇妙',
                isCrazy: true,
                description: '奇妙な動きをする狂気の猫',
                position: { x: 15, y: 65 },
                phrases: [['do', 'fa#', 're#', 'la#', 'so#', 'mi', 'ti', 'do#']],
                currentPhrase: 0,
                tempo: 0.32,
                difficulty: 7,
                wobbleAnimation: true,
                dialogue: {
                    greeting: 'キョロキョロ...ニャニャニャニャ...\n（奇妙で狂ったような鳴き声...）',
                    success: 'ニャ♡♡♡♡♡♡♡♡♡\n（奇妙猫が最高にデレデレになった！めちゃくちゃ甘えたがってる！）',
                    failure: 'キョロ...？\n（不気味に消えていった...）',
                    retry: 'ニャ♡...？\n（戻ってきた...あなたが好きなのかも...）'
                }
            },
            {
                id: 'cat_kaeru',
                name: 'かえる猫',
                type: 'cat',
                emoji: '🐸',
                personality: '輪唱・繰り返し',
                description: '輪唱のように繰り返す鳴き声の猫',
                position: { x: 60, y: 62 },
                phrases: [['do', 're', 'mi', 'do', 're', 'mi']],  // 繰り返しフレーズ
                currentPhrase: 0,
                tempo: 0.4,
                difficulty: 5,
                frogJump: true,  // カエル飛びアニメーション
                isRound: true,  // 輪唱フラグ
                dialogue: {
                    greeting: 'ケロケロ ニャニャ♪\n（輪唱のように繰り返す鳴き声...）',
                    success: 'ケロ♡ニャ♡ケロ♡ニャ♡\n（かえる猫が最高にデレデレになった！ぴょんぴょん跳ねて喜んでる！）',
                    failure: 'ケロ...？\n（ぴょんと跳ねて行ってしまった...）',
                    retry: 'ケロ♡...？\n（戻ってきた...もう一度聞いてほしい？）'
                }
            },
            {
                id: 'cat_usagi',
                name: 'ウサギ猫',
                type: 'cat',
                emoji: '🐰',
                personality: 'リズム跳ね',
                description: 'リズムに合わせて跳ねる猫',
                position: { x: 45, y: 58 },
                phrases: [['do', 'mi', 'so', 'do', 'so', 'mi', 'do']],
                currentPhrase: 0,
                tempo: 0.35,
                difficulty: 5,
                rabbitHop: true,  // ウサギ飛びアニメーション
                bouncyRhythm: true,  // リズムが跳ねている
                octaveBounce: true,  // 音域が跳ねている（交互にオクターブ上がる）
                dialogue: {
                    greeting: 'ピョンピョン ニャニャ♪\n（リズムに合わせて跳ねている...音域も跳ねている！）',
                    success: 'ピョン♡ピョン♡ニャ♡\n（ウサギ猫が最高にデレデレになった！ぴょんぴょん跳ねて甘えたがってる！）',
                    failure: 'ピョン...？\n（しょんぼりして跳ねていった...）',
                    retry: 'ピョン♡...？\n（戻ってきた...もう一度遊びたい？）'
                }
            },
            {
                id: 'cat_tori',
                name: '小鳥猫',
                type: 'bird',
                emoji: '🐦',
                personality: '小さい・細かく早い',
                description: '小さくて細かく早い鳴き声の猫',
                position: { x: 20, y: 50 },
                phrases: [['la', 'ti', 'la', 'ti', 'la']],  // 高い音域
                currentPhrase: 0,
                tempo: 0.2,  // とても速い
                difficulty: 6,
                highPitch: true,  // 高い音域
                fastTempo: true,  // 速いテンポ
                dialogue: {
                    greeting: 'チュチュチュ ニャニャ♪\n（小さくて細かく早い鳴き声...）',
                    success: 'チュ♡チュ♡ニャ♡\n（小鳥猫が最高にデレデレになった！小さく甘えたがってる！）',
                    failure: 'チュ...？\n（小さく飛んでいった...）',
                    retry: 'チュ♡...？\n（戻ってきた...もっと話したい？）'
                }
            },
            {
                id: 'cat_risu',
                name: 'リス猫',
                type: 'cat',
                emoji: '🐿️',
                personality: '輪唱・小さい',
                description: '輪唱のように繰り返す小さな猫',
                position: { x: 55, y: 48 },
                phrases: [['so', 'la', 'ti', 'so', 'la', 'ti']],  // 高い音域・輪唱
                currentPhrase: 0,
                tempo: 0.25,
                difficulty: 6,
                isRound: true,  // 輪唱
                highPitch: true,
                dialogue: {
                    greeting: 'チッチッ ニャニャ♪\n（輪唱のように繰り返す小さな鳴き声...）',
                    success: 'チッ♡チッ♡ニャ♡\n（リス猫が最高にデレデレになった！輪唱しながら甘えたがってる！）',
                    failure: 'チッ...？\n（小さく逃げていった...）',
                    retry: 'チッ♡...？\n（戻ってきた...もう一度聞いてほしい？）'
                }
            },
            {
                id: 'cat_nezu',
                name: 'ねずみ猫',
                type: 'cat',
                emoji: '🐭',
                personality: '小さい・細かく早い',
                description: 'とても小さくて細かく早い鳴き声の猫',
                position: { x: 40, y: 52 },
                phrases: [['ti', 'la', 'ti', 'la', 'ti', 'so']],  // 高い音域
                currentPhrase: 0,
                tempo: 0.18,  // 非常に速い
                difficulty: 7,
                highPitch: true,
                fastTempo: true,
                dialogue: {
                    greeting: 'チューチュー ニャニャ♪\n（とても小さくて細かく早い鳴き声...）',
                    success: 'チュー♡チュー♡ニャ♡\n（ねずみ猫が最高にデレデレになった！小さく甘えたがってる！）',
                    failure: 'チュー...？\n（小さく逃げていった...）',
                    retry: 'チュー♡...？\n（戻ってきた...もっと話したい？）'
                }
            },
            {
                id: 'cat_hachi',
                name: '蜂猫',
                type: 'cat',
                emoji: '🐝',
                personality: '熊蜂の飛行',
                description: '熊蜂の飛行モチーフの猫（リムスキー・コルサコフ「熊蜂の飛行」）',
                position: { x: 75, y: 55 },
                phrases: [['do', 'do#', 're', 're#', 'mi', 'fa', 'fa#', 'so', 'so#', 'la', 'la#', 'ti', 'la#', 'la', 'so#', 'so', 'fa#', 'fa', 'mi', 're#', 're', 'do#', 'do']],  // 半音階的な上昇下降
                currentPhrase: 0,
                tempo: 0.12,  // 非常に速い
                difficulty: 9,
                fastTempo: true,
                bumblebeeFlight: true,  // 熊蜂の飛行
                dialogue: {
                    greeting: 'ブンブン ニャニャ♪\n（熊蜂の飛行のような速い鳴き声...リムスキー・コルサコフの名曲から！）',
                    success: 'ブン♡ブン♡ニャ♡\n（蜂猫が最高にデレデレになった！飛び回りながら甘えたがってる！）',
                    failure: 'ブン...？\n（飛んでいってしまった...）',
                    retry: 'ブン♡...？\n（戻ってきた...もう一度聞いてほしい？）'
                }
            },
            {
                id: 'cat_classic1',
                name: 'ベートーベン猫',
                type: 'cat',
                emoji: '🎹',
                personality: '運命',
                description: 'ベートーベン「運命」のモチーフ（タタタター）',
                position: { x: 30, y: 60 },
                phrases: [['do', 'do', 'do', 'mi']],  // 運命の動機
                currentPhrase: 0,
                tempo: 0.3,
                difficulty: 4,
                classicReference: true,
                dialogue: {
                    greeting: 'タタタター ニャ♪\n（ベートーベンの「運命」のモチーフだ！）',
                    success: 'タタタター♡ニャ♡\n（ベートーベン猫が最高にデレデレになった！運命を奏でながら甘えたがってる！）',
                    failure: 'タタタ...？\n（運命のように去っていった...）',
                    retry: 'タタタ♡...？\n（戻ってきた...もう一度聞いてほしい？）'
                }
            },
            {
                id: 'cat_classic2',
                name: 'モーツァルト猫',
                type: 'cat',
                emoji: '🎼',
                personality: 'トルコ行進曲',
                description: 'モーツァルト「トルコ行進曲」のモチーフ',
                position: { x: 65, y: 62 },
                phrases: [['do', 're', 'mi', 'fa', 'so', 'fa', 'mi', 're']],  // トルコ行進曲風
                currentPhrase: 0,
                tempo: 0.25,
                difficulty: 5,
                classicReference: true,
                dialogue: {
                    greeting: 'ドレミファソファミレ ニャ♪\n（モーツァルトの「トルコ行進曲」のモチーフだ！）',
                    success: 'ドレミ♡ニャ♡\n（モーツァルト猫が最高にデレデレになった！行進しながら甘えたがってる！）',
                    failure: 'ドレミ...？\n（行進して去っていった...）',
                    retry: 'ドレミ♡...？\n（戻ってきた...もう一度聞いてほしい？）'
                }
            },
            {
                id: 'cat_classic3',
                name: '威風堂々猫',
                type: 'cat',
                emoji: '👑',
                personality: '威風堂々',
                description: 'エルガー「威風堂々」のモチーフ',
                position: { x: 50, y: 60 },
                phrases: [['do', 'mi', 'so', 'do', 'mi', 'so', 'do', 're', 'mi', 'fa', 'so']],  // 威風堂々風
                currentPhrase: 0,
                tempo: 0.5,
                difficulty: 6,
                classicReference: true,
                dialogue: {
                    greeting: 'ドミソドミソ ニャ♪\n（エルガーの「威風堂々」のモチーフだ！堂々としている！）',
                    success: 'ドミソ♡ニャ♡\n（威風堂々猫が最高にデレデレになった！堂々としながら甘えたがってる！）',
                    failure: 'ドミソ...？\n（堂々と去っていった...）',
                    retry: 'ドミソ♡...？\n（戻ってきた...もう一度聞いてほしい？）'
                }
            },
            {
                id: 'cat_zou',
                name: '象猫',
                type: 'cat',
                emoji: '🐘',
                personality: '大きい・低い',
                description: '大きくて低い鳴き声の猫',
                position: { x: 15, y: 68 },
                phrases: [['do', 're', 'do', 'do', 're', 'do']],  // 低い音域
                currentPhrase: 0,
                tempo: 0.6,  // ゆっくり
                difficulty: 3,
                lowPitch: true,  // 低い音域
                bigAnimal: true,
                dialogue: {
                    greeting: 'パオーン ニャニャ♪\n（大きくて低い鳴き声...ゆっくりとしている...）',
                    success: 'パオーン♡ニャ♡\n（象猫が最高にデレデレになった！大きく甘えたがってる！）',
                    failure: 'パオーン...？\n（ゆっくりと去っていった...）',
                    retry: 'パオーン♡...？\n（戻ってきた...もう一度聞いてほしい？）'
                }
            },
            {
                id: 'cat_kirin',
                name: 'キリン猫',
                type: 'cat',
                emoji: '🦒',
                personality: '大きい・高い',
                description: '大きくて高い鳴き声の猫',
                position: { x: 35, y: 45 },
                phrases: [['so', 'la', 'ti', 'so', 'la', 'ti']],  // 高い音域
                currentPhrase: 0,
                tempo: 0.55,
                difficulty: 4,
                highPitch: true,
                bigAnimal: true,
                dialogue: {
                    greeting: 'キリンキリン ニャニャ♪\n（大きくて高い鳴き声...首が長いから高い音が出る...）',
                    success: 'キリン♡ニャ♡\n（キリン猫が最高にデレデレになった！大きく甘えたがってる！）',
                    failure: 'キリン...？\n（首を振って去っていった...）',
                    retry: 'キリン♡...？\n（戻ってきた...もう一度聞いてほしい？）'
                }
            },
            {
                id: 'cat_kuma',
                name: 'クマ猫',
                type: 'cat',
                emoji: '🐻',
                personality: '大きい・低い',
                description: '大きくて低い鳴き声の猫',
                position: { x: 80, y: 65 },
                phrases: [['do', 'mi', 'so', 'do', 'so', 'mi', 'do']],  // 低い音域
                currentPhrase: 0,
                tempo: 0.65,  // とてもゆっくり
                difficulty: 4,
                lowPitch: true,
                bigAnimal: true,
                dialogue: {
                    greeting: 'ガオー ニャニャ♪\n（大きくて低い鳴き声...のんびりしている...）',
                    success: 'ガオー♡ニャ♡\n（クマ猫が最高にデレデレになった！大きく甘えたがってる！）',
                    failure: 'ガオー...？\n（のんびりと去っていった...）',
                    retry: 'ガオー♡...？\n（戻ってきた...もう一度聞いてほしい？）'
                }
            }
        ],
        wolf: createWolf(6)  // 裏モード用の狼も作成
    },
    
    // ===== 裏モード2章：ダンスパーティ =====
    7: {
        cats: null,  // prepareChapterCharactersで動的に生成
        wolf: null   // prepareChapterCharactersで動的に生成
    }
};

/**
 * 狼を生成する関数
 */
function createWolf(chapter) {
    const baseWolf = {
        id: 'wolf_boss',
        name: '森の大狼 ガルム',
        type: 'wolf',
        emoji: '🐺',
        personality: '威厳のある',
        description: '森の奥に住む大きな狼',
        currentPhase: 0,
        retryCount: 0,
        maxRetries: 3
    };
    
    // 章ごとに難易度調整
    const phasesByChapter = {
        1: [
            {
                emotion: 'angry',
                phrases: [['do', 're', 'mi']],
                dialogue: {
                    intro: 'グルルル...！\n（怒っているようだ。なにか伝えたいみたい...）',
                    challenge: 'ガウッ！グルル...\n（音をまねてみて、って言ってる？）',
                    success: 'グル...？\n（少し落ち着いたみたい...）',
                    failure: 'ガウウウ！！\n（もっと怒らせてしまった！）'
                },
                tempo: 0.6
            },
            {
                emotion: 'calm',
                phrases: [['mi', 'fa', 'so', 'la']],
                dialogue: {
                    intro: 'ウォーン...\n（悲しげな遠吠えをしている）',
                    challenge: 'クゥーン...\n（さみしかったのかもしれない）',
                    success: 'ウォン！\n（しっぽを振り始めた！）',
                    failure: 'グルル...\n（また機嫌が悪くなった...）'
                },
                tempo: 0.55
            },
            {
                emotion: 'happy',
                phrases: [['do', 're', 'mi', 'fa', 'so']],
                dialogue: {
                    intro: 'ワン！ワン！\n（楽しそうにしている！）',
                    challenge: 'ウォーン♪\n（一緒に歌おう、って言ってる！）',
                    success: 'ワオーーン！！\n（大きく遠吠えして喜んでいる！）',
                    failure: 'クゥン...\n（ちょっと残念そう...もう一度！）'
                },
                tempo: 0.5
            }
        ],
        2: [
            {
                emotion: 'angry',
                phrases: [['so', 'fa', 'mi', 're']],
                dialogue: {
                    intro: 'グルルル...！\n（警戒している...音を覚えていないと難しそう）',
                    challenge: 'ガウッ！\n（下がっていく音だ...）',
                    success: 'グル...♪\n（認めてくれたみたい...）',
                    failure: 'ガウウウ！！\n（もっと練習が必要だ！）'
                },
                tempo: 0.5
            },
            {
                emotion: 'calm',
                phrases: [['do', 'mi', 'so', 'ti', 'so']],
                dialogue: {
                    intro: 'ウォーン...\n（メロディアスな遠吠え）',
                    challenge: 'クゥーン...\n（ちょっと複雑な音だ）',
                    success: 'ウォン！\n（目が優しくなった！）',
                    failure: 'グルル...\n（まだ信じてくれない...）'
                },
                tempo: 0.5
            },
            {
                emotion: 'happy',
                phrases: [['la', 'so', 'fa', 'mi', 're', 'do']],
                dialogue: {
                    intro: 'ワン！ワン！\n（とても楽しそう！）',
                    challenge: 'ウォーン♪\n（長い音階だ！頑張って！）',
                    success: 'ワオーーン！！\n（友達になれた！）',
                    failure: 'クゥン...\n（もう少し...！）'
                },
                tempo: 0.45
            }
        ],
        3: [
            {
                emotion: 'angry',
                phrases: [['do', 're', 'mi', 'fa']],
                dialogue: { intro: 'グルルル...！', challenge: 'ガウッ！', success: 'グル...♪', failure: 'ガウウウ！！' },
                tempo: 0.5
            },
            {
                emotion: 'calm',
                phrases: [['so', 'la', 'ti', 'la', 'so', 'fa']],
                dialogue: { intro: 'ウォーン...', challenge: 'クゥーン...', success: 'ウォン！', failure: 'グルル...' },
                tempo: 0.45
            },
            {
                emotion: 'happy',
                phrases: [['do', 'mi', 'so', 'mi', 'do', 're', 'fa']],
                dialogue: { intro: 'ワン！ワン！', challenge: 'ウォーン♪', success: 'ワオーーン！！', failure: 'クゥン...' },
                tempo: 0.4
            }
        ],
        4: [
            {
                emotion: 'angry',
                phrases: [['ti', 'la', 'so', 'fa', 'mi']],
                dialogue: { intro: 'グルルル...！（速い...）', challenge: 'ガウッ！', success: 'グル...♪', failure: 'ガウウウ！！' },
                tempo: 0.35
            },
            {
                emotion: 'calm',
                phrases: [['do', 're', 'mi', 'fa', 'so', 'la', 'ti']],
                dialogue: { intro: 'ウォーン...（長い呪文のよう）', challenge: 'クゥーン...', success: 'ウォン！', failure: 'グルル...' },
                tempo: 0.4
            },
            {
                emotion: 'happy',
                phrases: [['so', 'fa', 'mi', 're', 'do', 're', 'mi', 'fa']],
                dialogue: { intro: 'ワン！ワン！', challenge: 'ウォーン♪（複雑だ！）', success: 'ワオーーン！！', failure: 'クゥン...' },
                tempo: 0.35
            }
        ],
                5: [
            {
                emotion: 'angry',
                phrases: [['do', 'do#', 're', 're#', 'mi']],
                dialogue: { intro: 'グルルル...！（半音階...）', challenge: 'ガウッ！', success: 'グル...♪', failure: 'ガウウウ！！' },
                tempo: 0.4
            },
            {
                emotion: 'calm',
                phrases: [['la', 'la#', 'ti', 'la#', 'la', 'so#', 'so']],
                dialogue: { intro: 'ウォーン...（シ♭が響く）', challenge: 'クゥーン...', success: 'ウォン！', failure: 'グルル...' },
                tempo: 0.4
            },
            {
                emotion: 'happy',
                phrases: [['do', 're', 'mi', 'fa', 'fa#', 'so', 'so#', 'la', 'la#', 'ti']],
                dialogue: { intro: 'ワン！ワン！', challenge: 'ウォーン♪（全ての音！）', success: 'ワオーーン！！（完璧だ！！）', failure: 'クゥン...' },
                tempo: 0.35
            }
        ],
        6: [
            {
                emotion: 'playful',
                phrases: [['do', 'mi', 'so', 'do']],  // オクターブ増加で変化
                dialogue: { 
                    intro: 'ワン！ワン！♪\n（ご機嫌で遊びたがっている！）', 
                    challenge: 'ウォーン♪\n（高く跳ねて遊ぼう！）', 
                    success: 'ワオーーン！！（楽しい！もっと遊ぼう！）', 
                    failure: 'クゥン...（もう一度挑戦して！）' 
                },
                tempo: 0.5,
                octaveShift: 1,  // オクターブ上げる
                dance: true  // ダンスする
            },
            {
                emotion: 'playful',
                phrases: [['do', 're#', 'fa#', 'la#']],  // 変化する音
                dialogue: { 
                    intro: 'ワン！ワン！♪♪\n（リズムが変わるよ！）', 
                    challenge: 'ウォーン♪♪♪\n（変わったリズムをまねしてみて！）', 
                    success: 'ワオーーン！！（すごい！リズム感がいいね！）', 
                    failure: 'クゥン...（リズムが違うかも...）' 
                },
                tempo: 0.4,
                bouncyRhythm: true,  // 跳ねるリズム
                dance: true
            },
            {
                emotion: 'playful',
                phrases: [['do', 'mi', 'so', 'ti', 'so', 'mi', 'do']],  // 音域が広がる
                dialogue: { 
                    intro: 'ワン！ワン！ワン！♪\n（もっと高い音にも挑戦しよう！）', 
                    challenge: 'ウォーン♪♪\n（音域が広がったよ！まねしてみて！）', 
                    success: 'ワオーーン！！（完璧だ！一緒に踊ろう！）', 
                    failure: 'クゥン...（音の高さが違うかも...）' 
                },
                tempo: 0.35,
                octaveShift: 1,
                dance: true
            },
            {
                emotion: 'playful',
                phrases: [['do', 'do#', 're', 're#', 'mi', 'fa', 'fa#', 'so', 'so#', 'la', 'la#', 'ti']],  // 全ての音
                dialogue: { 
                    intro: 'ワン！ワン！ワン！ワン！♪♪♪\n（最後は全部の音を使おう！）', 
                    challenge: 'ウォーン♪♪♪♪\n（全ての12音で一緒に遊ぼう！）', 
                    success: 'ワオーーーーン！！（最高だ！！一緒に音楽を楽しもう！）', 
                    failure: 'クゥン...（あと少し！もう一度！）' 
                },
                tempo: 0.3,
                dance: true
            }
        ],
        7: [
            {
                emotion: 'playful',
                phrases: [['do', 'do#', 're', 're#', 'mi', 'fa', 'fa#', 'so', 'so#', 'la', 'la#', 'ti']],
                dialogue: {
                    intro: 'ワン！ワン！ワン！ワン！♪♪♪♪\n（ダンスパーティの最後！全ての音楽的変形をマスターしたね！）',
                    challenge: 'ウォーン♪♪♪♪\n（全ての12音で最高のダンスをしよう！）',
                    success: 'ワオーーーーン！！（最高だ！！一緒に踊ろう！！）',
                    failure: 'クゥン...（もう少し...！）'
                },
                tempo: 0.25,
                dance: true,
                shuffledRhythm: true  // リズムシャフル
            }
        ]
    };
    
    baseWolf.phases = phasesByChapter[chapter] || phasesByChapter[1];
    return baseWolf;
}

// ストーリーテキスト
const STORY = {
    opening: [
        '...ここは どこ...？',
        '気がつくと、あなたは見知らぬ森の中にいました。',
        '遠くから、不思議な音が聞こえてきます...',
        '♪ ニャー ♪ ワン ♪ ピヨピヨ ♪',
        '音のする方へ歩いていくと...',
        'そこには「どうぶつの村」がありました。',
        '村のどうぶつたちは、ドレミの音で会話しているようです。',
        'あなたも音で話しかけてみましょう！'
    ],
    
    villageIntro: '村のなかまたちに あいさつしよう！',
    
    beforeForest: [
        'すべての猫と仲良くなった！',
        'ニャーニャー！（森の奥に行ってほしいみたい...）',
        '森の奥には大きな狼がいるらしい。',
        '機嫌が悪くて、村のみんなが困っているようだ...',
        'あなたの「音の力」で助けてあげよう！'
    ],
    
    chapterIntros: {
        1: '第1章へようこそ！\n村の猫たちと音であいさつしてみましょう。\nシンプルな音から始まります。',
        2: '第2章へようこそ！\n今度は音の名前がわかりません。\n耳をすませて覚えていきましょう。\n新しい音との出会いが待っています。',
        3: '第3章へようこそ！\n双子の猫が現れます！\n同時に聞こえる2つの音を聞き分けましょう。\n和音の美しさを感じてください。',
        4: '第4章へようこそ！\n早口猫や魔女猫が登場！\n速さや長さに挑戦しましょう。\n個性豊かな仲間たちが待っています。',
        5: '最終章へようこそ！\nシ♭やファ#など、新しい音も登場します。\n全ての音をマスターしましょう！\nこれは最後の試練です。',
        6: '裏モード：平和の世界へようこそ！\n全ての章をクリアし、村に平和が戻りました。\n他所からも様々などうぶつたちが集まってきました。\n輪唱やリズム遊びなど、より音楽的な要素が増えています。\nガルムもご機嫌で、あなたと一緒に遊びたがっています！',
        7: '裏モード2章：ダンスパーティへようこそ！\n村祭りのダンスパーティが開催中です！\nしかし、いたずら子猫が鍵盤の音名表示を一部盗んでしまいました...\n今まで出会ったキャラクターたちが再登場しますが、\nリズムがシャフルされていたり、音が反行・逆行していたり...\n様々なスケール感もランダムに適用されます！\n最大の難易度に挑戦しましょう！'
    },
    
    ending: {
        1: 'ガルムは、ずっとさみしかったのです。\n村のみんなとあなたのおかげで、\nガルムの心にも平和が戻りました。\nこれからは、みんなで仲良く暮らせるでしょう...',
        2: 'ガルムは、もっと多くの音を知りたかったのです。\nあなたが教えてくれた音たちが、\nガルムの心を満たしてくれました。\n音楽の世界は広がり続けます...',
        3: 'ガルムは、双子の猫たちに興味を持っていました。\nあなたが奏でたハーモニーが、\nガルムの孤独を癒してくれました。\nこれからは、みんなで一緒に歌えるでしょう...',
        4: 'ガルムは、個性豊かな猫たちに憧れていました。\nあなたがすべての個性を受け入れたように、\nガルムも自分自身を受け入れられるようになりました。\n多様性の美しさを感じています...',
        5: 'ガルムは、全ての音を聞きたかったのです。\nあなたが奏でた12音すべてが、\nガルムの心を満たしてくれました。\nこれで音楽の世界は完成です...\n\n（裏モードが解放されました！）',
        6: '平和が戻った村では、\n様々などうぶつたちが集まってきました。\n輪唱やリズム遊びなど、\n音楽がさらに豊かになっています。\n\nガルムもご機嫌で、\nあなたと一緒に音楽を楽しんでいます。\nこれからも、この平和な世界で\n音楽を奏で続けていきましょう...',
        7: 'ダンスパーティは大成功でした！\nいたずら子猫も最後には仲直りして、\n盗んだ音名表示を返してくれました。\n\nリズムシャフル、反行、逆行、様々なスケール...\n全ての音楽的変形をマスターしたあなたは、\n真の音楽の達人となりました！\n\n村のみんなは、あなたのことを\n永遠に語り継ぐことでしょう...'
    }
};

// ヘルパー関数
const CharacterHelper = {
    getCurrentPhrase(character) {
        if (character.phrases) {
            return character.phrases[character.currentPhrase % character.phrases.length];
        }
        return [];
    },
    
    getTwinPhrase(character) {
        if (character.twinPhrases) {
            return character.twinPhrases[character.currentPhrase % character.twinPhrases.length];
        }
        return [];
    },
    
    getWolfPhase(wolf) {
        return wolf.phases[wolf.currentPhase];
    },
    
    getWolfPhrase(wolf) {
        const phase = this.getWolfPhase(wolf);
        return phase.phrases[0];
    },
    
    compareNotes(playerNotes, targetNotes) {
        if (playerNotes.length !== targetNotes.length) return false;
        return playerNotes.every((note, index) => note === targetNotes[index]);
    },
    
    // 双子用：2つの音列を比較
    compareTwinNotes(playerNotes, notes1, notes2) {
        // プレイヤーの入力を分解して両方と比較
        // 双子の場合、同時に鳴る音を順番に入力する想定
        const combinedNotes = [];
        const maxLen = Math.max(notes1.length, notes2.length);
        for (let i = 0; i < maxLen; i++) {
            if (i < notes1.length) combinedNotes.push(notes1[i]);
            if (i < notes2.length) combinedNotes.push(notes2[i]);
        }
        return this.compareNotes(playerNotes, combinedNotes);
    },
    
    // 輪唱用：繰り返しパターンで比較
    compareRoundNotes(playerNotes, phrase) {
        // フレーズを2回繰り返したパターンと比較
        const repeatedPhrase = [...phrase, ...phrase];
        return this.compareNotes(playerNotes, repeatedPhrase);
    },
    
    // 休符を除いて比較（ロボットキャラクター用）
    compareNotesWithRests(playerNotes, targetNotes) {
        // 休符（nullや特殊な記号）を除いて比較
        // 実際には休符は音が鳴らないので、プレイヤーの入力数とターゲットの音数で比較
        // 簡易版：通常の比較を使用（休符は再生時にスキップされるため）
        return this.compareNotes(playerNotes, targetNotes);
    },
    
    nextPhrase(character) {
        if (character.phrases && character.phrases.length > 1) {
            character.currentPhrase = Math.floor(Math.random() * character.phrases.length);
        }
    },
    
    // ランダムなフレーズを生成
    generateRandomPhrase(length, availableNotes) {
        const phrase = [];
        for (let i = 0; i < length; i++) {
            const randomNote = availableNotes[Math.floor(Math.random() * availableNotes.length)];
            phrase.push(randomNote);
        }
        return phrase;
    },
    
    // キャラクターのフレーズをランダム化
    randomizeCharacterPhrases(character, availableNotes) {
        const baseLength = character.phrases[0].length;
        character.phrases = [this.generateRandomPhrase(baseLength, availableNotes)];
        if (character.twinPhrases) {
            const twinLength = character.twinPhrases[0].length;
            character.twinPhrases = [this.generateRandomPhrase(twinLength, availableNotes)];
        }
    },
    
    // 裏モード2章用：音楽的変形を適用
    applyDancePartyTransformations(character, availableNotes) {
        const originalPhrases = [...character.phrases];
        const transformedPhrases = [];
        
        for (const phrase of originalPhrases) {
            let transformed = [...phrase];
            
            // ランダムに変形を適用
            const transformations = [];
            
            // リズムシャフル（30%の確率）
            if (Math.random() < 0.3) {
                transformed = this.shuffleRhythm(transformed);
                transformations.push('shuffle');
            }
            
            // 反行（上下逆）（25%の確率）
            if (Math.random() < 0.25) {
                transformed = this.invert(transformed);
                transformations.push('invert');
            }
            
            // 逆行（前後逆）（25%の確率）
            if (Math.random() < 0.25) {
                transformed = this.retrograde(transformed);
                transformations.push('retrograde');
            }
            
            // スケール変換（40%の確率）
            if (Math.random() < 0.4) {
                const scaleType = ['minor', 'ethnic', 'mysterious', 'alt'][Math.floor(Math.random() * 4)];
                transformed = this.applyScale(transformed, scaleType, availableNotes);
                transformations.push(scaleType);
            }
            
            transformedPhrases.push(transformed);
            character.dancePartyTransformations = transformations;
        }
        
        character.phrases = transformedPhrases;
        
        // 輪唱の場合、順方向・逆方向をランダムに
        if (character.isRound) {
            character.roundReverse = Math.random() < 0.5;
        }
        
        // リズムシャフルフラグ
        if (character.phrases.some((_, i) => character.dancePartyTransformations && character.dancePartyTransformations.includes('shuffle'))) {
            character.shuffledRhythm = true;
        }
    },
    
    // リズムシャフル：長さを保ちながら順序をシャッフル
    shuffleRhythm(phrase) {
        const shuffled = [...phrase];
        // フィッシャー-イェーツのシャッフル
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },
    
    // 反行（上下逆）：ドレミファソラシ → シラソファミレド（中央のドを軸に反転）
    invert(phrase) {
        // ドを基準に反転（簡易版：音階を逆にする）
        const noteOrder = ['do', 'do#', 're', 're#', 'mi', 'fa', 'fa#', 'so', 'so#', 'la', 'la#', 'ti'];
        return phrase.map(note => {
            const index = noteOrder.indexOf(note);
            if (index === -1) return note;
            // 中央（ド=0）を軸に反転
            const invertedIndex = -index;
            // 12音を超えないように調整
            const newIndex = ((invertedIndex % 12) + 12) % 12;
            return noteOrder[newIndex];
        });
    },
    
    // 逆行（前後逆）
    retrograde(phrase) {
        return [...phrase].reverse();
    },
    
    // スケール変換
    applyScale(phrase, scaleType, availableNotes) {
        // 簡易版：スケールに合わせて音を変換
        // 実際の実装ではより複雑なスケール変換が必要
        return phrase.map(note => {
            if (scaleType === 'minor') {
                // マイナースケール：ミ、ラ、シを半音下げる
                const minorMap = {'mi': 're#', 'la': 'so#', 'ti': 'la#'};
                return minorMap[note] || note;
            } else if (scaleType === 'ethnic') {
                // 民族的なスケール：一部の音を変更
                const ethnicMap = {'fa': 'fa#', 'ti': 'la#'};
                return ethnicMap[note] || note;
            } else if (scaleType === 'mysterious') {
                // 神秘的なスケール：半音階的
                const noteOrder = ['do', 'do#', 're', 're#', 'mi', 'fa', 'fa#', 'so', 'so#', 'la', 'la#', 'ti'];
                const index = noteOrder.indexOf(note);
                if (index === -1) return note;
                // ランダムに半音上げるか下げる
                const offset = Math.random() < 0.5 ? 1 : -1;
                const newIndex = Math.max(0, Math.min(11, index + offset));
                return noteOrder[newIndex];
            } else if (scaleType === 'alt') {
                // Altスケール：特定の音を変化
                const altMap = {'do': 'do#', 're': 're#', 'fa': 'fa#', 'so': 'so#', 'la': 'la#'};
                return altMap[note] || note;
            }
            return note;
        });
    }
};

/**
 * 裏モード2章のキャラクターを生成
 */
function createDancePartyCharacters() {
    // 過去の章からキャラクターをランダムに選択
    const allCats = [];
    
    // 各章からキャラクターを収集
    for (let chapter = 1; chapter <= 6; chapter++) {
        const chapterData = CHAPTER_CHARACTERS[chapter];
        // 7章の場合はスキップ（まだ定義中）
        if (chapter === 7) continue;
        if (chapterData && chapterData.cats && Array.isArray(chapterData.cats)) {
            chapterData.cats.forEach(cat => {
                // ベースとなるキャラクターをコピー
                const copiedCat = JSON.parse(JSON.stringify(cat));
                copiedCat.id = `dance_${cat.id}_${Math.random().toString(36).substr(2, 9)}`;
                copiedCat.originalId = cat.id;
                allCats.push(copiedCat);
            });
        }
    }
    
    // ランダムに5-7匹を選択
    const selectedCount = 5 + Math.floor(Math.random() * 3);
    const selectedCats = [];
    const usedIds = new Set();
    
    while (selectedCats.length < selectedCount && allCats.length > 0) {
        const randomIndex = Math.floor(Math.random() * allCats.length);
        const cat = allCats.splice(randomIndex, 1)[0];
        
        // 重複を避ける（同じ元のキャラクターは1回まで）
        if (!usedIds.has(cat.originalId)) {
            usedIds.add(cat.originalId);
            selectedCats.push(cat);
        }
    }
    
    // ダンスパーティ変形を適用
    const availableNotes = CHAPTERS[7].availableNotes;
    selectedCats.forEach(cat => {
        CharacterHelper.applyDancePartyTransformations(cat, availableNotes);
    });
    
    // ロボ猫を追加
    selectedCats.push({
        id: 'cat_robo',
        name: 'ロボ猫',
        type: 'cat',
        emoji: '🤖',
        personality: '機械音',
        description: '繰り返しと平行移動の機械音を発する猫',
        position: { x: 50, y: 58 },
        phrases: [['do', 're', 'mi', 'do', 're', 'mi', 'fa', 'so']],  // 繰り返し多め
        currentPhrase: 0,
        tempo: 0.3,
        difficulty: 7,
        isRobot: true,
        hasRest: true,  // 休符を含む
        dialogue: {
            greeting: 'ビープ ビープ ニャ♪\n（機械的な音を発している...繰り返しが多い...）',
            success: 'ビープ♡ニャ♡\n（ロボ猫が最高にデレデレになった！機械音で甘えたがってる！）',
            failure: 'ビープ...？\n（システムエラーで停止した...）',
            retry: 'ビープ♡...？\n（再起動して戻ってきた...）'
        }
    });
    
    // エンジニア猫を追加
    selectedCats.push({
        id: 'cat_engineer',
        name: 'エンジニア猫',
        type: 'cat',
        emoji: '👨‍💻',
        personality: 'プログラミング',
        description: 'プログラミングのような音列を発する猫',
        position: { x: 70, y: 62 },
        phrases: [['do', 'do', 're', 're', 'mi', 'fa', 'fa', 'so']],  // 繰り返しパターン
        currentPhrase: 0,
        tempo: 0.25,
        difficulty: 7,
        isRobot: true,
        hasRest: true,
        dialogue: {
            greeting: 'コード コード ニャ♪\n（プログラミングのような音列...繰り返しと休符がある...）',
            success: 'コード♡ニャ♡\n（エンジニア猫が最高にデレデレになった！コードを奏でながら甘えたがってる！）',
            failure: 'コード...？\n（バグでクラッシュした...）',
            retry: 'コード♡...？\n（デバッグして戻ってきた...）'
        }
    });
    
    return selectedCats;
}
