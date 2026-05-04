import styles from './AvatarPanel.module.css'

const STATUS_MAP = {
  idle:       { label: '대기 중',   dot: 'gray'  },
  connecting: { label: '연결 중…', dot: 'yellow' },
  connected:  { label: '연결됨',   dot: 'green' },
  speaking:   { label: '말하는 중', dot: 'blue'  },
}

const VISUALIZER_BARS = Array.from({ length: 120 }, (_, index) => {
  const wave = Math.sin(index * 0.39) + Math.cos(index * 0.21) + Math.sin(index * 0.11)
  const height = 8 + Math.round(Math.abs(wave) * 13) + (index % 15 === 0 ? 12 : 0)
  return { index, height }
})

export default function AvatarPanel({
  status,
  mode,
  onModeChange,
  videoRef,
  userVideoRef,
  videoReady,
  cameraActive,
  onStart,
  onStop,
  onInterrupt
}) {
  const mappedStatus = STATUS_MAP[status] || STATUS_MAP.idle
  const label = mode === 'ttt' && status === 'connected' ? '텍스트 대화' : mappedStatus.label
  const dot = mappedStatus.dot
  const showAvatarVideo = mode === 'ftf'
  const showVoiceOnly = mode === 'sts'
  const showTextOnly = mode === 'ttt'
  const avatarEnabled = mode === 'ftf'
  const micEnabled = mode !== 'ttt'
  const startLabel = '대화 시작'
  const stageClass = [
    styles.mediaStage,
    mode === 'ftf' ? styles.sideBySide : '',
    mode === 'sts' ? styles.voiceStage : '',
    mode === 'ttt' ? styles.textStage : ''
  ].filter(Boolean).join(' ')

  return (
    <div className={styles.panel}>
      <div className={stageClass}>
        {!showAvatarVideo && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className={styles.hiddenMedia}
          />
        )}

        {showAvatarVideo && (
          <div className={styles.videoWrap}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className={styles.video}
              style={{ opacity: videoReady ? 1 : 0 }}
            />
            {!videoReady && (
              <div className={styles.placeholder}>
                <div className={styles.avatarIcon}>
                  <span>교수</span>
                </div>
                <p className={styles.placeholderText}>박대근 교수</p>
                <p className={styles.placeholderSub}>차의과학대학교 신입생 담임교수</p>
              </div>
            )}

            {videoReady && (
              <div className={styles.nameplate}>
                <div className={styles.nameplateInner}>
                  <span className={styles.nameplateName}>박대근 교수</span>
                  <span className={styles.nameplateSub}>차의과학대학교 신입생 담임교수</span>
                </div>
              </div>
            )}

            {status === 'speaking' && <div className={styles.speakGlow} />}
          </div>
        )}

        {showVoiceOnly && (
          <div className={`${styles.voicePanel} ${status === 'speaking' ? styles.voiceSpeaking : ''}`}>
            <div className={styles.circularVisualizer} aria-hidden="true">
              {VISUALIZER_BARS.map(({ index, height }) => (
                <span
                  key={index}
                  className={styles.visualizerBar}
                  style={{
                    '--angle': `${index * (360 / VISUALIZER_BARS.length)}deg`,
                    '--bar-height': `${height}px`,
                    '--delay': `${index * -0.035}s`
                  }}
                />
              ))}
            </div>
            <p className={styles.placeholderText}>음성 대화</p>
            <p className={styles.placeholderSub}>영상 없이 교수님 목소리로 상담</p>
          </div>
        )}

        {showTextOnly && (
          <div className={styles.textPanel}>
            <div className={styles.textBadge}>TTT</div>
            <p className={styles.placeholderText}>텍스트 대화</p>
            <p className={styles.placeholderSub}>마이크와 아바타 없이 Gemma4 상담</p>
          </div>
        )}

        {mode === 'ftf' && (
          <div className={`${styles.cameraPreview} ${cameraActive ? styles.cameraOn : ''}`}>
            <video
              ref={userVideoRef}
              autoPlay
              muted
              playsInline
              className={styles.cameraVideo}
              style={{ opacity: cameraActive ? 1 : 0 }}
            />
            {!cameraActive && (
              <div className={styles.cameraPlaceholder}>
                <span>CAM</span>
                <small>사용자 캠</small>
              </div>
            )}
          </div>
        )}
      </div>

      <div className={styles.modeSwitch} role="group" aria-label="상담 기능 설정">
        {[
          {
            key: 'avatar',
            label: '아바타',
            sub: avatarEnabled ? '켜짐' : '꺼짐',
            pressed: avatarEnabled,
            disabled: status === 'connecting',
            onClick: () => onModeChange?.(avatarEnabled ? 'sts' : 'ftf')
          },
          {
            key: 'mic',
            label: '마이크',
            sub: micEnabled ? '켜짐' : '꺼짐',
            pressed: micEnabled,
            disabled: status === 'connecting',
            onClick: () => onModeChange?.(micEnabled ? 'ttt' : 'ftf')
          }
        ].map(option => (
          <button
            key={option.key}
            type="button"
            className={`${styles.modeBtn} ${option.pressed ? styles.modeBtnActive : ''}`}
            onClick={option.onClick}
            disabled={option.disabled}
            aria-pressed={option.pressed}
            title={`${option.label} ${option.sub}`}
          >
            <span className={styles.modeLabel}>{option.label}</span>
            <span className={styles.modeSub}>{option.sub}</span>
          </button>
        ))}
      </div>

      {/* 상태 배지 */}
      {status === 'speaking' ? (
        <button className={styles.interruptBtn} onClick={onInterrupt} type="button" aria-label="말 멈추기">
          <span className={`${styles.dot} ${styles[dot]}`} />
          <span className={styles.pauseIcon}>||</span>
          <span className={styles.statusLabel}>말 멈추기</span>
        </button>
      ) : (
        <div className={styles.statusRow}>
          <span className={`${styles.dot} ${styles[dot]}`} />
          <span className={styles.statusLabel}>{label}</span>
        </div>
      )}

      {/* 시작 버튼 */}
      {status === 'idle' && (
        <button className={styles.startBtn} onClick={onStart}>
          <span className={styles.startBtnIcon}>▶</span>
          {startLabel}
        </button>
      )}
      {status === 'connecting' && (
        <button className={styles.startBtn} disabled>
          <span className={styles.spinner} /> 연결 중…
        </button>
      )}
      {(status === 'connected' || status === 'speaking') && (
        <button
          className={styles.stopBtn}
          onClick={() => {
            if (window.confirm('대화를 종료할까요? 채팅 기록은 초기화돼요.')) onStop?.()
          }}
        >
          <span className={styles.startBtnIcon}>■</span>
          대화 종료
        </button>
      )}
    </div>
  )
}
