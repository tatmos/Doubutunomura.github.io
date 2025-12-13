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
        1: '第1章へようこそ！\n村の猫たちと音であいさつしてみましょう。',
        2: '第2章へようこそ！\n今度は音の名前がわかりません。\n耳をすませて覚えていきましょう。',
        3: '第3章へようこそ！\n双子の猫が現れます！\n同時に聞こえる2つの音を聞き分けましょう。',
        4: '第4章へようこそ！\n早口猫や魔女猫が登場！\n速さや長さに挑戦しましょう。',
        5: '最終章へようこそ！\nシ♭やファ#など、新しい音も登場します。\n全ての音をマスターしましょう！'
    },
    
    ending: [
        'ガルムは、ずっとさみしかったのです。',
        '村のみんなとあなたのおかげで、',
        'ガルムの心にも平和が戻りました。',
        'これからは、みんなで仲良く暮らせるでしょう...'
    ]
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
    }
};
