// 상세보기 페이지
import React, {useEffect, useRef, useState}  from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";


/* 디자인 토큰 */
const C = { bg:"#fff", line:"#E7EDF5", soft:"#F8FAFF", text:"#0F172A", sub:"#6B7280", blue:"#4C8DFF", overlay:"rgba(14,18,27,.5)", star: "#3B82F6", };
const R = { img:12, card:12, pill:999 };
const S = { headerH:56, padX:16 };
const I = { text: "#0F172A", sub: "#464A4D" };

export default function HomeDetailPage() {
 // HomeDetailPage 함수 내부 최상단 근처에 추가
const [menuOpen, setMenuOpen] = useState(false);
const btnRef = useRef(null);
const menuRef = useRef(null);
const firstItemRef = useRef(null);

// 바깥 클릭/ESC 닫기
useEffect(() => {
  const onDocClick = (e) => {
    if (!menuOpen) return;
    const t = e.target;
    if (
      menuRef.current &&
      !menuRef.current.contains(t) &&
      btnRef.current &&
      !btnRef.current.contains(t)
    ) {
      setMenuOpen(false);
    }
  };
  const onKey = (e) => {
    if (e.key === "Escape") setMenuOpen(false);
  };
  document.addEventListener("mousedown", onDocClick);
  document.addEventListener("keydown", onKey);
  return () => {
    document.removeEventListener("mousedown", onDocClick);
    document.removeEventListener("keydown", onKey);
  };
}, [menuOpen]);

// 열리면 첫 항목 포커스
useEffect(() => {
  if (menuOpen) firstItemRef.current?.focus();
}, [menuOpen]);

// 메뉴 키보드 ↑/↓ 이동
const onMenuKeyDown = (e) => {
  if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
  e.preventDefault();
  const items = menuRef.current?.querySelectorAll('button[role="menuitem"]');
  if (!items?.length) return;
  const list = Array.from(items);
  const idx = list.findIndex((el) => el === document.activeElement);
  const next =
    e.key === "ArrowDown"
      ? (idx + 1) % list.length
      : (idx - 1 + list.length) % list.length;
  list[next].focus();
};

// 예시 액션
  const onEdit = () => { setMenuOpen(false); navigator("/checklist"); };
  const onDelete = () => { setMenuOpen(false); alert("삭제 완료"); };

    const DEFAULT_PHOTO =
    "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=1600&auto=format&fit=crop";

    return (
    <Wrap>
        <TopBar>
        <IconBtn aria-label="back" onClick={() => window.history.back()}><ChevronLeft/></IconBtn>
        <Title>상세보기</Title>
        <IconBtn aria-hidden />
      </TopBar>
      <Section>
        <HeroBox>
          <Hero src={DEFAULT_PHOTO} alt="room" />
        </HeroBox>
      </Section>
      <Tabs>
        <TabLink to="/homedetailpage" end>상세보기</TabLink>
        <TabLink to="/leasechecklistpage">집 계약 체크리스트</TabLink>
      </Tabs>
      <Card>

          <HeadTitle>
            <HeadTitleText>월세 300/84</HeadTitleText>
              <HeadTitleActions>
   <IconButton
     ref={btnRef}
     aria-label="옵션 열기"
     aria-haspopup="menu"
     aria-expanded={menuOpen}
     aria-controls="card-menu"
     onClick={() => setMenuOpen((v) => !v)}
   >
     <GearIcon />
   </IconButton>
   {menuOpen && (
     <Menu id="card-menu" role="menu" ref={menuRef} onKeyDown={onMenuKeyDown}>
       <MenuItem ref={firstItemRef} role="menuitem" onClick={onEdit}>수정하기</MenuItem>
       <MenuDivider />
       <MenuItem role="menuitem" data-danger onClick={onDelete}>삭제</MenuItem>
     </Menu>
   )}
 </HeadTitleActions>
          </HeadTitle>
      
        <RoomInfo>33㎡ 관리비 5만원</RoomInfo>
        <RoomName>명지힐하우스</RoomName>
        <RoomAdress>서울시 서대문구 남가좌동 29-1</RoomAdress>
        <RoomAdressDetail>102동 1004</RoomAdressDetail>
        <Average><StarIcon /> <b>평균 4.8</b></Average>
       </Card>
       <ListTitle>체크리스트</ListTitle>
       <ListCard>
        <ListCardLeft>
            <ListMenu>채광 및 전망<span>5점</span></ListMenu>
            <ListMenu>수압 및 배수<span>5점</span></ListMenu>
            <ListMenu>청결 및 곰팡이<span>5점</span></ListMenu>
            <ListMenu>옵션 및 구조<span>5점</span></ListMenu>
            <ListMenu>보안 및 시설<span>5점</span></ListMenu>
        </ListCardLeft>
        <ListCardRight>
            <ListMenu>소음<span>5점</span></ListMenu>
            <ListMenu>주변 환경<span>5점</span></ListMenu>
            <ListMenu>분리수거<span>5점</span></ListMenu>
            <ListMenu>엘리베이터<span>O</span></ListMenu>
            <ListMenu>반려동물<span>X</span></ListMenu>
        </ListCardRight>
       </ListCard>
       <MemoTitle>메모</MemoTitle>
       <MemoArea><textarea placeholder="작성한 메모가 없습니다."></textarea></MemoArea>
    </Wrap>
    )
}

const Wrap = styled.div`min-height:100dvh;background:${C.bg};color:${C.text};`;
const TopBar = styled.header`
  position:sticky;top:0;z-index:10;height:${S.headerH}px;
  display:grid;grid-template-columns:56px 1fr 56px;align-items:center;
  border-bottom:1px solid ${C.line};background:#fff;
`;

const Title = styled.div`justify-self:center;font-weight:800;`;
const IconBtn = styled.button`border:0;background:transparent;height:100%;display:grid;place-items:center;cursor:pointer;`;

const Section = styled.div`padding:12px ${S.padX}px 0;`;
const HeroBox = styled.div`border:1px solid ${C.line};border-radius:${R.img}px;overflow:hidden;background:#fff;`;
const Hero = styled.img`width:100%;aspect-ratio:16/10;object-fit:cover;display:block;`;

const Tabs = styled.div`
  display:grid;grid-template-columns:1fr 1fr;
  padding:10px ${S.padX}px 0;
  margin-top:3%;
`;
const TabLink = styled(NavLink)`
  display: block;
  text-align: center;
  padding: 10px 0;
  font-weight: 700;
  color: ${C.sub};
  text-decoration: none;
  position: relative;
  cursor: pointer;

  /* 활성 탭 스타일 */
  &.active {
    color: ${C.blue};
  }
  &.active::after {
    content: "";
    position: absolute;
    left: 0; right: 0; bottom: -1px;
    height: 2px; border-radius: 2px;
    background: ${C.blue};
  }
`;

const Card = styled.section`
  position: relative; /* ← absolute 기준 */
  margin:12px ${S.padX}px;
  padding:12px;
  background:#fff;
  border:1px solid ${C.line};
  border-radius:${R.card}px;
  margin-top:5%;
`;
const HeadTitle = styled.h2`
  display:flex; align-items:center; gap:10px;
  margin:0; font-weight:800; letter-spacing:-0.2px;
  font-size:20px; line-height:1.25; color:${I.text};
  padding-right:40px;
`;

const HeadTitleText = styled.span`
  min-width:0; flex:1;
  overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
`;

const HeadTitleActions = styled.div`
    position:absolute; top:12px; right:12px;
    display:flex; align-items:center; gap:8px;
    z-index: 2;
`;

const IconButton = styled.button`
  display:inline-flex; align-items:center; justify-content:center;
  width:28px; height:28px; border:0; border-radius:8px; background:transparent;
  color:${C.sub}; /* ← 아이콘 색상은 여기서 제어 (currentColor) */
  cursor:pointer;

  &:hover { opacity:.85; }
  svg { display:block; /* baseline 튐 방지 */ }
`;

// 아이콘(너가 준 path 그대로, 색상은 currentColor로 전환)
function GearIcon(props) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" {...props}>
      <path
        fillRule="evenodd" clipRule="evenodd"
        d="M7.83403 5.33333C6.45322 5.33333 5.33403 6.45252 5.33403 7.83333C5.33403 9.21414 6.45322 10.3333 7.83403 10.3333C9.21483 10.3333 10.334 9.21414 10.334 7.83333C10.334 6.45252 9.21483 5.33333 7.83403 5.33333ZM6.33403 7.83333C6.33403 7.00481 7.0055 6.33333 7.83403 6.33333C8.66255 6.33333 9.33403 7.00481 9.33403 7.83333C9.33403 8.66186 8.66255 9.33333 7.83403 9.33333C7.0055 9.33333 6.33403 8.66186 6.33403 7.83333Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd" clipRule="evenodd"
        d="M6.83335 0.666016C6.58586 0.666016 6.37561 0.847069 6.33889 1.09182L6.05522 2.98218C5.92082 3.03098 5.78868 3.0852 5.65917 3.14495L4.12317 2.0099C3.92414 1.86282 3.64746 1.88347 3.47246 2.05846L2.05846 3.47246C1.88347 3.64746 1.86282 3.92414 2.0099 4.12317L3.14503 5.65927C3.08533 5.78888 3.03124 5.92097 2.98249 6.05517L1.09182 6.33889C0.847069 6.37561 0.666016 6.58586 0.666016 6.83335V8.83335C0.666016 9.08084 0.847069 9.29109 1.09182 9.32781L2.98218 9.61148C3.03098 9.74588 3.0852 9.87801 3.14495 10.0075L2.0099 11.5435C1.86282 11.7426 1.88347 12.0192 2.05846 12.1942L3.47246 13.6082C3.64746 13.7832 3.92414 13.8039 4.12317 13.6568L5.65927 12.5217C5.78888 12.5814 5.92097 12.6355 6.05517 12.6842L6.33889 14.5749C6.37561 14.8196 6.58586 15.0007 6.83335 15.0007H8.83335C9.08084 15.0007 9.29109 14.8196 9.32781 14.5749L9.61148 12.6845C9.74588 12.6357 9.87801 12.5815 10.0075 12.5217L11.5435 13.6568C11.7426 13.8039 12.0192 13.7832 12.1942 13.6082L13.6082 12.1942C13.7832 12.0192 13.8039 11.7426 13.6568 11.5435L12.5217 10.0074C12.5814 9.87782 12.6355 9.74572 12.6842 9.61153L14.5749 9.32781C14.8196 9.29109 15.0007 9.08084 15.0007 8.83335V6.83335C15.0007 6.58586 14.8196 6.37561 14.5749 6.33889L12.6845 6.05522C12.6357 5.92082 12.5815 5.78868 12.5218 5.65917L13.6568 4.12317C13.8039 3.92414 13.7832 3.64746 13.6082 3.47246L12.1942 2.05846C12.0192 1.88347 11.7426 1.86282 11.5435 2.0099L10.0074 3.14503C9.87782 3.08533 9.74572 3.03124 9.61153 2.98249L9.32781 1.09182C9.29109 0.847069 9.08084 0.666016 8.83335 0.666016H6.83335ZM6.99848 3.43488L7.26392 1.66602H8.40278L8.66822 3.43488C8.697 3.62667 8.83408 3.78451 9.01994 3.83987C9.30273 3.92411 9.57018 4.03323 9.81917 4.16861C9.98988 4.26143 10.1989 4.24695 10.3552 4.13147L11.7916 3.07001L12.5967 3.87513L11.5352 5.31153C11.4198 5.4678 11.4053 5.67682 11.4981 5.84753C11.6338 6.09706 11.7433 6.36433 11.8265 6.64582C11.8816 6.83212 12.0397 6.96965 12.2318 6.99848L14.0007 7.26392V8.40278L12.2318 8.66822C12.04 8.697 11.8822 8.83408 11.8268 9.01994C11.7426 9.30273 11.6335 9.57018 11.4981 9.81917C11.4053 9.98988 11.4198 10.1989 11.5352 10.3552L12.5967 11.7916L11.7916 12.5967L10.3552 11.5352C10.1989 11.4198 9.98988 11.4053 9.81917 11.4981C9.56964 11.6338 9.30237 11.7433 9.02088 11.8265C8.83457 11.8816 8.69705 12.0397 8.66822 12.2318L8.40278 14.0007H7.26392L6.99848 12.2318C6.9697 12.04 6.83262 11.8822 6.64675 11.8268C6.36397 11.7426 6.09651 11.6335 5.84753 11.4981C5.67682 11.4053 5.4678 11.4198 5.31153 11.5352L3.87513 12.5967L3.07001 11.7916L4.13147 10.3552C4.24695 10.1989 4.26143 9.98988 4.16861 9.81917C4.03294 9.56964 3.9234 9.30237 3.84015 9.02088C3.78505 8.83457 3.62702 8.69705 6.99848 3.43488Z"
        fill="currentColor"
      />
    </svg>
  );
}
const Menu = styled.div`
  position: absolute;
  top: 30px;        /* 버튼 바로 아래 */
  right: 0;
  min-width: 80px;
  background: #fff;
  border: 1px solid ${C.line};
  border-radius: 10px;
  padding: 6px 0;
  box-shadow: 0 8px 24px rgba(0,0,0,.08);
  z-index: 3;       /* 카드 내용보다 위 */
`;

const MenuItem = styled.button`
  display: block;
  width: 100%;
  text-align: center;
  background: transparent;
  border: 0;
  border-radius: 8px;
  color: ${C.text};
  font-size: 10px;
  cursor: pointer;

  &:hover { background: ${C.soft}; }
  &[data-danger] { color: #ef4444; }
`;

const MenuDivider = styled.hr`
  border: 0;
  height: 1px;
  background: ${C.line};
  margin: 6px 8px;
`;


const RoomInfo = styled.div`font-size:18px; font-weight:bold;`;
const RoomName = styled.div`font-size:16px; `;
const RoomAdress = styled.div`font-size:14px; color:gray; `;
const RoomAdressDetail = styled.div`font-size:14px; color:gray;`;
const Average = styled.div`display:flex; justify-content: flex-end; align-items: center; font-size:14px`;

const ListTitle = styled.div`display:flex; margin:12px ${S.padX}px; padding:5px;`;
const ListCard = styled.div`display:flex; justify-content: space-around;`;
const ListCardLeft = styled.div`width:35%; height:15vh; border: 1px solid ${C.line}; border-radius:${R.card}px; padding: 3%; display:flex; flex-direction:column; justify-content:space-between;`;
const ListCardRight = styled.div`width:35%; height:15vh; border: 1px solid ${C.line}; border-radius:${R.card}px; padding: 3%; display:flex; flex-direction:column; justify-content:space-between;`;
const ListMenu = styled.div`display:flex; flex-direction:row; width:100%; justify-content:space-between; span { color: ${C.blue}; font-weight:bold;}`;

const MemoTitle = styled.div`display:flex; margin:10px ${S.padX}px; padding:5px;`;
const MemoArea = styled.div`display:flex; justify-content:center;textarea {
width:85%; height:10vh; margin-bottom:30%;border: 1px solid ${C.line}; border-radius:${R.card}px; padding: 3%; color: #464A4D; resize:none;}`;


/* icons */
function ChevronLeft(){return(<svg width="22" height="22" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke="#111827" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>);}
function StarIcon(props){return(<svg width="14" height="14" viewBox="0 0 24 24" {...props}><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z" fill={C.star}/></svg>);}
function SmallStar(props){return <StarIcon {...props}/>;}
function TipIcon(){return(<svg width="18" height="18" viewBox="0 0 24 24"><path d="M9 21h6m-6-3h6M7 10a5 5 0 1 1 10 0c0 1.8-.9 3.1-2.1 4.2-.6.6-.9 1.4-.9 2.3H10c0-.9-.3-1.7-.9-2.3C7.9 13.1 7 11.8 7 10z" stroke={C.blue} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>);}
function ChevronDown({ $open }){return(<svg width="18" height="18" viewBox="0 0 24 24" style={{transform:$open?"rotate(180deg)":"none",transition:"transform .15s"}}><path d="M6 9l6 6 6-6" stroke="#6B7280" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>);}
function CheckIcon(){return(<svg width="14" height="14" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>);}
