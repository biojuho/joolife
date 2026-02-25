-- 원자적 스트릭 업데이트 RPC 함수
-- 레이스 컨디션 방지: read-compute-write를 단일 트랜잭션으로 처리
CREATE OR REPLACE FUNCTION increment_streak(
  p_user_id UUID,
  p_yesterday_date DATE
)
RETURNS VOID AS $$
DECLARE
  v_has_yesterday BOOLEAN;
  v_current_streak INT;
  v_longest_streak INT;
  v_total INT;
BEGIN
  -- 어제 작성한 엔트리가 있는지 확인
  SELECT EXISTS(
    SELECT 1 FROM journal_entries
    WHERE user_id = p_user_id
      AND entry_date = p_yesterday_date
      AND user_answer <> ''
  ) INTO v_has_yesterday;

  -- 현재 프로필 조회
  SELECT streak_count, longest_streak, total_entries
  INTO v_current_streak, v_longest_streak, v_total
  FROM profiles
  WHERE id = p_user_id
  FOR UPDATE; -- 행 잠금으로 동시 업데이트 방지

  -- 스트릭 계산
  IF v_has_yesterday THEN
    v_current_streak := v_current_streak + 1;
  ELSE
    v_current_streak := 1;
  END IF;

  -- longest streak 갱신
  IF v_current_streak > v_longest_streak THEN
    v_longest_streak := v_current_streak;
  END IF;

  -- 프로필 업데이트
  UPDATE profiles
  SET streak_count = v_current_streak,
      longest_streak = v_longest_streak,
      total_entries = v_total + 1,
      updated_at = NOW()
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
