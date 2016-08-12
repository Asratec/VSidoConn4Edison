/**
 * @fileoverview V-Sido対応ロボットをV-SidoのJavaScriptライブラリで操作するサンプルコードのロボットAR対戦ゲームです
 * @author Daisuke IMAI <daisimai@asratec.co.jp>
 */
(function(){
  //
  // Class定義部
  //

  /**
   * ロボットのコントロールを司るClass
   * @param {Object} connectParameters ロボットに接続するためのパラメータ
   * @constructor
   */
  var RobotController = function(connectParameters) {

    /**
     * ロボットへの接続オブジェクトのインスタンス保持用
     * @type {Object}
     */
    this.connect = null;

    /**
     * 接続状態管理
     * @type {Boolean}
     */
    this.connected = false;

    /**
     * 接続がダミー接続(テスト用)であるか否か
     * @type {Boolean}
     */
    this.isDummyConnection = false;

    /**
     * ロボットへ秒間何回命令を送るか
     * 30以上はSPPの処理が追いつかない可能性があるので、30くらいを目安に。
     * @type {String}
     */
    this.fps = 30;

    /**
     * 歩行パラメータ
     * @type {Object}
     */
    this.walkParameters = {
      // 前後方向のパラメータ
      forward: 0,
      // 左右回転方向のパラメータ
      turnCW: 0,
    };

    /**
     * カメラ角度(実際には首のヨー軸角度に割り当てられている)
     * @type {Number}
     */
    this.cameraAngle = 0;

    /**
     * 最後に処理したプロセス種別
     * @type {Number}
     */
    this.lastProcess = 0;

    /**
     * プロセス種別ごとに動作中かを保持する
     * @type {Object}
     */
    this.processInUse = this.initProcessInUse_();

    /**
     * カスタムモーションごとに動作中かを保持する
     * @type {Object}
     */
    this.motionState = this.initMotionState_();

    /**
     * メインループのインターバル処理用
     * @type {Object}
     */
    this.mainLoop = null;

    // ロボットに接続(WSのconnect)する。
    // ※接続するロボットを指定したい場合にipを設定する。例：{'ip':'127.0.0.1'}（コンストラクタの引数として来ているものを利用する）
    if (connectParameters.ip === 'dummy') {
      // 接続先が"dummy"の場合、ロボットには接続せず、ダミー接続モードで起動
      this.connected = true;
      this.isDummyConnection = true;
    } else {
      // V-Sidoのインスタンスを生成、接続済み時にはonConnected()をコールバックする
      this.connect = new vsido.Connect(connectParameters);
      this.connect.onOpen = function(event) {
        this.connected = true;
        this.onConnected(event);
      }.bind(this);
    }
  };
  RobotController.prototype = {
    // Class定数定義

    // 処理の種別ならびに順序付け
    PROCESS_TYPE: [
        'walk',
        'motion',
        'camera'
    ],

    // カスタムモーションの定義
    CUSTOM_MOTION: {
      // 腕を下ろす動き
      'lowerhands': [
        [{'kid': 2, 'position': {x: -15, y: 0, z: -95}}, {'kid': 3, 'position': {x: 15, y: 0, z: -95}}]
      ],
      // 攻撃アクション(両腕を上げる)
      'attack': [
        [{'kid': 2, 'position': {x: 0, y: 0, z: -100}}, {'kid': 3, 'position': {x: 0, y: 0, z: -100}}],
        [{'kid': 2, 'position': {x: 0, y: -25, z: -75}}, {'kid': 3, 'position': {x: 0, y: -25, z: -75}}],
        [{'kid': 2, 'position': {x: 0, y: -50, z: -50}}, {'kid': 3, 'position': {x: 0, y: -50, z: -50}}],
        [{'kid': 2, 'position': {x: 0, y: -75, z: -25}}, {'kid': 3, 'position': {x: 0, y: -75, z: -25}}],
        [{'kid': 2, 'position': {x: 0, y: -100, z: 0}}, {'kid': 3, 'position': {x: 0, y: -100, z: 0}}],
        [{'kid': 2, 'position': {x: 0, y: -100, z: 0}}, {'kid': 3, 'position': {x: 0, y: -100, z: 0}}],
        [{'kid': 2, 'position': {x: 0, y: -100, z: 0}}, {'kid': 3, 'position': {x: 0, y: -100, z: 0}}],
        [{'kid': 2, 'position': {x: 0, y: -100, z: 0}}, {'kid': 3, 'position': {x: 0, y: -100, z: 0}}],
        [{'kid': 2, 'position': {x: 0, y: -100, z: 0}}, {'kid': 3, 'position': {x: 0, y: -100, z: 0}}],
        [{'kid': 2, 'position': {x: 0, y: -100, z: 0}}, {'kid': 3, 'position': {x: 0, y: -100, z: 0}}],
        [{'kid': 2, 'position': {x: 0, y: -100, z: 0}}, {'kid': 3, 'position': {x: 0, y: -100, z: 0}}],
        [{'kid': 2, 'position': {x: 0, y: -100, z: 0}}, {'kid': 3, 'position': {x: 0, y: -100, z: 0}}],
        [{'kid': 2, 'position': {x: 0, y: -100, z: 0}}, {'kid': 3, 'position': {x: 0, y: -100, z: 0}}],
        [{'kid': 2, 'position': {x: 0, y: -100, z: 0}}, {'kid': 3, 'position': {x: 0, y: -100, z: 0}}],
        [{'kid': 2, 'position': {x: 0, y: -100, z: 0}}, {'kid': 3, 'position': {x: 0, y: -100, z: 0}}],
        [{'kid': 2, 'position': {x: 0, y: -100, z: 0}}, {'kid': 3, 'position': {x: 0, y: -100, z: 0}}],
        [{'kid': 2, 'position': {x: 0, y: -100, z: 0}}, {'kid': 3, 'position': {x: 0, y: -100, z: 0}}],
        [{'kid': 2, 'position': {x: 0, y: -100, z: 0}}, {'kid': 3, 'position': {x: 0, y: -100, z: 0}}],
        [{'kid': 2, 'position': {x: 0, y: -100, z: 0}}, {'kid': 3, 'position': {x: 0, y: -100, z: 0}}],
        [{'kid': 2, 'position': {x: 0, y: -100, z: 0}}, {'kid': 3, 'position': {x: 0, y: -100, z: 0}}],
        [{'kid': 2, 'position': {x: 0, y: -100, z: 0}}, {'kid': 3, 'position': {x: 0, y: -100, z: 0}}],
        [{'kid': 2, 'position': {x: 0, y: -100, z: 0}}, {'kid': 3, 'position': {x: 0, y: -100, z: 0}}],
        [{'kid': 2, 'position': {x: -15, y: 0, z: -25}}, {'kid': 3, 'position': {x: 15, y: 0, z: -25}}],
        [{'kid': 2, 'position': {x: -15, y: 0, z: -35}}, {'kid': 3, 'position': {x: 15, y: 0, z: -35}}],
        [{'kid': 2, 'position': {x: -15, y: 0, z: -45}}, {'kid': 3, 'position': {x: 15, y: 0, z: -45}}],
        [{'kid': 2, 'position': {x: -15, y: 0, z: -55}}, {'kid': 3, 'position': {x: 15, y: 0, z: -55}}],
        [{'kid': 2, 'position': {x: -15, y: 0, z: -65}}, {'kid': 3, 'position': {x: 15, y: 0, z: -65}}],
        [{'kid': 2, 'position': {x: -15, y: 0, z: -75}}, {'kid': 3, 'position': {x: 15, y: 0, z: -75}}],
        [{'kid': 2, 'position': {x: -15, y: 0, z: -85}}, {'kid': 3, 'position': {x: 15, y: 0, z: -85}}],
        [{'kid': 2, 'position': {x: -15, y: 0, z: -95}}, {'kid': 3, 'position': {x: 15, y: 0, z: -95}}]
      ],
      // しゃがみ込む
      'crouch': [
        [{'kid': 4, 'position': {x: 0, y: 20, z: -90}}, {'kid': 5, 'position': {x: 0, y: 20, z: -90}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -89}}, {'kid': 5, 'position': {x: 0, y: 20, z: -89}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -88}}, {'kid': 5, 'position': {x: 0, y: 20, z: -88}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -87}}, {'kid': 5, 'position': {x: 0, y: 20, z: -87}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -86}}, {'kid': 5, 'position': {x: 0, y: 20, z: -86}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -85}}, {'kid': 5, 'position': {x: 0, y: 20, z: -85}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -84}}, {'kid': 5, 'position': {x: 0, y: 20, z: -84}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -83}}, {'kid': 5, 'position': {x: 0, y: 20, z: -83}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -82}}, {'kid': 5, 'position': {x: 0, y: 20, z: -82}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -81}}, {'kid': 5, 'position': {x: 0, y: 20, z: -81}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -80}}, {'kid': 5, 'position': {x: 0, y: 20, z: -80}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -79}}, {'kid': 5, 'position': {x: 0, y: 20, z: -79}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -78}}, {'kid': 5, 'position': {x: 0, y: 20, z: -78}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -77}}, {'kid': 5, 'position': {x: 0, y: 20, z: -77}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -76}}, {'kid': 5, 'position': {x: 0, y: 20, z: -76}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -75}}, {'kid': 5, 'position': {x: 0, y: 20, z: -75}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -74}}, {'kid': 5, 'position': {x: 0, y: 20, z: -74}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -73}}, {'kid': 5, 'position': {x: 0, y: 20, z: -73}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -72}}, {'kid': 5, 'position': {x: 0, y: 20, z: -72}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -71}}, {'kid': 5, 'position': {x: 0, y: 20, z: -71}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -70}}, {'kid': 5, 'position': {x: 0, y: 20, z: -70}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -69}}, {'kid': 5, 'position': {x: 0, y: 20, z: -69}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -68}}, {'kid': 5, 'position': {x: 0, y: 20, z: -68}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -67}}, {'kid': 5, 'position': {x: 0, y: 20, z: -67}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -66}}, {'kid': 5, 'position': {x: 0, y: 20, z: -66}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -65}}, {'kid': 5, 'position': {x: 0, y: 20, z: -65}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -64}}, {'kid': 5, 'position': {x: 0, y: 20, z: -64}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -63}}, {'kid': 5, 'position': {x: 0, y: 20, z: -63}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -62}}, {'kid': 5, 'position': {x: 0, y: 20, z: -62}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -61}}, {'kid': 5, 'position': {x: 0, y: 20, z: -61}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -60}}, {'kid': 5, 'position': {x: 0, y: 20, z: -60}}]
      ],
      // しゃがみ込みからの立ち上がり
      'standup': [
        [{'kid': 4, 'position': {x: 0, y: 20, z: -60}}, {'kid': 5, 'position': {x: 0, y: 20, z: -60}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -61}}, {'kid': 5, 'position': {x: 0, y: 20, z: -61}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -62}}, {'kid': 5, 'position': {x: 0, y: 20, z: -62}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -63}}, {'kid': 5, 'position': {x: 0, y: 20, z: -63}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -64}}, {'kid': 5, 'position': {x: 0, y: 20, z: -64}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -65}}, {'kid': 5, 'position': {x: 0, y: 20, z: -65}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -66}}, {'kid': 5, 'position': {x: 0, y: 20, z: -66}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -67}}, {'kid': 5, 'position': {x: 0, y: 20, z: -67}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -68}}, {'kid': 5, 'position': {x: 0, y: 20, z: -68}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -69}}, {'kid': 5, 'position': {x: 0, y: 20, z: -69}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -70}}, {'kid': 5, 'position': {x: 0, y: 20, z: -70}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -71}}, {'kid': 5, 'position': {x: 0, y: 20, z: -71}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -72}}, {'kid': 5, 'position': {x: 0, y: 20, z: -72}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -73}}, {'kid': 5, 'position': {x: 0, y: 20, z: -73}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -74}}, {'kid': 5, 'position': {x: 0, y: 20, z: -74}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -75}}, {'kid': 5, 'position': {x: 0, y: 20, z: -75}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -76}}, {'kid': 5, 'position': {x: 0, y: 20, z: -76}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -77}}, {'kid': 5, 'position': {x: 0, y: 20, z: -77}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -78}}, {'kid': 5, 'position': {x: 0, y: 20, z: -78}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -79}}, {'kid': 5, 'position': {x: 0, y: 20, z: -79}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -80}}, {'kid': 5, 'position': {x: 0, y: 20, z: -80}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -81}}, {'kid': 5, 'position': {x: 0, y: 20, z: -81}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -82}}, {'kid': 5, 'position': {x: 0, y: 20, z: -82}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -83}}, {'kid': 5, 'position': {x: 0, y: 20, z: -83}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -84}}, {'kid': 5, 'position': {x: 0, y: 20, z: -84}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -85}}, {'kid': 5, 'position': {x: 0, y: 20, z: -85}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -86}}, {'kid': 5, 'position': {x: 0, y: 20, z: -86}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -87}}, {'kid': 5, 'position': {x: 0, y: 20, z: -87}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -88}}, {'kid': 5, 'position': {x: 0, y: 20, z: -88}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -89}}, {'kid': 5, 'position': {x: 0, y: 20, z: -89}}],
        [{'kid': 4, 'position': {x: 0, y: 20, z: -90}}, {'kid': 5, 'position': {x: 0, y: 20, z: -90}}]
      ],
      // ここに上記に習ってオリジナルモーションを作ることができます(サンプルの中では未使用)
      'original': [
        [{'kid': 0, 'position': {}}]
      ],
    },

    // Class関数定義

    /**
     * ロボットに接続された時に呼び出されるメソッド
     * (このサンプルではGameManager側でオーバーライドされる)
     */
    onConnected: function() {
    },

    /**
     * 接続状態を返す
     * @return {Boolean} 接続していればTrue
     */
    isConnected: function() {
      return this.connected;
    },

    /**
     * カスタムモーションを再生する状態にする
     * ※実際のモーション再生はtakeActionのメソッドの中で他の処理との優先順位を見ながら実行される
     * @param {String} motion モーション名
     */
    activateMotion: function(motionName) {
      if ((motionName in this.motionState) && !(this.motionState[motionName].active)) {
        this.motionState[motionName].currentFrame = 0;
        this.motionState[motionName].active = true;
        this.processInUse.motion = true;
      }
  	},

    /**
     * カメラアングルの変更
     * @param {Number} angle カメラの左右回転角度
     */
    setCameraAngle: function(angle) {
      // TODO: カメラアングルの範囲確認(一応、渡す側で行っている)
      this.cameraAngle = angle;
    },

    /**
     * カメラアングルをゼロ位置に戻す
     */
    resetCameraAngle: function() {
      this.cameraAngle = 0;
    },

    /**
     * 歩行パラメータのセット
     * @param {Number} forward 前後方向の程度
     * @param {Number} turnCW 左右回転方向の程度
     */
    setWalkParameters: function(forward, turnCW) {
      this.walkParameters.forward = forward;
      this.walkParameters.turnCW = turnCW;
      this.processInUse.walk = true;
    },

    /**
     * 歩行パラメータをリセットし、歩行を止める
     */
    stopWalking: function() {
      this.walkParameters.forward = 0;
      this.walkParameters.turnCW = 0;
      this.processInUse.walk = false;
    },

    /**
     * ロボットに行動指示を送るメインループをスタートする
     */
    startMainLoop: function() {
      this.mainLoop = setInterval(this.mainLoop_.bind(this), Math.round(1000 / this.fps));
    },

    // 以下Private method

    // 各プロセスの利用状態を保持するための配列生成
    initProcessInUse_: function() {
      var processInUse = {};
      for (var process in this.PROCESS_TYPE) {
        processInUse[process] = false;
      }
      return processInUse;
    },

    // モーションの管理のための配列生成
    initMotionState_: function() {
      var motionState = {};
      for (var motion in this.CUSTOM_MOTION) {
        motionState[motion] = {'active': false, 'currentFrame': 0};
      }
      return motionState;
    },

    // 何か一つでもモーションを実行しているか確認
    isMotionActive_: function() {
      var inUse = false;
      for (var motion in this.CUSTOM_MOTION) {
        inUse |= this.motionState[motion].active;
      }
      return inUse;
    },

    // ロボットへのコマンド送信
    sendCommand_: function (message, callback) {
      this.waitForConnection_(function () {
        this.connect.send(message);
        if (typeof callback !== 'undefined') {
          callback();
        }
      }.bind(this), 5);
    },

    // WebSocketの接続を待つ
    waitForConnection_: function (callback, interval) {
      if (this.connect.ws.readyState === 1) {
        callback();
      } else {
        var that = this;
        setTimeout(function () {
          that.waitForConnection_(callback, interval);
        }, interval);
      }
    },
    // ロボットへの行動指示コマンドを作成するメインループ
    mainLoop_: function() {
      // 歩行処理、カスタムモーション処理、カメラ処理のいずれかを順次行う

      var command = null;

      // 前の処理の次の種類の処理を調べる
      var currentProcess = this.lastProcess + 1;
      if (currentProcess >= this.PROCESS_TYPE.length) {
        currentProcess = 0;
      }
      // 次の実行すべき処理が発見されるか、前の処理と同じになるまで次々と進む
      while (!this.processInUse[this.PROCESS_TYPE[currentProcess]] && currentProcess !== this.lastProcess) {
        currentProcess++;
        if (currentProcess >= this.PROCESS_TYPE.length) {
          currentProcess = 0;
        }
      }
      if (this.processInUse[this.PROCESS_TYPE[currentProcess]]) {
        switch (this.PROCESS_TYPE[currentProcess]) {
          // 歩行処理
          case 'walk':
            this.processInUse.walk = false;
            // 歩行コマンドの生成
            command = new vsido.Walk(this.walkParameters.forward, this.walkParameters.turnCW);
            break;
          // カスタムモーション処理
          case 'motion':
            // 念のため、動かすべきモーションがあるかどうかの確認
            if (this.isMotionActive_()) {
              // IKコマンドの生成（position情報を利用するので、追加が必要）
              command = new vsido.SetIK({'position': true});
              // motionStateの各モーションについてアクティブ状態かチェックする
              for (var motion in this.motionState) {
                if (this.motionState[motion].active) {
                  // アクティブなモーションについては、現在のフレームを再生する
                  if (this.motionState[motion].currentFrame < this.CUSTOM_MOTION[motion].length) {
                    // フレームに含まれる全てのIK情報を追加する
                    var frameData = this.CUSTOM_MOTION[motion][this.motionState[motion].currentFrame];
                    for (var i = 0; i < frameData.length; i++) {
                      // IKコマンドのposition情報追加
                      command.setPosition(frameData[i].kid, frameData[i].position.x, frameData[i].position.y, frameData[i].position.z);
                    }
                  }
                  // 次のループのために次のフレームにすすめ、もし次のフレームがなければそのモーションの再生は終了
                  this.motionState[motion].currentFrame++;
                  if (this.motionState[motion].currentFrame >= this.CUSTOM_MOTION[motion].length) {
                    // モーションを最後のフレームまで再生したら、モーションのフラグを落とし、現在のフレームを0に戻す
                    this.motionState[motion].active = false;
                    this.motionState[motion].currentFrame = 0;
                  }
                }
              }
            }
            // 全てのモーションの全てのフレームの再生が終わった場合、motionのフラグを落とす
            this.processInUse.motion = this.isMotionActive_();
            break;
          // カメラ処理
          case 'camera':
            this.processInUse.camera = false;
            // IKコマンドの生成（rotation情報を利用するので、追加が必要）
            command = new vsido.SetIK({'rotation': true});
            // IKコマンドのrotation情報追加
            command.setRotation('head', 0, 0, this.cameraAngle);
            break;
        }
        // ロボットにコマンドを送信する
        if (command !== null) {
          if (this.isDummyConnection) {
            // ダミー接続モードの場合はコマンドを送る代わりにコンソールに表示する
            console.log(command);
          } else {
            this.sendCommand_(command);
          }
        }
      }
      // 今回処理したプロセス種別の保持
      this.lastProcess = currentProcess;
    },
  };


  /**
   * 画面表示関連Class
   * @constructor
   */
  var DisplayManager = function() {

    // 変数初期化

    /**
     * 画面書き換えのfps
     * @type {Object}
     */
    this.fps = 60;

    /**
     * マーカー表示用
     * @type {Object}
     */
    this.marker = {
      x: 0,
      y: 0,
    };

    /**
     * 攻撃エフェクトのcanvasを追加していく親要素
     * @type {Object}
     */
    this.attackEffect = document.getElementById('attack-effect');

  };
  DisplayManager.prototype = {
    // Class定数定義

    // カメラ画像サイズ
    CAMERA_VIDEO: {
      WIDTH: 160,
      HEIGHT: 120,
    },

    // 攻撃エフェクト関連定義
    ATTACK_EFFECT: {
      DELAY: 150,
      COLOR: '#FFFF00',
    },

    // カラーを利用したエフェクトの定義
    COLOR_EFFECT: {
      damage: {
        COLOR: '#FF0000',
        DELAY: 500,
        FADE_OUT: 500,
      },
    },

    // マスク画像を用いるエフェクトの定義
    MASK_EFFECT: {
      knockout: {
        URL: 'url(./assets/images/damage.gif)',
        DELAY: 10000,
        FADE_OUT: 3000,
      },
    },

    // Class関数定義

    /**
     * 攻撃エフェクトのサイズのリセット(画面回転時などに実行)
     */
    resetCanvasSize: function() {
      this.attackEffect.width = window.innerWidth;
      this.attackEffect.height = window.innerHeight;
    },

    /**
     * システムメッセージを一定時間表示する
     * @param {String} message 表示したいメッセージ
     * @param {String} message 表示したいメッセージ
     */
    showSystemMessage: function(message, ms) {
      this.setSystemMessage(message);
      var messageTimeout = setTimeout(function() {
        this.clearSystemMessage();
      }.bind(this), ms);
    },

    /**
     * システムメッセージを設定する(自動的には消えない)
     * @param {String} message 表示したいメッセージ
     */
    setSystemMessage: function(message) {
      document.getElementById('system-message').innerText = message;
    },

    /**
     * システムメッセージを消去する
     */
    clearSystemMessage: function() {
      this.setSystemMessage('');
    },

    /**
     * 右上のステイタスメーターの値をセットする
     * @param {Number} type 表示したいメッセージ
     * @param {Number} value 表示したいメッセージ
     */
    setMeterValue: function(type, value) {
      document.getElementById(type + '-bar').style.width = value + 'px';
    },

    /**
     * ターゲットマーカー位置をセットする
     * @param {Number} x ターゲットのx座標値
     * @param {Number} y ターゲットのy座標値
     * @param {Boolean} direct
     */
    setTargetPosition: function(x, y) {
      this.marker.x = x;
      this.marker.y = y;
    },

    /**
     * ターゲット位置をリセットする(画面センターに)
     */
    resetTargetPosition: function() {
      // マーカーの座標は元カメラ画像のサイズ160x120の範囲で送られてくる
      this.setTargetPosition(this.CAMERA_VIDEO.WIDTH / 2, this.CAMERA_VIDEO.HEIGHT / 2);
    },

    /**
     * 攻撃エフェクト
     */
    setAttackEffect: function() {
      // 現在時刻を取得
      var nowDate = new Date();
      var beginTime = nowDate.getTime();
      // 時刻データを元にしたユニークなidをつけたcanvas要素を制裁
      var canvasId = "attack-effect-" + beginTime;
      var attackCanvas = document.createElement('canvas');
      attackCanvas.id = canvasId;
      attackCanvas.width = this.attackEffect.width;
      attackCanvas.height = this.attackEffect.height;
      // canvas要素を追加する
      this.attackEffect.appendChild(attackCanvas);
      // canvasのコンテクストを取得
      var canvasContext = attackCanvas.getContext('2d');
      // 目標地点はマーカー位置
      var targetX = attackCanvas.width * (this.marker.x / 160);
      var targetY = attackCanvas.height * (this.marker.y / 120);
      // スタート位置
      var startPositionLX = attackCanvas.width / 4;
      var startPositionRX = attackCanvas.width / 4 * 3;
      var startPositionY = attackCanvas.height;
      var attackEffectCount = 1;
      // 画面書き換えのタイミングに合わせて攻撃エフェクトを描画
      var attackEccectInterval = setInterval(function(){
        var elapsedTime = new Date() - beginTime;
        canvasContext.clearRect(0, 0, attackCanvas.width, attackCanvas.height);
        canvasContext.globalAlpha = 1.0;
        if (elapsedTime >= this.ATTACK_EFFECT.DELAY) {
          this.attackEffect.removeChild(attackCanvas);
          clearInterval(attackEccectInterval);
        } else {
          canvasContext.beginPath();
          var frameRatio = attackEffectCount / (this.fps * this.ATTACK_EFFECT.DELAY / 1000);
          var radius = 60 * (1.0 - frameRatio);
          var shotPositionLX = startPositionLX + (targetX - startPositionLX) * frameRatio
          var shotPositionRX = startPositionRX + (targetX - startPositionRX) * frameRatio
          var shotPositionY = startPositionY + (targetY - startPositionY) * frameRatio
          canvasContext.arc(shotPositionLX, shotPositionY, radius, 2 * Math.PI, false);
          canvasContext.arc(shotPositionRX, shotPositionY, radius, 2 * Math.PI, false);
          canvasContext.fillStyle = 'yellow';
          canvasContext.lineWidth = 10;
          canvasContext.fill();
          canvasContext.closePath();
        }
        attackEffectCount++;
      }.bind(this), 1000 / this.fps);
    },

    /**
     * 画像マスクを用いたエフェクトを有効にする
     * @param {String} effectName
     */
    setMaskEffect: function(effectName) {
      var maskEffect = document.getElementById('mask-effect');
      if (effectName in this.MASK_EFFECT) {
        // エフェクトの設定で指定されたURLの画像に差し替え
        maskEffect.style.backgroundImage = this.MASK_EFFECT[effectName].URL;
        maskEffect.style.opacity = 1.0;
        maskEffect.style.display = 'inline';
        setTimeout(function() {
          // まずはエフェクトの期待する持続時間を待ってからフェードアウト処理を開始する
          var beginTime = new Date() - 0;
          var fadeout = setInterval(function(){
            var elapsedTime = new Date() - beginTime;
            if (elapsedTime >= this.MASK_EFFECT[effectName].FADE_OUT) {
              // 指定された時間が過ぎたら、マスク画像の表示をなくし、インターバルタイマーをクリアする
              maskEffect.style.display = 'none';
              maskEffect.style.opacity = 1.0;
              maskEffect.style.backgroundImage = '#';
              clearInterval(fadeout);
            } else {
              // 時間に応じて不透明度をコントロールする
              maskEffect.style.opacity = 1.0 - (elapsedTime / this.MASK_EFFECT[effectName].FADE_OUT);
            }
          }.bind(this), 1000 / this.fps);
        }.bind(this), this.MASK_EFFECT[effectName].DELAY);
      }
    },

    /**
     * 色のエフェクトを有効にする
     * @param {String} effectName
     */
    setColorEffect: function(effectName) {
      var colorEffect = document.getElementById('color-effect');
      if (effectName in this.COLOR_EFFECT) {
        colorEffect.style.backgroundColor = this.COLOR_EFFECT[effectName].COLOR;
        colorEffect.style.opacity = 1.0;
        colorEffect.style.display = 'inline';
        setTimeout(function() {
          // まずはエフェクトの期待する持続時間を待ってからフェードアウト処理を開始する
          var beginTime = new Date() - 0;
          var fadeout = setInterval(function(){
            var elapsedTime = new Date() - beginTime;
            if (elapsedTime >= this.COLOR_EFFECT[effectName].FADE_OUT) {
              // 指定された時間が過ぎたら、色の表示をなくし、インターバルタイマーをクリアする
              colorEffect.style.display = 'none';
              colorEffect.style.opacity = 1.0;
              colorEffect.style.backgroundColor = '#000000';
              clearInterval(fadeout);
            } else {
              // 時間に応じて不透明度をコントロールする
              colorEffect.style.opacity = 1.0 - (elapsedTime / this.COLOR_EFFECT[effectName].FADE_OUT);
            }
          }.bind(this), 1000 / this.fps);
        }.bind(this), this.COLOR_EFFECT[effectName].DELAY);
      }
    },
  };


  /**
   * ゲーム全体を管理するメインClass
   * @constructor
   */
  var GameManager = function() {

    /**
     * 秒間どのくらいエネルギーチャージするか
     * @type {Number}
     */
    this.rechargePerSecond = 10;

    /**
     * パワーチャージのインターバル処理用
     * @type {Object}
     */
    this.chargeLoop = null;

    /**
     * 画面の回転に対応するかを決定する変数
     * @type {Boolean}
     */
    this.bindOrientationActive = false;

    /**
     * ロボットのゲーム内でのステイタス管理のための変数
     * @type {Object}
     */
    this.myStatus = {
      shield: this.STATUS_MAX_VALUE.SHIELD,
      power: this.STATUS_MAX_VALUE.POWER,
    };

    /**
     * ロボット制御のインスタンスのための変数（ここではまだインスタンスを生成しない）
     * @type {Object}
     */
    this.robot = null;

    /**
     * カメラのインスタンスのための変数（ここではまだインスタンスを生成しない）
     * @type {Object}
     */
    this.camera = null;

    /**
     * ロボット間通信のインスタンスのための変数（ここではまだインスタンスを生成しない）
     * @type {Object}
     */
    this.r2r = null;

    /**
     * ゲームのステイタス管理の変数
     * @type {Object}
     */
    this.gameStatus = {
      active: true,
    };

    /**
     * 画面描画のインスタンスの生成
     * @type {Object}
     */
    this.display = new DisplayManager();

    // 画面の方向変化に対応する
    this.enableBindOrientation_();

    // TODO:なんだこれ
    this.mousedownflag = false; // TODO:変数名

    // 縦スクロールしないようにDocument全体のtouchmoveイベントを無視するよう設定
    document.addEventListener('touchmove', function(e) {
      e.preventDefault();
    });

    /* 画面の回転、表示などに関するイベント処理設定 */
    window.addEventListener('orientationchange', this.orientationchangeHandler_.bind(this));
    window.addEventListener('pageshow', this.pageshowHandler_.bind(this));
    window.addEventListener('pagehide', this.pagehideHandler_.bind(this));
    window.addEventListener('resize', this.resizeHandler_.bind(this));
  };
  GameManager.prototype = {
    // Class定数定義

    // システムメッセージ用
    TEXT: {
      WIN: "YOU WIN!!!",
      LOSE: "YOU LOSE!!!",
      RESET: ""
    },

    // 各種デバイスの制限値 //
    DEVICE: {
      MAX_ROTATION: 60,
      MAX_CAMERA_ROTATION: 30,
      MINUS_CAMERA_ORIGIN: 300,
      CAMERA_ROTATION_DELIMITER: Math.sin(59 * Math.PI / 180),
    },

    // 自機ステイタスの上限値
    STATUS_MAX_VALUE: {
      SHIELD: 150,
      POWER: 150,
    },

    // 攻撃関連パラメータ
    ATTACK: {
      POWER: 20,
      MIN_DAMAGE: 10,
      MIN_DISTANCE: 4,
    },

    // r2rのメッセージタイプ
    R2R_MESSAGE_TYPE: {
      NONE: 0,
      ATTACK: 1,
      WIN: 2,
      RESPAWN: 3,
    },

    // Class関数定義

    /**
     * ロボットやカメラへの接続を試みる
     */
    connectRobots: function() {
      // フォームから接続先を抜き出す
      var robot_ip = document.getElementById('robot-ip').value;
      var enemy_ip = document.getElementById('enemy-ip').value;

      // 自ロボットへの接続
      try{
        this.robot = new RobotController({'ip': robot_ip});

        // ロボット接続のインスタンスのコールバック関数のオーバーライド
        this.robot.onConnected = function(event) {

          // カメラ接続
          this.camera = new Camera({'ip': robot_ip});
          this.camera.listen(this.remoteCallback);
          this.camera.viewMarkerDetect(document.getElementById('camera-image'));
          // ゲームを開始する
          this.robot.startMainLoop();
          this.gameStart();
        }.bind(this);

        // R2R通信接続
        if ((robot_ip === 'dummy') || (enemy_ip === 'dummy')) {
          // デバグモードの場合は接続させない
        } else {
          // 対戦ロボットとのr2r通信の接続
          this.r2r = new BattleR2R({'i': robot_ip, 'you': enemy_ip}, this.r2rRemoteCallback_.bind(this));	// 対戦相手のip
        }

        // ダミー接続の場合、接続した後のイベントが発生しないのでここで強引に起こす。
        if (robot_ip === 'dummy') {
          document.getElementById('camera-image').src = './assets/images/dummy.jpg';
          this.gameStart();
        }
      }
      catch(e) {
        alert('ロボットに接続できませんでした');
      }
    },

    /**
     * ゲーム開始(ロボットなどへの接続開始後)
     */
    gameStart: function() {

      // 接続ダイアログを消す
      document.getElementById('connection-dialog').style.display = 'none';

      // ステイタスメーターの初期化
      this.resetMyStatus_();

      // ゲームUIを表示する
      this.enableGameUI_();

      // 画面の向きの処理
      if (window.orientation === 0) {
        this.display.resetCanvasSize();
      }
      if (this.bindOrientationActive) {
        this.enableBindOrientation_();
      }

      // カメラアングルのリセット
      this.robot.resetCameraAngle();

      // ロボットを初期姿勢にする
      this.robot.activateMotion('lowerhands');
      //this.robot.activateMotion('standup');

      // ゲーム開始メッセージ
      this.display.showSystemMessage('GAME START', 1000);

      // 体力回復を指定たされたrechargePerSecondで回す
      this.chargeLoop = setInterval(this.rechargePower_.bind(this), Math.round(1000 / this.rechargePerSecond));
    },

    // 画面の向きが変わった時に処理を行うように設定する(実際の処理はイベントハンドラ内)
    enableBindOrientation_: function() {
      this.bindOrientationActive = true;
    },

    /**
     * 画面の向きが変わった時に処理を行わないように設定する(実際の処理はイベントハンドラ内)
     */
    disableBindOrientation_: function() {
      this.bindOrientationActive = false;
    },

    // ゲームUIを表示させ、イベントを処理できるようにする
    enableGameUI_: function() {
      // ゲームUIの表示
      document.getElementById('game-ui').style.display = 'inline';

      // コントローラーのためのイベント処理定義
      document.getElementById('game-movement').addEventListener('mousedown', this.movementTouchstartHandler_.bind(this));
      document.getElementById('game-movement').addEventListener('touchstart', this.movementTouchstartHandler_.bind(this));

      document.getElementById('game-movement').addEventListener('mousemove', this.movementTouchmoveHandler_.bind(this));
      document.getElementById('game-movement').addEventListener('touchmove', this.movementTouchmoveHandler_.bind(this));

      document.getElementById('game-movement').addEventListener('mouseup', this.movementTouchendHandler_.bind(this));
      document.getElementById('game-movement').addEventListener('touchend', this.movementTouchendHandler_.bind(this));

      document.getElementById('game-fire').addEventListener('mousedown', this.fireTouchstartHandler_.bind(this));
      document.getElementById('game-fire').addEventListener('touchstart', this.fireTouchstartHandler_.bind(this));
    },

    // 画面の向きが変更になった場合の処理
    orientationchangeHandler_: function(event) {
      this.display.resetCanvasSize();
      this.display.resetTargetPosition();
      this.robot.resetCameraAngle();
    },

    // 画面が(隠された後)表示された場合の処理
    pageshowHandler_: function(event) {
      this.display.resetCanvasSize();
      this.display.resetTargetPosition();
    },

    // 画面が隠された場合の処理
    pagehideHandler_: function(event) {
      if (this.bindOrientationActive) {
        this.unbindOrientation_();
        this.bindOrientation_();
      }
      // 画面が背面に回った時などはメインループを止める
      // TODO: 現在再開する方法は画面のリロード
      //clearInterval(this.timer);
    },

    // 画面サイズが変更になった場合の処理
    resizeHandler_: function(event) {
      if (this.bindOrientationActive) {
        this.unbindOrientation_();
        this.bindOrientation_();
      }
    },

    // デバイスの向き変更イベントを処理へバインドする
    bindOrientation_: function() {
      window.addEventListener('deviceorientation', this.orientationControl_.bind(this));
    },

    // デバイスの向き変更イベントの処理をしないようにする
    unbindOrientation_: function() {
      window.removeEventListener('deviceorientation', this.orientationControl_.bind(this));
    },

    // 移動UIのtouchstartイベントの処理用
    movementTouchstartHandler_: function(event) {
      var elementPosition = document.getElementById('game-movement').getBoundingClientRect();
      var x = 0;
      var y = 0;
      var forward = 0;
      var turnCW = 0;
      var touch = false;
      if (event.type == 'mousedown') {
        y = event.offsetY;
        x = event.offsetX;
      } else {
        y = event.originalEvent.touches[0].pageY - elementPosition.top;
        x = event.originalEvent.touches[0].pageX - elementPosition.left;
        touch = true;
      }
      forward = 99 - Math.round((y / document.getElementById('game-movement').clientHeight) * 200);
      turnCW = Math.round((x / document.getElementById('game-movement').clientWidth) * 200) - 99;

      // ロボットへの歩行指示
      this.robot.setWalkParameters(forward, turnCW, touch);
      this.mousedownflag = true;
    },

    // 移動UIのtouchmoveイベントの処理用
    movementTouchmoveHandler_: function(event) {
      var elementPosition = document.getElementById('game-movement').getBoundingClientRect();
      var x = 0;
      var y = 0;
      var forward = 0;
      var turnCW = 0;
      var touch = false;
      if (event.type == 'mousemove') {
        if (!event.which) {
          return;
        }
        y = event.offsetY;
        x = event.offsetX;
      } else {
        y = event.originalEvent.touches[0].pageY - elementPosition.top;
        x = event.originalEvent.touches[0].pageX - elementPosition.left;
        touch = true;
      }
      forward = 99 - Math.round((y / document.getElementById('game-movement').clientHeight) * 200);
      turnCW = Math.round((x / document.getElementById('game-movement').clientWidth) * 200) - 99;

      this.robot.setWalkParameters(forward, turnCW, touch);
    },

    // 移動UIのtouchendイベントの処理用
    movementTouchendHandler_: function(event) {
      this.robot.stopWalking();
      this.mousedownflag = false;
      if (event.type == 'mouseup') {
        if (this.mousedownflag) {
          this.robot.stopWalking();
          this.mousedownflag = false;
        }
      }
    },

    // 攻撃UIのtouchstartイベントの処理用
    fireTouchstartHandler_: function(event) {
      this.attack_();
    },

    // 画面の向きの変更時の処理
    orientationControl_: function(event) {
      // TODO: どうするか考えよう(パワーダウン時は画面ローテーション処理しない)
      if (this.isPowerDown_()) {
        return;
      }

      // 加速度が取れる場合は加速度のalpha値を使う（取れない時は0）
      var px = null;
      if (typeof event.originalEvent !== 'undefined') {
        px = event.originalEvent.alpha;
      } else {
        px = 0;
      }

      // カメラの回転を計算し、ロボットに渡す。
      if ((px > this.DEVICE.MAX_ROTATION) && (px <= 180)) {
        px = this.DEVICE.MAX_ROTATION;
      } else if ((px > 180) && (px < this.DEVICE.MINUS_CAMERA_ORIGIN)) {
        px = this.DEVICE.MINUS_CAMERA_ORIGIN;
      }
      px = (Math.sin(px * Math.PI / 180) / (this.DEVICE.CAMERA_ROTATION_DELIMITER));
      if (this.robot !== null) {
        this.robot.setCameraAngle(-Math.floor(this.DEVICE.MAX_CAMERA_ROTATION * px));
      }
    },

    // パワーダウン(負け)かどうか確認する
    isPowerDown_: function() {
      return !this.gameStatus.active;
    },

    // 負けた後の復活の処理
    respawn_: function() {
      this.display.showSystemMessage(this.TEXT.RESET_MSG, 1000);
      this.sendMessage_(this.R2R_MESSAGE_TYPE.RESPAWN);
      this.gameStatus.active = true;
      this.resetMyStatus_();
      this.robot.activateMotion('lowerhands');
      this.robot.activateMotion('standup');
    },

    // ステイタスの変更
    setMyStatus_: function(type, value) {
      this.myStatus[type] = value;
      this.display.setMeterValue(type, value);
    },

    // ステイタスの初期化
    resetMyStatus_: function() {
      this.setMyStatus_('power', this.STATUS_MAX_VALUE.POWER);
      this.setMyStatus_('shield', this.STATUS_MAX_VALUE.SHIELD);
    },

    // r2r通信でメッセージを受け取った時のコールバック処理
    r2rRemoteCallback_: function(message) {
      if (this.isPowerDown_()) {
        return;
      }

      if ('marker' in message) {
        var marker = message.marker;
        if (marker) {
          this.display.setTargetPosition(marker.x, marker.y);
        }
      }
      if ('r2r' in message) {
        var r2rMessage = message.r2r;
        if (r2rMessage) {
          var attack = r2rMessage.attack;
          if (attack) {
            var type = attack.type;
            var data = attack.data;
            var markerAttack = attack.marker;

            switch (type) {
              case this.R2R_MESSAGE_TYPE.ATTACK:
                if (markerAttack) {
                  if (this.ATTACK.MIN_DISTANCE <= markerAttack.distance) {
                    this.recieveAttack_();
                  }
                }
                break;
              case this.R2R_MESSAGE_TYPE.WIN:
                this.display.setSystemMessage(this.TEXT.WIN);
                break;
              case this.R2R_MESSAGE_TYPE.RESPAWN:
                this.display.showSystemMessage(this.TEXT.RESET, 1000);
                break;
            }
          }
        }
      }
    },

    // 攻撃処理
    attack_: function() {
      var power = this.myStatus.power - this.ATTACK.POWER;
      if (power > 0) {
        // 攻撃できるだけのパワーがあれば、攻撃処理を行う
        this.sendMessage_(this.R2R_MESSAGE_TYPE.ATTACK);
        this.setMyStatus_('power', power);
        this.display.setAttackEffect();
        //this.display.activateEffect(this.display.EFFECT_TYPE.ATTACK);
        this.robot.activateMotion('attack');
      }
    },

    // r2r通信でメッセージを相手に送る
    sendMessage_: function(type) {
      var message = {'attack': {'type': 0, 'data': 0}};
      switch (type) {
        case this.R2R_MESSAGE_TYPE.ATTACK:
          message.attack.type = this.R2R_MESSAGE_TYPE.ATTACK;
          break;
        case this.R2R_MESSAGE_TYPE.WIN:
          message.attack.type = this.R2R_MESSAGE_TYPE.WIN;
          break;
        case this.R2R_MESSAGE_TYPE.RESPAWN:
          message.attack.type = this.R2R_MESSAGE_TYPE.RESPAWN;
          break;
      }
      if (this.r2r !== null) {
        this.r2r.send(message);
      }
    },

    // 攻撃を受けた時の処理
    recieveAttack_: function() {
      var damage = Math.floor(this.ATTACK.POWER * (1 - this.myStatus.power / this.STATUS_MAX_VALUE.POWER)) + this.ATTACK.MIN_DAMAGE;
      this.setMyStatus_('shield', this.myStatus.shield - damage);
      if (this.myStatus.shield <= 0) {
        this.gameStatus.active = false;
        this.robot.stopWalking();
        this.robot.activateMotion('crouch');
        this.sendMessage_(this.R2R_MESSAGE_TYPE.WIN);
        this.setMyStatus_('shield', 0);
        this.display.setMaskEffect('knockout');
        this.display.setSystemMessage(this.TEXT.LOSE);
        setTimeout(function() {
          this.respawn_();
        }.bind(this), 13000);
      } else {
        //this.display.setColorEffect('damage');
      }
    },

    // 体力回復
    rechargePower_: function() {
      if (this.isPowerDown_()) {
        return;
      }
      var power = this.myStatus.power + 1;
      if (power > this.STATUS_MAX_VALUE.POWER) {
        power = this.STATUS_MAX_VALUE.POWER;
      } else {
        this.setMyStatus_('power', power);
      }
    }

  };

  /* デバグ用class */
  var Debug = function() {
    this.enable = true;
    $('#debug-reload').on('click', reloadpage);
  };
  Debug.prototype = {
    reloadpage: function() {
      location.reload(true);
    },
    print: function(txt) {
      $('#debug-print').text(txt);
    },
  };

  /* 各種処理メソッド用class */
  var Utility = function() {
  };
  Utility.prototype = {
    getUrlVars: function() {
      var vars = [], max = 0, hash = "", array = "";
      var url = window.location.search;

      //?を取り除くため、1から始める。複数のクエリ文字列に対応するため、&で区切る
      hash = url.slice(1).split('&');
      max = hash.length;
      for (var i = 0; i < max; i++) {
        array = hash[i].split('=');    //keyと値に分割。
        vars.push(array[0]);    //末尾にクエリ文字列のkeyを挿入。
        vars[array[0]] = array[1];    //先ほど確保したkeyに、値を代入。
      }
      return vars;
    }
  };


  /* 処理部 */
  window.onload = function() {

    // 念のため、ゲームUI接続ダイアログを隠す
    document.getElementById('game-ui').style.display = 'none';
    document.getElementById('connection-dialog').style.display = 'none';

    // 便利な関数群を管理しているClassのインスタンス生成
    var utility = new Utility();

    // クエリパラメータ処理
    var query_parameter = utility.getUrlVars();

    // 引数にIPアドレスなどの指定があればそれを利用する、なければ現在のサイトのURLから取得
    if ('robotip' in query_parameter) {
      document.getElementById('robot-ip').value = query_parameter.robotip;
    } else {
      document.getElementById('robot-ip').value = location.hostname;
    }
    if ('enemyip' in query_parameter) {
      document.getElementById('enemy-ip').value = query_parameter.enemyip;
    } else {
      document.getElementById('enemy-ip').value = document.getElementById('robot-ip').value;
    }
    // 接続ダイアログの表示
    document.getElementById('connection-dialog').style.display = 'inline';

    // ゲームマネージャのインスタンス生成
    var game = new GameManager();

    // connectボタンの有効化
    document.getElementById('connect-button').addEventListener('click', game.connectRobots.bind(game), false);
  };

}());
