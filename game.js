/**
 * どうぶつの村 〜音の絆〜
 * メインゲームロジック（全5章対応版）
 */

class Game {
    constructor() {
        this.state = {
            currentScreen: 'title',
            currentChapter: 1,
            storyIndex: 0,
            friends: [],
            escapedCats: [],
            currentCharacter: null,
            playerNotes: [],
            targetNotes: [],
            twinTargetNotes: [],  // 双子用
            isPlaying: false,
            wolfDefeated: false,
            learnedNotes: ['do', 're'],  // 最初から知っている音
            completedChapters: [],
            speechEnabled: true
        };
        
        // セーブデータを読み込み
        this.loadProgress();
        
        this.screens = {};
        this.elements = {};
        this.village3D = null;  // 3D村システム
        this.forestPath3D = null;  // 3D森の道システム
        
        this.init();
    }
    
    init() {
        this.screens = {
            title: document.getElementById('title-screen'),
            chapterSelect: document.getElementById('chapter-select-screen'),
            opening: document.getElementById('opening-screen'),
            village: document.getElementById('village-screen'),
            dialogue: document.getElementById('dialogue-screen'),
            result: document.getElementById('result-screen'),
            forestPath: document.getElementById('forest-path-screen'),
            wolf: document.getElementById('wolf-screen'),
            ending: document.getElementById('ending-screen')
        };
        
        this.elements = {
            storyText: document.getElementById('story-text'),
            villageMessage: document.getElementById('village-message'),
            friendCount: document.getElementById('friend-count'),
            totalCats: document.getElementById('total-cats'),
            charactersContainer: document.getElementById('characters-container'),
            village3DCanvas: document.getElementById('village-3d-canvas'),
            animalSprite: document.getElementById('animal-sprite'),
            animalName: document.getElementById('animal-name'),
            animalNotes: document.getElementById('animal-notes'),
            playerNotes: document.getElementById('player-notes'),
            dialogueText: document.getElementById('dialogue-text'),
            resultAnimal: document.getElementById('result-animal'),
            resultTitle: document.getElementById('result-title'),
            resultMessage: document.getElementById('result-message'),
            learnedNoteDisplay: document.getElementById('learned-note-display'),
            wolfSprite: document.getElementById('wolf-sprite'),
            wolfNotes: document.getElementById('wolf-notes'),
            wolfPlayerNotes: document.getElementById('wolf-player-notes'),
            wolfDialogueText: document.getElementById('wolf-dialogue-text'),
            wolfPhase: document.getElementById('wolf-phase'),
            endingAnimals: document.getElementById('ending-animals'),
            endingChapter: document.getElementById('ending-chapter'),
            endingText: document.getElementById('ending-text'),
            chapterList: document.getElementById('chapter-list'),
            currentChapterName: document.getElementById('current-chapter-name'),
            learnedNotesDisplay: document.getElementById('learned-notes-display'),
            pianoKeyboard: document.getElementById('piano-keyboard'),
            wolfPianoKeyboard: document.getElementById('wolf-piano-keyboard'),
            speechToggle: document.getElementById('speech-toggle'),
            forestEntrance3D: document.getElementById('forest-entrance-3d'),
            forestPathCanvas: document.getElementById('forest-path-canvas'),
            forestPathMessage: document.getElementById('forest-path-message')
        };
        
        this.setupEventListeners();
        this.renderChapterList();
    }
    
    setupEventListeners() {
        // タイトル画面
        document.getElementById('chapter-select-btn').addEventListener('click', () => {
            this.showScreen('chapterSelect');
        });
        
        // 章選択画面
        document.getElementById('back-to-title-btn').addEventListener('click', () => {
            this.showScreen('title');
        });
        
        // オープニング
        document.getElementById('next-story-btn').addEventListener('click', () => {
            this.nextStory();
        });
        
        document.getElementById('skip-story-btn').addEventListener('click', () => {
            this.skipStory();
        });
        
        // 対話画面のボタン
        document.getElementById('replay-btn').addEventListener('click', () => {
            this.replayCurrentPhrase();
        });
        
        document.getElementById('clear-btn').addEventListener('click', () => {
            this.clearPlayerNotes();
        });
        
        document.getElementById('submit-btn').addEventListener('click', () => {
            this.submitAnswer();
        });
        
        // 結果画面
        document.getElementById('continue-btn').addEventListener('click', () => {
            this.continueFromResult();
        });
        
        // 狼画面のボタン
        document.getElementById('wolf-replay-btn').addEventListener('click', () => {
            this.replayWolfPhrase();
        });
        
        document.getElementById('wolf-clear-btn').addEventListener('click', () => {
            this.clearWolfPlayerNotes();
        });
        
        document.getElementById('wolf-submit-btn').addEventListener('click', () => {
            this.submitWolfAnswer();
        });
        
        // 森の入り口（3D版）
        if (this.elements.forestEntrance3D) {
            this.elements.forestEntrance3D.addEventListener('click', () => {
                this.enterForest();
            });
        }
        
        // エンディング
        document.getElementById('restart-btn').addEventListener('click', () => {
            this.showScreen('chapterSelect');
        });
        
        document.getElementById('next-chapter-btn').addEventListener('click', () => {
            this.startNextChapter();
        });
        
        // 音声読み上げトグル
        this.elements.speechToggle.addEventListener('click', () => {
            this.toggleSpeech();
        });
        
        // キーボード入力
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });
    }
    
    // ===== 音声読み上げ =====
    toggleSpeech() {
        this.state.speechEnabled = !this.state.speechEnabled;
        audioSystem.toggleSpeech(this.state.speechEnabled);
        this.elements.speechToggle.textContent = this.state.speechEnabled ? '🔊' : '🔇';
        this.elements.speechToggle.classList.toggle('disabled', !this.state.speechEnabled);
    }
    
    async speakText(text, characterType = 'narrator') {
        if (this.state.speechEnabled) {
            // 括弧内のテキストを除去して読み上げ
            const cleanText = text.replace(/[\n]/g, '。').replace(/[（\(].*?[）\)]/g, '');
            await audioSystem.speakAsCharacter(cleanText, characterType);
        }
    }
    
    // ===== セーブ/ロード =====
    saveProgress() {
        const saveData = {
            completedChapters: this.state.completedChapters,
            learnedNotes: this.state.learnedNotes
        };
        localStorage.setItem('animalVillage_save', JSON.stringify(saveData));
    }
    
    loadProgress() {
        try {
            const saveData = JSON.parse(localStorage.getItem('animalVillage_save'));
            if (saveData) {
                this.state.completedChapters = saveData.completedChapters || [];
                this.state.learnedNotes = saveData.learnedNotes || ['do', 're'];
            }
        } catch (e) {
            console.log('No save data found');
        }
    }
    
    // ===== 章選択 =====
    renderChapterList() {
        this.elements.chapterList.innerHTML = '';
        
        // 裏モードが解放されているかチェック
        const secretModeUnlocked = this.state.completedChapters.includes(5);
        const secretMode2Unlocked = this.state.completedChapters.includes(6);
        const maxChapter = secretMode2Unlocked ? 7 : (secretModeUnlocked ? 6 : 5);
        
        for (let i = 1; i <= maxChapter; i++) {
            const chapter = CHAPTERS[i];
            if (!chapter) continue;
            
            let isUnlocked;
            if (i === 1) {
                isUnlocked = true;
            } else if (i === 6) {
                // 裏モードは5章クリア後に解放
                isUnlocked = secretModeUnlocked;
            } else if (i === 7) {
                // 裏モード2章は6章クリア後に解放
                isUnlocked = secretMode2Unlocked;
            } else {
                isUnlocked = this.state.completedChapters.includes(i - 1);
            }
            
            const isCompleted = this.state.completedChapters.includes(i);
            const isSecret = chapter.isSecretMode;
            
            const item = document.createElement('div');
            item.className = `chapter-item ${isUnlocked ? '' : 'locked'} ${isCompleted ? 'completed' : ''} ${isSecret ? 'secret' : ''}`;
            
            item.innerHTML = `
                <div class="chapter-number">${isSecret ? '🎭' : i}</div>
                <div class="chapter-info">
                    <div class="chapter-title">${chapter.title}</div>
                    <div class="chapter-description">${chapter.description}</div>
                </div>
            `;
            
            if (isUnlocked) {
                item.addEventListener('click', () => {
                    this.startChapter(i);
                });
            }
            
            this.elements.chapterList.appendChild(item);
        }
    }
    
    async startChapter(chapterNum) {
        await audioSystem.init();
        
        this.state.currentChapter = chapterNum;
        this.state.storyIndex = 0;
        this.state.friends = [];
        this.state.escapedCats = [];
        this.state.currentCharacter = null;
        this.state.playerNotes = [];
        this.state.wolfDefeated = false;
        // 裏モード2章用の盗まれた音名をリセット・生成
        if (chapterNum === 7) {
            // 7章では全ての音名を忘れた状態にする（いたずら子猫に盗まれたため）
            this.state.learnedNotes = [];
            // 章開始時に盗まれた音名を生成
            const chapter = CHAPTERS[chapterNum];
            if (chapter && chapter.randomHideNoteNames && chapter.availableNotes) {
                this.state.stolenNoteNames = this.generateStolenNoteNames(chapter.availableNotes);
            } else {
                this.state.stolenNoteNames = null;
            }
        } else {
            // 他の章ではリセット
            this.state.stolenNoteNames = null;
        }
        
        // 章ごとの設定でキャラクターを準備
        this.prepareChapterCharacters();
        
        // 狼をリセット
        const chapterData = CHAPTER_CHARACTERS[chapterNum];
        if (chapterData && chapterData.wolf) {
            chapterData.wolf.currentPhase = 0;
            chapterData.wolf.retryCount = 0;
        }
        
        // 章のイントロを表示
        await audioSystem.playChapterStart();
        this.showScreen('opening');
        const introText = STORY.chapterIntros[chapterNum] || STORY.opening[0];
        this.showStoryText(introText);
        await this.speakText(introText);
    }
    
    prepareChapterCharacters() {
        const chapter = CHAPTERS[this.state.currentChapter];
        if (!chapter) {
            console.error(`Chapter ${this.state.currentChapter} not found`);
            return;
        }
        
        let chapterData = CHAPTER_CHARACTERS[this.state.currentChapter];
        
        // 裏モード2章の場合はキャラクターを動的に生成
        if (this.state.currentChapter === 7) {
            try {
                if (typeof createDancePartyCharacters === 'function') {
                    const dynamicCats = createDancePartyCharacters();
                    chapterData = {
                        cats: dynamicCats,
                        wolf: createWolf(7)
                    };
                    // キャッシュを更新
                    CHAPTER_CHARACTERS[7] = chapterData;
                } else {
                    console.error('createDancePartyCharacters is not defined');
                    // フォールバック：空のキャラクターリスト
                    chapterData = {
                        cats: [],
                        wolf: createWolf(7)
                    };
                    CHAPTER_CHARACTERS[7] = chapterData;
                }
            } catch (error) {
                console.error('Error creating dance party characters:', error);
                // フォールバック
                chapterData = {
                    cats: [],
                    wolf: createWolf(7)
                };
                CHAPTER_CHARACTERS[7] = chapterData;
            }
        }
        
        if (!chapterData) {
            console.error(`Chapter data for chapter ${this.state.currentChapter} not found`);
            return;
        }
        
        // 7章の場合はcatsがnullの可能性があるので、動的生成後にチェック
        if (this.state.currentChapter === 7 && (!chapterData.cats || chapterData.cats.length === 0)) {
            console.warn('Chapter 7 cats not initialized, skipping character preparation');
            return;
        }
        
        if (!chapterData.cats || !Array.isArray(chapterData.cats)) {
            console.error(`Invalid cats array for chapter ${this.state.currentChapter}`);
            return;
        }
        
        // ランダム化が有効な章の場合（裏モード2章は既に変形済みなのでスキップ）
        if (chapter.randomizePhrases && this.state.currentChapter !== 7) {
            chapterData.cats.forEach(cat => {
                if (cat && cat.phrases) {
                    CharacterHelper.randomizeCharacterPhrases(cat, chapter.availableNotes);
                }
            });
        }
        
        // 裏モード2章の場合は位置を再設定
        if (this.state.currentChapter === 7 && chapterData.cats && Array.isArray(chapterData.cats)) {
            const positions = [
                { x: 15, y: 55 }, { x: 30, y: 62 }, { x: 50, y: 60 },
                { x: 65, y: 58 }, { x: 40, y: 70 }, { x: 75, y: 55 },
                { x: 25, y: 65 }, { x: 55, y: 52 }, { x: 70, y: 62 }
            ];
            chapterData.cats.forEach((cat, index) => {
                if (!cat.position || cat.position.x === undefined) {
                    cat.position = positions[index % positions.length] || { x: 50, y: 58 };
                }
            });
        }
    }
    
    // ===== ピアノキーボード =====
    renderPianoKeyboard(container, isWolf = false) {
        const chapter = CHAPTERS[this.state.currentChapter];
        const hasBlackKeys = chapter.hasBlackKeys;
        
        container.innerHTML = '';
        
        // 白鍵の配列
        const whiteKeys = ['do', 're', 'mi', 'fa', 'so', 'la', 'ti'];
        // 黒鍵のマッピング（白鍵の後に配置）
        const blackKeyMap = {
            'do': 'do#',
            're': 're#',
            'fa': 'fa#',
            'so': 'so#',
            'la': 'la#'
        };
        
        const noteNames = {
            'do': 'ド', 're': 'レ', 'mi': 'ミ', 'fa': 'ファ',
            'so': 'ソ', 'la': 'ラ', 'ti': 'シ',
            'do#': 'ド#', 're#': 'レ#', 'fa#': 'ファ#',
            'so#': 'ソ#', 'la#': 'シ♭'
        };
        
        whiteKeys.forEach((note, index) => {
            // 白鍵を作成
            const whiteKey = document.createElement('div');
            whiteKey.className = 'piano-key white';
            whiteKey.dataset.note = note;
            
            // 音名を表示するかどうか
            const displayName = this.shouldShowNoteName(note) ? noteNames[note] : '?';
            whiteKey.textContent = displayName;
            
            whiteKey.addEventListener('click', () => {
                if (isWolf) {
                    this.onWolfPianoKeyPress(note);
                } else {
                    this.onPianoKeyPress(note);
                }
            });
            
            container.appendChild(whiteKey);
            
            // 黒鍵を追加（hasBlackKeysがtrueの場合）
            if (hasBlackKeys && blackKeyMap[note]) {
                const blackNote = blackKeyMap[note];
                const blackKey = document.createElement('div');
                blackKey.className = 'piano-key black';
                blackKey.dataset.note = blackNote;
                
                const blackDisplayName = this.shouldShowNoteName(blackNote) ? noteNames[blackNote] : '?';
                blackKey.textContent = blackDisplayName;
                
                blackKey.addEventListener('click', () => {
                    if (isWolf) {
                        this.onWolfPianoKeyPress(blackNote);
                    } else {
                        this.onPianoKeyPress(blackNote);
                    }
                });
                
                container.appendChild(blackKey);
            }
        });
    }
    
    shouldShowNoteName(note) {
        const chapter = CHAPTERS[this.state.currentChapter];
        
        // 裏モード2章：ランダムに一部非表示（優先処理）
        if (chapter && chapter.randomHideNoteNames && this.state.currentChapter === 7) {
            // 裏モード2章用の盗まれた音名リストを確認
            if (!this.state.stolenNoteNames || !Array.isArray(this.state.stolenNoteNames)) {
                // まだ生成されていない場合は生成（フォールバック）
                if (chapter.availableNotes) {
                    this.state.stolenNoteNames = this.generateStolenNoteNames(chapter.availableNotes);
                } else {
                    return true;
                }
            }
            // 盗まれた音名（忘れた音名）で、まだ覚えていない場合は非表示
            // 覚えた（取り返した）音名は表示される
            const isStolen = this.state.stolenNoteNames.includes(note);
            const isLearned = this.state.learnedNotes && this.state.learnedNotes.includes(note);
            const shouldHide = isStolen && !isLearned;
            return !shouldHide;
        }
        
        // 第1章または音名非表示がオフの場合は全て表示
        if (!chapter || !chapter.hideNoteNames) {
            return true;
        }
        
        // 覚えた音は表示
        return this.state.learnedNotes && this.state.learnedNotes.includes(note);
    }
    
    /**
     * 盗まれた音名をランダムに生成
     */
    generateStolenNoteNames(availableNotes) {
        const stolen = [];
        const stolenCount = Math.floor(availableNotes.length * (0.3 + Math.random() * 0.1)); // 30-40%
        const notesToSteal = [...availableNotes].sort(() => Math.random() - 0.5).slice(0, stolenCount);
        return notesToSteal;
    }
    
    learnNote(note) {
        if (!this.state.learnedNotes.includes(note)) {
            this.state.learnedNotes.push(note);
            // 7章の場合、盗まれた音名から取り戻した（覚えた）音名を削除
            if (this.state.currentChapter === 7 && this.state.stolenNoteNames && this.state.stolenNoteNames.includes(note)) {
                const index = this.state.stolenNoteNames.indexOf(note);
                if (index > -1) {
                    this.state.stolenNoteNames.splice(index, 1);
                }
            }
            this.saveProgress();
            // 7章の場合は表示を更新
            if (this.state.currentChapter === 7) {
                this.renderPianoKeyboard(this.elements.pianoKeyboard);
                this.updateLearnedNotesDisplay();
            }
        }
    }
    
    updateLearnedNotesDisplay() {
        const chapter = CHAPTERS[this.state.currentChapter];
        if (!chapter.hideNoteNames) {
            this.elements.learnedNotesDisplay.style.display = 'none';
            return;
        }
        
        this.elements.learnedNotesDisplay.style.display = 'flex';
        this.elements.learnedNotesDisplay.innerHTML = '';
        
        const allNotes = chapter.availableNotes;
        const noteNames = {
            'do': 'ド', 're': 'レ', 'mi': 'ミ', 'fa': 'ファ',
            'so': 'ソ', 'la': 'ラ', 'ti': 'シ',
            'do#': 'ド#', 're#': 'レ#', 'fa#': 'ファ#',
            'so#': 'ソ#', 'la#': 'シ♭'
        };
        
        allNotes.forEach(note => {
            const noteEl = document.createElement('div');
            const isLearned = this.state.learnedNotes.includes(note);
            noteEl.className = `learned-note ${this.getNoteColorClass(note)} ${isLearned ? '' : 'unknown'}`;
            noteEl.textContent = isLearned ? noteNames[note] : '?';
            this.elements.learnedNotesDisplay.appendChild(noteEl);
        });
    }
    
    getNoteColorClass(note) {
        const colorMap = {
            'do': 'do', 're': 're', 'mi': 'mi', 'fa': 'fa',
            'so': 'so', 'la': 'la', 'ti': 'ti',
            'do#': 'do-sharp', 're#': 're-sharp',
            'fa#': 'fa-sharp', 'so#': 'so-sharp', 'la#': 'la-sharp'
        };
        return colorMap[note] || 'do';
    }
    
    // ===== キーボード入力 =====
    handleKeyboard(e) {
        const keyMap = {
            'a': 'do', 's': 're', 'd': 'mi', 'f': 'fa',
            'g': 'so', 'h': 'la', 'j': 'ti',
            'z': 'do', 'x': 're', 'c': 'mi', 'v': 'fa',
            'b': 'so', 'n': 'la', 'm': 'ti',
            // 黒鍵
            'w': 'do#', 'e': 're#', 't': 'fa#', 'y': 'so#', 'u': 'la#'
        };
        
        const note = keyMap[e.key.toLowerCase()];
        
        if (note) {
            const chapter = CHAPTERS[this.state.currentChapter];
            if (note.includes('#') && !chapter.hasBlackKeys) return;
            
            if (this.state.currentScreen === 'dialogue') {
                this.onPianoKeyPress(note);
            } else if (this.state.currentScreen === 'wolf') {
                this.onWolfPianoKeyPress(note);
            }
        }
    }
    
    // ===== 画面制御 =====
    showScreen(screenName) {
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
        });
        
        if (this.screens[screenName]) {
            this.screens[screenName].classList.add('active');
            this.state.currentScreen = screenName;
        }
    }
    
    // ===== ストーリー =====
    showStoryText(text) {
        this.elements.storyText.textContent = '';
        let index = 0;
        
        const typeWriter = () => {
            if (index < text.length) {
                this.elements.storyText.textContent += text.charAt(index);
                index++;
                setTimeout(typeWriter, 50);
            }
        };
        
        typeWriter();
    }
    
    async nextStory() {
        this.state.storyIndex++;
        
        if (this.state.storyIndex < STORY.opening.length) {
            const text = STORY.opening[this.state.storyIndex];
            this.showStoryText(text);
            await this.speakText(text);
        } else {
            this.enterVillage();
        }
    }
    
    skipStory() {
        this.enterVillage();
    }
    
    // ===== 村 =====
    enterVillage() {
        this.showScreen('village');
        
        const chapter = CHAPTERS[this.state.currentChapter];
        const chapterData = CHAPTER_CHARACTERS[this.state.currentChapter];
        
        this.elements.currentChapterName.textContent = chapter.title;
        this.elements.totalCats.textContent = chapterData.cats.length;
        this.elements.villageMessage.innerHTML = STORY.villageIntro + '<br><small>PC: WASD/矢印キーで移動、マウスで視点変更<br>スマホ: 画面をタッチして移動、画面上部をタッチして視点変更</small>';
        
        // 3D村を初期化（エラーハンドリング付き）
        try {
            // Three.jsが読み込まれているか確認
            if (typeof THREE === 'undefined') {
                console.error('Three.jsが読み込まれていません');
                this.elements.villageMessage.innerHTML = 'エラー: Three.jsが読み込まれていません。<br>ページを再読み込みしてください。<br><small>（インターネット接続を確認してください）</small>';
                // フォールバック: 2D表示に戻す
                this.renderCharacters();
                return;
            }
            
            // キャンバス要素が存在するか確認
            if (!this.elements.village3DCanvas) {
                console.error('3Dキャンバス要素が見つかりません');
                this.elements.villageMessage.innerHTML = 'エラー: 3Dキャンバスが見つかりません。';
                // フォールバック: 2D表示に戻す
                this.renderCharacters();
                return;
            }
            
            // キャンバスのコンテキストが取得できるか確認
            const testContext = this.elements.village3DCanvas.getContext('webgl') || 
                              this.elements.village3DCanvas.getContext('webgl2');
            if (!testContext) {
                console.warn('WebGLがサポートされていません。2D表示にフォールバックします。');
                this.elements.villageMessage.innerHTML = 'WebGLがサポートされていません。<br>2D表示で続行します。';
                this.renderCharacters();
                return;
            }
            
            // 既存の3Dシーンを破棄
            if (this.village3D) {
                try {
                    this.village3D.destroy();
                } catch (e) {
                    console.warn('既存の3Dシーンの破棄中にエラー:', e);
                }
                this.village3D = null;
            }
            
            // 3D村を初期化
            this.village3D = new Village3D(this.elements.village3DCanvas, this);
            this.village3D.init(chapterData.cats, this.state.friends, this.state.escapedCats);
        } catch (error) {
            console.error('3D村の初期化エラー:', error);
            console.error('エラースタック:', error.stack);
            this.elements.villageMessage.innerHTML = `エラーが発生しました: ${error.message}<br>ページを再読み込みしてください。<br><small>詳細: ${error.stack || 'スタック情報なし'}</small>`;
            // フォールバック: 2D表示に戻す
            try {
                this.renderCharacters();
            } catch (e) {
                console.error('2D表示へのフォールバックも失敗:', e);
            }
        }
        
        this.updateFriendCount();
        this.updateLearnedNotesDisplay();
    }
    
    renderCharacters() {
        this.elements.charactersContainer.innerHTML = '';
        
        const chapterData = CHAPTER_CHARACTERS[this.state.currentChapter];
        if (!chapterData) return;
        
        // キャラクターの位置情報を先に収集（重なり検出用）
        const positions = [];
        chapterData.cats.forEach((cat, index) => {
            let x = cat.position.x;
            let y = cat.position.y;
            
            // 重なり検出と自動調整
            const overlapThreshold = 8; // パーセンテージでの重なり閾値
            let adjusted = false;
            let attempts = 0;
            const maxAttempts = 20; // 無限ループ防止
            
            while (!adjusted && attempts < maxAttempts) {
                let hasOverlap = false;
                for (let i = 0; i < positions.length; i++) {
                    const other = positions[i];
                    const dx = Math.abs(x - other.x);
                    const dy = Math.abs(y - other.y);
                    
                    if (dx < overlapThreshold && dy < overlapThreshold) {
                        hasOverlap = true;
                        // 重なっている場合、右または下にずらす
                        if (x < 80) {
                            x = Math.min(other.x + overlapThreshold, 85);
                        } else {
                            x = Math.max(other.x - overlapThreshold, 5);
                        }
                        if (y < 75) {
                            y = Math.min(other.y + overlapThreshold, 80);
                        } else {
                            y = Math.max(other.y - overlapThreshold, 45);
                        }
                        break;
                    }
                }
                
                if (!hasOverlap) {
                    adjusted = true;
                }
                attempts++;
            }
            
            positions.push({ x, y });
        });
        
        // キャラクターの要素を全て作成
        chapterData.cats.forEach((cat, index) => {
            const charElement = document.createElement('div');
            charElement.className = 'character';
            charElement.dataset.id = cat.id;
            
            const isFriend = this.state.friends.includes(cat.id);
            const hasEscaped = this.state.escapedCats.includes(cat.id);
            
            if (isFriend) {
                charElement.classList.add('befriended');
            }
            
            if (hasEscaped) {
                charElement.classList.add('escaped');
            }
            
            // 調整済み位置を設定
            const pos = positions[index];
            charElement.style.left = `${pos.x}%`;
            charElement.style.top = `${pos.y}%`;
            
            // うろうろアニメーション（狂った猫たち）
            if (cat.wobbleAnimation && !isFriend) {
                charElement.classList.add('wobbling');
                // 初期位置をCSS変数として設定
                charElement.style.setProperty('--wobble-start', `${pos.x}%`);
                // 初期位置を記録（パンニング用）
                charElement.dataset.baseX = pos.x;
            }
            
            const sprite = document.createElement('div');
            sprite.className = 'character-sprite';
            sprite.textContent = cat.emoji;
            
            const status = document.createElement('div');
            status.className = 'character-status';
            if (isFriend) {
                status.textContent = '💕';
            } else if (hasEscaped) {
                status.textContent = '🔄';  // 再挑戦マーク
            }
            
            charElement.appendChild(sprite);
            charElement.appendChild(status);
            
            // ドラッグ機能を追加
            this.setupCharacterDrag(charElement, cat, isFriend);
            
            // 仲間になっていない猫はクリック可能（逃げた猫も再挑戦可能）
            if (!isFriend) {
                charElement.addEventListener('click', (e) => {
                    // ドラッグ中でない場合のみクリックイベントを処理
                    if (!charElement.dataset.dragging) {
                        this.startDialogue(cat, hasEscaped);
                    }
                });
            }
            
            this.elements.charactersContainer.appendChild(charElement);
        });
    }
    
    setupCharacterDrag(charElement, cat, isFriend) {
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let startLeft = 0;
        let startTop = 0;
        
        charElement.addEventListener('mousedown', (e) => {
            // 仲間になった猫もドラッグ可能
            isDragging = true;
            charElement.dataset.dragging = 'true';
            charElement.style.zIndex = '1000';
            charElement.style.cursor = 'grabbing';
            
            startX = e.clientX;
            startY = e.clientY;
            startLeft = parseFloat(charElement.style.left) || 0;
            startTop = parseFloat(charElement.style.top) || 0;
            
            e.preventDefault();
            e.stopPropagation();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const containerRect = this.elements.charactersContainer.getBoundingClientRect();
            const containerWidth = containerRect.width;
            const containerHeight = containerRect.height;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            // パーセンテージに変換
            const deltaXPercent = (deltaX / containerWidth) * 100;
            const deltaYPercent = (deltaY / containerHeight) * 100;
            
            let newX = startLeft + deltaXPercent;
            let newY = startTop + deltaYPercent;
            
            // 境界チェック（画面外に出ないように）
            newX = Math.max(0, Math.min(95, newX));
            newY = Math.max(40, Math.min(85, newY));
            
            charElement.style.left = `${newX}%`;
            charElement.style.top = `${newY}%`;
            
            // うろうろアニメーションを一時的に無効化
            if (charElement.classList.contains('wobbling')) {
                charElement.classList.remove('wobbling');
                charElement.style.setProperty('--wobble-start', `${newX}%`);
                charElement.dataset.baseX = newX;
            }
        });
        
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                delete charElement.dataset.dragging;
                charElement.style.zIndex = '';
                charElement.style.cursor = 'pointer';
                
                // うろうろアニメーションを再開
                if (cat.wobbleAnimation && !isFriend) {
                    const currentX = parseFloat(charElement.style.left) || 0;
                    charElement.classList.add('wobbling');
                    charElement.style.setProperty('--wobble-start', `${currentX}%`);
                    charElement.dataset.baseX = currentX;
                }
            }
        });
    }
    
    updateFriendCount() {
        this.elements.friendCount.textContent = this.state.friends.length;
    }
    
    // ===== 対話 =====
    async startDialogue(character, isRetry = false) {
        // 3Dシーンのアニメーションを停止
        if (this.village3D) {
            this.village3D.isDialogueActive = true;
            if (this.village3D.animationId) {
                cancelAnimationFrame(this.village3D.animationId);
                this.village3D.animationId = null;
            }
        }
        
        this.state.currentCharacter = character;
        this.state.playerNotes = [];
        
        // 門番猫の場合は会話のみ（音入力なし）
        if (character.id === 'gate_keeper') {
            this.showScreen('dialogue');
            this.renderPianoKeyboard(this.elements.pianoKeyboard);
            
            this.elements.animalSprite.textContent = character.emoji;
            this.elements.animalName.textContent = character.name;
            this.elements.animalSprite.className = 'animal-sprite';
            
            const greetingText = character.dialogue.greeting;
            this.elements.dialogueText.textContent = greetingText;
            
            this.elements.animalNotes.innerHTML = '';
            this.elements.playerNotes.innerHTML = '';
            
            // ピアノキーボードを非表示
            if (this.elements.pianoKeyboard) {
                this.elements.pianoKeyboard.style.display = 'none';
            }
            
            // キャラクターの個性に応じた音声タイプを選択
            const voiceType = this.getCharacterVoiceType(character);
            await this.speakText(greetingText, voiceType);
            
            // 門番猫の場合は自動的に結果画面へ（音入力なし）
            const chapterData = CHAPTER_CHARACTERS[this.state.currentChapter];
            const totalCats = chapterData ? chapterData.cats.length : 0;
            const friendCount = this.state.friends.length;
            
            if (friendCount >= totalCats) {
                // 全ての猫となかまになっている場合は成功
                await this.delay(2000);
                this.showResult(true, character);
            } else {
                // まだ足りない場合は失敗
                await this.delay(2000);
                this.showResult(false, character);
            }
            return;
        }
        
        // 再挑戦の場合、逃げたリストから削除してフレーズを変更
        if (isRetry) {
            const index = this.state.escapedCats.indexOf(character.id);
            if (index > -1) {
                this.state.escapedCats.splice(index, 1);
            }
            // フレーズを次のものに変更（ランダム化がある章では再ランダム化）
            CharacterHelper.nextPhrase(character);
        }
        
        this.state.targetNotes = CharacterHelper.getCurrentPhrase(character);
        
        // 双子の場合（7章では3〜5匹のグループになる）
        if (character.isTwin) {
            if (character.multiCount && character.multiCount > 2) {
                // 7章：複数匹のグループ（3〜5匹）
                this.state.twinTargetNotes = CharacterHelper.getMultiTwinPhrases(character);
            } else {
                // 通常：2匹の双子
                this.state.twinTargetNotes = [CharacterHelper.getTwinPhrase(character)];
            }
        } else {
            this.state.twinTargetNotes = [];
        }
        
        this.showScreen('dialogue');
        this.renderPianoKeyboard(this.elements.pianoKeyboard);
        
        // ピアノキーボードを表示
        if (this.elements.pianoKeyboard) {
            this.elements.pianoKeyboard.style.display = 'flex';
        }
        
        this.elements.animalSprite.textContent = character.emoji;
        this.elements.animalName.textContent = character.name;
        
        // アニメーションクラスを適用
        this.elements.animalSprite.className = 'animal-sprite';
        if (character.wobbleAnimation && this.state.currentChapter === 6) {
            // 裏モードでうろうろするキャラクター
            this.elements.animalSprite.classList.add('wobbling-dialogue');
        }
        if (character.frogJump) {
            // カエル飛び
            this.elements.animalSprite.classList.add('frog-jump');
        }
        if (character.rabbitHop) {
            // ウサギ飛び
            this.elements.animalSprite.classList.add('rabbit-hop');
        }
        
        // 再挑戦の場合は別のセリフ
        const greetingText = isRetry 
            ? (character.dialogue.retry || 'ニャ...？\n（もう一度話しかけてきた...）')
            : character.dialogue.greeting;
        this.elements.dialogueText.textContent = greetingText;
        
        this.elements.animalNotes.innerHTML = '';
        this.elements.playerNotes.innerHTML = '';
        
        // キャラクターの個性に応じた音声タイプを選択
        const voiceType = this.getCharacterVoiceType(character);
        await this.speakText(greetingText, voiceType);
        await this.delay(500);
        await this.playAndShowNotes();
    }
    
    /**
     * キャラクターの個性に応じた音声タイプを取得
     */
    getCharacterVoiceType(character) {
        // 特殊なキャラクタータイプ
        if (character.isWitch) return 'witch';
        if (character.isTwin) return 'twin';
        if (character.isFast) return 'cat_energetic';
        
        // 狂った猫は特別な音声タイプ
        if (character.isCrazy) return 'cat_energetic';
        
        // 個性に応じた音声タイプ
        const personalityMap = {
            'シンプル': 'cat',
            '同じ音を繰り返す': 'cat',
            '上昇音': 'cat_energetic',
            '少女猫': 'child',
            '気まぐれ': 'cat_cool',
            'のんびり': 'cat_shy',
            'もちもち': 'cat',
            '鈴の音': 'child',
            '海が好き': 'cat_cool',
            '夜行性': 'witch',
            '双子': 'twin',
            '白黒双子': 'twin',
            'あまえんぼう': 'child',
            'ふしぎ': 'witch',
            '犬っぽい': 'cat_energetic',
            '早口': 'cat_energetic',
            '魔女猫': 'witch',
            '高速双子': 'cat_energetic',
            'ねむりねこ': 'cat_shy',
            '影猫': 'witch',
            'ジャズ好き': 'cat_cool',
            'オペラ歌手': 'cat_energetic',
            'シャープ好き': 'cat',
            '半音双子': 'twin',
            '指揮者猫': 'witch',
            '狂気': 'cat_energetic',
            '宇宙': 'witch',
            '半魚人': 'cat',
            '神秘': 'witch',
            '奇妙': 'cat_energetic',
            '輪唱・繰り返し': 'cat',
            'リズム跳ね': 'cat_energetic',
            '小さい・細かく早い': 'child',
            '輪唱・小さい': 'child',
            '熊蜂の飛行': 'cat_energetic',
            '運命': 'cat',
            'トルコ行進曲': 'cat_energetic',
            '威風堂々': 'cat',
            '大きい・低い': 'wolf',
            '大きい・高い': 'cat',
            '機械音': 'cat',
            'プログラミング': 'cat'
        };
        
        return personalityMap[character.personality] || 'cat';
    }
    
    /**
     * キャラクターの位置からパンニング値を計算（-1.0: 左端, 0: 中央, 1.0: 右端）
     */
    getCharacterPan(character) {
        let pan = 0;
        
        // 対話画面でのうろうろアニメーション中の場合
        if (this.state.currentScreen === 'dialogue' && character.wobbleAnimation && this.state.currentChapter === 6) {
            // アニメーションの進行状況に基づいてパンニングを計算
            // 現在時刻からアニメーションの位相を計算（3秒周期）
            const now = Date.now();
            const phase = (now % 3000) / 3000; // 0-1の範囲
            // サイン波で左右に動く
            pan = Math.sin(phase * Math.PI * 2) * 0.6; // -0.6から0.6の範囲
        } else {
            // 村画面でのうろうろ中
            const charElement = document.querySelector(`.character[data-id="${character.id}"]`);
            if (charElement && character.wobbleAnimation) {
                const computedStyle = window.getComputedStyle(charElement);
                const leftValue = computedStyle.left;
                
                // パーセンテージ（例："25%"）またはピクセル値（例："100px"）を処理
                let leftPercent;
                if (leftValue.includes('%')) {
                    // パーセンテージ値の場合
                    leftPercent = parseFloat(leftValue);
                } else if (leftValue.includes('px')) {
                    // ピクセル値の場合は親要素の幅で割ってパーセンテージに変換
                    const parentWidth = charElement.parentElement?.offsetWidth || window.innerWidth;
                    const leftPx = parseFloat(leftValue);
                    leftPercent = (leftPx / parentWidth) * 100;
                } else {
                    leftPercent = parseFloat(leftValue) || 50;
                }
                
                if (!isNaN(leftPercent) && leftPercent >= 0 && leftPercent <= 100) {
                    // パーセンテージ値を-1.0から1.0の範囲に変換
                    // 0% → -1.0, 50% → 0.0, 100% → 1.0
                    pan = (leftPercent / 50.0) - 1.0;
                } else {
                    // 無効な値の場合は初期位置を使用
                    const x = character.position.x || 50;
                    pan = (x / 50.0) - 1.0;
                }
            } else {
                // 通常の場合は初期位置から計算
                const x = character.position.x || 50;
                pan = (x / 50.0) - 1.0;
            }
        }
        
        // 範囲を[-1.0, 1.0]にクランプ
        return Math.max(-1.0, Math.min(1.0, pan));
    }
    
    async playAndShowNotes() {
        const character = this.state.currentCharacter;
        this.elements.animalNotes.innerHTML = '';
        this.state.isPlaying = true;
        
        if (character.isTwin) {
            // 双子猫：2つのメロディを同時に再生
            await this.playTwinNotes();
        } else if (character.isRound) {
            // 輪唱：フレーズを繰り返し再生
            await this.playRoundNotes(character);
        } else {
            // 通常：1つのメロディを再生
            // うろうろアニメーション中は各音ごとにパンニングを再計算
            const dynamicPan = character.wobbleAnimation;
            const isBouncyRhythm = character.bouncyRhythm; // リズム跳ね
            const isOctaveBounce = character.octaveBounce; // 音域跳ね（ウサギ猫など）
            
            for (let i = 0; i < this.state.targetNotes.length; i++) {
                const note = this.state.targetNotes[i];
                const bubble = this.createNoteBubble(note);
                this.elements.animalNotes.appendChild(bubble);
                
                // パンニングを適用（動的な場合は毎回計算）
                const pan = dynamicPan ? this.getCharacterPan(character) : this.getCharacterPan(character);
                
                // 音域跳ね：音の高さを変える
                let octaveShift = 0;
                if (isOctaveBounce) {
                    // 交互にオクターブを上げる
                    octaveShift = i % 2 === 1 ? 1 : 0;
                } else if (character.highPitch) {
                    // 高い音域のキャラクターは常に1オクターブ上
                    octaveShift = 1;
                } else if (character.lowPitch) {
                    // 低い音域のキャラクターは常に1オクターブ下
                    octaveShift = -1;
                }
                
                // 熊蜂の飛行：半音階的な上昇下降パターン
                if (character.bumblebeeFlight) {
                    // 上昇下降のパターンでオクターブを変える
                    const patternLength = this.state.targetNotes.length;
                    const midpoint = Math.floor(patternLength / 2);
                    if (i < midpoint) {
                        // 前半：上昇（徐々にオクターブを上げる）
                        octaveShift = Math.floor((i / midpoint) * 2);
                    } else {
                        // 後半：下降（徐々にオクターブを下げる）
                        const remaining = patternLength - midpoint;
                        const pos = i - midpoint;
                        octaveShift = Math.floor((1 - pos / remaining) * 2);
                    }
                }
                
                // リズム跳ね：音価を変える
                let noteDuration = character.tempo * 0.8;
                let noteDelay = character.tempo * 200;
                
                // リズムシャフル（裏モード2章）
                if (character.shuffledRhythm || (character.dancePartyTransformations && character.dancePartyTransformations.includes('shuffle'))) {
                    // シャッフルされたリズムパターン（不規則な音価）
                    const patterns = [
                        { duration: 0.4, delay: 100 },
                        { duration: 0.6, delay: 150 },
                        { duration: 0.3, delay: 80 },
                        { duration: 0.8, delay: 200 }
                    ];
                    const pattern = patterns[i % patterns.length];
                    noteDuration = character.tempo * pattern.duration;
                    noteDelay = character.tempo * pattern.delay;
                } else if (isBouncyRhythm) {
                    // 8分音符、8分音符、4分音符のパターン
                    if (i % 3 === 0 || i % 3 === 1) {
                        noteDuration = character.tempo * 0.4; // 8分音符
                        noteDelay = character.tempo * 100;
                    } else {
                        noteDuration = character.tempo * 0.8; // 4分音符
                        noteDelay = character.tempo * 200;
                    }
                }
                
                // 休符の処理（ロボットキャラクター）
                if (character.hasRest && character.isRobot) {
                    // ランダムに休符を挿入
                    if (Math.random() < 0.15 && i > 0) { // 15%の確率（最初の音以外）
                        await this.delay(noteDelay * 2); // 休符（音を出さずに待つ）
                        continue; // この音をスキップ
                    }
                }
                
                await audioSystem.playNote(note, noteDuration, character.type || 'cat', pan, octaveShift);
                await this.delay(noteDelay);
            }
        }
        
        this.state.isPlaying = false;
    }
    
    async playTwinNotes() {
        const character = this.state.currentCharacter;
        const notes1 = this.state.targetNotes;
        const twinNotes = this.state.twinTargetNotes; // 配列（2匹の場合は[notes2]、複数の場合は[notes2, notes3, ...]）
        const dynamicPan = character.wobbleAnimation;
        
        // 7章で複数匹の場合
        if (character.multiCount && character.multiCount > 2 && Array.isArray(twinNotes)) {
            // 全てのフレーズを合わせて最大長を計算
            const allNotes = [notes1, ...twinNotes];
            const maxLength = Math.max(...allNotes.map(notes => notes.length));
            
            // 色のパレット（複数匹用）
            const colors = ['#ff6b6b', '#6b6bff', '#6bff6b', '#ffb86b', '#b86bff'];
            
            for (let i = 0; i < maxLength; i++) {
                const chord = [];
                
                // 各フレーズから音を取得して和音に追加
                allNotes.forEach((notes, index) => {
                    if (i < notes.length) {
                        chord.push(notes[i]);
                        const bubble = this.createNoteBubble(notes[i]);
                        bubble.style.border = `3px solid ${colors[index % colors.length]}`;
                        this.elements.animalNotes.appendChild(bubble);
                    }
                });
                
                // パンニングを適用（動的な場合は毎回計算）
                const pan = dynamicPan ? this.getCharacterPan(character) : this.getCharacterPan(character);
                if (chord.length > 0) {
                    await audioSystem.playChord(chord, character.tempo * 0.8, 'cat', pan);
                    await this.delay(character.tempo * 200);
                }
            }
        } else {
            // 通常の2匹の双子
            const notes2 = twinNotes[0] || [];
            const maxLength = Math.max(notes1.length, notes2.length);
            
            for (let i = 0; i < maxLength; i++) {
                const chord = [];
                
                if (i < notes1.length) {
                    chord.push(notes1[i]);
                    const bubble1 = this.createNoteBubble(notes1[i]);
                    bubble1.style.border = '3px solid #ff6b6b';
                    this.elements.animalNotes.appendChild(bubble1);
                }
                
                if (i < notes2.length) {
                    chord.push(notes2[i]);
                    const bubble2 = this.createNoteBubble(notes2[i]);
                    bubble2.style.border = '3px solid #6b6bff';
                    this.elements.animalNotes.appendChild(bubble2);
                }
                
                // パンニングを適用（動的な場合は毎回計算）
                const pan = dynamicPan ? this.getCharacterPan(character) : this.getCharacterPan(character);
                await audioSystem.playChord(chord, character.tempo * 0.8, 'cat', pan);
                await this.delay(character.tempo * 200);
            }
        }
    }
    
    /**
     * 輪唱：フレーズを繰り返し再生
     */
    async playRoundNotes(character) {
        let phrase = this.state.targetNotes;
        const repeatCount = 2;  // 2回繰り返す
        const highPitch = character.highPitch || false;
        
        // 裏モード2章：輪唱の逆方向
        const isReverse = character.roundReverse || false;
        
        for (let round = 0; round < repeatCount; round++) {
            // 逆方向の場合はフレーズを逆順にする
            const notesToPlay = isReverse && round === 1 
                ? [...phrase].reverse() 
                : phrase;
            
            for (let i = 0; i < notesToPlay.length; i++) {
                const note = notesToPlay[i];
                const bubble = this.createNoteBubble(note);
                // 繰り返し回数によって色を変える
                if (round > 0) {
                    bubble.style.opacity = '0.7';
                    bubble.style.border = '2px dashed #888';
                }
                this.elements.animalNotes.appendChild(bubble);
                
                const pan = this.getCharacterPan(character);
                // 高い音域の場合はオクターブを上げる、低い音域の場合は下げる
                let octaveShift = 0;
                if (highPitch) {
                    octaveShift = 1;
                } else if (character.lowPitch) {
                    octaveShift = -1;
                }
                
                // 休符の処理（ロボットキャラクター）
                if (character.hasRest && character.isRobot && Math.random() < 0.1 && i > 0) {
                    await this.delay(character.tempo * 200 * 2);
                    continue;
                }
                
                await audioSystem.playNote(note, character.tempo * 0.8, character.type || 'cat', pan, octaveShift);
                await this.delay(character.tempo * 200);
            }
        }
    }
    
    createNoteBubble(note) {
        const bubble = document.createElement('div');
        const colorClass = this.getNoteColorClass(note);
        bubble.className = `note-bubble ${colorClass}`;
        
        const noteNames = {
            'do': 'ド', 're': 'レ', 'mi': 'ミ', 'fa': 'ファ',
            'so': 'ソ', 'la': 'ラ', 'ti': 'シ',
            'do#': 'ド#', 're#': 'レ#', 'fa#': 'ファ#',
            'so#': 'ソ#', 'la#': 'シ♭'
        };
        
        if (this.shouldShowNoteName(note)) {
            bubble.textContent = noteNames[note] || note;
        } else {
            bubble.classList.add('hidden-name');
            bubble.textContent = '';
        }
        
        return bubble;
    }
    
    async onPianoKeyPress(note) {
        if (this.state.isPlaying) return;
        // 入力上限を30に増やす（長いフレーズに対応）
        if (this.state.playerNotes.length >= 30) return;
        
        await audioSystem.playNote(note, 0.3, 'player', 0, 0);
        
        this.state.playerNotes.push(note);
        
        const bubble = this.createNoteBubble(note);
        this.elements.playerNotes.appendChild(bubble);
        
        // キーのハイライト
        const key = document.querySelector(`#piano-keyboard .piano-key[data-note="${note}"]`);
        if (key) {
            key.classList.add('active');
            setTimeout(() => key.classList.remove('active'), 200);
        }
    }
    
    async replayCurrentPhrase() {
        if (this.state.isPlaying) return;
        await this.playAndShowNotes();
    }
    
    clearPlayerNotes() {
        this.state.playerNotes = [];
        this.elements.playerNotes.innerHTML = '';
    }
    
    async submitAnswer() {
        if (this.state.isPlaying) return;
        if (this.state.playerNotes.length === 0) return;
        
        const character = this.state.currentCharacter;
        let isCorrect;
        
        if (character.isTwin) {
            // 双子の場合：交互に入力された音をチェック
            if (character.multiCount && character.multiCount > 2 && Array.isArray(this.state.twinTargetNotes)) {
                // 7章：複数匹のグループ（3〜5匹）
                isCorrect = CharacterHelper.compareMultiTwinNotes(
                    this.state.playerNotes,
                    this.state.targetNotes,
                    this.state.twinTargetNotes
                );
            } else {
                // 通常：2匹の双子
                isCorrect = CharacterHelper.compareTwinNotes(
                    this.state.playerNotes,
                    this.state.targetNotes,
                    this.state.twinTargetNotes[0] || []
                );
            }
        } else if (character.isRound) {
            // 輪唱の場合：繰り返しパターンで比較
            // 裏モード2章：逆方向の輪唱の場合も考慮
            let targetPhrase = this.state.targetNotes;
            if (character.roundReverse) {
                // 順方向と逆方向の両方をチェック
                const forward = [...targetPhrase, ...targetPhrase];
                const reverse = [...targetPhrase, ...[...targetPhrase].reverse()];
                isCorrect = CharacterHelper.compareNotes(this.state.playerNotes, forward) || 
                           CharacterHelper.compareNotes(this.state.playerNotes, reverse);
            } else {
                isCorrect = CharacterHelper.compareRoundNotes(
                    this.state.playerNotes,
                    targetPhrase
                );
            }
        } else {
            // 通常の比較
            // ロボットキャラクターの場合は休符を考慮
            if (character.hasRest && character.isRobot) {
                isCorrect = CharacterHelper.compareNotesWithRests(
                    this.state.playerNotes,
                    this.state.targetNotes
                );
            } else {
                isCorrect = CharacterHelper.compareNotes(
                    this.state.playerNotes,
                    this.state.targetNotes
                );
            }
        }
        
        this.state.isPlaying = true;
        
        // プレイヤーの音を再生
        for (const note of this.state.playerNotes) {
            await audioSystem.playNote(note, 0.3, 'player', 0, 0);
            await this.delay(100);
        }
        
        await this.delay(500);
        
        if (isCorrect) {
            await audioSystem.playSuccessSound();
            this.state.friends.push(character.id);
            
            // 音を覚える
            if (character.teachesNote) {
                this.learnNote(character.teachesNote);
            }
            
            // すべての音を覚える（その猫のフレーズから）
            this.state.targetNotes.forEach(note => this.learnNote(note));
            if (character.isTwin) {
                if (Array.isArray(this.state.twinTargetNotes) && this.state.twinTargetNotes.length > 0) {
                    // 複数のフレーズがある場合
                    this.state.twinTargetNotes.forEach(notes => {
                        if (Array.isArray(notes)) {
                            notes.forEach(note => this.learnNote(note));
                        } else {
                            this.learnNote(notes);
                        }
                    });
                }
            }
            
            this.showResult(true, character);
        } else {
            await audioSystem.playFailSound();
            this.state.escapedCats.push(character.id);
            this.showResult(false, character);
        }
        
        this.state.isPlaying = false;
    }
    
    async showResult(success, character) {
        this.showScreen('result');
        
        this.elements.resultAnimal.textContent = character.emoji;
        const voiceType = this.getCharacterVoiceType(character);
        
        if (success) {
            this.elements.resultTitle.textContent = 'なかまになった！';
            this.elements.resultTitle.className = 'success';
            this.elements.resultMessage.textContent = character.dialogue.success;
            
            // 覚えた音を表示
            if (character.teachesNote) {
                this.elements.learnedNoteDisplay.innerHTML = `
                    <span>覚えた音：</span>
                    ${this.createNoteBubble(character.teachesNote).outerHTML}
                `;
                this.elements.learnedNoteDisplay.classList.add('show');
            } else {
                this.elements.learnedNoteDisplay.classList.remove('show');
            }
            
            // 成功時は嬉しい声（感情分析でさらに調整される）
            await this.speakText(character.dialogue.success, voiceType);
        } else {
            // 門番猫の場合は「にげられた」ではなく別のメッセージ
            if (character.id === 'gate_keeper') {
                this.elements.resultTitle.textContent = '通してもらえないようだ';
            } else {
                this.elements.resultTitle.textContent = 'にげられた...';
            }
            this.elements.resultTitle.className = 'failure';
            this.elements.resultMessage.textContent = character.dialogue.failure;
            this.elements.learnedNoteDisplay.classList.remove('show');
            
            // 失敗時は悲しい声
            await this.speakText(character.dialogue.failure, voiceType);
        }
    }
    
    continueFromResult() {
        const chapterData = CHAPTER_CHARACTERS[this.state.currentChapter];
        
        // 門番猫との会話で全ての猫となかまになっている場合は森へ
        if (this.state.currentCharacter && this.state.currentCharacter.id === 'gate_keeper') {
            if (this.state.friends.length >= chapterData.cats.length) {
                // 森へ進む
                this.enterForest();
                return;
            }
        }
        
        // 会話に失敗した場合の処理
        const lastCharacter = this.state.currentCharacter;
        const wasFailure = lastCharacter && (
            this.state.escapedCats.includes(lastCharacter.id) || 
            (lastCharacter.id === 'gate_keeper' && this.state.friends.length < chapterData.cats.length)
        );
        
        this.showScreen('village');
        
        // 3D村を更新
        if (this.village3D) {
            // 会話フラグをリセット
            this.village3D.isDialogueActive = false;
            
            // 失敗した場合は、プレイヤーと猫を離す
            if (wasFailure && lastCharacter && this.village3D.player) {
                // 失敗した猫のIDを記録
                this.village3D.lastFailedCatId = lastCharacter.id;
                this.village3D.lastFailedTime = Date.now();
                
                // プレイヤーを少し後ろに移動（猫から離す）
                const playerPos = this.village3D.player.position.clone();
                const backward = new THREE.Vector3(0, 0, 2);  // 後ろに2ユニット
                playerPos.add(backward);
                
                // 境界チェック
                const boundary = 20;
                playerPos.x = Math.max(-boundary, Math.min(boundary, playerPos.x));
                playerPos.z = Math.max(-boundary, Math.min(boundary, playerPos.z));
                
                this.village3D.player.position.copy(playerPos);
                this.village3D.playerLastPosition.copy(playerPos);
                
                // クールダウンを延長（失敗した場合は5秒）
                this.village3D.lastInteractionTime = Date.now();
                this.village3D.interactionCooldown = 5000;
            }
            
            this.village3D.createCats(chapterData.cats, this.state.friends, this.state.escapedCats);
            
            // 失敗した猫を少し離れた場所に移動（門番猫の場合は位置変更不要）
            if (wasFailure && lastCharacter && lastCharacter.id !== 'gate_keeper' && this.village3D.cats) {
                const failedCat = this.village3D.cats.find(cat => cat.data.id === lastCharacter.id);
                if (failedCat && failedCat.mesh) {
                    // 猫を少し離れた場所に移動（ランダムな方向に）
                    const angle = Math.random() * Math.PI * 2;
                    const distance = 4;  // 4ユニット離す
                    const offset = new THREE.Vector3(
                        Math.cos(angle) * distance,
                        0,
                        Math.sin(angle) * distance
                    );
                    const newPos = this.village3D.player.position.clone().add(offset);
                    
                    // 境界チェック
                    const boundary = 20;
                    newPos.x = Math.max(-boundary, Math.min(boundary, newPos.x));
                    newPos.z = Math.max(-boundary, Math.min(boundary, newPos.z));
                    
                    failedCat.mesh.position.copy(newPos);
                    failedCat.position.copy(newPos);
                }
            }
            
            // アニメーションを再開
            if (!this.village3D.animationId) {
                this.village3D.animate();
            }
        }
        
        this.updateFriendCount();
        this.updateLearnedNotesDisplay();
        
        if (this.state.friends.length === chapterData.cats.length) {
            this.elements.villageMessage.innerHTML = 
                '全ての猫となかまになった！門番猫のところへ行ってみよう...<br><small>PC: WASD/矢印キーで移動<br>スマホ: 画面をタッチして移動</small>';
        } else {
            const remaining = chapterData.cats.length - this.state.friends.length;
            const escaped = this.state.escapedCats.length;
            
            if (escaped > 0) {
                this.elements.villageMessage.innerHTML = 
                    `あと ${remaining} 匹！🔄マークの猫に再挑戦できるよ！<br><small>PC: WASD/矢印キーで移動<br>スマホ: 画面をタッチして移動</small>`;
            } else {
                this.elements.villageMessage.innerHTML = 
                    `あと ${remaining} 匹の猫がいるよ！<br><small>PC: WASD/矢印キーで移動<br>スマホ: 画面をタッチして移動</small>`;
            }
        }
    }
    
    // ===== 森・狼 =====
    async enterForest() {
        const chapterData = CHAPTER_CHARACTERS[this.state.currentChapter];
        
        if (this.state.friends.length < chapterData.cats.length) {
            this.elements.villageMessage.textContent = 
                '全ての猫となかまにならないと、森には入れないみたい...';
            return;
        }
        
        // 3D村を停止
        if (this.village3D) {
            this.village3D.pauseAnimation();
        }
        
        // 森の道シーンを開始
        this.showScreen('forestPath');
        if (!this.forestPath3D) {
            this.forestPath3D = new ForestPath3D(this.elements.forestPathCanvas, this);
        }
        this.forestPath3D.init();
    }
    
    async startWolfBattle() {
        const chapterData = CHAPTER_CHARACTERS[this.state.currentChapter];
        const wolf = chapterData.wolf;
        const phase = CharacterHelper.getWolfPhase(wolf);
        
        this.showScreen('wolf');
        this.renderPianoKeyboard(this.elements.wolfPianoKeyboard, true);
        
        this.elements.wolfSprite.textContent = wolf.emoji;
        // 遊びモードの場合はplayfulクラスを使用
        const emotionClass = phase.emotion === 'playful' ? 'playful' : phase.emotion;
        this.elements.wolfSprite.className = `wolf-sprite ${emotionClass}`;
        this.elements.wolfDialogueText.textContent = phase.dialogue.intro;
        this.elements.wolfPhase.textContent = `フェーズ ${wolf.currentPhase + 1}/${wolf.phases.length}`;
        
        this.elements.wolfNotes.innerHTML = '';
        this.elements.wolfPlayerNotes.innerHTML = '';
        this.state.playerNotes = [];
        this.state.targetNotes = CharacterHelper.getWolfPhrase(wolf);
        
        // 狼の感情に応じた音声タイプを選択
        const wolfVoiceType = `wolf_${phase.emotion}`;
        await this.speakText(phase.dialogue.intro, wolfVoiceType);
        
        await this.delay(1000);
        if (phase.emotion === 'angry') {
            await audioSystem.playWolfHowl();
        } else if (phase.emotion === 'playful' && this.state.currentChapter === 6) {
            // 裏モードの遊びモードでは軽快な遠吠え
            await audioSystem.playWolfHowl();
        }
        
        await this.delay(1000);
        this.elements.wolfDialogueText.textContent = phase.dialogue.challenge;
        await this.speakText(phase.dialogue.challenge, wolfVoiceType);
        
        await this.delay(500);
        await this.playWolfNotes();
    }
    
    async playWolfNotes() {
        const chapterData = CHAPTER_CHARACTERS[this.state.currentChapter];
        const wolf = chapterData.wolf;
        const phase = CharacterHelper.getWolfPhase(wolf);
        
        this.elements.wolfNotes.innerHTML = '';
        this.state.isPlaying = true;
        
        // ダンスアニメーション（裏モードの場合）
        if (phase.dance && this.state.currentChapter === 6) {
            this.elements.wolfSprite.classList.add('wolf-dancing');
        }
        
        // オクターブシフトと跳ねるリズムに対応
        const octaveShift = phase.octaveShift || 0;
        const isBouncy = phase.bouncyRhythm || false;
        
        for (let i = 0; i < this.state.targetNotes.length; i++) {
            const note = this.state.targetNotes[i];
            const bubble = this.createNoteBubble(note);
            
            // オクターブが上がる場合は表示を変更
            if (octaveShift > 0 && i >= this.state.targetNotes.length / 2) {
                bubble.classList.add('high-note');
            }
            
            this.elements.wolfNotes.appendChild(bubble);
            
            // オクターブシフトを適用して再生
            const currentOctaveShift = octaveShift > 0 && i >= this.state.targetNotes.length / 2 ? octaveShift : 0;
            await audioSystem.playNote(note, phase.tempo * 0.8, 'wolf', 0, currentOctaveShift);
            
            // 跳ねるリズムの場合は遅延を変える
            const delay = isBouncy && i % 2 === 1 
                ? phase.tempo * 150  // 短く
                : phase.tempo * 250; // 長く
            await this.delay(delay);
        }
        
        // ダンスアニメーションを解除
        if (phase.dance) {
            this.elements.wolfSprite.classList.remove('wolf-dancing');
        }
        
        this.state.isPlaying = false;
    }
    
    async onWolfPianoKeyPress(note) {
        if (this.state.isPlaying) return;
        // 入力上限を30に増やす（長いフレーズに対応）
        if (this.state.playerNotes.length >= 30) return;
        
        await audioSystem.playNote(note, 0.3, 'player', 0, 0);
        
        this.state.playerNotes.push(note);
        
        const bubble = this.createNoteBubble(note);
        this.elements.wolfPlayerNotes.appendChild(bubble);
        
        const key = document.querySelector(`#wolf-piano-keyboard .piano-key[data-note="${note}"]`);
        if (key) {
            key.classList.add('active');
            setTimeout(() => key.classList.remove('active'), 200);
        }
    }
    
    async replayWolfPhrase() {
        if (this.state.isPlaying) return;
        await this.playWolfNotes();
    }
    
    clearWolfPlayerNotes() {
        this.state.playerNotes = [];
        this.elements.wolfPlayerNotes.innerHTML = '';
    }
    
    async submitWolfAnswer() {
        if (this.state.isPlaying) return;
        if (this.state.playerNotes.length === 0) return;
        
        const chapterData = CHAPTER_CHARACTERS[this.state.currentChapter];
        const wolf = chapterData.wolf;
        const phase = CharacterHelper.getWolfPhase(wolf);
        
        const isCorrect = CharacterHelper.compareNotes(
            this.state.playerNotes,
            this.state.targetNotes
        );
        
        this.state.isPlaying = true;
        
        for (const note of this.state.playerNotes) {
            await audioSystem.playNote(note, 0.3, 'player', 0, 0);
            await this.delay(100);
        }
        
        await this.delay(500);
        
        // 狼の感情に応じた音声タイプ
        const wolfVoiceType = phase.emotion === 'playful' ? 'wolf_happy' : `wolf_${phase.emotion}`;
        
        if (isCorrect) {
            await audioSystem.playSuccessSound();
            this.elements.wolfDialogueText.textContent = phase.dialogue.success;
            await this.speakText(phase.dialogue.success, 'wolf_happy');  // 成功時は嬉しい声
            
            wolf.currentPhase++;
            wolf.retryCount = 0;
            
            await this.delay(1500);
            
            if (wolf.currentPhase >= wolf.phases.length) {
                this.wolfVictory();
            } else {
                this.state.playerNotes = [];
                this.elements.wolfPlayerNotes.innerHTML = '';
                this.startWolfBattle();
            }
        } else {
            await audioSystem.playFailSound();
            wolf.retryCount++;
            
            this.elements.wolfDialogueText.textContent = phase.dialogue.failure;
            // 遊びモードの場合はplayfulを維持
            if (phase.emotion !== 'playful') {
                this.elements.wolfSprite.className = `wolf-sprite angry`;
            }
            await this.speakText(phase.dialogue.failure, 'wolf_angry');  // 失敗時は怒った声
            
            await this.delay(1500);
            
            this.state.playerNotes = [];
            this.elements.wolfPlayerNotes.innerHTML = '';
            const emotionClass = phase.emotion === 'playful' ? 'playful' : phase.emotion;
            this.elements.wolfSprite.className = `wolf-sprite ${emotionClass}`;
            this.elements.wolfDialogueText.textContent = phase.dialogue.challenge;
            
            await this.delay(500);
            await this.playWolfNotes();
        }
        
        this.state.isPlaying = false;
    }
    
    async wolfVictory() {
        this.state.wolfDefeated = true;
        
        // 章をクリアとして記録
        if (!this.state.completedChapters.includes(this.state.currentChapter)) {
            this.state.completedChapters.push(this.state.currentChapter);
            this.saveProgress();
        }
        
        this.elements.wolfSprite.className = 'wolf-sprite happy';
        this.elements.wolfDialogueText.textContent = 
            'ワオーーーン！！！\n（とても嬉しそうだ！村に平和が戻る！）';
        
        await this.speakText('ワオーーーン！とても嬉しそうだ！村に平和が戻る！', 'wolf');
        await audioSystem.playWolfHowl();
        await this.delay(2000);
        
        this.showEnding();
    }
    
    // ===== エンディング =====
    async showEnding() {
        this.showScreen('ending');
        
        const chapter = CHAPTERS[this.state.currentChapter];
        const chapterData = CHAPTER_CHARACTERS[this.state.currentChapter];
        
        this.elements.endingChapter.textContent = `${chapter.title} クリア！`;
        
        this.elements.endingAnimals.innerHTML = '';
        
        for (const catId of this.state.friends) {
            const cat = chapterData.cats.find(c => c.id === catId);
            if (cat) {
                const animalEl = document.createElement('div');
                animalEl.className = 'ending-animal';
                animalEl.textContent = cat.emoji;
                this.elements.endingAnimals.appendChild(animalEl);
            }
        }
        
        const wolfEl = document.createElement('div');
        wolfEl.className = 'ending-animal';
        wolfEl.textContent = chapterData.wolf.emoji;
        this.elements.endingAnimals.appendChild(wolfEl);
        
        // 章ごとのエンディングテキストを表示
        const endingText = STORY.ending[this.state.currentChapter] || STORY.ending[1];
        this.elements.endingText.innerHTML = endingText.replace(/\n/g, '<br>');
        
        // 次の章があるかチェック
        const nextChapterBtn = document.getElementById('next-chapter-btn');
        if (this.state.currentChapter < 5) {
            nextChapterBtn.style.display = 'inline-block';
        } else if (this.state.currentChapter === 5) {
            // 5章クリア後は裏モードが解放される
            nextChapterBtn.style.display = 'none';
        } else {
            // 6章（裏モード）クリア後
            nextChapterBtn.style.display = 'none';
        }
        
        await this.delay(2000);
        await audioSystem.playFanfare();
        await this.speakText('おめでとうございます！章をクリアしました！');
        
        this.renderChapterList();
    }
    
    async startNextChapter() {
        if (this.state.currentChapter < 5) {
            await this.startChapter(this.state.currentChapter + 1);
        }
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

/**
 * 3D村システム
 */
class Village3D {
    constructor(canvas, gameInstance) {
        this.canvas = canvas;
        this.game = gameInstance;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.player = null;
        this.cats = [];
        this.keys = {};
        this.touchControls = {
            isActive: false,
            startX: 0,
            startY: 0,
            lastX: 0,
            lastY: 0,
            moveTouch: null  // 移動用のタッチ
        };
        this.cameraOffset = new THREE.Vector3(-3, 8, 5);  // カメラのオフセット（後ろ、上、右）
        // マウスコントロールは削除（不要）
        this.playerSpeed = 0.1;
        this.interactionDistance = 2.5;
        this.animationId = null;
        this.isDialogueActive = false;  // 会話中フラグ
        this.lastInteractionTime = 0;  // 最後の会話開始時刻
        this.interactionCooldown = 2000;  // 会話開始のクールダウン（ミリ秒）
        this.followDistance = 2.5;  // 猫が追従する距離
        this.followSpeed = 0.15;  // 猫の追従速度（速くする）
        this.playerLastPosition = new THREE.Vector3(0, 0, 0);  // プレイヤーの前フレームの位置
        this.lastFailedCatId = null;  // 最後に失敗した猫のID
        this.lastFailedTime = 0;  // 最後に失敗した時間
    }
    
    init(catsData, friends, escapedCats) {
        if (!this.canvas) {
            throw new Error('キャンバス要素が設定されていません');
        }
        
        if (typeof THREE === 'undefined') {
            throw new Error('Three.jsが読み込まれていません');
        }
        
        try {
            // 既存のシーンをクリーンアップ
            if (this.scene) {
                // 既存のオブジェクトを削除
                while(this.scene.children.length > 0) {
                    this.scene.remove(this.scene.children[0]);
                }
            }
            
            // 既存のレンダラーを破棄
            if (this.renderer) {
                try {
                    this.renderer.dispose();
                } catch (e) {
                    console.warn('レンダラーの破棄中にエラー:', e);
                }
                this.renderer = null;
            }
            
            // Three.jsシーンを初期化
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0x87ceeb); // 空色
            
            // カメラ設定（少し俯瞰でプレイヤーを追いかける）
            const aspect = window.innerWidth / window.innerHeight;
            this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
            // カメラの初期位置（プレイヤーの後ろ、上、少し右）
            this.cameraOffset = new THREE.Vector3(-3, 8, 5);
            this.updateCamera();
            
            // レンダラー設定
            this.renderer = new THREE.WebGLRenderer({ 
                canvas: this.canvas,
                antialias: true 
            });
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.shadowMap.enabled = true;
            
            // ライト設定
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
            this.scene.add(ambientLight);
            
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(10, 20, 10);
            directionalLight.castShadow = true;
            directionalLight.shadow.mapSize.width = 2048;
            directionalLight.shadow.mapSize.height = 2048;
            this.scene.add(directionalLight);
            
            // 地面を作成
            this.createGround();
            
            // 環境を作成（木、建物など）
            this.createEnvironment();
            
            // プレイヤーを作成
            this.createPlayer();
            
            // プレイヤーの初期位置を記録
            if (this.player) {
                this.playerLastPosition.copy(this.player.position);
            }
            
            // 猫を配置
            this.createCats(catsData, friends, escapedCats);
            
            // 門番猫を配置
            this.createGateKeeperCat();
            
            // イベントリスナーを設定
            this.setupControls();
            
            // リサイズハンドラーを保存
            this.resizeHandler = () => this.onWindowResize();
            window.addEventListener('resize', this.resizeHandler);
            
            // アニメーションループを開始
            this.animate();
        } catch (error) {
            console.error('Village3D初期化エラー:', error);
            throw error;
        }
    }
    
    createGround() {
        // 地面
        const groundGeometry = new THREE.PlaneGeometry(50, 50);
        const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x5fa55f });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
        
        // 草のテクスチャ（簡易版）
        const grassGeometry = new THREE.PlaneGeometry(50, 50, 20, 20);
        const grassMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x4a8c4a,
            wireframe: false
        });
        const grass = new THREE.Mesh(grassGeometry, grassMaterial);
        grass.rotation.x = -Math.PI / 2;
        grass.position.y = 0.01;
        this.scene.add(grass);
        
        // 村の道を追加
        this.createRoads();
    }
    
    createRoads() {
        // 石畳風の道（十字路）
        const stoneMaterial = new THREE.MeshLambertMaterial({ color: 0x8b7355 });  // 茶色がかった石色
        
        // 縦の道（石畳風）
        const roadVerticalGeometry = new THREE.PlaneGeometry(3, 50, 1, 20);
        const roadVertical = new THREE.Mesh(roadVerticalGeometry, stoneMaterial);
        roadVertical.rotation.x = -Math.PI / 2;
        roadVertical.position.y = 0.02;
        roadVertical.position.x = 0;  // 中央
        this.scene.add(roadVertical);
        
        // 横の道（石畳風）
        const roadHorizontalGeometry = new THREE.PlaneGeometry(50, 3, 20, 1);
        const roadHorizontal = new THREE.Mesh(roadHorizontalGeometry, stoneMaterial);
        roadHorizontal.rotation.x = -Math.PI / 2;
        roadHorizontal.position.y = 0.02;
        roadHorizontal.position.z = 0;  // 中央
        this.scene.add(roadHorizontal);
        
        // 道に草をまばらに生やす
        this.addGrassOnRoad();
    }
    
    addGrassOnRoad() {
        const grassMaterial = new THREE.MeshLambertMaterial({ color: 0x5fa55f });
        const grassGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.2, 4);
        
        // 道の外側に草をまばらに配置（道の上には生やさない）
        let grassCount = 0;
        let attempts = 0;
        while (grassCount < 20 && attempts < 200) {
            attempts++;
            const x = (Math.random() - 0.5) * 40;
            const z = (Math.random() - 0.5) * 40;
            
            // 道の上でないことを確認（縦の道: |x| < 1.5、横の道: |z| < 1.5）
            if (Math.abs(x) > 2 || Math.abs(z) > 2) {
                if (Math.random() > 0.7) {  // 30%の確率で草を生やす
                    const grass = new THREE.Mesh(grassGeometry, grassMaterial);
                    grass.rotation.x = Math.random() * 0.3;
                    grass.rotation.z = Math.random() * 0.3;
                    grass.position.set(x, 0.1, z);
                    this.scene.add(grass);
                    grassCount++;
                }
            }
        }
    }
    
    createEnvironment() {
        // 水辺を作成（建物の前に配置）
        this.createWater();
        
        // 建物を配置
        this.createBuildings();
        
        // 木を配置（建物よりもさらに外側に、道を避ける）
        let treeCount = 0;
        let attempts = 0;
        while (treeCount < 12 && attempts < 200) {
            attempts++;
            const angle = Math.random() * Math.PI * 2;
            const radius = 15 + Math.random() * 8;  // 15から23の範囲（建物は最大12程度なので外側）
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            
            // 道の上でないことを確認（縦の道: |x| < 1.5、横の道: |z| < 1.5）
            // 水辺の上でないことを確認
            if (Math.abs(x) > 2 && Math.abs(z) > 2 && !this.isOnWater(x, z)) {
                const tree = this.createTree();
                tree.position.x = x;
                tree.position.z = z;
                this.scene.add(tree);
                treeCount++;
            }
        }
        
        // 空に雲を追加（簡易版）
        const cloudGeometry = new THREE.SphereGeometry(2, 8, 8);
        const cloudMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
        for (let i = 0; i < 3; i++) {
            const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
            cloud.position.set(
                (Math.random() - 0.5) * 30,
                8 + Math.random() * 2,
                (Math.random() - 0.5) * 30
            );
            cloud.scale.set(1.5 + Math.random(), 1, 1.5 + Math.random());
            this.scene.add(cloud);
        }
    }
    
    createWater() {
        // 池を作成（村の一角に）
        const waterGroup = new THREE.Group();
        
        // 池の底（地面より少し下に配置して重なりを避ける）
        const waterGeometry = new THREE.PlaneGeometry(8, 6, 8, 6);
        const waterMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x4a90c2,
            transparent: true,
            opacity: 0.8
        });
        const water = new THREE.Mesh(waterGeometry, waterMaterial);
        water.rotation.x = -Math.PI / 2;
        water.position.y = -0.05;  // 地面より少し下に
        water.position.x = 15;  // 村の右側
        water.position.z = 15;  // 村の下側
        waterGroup.add(water);
        
        // 池の縁（石）
        const edgeMaterial = new THREE.MeshLambertMaterial({ color: 0x8b7355 });
        const edgeGeometry = new THREE.TorusGeometry(4.5, 0.3, 8, 16);
        const edge = new THREE.Mesh(edgeGeometry, edgeMaterial);
        edge.rotation.x = -Math.PI / 2;
        edge.position.y = 0.05;
        edge.position.x = 15;
        edge.position.z = 15;
        waterGroup.add(edge);
        
        // 池の縁（内側）
        const innerEdgeGeometry = new THREE.TorusGeometry(3.5, 0.2, 8, 16);
        const innerEdge = new THREE.Mesh(innerEdgeGeometry, edgeMaterial);
        innerEdge.rotation.x = -Math.PI / 2;
        innerEdge.position.y = 0.05;
        innerEdge.position.x = 15;
        innerEdge.position.z = 15;
        waterGroup.add(innerEdge);
        
        // 小川を作成（村の端を流れる、道を避ける位置に）
        const streamGeometry = new THREE.PlaneGeometry(25, 2.5, 25, 2);
        const streamMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x4a90c2,
            transparent: true,
            opacity: 0.7
        });
        const stream = new THREE.Mesh(streamGeometry, streamMaterial);
        stream.rotation.x = -Math.PI / 2;
        stream.position.y = -0.05;  // 地面より少し下に
        stream.position.x = -20;  // 村の左端（さらに外側）
        stream.position.z = -5;    // 道を避ける（下側）
        stream.rotation.z = Math.PI / 8;  // 少し傾ける
        waterGroup.add(stream);
        
        // 小川の縁（草）
        const grassMaterial = new THREE.MeshLambertMaterial({ color: 0x5fa55f });
        const grassGeometry = new THREE.PlaneGeometry(20, 0.5, 20, 1);
        const grassLeft = new THREE.Mesh(grassGeometry, grassMaterial);
        grassLeft.rotation.x = -Math.PI / 2;
        grassLeft.position.y = 0.02;
        grassLeft.position.x = -18;
        grassLeft.position.z = -0.8;
        grassLeft.rotation.z = Math.PI / 6;
        waterGroup.add(grassLeft);
        
        const grassRight = new THREE.Mesh(grassGeometry, grassMaterial);
        grassRight.rotation.x = -Math.PI / 2;
        grassRight.position.y = 0.02;
        grassRight.position.x = -18;
        grassRight.position.z = 0.8;
        grassRight.rotation.z = Math.PI / 6;
        waterGroup.add(grassRight);
        
        this.scene.add(waterGroup);
        this.waterAreas = [
            { x: 15, z: 15, radius: 4.5 },  // 池（少し大きめに）
            { x: -20, z: -5, width: 25, height: 2.5, rotation: Math.PI / 8 }  // 小川（更新された位置）
        ];
    }
    
    isOnWater(x, z) {
        // 水辺の上かどうかをチェック
        if (!this.waterAreas) return false;
        
        for (const water of this.waterAreas) {
            if (water.radius) {
                // 円形の池
                const dx = x - water.x;
                const dz = z - water.z;
                const distance = Math.sqrt(dx * dx + dz * dz);
                if (distance < water.radius) return true;
            } else {
                // 長方形の小川
                const dx = x - water.x;
                const dz = z - water.z;
                const cos = Math.cos(-water.rotation);
                const sin = Math.sin(-water.rotation);
                const rotatedX = dx * cos - dz * sin;
                const rotatedZ = dx * sin + dz * cos;
                if (Math.abs(rotatedX) < water.width / 2 && Math.abs(rotatedZ) < water.height / 2) {
                    return true;
                }
            }
        }
        return false;
    }
    
    createBuildings() {
        // 中央広場を作成
        this.createPlaza();
        
        // 建物の配置位置（周辺に配置、道を避ける）
        // 各建物は道から離れた位置に配置し、道に向くようにする
        // roadDirは家のドアが向く方向（広場への方向）
        const buildingPositions = [
            { x: -10, z: -10, width: 2.5, depth: 2.5, height: 2.5, doorDir: 'se' },  // 左上（南東方向の広場へ）
            { x: 10, z: -10, width: 2.5, depth: 2.5, height: 2.5, doorDir: 'sw' },   // 右上（南西方向の広場へ）
            { x: -10, z: 10, width: 2.5, depth: 2.5, height: 2.5, doorDir: 'ne' },   // 左下（北東方向の広場へ）
            { x: 10, z: 10, width: 2.5, depth: 2.5, height: 2.5, doorDir: 'nw' },    // 右下（北西方向の広場へ）
            { x: -12, z: -3, width: 2, depth: 3, height: 2.5, doorDir: 'e' }, // 左（東方向の広場へ）
            { x: -12, z: 3, width: 2, depth: 3, height: 2.5, doorDir: 'e' }, // 左（東方向の広場へ）
            { x: 12, z: -3, width: 2, depth: 3, height: 2.5, doorDir: 'w' },  // 右（西方向の広場へ）
            { x: 12, z: 3, width: 2, depth: 3, height: 2.5, doorDir: 'w' },  // 右（西方向の道へ）
            { x: -3, z: -12, width: 3, depth: 2, height: 2.5, doorDir: 's' }, // 上（南方向の広場へ）
            { x: 3, z: -12, width: 3, depth: 2, height: 2.5, doorDir: 's' }, // 上（南方向の広場へ）
            { x: -3, z: 12, width: 3, depth: 2, height: 2.5, doorDir: 'n' },   // 下（北方向の広場へ）
            { x: 3, z: 12, width: 3, depth: 2, height: 2.5, doorDir: 'n' }   // 下（北方向の広場へ）
        ];
        
        // 水辺の上に建物が配置されないようにフィルタリング
        const validBuildingPositions = buildingPositions.filter(pos => {
            return !this.isOnWater(pos.x, pos.z);
        });
        
        // 家を配置
        validBuildingPositions.forEach((pos, index) => {
            const building = this.createBuilding(pos.width, pos.depth, pos.height, index, pos.doorDir, pos.x, pos.z);
            building.position.set(pos.x, pos.height / 2, pos.z);
            this.scene.add(building);
        });
        
        // 道のネットワークを作成（家から広場、家から家へ）
        this.createRoadNetwork(validBuildingPositions);
        
        // 村の出口に門を追加
        this.createVillageGate();
    }
    
    createRoadNetwork(buildingPositions) {
        const pathMaterial = new THREE.MeshLambertMaterial({ color: 0x8b7355 });
        const pathWidth = 1.5;
        
        // 各家から広場への道を作成（水辺を避ける）
        buildingPositions.forEach(pos => {
            const buildingX = pos.x;
            const buildingZ = pos.z;
            
            // 広場の端（±3）までの道を作成
            let pathStartX = buildingX;
            let pathStartZ = buildingZ;
            let pathEndX = 0;
            let pathEndZ = 0;
            let isHorizontal = false;
            
            // 家の位置に応じて広場への方向を決定
            if (Math.abs(buildingX) > Math.abs(buildingZ)) {
                // 横方向の道
                isHorizontal = true;
                pathEndX = buildingX > 0 ? 3 : -3;
                pathEndZ = buildingZ;
                pathStartX = buildingX > 0 ? 3 : -3;
            } else {
                // 縦方向の道
                isHorizontal = false;
                pathEndX = buildingX;
                pathEndZ = buildingZ > 0 ? 3 : -3;
                pathStartZ = buildingZ > 0 ? 3 : -3;
            }
            
            // 家から広場の端までの距離
            const pathLength = Math.sqrt(
                Math.pow(buildingX - pathStartX, 2) + 
                Math.pow(buildingZ - pathStartZ, 2)
            );
            
            // 道が水辺の上でないことを確認
            const pathMidX = (buildingX + pathStartX) / 2;
            const pathMidZ = (buildingZ + pathStartZ) / 2;
            if (pathLength > 1 && !this.isOnWater(pathMidX, pathMidZ)) {
                const pathGeometry = new THREE.PlaneGeometry(
                    isHorizontal ? pathLength : pathWidth,
                    isHorizontal ? pathWidth : pathLength,
                    1,
                    Math.floor(pathLength)
                );
                const path = new THREE.Mesh(pathGeometry, pathMaterial);
                path.rotation.x = -Math.PI / 2;
                if (!isHorizontal) {
                    path.rotation.z = Math.PI / 2;
                }
                path.position.y = 0.02;
                path.position.x = pathMidX;
                path.position.z = pathMidZ;
                this.scene.add(path);
            }
        });
    }
    
    createPlaza() {
        // 中央広場を作成（道の交差点を広場にする）
        const plazaMaterial = new THREE.MeshLambertMaterial({ color: 0x9d8468 });  // 少し明るい石色
        const plazaGeometry = new THREE.PlaneGeometry(6, 6, 1, 1);
        const plaza = new THREE.Mesh(plazaGeometry, plazaMaterial);
        plaza.rotation.x = -Math.PI / 2;
        plaza.position.y = 0.015;
        plaza.position.x = 0;
        plaza.position.z = 0;
        this.scene.add(plaza);
        
        // 広場の周りに石を配置（装飾）
        const stoneMaterial = new THREE.MeshLambertMaterial({ color: 0x8b7355 });
        const stoneGeometry = new THREE.CylinderGeometry(0.2, 0.25, 0.3, 8);
        
        // 広場の四隅に石を配置
        const stonePositions = [
            { x: -2.5, z: -2.5 },
            { x: 2.5, z: -2.5 },
            { x: -2.5, z: 2.5 },
            { x: 2.5, z: 2.5 }
        ];
        
        stonePositions.forEach(pos => {
            const stone = new THREE.Mesh(stoneGeometry, stoneMaterial);
            stone.position.set(pos.x, 0.15, pos.z);
            stone.castShadow = true;
            this.scene.add(stone);
        });
    }
    
    
    createBuilding(width, depth, height, index, roadDir, buildingX, buildingZ) {
        const building = new THREE.Group();
        
        // 木でできた建物（木の色）
        const woodColors = [
            0x8b6f47,  // オーク
            0x9d7a5a,  // ウォルナット
            0xa0826d,  // ブラウン
            0x8b7355,  // ダークブラウン
            0x9d8468,  // オークダーク
            0x7a5f47,  // チェスナット
            0x8b6f47,  // オーク
            0x9d7a5a   // ウォルナット
        ];
        
        const wallMaterial = new THREE.MeshLambertMaterial({ 
            color: woodColors[index % woodColors.length] 
        });
        
        // 建物の本体（木の板風）
        const bodyGeometry = new THREE.BoxGeometry(width, height, depth);
        const body = new THREE.Mesh(bodyGeometry, wallMaterial);
        body.castShadow = true;
        body.receiveShadow = true;
        building.add(body);
        
        // 木の板の縞模様（横方向の線）
        const stripeMaterial = new THREE.MeshLambertMaterial({ color: 0x6b4f37 });
        for (let i = 0; i < 3; i++) {
            const stripeGeometry = new THREE.PlaneGeometry(width * 0.95, 0.05);
            const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
            stripe.rotation.x = -Math.PI / 2;
            stripe.position.set(0, -height / 2 + (i + 1) * (height / 4), depth / 2 + 0.01);
            building.add(stripe);
        }
        
        // ファンタジーな三角屋根（鮮やかな色）
        const roofColors = [
            0xff4444,  // 赤
            0x4444ff,  // 青
            0x44ff44,  // 緑
            0xff44ff,  // マゼンタ（紫）
            0xffff44,  // 黄色
            0xff8844,  // オレンジ
            0x44ffff,  // シアン
            0xff88ff,  // ピンク
            0x8844ff,  // 紫
            0xffaa44,  // オレンジイエロー
            0x44ff88,  // ミントグリーン
            0xff4488   // ローズ
        ];
        
        const roofMaterial = new THREE.MeshLambertMaterial({ 
            color: roofColors[index % roofColors.length] 
        });
        
        // 三角屋根（三角錐の形状）
        const roofHeight = height * 0.4;
        const roofGeometry = new THREE.ConeGeometry(
            Math.max(width, depth) * 0.75,  // 底面の半径
            roofHeight,  // 高さ
            4  // セグメント数（四角錐）
        );
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = height / 2 + roofHeight / 2;
        roof.rotation.y = Math.PI / 4;  // 45度回転して角を合わせる
        roof.castShadow = true;
        building.add(roof);
        
        // 窓を追加（かわいい丸窓風）
        const windowMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x87ceeb,
            emissive: 0x333333,
            emissiveIntensity: 0.2
        });
        
        // 前面に丸窓
        const windowGeometry = new THREE.CircleGeometry(width * 0.2, 16);
        const window1 = new THREE.Mesh(windowGeometry, windowMaterial);
        window1.rotation.x = -Math.PI / 2;
        window1.position.set(0, height * 0.2, depth / 2 + 0.01);
        building.add(window1);
        
        // ドア（かわいい小さなドア）
        const doorMaterial = new THREE.MeshLambertMaterial({ color: 0x654321 });
        const doorGeometry = new THREE.PlaneGeometry(width * 0.35, height * 0.6);
        const door = new THREE.Mesh(doorGeometry, doorMaterial);
        door.position.set(0, -height * 0.2, depth / 2 + 0.01);
        building.add(door);
        
        // ドアノブ
        const knobGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const knobMaterial = new THREE.MeshLambertMaterial({ color: 0xffd700 });
        const knob = new THREE.Mesh(knobGeometry, knobMaterial);
        knob.position.set(width * 0.15, -height * 0.2, depth / 2 + 0.02);
        building.add(knob);
        
        // 家の向きを広場（中央）に向ける（ドアが広場に向くように）
        // 家の位置から広場(0,0)への方向を計算
        if (buildingX !== undefined && buildingZ !== undefined) {
            // 広場への方向ベクトル
            const dx = 0 - buildingX;
            const dz = 0 - buildingZ;
            
            // 角度を計算（atan2で-πからπの範囲）
            // Three.jsでは、デフォルトで前面は-Z方向なので、+π/2を加算
            const angle = Math.atan2(dx, dz);
            building.rotation.y = angle;
        } else if (roadDir) {
            // フォールバック：roadDirから計算
            let rotationY = 0;
            if (roadDir === 'e' || roadDir === 'ne' || roadDir === 'se') {
                rotationY = -Math.PI / 2;
            } else if (roadDir === 'w' || roadDir === 'nw' || roadDir === 'sw') {
                rotationY = Math.PI / 2;
            } else if (roadDir === 's' || roadDir === 'se' || roadDir === 'sw') {
                rotationY = 0;
            } else if (roadDir === 'n' || roadDir === 'ne' || roadDir === 'nw') {
                rotationY = Math.PI;
            }
            building.rotation.y = rotationY;
        }
        
        return building;
    }
    
    createVillageGate() {
        // 村の出口（森への入り口）に門を配置
        const gateGroup = new THREE.Group();
        
        // 門の柱（左右）
        const pillarMaterial = new THREE.MeshLambertMaterial({ color: 0x8b6f47 });
        const pillarGeometry = new THREE.CylinderGeometry(0.3, 0.4, 3, 8);
        
        const leftPillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
        leftPillar.position.set(-2, 1.5, -18);
        leftPillar.castShadow = true;
        gateGroup.add(leftPillar);
        
        const rightPillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
        rightPillar.position.set(2, 1.5, -18);
        rightPillar.castShadow = true;
        gateGroup.add(rightPillar);
        
        // 門の横木
        const beamGeometry = new THREE.BoxGeometry(4.5, 0.3, 0.3);
        const beam = new THREE.Mesh(beamGeometry, pillarMaterial);
        beam.position.set(0, 2.8, -18);
        beam.castShadow = true;
        gateGroup.add(beam);
        
        // 門の看板
        const signGeometry = new THREE.PlaneGeometry(2, 0.8);
        const signMaterial = new THREE.MeshLambertMaterial({ color: 0xd4a574 });
        const sign = new THREE.Mesh(signGeometry, signMaterial);
        sign.rotation.x = -Math.PI / 2;
        sign.position.set(0, 2.2, -18);
        gateGroup.add(sign);
        
        this.scene.add(gateGroup);
        this.villageGate = gateGroup;
        
        // 門番猫の位置を記録（後で使用）
        this.gatePosition = new THREE.Vector3(0, 0.5, -18);
    }
    
    createGateKeeperCat() {
        // 門番猫を作成
        const gateKeeperGroup = new THREE.Group();
        
        // 猫の体
        const bodyGeometry = new THREE.SphereGeometry(0.6, 16, 16);
        const bodyMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xffd700  // 金色（特別な猫）
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.castShadow = true;
        gateKeeperGroup.add(body);
        
        // 門番猫の位置
        gateKeeperGroup.position.set(0, 0.6, -18);
        
        // エモジラベル
        this.createCatLabel(gateKeeperGroup, '🛡️', '門番猫');
        
        this.scene.add(gateKeeperGroup);
        this.gateKeeperCat = gateKeeperGroup;
        this.gateKeeperPosition = new THREE.Vector3(0, 0.6, -18);
    }
    
    createTree() {
        const tree = new THREE.Group();
        
        // 幹
        const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.4, 3, 8);
        const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x5a3d2d });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 1.5;
        trunk.castShadow = true;
        tree.add(trunk);
        
        // 葉
        const leavesGeometry = new THREE.ConeGeometry(2, 3, 8);
        const leavesMaterial = new THREE.MeshLambertMaterial({ color: 0x2d5a2d });
        const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
        leaves.position.y = 3.5;
        leaves.castShadow = true;
        tree.add(leaves);
        
        return tree;
    }
    
    createPlayer() {
        // プレイヤーをシンプルなキューブで表現
        const geometry = new THREE.BoxGeometry(0.8, 1.6, 0.8);
        const material = new THREE.MeshLambertMaterial({ color: 0x4a90c2 });
        this.player = new THREE.Mesh(geometry, material);
        this.player.position.set(0, 0.8, 0);
        this.player.castShadow = true;
        this.scene.add(this.player);
        
        // プレイヤーの上にマーカーを追加
        const markerGeometry = new THREE.ConeGeometry(0.3, 0.5, 4);
        const markerMaterial = new THREE.MeshLambertMaterial({ color: 0xffd700 });
        const marker = new THREE.Mesh(markerGeometry, markerMaterial);
        marker.position.y = 1.2;
        this.player.add(marker);
    }
    
    createCats(catsData, friends, escapedCats) {
        // 既存の猫を削除
        this.cats.forEach(catObj => {
            if (catObj.mesh && this.scene) {
                this.scene.remove(catObj.mesh);
            }
        });
        this.cats = [];
        
        catsData.forEach((cat, index) => {
            const isFriend = friends.includes(cat.id);
            const hasEscaped = escapedCats.includes(cat.id);
            
            // 猫の3Dモデル（シンプルな球体 + テキスト）
            const catGroup = new THREE.Group();
            
            // 猫の体
            const bodyGeometry = new THREE.SphereGeometry(0.5, 16, 16);
            const bodyMaterial = new THREE.MeshLambertMaterial({ 
                color: isFriend ? 0xffd700 : (hasEscaped ? 0x888888 : 0xffa500)
            });
            const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
            body.castShadow = true;
            catGroup.add(body);
            
            // 猫の位置を3D座標に変換（元の2D位置を3Dにマッピング）
            // プレイヤーの初期位置(0,0)から離すように調整
            const x = (cat.position.x / 100) * 20 - 10; // -10 から 10 の範囲
            const z = (cat.position.y / 100) * 20 - 10;
            
            // プレイヤーの初期位置(0, 0)から最低3ユニット離す
            const playerPos = new THREE.Vector3(0, 0, 0);
            let catPos = new THREE.Vector3(x, 0, z);
            const distance = playerPos.distanceTo(catPos);
            if (distance < 3) {
                // プレイヤーから離す方向に調整
                const direction = catPos.clone().sub(playerPos).normalize();
                catPos = playerPos.clone().add(direction.multiplyScalar(3));
            }
            
            // 猫の位置を設定
            catGroup.position.set(catPos.x, 0.5, catPos.z);
            
            // 猫のデータを保存（調整後の位置を使用）
            const catObj = {
                mesh: catGroup,
                data: cat,
                isFriend: isFriend,
                hasEscaped: hasEscaped,
                position: new THREE.Vector3(catPos.x, 0.5, catPos.z)
            };
            
            this.cats.push(catObj);
            this.scene.add(catGroup);
            
            // エモジを表示するためのスプライト（簡易版：テキストを使用）
            this.createCatLabel(catGroup, cat.emoji, cat.name);
        });
    }
    
    createCatLabel(catGroup, emoji, name) {
        // キャンバスでテキストを描画
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 128;
        
        context.fillStyle = 'rgba(255, 255, 255, 0.8)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.font = '48px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillStyle = '#000000';
        context.fillText(emoji, canvas.width / 2, canvas.height / 2);
        
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(2, 1, 1);
        sprite.position.y = 1.5;
        catGroup.add(sprite);
    }
    
    setupControls() {
        // キーボード入力
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            this.keys[e.code] = true;
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
            this.keys[e.code] = false;
        });
        
        // タッチ操作（移動のみ）
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (e.touches.length === 1) {
                // 単一タッチ：移動用
                this.touchControls.moveTouch = {
                    id: e.touches[0].identifier,
                    startX: e.touches[0].clientX,
                    startY: e.touches[0].clientY,
                    lastX: e.touches[0].clientX,
                    lastY: e.touches[0].clientY
                };
            }
        });
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            
            // 移動用タッチを処理
            if (this.touchControls.moveTouch) {
                const touch = Array.from(e.touches).find(t => t.identifier === this.touchControls.moveTouch.id);
                if (touch) {
                    const deltaX = touch.clientX - this.touchControls.moveTouch.lastX;
                    const deltaY = touch.clientY - this.touchControls.moveTouch.lastY;
                    
                    // 移動方向を計算（画面の下半分をタッチした場合のみ移動）
                    const canvasRect = this.canvas.getBoundingClientRect();
                    const touchY = touch.clientY - canvasRect.top;
                    const canvasHeight = canvasRect.height;
                    
                    // タッチの方向に応じて移動（画面全体で移動可能）
                    const moveVector = new THREE.Vector3();
                    
                    // カメラの方向ではなく、固定方向で移動（上=前、下=後、左=左、右=右）
                    const forward = -deltaY * 0.01;
                    const right = deltaX * 0.01;
                    
                    // ワールド座標系での前後左右
                    moveVector.z = forward;  // 前後（Z軸）
                    moveVector.x = right;    // 左右（X軸）
                    
                    if (this.player) {
                        this.player.position.add(moveVector);
                        const boundary = 20;
                        this.player.position.x = Math.max(-boundary, Math.min(boundary, this.player.position.x));
                        this.player.position.z = Math.max(-boundary, Math.min(boundary, this.player.position.z));
                        
                        // カメラを更新
                        this.updateCamera();
                    }
                    
                    this.touchControls.moveTouch.lastX = touch.clientX;
                    this.touchControls.moveTouch.lastY = touch.clientY;
                }
            }
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            // 終了したタッチを削除
            const endedIds = Array.from(e.changedTouches).map(t => t.identifier);
            if (this.touchControls.moveTouch && endedIds.includes(this.touchControls.moveTouch.id)) {
                this.touchControls.moveTouch = null;
            }
        });
    }
    
    updateCamera() {
        if (!this.player || !this.camera) return;
        
        // カメラをプレイヤーの位置からオフセット分だけ離した位置に配置
        const cameraPosition = this.player.position.clone().add(this.cameraOffset);
        this.camera.position.copy(cameraPosition);
        
        // カメラは常にプレイヤーを見る
        this.camera.lookAt(this.player.position);
    }
    
    updateFollowingCats() {
        if (!this.player) return;
        
        // 仲間になった猫を取得（順番を保持）
        const followingCats = this.cats.filter(catObj => catObj.isFriend);
        
        if (followingCats.length === 0) return;
        
        // プレイヤーの位置を基準に、後ろに列を作る
        const playerPos = this.player.position.clone();
        playerPos.y = 0.5;  // 地面の高さ
        
        // プレイヤーの移動方向を計算（前フレームとの差分から）
        const lastPos = this.playerLastPosition.clone();
        lastPos.y = 0.5;
        const moveDirection = playerPos.clone().sub(lastPos);
        let followDirection = new THREE.Vector3(0, 0, -1);  // デフォルトは後ろ方向
        
        if (moveDirection.length() > 0.01) {
            // 移動している場合は、移動方向の逆方向（後ろ）を計算
            followDirection = moveDirection.clone().normalize().multiplyScalar(-1);
        }
        
        // 各猫が前の位置を追従
        followingCats.forEach((catObj, index) => {
            if (!catObj.mesh) return;
            
            let targetPosition;
            
            if (index === 0) {
                // 最初の猫はプレイヤーの後ろ
                targetPosition = playerPos.clone().add(followDirection.multiplyScalar(this.followDistance));
            } else {
                // 2匹目以降は前の猫の後ろ
                const prevCat = followingCats[index - 1];
                if (prevCat && prevCat.mesh) {
                    const prevPos = prevCat.mesh.position.clone();
                    prevPos.y = 0.5;
                    
                    // 前の猫からプレイヤーへの方向を計算
                    const direction = playerPos.clone().sub(prevPos).normalize();
                    if (direction.length() < 0.1) {
                        // 方向が不明確な場合は後ろ方向
                        direction.set(0, 0, -1);
                    }
                    
                    targetPosition = prevPos.clone().add(direction.multiplyScalar(-this.followDistance));
                } else {
                    // 前の猫がいない場合はプレイヤーの後ろ
                    targetPosition = playerPos.clone().add(new THREE.Vector3(0, 0, -this.followDistance * (index + 1)));
                }
            }
            
            // 現在の位置から目標位置へスムーズに移動
            const currentPos = catObj.mesh.position.clone();
            currentPos.y = 0.5;  // 高さを固定
            
            const direction = targetPosition.clone().sub(currentPos);
            const distance = direction.length();
            
            // 常に目標位置に向かって移動（距離が0.05より大きい場合）
            if (distance > 0.05) {
                // 目標位置に近づく
                direction.normalize();
                // 距離に応じて速度を調整（遠いほど速く）
                const speedMultiplier = Math.min(3.0, distance / this.followDistance);
                const moveAmount = Math.min(distance, this.followSpeed * (1 + speedMultiplier * 0.5));
                const newPos = currentPos.clone().add(direction.multiplyScalar(moveAmount));
                
                catObj.mesh.position.x = newPos.x;
                catObj.mesh.position.z = newPos.z;
                
                // 猫の位置データも更新
                catObj.position.copy(newPos);
                
                // 猫が移動方向を向く
                if (direction.length() > 0.01) {
                    const lookAtPos = newPos.clone().add(direction);
                    catObj.mesh.lookAt(lookAtPos);
                }
            } else {
                // 目標位置に到達したら位置を更新
                catObj.mesh.position.x = targetPosition.x;
                catObj.mesh.position.z = targetPosition.z;
                catObj.position.copy(targetPosition);
            }
        });
    }
    
    updatePlayerMovement() {
        if (!this.player) return;
        
        const moveVector = new THREE.Vector3();
        
        // キーボード入力に応じて移動（固定方向：WASD/矢印キー）
        if (this.keys['w'] || this.keys['ArrowUp']) {
            moveVector.z -= this.playerSpeed;  // 前（Z軸負方向）
        }
        if (this.keys['s'] || this.keys['ArrowDown']) {
            moveVector.z += this.playerSpeed;  // 後（Z軸正方向）
        }
        if (this.keys['a'] || this.keys['ArrowLeft']) {
            moveVector.x -= this.playerSpeed;  // 左（X軸負方向）
        }
        if (this.keys['d'] || this.keys['ArrowRight']) {
            moveVector.x += this.playerSpeed;  // 右（X軸正方向）
        }
        
        // 移動を適用
        if (moveVector.length() > 0) {
            // プレイヤーの位置を更新前に記録（猫の追従計算用）
            this.playerLastPosition.copy(this.player.position);
            this.player.position.add(moveVector);
        }
        
        // 境界チェック
        const boundary = 20;
        this.player.position.x = Math.max(-boundary, Math.min(boundary, this.player.position.x));
        this.player.position.z = Math.max(-boundary, Math.min(boundary, this.player.position.z));
        
        // カメラを更新（プレイヤーが移動したら追従）
        this.updateCamera();
    }
    
    checkCatInteraction() {
        if (!this.player) return;
        
        // 会話中またはクールダウン中はスキップ
        if (this.isDialogueActive) return;
        const now = Date.now();
        if (now - this.lastInteractionTime < this.interactionCooldown) return;
        
        // 現在の画面が村画面でない場合はスキップ
        if (this.game.state.currentScreen !== 'village') {
            this.isDialogueActive = false;
            return;
        }
        
        // 門番猫との距離をチェック
        if (this.gateKeeperPosition) {
            const gateDistance = this.player.position.distanceTo(this.gateKeeperPosition);
            if (gateDistance < this.interactionDistance) {
                // 門番猫が失敗した場合は、一定時間は会話を開始しない
                if (this.lastFailedCatId === 'gate_keeper') {
                    const timeSinceFailure = now - this.lastFailedTime;
                    if (timeSinceFailure < 5000) {  // 失敗後5秒間は会話を開始しない
                        return;
                    }
                }
                this.checkGateKeeperInteraction();
                return;  // 門番猫との会話を優先
            }
        }
        
        this.cats.forEach(catObj => {
            if (catObj.isFriend) return; // 既に仲間になった猫はスキップ
            
            // 失敗した猫に対しては、一定時間は会話を開始しない
            if (this.lastFailedCatId === catObj.data.id) {
                const timeSinceFailure = now - this.lastFailedTime;
                if (timeSinceFailure < 5000) {  // 失敗後5秒間は会話を開始しない
                    return;
                }
            }
            
            const distance = this.player.position.distanceTo(catObj.position);
            
            if (distance < this.interactionDistance) {
                // 会話フラグを設定して重複を防ぐ
                this.isDialogueActive = true;
                this.lastInteractionTime = now;
                
                // アニメーションを一時停止
                if (this.animationId) {
                    cancelAnimationFrame(this.animationId);
                    this.animationId = null;
                }
                
                // 猫に近づいたら会話を開始
                const hasEscaped = catObj.hasEscaped;
                this.game.startDialogue(catObj.data, hasEscaped);
            }
        });
    }
    
    checkGateKeeperInteraction() {
        const chapterData = CHAPTER_CHARACTERS[this.game.state.currentChapter];
        const totalCats = chapterData ? chapterData.cats.length : 0;
        const friendCount = this.game.state.friends.length;
        
        // 門番猫の会話を開始
        this.isDialogueActive = true;
        this.lastInteractionTime = Date.now();
        
        // アニメーションを一時停止
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        // 門番猫のキャラクターデータを作成
        const gateKeeper = {
            id: 'gate_keeper',
            name: '門番猫',
            type: 'cat',
            emoji: '🛡️',
            personality: '門番',
            description: '村の出口を守る門番猫',
            position: { x: 50, y: 50 },
            phrases: [['do', 're', 'mi']],
            currentPhrase: 0,
            tempo: 0.5,
            difficulty: 1,
            dialogue: {
                greeting: friendCount >= totalCats 
                    ? 'ニャー！\n（全ての猫となかまになったね！\n森の奥へ行くことを許可するよ！）'
                    : `ニャー...\n（あと ${totalCats - friendCount} 匹の猫となかまにならないと、\n森の奥へは行けないよ...）`,
                success: 'ニャー！\n（森の奥へ行くことを許可するよ！）',
                failure: 'ニャー...\n（まだ通すわけにはいかない...）'
            }
        };
        
        // 会話を開始（全ての猫となかまになっているかどうかでメッセージが変わる）
        this.game.startDialogue(gateKeeper, false);
    }
    
    animate() {
        // 会話中または村画面でない場合はアニメーションを停止
        if (this.isDialogueActive || this.game.state.currentScreen !== 'village') {
            this.animationId = null;
            return;
        }
        
        this.animationId = requestAnimationFrame(() => this.animate());
        
        this.updatePlayerMovement();
        this.checkCatInteraction();
        
        // カメラを常に更新（スムーズな追従のため）
        this.updateCamera();
        
        // 仲間になった猫をプレイヤーの後ろにつかせる
        this.updateFollowingCats();
        
        // プレイヤーの位置を記録（次のフレームで使用）
        if (this.player) {
            this.playerLastPosition.copy(this.player.position);
        }
        
        // 門番猫のアニメーション
        if (this.gateKeeperCat) {
            this.gateKeeperCat.position.y = 0.6 + Math.sin(Date.now() * 0.001) * 0.15;
            this.gateKeeperCat.rotation.y += 0.005;
        }
        
        // 猫のアニメーション（上下に浮遊）
        this.cats.forEach(catObj => {
            if (catObj.mesh) {
                // 仲間になった猫は追従中なので浮遊アニメーションは控えめに
                if (catObj.isFriend) {
                    catObj.mesh.position.y = 0.5 + Math.sin(Date.now() * 0.001 + catObj.data.id.length) * 0.1;
                } else {
                    catObj.mesh.position.y = 0.5 + Math.sin(Date.now() * 0.001 + catObj.data.id.length) * 0.2;
                }
                catObj.mesh.rotation.y += 0.01;
            }
        });
        
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    pauseAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    resumeAnimation() {
        if (!this.animationId && this.game.state.currentScreen === 'village') {
            this.animate();
        }
    }
    
    destroy() {
        try {
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
                this.animationId = null;
            }
            
            // イベントリスナーを削除
            if (this.resizeHandler) {
                window.removeEventListener('resize', this.resizeHandler);
                this.resizeHandler = null;
            }
            
            // シーンのオブジェクトを削除
            if (this.scene) {
                const disposeObject = (obj) => {
                    if (obj.geometry) obj.geometry.dispose();
                    if (obj.material) {
                        if (Array.isArray(obj.material)) {
                            obj.material.forEach(mat => {
                                if (mat.map) mat.map.dispose();
                                mat.dispose();
                            });
                        } else {
                            if (obj.material.map) obj.material.map.dispose();
                            obj.material.dispose();
                        }
                    }
                };
                
                while(this.scene.children.length > 0) {
                    const child = this.scene.children[0];
                    disposeObject(child);
                    // 子要素も再帰的に処理
                    if (child.children) {
                        child.children.forEach(disposeObject);
                    }
                    this.scene.remove(child);
                }
            }
            
            // レンダラーを破棄
            if (this.renderer) {
                this.renderer.dispose();
                this.renderer = null;
            }
            
            this.scene = null;
            this.camera = null;
            this.player = null;
            this.cats = [];
        } catch (error) {
            console.error('Village3D破棄エラー:', error);
        }
    }
}

/**
 * 森の道3Dシーン
 */
class ForestPath3D {
    constructor(canvas, game) {
        this.canvas = canvas;
        this.game = game;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.player = null;
        this.wolf = null;
        this.trees = [];
        this.animationId = null;
        this.playerSpeed = 0.15;
        this.pathLength = 50;  // 道の長さ
        this.playerPosition = 0;  // プレイヤーの位置（道の始まりから）
    }
    
    init() {
        if (!this.canvas) {
            throw new Error('キャンバス要素が設定されていません');
        }
        
        if (typeof THREE === 'undefined') {
            throw new Error('Three.jsが読み込まれていません');
        }
        
        try {
            // Three.jsシーンを初期化
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0x1a3d1a); // 暗い緑色（森の雰囲気）
            
            // カメラ設定
            const aspect = window.innerWidth / window.innerHeight;
            this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
            this.camera.position.set(0, 5, 10);
            this.camera.lookAt(0, 0, 0);
            
            // レンダラー設定
            this.renderer = new THREE.WebGLRenderer({ 
                canvas: this.canvas,
                antialias: true 
            });
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.shadowMap.enabled = true;
            
            // ライト設定（暗めの森の雰囲気）
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
            this.scene.add(ambientLight);
            
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
            directionalLight.position.set(5, 10, 5);
            directionalLight.castShadow = true;
            this.scene.add(directionalLight);
            
            // 地面を作成
            this.createGround();
            
            // 道を作成
            this.createPath();
            
            // 木々を配置
            this.createTrees();
            
            // プレイヤーを作成
            this.createPlayer();
            
            // ガルムを作成
            this.createWolf();
            
            // アニメーションループを開始
            this.animate();
        } catch (error) {
            console.error('ForestPath3D初期化エラー:', error);
            throw error;
        }
    }
    
    createGround() {
        // 地面（草）
        const groundGeometry = new THREE.PlaneGeometry(30, this.pathLength, 10, 50);
        const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x2d5a2d });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.z = -this.pathLength / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
    }
    
    createPath() {
        // 一本道
        const pathMaterial = new THREE.MeshLambertMaterial({ color: 0x5a4a3a });
        const pathGeometry = new THREE.PlaneGeometry(3, this.pathLength, 1, 50);
        const path = new THREE.Mesh(pathGeometry, pathMaterial);
        path.rotation.x = -Math.PI / 2;
        path.position.y = 0.02;
        path.position.z = -this.pathLength / 2;
        this.scene.add(path);
    }
    
    createTrees() {
        // 左右に木々を配置
        const treeCount = 40;
        
        for (let i = 0; i < treeCount; i++) {
            // 左側の木
            const leftTree = this.createTree();
            const leftX = -5 - Math.random() * 8;
            const leftZ = -this.pathLength / 2 + (i / treeCount) * this.pathLength + Math.random() * 2;
            leftTree.position.set(leftX, 0, leftZ);
            this.scene.add(leftTree);
            this.trees.push(leftTree);
            
            // 右側の木
            const rightTree = this.createTree();
            const rightX = 5 + Math.random() * 8;
            const rightZ = -this.pathLength / 2 + (i / treeCount) * this.pathLength + Math.random() * 2;
            rightTree.position.set(rightX, 0, rightZ);
            this.scene.add(rightTree);
            this.trees.push(rightTree);
        }
    }
    
    createTree() {
        const tree = new THREE.Group();
        
        // 幹
        const trunkGeometry = new THREE.CylinderGeometry(0.4, 0.5, 4, 8);
        const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x4a3d2d });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 2;
        trunk.castShadow = true;
        tree.add(trunk);
        
        // 葉（複数段でより森らしく）
        const leavesGeometry = new THREE.ConeGeometry(2.5, 4, 8);
        const leavesMaterial = new THREE.MeshLambertMaterial({ color: 0x1a4a1a });
        const leaves1 = new THREE.Mesh(leavesGeometry, leavesMaterial);
        leaves1.position.y = 5;
        leaves1.castShadow = true;
        tree.add(leaves1);
        
        const leaves2 = new THREE.Mesh(leavesGeometry, leavesMaterial);
        leaves2.position.y = 6.5;
        leaves2.scale.set(0.8, 0.8, 0.8);
        leaves2.castShadow = true;
        tree.add(leaves2);
        
        return tree;
    }
    
    createPlayer() {
        // プレイヤー（道の始まりに配置）
        const geometry = new THREE.BoxGeometry(0.8, 1.6, 0.8);
        const material = new THREE.MeshLambertMaterial({ color: 0x4a90c2 });
        this.player = new THREE.Mesh(geometry, material);
        this.player.position.set(0, 0.8, -this.pathLength / 2);
        this.player.castShadow = true;
        this.scene.add(this.player);
        
        // マーカー
        const markerGeometry = new THREE.ConeGeometry(0.3, 0.5, 4);
        const markerMaterial = new THREE.MeshLambertMaterial({ color: 0xffd700 });
        const marker = new THREE.Mesh(markerGeometry, markerMaterial);
        marker.position.y = 1.2;
        this.player.add(marker);
    }
    
    createWolf() {
        // ガルム（道の終わりに配置）
        const wolfGroup = new THREE.Group();
        
        // 体
        const bodyGeometry = new THREE.SphereGeometry(1.2, 16, 16);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x8b7355 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.castShadow = true;
        wolfGroup.add(body);
        
        // 頭
        const headGeometry = new THREE.SphereGeometry(0.8, 16, 16);
        const head = new THREE.Mesh(headGeometry, bodyMaterial);
        head.position.set(0, 1, 0.8);
        head.castShadow = true;
        wolfGroup.add(head);
        
        // 目（光る）
        const eyeMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xff0000,
            emissive: 0xff0000,
            emissiveIntensity: 0.5
        });
        const eyeGeometry = new THREE.SphereGeometry(0.15, 8, 8);
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.3, 1.1, 1.4);
        wolfGroup.add(leftEye);
        
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.3, 1.1, 1.4);
        wolfGroup.add(rightEye);
        
        // 位置設定（道の終わり）
        wolfGroup.position.set(0, 1, this.pathLength / 2 - 5);
        this.scene.add(wolfGroup);
        this.wolf = wolfGroup;
    }
    
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        // プレイヤーを自動的に前進させる
        if (this.player && this.playerPosition < this.pathLength - 5) {
            this.playerPosition += this.playerSpeed;
            this.player.position.z = -this.pathLength / 2 + this.playerPosition;
            
            // カメラをプレイヤーに追従
            this.camera.position.z = this.player.position.z + 10;
            this.camera.lookAt(this.player.position);
            
            // ガルムに近づいたら対話シーンへ
            const distanceToWolf = this.pathLength / 2 - 5 - this.playerPosition;
            if (distanceToWolf < 2) {
                this.pauseAnimation();
                setTimeout(() => {
                    this.game.startWolfBattle();
                }, 1000);
            }
        }
        
        // ガルムのアニメーション（少し動かす）
        if (this.wolf) {
            this.wolf.rotation.y += 0.01;
            this.wolf.position.y = 1 + Math.sin(Date.now() * 0.001) * 0.1;
        }
        
        // 木々を少し揺らす
        this.trees.forEach((tree, index) => {
            tree.rotation.y = Math.sin(Date.now() * 0.0005 + index) * 0.05;
        });
        
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }
    
    pauseAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    destroy() {
        this.pauseAnimation();
        
        if (this.scene) {
            while(this.scene.children.length > 0) {
                this.scene.remove(this.scene.children[0]);
            }
        }
        
        if (this.renderer) {
            this.renderer.dispose();
            this.renderer = null;
        }
        
        this.scene = null;
        this.camera = null;
    }
}

// ゲーム開始
document.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
});
