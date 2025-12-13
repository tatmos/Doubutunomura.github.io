/**
 * どうぶつの村 〜音の絆〜
 * オーディオシステム
 * Web Audio API + Web Speech API
 */

class AudioSystem {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.isInitialized = false;
        
        // ドレミファソラシの周波数 (C4からB4) + 黒鍵
        this.frequencies = {
            'do': 261.63,   // C4
            'do#': 277.18,  // C#4
            're': 293.66,   // D4
            're#': 311.13,  // D#4 (Eb)
            'mi': 329.63,   // E4
            'fa': 349.23,   // F4
            'fa#': 369.99,  // F#4
            'so': 392.00,   // G4
            'so#': 415.30,  // G#4 (Ab)
            'la': 440.00,   // A4
            'la#': 466.16,  // A#4 (Bb / シ♭)
            'ti': 493.88    // B4
        };
        
        // 音色設定（instrumentType: 'piano', 'synth', 'bell', etc.）
        this.instruments = {
            cat: { type: 'piano', harmonics: [1, 0.5, 0.25], portamento: 0.08 },
            dog: { type: 'synth', waveform: 'triangle', harmonics: [1, 0.3], portamento: 0.05 },
            bird: { type: 'bell', harmonics: [1, 0.6, 0.3, 0.15], portamento: 0 },
            wolf: { type: 'synth', waveform: 'sawtooth', harmonics: [1, 0.4, 0.2], portamento: 0.15 },
            witch: { type: 'synth', waveform: 'sawtooth', harmonics: [1, 0.5, 0.3, 0.1], portamento: 0.1 },
            player: { type: 'piano', harmonics: [1, 0.4, 0.2], portamento: 0 }
        };
        
        // 旧互換用
        this.waveforms = {
            cat: 'sine',
            dog: 'triangle',
            bird: 'square',
            wolf: 'sawtooth',
            witch: 'sawtooth',
            player: 'sine'
        };
        
        // 音声読み上げ設定
        this.speechSynthesis = window.speechSynthesis;
        this.speechEnabled = true;
        this.speechRate = 0.9;
        this.speechPitch = 1.0;
        this.preferredVoice = null;
    }
    
    /**
     * オーディオコンテキストを初期化
     */
    async init() {
        if (this.isInitialized) return;
        
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.connect(this.audioContext.destination);
            this.masterGain.gain.value = 0.5;
            this.isInitialized = true;
            
            // 日本語音声を探す
            this.loadVoices();
            
            console.log('Audio system initialized');
        } catch (error) {
            console.error('Failed to initialize audio:', error);
        }
    }
    
    /**
     * 音声合成の声を読み込む
     */
    loadVoices() {
        const setVoice = () => {
            const voices = this.speechSynthesis.getVoices();
            // 日本語の声を優先
            this.preferredVoice = voices.find(v => v.lang === 'ja-JP') ||
                                  voices.find(v => v.lang.startsWith('ja')) ||
                                  voices[0];
        };
        
        setVoice();
        
        if (this.speechSynthesis.onvoiceschanged !== undefined) {
            this.speechSynthesis.onvoiceschanged = setVoice;
        }
    }
    
    /**
     * テキストを音声で読み上げ
     * @param {string} text - 読み上げるテキスト
     * @param {object} options - オプション（rate, pitch, onEnd）
     * @returns {Promise} 読み上げ完了時に解決
     */
    speak(text, options = {}) {
        return new Promise((resolve) => {
            if (!this.speechEnabled || !this.speechSynthesis) {
                resolve();
                return;
            }
            
            // 読み上げ中のものをキャンセル
            this.speechSynthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = this.preferredVoice;
            utterance.lang = 'ja-JP';
            utterance.rate = options.rate || this.speechRate;
            utterance.pitch = options.pitch || this.speechPitch;
            utterance.volume = options.volume || 1.0;
            
            utterance.onend = () => {
                resolve();
            };
            
            utterance.onerror = () => {
                resolve();
            };
            
            this.speechSynthesis.speak(utterance);
        });
    }
    
    /**
     * テキストから感情を分析してパラメータを調整
     */
    analyzeEmotion(text) {
        const emotions = {
            rate: 1.0,
            pitch: 1.0,
            volume: 1.0
        };
        
        // 興奮・喜び（！が多い、ポジティブワード）
        const excitementCount = (text.match(/[！!]/g) || []).length;
        if (excitementCount > 0) {
            emotions.rate += excitementCount * 0.1;
            emotions.pitch += excitementCount * 0.15;
            emotions.volume = Math.min(1.0, 0.8 + excitementCount * 0.1);
        }
        
        // 疑問（？）
        if (text.includes('？') || text.includes('?')) {
            emotions.pitch += 0.2;
        }
        
        // 悲しみ・寂しさ
        if (text.match(/[悲寂淋さみしい切ない泣]/)) {
            emotions.rate -= 0.2;
            emotions.pitch -= 0.1;
            emotions.volume -= 0.1;
        }
        
        // 怒り
        if (text.match(/[怒おこ激憤ガウ]/)) {
            emotions.rate += 0.15;
            emotions.pitch -= 0.2;
            emotions.volume = 1.0;
        }
        
        // 囁き・静かな場面
        if (text.includes('...') || text.includes('…') || text.match(/[静ひそ小さな声]/)) {
            emotions.rate -= 0.1;
            emotions.volume -= 0.2;
        }
        
        // 驚き
        if (text.match(/[驚びっくりえっわっ]/)) {
            emotions.rate += 0.2;
            emotions.pitch += 0.3;
        }
        
        // 幸せ・喜び
        if (text.match(/[嬉喜幸楽しいやったわーい♪♡💕]/)) {
            emotions.rate += 0.1;
            emotions.pitch += 0.2;
        }
        
        // 範囲を制限
        emotions.rate = Math.max(0.5, Math.min(1.5, emotions.rate));
        emotions.pitch = Math.max(0.5, Math.min(2.0, emotions.pitch));
        emotions.volume = Math.max(0.5, Math.min(1.0, emotions.volume));
        
        return emotions;
    }
    
    /**
     * キャラクター風の音声で読み上げ（感情分析付き）
     */
    speakAsCharacter(text, characterType = 'narrator') {
        // キャラクターの基本設定
        const voiceSettings = {
            narrator: { rate: 0.9, pitch: 1.0, volume: 1.0 },
            cat: { rate: 1.0, pitch: 1.3, volume: 0.95 },
            cat_shy: { rate: 0.9, pitch: 1.4, volume: 0.8 },      // 恥ずかしがり屋
            cat_cool: { rate: 0.85, pitch: 1.1, volume: 0.9 },    // クールな猫
            cat_energetic: { rate: 1.2, pitch: 1.4, volume: 1.0 }, // 元気な猫
            wolf: { rate: 0.75, pitch: 0.6, volume: 1.0 },
            wolf_angry: { rate: 0.85, pitch: 0.5, volume: 1.0 },
            wolf_sad: { rate: 0.65, pitch: 0.55, volume: 0.85 },
            wolf_happy: { rate: 0.9, pitch: 0.7, volume: 1.0 },
            witch: { rate: 0.8, pitch: 0.85, volume: 0.95 },
            child: { rate: 1.15, pitch: 1.5, volume: 0.95 },
            twin: { rate: 1.1, pitch: 1.35, volume: 1.0 }
        };
        
        const baseSettings = voiceSettings[characterType] || voiceSettings.narrator;
        
        // テキストから感情を分析
        const emotion = this.analyzeEmotion(text);
        
        // 基本設定と感情を合成
        const finalSettings = {
            rate: baseSettings.rate * emotion.rate,
            pitch: baseSettings.pitch * emotion.pitch,
            volume: baseSettings.volume * emotion.volume
        };
        
        // 範囲を制限
        finalSettings.rate = Math.max(0.4, Math.min(2.0, finalSettings.rate));
        finalSettings.pitch = Math.max(0.3, Math.min(2.0, finalSettings.pitch));
        finalSettings.volume = Math.max(0.3, Math.min(1.0, finalSettings.volume));
        
        return this.speak(text, finalSettings);
    }
    
    /**
     * 特定の感情で読み上げ
     */
    speakWithEmotion(text, emotion = 'neutral', characterType = 'narrator') {
        const emotionModifiers = {
            neutral: { rate: 1.0, pitch: 1.0, volume: 1.0 },
            happy: { rate: 1.15, pitch: 1.2, volume: 1.0 },
            sad: { rate: 0.8, pitch: 0.85, volume: 0.8 },
            angry: { rate: 1.1, pitch: 0.8, volume: 1.0 },
            excited: { rate: 1.25, pitch: 1.3, volume: 1.0 },
            scared: { rate: 1.2, pitch: 1.15, volume: 0.85 },
            whisper: { rate: 0.85, pitch: 1.0, volume: 0.6 },
            mysterious: { rate: 0.75, pitch: 0.9, volume: 0.9 }
        };
        
        const voiceSettings = {
            narrator: { rate: 0.9, pitch: 1.0 },
            cat: { rate: 1.0, pitch: 1.3 },
            wolf: { rate: 0.75, pitch: 0.6 }
        };
        
        const base = voiceSettings[characterType] || voiceSettings.narrator;
        const mod = emotionModifiers[emotion] || emotionModifiers.neutral;
        
        return this.speak(text, {
            rate: base.rate * mod.rate,
            pitch: base.pitch * mod.pitch,
            volume: mod.volume
        });
    }
    
    /**
     * 読み上げを停止
     */
    stopSpeaking() {
        if (this.speechSynthesis) {
            this.speechSynthesis.cancel();
        }
    }
    
    /**
     * 読み上げ有効/無効切り替え
     */
    toggleSpeech(enabled) {
        this.speechEnabled = enabled;
        if (!enabled) {
            this.stopSpeaking();
        }
    }
    
    /**
     * 単音を再生（ピアノ音色対応 + パンニング対応 + オクターブシフト対応）
     * @param {number} pan - パンニング値（-1.0: 左, 0: 中央, 1.0: 右）
     * @param {number} octaveShift - オクターブシフト（1で1オクターブ上、-1で1オクターブ下）
     */
    playNote(note, duration = 0.4, character = 'player', pan = 0, octaveShift = 0) {
        return new Promise((resolve) => {
            if (!this.isInitialized || !this.frequencies[note]) {
                resolve();
                return;
            }
            
            const baseFreq = this.frequencies[note] * Math.pow(2, octaveShift);
            const instrument = this.instruments[character] || this.instruments.player;
            const now = this.audioContext.currentTime;
            
            // メインゲインノード
            const mainGain = this.audioContext.createGain();
            
            // パンニングノードを追加
            if (this.audioContext.createStereoPanner && Math.abs(pan) > 0.01) {
                const pannerNode = this.audioContext.createStereoPanner();
                pannerNode.pan.value = pan;
                mainGain.connect(pannerNode);
                pannerNode.connect(this.masterGain);
            } else {
                mainGain.connect(this.masterGain);
            }
            
            const oscillators = [];
            
            // 倍音を重ねてピアノのような音色を作成
            instrument.harmonics.forEach((amplitude, index) => {
                const osc = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();
                
                osc.connect(gain);
                gain.connect(mainGain);
                
                // 波形を設定
                if (instrument.type === 'piano' || instrument.type === 'bell') {
                    osc.type = 'sine';  // ピアノはサイン波の重ね合わせ
                } else {
                    osc.type = instrument.waveform || 'sine';
                }
                
                // 倍音の周波数（基音、2倍音、3倍音...）
                osc.frequency.value = baseFreq * (index + 1);
                
                // 各倍音のエンベロープ（高い倍音ほど早く減衰）
                const decayRate = 1 + index * 0.5;
                const attackTime = instrument.type === 'piano' ? 0.01 : 0.03;
                const peakGain = amplitude * 0.5;
                
                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(peakGain, now + attackTime);
                
                if (instrument.type === 'piano') {
                    // ピアノ: 速い減衰
                    gain.gain.exponentialRampToValueAtTime(
                        peakGain * 0.3,
                        now + duration * 0.3 / decayRate
                    );
                    gain.gain.exponentialRampToValueAtTime(
                        0.001,
                        now + duration / decayRate
                    );
                } else if (instrument.type === 'bell') {
                    // ベル: さらに速い減衰
                    gain.gain.exponentialRampToValueAtTime(
                        0.001,
                        now + duration * 0.7 / decayRate
                    );
                } else {
                    // シンセ: 持続する音
                    gain.gain.linearRampToValueAtTime(peakGain * 0.7, now + 0.1);
                    gain.gain.linearRampToValueAtTime(peakGain * 0.7, now + duration - 0.1);
                    gain.gain.linearRampToValueAtTime(0, now + duration);
                }
                
                osc.start(now);
                osc.stop(now + duration);
                oscillators.push(osc);
            });
            
            // 最初のオシレーターの終了を監視
            if (oscillators.length > 0) {
                oscillators[0].onended = () => resolve();
            } else {
                resolve();
            }
        });
    }
    
    /**
     * ポルタメント付きでメロディを再生
     * 音程が滑らかに変化しながら次の音へ移行する
     */
    playMelodyWithPortamento(notes, tempo = 0.5, character = 'cat') {
        return new Promise((resolve) => {
            if (!this.isInitialized || notes.length === 0) {
                resolve();
                return;
            }
            
            const instrument = this.instruments[character] || this.instruments.cat;
            const portamentoTime = instrument.portamento || 0.08;
            const totalDuration = notes.length * tempo;
            const now = this.audioContext.currentTime;
            
            // メインゲインノード
            const mainGain = this.audioContext.createGain();
            mainGain.connect(this.masterGain);
            
            // 各倍音用のオシレーター
            const oscillators = [];
            
            instrument.harmonics.forEach((amplitude, harmonicIndex) => {
                const osc = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();
                
                osc.connect(gain);
                gain.connect(mainGain);
                
                if (instrument.type === 'piano' || instrument.type === 'bell') {
                    osc.type = 'sine';
                } else {
                    osc.type = instrument.waveform || 'sine';
                }
                
                // 最初の音の周波数
                const firstFreq = this.frequencies[notes[0]] * (harmonicIndex + 1);
                osc.frequency.setValueAtTime(firstFreq, now);
                
                // ポルタメントで音程を変化させる
                notes.forEach((note, noteIndex) => {
                    const freq = this.frequencies[note] * (harmonicIndex + 1);
                    const noteStartTime = now + noteIndex * tempo;
                    
                    if (noteIndex === 0) {
                        osc.frequency.setValueAtTime(freq, noteStartTime);
                    } else {
                        // 前の音の終わり際からポルタメント開始
                        const glideStart = noteStartTime - portamentoTime;
                        osc.frequency.setValueAtTime(
                            this.frequencies[notes[noteIndex - 1]] * (harmonicIndex + 1),
                            glideStart
                        );
                        osc.frequency.linearRampToValueAtTime(freq, noteStartTime);
                    }
                });
                
                // エンベロープ（各音でアタック）
                const peakGain = amplitude * 0.4;
                gain.gain.setValueAtTime(0, now);
                
                notes.forEach((note, noteIndex) => {
                    const noteStartTime = now + noteIndex * tempo;
                    const attackEnd = noteStartTime + 0.02;
                    const noteEnd = noteStartTime + tempo * 0.85;
                    
                    // アタック
                    gain.gain.linearRampToValueAtTime(peakGain, attackEnd);
                    // 持続
                    gain.gain.linearRampToValueAtTime(peakGain * 0.7, noteEnd);
                    // 軽い減衰（次の音へ繋がる）
                    if (noteIndex < notes.length - 1) {
                        gain.gain.linearRampToValueAtTime(peakGain * 0.4, noteStartTime + tempo);
                    }
                });
                
                // 最後のリリース
                gain.gain.linearRampToValueAtTime(0, now + totalDuration);
                
                osc.start(now);
                osc.stop(now + totalDuration + 0.1);
                oscillators.push(osc);
            });
            
            if (oscillators.length > 0) {
                oscillators[0].onended = () => resolve();
            } else {
                resolve();
            }
        });
    }
    
    /**
     * 複数の音を同時に再生（和音）- ピアノ音色対応 + パンニング対応
     * @param {number} pan - パンニング値（-1.0: 左, 0: 中央, 1.0: 右）
     */
    playChord(notes, duration = 0.5, character = 'cat', pan = 0) {
        return new Promise((resolve) => {
            if (!this.isInitialized) {
                resolve();
                return;
            }
            
            const instrument = this.instruments[character] || this.instruments.cat;
            const now = this.audioContext.currentTime;
            const mainGain = this.audioContext.createGain();
            
            // パンニングノードを追加
            if (this.audioContext.createStereoPanner && Math.abs(pan) > 0.01) {
                const pannerNode = this.audioContext.createStereoPanner();
                pannerNode.pan.value = pan;
                mainGain.connect(pannerNode);
                pannerNode.connect(this.masterGain);
            } else {
                mainGain.connect(this.masterGain);
            }
            
            const allOscillators = [];
            
            for (const note of notes) {
                if (!this.frequencies[note]) continue;
                
                const baseFreq = this.frequencies[note];
                
                // 各音に倍音を追加
                instrument.harmonics.forEach((amplitude, index) => {
                    const osc = this.audioContext.createOscillator();
                    const gain = this.audioContext.createGain();
                    
                    osc.connect(gain);
                    gain.connect(mainGain);
                    
                    if (instrument.type === 'piano' || instrument.type === 'bell') {
                        osc.type = 'sine';
                    } else {
                        osc.type = instrument.waveform || 'sine';
                    }
                    
                    osc.frequency.value = baseFreq * (index + 1);
                    
                    // 和音なので音量を下げる
                    const peakGain = amplitude * 0.25 / notes.length;
                    const decayRate = 1 + index * 0.5;
                    
                    gain.gain.setValueAtTime(0, now);
                    gain.gain.linearRampToValueAtTime(peakGain, now + 0.01);
                    
                    if (instrument.type === 'piano') {
                        gain.gain.exponentialRampToValueAtTime(
                            peakGain * 0.3,
                            now + duration * 0.4 / decayRate
                        );
                        gain.gain.exponentialRampToValueAtTime(
                            0.001,
                            now + duration / decayRate
                        );
                    } else {
                        gain.gain.linearRampToValueAtTime(peakGain * 0.6, now + 0.1);
                        gain.gain.linearRampToValueAtTime(peakGain * 0.6, now + duration - 0.1);
                        gain.gain.linearRampToValueAtTime(0, now + duration);
                    }
                    
                    osc.start(now);
                    osc.stop(now + duration);
                    allOscillators.push(osc);
                });
            }
            
            if (allOscillators.length > 0) {
                allOscillators[0].onended = () => resolve();
            } else {
                resolve();
            }
        });
    }
    
    /**
     * メロディを再生（ポルタメント対応）
     * @param {boolean} usePortamento - ポルタメントを使用するか
     */
    async playMelody(notes, tempo = 0.5, character = 'cat', usePortamento = true) {
        const instrument = this.instruments[character] || this.instruments.cat;
        
        // ポルタメントが設定されているキャラクターで、usePortamentoがtrueの場合
        if (usePortamento && instrument.portamento > 0 && notes.length > 1) {
            await this.playMelodyWithPortamento(notes, tempo, character);
        } else {
            // 通常の再生（各音を個別に）
            for (const note of notes) {
                await this.playNote(note, tempo * 0.8, character, 0, 0);
                await this.delay(tempo * 0.2);
            }
        }
    }
    
    /**
     * 双子猫用：2つのメロディを同時に再生（ピアノ音色）
     */
    async playTwinMelody(notes1, notes2, tempo = 0.5, character = 'cat') {
        const maxLength = Math.max(notes1.length, notes2.length);
        
        for (let i = 0; i < maxLength; i++) {
            const chord = [];
            if (i < notes1.length) chord.push(notes1[i]);
            if (i < notes2.length) chord.push(notes2[i]);
            
            await this.playChord(chord, tempo * 0.8, character);
            await this.delay(tempo * 0.2);
        }
    }
    
    /**
     * 成功音
     */
    async playSuccessSound() {
        const successNotes = ['do', 'mi', 'so', 'do'];
        for (let i = 0; i < successNotes.length; i++) {
            const freq = this.frequencies[successNotes[i]] * (i === 3 ? 2 : 1);
            await this.playFrequency(freq, 0.15);
            await this.delay(0.05);
        }
    }
    
    /**
     * 失敗音
     */
    async playFailSound() {
        await this.playFrequency(200, 0.3);
        await this.delay(0.1);
        await this.playFrequency(150, 0.4);
    }
    
    /**
     * 周波数を直接再生
     */
    playFrequency(frequency, duration = 0.3) {
        return new Promise((resolve) => {
            if (!this.isInitialized) {
                resolve();
                return;
            }
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.masterGain);
            
            oscillator.type = 'sine';
            oscillator.frequency.value = frequency;
            
            const now = this.audioContext.currentTime;
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(0.5, now + 0.02);
            gainNode.gain.linearRampToValueAtTime(0, now + duration);
            
            oscillator.start(now);
            oscillator.stop(now + duration);
            
            oscillator.onended = () => resolve();
        });
    }
    
    /**
     * 狼の遠吠え
     */
    async playWolfHowl() {
        if (!this.isInitialized) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        oscillator.type = 'sawtooth';
        
        const now = this.audioContext.currentTime;
        
        oscillator.frequency.setValueAtTime(200, now);
        oscillator.frequency.linearRampToValueAtTime(400, now + 0.5);
        oscillator.frequency.linearRampToValueAtTime(350, now + 1);
        oscillator.frequency.linearRampToValueAtTime(200, now + 1.5);
        
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.4, now + 0.3);
        gainNode.gain.linearRampToValueAtTime(0.3, now + 1);
        gainNode.gain.linearRampToValueAtTime(0, now + 1.5);
        
        oscillator.start(now);
        oscillator.stop(now + 1.5);
        
        return new Promise(resolve => {
            oscillator.onended = resolve;
        });
    }
    
    /**
     * ファンファーレ
     */
    async playFanfare() {
        const fanfare = [
            { note: 'do', duration: 0.2 },
            { note: 'mi', duration: 0.2 },
            { note: 'so', duration: 0.2 },
            { note: 'do', duration: 0.4, octave: 2 },
            { note: 'so', duration: 0.2 },
            { note: 'do', duration: 0.6, octave: 2 }
        ];
        
        for (const item of fanfare) {
            const freq = this.frequencies[item.note] * (item.octave || 1);
            await this.playFrequency(freq, item.duration);
            await this.delay(0.05);
        }
    }
    
    /**
     * 章開始のジングル
     */
    async playChapterStart() {
        const notes = ['so', 'do', 'mi', 'so'];
        for (const note of notes) {
            await this.playNote(note, 0.2, 'player', 0, 0);
            await this.delay(0.05);
        }
    }
    
    delay(seconds) {
        return new Promise(resolve => setTimeout(resolve, seconds * 1000));
    }
    
    setVolume(value) {
        if (this.masterGain) {
            this.masterGain.gain.value = Math.max(0, Math.min(1, value));
        }
    }
}

// グローバルインスタンス
const audioSystem = new AudioSystem();
