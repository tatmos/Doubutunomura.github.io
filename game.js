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
            wolf: document.getElementById('wolf-screen'),
            ending: document.getElementById('ending-screen')
        };
        
        this.elements = {
            storyText: document.getElementById('story-text'),
            villageMessage: document.getElementById('village-message'),
            friendCount: document.getElementById('friend-count'),
            totalCats: document.getElementById('total-cats'),
            charactersContainer: document.getElementById('characters-container'),
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
            speechToggle: document.getElementById('speech-toggle')
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
        
        // 森の入り口
        document.querySelector('.forest-entrance').addEventListener('click', () => {
            this.enterForest();
        });
        
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
        
        for (let i = 1; i <= 5; i++) {
            const chapter = CHAPTERS[i];
            const isUnlocked = i === 1 || this.state.completedChapters.includes(i - 1);
            const isCompleted = this.state.completedChapters.includes(i);
            
            const item = document.createElement('div');
            item.className = `chapter-item ${isUnlocked ? '' : 'locked'} ${isCompleted ? 'completed' : ''}`;
            
            item.innerHTML = `
                <div class="chapter-number">${i}</div>
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
        const chapterData = CHAPTER_CHARACTERS[this.state.currentChapter];
        
        if (!chapterData) return;
        
        // ランダム化が有効な章の場合
        if (chapter.randomizePhrases) {
            chapterData.cats.forEach(cat => {
                CharacterHelper.randomizeCharacterPhrases(cat, chapter.availableNotes);
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
        
        // 第1章または音名非表示がオフの場合は全て表示
        if (!chapter.hideNoteNames) {
            return true;
        }
        
        // 覚えた音は表示
        return this.state.learnedNotes.includes(note);
    }
    
    learnNote(note) {
        if (!this.state.learnedNotes.includes(note)) {
            this.state.learnedNotes.push(note);
            this.saveProgress();
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
        this.elements.villageMessage.textContent = STORY.villageIntro;
        
        this.renderPianoKeyboard(this.elements.pianoKeyboard);
        this.renderCharacters();
        this.updateFriendCount();
        this.updateLearnedNotesDisplay();
    }
    
    renderCharacters() {
        this.elements.charactersContainer.innerHTML = '';
        
        const chapterData = CHAPTER_CHARACTERS[this.state.currentChapter];
        if (!chapterData) return;
        
        chapterData.cats.forEach(cat => {
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
            
            charElement.style.left = `${cat.position.x}%`;
            charElement.style.top = `${cat.position.y}%`;
            
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
            
            // 仲間になっていない猫はクリック可能（逃げた猫も再挑戦可能）
            if (!isFriend) {
                charElement.addEventListener('click', () => {
                    this.startDialogue(cat, hasEscaped);
                });
            }
            
            this.elements.charactersContainer.appendChild(charElement);
        });
    }
    
    updateFriendCount() {
        this.elements.friendCount.textContent = this.state.friends.length;
    }
    
    // ===== 対話 =====
    async startDialogue(character, isRetry = false) {
        this.state.currentCharacter = character;
        this.state.playerNotes = [];
        
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
        
        // 双子の場合
        if (character.isTwin) {
            this.state.twinTargetNotes = CharacterHelper.getTwinPhrase(character);
        } else {
            this.state.twinTargetNotes = [];
        }
        
        this.showScreen('dialogue');
        this.renderPianoKeyboard(this.elements.pianoKeyboard);
        
        this.elements.animalSprite.textContent = character.emoji;
        this.elements.animalName.textContent = character.name;
        
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
            '指揮者猫': 'witch'
        };
        
        return personalityMap[character.personality] || 'cat';
    }
    
    async playAndShowNotes() {
        const character = this.state.currentCharacter;
        this.elements.animalNotes.innerHTML = '';
        this.state.isPlaying = true;
        
        if (character.isTwin) {
            // 双子猫：2つのメロディを同時に再生
            await this.playTwinNotes();
        } else {
            // 通常：1つのメロディを再生
            for (const note of this.state.targetNotes) {
                const bubble = this.createNoteBubble(note);
                this.elements.animalNotes.appendChild(bubble);
                
                await audioSystem.playNote(note, character.tempo * 0.8, character.type || 'cat');
                await this.delay(character.tempo * 200);
            }
        }
        
        this.state.isPlaying = false;
    }
    
    async playTwinNotes() {
        const character = this.state.currentCharacter;
        const notes1 = this.state.targetNotes;
        const notes2 = this.state.twinTargetNotes;
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
            
            await audioSystem.playChord(chord, character.tempo * 0.8, 'cat');
            await this.delay(character.tempo * 200);
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
        if (this.state.playerNotes.length >= 12) return;
        
        await audioSystem.playNote(note, 0.3, 'player');
        
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
            isCorrect = CharacterHelper.compareTwinNotes(
                this.state.playerNotes,
                this.state.targetNotes,
                this.state.twinTargetNotes
            );
        } else {
            isCorrect = CharacterHelper.compareNotes(
                this.state.playerNotes,
                this.state.targetNotes
            );
        }
        
        this.state.isPlaying = true;
        
        // プレイヤーの音を再生
        for (const note of this.state.playerNotes) {
            await audioSystem.playNote(note, 0.3, 'player');
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
                this.state.twinTargetNotes.forEach(note => this.learnNote(note));
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
            this.elements.resultTitle.textContent = 'にげられた...';
            this.elements.resultTitle.className = 'failure';
            this.elements.resultMessage.textContent = character.dialogue.failure;
            this.elements.learnedNoteDisplay.classList.remove('show');
            
            // 失敗時は悲しい声
            await this.speakText(character.dialogue.failure, voiceType);
        }
    }
    
    continueFromResult() {
        const chapterData = CHAPTER_CHARACTERS[this.state.currentChapter];
        
        this.showScreen('village');
        this.renderCharacters();
        this.updateFriendCount();
        this.updateLearnedNotesDisplay();
        
        if (this.state.friends.length === chapterData.cats.length) {
            this.elements.villageMessage.textContent = 
                '全ての猫となかまになった！森の奥へ行ってみよう...';
        } else {
            const remaining = chapterData.cats.length - this.state.friends.length;
            const escaped = this.state.escapedCats.length;
            
            if (escaped > 0) {
                this.elements.villageMessage.textContent = 
                    `あと ${remaining} 匹！🔄マークの猫に再挑戦できるよ！`;
            } else {
                this.elements.villageMessage.textContent = 
                    `あと ${remaining} 匹の猫がいるよ！`;
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
        
        this.startWolfBattle();
    }
    
    async startWolfBattle() {
        const chapterData = CHAPTER_CHARACTERS[this.state.currentChapter];
        const wolf = chapterData.wolf;
        const phase = CharacterHelper.getWolfPhase(wolf);
        
        this.showScreen('wolf');
        this.renderPianoKeyboard(this.elements.wolfPianoKeyboard, true);
        
        this.elements.wolfSprite.textContent = wolf.emoji;
        this.elements.wolfSprite.className = `wolf-sprite ${phase.emotion}`;
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
        
        for (const note of this.state.targetNotes) {
            const bubble = this.createNoteBubble(note);
            this.elements.wolfNotes.appendChild(bubble);
            
            await audioSystem.playNote(note, phase.tempo * 0.8, 'wolf');
            await this.delay(phase.tempo * 200);
        }
        
        this.state.isPlaying = false;
    }
    
    async onWolfPianoKeyPress(note) {
        if (this.state.isPlaying) return;
        if (this.state.playerNotes.length >= 12) return;
        
        await audioSystem.playNote(note, 0.3, 'player');
        
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
            await audioSystem.playNote(note, 0.3, 'player');
            await this.delay(100);
        }
        
        await this.delay(500);
        
        // 狼の感情に応じた音声タイプ
        const wolfVoiceType = `wolf_${phase.emotion}`;
        
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
            this.elements.wolfSprite.className = `wolf-sprite angry`;
            await this.speakText(phase.dialogue.failure, 'wolf_angry');  // 失敗時は怒った声
            
            await this.delay(1500);
            
            this.state.playerNotes = [];
            this.elements.wolfPlayerNotes.innerHTML = '';
            this.elements.wolfSprite.className = `wolf-sprite ${phase.emotion}`;
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
        
        // 次の章があるかチェック
        const nextChapterBtn = document.getElementById('next-chapter-btn');
        if (this.state.currentChapter < 5) {
            nextChapterBtn.style.display = 'inline-block';
            this.elements.endingText.innerHTML = 
                'あなたのおかげで、<br>どうぶつの村に平和が戻りました。<br><br>次の章へ進もう！';
        } else {
            nextChapterBtn.style.display = 'none';
            this.elements.endingText.innerHTML = 
                '全ての章をクリアしました！<br><br>あなたは真の音楽家です。<br>どうぶつたちは永遠にあなたを忘れないでしょう...';
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

// ゲーム開始
document.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
});
