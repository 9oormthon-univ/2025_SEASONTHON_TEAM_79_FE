// src/user/HomeDetailPage/MyHomeDetailPage.jsx
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import styled from "styled-components";
import { NavLink, useParams, useLocation, useNavigate } from "react-router-dom";

/* ── 디자인 토큰 ── */
const C = { bg:"#F6F8FB", card:"#FFFFFF", line:"#E7EDF5", soft:"#F3F6FA", text:"#0F172A", sub:"#6B7280", blue:"#4C8DFF", star:"#3B82F6" };
const R = { img:14, card:14, pill:999 };
const S = { headerH:56, padX:16, bottomPad:96 };

/* ── 유틸 ── */
const toNum = (v) => (typeof v === "number" ? v : (Number.isFinite(Number(v)) ? Number(v) : undefined));
const comma = (n) => (typeof n === "number" ? n.toLocaleString() : undefined);
const won = (n) => (typeof n === "number" ? comma(n) : undefined);
const fmtPriceText = (deposit, monthly) => {
  const d = won(deposit); const m = won(monthly);
  if (d && m) return `월세 ${d}/${m}`;
  if (d) return `보증금 ${d}`;
  if (m) return `월세 ?/${m}`;
  return "가격 정보 없음";
};
const fmtSpecText = (sqm, mFee) => {
  const a = typeof sqm === "number" ? `${sqm}㎡` : null;
  const b = typeof mFee === "number" ? `관리비 ${won(mFee)}만원` : null;
  return a && b ? `${a} · ${b}` : a || b || "정보 없음";
};
const timeMMSS = (sec) => { const s = Math.max(0, Math.floor(sec || 0)); const mm = Math.floor(s/60); const ss = String(s%60).padStart(2,"0"); return `${mm}:${ss}`; };

/* ── 라벨 ── */
const SCORE_LABELS = { mining:"채광 및 전망", water:"수압 및 배수", cleanliness:"청결 및 곰팡이", options:"옵션 및 구조", security:"보안 및 시설", noise:"소음", surroundings:"주변 환경", recycling:"분리수거" };

/* ── API 경로 ── (Vite dev 프록시 사용: 반드시 /api 상대경로) */
const withApi = (p) => (p.startsWith("/") ? p : `/${p}`);

/* ── 토큰 ── */
const getTokenRaw = () => {
  try {
    let t = (localStorage.getItem("token") || localStorage.getItem("auth_token") || "").trim();
    if (/^Bearer\s+/i.test(t)) t = t.replace(/^Bearer\s+/i, "").trim();
    return t;
  } catch { return ""; }
};

/* ── Authorization 헤더(단일 정의) ── */
const buildAuthHeaders = () => {
  const t = getTokenRaw();
  if (!t) throw new Error("인증 토큰이 없습니다. localStorage.setItem('token', '<JWT>')로 저장하세요.");
  const h = new Headers();
  h.set("Accept", "application/json");
  h.set("Authorization", `Bearer ${t}`);
  return h;
};

function useAuthedSrc(src) {
  const [out, setOut] = useState("");

  useEffect(() => {
    let revoke;
    (async () => {
      try {
        if (!src) { setOut(""); return; }
        if (/^(data:|blob:)/i.test(src)) { setOut(src); return; }
        if (/^https?:/i.test(src) && !/\/api\//.test(src)) { setOut(src); return; }

        const url = src.startsWith("/") ? src : `/${src}`;
        const headers = buildAuthHeaders(); // 필요 시 throw
        const res = await fetch(url, { method: "GET", headers, credentials: "omit" });

        if (!res.ok) { setOut(""); return; }

        const blob = await res.blob();
        const u = URL.createObjectURL(blob);
        setOut(u);
        revoke = () => URL.revokeObjectURL(u);
      } catch (err) {
        // 토큰 없음/네트워크 실패 등 → 표시값만 비움
        console.debug("[useAuthedSrc] failed:", err);
        setOut("");
      }
    })();

    return () => {
      try { revoke && revoke(); } catch (err) {
        console.debug("[useAuthedSrc] revoke failed:", err);
      }
    };
  }, [src]);

  return out;
}

/* ── 서버 응답 정규화 ── */
function normalizeChecklist(raw) {
  if (!raw || typeof raw !== "object") return null;

  const items = { ...(raw.items || {}) };
  [
    "monthly","deposit","maintenanceFee","floorAreaSqm",
    "mining","water","cleanliness","options","security","noise","surroundings","recycling"
  ].forEach((k) => { if (k in items) items[k] = toNum(items[k]); });

  let avgScore = toNum(raw.avgScore);
  if (typeof avgScore !== "number") {
    const keys = ["mining","water","cleanliness","options","security","noise","surroundings","recycling"];
    const vals = keys.map(k => toNum(items[k])).filter((n) => typeof n === "number");
    avgScore = vals.length ? vals.reduce((a,b)=>a+b,0) / vals.length : undefined;
  }

  const photos = Array.isArray(raw.photos)
    ? raw.photos.map(p => ({ ...p, rawUrl: p?.rawUrl || p?.url || "" }))
    : undefined;

  const vn = raw.voiceNote || {};
  const voiceNoteRawUrl = vn.rawUrl || raw.voiceUrl || items.voicenote || items.voiceNote || "";

  const voiceNote = voiceNoteRawUrl
    ? {
        rawUrl: voiceNoteRawUrl,
        filename: vn.filename,
        contentType: vn.contentType,
        size: toNum(vn.size),
        durationSec: toNum(vn.durationSec),
        transcript: vn.transcript,
        summary: vn.summary,
        createdAt: vn.createdAt,
        updatedAt: vn.updatedAt,
      }
    : undefined;

  return {
    checkId: raw.checkId ?? raw.id,
    userId: raw.userId,
    title: raw.title || items.name,
    notes: raw.notes || items.memo,
    items,
    avgScore,
    photos,
    voiceNote,
    imageUrl: raw.imageUrl || "",
  };
}

/* ── 여러 AbortSignal 합치기 ── */
class AbortSignalAny {
  static from(signals = []) {
    const c = new AbortController();
    const onAbort = () => c.abort();
    for (const s of signals) s?.addEventListener?.("abort", onAbort, { once: true });
    return c.signal;
  }
}

/** GET /api/checklists/{checkId} (15s timeout) */
async function fetchChecklistById({ checkId, signal }) {
  const url = withApi(`/api/checklists/${encodeURIComponent(checkId)}`);

  const timeoutAC = new AbortController();
  const timeoutId = setTimeout(() => timeoutAC.abort(), 15000);
  const combinedSignal = signal
    ? AbortSignalAny.from([signal, timeoutAC.signal])
    : timeoutAC.signal;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: buildAuthHeaders(),
      credentials: "omit",
      signal: combinedSignal,
      cache: "no-store",
    });

    if (res.ok) {
      const json = await res.json();
      return normalizeChecklist(json);
    }
    if (res.status === 401) throw new Error("로그인이 필요합니다. (401)");
    if (res.status === 403) throw new Error("접근 권한이 없습니다. (403)");
    if (res.status === 404) throw new Error("해당 체크리스트를 찾을 수 없습니다. (404)");
    throw new Error(`조회 실패 (HTTP ${res.status})`);
  } finally {
    clearTimeout(timeoutId);
  }
}

/** GET /api/checklists/{checkId}/audio → 오디오 메타 */
async function fetchChecklistAudio({ checkId, signal }) {
  const url = withApi(`/api/checklists/${encodeURIComponent(checkId)}/audio`);
  const headers = buildAuthHeaders();
  try {
    const res = await fetch(url, {
      method: "GET",
      headers,
      credentials: "omit",
      signal,
      cache: "no-store",
    });
    if (!res.ok) {
      if (res.status === 404) return null; // 녹음 없을 수 있음
      if (res.status === 401) throw new Error("로그인이 필요합니다. (401)");
      if (res.status === 403) throw new Error("오디오 접근 권한이 없습니다. (403)");
      throw new Error(`오디오 조회 실패 (HTTP ${res.status})`);
    }
    const json = await res.json();
    return json && typeof json === "object" ? json : null;
  } catch {
    return null;
  }
}

export default function MyHomeDetailPage() {
  const params = useParams();
  const id = params?.id;
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [data, setData] = useState(null);
  const [audioMeta, setAudioMeta] = useState(null);

  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);

  const load = useCallback(async (signal) => {
    if (!id) { setLoading(false); setErrorMsg("유효한 checkId가 없습니다."); return; }

    try {
      setLoading(true); setErrorMsg("");

      // 1) 라우트 state 사용 (있으면 우선 보여주고)
      const maybe = state?.item;
      if (maybe && String(maybe?.id ?? maybe?.checkId) === String(id)) {
        const normalizedFromState = normalizeChecklist({
          ...maybe,
          checkId: maybe.checkId ?? maybe.id,
          userId: maybe.userId ?? maybe?.items?.userId,
        });
        if (normalizedFromState) setData(normalizedFromState);
      }

      // 2) 서버 조회(덮어씀)
      try {
        const normalized = await fetchChecklistById({ checkId: id, signal });
        if (normalized) setData(normalized);
      } catch (e) {
        if (!state?.item) throw e;
      }

      // 3) 오디오 메타
      const meta = await fetchChecklistAudio({ checkId: id, signal });
      setAudioMeta(meta);
    } catch (e) {
      if (!signal?.aborted) setErrorMsg(String(e?.message || "데이터를 불러오지 못했습니다."));
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [id, state?.item]);

  useEffect(() => {
    const ac = new AbortController();
    load(ac.signal);
    return () => ac.abort();
  }, [id, location.key, load]);

  useEffect(() => {
    const doReload = () => { const ac = new AbortController(); load(ac.signal); };
    const onPageShow = (e) => { if (e.persisted) doReload(); };
    const onVisible = () => { if (document.visibilityState === "visible") doReload(); };
    window.addEventListener("pageshow", onPageShow);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("pageshow", onPageShow);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [load]);

  /* 파생 표시값 */
  const DEFAULT_PHOTO = "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=1600&auto=format&fit=crop";
  const stub = (state?.item && String(state.item.id ?? state.item.checkId) === String(id)) ? state.item : null;

  const rawPhoto = (data?.photos?.[0]?.rawUrl || data?.imageUrl || stub?.image || "") || DEFAULT_PHOTO;
  const photo = useAuthedSrc(rawPhoto);

  const items = data?.items || {};
  const name = items.name || data?.title || stub?.title || "—";
  const address = items.address || stub?.addr || "—";
  const priceText = fmtPriceText(items.deposit, items.monthly) || stub?.deal || "—";
  const specText = fmtSpecText(items.floorAreaSqm, items.maintenanceFee);
  const avgText = typeof data?.avgScore === "number" ? data.avgScore.toFixed(1) : (stub?.rating?.toFixed?.(1) ?? "—");

  const flags = { elevator: items.elevator === true, pet: items.pet === true };

  const pickNum = (...c) => { for (const x of c) { const v = toNum(x); if (typeof v === "number") return v; } };

  const left = [
    { key: "mining", label: SCORE_LABELS.mining, score: pickNum(items.mining, items.lighting, items.sunlight) },
    { key: "water", label: SCORE_LABELS.water, score: pickNum(items.water, items.waterPressure) },
    { key: "cleanliness", label: SCORE_LABELS.cleanliness, score: pickNum(items.cleanliness, items.clean) },
    { key: "options", label: SCORE_LABELS.options, score: pickNum(items.options, items.option) },
    { key: "security", label: SCORE_LABELS.security, score: pickNum(items.security, items.safe, items.safety) },
  ];
  const right = [
    { key: "noise", label: SCORE_LABELS.noise, score: pickNum(items.noise, items.sound) },
    { key: "surroundings", label: SCORE_LABELS.surroundings, score: pickNum(items.surroundings, items.env, items.environment) },
    { key: "recycling", label: SCORE_LABELS.recycling, score: pickNum(items.recycling, items.recycle) },
  ];

  const memoCombined = useMemo(() => [data?.notes, items.memo].filter(Boolean).join("\n\n"), [data?.notes, items.memo]);

  /* 오디오 주소 우선순위: /audio 응답 → checklist 내 voiceNote → 기타 */
  const audioRawUrl =
    audioMeta?.rawUrl ||
    data?.voiceNote?.rawUrl ||
    data?.voiceUrl ||
    items.voiceNote ||
    items.voicenote ||
    "";

  const audioSrc = useAuthedSrc(audioRawUrl);

  useEffect(() => {
    const a = audioRef.current; if (!a) return;
    const onLoaded = () => setDur(a.duration || 0);
    const onTime = () => setCur(a.currentTime || 0);
    a.addEventListener("loadedmetadata", onLoaded);
    a.addEventListener("timeupdate", onTime);
    return () => { a.removeEventListener("loadedmetadata", onLoaded); a.removeEventListener("timeupdate", onTime); };
  }, [audioSrc]);

  const togglePlay = () => { const a = audioRef.current; if (!a) return; if (a.paused) { a.play().catch(()=>{}); setPlaying(true); } else { a.pause(); setPlaying(false); } };
  const seek = (v) => { const a = audioRef.current; if (!a) return; a.currentTime = Math.max(0, Math.min(dur || 0, v)); };
  const jump = (d) => seek((audioRef.current?.currentTime || 0) + d);

  /* ── 가드 분기 ── */
  if (loading) {
    return (
      <Wrap>
        <TopBar>
          <IconBtn aria-label="back" onClick={() => navigate(-1)}><ChevronLeft/></IconBtn>
          <Title>상세보기</Title>
          <IconBtn aria-hidden />
        </TopBar>

        <Section>
          <HeroBox style={{ opacity:.6 }}><SkeletonHero /></HeroBox>
        </Section>
        <Card><div>불러오는 중...</div></Card>
      </Wrap>
    );
  }

  if (errorMsg) {
    return (
      <Wrap>
        <TopBar>
          <IconBtn aria-label="back" onClick={() => navigate(-1)}><ChevronLeft/></IconBtn>
          <Title>상세보기</Title>
          <IconBtn aria-hidden />
        </TopBar>

        <Section><HeroBox><Hero src={DEFAULT_PHOTO} alt="-" /></HeroBox></Section>
        <Card><ErrorBox role="alert">오류: {errorMsg}</ErrorBox></Card>
      </Wrap>
    );
  }

  /* ── 정상 렌더 ── */
  return (
    <Wrap>
      <TopBar>
        <IconBtn aria-label="back" onClick={() => navigate(-1)}><ChevronLeft/></IconBtn>
        <Title>상세보기</Title>
        <IconBtn aria-hidden />
      </TopBar>

      <Section>
        <HeroBox><Hero src={photo || DEFAULT_PHOTO} alt={name} /></HeroBox>
      </Section>

      <Tabs>
        <TabLink to={`/myhomedetailpage/${id ?? ""}`} end>상세보기</TabLink>
        <TabLink
          to={`/myleasechecklistpage/${id ?? ""}`}
          state={{ item:{ id, title:name, addr:address, image:photo, deal:priceText } }}
        >
          집 계약 체크리스트
        </TabLink>
      </Tabs>

      <Card>
        <HeadRow>
          <HeadLeft>
            <HeadPrice>{priceText}</HeadPrice>
            <HeadSub>{specText}</HeadSub>
            <HeadName>{name}</HeadName>
            <HeadAddr>{address}</HeadAddr>
          </HeadLeft>
          <HeadRight><Avg><StarIcon/> 평균 {avgText}점</Avg></HeadRight>
        </HeadRow>
      </Card>

      <BlockTitle>체크리스트</BlockTitle>
      <Columns>
        <ColCard>
          {left.map(r => (
            <Row key={r.key}><RowKey>{r.label}</RowKey><RowVal $blue>{typeof r.score==="number"?`${r.score}점`:"—"}</RowVal></Row>
          ))}
        </ColCard>
        <ColCard>
          {right.map(r => (
            <Row key={r.key}><RowKey>{r.label}</RowKey><RowVal $blue>{typeof r.score==="number"?`${r.score}점`:"—"}</RowVal></Row>
          ))}
          <Row><RowKey>엘리베이터</RowKey><RowVal $blue>{flags.elevator?"O":"X"}</RowVal></Row>
          <Row><RowKey>반려동물</RowKey><RowVal $blue>{flags.pet?"O":"X"}</RowVal></Row>
        </ColCard>
      </Columns>

      <BlockTitle>메모</BlockTitle>
      <Card><CardBody>{memoCombined ? <MemoText>{memoCombined}</MemoText> : <Muted>작성한 메모가 없습니다.</Muted>}</CardBody></Card>

      <BlockTitle>녹음 파일</BlockTitle>
      <AudioCard>
        {audioSrc ? (
          <>
            <AudioBar>
              <Time>{timeMMSS(cur)}</Time>
              <Slider type="range" min={0} max={dur || 0} step="1" value={cur} onChange={(e)=>seek(Number(e.target.value))}/>
              <Time>{timeMMSS(dur)}</Time>
            </AudioBar>
            <Controls>
              <RoundBtn onClick={()=>jump(-15)} title="15초 되감기"><Back15/></RoundBtn>
              <PlayBtn onClick={togglePlay} title={playing?"일시정지":"재생"}>{playing?<PauseIcon/>:<PlayIcon/>}</PlayBtn>
              <RoundBtn onClick={()=>jump(15)} title="15초 앞으로"><Fwd15/></RoundBtn>
            </Controls>
            <audio ref={audioRef} src={audioSrc} preload="metadata" />
          </>
        ) : <Muted>녹음 파일이 없습니다.</Muted>}
      </AudioCard>

      <BottomSpacer />
    </Wrap>
  );
}

/* ── styled-components ── */
const Wrap = styled.div`min-height:100dvh;background:${C.bg};color:${C.text};padding-bottom:calc(${S.bottomPad}px + env(safe-area-inset-bottom));`;
const BottomSpacer = styled.div`height:8px;`;

const TopBar = styled.header`
  position:sticky;top:0;z-index:10;height:${S.headerH}px;
  display:grid;grid-template-columns:56px 1fr 56px;align-items:center;
  border-bottom:1px solid ${C.line};background:${C.card};
`;
const Title = styled.div`justify-self:center;font-weight:800;`;
const IconBtn = styled.button`border:0;background:transparent;height:100%;display:grid;place-items:center;cursor:pointer;`;

const Section = styled.div`padding:12px ${S.padX}px 0;`;
const HeroBox = styled.div`border:1px solid ${C.line};border-radius:${R.img}px;overflow:hidden;background:${C.card};box-shadow:0 6px 18px rgba(0,0,0,.06);`;
const Hero = styled.img`width:100%;aspect-ratio:16/10;object-fit:cover;display:block;`;

const Tabs = styled.nav`display:grid;grid-template-columns:1fr 1fr;padding:0 ${S.padX}px;background:${C.bg};margin-top:8px;`;
const TabLink = styled(NavLink)`
  position:relative;display:flex;justify-content:center;align-items:center;height:44px;font-weight:800;color:${C.sub};text-decoration:none!important;
  &::after{content:"";position:absolute;left:50%;bottom:-2px;transform:translateX(-50%) scaleX(0);transform-origin:center;width:88%;height:2px;background:${C.blue};border-radius:2px;transition:transform .18s ease;}
  &.active,&[aria-current="page"]{color:${C.blue};}
  &.active::after,&[aria-current="page"]::after{transform:translateX(-50%) scaleX(1);}
`;

const Card = styled.section`position:relative;margin:12px ${S.padX}px;padding:14px;background:${C.card};border:1px solid ${C.line};border-radius:${R.card}px;box-shadow:0 6px 18px rgba(0,0,0,.05);`;
const CardBody = styled.div`padding:6px 2px;`;

const ErrorBox = styled.div`
  margin:8px 0;padding:10px 12px;border:1px solid #fecaca;background:#fff1f2;color:#b91c1c;border-radius:10px;font-size:13px;
`;

const SkeletonHero = styled.div`
  width:100%;aspect-ratio:16/10;
  background-image:linear-gradient(90deg, ${C.soft}, #eaeef5, ${C.soft});
  background-size:200% 100%;
  animation:shimmer 1.2s infinite;
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
`;

const HeadRow = styled.div`display:grid;grid-template-columns:1fr auto;gap:8px;align-items:start;`;
const HeadLeft = styled.div``;
const HeadRight = styled.div`display:flex;align-items:center;gap:6px;`;
const HeadPrice = styled.h2`margin:0;font-weight:900;letter-spacing:-0.2px;font-size:20px;line-height:1.25;color:${C.text};`;
const HeadSub = styled.div`margin-top:6px;color:${C.sub};font-size:13px;`;
const HeadName = styled.div`margin-top:8px;font-size:16px;font-weight:900;`;
const HeadAddr = styled.div`margin-top:4px;font-size:12px;color:${C.sub};`;
const Avg = styled.div`display:flex;align-items:center;gap:4px;padding:6px 10px;border:1px solid ${C.line};border-radius:999px;background:${C.soft};font-size:12px;`;

const BlockTitle = styled.div`margin:16px ${S.padX}px 8px;font-weight:800;`;

const Columns = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:0 ${S.padX}px 12px;`;
const ColCard = styled.div`background:${C.card};border:1px solid ${C.line};border-radius:${R.card}px;padding:10px;box-shadow:0 6px 18px rgba(0,0,0,.05);`;
const Row = styled.div`display:grid;grid-template-columns:1fr auto;align-items:center;padding:10px 6px;& + & {border-top:1px dashed ${C.line};}`;
const RowKey = styled.div`font-size:13px;`;
const RowVal = styled.div`font-size:13px;font-weight:800;color:${p=>p.$blue?C.blue:C.text};`;

const MemoText = styled.div`white-space:pre-wrap;line-height:1.6;`;
const Muted = styled.div`color:${C.sub};`;

const AudioCard = styled(Card)`background:${C.soft};border:1px solid ${C.line};`;
const AudioBar = styled.div`display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:10px;padding:4px 6px 10px;`;
const Time = styled.div`font-size:12px;color:${C.sub};min-width:36px;text-align:center;`;
const Slider = styled.input`
  -webkit-appearance:none;appearance:none;height:6px;border-radius:999px;background:${C.line};
  &::-webkit-slider-thumb{ -webkit-appearance:none;appearance:none;width:16px;height:16px;border-radius:50%;background:${C.blue};border:0;}
  &::-moz-range-thumb{ width:16px;height:16px;border-radius:50%;background:${C.blue};border:0;}
`;
const Controls = styled.div`display:flex;justify-content:center;align-items:center;gap:14px;`;
const RoundBtn = styled.button`width:40px;height:40px;border-radius:999px;border:1px solid ${C.line};background:#fff;cursor:pointer;display:grid;place-items:center;color:${C.text};`;
const PlayBtn = styled(RoundBtn)`width:54px;height:54px;border:0;background:${C.blue};color:#fff;`;

/* icons */
function ChevronLeft(){return(<svg width="22" height="22" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke="#111827" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>);}
function StarIcon(){return(<svg width="14" height="14" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z" fill={C.star}/></svg>);}
function PlayIcon(){return(<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>);}
function PauseIcon(){return(<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>);}
function Back15(){return(<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 5v3l-4-4 4-4v3c5 0 9 4 9 9s-4 9-9 9a9 9 0 110-18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><text x="7" y="17" fontSize="8" fill="currentColor" fontWeight="800">15</text></svg>);}
function Fwd15(){return(<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 5v3l4-4-4-4v3a9 9 0 109 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><text x="11" y="17" fontSize="8" fill="currentColor" fontWeight="800">15</text></svg>);}
