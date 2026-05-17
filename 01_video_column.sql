-- ===========================================================
-- CHEZSUA · video_url 컬럼 보장 (idempotent)
-- 룩북에 YouTube URL이나 비디오 파일 URL을 저장할 컬럼
-- ===========================================================

ALTER TABLE public.lookbooks
  ADD COLUMN IF NOT EXISTS video_url TEXT,
  ADD COLUMN IF NOT EXISTS is_video BOOLEAN DEFAULT FALSE;

-- 인덱스 (영상이 있는 룩북 빠르게 찾기)
CREATE INDEX IF NOT EXISTS idx_lookbooks_is_video 
  ON public.lookbooks(is_video) 
  WHERE is_video = TRUE;
