/* =========================================================
   ✏️ 사이트의 글과 링크를 고치는 파일입니다.

   고치는 법
   - 따옴표 " " 안의 글자만 바꾸세요.
   - 따옴표, 쉼표( , ), 괄호 { } [ ] 는 지우지 마세요.
   - 다 고쳤으면 Ctrl + S 로 저장 → 브라우저에서 새로고침(F5).

   그림 파일 형식 (2026-10-28부터)
   - 사이트의 그림은 모두 .webp 예요 (jpg·png 보다 가벼워서 빨리 떠요). 파일 이름도 "01.webp" 처럼 적어요.
   - 새 그림은 webp 로 바꿔서 넣는 것을 권장해요 (품질 90).
     크기: 카드 대표 그림(thumb)은 가로 1200px 이하, 나머지는 긴 쪽 2000px 이하.
   - GIF(.gif) 와 영상(.mp4)은 그대로 써요.
   - 공유 미리보기 그림(images/site/share.jpg)과 탭 아이콘(favicon.png)은 jpg / png 그대로예요.
   - Personal Works 는 webp / jpg / png 중 무엇을 넣어도 이름만 같으면 알아서 찾아 보여 줘요.
   ========================================================= */

const SITE = {

  /* ---------- 기본 정보 ---------- */

  name: "Jaeyeon Kim",             // 브라우저 탭 제목, 맨 아래 © 표시에 쓰여요
  role: "2D Animation Artist",     // 첫 화면 이름 아래 한 줄 (양옆에 꽃), 브라우저 탭 제목에도 쓰여요


  /* ---------- 맨 위 첫 화면 (Hero) ---------- */

  heroName: "JAEYEON KIM",         // 첫 화면에 아주 크게 보이는 이름

  // 이름 아래 작은 글씨로 보이는 키워드 (사이사이에 · 이 자동으로 들어가요)
  skills: [
    "Character Animation",
    "Cinematic Storytelling",
    "Stylized Visuals",
  ],


  /* ---------- 상단 메뉴 글자 (모든 페이지 공통) ---------- */

  menu: {
    works: "Works",
    about: "About",
    contact: "Contact",
  },


  /* ---------- 연락처 (모든 페이지 공통) ---------- */

  email: "jaeyeon.anim@gmail.com",
  // 주소를 비워두면 그 링크는 안 보여요
  instagram: "https://www.instagram.com/lolotus030/",
  linkedin: "https://www.linkedin.com/in/jaeyeon-kim-913405233",

  // CV PDF: files 폴더에 resume.pdf 로 넣어주세요 (About 버튼과 Contact 의 CV 아이콘이 이 파일을 열어요)
  resume: "files/resume.pdf",
  resumeFileName: "JaeyeonKim_Resume.pdf",   // 내려받을 때 저장되는 이름
  resumeButton: "CV (PDF)",                  // About 페이지 버튼 글자


  /* ---------- 맨 아래 하단 (모든 페이지 공통) ---------- */

  footer: {
    button: "Let's talk",                    // 하단 오른쪽 세 번째 칸 글자 (누르면 Contact 페이지로)
  },


  /* ---------- About 페이지 (about.html) ---------- */

  about: {
    title: "About",

    // 가운데 자기소개 글 (임시 문구예요. 자유롭게 바꿔주세요)
    // ` ` 사이에 쓰면 여러 줄을 쓸 수 있어요. 빈 줄 = 문단 나누기. **굵게** 도 돼요.
    intro: `안녕하세요, 2D 애니메이션 아티스트 **김재연**이에요.

캐릭터의 작은 움직임에도 고유한 감정과 개성이 담긴다고 믿습니다. 캐릭터의 매력을 시각적으로 해석하고, 움직임과 연출을 통해 장면의 완성도를 높이는 일을 합니다.

게임 시네마틱과 PV부터 비주얼 디벨롭먼트, 단편 애니메이션까지 다양한 제작 경험을 바탕으로 캐릭터의 개성을 살리고, 장면의 의도와 분위기를 효과적으로 전달하는 데 집중합니다. 애니메이션을 넘어 비주얼과 연출 전반을 이해하며, 작품이 지향하는 방향을 구체적인 결과물로 구현하는 아티스트를 지향합니다.`,

    // 글 주변에 흩어져 있는 사진 3장 (images/about 폴더)
    photos: {
      profile: "images/about/profile.webp",              // 프로필 사진 (컬러여도 자동으로 흑백)
      selfPortrait: "images/about/self-portrait.webp",   // 나를 그린 그림
      working: "images/about/working.webp",               // 작업하는 내 모습
    },

    // 경력: 위에서부터 순서대로 보여요.
    //   note = 대표 작업 (맨 위 굵은 줄), role = 직무, company = 회사 이름 (그 아래 "직무 · 회사" 한 줄)
    //   note 를 "" 로 비우면 직무가 맨 위 굵은 줄로 올라가요.
    experienceTitle: "Experience",
    experience: [
      { company: "데브시스터즈",            role: "애니메이션 크리에이터",                         note: "쿠키런 IP 시네마틱 애니메이션" },
      { company: "Studio Lico",            role: "2D 애니메이터 · 컬러 디자인",                    note: "원신 캐릭터 컬러 디자인 등" },
      { company: "Ungummed",               role: "애니메틱 · 레이아웃 아티스트",                   note: "장편 애니메이션 (비공개)" },
      { company: "Ground Control Studios", role: "2D 애니메이터",                                 note: "Empire Fall 애니메이션 MV" },
      { company: "스튜디오 피보테",          role: "2D Key 애니메이터 · 2D 애니메이터",              note: "스쿼드 버스터즈 PV, 영화 히트맨2, TXT - 끝날의 밤 등" },
      { company: "Un Oeil Sur Tout",       role: "배경 아티스트 · 일러스트레이터 · 2D 애니메이터", note: "La Poste 등 광고 애니메이션" },
      { company: "VCR Works",              role: "2D 애니메이터",                                 note: "DJMAX RESPECT V 뮤직비디오 등" },
    ],

    // 학력: Experience 오른쪽에 보여요. school = 학교 이름(굵게), degree = 학위 · 전공(그 아래 회색 한 줄)
    educationTitle: "Education",
    education: [
      { school: "GOBELINS, l'école de l'image", degree: "MA · Character Animation and Animated Filmmaking" }
    ],
  },


  /* ---------- Contact 페이지 (contact.html) ---------- */

  contact: {
    title: "Contact",                                        // 큰 제목

    // 제목 바로 아래 작은 문구
    intro: "그리시는 세계관, 한 프레임씩 연출해 드릴까요?",

    // 🔑 Web3Forms 열쇠 코드 (Access Key)
    //    메시지는 이 열쇠 코드를 만들 때 적은 이메일로 와요. 새 열쇠 코드로 바꾸려면 따옴표 안만 바꾸세요.
    formKey: "c4c10eb6-2867-4ca1-97c5-2f2319deda5e",

    // 받은 메일의 제목 (뒤에 보낸 사람 이름이 자동으로 붙어요)
    mailSubject: "New message from portfolio",

    // 입력칸: label = 칸 위 작은 이름, placeholder = 칸 안 연한 회색 안내, error = 잘못 썼을 때 안내
    name:    { label: "이름",   placeholder: "이름을 입력해 주세요",  error: "이름을 입력해 주세요." },
    email:   { label: "Email",  placeholder: "your@email.com",       error: "이메일 주소를 정확히 입력해 주세요." },
    message: { label: "메시지", placeholder: "프로젝트 내용, 궁금한 점 등 자유롭게 남겨 주세요.", error: "메시지를 입력해 주세요." },

    submit: "보내기",                                          // 보내기 버튼 글자

    // 보내기 버튼 오른쪽(휴대폰은 아래)에 보이는 상태 문구
    sending: "보내는 중…",                                     // 보내는 중
    success: "감사합니다! 확인 후 연락드릴게요.",                 // 잘 보내졌을 때
    // 실패했을 때. {email} 자리에 위의 이메일 주소가 누를 수 있는 링크로 들어가요 ({email} 은 지우지 마세요)
    error: "전송에 실패했어요. {email} 으로 직접 보내 주세요.",
  },


  /* ---------- 데모릴 (Demo Reel) ---------- */

  demoReel: {
    title: "Demo Reel",
    description: "",                                // 제목 아래 한 줄 설명 (비워두면 안 보여요)
    vimeo: "https://vimeo.com/1235889524",          // Vimeo(또는 YouTube) 주소를 그대로 붙여넣으세요
  },


  /* ---------- 회사·학교 작업 (Works) ----------

     프로젝트 하나 = { ... } 한 덩어리예요. 위에서부터 순서대로 메인 갤러리와 상세 페이지 이전/다음에 놓여요.

     [메인 갤러리 카드에 보이는 것]
     title       : 프로젝트 제목
     role        : 카드 태그 줄의 역할   예) "Direction"
     client      : 회사/학교 이름         예) "데브시스터즈"
     year        : 연도                  예) "2025"   (비워두면 태그에서 빠져요)
     summary     : 한 줄 소개 (카드 아래 + 상세 페이지 제목 아래)
     id          : 이미지 폴더 이름 (images/works/ 안의 폴더 이름과 똑같이)
     thumb       : 카드 대표 이미지 파일 이름 (4:3, webp, 가로 1200px 권장)

     [상세 페이지 위쪽 영역]
     tags        : 역할 태그. 첫 번째 태그만 핑크로 강조돼요 (내 파트)
                   예) tags: ["Direction", "Storyboard", "2D Animation"],
     tools       : 쓴 프로그램        예) "TVPaint, Photoshop"
     video       : 대표 영상 주소. Vimeo 또는 YouTube 주소를 그대로 붙여넣어요 (없으면 "")
     poster      : 영상 앞에 보여 줄 그림 파일 (16:9). 있으면 그림 위 재생 버튼을 눌러 재생해요
     description : 설명 글. ` ` (키보드 숫자 1 왼쪽 키) 사이에 쓰고, 빈 줄을 넣으면 문단이 나뉘어요

     [상세 페이지 탭] tabs: [ { 탭 하나 }, { 탭 하나 }, ... ]  왼쪽부터 순서대로 탭이 생겨요
       name 은 탭 이름, type 은 보여 주는 방식이에요. 파일은 모두 images/works/폴더이름/ 안에 넣어요.

       ① 가로 줄 (옆으로 넘기는 카드, 비율을 맞춰 잘라서 보여 줘요)
          { name: "Storyboard", type: "row", ratio: "16:9",
            items: [ { file: "storyboard-01.webp", caption: "#01 오프닝" }, { file: "bg-01.webp" } ] }
          - caption 은 카드 아래 작은 설명 (없으면 안 보여요)
          - 가로로 아주 긴 그림은 { file: "...", fit: "contain" } 로 쓰면 자르지 않고 다 보여요
          - width: "40%" 를 쓰면 카드가 더 커져요 (기본 32%)
       ② 원본 비율 줄 (높이만 맞추고 자르지 않아요)
          { name: "BG Arts", type: "row-natural", height: "clamp(220px, 26vw, 340px)", items: [ ... ] }
       ③ 큰 이미지 위아래로
          { name: "Color Design", type: "stack", ratio: "16:9", items: [ "color-design-01.webp", ... ] }
       ④ 비교 슬라이더 (두 장을 겹쳐서 손잡이를 끌어 비교)
          { name: "Color Script", type: "compare", ratio: "16:9",
            note: "슬라이더를 좌우로 움직여 비교",
            before: { file: "color-script.webp", label: "Color Script" },
            after:  { file: "color-script-final.webp", label: "Final" } }
       ⑤ Shot Breakdown (한 컷을 단계별로 넘겨 보기). 단계마다 video(Vimeo/YouTube 주소) 또는 gif(파일 이름)
          { name: "Shot Breakdown", type: "breakdown",
            steps: [ { label: "Animatic", video: "https://vimeo.com/..." }, { label: "Comp", gif: "sb-comp.gif" } ] }
       ⑥ Impact (숫자 카드 + 쇼츠 + 반응 모음, 필요한 것만 쓰면 돼요)
          { name: "Impact", type: "impact",
            stats:  [ { value: "15만", label: "조회수" }, ... ],          첫 카드만 핑크
            shorts: [ { link: "https://youtube.com/shorts/...", poster: "shorts-01.webp", caption: "..." } ],
            captures: [ { title: "국내 반응", headline: "핵심 한 줄",
                          comments: [ { text: "댓글", source: "YouTube · 좋아요 20" },
                                      { text: "__밑줄__ 은 핑크 밑줄", source: "...", highlight: true } ],
                          images: [ { file: "capture-kr-comments.webp", alt: "원본 캡처" } ] } ] }

     ※ 파일을 아직 안 넣었으면 그 자리에 연한 빈칸과 파일 이름이 보여요. 이름 그대로 넣으면 바로 나와요.
  ------------------------------------------------------------ */

  worksTitle: "Works",
  worksDescription: "",               // 제목 아래 한 줄 설명 (비워두면 안 보여요)

  works: [
    {
      title: "쿠키런 킹덤: 인게임 컷신",
      role: "Direction",
      client: "데브시스터즈",
      year: "2026",
      summary: "위험한 해결사들 인게임 컷신 영상 기획 및 제작",
      id: "project-01",
      thumb: "thumb.webp",

      tags: ["Direction", "Storyboard", "Animatic", "Background Art", "2D Animation"],
      tools: "TVPaint, Clip Studio Paint, Photoshop, After Effects, Blender, Gemini",
      video: "https://vimeo.com/1238705780",
      poster: "poster.webp",
      description: `쿠키런 킹덤 컷신 영상에서 이전에는 시도해보지 않았던 코믹한 연출과 과감한 컬러감을 넣어 유저들의 반응을 이끌어 냈던 인게임 컷신입니다.`,

      tabs: [
        { name: "Storyboard", type: "row", ratio: "16:9",
          items: [
            { file: "storyboard-01.webp", caption: "#01 오프닝 — 세 쿠키의 등장" },
            { file: "storyboard-02.webp", caption: "#02 작전 시작" },
            { file: "storyboard-03.webp", caption: "#03 처참한 실패" },
            { file: "storyboard-04.webp", caption: "#04 단서 발견" },
            { file: "storyboard-05.webp", caption: "#05 새로운 작전 실시" },
            { file: "storyboard-06.webp", caption: "#06 작전 성공!" },
          ] },
        { name: "Arts", type: "row", ratio: "16:9", width: "40%",
          items: [ { file: "bg-01.webp" }, { file: "bg-02.webp" }, { file: "bg-03.webp" } ] },
        { name: "Shot Breakdown", type: "breakdown",
          steps: [
            { label: "Animatic",  video: "https://vimeo.com/1238778892" },
            { label: "Animation", video: "https://vimeo.com/1238779983" },
            { label: "Comp",      video: "https://vimeo.com/1238780019" },
          ] },
        { name: "Impact", type: "impact",
          stats: [
            { value: "15만", label: "YouTube Shorts 조회수 (2026.10 기준)" },
            { value: "2.8천", label: "좋아요" },
            { value: "쿠키런 킹덤 최초 코믹북 컷신", label: "코믹 연출 · 과감한 컬러" },
          ],
          shorts: [
            { link: "https://youtube.com/shorts/l7JD1RiNXSU", poster: "shorts-01.webp",
              caption: "YouTube Shorts — 뒤에 매달려 오고 있던 타임쉐도우 쿠키" },
          ] },
      ],
    },
    {
      title: "쿠키런 킹덤: 레전더리 스킨 영상",
      role: "Direction",
      client: "데브시스터즈",
      year: "2025",
      summary: "세인트릴리 쿠키 & 사일런트솔트 쿠키 레전더리 스킨 영상 기획 및 제작",
      id: "project-02",
      thumb: "thumb.webp",

      tags: ["Direction", "Pipeline Design", "Storyboard", "Animatic", "Background Art", "2D Animation"],
      tools: "Photoshop, TVPaint, After Effects",
      video: "https://youtu.be/x2MMrBruEhI",
      poster: "poster.webp",
      description: `레전더리 스킨 영상의 기획부터 제작 전반을 총괄했습니다. 감성적이고 상징적인 요소를 활용해 스킨 고유의 분위기를 구축하고, 캐릭터의 매력과 디테일이 돋보이도록 연출했습니다. 또한 시각적 완성도를 높이는 데 그치지 않고, 애니메이션 제작 공정을 개선하고 체계화하는 계기를 마련한 프로젝트입니다.`,

      tabs: [
        { name: "Storyboard", type: "row", ratio: "16:9",
          items: [
            { file: "storyboard-01.webp", caption: "#01 오프닝 — 깊은 밤, 달 아래 배 한 척", fit: "contain" },
            { file: "storyboard-02.gif", caption: "#02 꽃 트랜지션" },
            { file: "storyboard-03.webp", caption: "#03 사일런트솔트 쿠키 첫 등장" },
            { file: "storyboard-04.gif", caption: "#04 나비 트랜지션" },
            { file: "storyboard-05.webp", caption: "#05 세인트릴리 쿠키 클로즈업" },
            { file: "storyboard-06.webp", caption: "#06 달을 가르는 배" },
          ] },
        { name: "Color Script", type: "compare", ratio: "16:9",
          note: "슬라이더를 좌우로 움직여 컬러 스크립트와 완성 영상 비교",
          before: { file: "color-script.webp", label: "Color Script" },
          after:  { file: "color-script-final.webp", label: "Final" } },
        { name: "BG Arts", type: "row-natural", height: "clamp(220px, 26vw, 340px)",
          items: [ { file: "bg-01.webp" }, { file: "bg-02.webp" }, { file: "bg-03.webp" }, { file: "bg-04.webp" } ] },
        { name: "Character Sheets", type: "row-natural", height: "clamp(300px, 36vw, 520px)",
          items: [
            { file: "character-sheet-silent-salt.webp", caption: "사일런트솔트 쿠키 — 컬러 가이드" },
            { file: "character-sheet-white-lily.webp", caption: "세인트릴리 쿠키 — 컬러 가이드" },
          ] },
        { name: "Impact", type: "impact",
          stats: [
            { value: "10만", label: "YouTube 조회수 (쿠키런 킹덤 영어 채널 2026.10 기준)" },
            { value: "6.3천", label: "좋아요" },
            { value: "약 1.5배", label: "제작 공정 체계화 — 같은 기간 컷 수" },
          ],
          captures: [
            { title: "국내 반응", headline: "나비 오브젝트를 두고 여러 추측을 하며 몰입",
              comments: [
                { text: "이번에는 전설 스킨 출시 영상에서도 진짜 분위기 있다... 영혼이 담긴 흰나비 날아가는 거 느좋 🦋", source: "YouTube · 좋아요 20" },
                { text: "저 나비 색이 전에 나왔던 요정왕국 퓨바세릴꺼랑 비슷하네 아니면 퓨바세릴을 뜻하는건가?", source: "YouTube · 0:21 · 좋아요 6" },
                { text: "사솔이 나비를 언급하는거 보면 왠지 요왕을 떠올리면서 말한것같은데...", source: "YouTube · 좋아요 2" },
                { text: "개 잘생겼다 와 사솔이 진짜 너무 잘생겼다 대사도 진짜 찰떡이고 와 데브 미쳤다", source: "YouTube · 0:14 · 좋아요 53" },
                { text: "각 쿠키의 __상징적인 의상과 연출__, 그리고 __스토리 기반의 감정선__이 영상에서 강조되어 팬들에게 큰 호응을 얻고 있습니다.", source: "네이버 AI 브리핑", highlight: true },
              ],
              images: [
                { file: "capture-kr-comments.webp", alt: "국내 YouTube 댓글 원본 캡처" },
                { file: "capture-kr-ai.webp", alt: "네이버 AI 브리핑 원본 캡처" },
              ] },
            { title: "해외 반응", headline: "배가 달을 가르는 마지막 장면에 의미 부여",
              comments: [
                { text: "Idk what kinda beef silent salt has with the moon, but honestly the visual of them cutting through the moons reflection on the water looked awesome!!", source: "YouTube · 0:31 · 좋아요 36" },
                { text: "Omg the boat “Slicing” the moon, I see you devsis", source: "YouTube · 좋아요 13" },
                { text: "“Follow my voice, and break free from your bonds...” Silent Salt sounds like he’s trying to comfort White Lily", source: "YouTube · 좋아요 86" },
                { text: "I look forward for the last update in White Lily Cookie’s and I’s main story. Thank you all devsisters; everything was absolute perfection. And I look fabulous.", source: "X 팬 계정 · 조회 20K · 좋아요 1.2K" },
              ],
              images: [
                { file: "capture-en-comments.webp", alt: "해외 YouTube 댓글 원본 캡처" },
                { file: "capture-en-x.webp", alt: "X 팬 계정 게시글 원본 캡처" },
              ] },
          ] },
      ],
    },
    {
      // 03 Visual Development: 영상·탭 대신 왼쪽 목차 + 작업 8개 (sections)
      //   sections 한 칸 = 작업 하나. name 작업 이름 / toc 목차에 쓰는 짧은 이름 / date 날짜 / roles 맡은 일
      //   rows 는 위에서부터 한 줄씩:
      //     { images: ["가로로 긴 그림.webp"] }                        → 한 장을 가로 전체에 자르지 않고
      //     { images: ["a.webp", "b.webp"], ratio: "16:9" }            → 여러 장을 한 줄에 (좁으면 옆으로 밀기)
      //     { images: [ { file: "a.webp", ratio: "2000:593" }, ... ] } → 장마다 비율이 다를 때
      //     { compare: [ { before: "x-before.webp", after: "x-after.webp" } ], labels: ["Before", "After"] } → 비교 슬라이더
      //       └ layout: "column" 을 더하면 한 줄에 하나씩 가로 꽉 차게, zoom: true 를 더하면 오른쪽 아래 돋보기로 크게 볼 수 있어요
      //   images 안에서 { file: "...", label: "Color Script" } 처럼 쓰면 크게 보기에 이름이 나와요
      title: "Visual Development",
      role: "Color Script, Concept Art, Color Design",
      client: "데브시스터즈",
      year: "2025–2026",
      summary: "",
      id: "project-03",
      thumb: "thumb.webp",
      tags: ["Color Script", "Concept Art", "Color Design"],

      sections: [
        { name: "쿠키런 킹덤 — 운명의 시간선 전쟁 오프닝", date: "2026.03",
          roles: "Art Direction, Color Script, Character Color Guide, 2D Animation",
          rows: [
            { images: [ { file: "vd01-color-script.webp", label: "Color Script" } ] },
            { images: [ { file: "vd01-character-sheet.webp", label: "시간지기 캐릭터 시트" },
                        { file: "vd01-scissors-sheet.webp", label: "시간지기 가위 시트" } ], ratio: "2:1", min: "260px" },
          ] },
        { name: "쿠키런 모험의 탑 — 달빛술사 오프닝", date: "2026.04", roles: "Color Direction",
          rows: [
            { images: [ { file: "vd02-color-script.webp", label: "Color Script" } ] },
            { images: ["vd02-screenshot-01.webp", "vd02-screenshot-02.webp", "vd02-screenshot-03.webp",
                       "vd02-screenshot-04.webp", "vd02-screenshot-05.webp"], ratio: "16:9", min: "130px" },
          ] },
        { name: "쿠키런 킹덤 — 쉐도우 밀크 강림 인게임 컷신", toc: "쿠키런 킹덤 — 쉐도우 밀크 강림", date: "2025.11",
          roles: "Art Direction, BG Layout, BG Paint, 2D Animation",
          rows: [
            { images: [ { file: "vd03-bg-panorama-rocks.webp", label: "BG — 균열과 바위" } ] },
            { images: [ { file: "vd03-bg-panorama-moon.webp", label: "BG — 붉은 달" } ] },
            { images: [ { file: "vd03-bg-topdown.webp", label: "BG — 협곡 부감" },
                        { file: "vd03-bg-sky.webp", label: "BG — 붉은 하늘" } ], ratio: "16:9", min: "260px" },
            { images: [ { file: "vd03-layout.webp", label: "Camera Test Layout", ratio: "2000:593" },
                        { file: "vd03-rock-design.webp", label: "Rock Design", ratio: "32:9" } ], min: "260px" },
          ] },
        { name: "쿠키런 킹덤 — 위험한 해결사 인게임 컷신", toc: "쿠키런 킹덤 — 위험한 해결사", date: "2026.07",
          roles: "Direction, BG Arts, 3D Animation, 2D Animation",
          rows: [
            { images: ["vd04-image-01.webp", "vd04-image-02.webp", "vd04-image-03.webp"], ratio: "16:9", min: "200px" },
          ] },
        { name: "쿠키런 킹덤 — 명계 오프닝", date: "2026.05", roles: "Color Script",
          rows: [
            { images: [ { file: "vd05-color-script.webp", label: "Color Script" } ] },
            { images: [ { file: "vd05-final-01.webp", label: "Final 01" }, { file: "vd05-final-02.webp", label: "Final 02" },
                        { file: "vd05-final-03.webp", label: "Final 03" }, { file: "vd05-final-04.webp", label: "Final 04" } ],
              ratio: "16:9", min: "160px" },
          ] },
        { name: "쿠키런 킹덤 — 세인트릴리의 소멸 인게임 컷신", toc: "쿠키런 킹덤 — 세인트릴리의 소멸", date: "2026.01",
          roles: "Direction, Color Script, BG Paint",
          rows: [
            { images: [ { file: "vd06-color-script.webp", label: "Color Script" } ] },
            { images: [ { file: "vd06-bg-crater.webp", label: "Concept Art — 분화구" },
                        { file: "vd06-concept-01.webp", label: "Concept Art 01" },
                        { file: "vd06-concept-02.webp", label: "Concept Art 02" } ], ratio: "16:9", min: "200px" },
          ] },
        { name: "쿠키런 모험의 탑 — 선데맛 쿠키 인게임 컷신", toc: "쿠키런 모험의 탑 — 선데맛 쿠키", date: "2025.06",
          roles: "Matte Paint, 2D Animation",
          rows: [
            { compare: [
                { before: "vd07-matte-01-before.webp", after: "vd07-matte-01-after.webp" },
                { before: "vd07-matte-02-before.webp", after: "vd07-matte-02-after.webp" },
                { before: "vd07-matte-03-before.webp", after: "vd07-matte-03-after.webp" },
              ], labels: ["Before", "After"], zoom: true },   // 한 줄에 3개 + 돋보기로 크게 보기
          ] },
        { name: "Ripe — Brendan 뮤직비디오", date: "", roles: "Background Paint",   // date 에 "2025.08" 처럼 날짜를 적을 수 있어요
          rows: [
            { images: [ { file: "vd08-background-paint.webp", label: "Background Paint" } ] },
          ] },
      ],
    },
    {
      title: "HoYoverse 원신: 스커크 애니메이션",
      role: "Character Color Design",
      client: "Studio Lico",
      year: "2025",
      summary: "원신 PV 영상 캐릭터 스커크 색설계",
      id: "project-04",
      thumb: "thumb.webp",

      tags: ["Character Color Design"],
      tools: "Clip Studio Paint",
      video: "https://youtu.be/zxAubNf3EQQ?si=PbnkNRByS8TZI_YD",                 // 영상 주소가 생기면 여기에 붙여넣어요 (Vimeo 또는 YouTube)
      poster: "poster.webp",
      description: `원신 캐릭터인 스커크 애니메이션 영상에 등장하는 다양한 배경 분위기에 맞는 캐릭터 색설계 디자인을 담당했습니다. 게임 캐릭터 특유의 화려하고 미묘한 컬러를 컬러칩으로 따로 정리해, 작업자가 스포이드로 바로 찍어 쓸 수 있도록 설계했습니다.`,

      tabs: [
        { name: "Color Design", type: "stack", ratio: "16:9",
          items: ["color-design-01.webp", "color-design-02.webp", "color-design-03.webp", "color-design-04.webp"] },
      ],
    },
    {
      // 05: 대표 영상 대신 두 덩어리 (parts)
      //   ① 영상 + 탭: { title, sub, video, poster, tabs: [...] }
      //   ② 비교 슬라이더 + 영상 링크 카드: { title, sub, compare: { before, after, labels }, link: { url, thumb, label } }
      title: "French Commercials: Background Art",
      role: "Background Design",
      client: "Un Oeil sur Tout",
      year: "2022",
      summary: "프랑스 모션그래픽 회사 Un Oeil sur Tout에서 배경 작업을 맡았습니다.",
      id: "project-05",
      thumb: "thumb.webp",

      tags: ["Background Design", "Illustration"],
      tools: "Photoshop",
      description: `프랑스 모션그래픽 회사 Un Oeil sur Tout에서 배경 작업을 맡았습니다.`,

      parts: [
        { title: "L'APIJ — 프랑스 법무부 산하 사법 부동산 공공기관 광고", sub: "Background Design",
          video: "https://vimeo.com/767225108?fl=pl&fe=sh",             // 영상 주소가 생기면 여기에
          poster: "lapij-poster.webp",
          tabs: [
            { name: "BG Arts", type: "row", ratio: "16:9", width: "40%",
              items: ["lapij-bg-01.webp", "lapij-bg-02.webp", "lapij-bg-03.webp", "lapij-bg-04.webp"] },
            { name: "Scene Flow", type: "stack",                         // 여러 씬을 이어 붙인 무드 보기 (가로 전체, 위아래)
              items: [ { file: "lapij-scene-01.webp", ratio: "1802:956" },
                       { file: "lapij-scene-02.webp", ratio: "1802:695" } ] },
          ] },
        { title: "La Poste — 프랑스 우체국 광고", sub: "Scene Illustration",
          images: ["laposte-illustration-01.webp", "laposte-illustration-02.webp"],   // 2장 크게 나란히, 눌러서 크게 보기 (16:9)
          link: { url: "https://vimeo.com/784543172?fl=pl&fe=sh",       // 영상 주소가 생기면 여기에 (새 창으로 열려요)
                  thumb: "laposte-thumb.webp", label: "La Poste 광고 영상 보기" } },
      ],
    },
    {
      // 메인 목록에서 6번째 (폴더는 project-07 그대로)
      title: "Memory Rental Store",
      role: "Co-Direction, Character Design",
      client: "Gobelins Paris",
      year: "2023",
      summary: "Gobelins Paris MA 졸업 작품 기획 및 캐릭터 디자인",
      id: "project-07",
      thumb: "thumb.webp",

      tags: ["Co-Direction", "Character Design", "Animation", "Layout"],
      tools: "TVPaint, Photoshop, Procreate, After Effects",
      video: "https://youtu.be/BCCwCSdXRSE?si=S596FU3aVJTEzYYl",                 // 영상 주소가 생기면 여기에
      poster: "poster.webp",
      description: `기억을 대여한다는 아이디어에서 출발한 Gobelins Paris 석사 졸업작품으로, 공동 연출과 캐릭터 디자인을 담당했습니다. 좋았던 시절의 기억에 머무는 주인공의 성장 이야기를 중심으로, 작품의 정서와 주제를 시각적으로 풀어내는 캐릭터를 디자인했습니다. 짧은 러닝타임 안에서도 캐릭터의 개성과 감정이 효과적으로 전달되도록 표현을 구체화했습니다.`,

      tabs: [
        { name: "Character Design", type: "row", ratio: "4:3", width: "36%",
          items: [
            { file: "character-sheet-01.webp", caption: "01 Kobu — 턴어라운드" },
            { file: "character-sheet-02.webp", caption: "02 Kobu — 캐릭터 시트" },
            { file: "character-sheet-03.webp", caption: "03 Kobu — 캐릭터 시트" },
            { file: "character-sheet-04.webp", caption: "04 HB boy — 턴어라운드" },
            { file: "character-sheet-05.webp", caption: "05 HB boy — 캐릭터 시트" },
            { file: "character-sheet-06.webp", caption: "06 HB boy — 캐릭터 시트" },
            { file: "character-sheet-07.webp", caption: "07 Mop Dog — 턴어라운드" },
            { file: "character-sheet-08.webp", caption: "08 Sub Characters — 캐릭터 시트" },
            { file: "character-sheet-09.webp", caption: "09 Character exploration" },
            { file: "character-sheet-10.webp", caption: "10 Character exploration" },
          ] },
        { name: "Layouts", type: "row", ratio: "16:9",
          items: ["layout-01.webp", "layout-02.webp", "layout-03.webp", "layout-04.webp", "layout-05.webp", "layout-06.webp", "layout-07.webp"] },
        { name: "Concept Arts", type: "row", ratio: "16:9",
          items: ["concept-01.webp", "concept-02.webp", "concept-03.webp"] },
        { name: "Shot Breakdown", type: "breakdown",
          // 단계마다 Vimeo 주소를 넣어요. 비어 있으면 빈칸으로 보여요
          steps: [
            { label: "Animatic", video: "https://vimeo.com/1239039758?share=copy&fl=sv&fe=ci" },
            { label: "Rough",    video: "https://vimeo.com/1239039953?share=copy&fl=sv&fe=ci" },
            { label: "Clean Up", video: "https://vimeo.com/1239040108?fl=tl&fe=ec" },
            { label: "Comp",     video: "https://vimeo.com/1239040125?fl=tl&fe=ec" },
          ] },
      ],
    },
    {
      // 메인 목록에서 맨 끝 (폴더는 project-06 그대로)
      title: "Annecy Festival OP: Renouveau",
      role: "Co-Direction, Character Design",
      client: "Gobelins Paris",
      year: "2022",
      summary: "프랑스 안시 애니메이션 페스티벌 오프닝 영상 기획 및 캐릭터 디자인, 애니메이션 슈퍼바이징",
      id: "project-06",
      thumb: "thumb.webp",

      tags: ["Co-Direction", "Character Design", "Animation"],
      tools: "Photoshop, TVPaint, After Effects, Procreate",
      video: "https://youtu.be/L5UmM-kNB9s?si=DmpKSgIAmtcJsXVG",                 // 영상 주소가 생기면 여기에
      poster: "poster.webp",
      description: `Gobelins Paris 석사 과정 중 제작한 안시 국제 애니메이션 영화제 오프닝 영상으로, 공동 연출과 캐릭터 디자인, 애니메이션 슈퍼바이징을 담당했습니다. 스위스의 전통문화와 테마를 연구해 캐릭터 디자인에 반영했으며, 캐릭터 디자인과 애니메이션 스타일을 조율해 작품 전반의 시각적 일관성을 구축했습니다.`,

      tabs: [
        { name: "Character Design", type: "row", ratio: "4:3", width: "36%",
          items: [
            { file: "character-sheet-01.webp", caption: "01 주인공(They) — 캐릭터 시트" },
            { file: "character-sheet-02.webp", caption: "02 주인공(They) — 디테일 디자인" },
            { file: "character-sheet-03.webp", caption: "03 주인공(They) — exploration" },
            { file: "character-sheet-04.webp", caption: "04 주인공(They) — exploration" },
          ] },
        { name: "Shot Breakdown", type: "breakdown",
          // 단계마다 GIF 파일 (16:9, 가로 960px 안팎, 각 5MB 이하, 세 개 길이·프레임을 같게)
          steps: [
            { label: "Tiedown",  gif: "sb-tiedown.gif" },
            { label: "Clean Up", gif: "sb-cleanup.gif" },
            { label: "Comp",     gif: "sb-comp.gif" },
          ] },
      ],
    },
  ],


  /* ---------- 개인 작업 (Personal Works) ----------

     카드에는 가로형(16:9) 대표 이미지 + 이름 한 줄만 보여요.

     title       : 이름
     id          : 이미지 폴더 이름 (images/personal/ 안의 폴더 이름과 똑같이)
     thumb       : 대표 이미지 파일 이름 (16:9, webp, 가로 1200px 권장)
     vimeo       : 상세 페이지 맨 위 대표 영상. Vimeo·YouTube 주소 또는 폴더에 넣은 영상 파일 이름("reel.mp4")
                   (없으면 "" → 영상 칸이 사라져요)     description : 상세 페이지 설명 글 (비워두면 안 보여요)
     images      : 상세 페이지 작업물 모음. 아래 세 가지를 섞어서 쓸 수 있어요.
                   쉼표( , )로 구분하고, 적은 순서대로 쌓여요.

       ① 이미지  "01.webp"  "02.webp"  "03.webp"
                  → 폴더(images/personal/폴더이름/)에 같은 이름으로 넣어요
                  → 원본 비율 그대로 보여요 (세로로 길어도, 가로로 길어도 잘리지 않아요)
       ② 움직이는 그림  "gif-04.webp" (또는 "04.gif")
                  → 이름이 gif- 로 시작하는 .webp(애니메이션 WebP), 또는 .gif 로 끝나면 GIF 탭으로 분류돼요
                  → GIF 는 애니메이션 WebP 로 바꾸면 훨씬 가벼워요 (Claude 에게 부탁하세요)
       ※ 목록에는 같은 폴더 list/ 안의 작은 사본(같은 이름 .webp)을 쓰고, 원본은 눌러서 크게 볼 때만 받아요.
         새 그림을 넣으면 Claude 에게 "목록용 사본 만들어 줘" 라고 해 주세요 (사본이 없어도 원본이 보여요).
       ③ 영상 파일  "run.mp4"
                  → 폴더(images/personal/폴더이름/)에 같은 이름으로 넣어요
                  → 평소엔 첫 장면만 보이고, 마우스를 올리면 앞 5초가 소리 없이 반복돼요
                  → 누르면 크게 보기에서 소리와 함께 처음부터 끝까지 재생돼요
                  → MP4(H.264) 형식, 파일 하나 25MB 이하 (GitHub 웹 업로드 한도), 10~20MB 권장
       ④ 영상 링크  { vimeo: "https://vimeo.com/123456", ratio: "9:16" }
                  → Vimeo 또는 YouTube 주소. 칸 안에서 그 서비스 플레이어로 재생돼요 (긴 영상은 이쪽이 좋아요)
                  → ratio 는 영상 비율이에요. "16:9"(가로), "9:16"(세로), "1:1"(정사각형) 등
                  → ratio 를 안 쓰면 16:9 로 보여요
       예) images: ["01.webp", "02.webp", "walk.gif", "run.mp4", { vimeo: "https://vimeo.com/123456", ratio: "9:16" }],

     탭 이름을 직접 정하고 싶으면 images 대신 groups 를 써요 (Croquis 예시 참고):
       groups: [ { name: "탭 이름", images: [ ... ] }, { name: "다른 탭", images: [ "작은폴더/01.webp", ... ] } ]
       → All / 탭 이름 / 다른 탭. 폴더 안 작은 폴더의 그림은 "작은폴더이름/파일이름" 으로 적어요

     상세 페이지 위에 All / Image / Video / GIF 탭이 자동으로 생겨요.
     (없는 종류의 탭은 안 생기고, 한 가지 종류만 있으면 탭 줄 없이 작업물만 보여요)
  ------------------------------------------------------------ */

  personalTitle: "Personal Works",
  personalDescription: "",               // 제목 아래 한 줄 설명 (비워두면 안 보여요)

  personal: [
    {
      title: "Illustration & Animation",
      id: "illustration-animation",
      thumb: "thumb.webp",
      vimeo: "",
      description: ``,
      images: [
        // 이미지 (webp)
        "01.webp", "02.webp", "03.webp", "04.webp", "05.webp", "06.webp", "07.webp", "08.webp", "09.webp",
        "10.webp", "11.webp", "12.webp", "13.webp", "14.webp", "15.webp", "16.webp", "17.webp", "18.webp",
        "19.webp", "20.webp", "21.webp", "22.webp", "23.webp", "24.webp", "25.webp", "26.webp", "27.webp",

        // 움직이는 그림 (gif-00 이 맨 앞. GIF 를 애니메이션 WebP 로 바꾼 파일이에요)
        "gif-00.webp", "gif-01.webp", "gif-02.webp", "gif-03.webp", "gif-04.webp", "gif-05.webp", "gif-06.webp", "gif-07.webp",

        // 영상 (Vimeo 링크) — 따옴표 "" 안에 Vimeo 주소를 붙여넣으세요. 비어 있으면 화면에 안 나와요
        //   ratio   : 영상 비율이라 그대로 두세요 (9:16 세로 / 16:9 가로 / 2:3 세로)
        //   preview : 같은 폴더의 짧은(약 3~5초) 소리 없는 미리 보기 영상 파일
        //             → 평소엔 첫 장면, 마우스를 올리면 반복, 누르면 크게 보기에서 Vimeo 전체 영상이 소리와 함께 재생
        //             (preview 를 비우면 칸 안에 Vimeo 플레이어가 그대로 들어가요)
        //   크게 보기 옆 정보 칸 (비워 두면 영상만 보여요)
        //   title   : 제목                      예) title: "Bubble Gum",
        //   logline : 한 줄 소개                 예) logline: "여름 바다에서 풍선껌을 부는 소녀",
        //   concept : 컨셉아트 그림 파일 이름들   예) concept: ["24.webp", "25.webp"],
        //             → 여기 적은 그림은 영상 창에서만 보이고, 작업물 모음·Image 탭에서는 빠져요
        //   awards  : (선택) 수상·선정 이력, 로그라인 아래에 한 줄씩   예) awards: ["○○ 콘테스트 - 우수상 (2019)"],
        { vimeo: "https://vimeo.com/1239209276", ratio: "9:16", preview: "video-01-preview.mp4",   // 영상 01 (세로)
          title: "Bubble gum", logline: "뉴진스 - 버블검 팬아트", concept: [] },
        { vimeo: "https://vimeo.com/1239209285", ratio: "16:9", preview: "video-02-preview.mp4",   // 영상 02 (가로)
          title: "오후", logline: "가을 날 오후에 즐기는 차 한 잔의 여유", concept: ["10.webp", "11.webp", "12.webp", "13.webp"],
          awards: ["네이버 그라폴리오 '멍타임' 콘테스트 - 우수상 (2019)", "서울국제지하철영화제(SMIFF) - 선정작 (2019)"] },
        { vimeo: "https://vimeo.com/1239209289", ratio: "16:9", preview: "video-03-preview.mp4",   // 영상 03 (가로)
          title: "우리 집 강아지가 가장 좋아하는 것은", logline: "우리 집 강아지 커피는 왜 그 꽃무늬 이불만 고집할까?", concept: [] },
        { vimeo: "https://vimeo.com/1239209294", ratio: "2:3",  preview: "video-04-preview.mp4",   // 영상 04 (세로)
          title: "가을", logline: "차 한 잔과 음식, 풍경에 담아낸 가을의 순간들", concept: [] },
        { vimeo: "https://vimeo.com/1239209328", ratio: "9:16", preview: "video-05-preview.mp4",   // 영상 05 (세로)
          title: "빙봉", logline: "우연히 서로 치킨을 사온 그 날, 오늘은 치킨이닭!", concept: ["29.webp"] },
        { vimeo: "https://vimeo.com/1239209356", ratio: "16:9", preview: "video-06-preview.mp4",   // 영상 06 (가로)
          title: "Ring-ring", logline: "교토의 신사에서 종을 치는 순간,머릿속에 몽글몽글 피어난 상상", concept: [] },
        { vimeo: "https://vimeo.com/1239209372", ratio: "16:9", preview: "video-07-preview.mp4",   // 영상 07 (가로)
          title: "지루해", logline: "코로나로 집에 갇힌 나, 지루함을 이겨보려 애써도 심심함은 계속된다", concept: ["28.webp"] },
      ],
    },
    {
      title: "Croquis",
      id: "croquis",
      thumb: "thumb.webp",
      vimeo: "",
      description: ``,
      // 묶음 탭: name 이 탭 이름, images 가 그 탭의 그림 (All 에서는 위 묶음부터 차례로)
      groups: [
        { name: "Figure Drawing",                       // 인물 크로키 (croquis 폴더)
          images: ["01.webp", "02.webp", "03.webp", "04.webp", "05.webp", "06.webp", "07.webp", "08.webp", "09.webp",
                   "10.webp", "11.webp", "12.webp", "13.webp", "14.webp", "15.webp", "16.webp", "17.webp", "18.webp",
                   "19.webp", "20.webp", "21.webp", "22.webp", "23.webp", "24.webp", "25.webp"] },
        { name: "Color Sketch",                         // 컬러 크로키 (croquis/color-croquis 폴더)
          images: ["color-croquis/01.webp", "color-croquis/02.webp", "color-croquis/03.webp", "color-croquis/04.webp",
                   "color-croquis/05.webp", "color-croquis/06.webp", "color-croquis/07.webp", "color-croquis/08.webp",
                   "color-croquis/09.webp", "color-croquis/10.webp"] },
      ],
    },
  ],


  /* ---------- My Services (About 페이지, 자기소개 아래 · Experience 위) ----------
     icon 은 animation / storyboard / visual / illustration 중 하나
     title = 제목,  text = 한 줄 설명
  ------------------------------------------------------------ */

  servicesTitle: "My Services",
  services: [
    { icon: "animation",    title: "Animation",             text: "캐릭터에 생동감을 불어넣는 2D 애니메이션" },
    { icon: "storyboard",   title: "Storyboard & Animatic", text: "이야기의 흐름과 연출을 설계하는 콘티와 애니메틱" },
    { icon: "visual",       title: "Visual Development",    text: "작품의 색과 분위기를 정하는 비주얼 개발" },
    { icon: "illustration", title: "Illustration",          text: "캐릭터와 세계관을 담은 일러스트레이션" },
  ],

};
