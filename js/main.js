/* content.js 의 내용을 각 페이지에 채워 넣는 코드 (직접 고칠 필요 없어요)
   공통 부분(캐릭터, 메뉴, 하단, 꽃)은 js/layout.js 가 맡아요. */

(function () {
  var params = new URLSearchParams(location.search);
  var page = document.body.getAttribute('data-page') || 'home';
  var $ = UI.$, el = UI.el;

  // 갤러리 종류: content.js 의 목록 이름 → images 안의 폴더 이름
  var COLLECTIONS = [
    { key: 'works', folder: 'works', label: SITE.worksTitle || 'Works', anchor: 'works' },
    { key: 'personal', folder: 'personal', label: SITE.personalTitle || 'Personal Works', anchor: 'personal' },
  ];

  function setText(sel, text) { var n = $(sel); if (n) n.textContent = text || ''; }
  function setOrHide(sel, text) { var n = $(sel); if (!n) return; n.textContent = text || ''; n.hidden = !text; }
  function imgPath(folder, id, file) {
    if (!file) return '';
    if (/^(https?:)?\/\//.test(file) || /^(images\/|\.?\/)/.test(file)) return file; // 직접 경로를 쓴 경우
    // "color-croquis/01.png" 처럼 폴더 안의 작은 폴더도 돼요 → images/personal/croquis/color-croquis/01.png
    return 'images/' + folder + '/' + id + '/' + file;
  }
  // 태그 줄: 역할 · 회사/학교 · 연도 (비어 있는 칸은 빠져요)
  function tagLine(p) {
    return [p.role, p.client, p.year].filter(Boolean).join(' · ');
  }

  // 영상 주소(Vimeo 또는 YouTube)를 영상 넣기용 주소로 바꿔요.
  // 예) https://vimeo.com/123456789  /  https://vimeo.com/123456789/abcdef (비공개 링크)
  //     https://youtu.be/ID  /  https://www.youtube.com/watch?v=ID  /  https://youtube.com/shorts/ID
  // opts.loop = true 면 소리 없이 자동 재생 + 반복 (Shot Breakdown 용)
  //  opts.autoplay = true 면 바로 재생 (대표 영상에서 재생 버튼을 눌렀을 때)
  function youtubeId(url) {
    var m = String(url).match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:[^#]*&)?v=|shorts\/|embed\/|live\/))([\w-]{11})/i);
    return m ? m[1] : '';
  }
  function videoEmbed(url, opts) {
    if (!url) return '';
    opts = opts || {};
    var yt = youtubeId(url);
    if (yt) {
      var yq = 'rel=0&modestbranding=1&playsinline=1';
      if (opts.autoplay) yq += '&autoplay=1';
      if (opts.loop) yq += '&autoplay=1&mute=1&loop=1&playlist=' + yt;
      return 'https://www.youtube-nocookie.com/embed/' + yt + '?' + yq;
    }
    var m = String(url).match(/vimeo\.com\/(?:video\/)?(\d+)(?:\/([0-9a-f]+))?/i);
    if (!m) return '';
    var q = 'title=0&byline=0&portrait=0&dnt=1';
    var h = m[2] || (String(url).match(/[?&]h=([0-9a-f]+)/i) || [])[1];
    if (h) q += '&h=' + h;
    if (opts.autoplay) q += '&autoplay=1';
    if (opts.loop) q += '&autoplay=1&muted=1&loop=1';
    return 'https://player.vimeo.com/video/' + m[1] + '?' + q;
  }
  // 영상 칸에 Vimeo / YouTube 플레이어를 넣어요. 주소가 없거나 알아볼 수 없으면 false
  function putVimeo(box, url, title, opts) {
    var src = videoEmbed(url, opts);
    if (!src) return false;
    var iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.title = title || 'Video';
    iframe.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
    iframe.allowFullscreen = true;
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    box.appendChild(iframe);
    return true;
  }
  var putVideo = putVimeo;

  // 모든 영상 칸(데모릴 · Works 대표 영상 · Personal 영상)을 데모릴과 같은 모양(.vframe)으로:
  // 영상 주소가 있으면 Vimeo / YouTube 플레이어를 바로 넣어요 → 재생 전에는 그 서비스의 썸네일과 재생 버튼이 보여요.
  // 영상 주소가 없으면 poster 그림(또는 빈칸) + 누를 수 없는 재생 모양
  // o = { poster, hint, title, small }
  function lazyVideo(frame, url, o) {
    o = o || {};
    var title = o.title || 'Video';
    frame.classList.add('vframe');
    if (putVideo(frame, url, title)) return;
    frame.appendChild(UI.mediaBox('wd-poster', o.poster || '', title, o.hint || ''));
    var play = el('span', 'wd-play is-idle' + (o.small ? ' wd-play--small' : ''));
    play.setAttribute('aria-hidden', 'true');
    play.innerHTML = PLAY_SVG;
    frame.appendChild(play);
  }

  // CV PDF 버튼 (About 버튼, Contact 의 CV 아이콘)
  function setupResume(a) {
    if (!a) return;
    if (!SITE.resume) { a.hidden = true; return; }
    a.href = SITE.resume;
    a.setAttribute('download', SITE.resumeFileName || '');
    var label = $('[data-resume-label]', a);
    if (label) label.textContent = SITE.resumeButton || 'CV (PDF)';
  }

  /* =========================================================
     메인 페이지
     ========================================================= */
  function homePage() {
    document.title = SITE.name + ' — ' + SITE.role;

    // Hero: 큰 이름 → 꽃 사이 직업 → 작은 키워드
    setText('[data-hero-name]', SITE.heroName || SITE.name);
    setText('[data-hero-role]', SITE.role);
    var skills = $('[data-hero-skills]');
    (SITE.skills || []).forEach(function (s, i) {
      if (i > 0) {
        var dot = el('span', 'hero__dot', '·');
        dot.setAttribute('aria-hidden', 'true');
        skills.appendChild(dot);
      }
      skills.appendChild(el('span', '', s));
    });

    // Demo Reel
    var reel = SITE.demoReel || {};
    setText('[data-reel-title]', reel.title);
    setOrHide('[data-reel-desc]', reel.description);
    var frame = $('[data-reel-frame]');
    if (videoEmbed(reel.vimeo)) lazyVideo(frame, reel.vimeo, { poster: reel.poster, hint: reel.poster, title: reel.title });
    else {
      frame.classList.add('is-empty');
      frame.textContent = 'content.js 에 Vimeo 주소를 넣어주세요';
    }

    // Hero 의 scroll 버튼: 데모릴 영상이 화면 세로 가운데에 오도록 이동
    var hint = $('.scroll-hint');
    if (hint) hint.addEventListener('click', function (e) {
      e.preventDefault();
      var r = frame.getBoundingClientRect();
      var top = r.top + window.scrollY - (window.innerHeight - r.height) / 2;
      // 영상이 화면보다 크면 위쪽 메뉴에 가리지 않게 영상 윗부분부터 보이게
      if (r.height > window.innerHeight - 120) top = r.top + window.scrollY - 100;
      var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: Math.max(0, top), behavior: still ? 'auto' : 'smooth' });
    });

    // Works
    setText('[data-works-title]', SITE.worksTitle || 'Works');
    setOrHide('[data-works-desc]', SITE.worksDescription);
    buildCards($('[data-works-grid]'), SITE.works || [], 'works', false);   // 카드에는 썸네일 + 제목만 (2026-10-25)

    // Personal Works (이미지 + 이름만)
    setText('[data-personal-title]', SITE.personalTitle || 'Personal Works');
    setOrHide('[data-personal-desc]', SITE.personalDescription);
    buildCards($('[data-personal-grid]'), SITE.personal || [], 'personal', false);

    // 다른 페이지에서 'Works' 를 눌러 왔을 때: 글꼴까지 다 불러온 뒤 그 부분으로 맞춰 이동
    if (location.hash) {
      var target = document.getElementById(location.hash.slice(1));
      var go = function () { if (target) target.scrollIntoView({ behavior: 'instant', block: 'start' }); };
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(go);
      window.addEventListener('load', go);
    }
  }

  // 같은 크기 카드: 이미지 → 제목 → (태그 줄) → (한 줄 설명)
  function buildCards(grid, list, folder, withTags) {
    list.forEach(function (p) {
      var a = el('a', 'card');
      a.href = 'project.html?id=' + encodeURIComponent(p.id);

      a.appendChild(UI.mediaBox('card__media', imgPath(folder, p.id, p.thumb), p.title,
        p.id + '/' + (p.thumb || 'thumb.jpg'), folder === 'personal'));   // Personal: jpg / png 둘 다

      a.appendChild(el('h3', 'card__title', p.title));
      if (withTags) {
        var tags = tagLine(p);
        if (tags) a.appendChild(el('p', 'card__tags', tags));
        if (p.summary) a.appendChild(el('p', 'card__summary', p.summary));
      }
      grid.appendChild(a);
    });
  }

  /* =========================================================
     프로젝트 상세 페이지 (project.html?id=...)
     ========================================================= */
  function projectPage() {
    var id = params.get('id');
    var found = null;
    COLLECTIONS.forEach(function (c) {
      var list = SITE[c.key] || [];
      list.forEach(function (p, i) { if (!found && p.id === id) found = { c: c, list: list, p: p, i: i }; });
    });

    var root = $('[data-project]');
    if (!found) {
      root.innerHTML = '';
      root.appendChild(el('p', 'project__missing', '프로젝트를 찾을 수 없어요.'));
      var home = el('a', 'back-link', '← 메인으로');
      home.href = 'index.html';
      root.appendChild(home);
      return;
    }

    var c = found.c, p = found.p, list = found.list, i = found.i;
    document.title = p.title + ' — ' + SITE.name;

    $('[data-back]').href = 'index.html#' + c.anchor;
    setText('[data-back-label]', 'All ' + c.label);

    setText('[data-p-title]', p.title);

    // Role / Client / Year
    var meta = $('[data-p-meta]');
    [['Role', p.role], ['Client', p.client], ['Year', p.year]].forEach(function (row) {
      if (!row[1]) return;
      var d = el('div', 'project__meta-item');
      d.appendChild(el('dt', '', row[0]));
      d.appendChild(el('dd', '', row[1]));
      meta.appendChild(d);
    });
    meta.hidden = !meta.children.length;   // 정보가 하나도 없으면 줄도 숨기기

    UI.paragraphs($('[data-p-desc]'), p.description);

    var video = $('[data-p-video]');
    if (c.key === 'personal' && isVideoFile(p.vimeo)) {
      // Personal Works 대표 영상을 파일(mp4)로 넣은 경우: 재생 버튼·소리·전체 화면이 있는 기본 플레이어
      video.hidden = false;
      video.classList.add('vframe', 'vframe--file');
      var hv = document.createElement('video');
      hv.controls = true;
      hv.playsInline = true;
      hv.setAttribute('playsinline', '');
      hv.preload = 'metadata';
      hv.setAttribute('aria-label', p.title);
      hv.src = imgPath(c.folder, p.id, p.vimeo) + '#t=0.1';
      video.appendChild(hv);
    } else {
      video.hidden = !videoEmbed(p.vimeo);
      if (!video.hidden) lazyVideo(video, p.vimeo, { title: p.title });
    }

    var gallery = $('[data-p-images]');
    if (c.key === 'personal') {
      // Personal Works: 종류 탭 + 핀터레스트식 모음 + 크게 보기
      root.classList.add('project--personal');
      gallery.hidden = true;
      personalGallery(gallery, p, c);
    } else if (c.key === 'works' && (p.tabs || p.sections || p.parts || p.tags)) {
      // Works 새 상세 디자인 (위쪽 영역 + 탭). content.js 의 tabs / sections / parts 로 그려요
      gallery.hidden = true;
      workDetail(root, p, c);
    } else {
      // Works (tabs 가 없을 때의 안전장치): 이미지를 위에서 아래로 한 장씩
      (p.images || []).forEach(function (file, k) {
        gallery.appendChild(UI.mediaBox('project__img', imgPath(c.folder, p.id, file),
          p.title + ' ' + (k + 1), p.id + '/' + file));
      });
    }

    // 이전 / 다음
    var nav = $('[data-p-nav]');
    if (list.length > 1) {
      var prev = list[(i - 1 + list.length) % list.length];
      var next = list[(i + 1) % list.length];
      nav.appendChild(navLink(prev, 'prev', '← Prev'));
      nav.appendChild(navLink(next, 'next', 'Next →'));
    }
  }

  /* ---------- 크게 보기 (Personal Works · Works 상세가 같이 써요) ----------
     getViewer().open([{ src, alt, caption, video }], 몇 번째부터, 누른 칸) / getViewer().close()
     video: true 면 영상 파일(mp4)을 소리와 함께 재생해요 (멈춤·소리·전체 화면 버튼)
     embed: "Vimeo/YouTube 주소", ratio: 가로÷세로 면 그 서비스 플레이어로 소리와 함께 재생해요
     title / logline / concept: [{ src, alt }] 가 있으면 옆에 정보 칸 (제목 · 한 줄 소개 · 컨셉아트) */
  var sharedViewer = null;
  function getViewer() {
    if (sharedViewer) return sharedViewer;
    var viewer = el('div', 'viewer');
    viewer.hidden = true;
    viewer.setAttribute('role', 'dialog');
    viewer.setAttribute('aria-modal', 'true');
    viewer.setAttribute('aria-label', '크게 보기');
    viewer.innerHTML =
      '<button class="viewer__btn viewer__close" type="button" aria-label="닫기"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/></svg></button>' +
      '<div class="viewer__stage"><div class="viewer__main"><img class="viewer__img" alt=""><video class="viewer__img viewer__video" controls playsinline hidden></video>' +
        '<div class="viewer__embed" hidden></div></div>' +
        '<aside class="viewer__info" hidden><h2 class="viewer__title"></h2><p class="viewer__logline"></p><ul class="viewer__awards"></ul>' +
        '<div class="viewer__concept"><p class="viewer__label">Concept Art</p><div class="viewer__thumbs"></div></div></aside></div>' +
      '<p class="viewer__caption" hidden></p>' +
      '<div class="viewer__nav">' +
        '<button class="viewer__btn viewer__prev" type="button" aria-label="이전 작업"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 6.5 9 12l5.5 5.5"/></svg></button>' +
        '<span class="viewer__count" aria-live="polite"></span>' +
        '<button class="viewer__btn viewer__next" type="button" aria-label="다음 작업"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 6.5 15 12l-5.5 5.5"/></svg></button>' +
      '</div>';
    document.body.appendChild(viewer);
    var vImg = $('img.viewer__img', viewer);
    var vVid = $('.viewer__video', viewer);
    var vEmbed = $('.viewer__embed', viewer);
    var vCap = $('.viewer__caption', viewer);
    var vCount = $('.viewer__count', viewer);
    var list = [], at = 0, opener = null;

    function stopVideo() {
      vVid.pause();
      vVid.removeAttribute('src');
      vVid.load();
      vEmbed.innerHTML = '';   // Vimeo / YouTube 플레이어도 지워서 소리가 남지 않게
    }
    // 영상 정보 칸: 제목 · 한 줄 로그라인 · 컨셉아트 (작은 그림을 누르면 가운데에 크게, ▶ 를 누르면 다시 영상)
    var vInfo = $('.viewer__info', viewer);
    var vThumbs = $('.viewer__thumbs', viewer);
    function showInfo(x) {
      var concept = x.concept || [];
      var awards = x.awards || [];
      var has = !!(x.title || x.logline || concept.length || awards.length);
      viewer.classList.toggle('viewer--info', has);
      vInfo.hidden = !has;
      if (!has) return;
      $('.viewer__title', viewer).textContent = x.title || '';
      $('.viewer__title', viewer).hidden = !x.title;
      $('.viewer__logline', viewer).textContent = x.logline || '';
      $('.viewer__logline', viewer).hidden = !x.logline;
      var ul = $('.viewer__awards', viewer);   // 수상·선정 이력 (작은 트로피 아이콘 + 한 줄씩)
      ul.innerHTML = '';
      awards.forEach(function (a) { ul.appendChild(el('li', '', a)); });
      ul.hidden = !awards.length;
      $('.viewer__concept', viewer).hidden = !concept.length;
      vThumbs.innerHTML = '';
      if (!concept.length) return;
      var buttons = [];
      function pick(k) {
        buttons.forEach(function (b, j) { b.classList.toggle('is-active', j === k + 1); b.setAttribute('aria-pressed', j === k + 1 ? 'true' : 'false'); });
        showMedia(x, k);
      }
      var play = el('button', 'viewer__thumb viewer__thumb--video');
      play.type = 'button';
      play.setAttribute('aria-label', '영상 보기');
      play.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7.5v9l7.5-4.5L9 7.5Z"/></svg>';
      play.addEventListener('click', function () { pick(-1); });
      vThumbs.appendChild(play);
      buttons.push(play);
      concept.forEach(function (cp, k) {
        var b = el('button', 'viewer__thumb');
        b.type = 'button';
        b.setAttribute('aria-label', 'Concept Art ' + (k + 1) + ' 크게 보기');
        var im = el('img');
        im.alt = '';
        // jpg ↔ png 를 바꿔 한 번 더 찾고, 그래도 없으면 숨겨요
        var other = cp.src.replace(/\.(jpe?g|png)$/i, function (m) { return /png/i.test(m) ? '.jpg' : '.png'; });
        im.onerror = function () {
          if (other && other !== cp.src) { cp.src = other; other = ''; im.src = cp.src; return; }
          b.hidden = true;
        };
        im.src = cp.src;
        b.appendChild(im);
        b.addEventListener('click', function () { pick(k); });
        vThumbs.appendChild(b);
        buttons.push(b);
      });
      buttons[0].classList.add('is-active');
      buttons[0].setAttribute('aria-pressed', 'true');
    }
    // 가운데 화면: k < 0 이면 그 항목 자체(영상·그림), k ≥ 0 이면 k 번째 컨셉아트
    function showMedia(x, k) {
      if (k >= 0) {
        stopVideo();
        vVid.hidden = true;
        vEmbed.hidden = true;
        vImg.hidden = false;
        vImg.src = x.concept[k].src;
        vImg.alt = x.concept[k].alt || '';
        return;
      }
      vImg.hidden = !!(x.video || x.embed);
      vVid.hidden = !x.video;
      vEmbed.hidden = !x.embed;
      if (x.embed) {
        // 영상 링크: 원본 비율 칸에 서비스 플레이어를 넣어 소리와 함께 처음부터 재생
        stopVideo();
        vImg.removeAttribute('src');
        vEmbed.style.setProperty('--vr', x.ratio || 16 / 9);
        putVideo(vEmbed, x.embed, x.alt, { autoplay: true });
      } else if (x.video) {
        vEmbed.innerHTML = '';
        vImg.removeAttribute('src');
        vVid.src = x.src;
        vVid.setAttribute('aria-label', x.alt || '');
        var pr = vVid.play();
        if (pr && pr.catch) pr.catch(function () {});   // 브라우저가 자동 재생을 막으면 재생 버튼을 눌러요
      } else {
        stopVideo();
        vImg.src = x.src;
      }
      vImg.alt = x.alt || '';
    }
    function show() {
      var x = list[at];
      showInfo(x);
      showMedia(x, -1);
      vCap.textContent = x.caption || '';
      vCap.hidden = !x.caption;
      vCount.textContent = (at + 1) + ' / ' + list.length;
      var many = list.length > 1;
      $('.viewer__prev', viewer).hidden = !many;
      $('.viewer__next', viewer).hidden = !many;
    }
    function step(d) {
      if (list.length < 2) return;
      at = (at + d + list.length) % list.length;
      show();
    }
    function open(items, index, from) {
      if (!items || !items.length) return;
      list = items;
      at = Math.max(0, Math.min(items.length - 1, index || 0));
      opener = from || null;
      show();
      viewer.hidden = false;
      document.documentElement.classList.add('is-viewing');
      $('.viewer__close', viewer).focus();
    }
    function close() {
      if (viewer.hidden) return;
      viewer.hidden = true;
      vImg.removeAttribute('src');
      stopVideo();
      document.documentElement.classList.remove('is-viewing');
      if (opener && !opener.hidden && opener.offsetParent !== null) opener.focus();
    }
    $('.viewer__close', viewer).addEventListener('click', close);
    $('.viewer__prev', viewer).addEventListener('click', function () { step(-1); });
    $('.viewer__next', viewer).addEventListener('click', function () { step(1); });
    // 배경(빈 곳)을 누르면 닫기
    viewer.addEventListener('click', function (e) {
      if (e.target === viewer || e.target.classList.contains('viewer__stage')) close();
    });
    document.addEventListener('keydown', function (e) {
      if (viewer.hidden) return;
      if (e.key === 'Escape') close();
      else if (e.target === vVid) return;   // 영상 조절 중의 ← → 는 영상 앞뒤 이동
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'ArrowRight') step(1);
    });
    sharedViewer = { open: open, close: close, isOpen: function () { return !viewer.hidden; } };
    return sharedViewer;
  }

  /* ---------- Personal Works 상세: 종류 탭 + 작업물 모음 + 크게 보기 ----------
     content.js 의 images 에는 이미지("01.jpg"), GIF("04.gif"),
     영상({ vimeo: "https://vimeo.com/…", ratio: "9:16" })을 섞어 쓸 수 있어요. */
  var PW_TYPES = [
    { key: 'all',   label: 'All' },
    { key: 'image', label: 'Image' },
    { key: 'video', label: 'Video' },
    { key: 'gif',   label: 'GIF' },
  ];

  // 영상 파일(mp4 등)인지: Personal Works 에서만 써요 (Works 는 Vimeo / YouTube 링크만)
  function isVideoFile(s) { return /\.(mp4|webm|m4v|mov)$/i.test(String(s || '').split(/[?#]/)[0]); }
  var CLIP_PREVIEW = 5;   // 마우스를 올렸을 때 소리 없이 반복하는 앞부분 길이(초)
  var CLIP_MIN_RATIO = 4 / 5;   // 작업물 모음에서 영상 칸의 가장 좁은 비율 (세로 영상은 4:5 칸)

  // 영상 파일 칸: 평소엔 첫 장면(썸네일)만, 마우스를 올리면 앞 5초를 소리 없이 반복, 내리면 처음 장면으로
  function clipBox(cell, srcUrl, alt, hint) {
    var box = UI.mediaBox('pw-media pw-media--clip', '', alt, hint);
    var v = document.createElement('video');
    v.muted = true;
    v.setAttribute('muted', '');
    v.playsInline = true;
    v.setAttribute('playsinline', '');
    v.preload = 'metadata';
    v.loop = true;   // 5초보다 짧은 영상도 끝나면 처음부터 반복
    v.setAttribute('aria-hidden', 'true');
    v.addEventListener('loadedmetadata', function () {
      box.classList.add('is-loaded');
      // 줄 배치용 비율. 세로로 긴 영상(9:16, 2:3)은 너무 좁아지지 않게 칸만 4:5 로 (위아래 살짝 잘림, 크게 보기는 원본 비율)
      if (v.videoWidth && v.videoHeight) cell.style.setProperty('--r', Math.max(CLIP_MIN_RATIO, v.videoWidth / v.videoHeight));
    });
    v.addEventListener('error', function () { v.remove(); });   // 파일이 없으면 빈칸 + 파일 이름 안내
    v.addEventListener('timeupdate', function () { if (v.currentTime >= CLIP_PREVIEW) v.currentTime = 0; });
    v.src = srcUrl + '#t=0.1';   // 첫 장면을 썸네일로
    box.appendChild(v);

    var canHover = window.matchMedia('(hover: hover)').matches;
    var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (canHover && !still) {
      cell.addEventListener('mouseenter', function () {
        if (!box.classList.contains('is-loaded')) return;
        v.currentTime = 0;
        var pr = v.play();
        if (pr && pr.catch) pr.catch(function () {});
      });
      cell.addEventListener('mouseleave', function () {
        v.pause();
        if (box.classList.contains('is-loaded')) v.currentTime = 0.1;
      });
    }
    return box;
  }

  function personalGallery(after, p, c) {
    // 목록 정리
    //  영상: 파일 "walk.mp4" (마우스 올리면 미리 보기, 누르면 크게 재생) / 링크 { vimeo: "주소", ratio } (칸 안에서 재생)
    //  탭: content.js 에 groups 가 있으면 묶음 이름 탭(예: Figure Drawing / Color Sketch),
    //      없으면 종류 탭(Image / Video / GIF)
    function toItem(it) {
      if (it && typeof it === 'object') {
        var link = it.vimeo || it.video || it.youtube || it.file || '';
        if (!link) return null;   // 주소를 아직 안 넣은 칸은 화면에 안 나와요
        // 영상 정보 (크게 보기 옆 칸): title 제목, logline 한 줄 소개, concept 컨셉아트 파일 이름들
        var info = { title: it.title || '', logline: it.logline || '', concept: (it.concept || []).filter(Boolean),
                     awards: (it.awards || []).filter(Boolean) };   // awards 수상·선정 이력
        if (isVideoFile(link)) return extend({ type: 'video', file: link }, info);
        // 링크 + preview(짧은 소리 없는 영상 파일) → 영상 파일처럼: 첫 장면 · 마우스 올리면 미리 보기 · 누르면 크게 재생
        return extend({ type: 'video', vimeo: link, ratio: String(it.ratio || '16:9'), preview: it.preview || '' }, info);
      }
      var file = String(it);
      if (isVideoFile(file)) return { type: 'video', file: file };
      if (videoEmbed(file)) return { type: 'video', vimeo: file, ratio: '16:9' };   // 링크만 적어도 돼요
      return { type: /\.gif$/i.test(file) ? 'gif' : 'image', file: file };
    }
    function extend(a, b) { Object.keys(b).forEach(function (k) { a[k] = b[k]; }); return a; }
    // 영상의 컨셉아트로 지정한 그림은 영상 창에서만 보여요 → 작업물 모음과 Image 탭에서는 빼요
    // (확장자는 상관없이 이름으로 비교: "24.png" 와 "24.jpg" 는 같은 그림으로 봐요)
    function baseName(f) { return String(f).toLowerCase().replace(/\.(jpe?g|png)$/, ''); }
    function withoutConcept(list) {
      var used = {};
      list.forEach(function (x) { (x.concept || []).forEach(function (f) { used[baseName(f)] = true; }); });
      return list.filter(function (x) { return x.type === 'video' || !used[baseName(x.file)]; });
    }
    var groups = (p.groups || []).filter(function (g) { return g && g.images && g.images.length; });
    var items = [];
    if (groups.length) {
      groups.forEach(function (g, gi) {
        g.images.map(toItem).filter(Boolean).forEach(function (x) { x.tab = 'g' + gi; items.push(x); });
      });
      items = withoutConcept(items);
    } else {
      items = withoutConcept((p.images || []).map(toItem).filter(Boolean));
      items.forEach(function (x) { x.tab = x.type; });
    }
    if (!items.length) return;

    // All 에서 탭(종류 또는 묶음)이 골고루 섞이게: 탭마다 0~1 사이에 같은 간격으로 자리를 매겨 정렬해요
    // (탭 안의 번호 순서는 그대로. 탭끼리는 자리를 살짝 비켜서 같은 자리가 겹치지 않게)
    var SPREAD = { image: 0.5, gif: 0.25, video: 0.75 };
    groups.forEach(function (g, gi) { SPREAD['g' + gi] = (gi + 1) / (groups.length + 1); });
    var seen = {}, total = {};
    items.forEach(function (x) { total[x.tab] = (total[x.tab] || 0) + 1; });
    items.forEach(function (x, i) {
      seen[x.tab] = seen[x.tab] || 0;
      x._key = (seen[x.tab]++ + SPREAD[x.tab]) / total[x.tab];
      x._i = i;
    });
    items.sort(function (a, b) { return a._key - b._key || a._i - b._i; });

    // 탭 목록과 개수
    var counts = { all: items.length };
    items.forEach(function (x) { counts[x.tab] = (counts[x.tab] || 0) + 1; });
    var tabDefs = groups.length
      ? [{ key: 'all', label: 'All' }].concat(groups.map(function (g, gi) { return { key: 'g' + gi, label: g.name || ('Group ' + (gi + 1)) }; }))
      : PW_TYPES;
    tabDefs = tabDefs.filter(function (t) { return counts[t.key] > 0; });

    var wrap = el('section', 'pw');
    after.parentNode.insertBefore(wrap, after.nextSibling);

    // 탭 (All 말고 2가지 이상일 때만)
    var current = 'all';
    var tabs = [];
    if (tabDefs.length > 2) {
      var bar = el('div', 'pw-bar');
      var tablist = el('div', 'pw-tabs');
      tablist.setAttribute('role', 'tablist');
      tablist.setAttribute('aria-label', groups.length ? '작업 묶음' : '작업 종류');
      tabDefs.forEach(function (t) {
        var b = el('button', 'pw-tab');
        b.type = 'button';
        b.setAttribute('role', 'tab');
        b.setAttribute('data-type', t.key);
        var flower = el('span');
        flower.setAttribute('data-flower', 'yellow');
        flower.className = 'flower--tab';
        b.appendChild(flower);
        b.appendChild(el('span', 'pw-tab__label', t.label));
        b.appendChild(el('span', 'pw-tab__count', String(counts[t.key])));
        b.addEventListener('click', function () { setFilter(t.key); });
        tablist.appendChild(b);
        tabs.push(b);
      });
      bar.appendChild(tablist);
      wrap.appendChild(bar);
      UI.drawFlowers(bar);
    }

    // 작업물 모음 (같은 높이 줄: 칸마다 --r = 가로÷세로)
    var grid = el('div', 'pw-grid');
    wrap.appendChild(grid);
    var cells = items.map(function (x, k) {
      var cell;
      if (x.type === 'video' && (x.file || x.preview)) {
        // 영상 파일 / 미리 보기가 있는 영상 링크: 진짜 버튼 (누르면 크게 보기에서 소리와 함께 재생)
        var clipFile = x.file || x.preview;
        cell = el('button', 'pw-item pw-item--clip');
        cell.type = 'button';
        cell.setAttribute('aria-label', 'Video ' + clipFile + ' 크게 보기');
        if (x.ratio) {   // 영상을 불러오기 전에도 자리를 맞게 잡아 두기
          var rq = x.ratio.split(':');
          cell.style.setProperty('--r', Math.max(CLIP_MIN_RATIO, (parseFloat(rq[0]) || 16) / (parseFloat(rq[1]) || 9)));
        }
        x.src = imgPath(c.folder, p.id, clipFile);
        cell.appendChild(clipBox(cell, x.src, p.title + ' ' + clipFile, p.id + '/' + clipFile));
        var mark = el('span', 'pw-badge pw-badge--play');
        mark.setAttribute('aria-hidden', 'true');
        mark.innerHTML = '<svg viewBox="0 0 24 24"><path d="M9 7.5v9l7.5-4.5L9 7.5Z"/></svg>';
        cell.appendChild(mark);
        cell.addEventListener('click', function () { openViewer(cell); });
      } else if (x.type === 'video') {
        // 영상 링크 (Vimeo / YouTube): 칸 안에서 그 서비스 플레이어로 재생
        cell = el('div', 'pw-item pw-item--video');
        var r = x.ratio.split(':');
        var box = el('div', 'pw-video');
        box.style.aspectRatio = (parseFloat(r[0]) || 16) + ' / ' + (parseFloat(r[1]) || 9);
        cell.style.setProperty('--r', (parseFloat(r[0]) || 16) / (parseFloat(r[1]) || 9));
        if (videoEmbed(x.vimeo)) {
          lazyVideo(box, x.vimeo, { title: p.title + ' video ' + (k + 1), small: true });
        } else {
          box.appendChild(el('span', 'pw-video__empty', '영상 주소를 확인해 주세요'));
        }
        cell.appendChild(box);
      } else {
        var name = x.type === 'gif' ? 'GIF' : 'Image';
        cell = el('button', 'pw-item');
        cell.type = 'button';
        cell.setAttribute('aria-label', name + ' ' + x.file + ' 크게 보기');
        x.src = imgPath(c.folder, p.id, x.file);
        var media = UI.mediaBox('pw-media', x.src, p.title + ' ' + x.file, p.id + '/' + x.file, true);   // jpg / png 둘 다
        var pic = $('img', media);
        if (pic) pic.addEventListener('load', function () {
          if (pic.naturalWidth && pic.naturalHeight) cell.style.setProperty('--r', pic.naturalWidth / pic.naturalHeight);
        });
        cell.appendChild(media);
        if (x.type === 'gif') {
          var gif = el('span', 'pw-badge pw-badge--gif', 'GIF');
          gif.setAttribute('aria-hidden', 'true');
          cell.appendChild(gif);
        }
        cell.addEventListener('click', function () { openViewer(cell); });
      }
      cell.setAttribute('data-type', x.type);
      cell.setAttribute('data-tab', x.tab);
      cell._item = x;
      grid.appendChild(cell);
      return cell;
    });

    function setFilter(key) {
      current = key;
      tabs.forEach(function (b) {
        var on = b.getAttribute('data-type') === key;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      cells.forEach(function (cell) {
        cell.hidden = !(key === 'all' || cell.getAttribute('data-tab') === key);
      });
      justify();
      closeViewer();
    }

    // 같은 높이 줄: 보이는 칸을 순서대로 줄에 담고, 줄 높이가 목표(--row-h)에 가장 가깝게 되는 곳에서 줄을 나눠요.
    // 줄 높이 = (줄 폭 − 사이 간격) ÷ (칸들의 가로÷세로 합), 칸 폭 = 비율 × 줄 높이 → 줄 끝이 딱 맞아요
    function ratioOf(cell) { return parseFloat(cell.style.getPropertyValue('--r')) || 4 / 3; }
    function justify() {
      var W = grid.clientWidth;
      if (!W) return;
      var cs = getComputedStyle(grid);
      var H = parseFloat(cs.getPropertyValue('--row-h')) || 250;
      var gap = parseFloat(cs.columnGap) || 0;
      var row = [], sum = 0;
      function heightOf(n, s) { return (W - gap * (n - 1)) / s; }
      function place(list, h) {
        list.forEach(function (c) { c.style.width = Math.floor(ratioOf(c) * h * 100) / 100 + 'px'; });
      }
      cells.filter(function (c) { return !c.hidden; }).forEach(function (c) {
        var r = ratioOf(c);
        row.push(c);
        sum += r;
        var h = heightOf(row.length, sum);
        if (h > H) return;                     // 아직 자리가 남아요
        if (row.length > 1) {
          var hp = heightOf(row.length - 1, sum - r);
          if (Math.log(hp / H) < Math.log(H / h)) {   // 마지막 칸을 다음 줄로 넘기는 게 목표 높이에 더 가까우면
            row.pop();
            place(row, hp);
            row = [c];
            sum = r;
            h = heightOf(1, r);
            if (h > H) return;
          }
        }
        place(row, h);
        row = [];
        sum = 0;
      });
      if (row.length) place(row, Math.min(H, heightOf(row.length, sum)));   // 마지막 줄은 늘리지 않아요
    }
    var lastW = 0, queued = false;
    function relayout() {
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () { queued = false; justify(); });
    }
    // 그림·영상을 불러와 비율이 정해지면, 또 화면 폭이 바뀌면 다시 계산해요
    grid.addEventListener('load', relayout, true);
    grid.addEventListener('loadedmetadata', relayout, true);
    if (window.ResizeObserver) {
      new ResizeObserver(function () {
        if (grid.clientWidth !== lastW) { lastW = grid.clientWidth; relayout(); }
      }).observe(grid);
    } else {
      window.addEventListener('resize', relayout);
    }

    // 크게 보기 (이미지·GIF·영상 파일, 실제로 불러온 것만. 파일이 아직 없는 빈칸과 영상 링크는 빠져요)
    function viewable(c2) { return !c2.hidden && !!$('.pw-media.is-loaded', c2); }
    function openViewer(cell) {
      if (!viewable(cell)) return;
      var shown = cells.filter(viewable);
      shown.forEach(function (c2) { var v = $('video', c2); if (v) v.pause(); });
      getViewer().open(shown.map(function (c2) {
        var x = c2._item;
        var info = {
          title: x.title, logline: x.logline, awards: x.awards,
          concept: (x.concept || []).map(function (f) { return { src: imgPath(c.folder, p.id, f), alt: (x.title || p.title) + ' Concept Art' }; })
        };
        if (x.vimeo) {   // 미리 보기가 있는 영상 링크 → 크게 보기에서는 Vimeo 전체 영상
          var rr = x.ratio.split(':');
          return extend({ embed: x.vimeo, ratio: (parseFloat(rr[0]) || 16) / (parseFloat(rr[1]) || 9), alt: x.title || p.title + ' video' }, info);
        }
        var im = $('.pw-media img', c2);   // 확장자를 바꿔 찾은 경우 실제로 불러온 파일
        return extend({ src: im ? im.src : x.src, alt: p.title + ' ' + x.file, video: x.type === 'video' }, info);
      }), shown.indexOf(cell), cell);
    }
    function closeViewer() { getViewer().close(); }

    setFilter('all');
  }

  /* =========================================================
     Works 상세 (새 디자인): 위쪽 영역(대표 영상 + 정보) → 탭 + 내용
     탭 종류: row / row-natural / stack / compare / breakdown / impact
     ========================================================= */
  var PLAY_SVG = '<svg viewBox="0 0 22 24" aria-hidden="true"><path d="M3 2 L20 12 L3 22 Z"/></svg>';
  var ARROW_L = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 6.5 9 12l5.5 5.5"/></svg>';
  var ARROW_R = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 6.5 15 12l-5.5 5.5"/></svg>';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }
  function ratioCss(r, fallback) {
    var m = String(r || fallback || '16:9').split(':');
    return (parseFloat(m[0]) || 16) + ' / ' + (parseFloat(m[1]) || 9);
  }
  function flowerSpan(cls) {
    var f = el('span', cls);
    f.setAttribute('data-flower', 'yellow');
    return f;
  }

  function workDetail(root, p, c) {
    root.classList.add('project--work');
    ['.project__head', '[data-p-desc]', '[data-p-video]'].forEach(function (s) {
      var n = $(s, root);
      if (n) n.hidden = true;
    });
    var nav = $('[data-p-nav]', root);
    var src = function (file) { return imgPath(c.folder, p.id, file); };
    var hint = function (file) { return p.id + '/' + file; };
    var put = function (node) { root.insertBefore(node, nav); };

    if (p.sections) {                       // 03 Visual Development: 목차 + 작업들
      put(workTop(p, src, hint, { compact: true }));
      put(workSections(p, src, hint));
    } else if (p.parts) {                   // 05: 대표 영상 대신 두 덩어리
      put(workTop(p, src, hint, { noVideo: true, inline: true }));
      p.parts.forEach(function (part, k) { put(workPart(part, k, p, src, hint)); });
    } else {
      put(workTop(p, src, hint, {}));
      if (p.tabs && p.tabs.length) put(workTabs(p.tabs, p, src, hint));
    }
    UI.drawFlowers(root);
  }

  // 크게 보기 묶음: 같은 묶음 안에서 불러온 이미지끼리 넘겨 봐요
  function zoomGroup() {
    var items = [];
    return function add(btn, box, srcUrl, alt, caption) {
      var it = { btn: btn, box: box, src: srcUrl, alt: alt, caption: caption || '' };
      items.push(it);
      btn.addEventListener('click', function () {
        var shown = items.filter(function (x) { return x.box.classList.contains('is-loaded') && x.btn.offsetParent !== null; });
        var at = shown.indexOf(it);
        if (at < 0) return;                 // 파일이 아직 없는 빈칸은 열리지 않아요
        getViewer().open(shown.map(function (x) { return { src: x.src, alt: x.alt, caption: x.caption }; }), at, btn);
      });
    };
  }

  // 대표 영상 칸: 데모릴과 같은 '그림 + 재생 버튼' (lazyVideo). 영상 없음 → poster 또는 빈칸 + 재생 모양(누를 수 없음)
  function heroVideo(frame, url, posterSrc, posterHint, title) {
    lazyVideo(frame, url, { poster: posterSrc, hint: posterHint, title: title });
  }

  function workTop(p, src, hint, opt) {
    var top = el('section', 'wd-top' + (opt.compact ? ' wd-top--compact' : '') + (opt.noVideo || opt.compact ? ' wd-top--novideo' : ''));

    if (!opt.noVideo && !opt.compact) {
      var media = el('div', 'wd-hero');
      var frame = el('div', 'wd-hero__frame');
      heroVideo(frame, p.video, p.poster ? src(p.poster) : '', p.poster ? hint(p.poster) : '', p.title);
      media.appendChild(frame);
      top.appendChild(media);
    }

    var info = el('div', 'wd-info');
    var h1 = el('h1', 'wd-title');
    h1.appendChild(flowerSpan('flower--wtitle'));
    h1.appendChild(document.createTextNode(p.title));
    info.appendChild(h1);
    if (p.summary && !opt.compact && !opt.inline) info.appendChild(el('p', 'wd-summary', p.summary));

    var tagRow = el('div', 'wd-tagrow');
    if (p.tags && p.tags.length) {
      var ul = el('ul', 'wd-tags');
      ul.setAttribute('aria-label', '담당 역할');
      p.tags.forEach(function (t, k) { ul.appendChild(el('li', k === 0 ? 'is-main' : '', t)); });
      tagRow.appendChild(ul);
    }
    if (opt.inline || opt.compact) {
      var line = [p.client, p.year, opt.inline ? p.tools : ''].filter(Boolean).join(' · ');
      if (line) tagRow.appendChild(el('span', 'wd-metaline', line));
    }
    if (tagRow.children.length) info.appendChild(tagRow);

    if (!opt.inline && !opt.compact) {
      var dl = el('dl', 'wd-meta');
      [['Client', p.client], ['Year', p.year], ['Tools', p.tools]].forEach(function (row) {
        if (!row[1]) return;
        dl.appendChild(el('dt', '', row[0]));
        dl.appendChild(el('dd', '', row[1]));
      });
      if (dl.children.length) info.appendChild(dl);
    }
    if (p.description && !opt.compact) {
      var d = el('div', 'wd-desc');
      UI.paragraphs(d, p.description);
      info.appendChild(d);
    }
    top.appendChild(info);
    return top;
  }

  // 탭 줄 + 탭 내용 (내용은 처음 열 때 만들어요)
  var tabSeq = 0;
  function workTabs(tabs, p, src, hint) {
    var wrap = el('section', 'wd-tabs');
    var bar = el('div', 'pw-bar wd-bar');
    var list = el('div', 'pw-tabs');
    list.setAttribute('role', 'tablist');
    list.setAttribute('aria-label', p.title + ' 작업 보기');
    bar.appendChild(list);
    wrap.appendChild(bar);
    var base = 'wdtab' + (++tabSeq);
    var btns = [], panels = [];

    tabs.forEach(function (t, k) {
      var b = el('button', 'pw-tab');
      b.type = 'button';
      b.id = base + '-t' + k;
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-controls', base + '-p' + k);
      b.appendChild(flowerSpan('flower--tab'));
      b.appendChild(el('span', 'pw-tab__label', t.name));
      b.addEventListener('click', function () { select(k); });
      list.appendChild(b);
      btns.push(b);

      var panel = el('div', 'wd-panel');
      panel.id = base + '-p' + k;
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', b.id);
      panel.hidden = true;
      wrap.appendChild(panel);
      panels.push(panel);
    });

    list.addEventListener('keydown', function (e) {
      var k = btns.indexOf(document.activeElement);
      if (k < 0) return;
      var to = e.key === 'ArrowRight' ? k + 1 : e.key === 'ArrowLeft' ? k - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? btns.length - 1 : null;
      if (to === null) return;
      e.preventDefault();
      to = (to + btns.length) % btns.length;
      select(to);
      btns[to].focus();
    });

    function select(k) {
      btns.forEach(function (b, j) {
        var on = j === k;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-selected', on ? 'true' : 'false');
        b.tabIndex = on ? 0 : -1;
        var panel = panels[j];
        if (on) {
          if (!panel._built) { panel.appendChild(renderTab(tabs[j], p, src, hint, panel)); panel._built = true; UI.drawFlowers(panel); }
          panel.hidden = false;
          if (panel._onShow) panel._onShow();
        } else if (!panel.hidden) {
          panel.hidden = true;
          if (panel._onHide) panel._onHide();
        }
      });
      getViewer().close();
    }
    select(0);
    return wrap;
  }

  function renderTab(t, p, src, hint, panel) {
    var type = t.type || 'row';
    if (type === 'row') return rowTab(t, p, src, hint, false);
    if (type === 'row-natural') return rowTab(t, p, src, hint, true);
    if (type === 'stack') return stackTab(t, p, src, hint);
    if (type === 'compare') return compareTab(t, p, src, hint);
    if (type === 'breakdown') return breakdownTab(t, p, src, hint, panel);
    if (type === 'impact') return impactTab(t, p, src, hint);
    return el('p', 'wd-hint', '알 수 없는 탭 종류: ' + type);
  }

  // 가로 줄: 옆으로 넘기는 카드 (natural = 높이만 맞추고 원본 비율 그대로)
  function rowTab(t, p, src, hint, natural) {
    var frag = el('div', 'wd-rowwrap');
    frag.appendChild(el('p', 'wd-hint', t.hint || '옆으로 넘겨서 보기 →'));
    var track = el('div', 'wd-row' + (natural ? ' wd-row--natural' : ''));
    if (natural) track.style.setProperty('--h', t.height || 'clamp(220px, 26vw, 340px)');
    else track.style.setProperty('--card', t.width || '32%');
    var add = zoomGroup();
    (t.items || []).forEach(function (it, k) {
      if (typeof it === 'string') it = { file: it };
      var alt = (it.caption || t.name + ' ' + (k + 1));
      var fig = el('figure', 'wd-card');
      var btn = el('button', 'wd-zoom');
      btn.type = 'button';
      btn.setAttribute('aria-label', alt + ' 크게 보기');
      var box = UI.mediaBox(natural ? 'wd-media wd-media--natural' : 'wd-media', src(it.file), alt, hint(it.file));
      if (!natural) box.style.aspectRatio = ratioCss(t.ratio);
      if (it.fit === 'contain') box.classList.add('is-contain');
      btn.appendChild(box);
      fig.appendChild(btn);
      if (it.caption) fig.appendChild(el('figcaption', 'wd-cap', it.caption));
      add(btn, box, src(it.file), alt, it.caption);
      track.appendChild(fig);
    });
    frag.appendChild(track);
    return frag;
  }

  // 큰 이미지 위아래
  function stackTab(t, p, src, hint) {
    var wrap = el('div', 'wd-stack');
    var add = zoomGroup();
    (t.items || []).forEach(function (it, k) {
      if (typeof it === 'string') it = { file: it };
      var alt = it.caption || t.name + ' ' + (k + 1);
      var fig = el('figure', 'wd-card');
      var btn = el('button', 'wd-zoom');
      btn.type = 'button';
      btn.setAttribute('aria-label', alt + ' 크게 보기');
      var box = UI.mediaBox('wd-media wd-media--stack', src(it.file), alt, hint(it.file));
      box.style.aspectRatio = ratioCss(it.ratio || t.ratio);   // 장마다 비율이 다르면 { file, ratio }
      btn.appendChild(box);
      fig.appendChild(btn);
      if (it.caption) fig.appendChild(el('figcaption', 'wd-cap', it.caption));
      add(btn, box, src(it.file), alt, it.caption);
      wrap.appendChild(fig);
    });
    return wrap;
  }

  // 비교 슬라이더: 두 장을 겹치고 손잡이를 끌어 비교 (키보드 ← →, 터치 끌기)
  function compareSlider(before, after, ratio, label, src, hint) {
    var cmp = el('div', 'wd-compare');
    cmp.style.aspectRatio = ratioCss(ratio);
    cmp.style.setProperty('--pos', '50%');
    cmp.appendChild(UI.mediaBox('wd-compare__img', src(before.file), before.label || 'Before', hint(before.file)));
    var aft = UI.mediaBox('wd-compare__img wd-compare__after', src(after.file), after.label || 'After', hint(after.file));
    cmp.appendChild(aft);
    cmp.appendChild(el('span', 'wd-chip wd-chip--left', before.label || 'Before'));
    cmp.appendChild(el('span', 'wd-chip wd-chip--right', after.label || 'After'));
    var line = el('div', 'wd-compare__line');
    line.setAttribute('aria-hidden', 'true');
    line.appendChild(el('span', 'wd-compare__knob', '◀ ▶'));
    cmp.appendChild(line);
    var range = el('input', 'wd-compare__range');
    range.type = 'range';
    range.min = '0';
    range.max = '100';
    range.value = '50';
    range.setAttribute('aria-label', label || ((before.label || 'Before') + ' / ' + (after.label || 'After') + ' 비교 슬라이더'));
    range.addEventListener('input', function () { cmp.style.setProperty('--pos', range.value + '%'); });
    cmp.appendChild(range);
    return cmp;
  }
  function compareTab(t, p, src, hint) {
    var wrap = el('div', 'wd-comparewrap');
    if (t.note !== '') wrap.appendChild(el('p', 'wd-hint', t.note || '슬라이더를 좌우로 움직여 비교'));
    wrap.appendChild(compareSlider(t.before || {}, t.after || {}, t.ratio, t.label, src, hint));
    return wrap;
  }

  // Shot Breakdown: 한 컷을 단계별로 넘겨 보기 (단계마다 video 또는 gif)
  function breakdownTab(t, p, src, hint, panel) {
    var steps = t.steps || [];
    var at = 0;
    var wrap = el('div', 'wd-sb');
    var row = el('div', 'wd-sb__row');
    var prev = el('button', 'wd-sb__nav');
    prev.type = 'button';
    prev.setAttribute('aria-label', '이전 단계');
    prev.innerHTML = ARROW_L;
    var stage = el('div', 'wd-sb__stage');
    stage.style.aspectRatio = ratioCss(t.ratio);
    var next = el('button', 'wd-sb__nav');
    next.type = 'button';
    next.setAttribute('aria-label', '다음 단계');
    next.innerHTML = ARROW_R;
    row.appendChild(prev);
    row.appendChild(stage);
    row.appendChild(next);
    wrap.appendChild(row);
    var ol = el('ol', 'wd-sb__steps');
    ol.setAttribute('aria-label', '작업 단계');
    var stepBtns = steps.map(function (s, k) {
      var li = el('li');
      var b = el('button', 'wd-sb__step', String(k + 1).padStart(2, '0') + ' ' + s.label);
      b.type = 'button';
      b.addEventListener('click', function () { go(k); });
      li.appendChild(b);
      ol.appendChild(li);
      return b;
    });
    wrap.appendChild(ol);

    function draw() {
      stage.innerHTML = '';
      var s = steps[at];
      if (!s) return;
      if (s.video && videoEmbed(s.video)) putVideo(stage, s.video, s.label, { loop: true });
      else if (s.gif) stage.appendChild(UI.mediaBox('wd-sb__gif', src(s.gif), s.label, hint(s.gif)));
      var pill = el('span', 'wd-sb__label');
      pill.setAttribute('aria-live', 'polite');
      pill.innerHTML = '<span class="wd-sb__no">' + String(at + 1).padStart(2, '0') + '</span> ' + esc(s.label);
      stage.appendChild(pill);
      prev.disabled = at === 0;
      next.disabled = at === steps.length - 1;
      stepBtns.forEach(function (b, k) { b.setAttribute('aria-current', k === at ? 'true' : 'false'); });
    }
    function go(k) {
      k = Math.max(0, Math.min(steps.length - 1, k));
      if (k === at && stage.children.length) return;
      at = k;
      draw();
    }
    prev.addEventListener('click', function () { go(at - 1); });
    next.addEventListener('click', function () { go(at + 1); });
    wrap.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(at - 1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); go(at + 1); }
    });
    var tx = null;
    stage.addEventListener('touchstart', function (e) { tx = e.touches[0] ? e.touches[0].clientX : null; }, { passive: true });
    stage.addEventListener('touchend', function (e) {
      if (tx === null || !e.changedTouches[0]) return;
      var dx = e.changedTouches[0].clientX - tx;
      tx = null;
      if (Math.abs(dx) > 40) go(at + (dx < 0 ? 1 : -1));
    });
    // 다른 탭으로 가면 영상을 멈추고(지우고), 돌아오면 다시 넣어요
    panel._onHide = function () { stage.innerHTML = ''; };
    panel._onShow = function () { if (!stage.children.length) draw(); };
    draw();
    return wrap;
  }

  // Impact: 숫자 카드 + (선택) Shorts 카드 + (선택) Captures 반응 모음
  function impactTab(t, p, src, hint) {
    var wrap = el('div', 'wd-impact');
    if (t.stats && t.stats.length) {
      var grid = el('div', 'wd-stats');
      t.stats.forEach(function (s, k) {
        var card = el('div', 'wd-stat' + (k === 0 ? ' is-main' : ''));
        card.appendChild(el('p', 'wd-stat__value', s.value));
        if (s.label) card.appendChild(el('p', 'wd-stat__label', s.label));
        grid.appendChild(card);
      });
      wrap.appendChild(grid);
    }
    if (t.shorts && t.shorts.length) {
      var sh = el('div', 'wd-block');
      sh.appendChild(el('h3', 'wd-subtitle', 'Shorts'));
      var track = el('div', 'wd-row wd-row--shorts');
      t.shorts.forEach(function (s) {
        var fig = el('figure', 'wd-card wd-short');
        var a = el('a', 'wd-short__link');
        a.href = s.link || '#';
        a.target = '_blank';
        a.rel = 'noopener';
        a.setAttribute('aria-label', (s.caption || 'YouTube Shorts') + ' — 새 창에서 보기');
        if (s.poster) a.appendChild(UI.mediaBox('wd-poster', src(s.poster), s.caption || '', hint(s.poster)));
        var play = el('span', 'wd-play wd-play--small');
        play.setAttribute('aria-hidden', 'true');
        play.innerHTML = PLAY_SVG;
        a.appendChild(play);
        fig.appendChild(a);
        if (s.caption) fig.appendChild(el('figcaption', 'wd-cap', s.caption));
        track.appendChild(fig);
      });
      sh.appendChild(track);
      wrap.appendChild(sh);
    }
    if (t.captures && t.captures.length) {
      var cb = el('div', 'wd-block');
      cb.appendChild(el('h3', 'wd-subtitle', t.capturesTitle || 'Captures'));
      var cols = el('div', 'wd-captures');
      t.captures.forEach(function (col) {
        var box = el('div', 'wd-capcol');
        if (col.title) box.appendChild(el('p', 'wd-caplabel', col.title));
        if (col.headline) box.appendChild(el('h4', 'wd-capline', col.headline));
        (col.comments || []).forEach(function (cm) {
          var q = el('blockquote', 'wd-quote' + (cm.highlight ? ' is-pink' : ''));
          var pp = el('p');
          // __밑줄__ 로 감싼 부분은 핑크 밑줄
          pp.innerHTML = esc(cm.text).replace(/__(.+?)__/g, '<span class="wd-u">$1</span>');
          q.appendChild(pp);
          if (cm.source) q.appendChild(el('footer', '', cm.source));
          box.appendChild(q);
        });
        if (col.images && col.images.length) {
          box.appendChild(el('p', 'wd-caplabel wd-caplabel--gap', '원본 캡처'));
          var thumbs = el('div', 'wd-thumbs');
          var add = zoomGroup();
          col.images.forEach(function (im) {
            if (typeof im === 'string') im = { file: im };
            var alt = im.alt || '원본 캡처';
            var b = el('button', 'wd-zoom wd-thumb');
            b.type = 'button';
            b.setAttribute('aria-label', alt + ' 크게 보기');
            var m = UI.mediaBox('wd-media wd-media--thumb', src(im.file), alt, hint(im.file));
            b.appendChild(m);
            add(b, m, src(im.file), alt, '');
            thumbs.appendChild(b);
          });
          box.appendChild(thumbs);
        }
        cols.appendChild(box);
      });
      cb.appendChild(cols);
      wrap.appendChild(cb);
    }
    return wrap;
  }

  /* ---------- 03 Visual Development: 왼쪽 고정 목차 + 작업들 ----------
     sections: [ { name, toc(목차용 짧은 이름, 선택), date, roles,
                   rows: [ { images: [ { file, label, ratio } ], ratio, min } 또는 { compare: [ { before, after } ] } ] } ] */
  function workSections(p, src, hint) {
    var secs = p.sections || [];
    var wrap = el('div', 'vd');
    var aside = el('aside', 'vd-aside');
    var nav = el('nav');
    nav.setAttribute('aria-label', '작품 목차');
    var ol = el('ol', 'vd-toc');
    nav.appendChild(ol);
    aside.appendChild(nav);
    wrap.appendChild(aside);
    var body = el('div', 'vd-body');
    wrap.appendChild(body);

    var add = zoomGroup();           // 페이지 전체 이미지를 하나로 묶어 크게 보기에서 넘겨 봐요
    var links = [], nodes = [];
    secs.forEach(function (s, k) {
      var no = String(k + 1).padStart(2, '0');
      var id = 'vd-' + (k + 1);
      var li = el('li');
      var a = el('a', 'vd-toc__link');
      a.href = '#' + id;
      a.innerHTML = '<span class="vd-toc__no">' + no + '</span><span>' + esc(s.toc || s.name) + '</span>';
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        node.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'start' });
        setCurrent(k);
      });
      li.appendChild(a);
      ol.appendChild(li);
      links.push(a);

      var node = el('section', 'vd-sec');
      node.id = id;
      var head = el('header', 'vd-sec__head');
      head.appendChild(el('span', 'vd-sec__no', no));
      head.appendChild(el('h2', 'vd-sec__name', s.name));
      var sub = [s.date, s.roles].filter(Boolean).join(' · ');
      if (sub) head.appendChild(el('span', 'vd-sec__sub', sub));
      node.appendChild(head);

      var rows = el('div', 'vd-rows');
      (s.rows || []).forEach(function (r) {
        if (r.compare) {
          // layout: "column" → 한 줄에 하나씩 가로 꽉 차게 / zoom: true → 오른쪽 아래 돋보기로 크게 보기
          var cw = el('div', 'vd-compares' + (r.layout === 'column' ? ' vd-compares--column' : ''));
          r.compare.forEach(function (cp, j) {
            var lb = r.labels || ['Before', 'After'];
            var cmp = compareSlider({ file: cp.before, label: lb[0] }, { file: cp.after, label: lb[1] }, r.ratio || '16:9',
              s.name + ' ' + lb[0] + ' / ' + lb[1] + ' 비교 슬라이더', src, hint);
            if (r.zoom) {
              var zb = el('button', 'wd-compare__zoom');
              zb.type = 'button';
              zb.setAttribute('aria-label', s.name + ' ' + String(j + 1).padStart(2, '0') + ' ' + lb[0] + ' / ' + lb[1] + ' 크게 보기');
              zb.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6"/><path d="m15 15 4.5 4.5M10.5 8v5M8 10.5h5"/></svg>';
              zb.addEventListener('click', function () {
                getViewer().open([cp.before, cp.after].map(function (f, k) {
                  return { src: src(f), alt: s.name + ' ' + lb[k], caption: no + '  ' + s.name + ' · ' + lb[k] };
                }), 0, zb);
              });
              cmp.appendChild(zb);
            }
            cw.appendChild(cmp);
          });
          rows.appendChild(cw);
          return;
        }
        var imgs = (r.images || []).map(function (im) { return typeof im === 'string' ? { file: im } : im; });
        var single = imgs.length === 1 && !r.ratio && !imgs[0].ratio;
        var line = el('div', single ? 'vd-row vd-row--single' : 'vd-row');
        if (r.min) line.style.setProperty('--min', r.min);
        imgs.forEach(function (im, j) {
          var label = im.label || (s.name + ' ' + (j + 1));
          var btn = el('button', 'wd-zoom vd-tile');
          btn.type = 'button';
          btn.setAttribute('aria-label', label + ' 크게 보기');
          var box = UI.mediaBox(single ? 'wd-media vd-media--natural' : 'wd-media', src(im.file), s.name + ' ' + label, hint(im.file));
          if (!single) {
            var rt = String(im.ratio || r.ratio || '16:9').split(':');
            var w = parseFloat(rt[0]) || 16, h = parseFloat(rt[1]) || 9;
            box.style.aspectRatio = w + ' / ' + h;
            btn.style.flexGrow = String(Math.round(w / h * 100));   // 같은 줄 높이가 맞게 비율대로 나눠요
          }
          btn.appendChild(box);
          add(btn, box, src(im.file), s.name + ' ' + label, no + '  ' + s.name + (im.label ? ' · ' + im.label : ''));
          line.appendChild(btn);
        });
        rows.appendChild(line);
      });
      node.appendChild(rows);
      body.appendChild(node);
      nodes.push(node);
    });

    // ↑ Top 버튼 (스크롤을 따라와요)
    var topWrap = el('div', 'vd-topwrap');
    var topBtn = el('a', 'vd-top');
    topBtn.href = '#';
    topBtn.setAttribute('aria-label', '맨 위로');
    topBtn.innerHTML = '<span aria-hidden="true">↑</span><span>Top</span>';
    topBtn.addEventListener('click', function (e) {
      e.preventDefault();
      var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: still ? 'auto' : 'smooth' });
    });
    topWrap.appendChild(topBtn);
    body.appendChild(topWrap);

    // 지금 보고 있는 작업을 목차에 표시
    function setCurrent(k) {
      links.forEach(function (a, j) { a.setAttribute('aria-current', j === k ? 'true' : 'false'); });
    }
    // 화면 위에서 40% 선을 지난 마지막 작업 = 지금 보는 작업 (맨 아래까지 내리면 마지막 작업)
    var ticking = false;
    function update() {
      ticking = false;
      if (!nodes.length) return;
      var line = window.innerHeight * 0.4, k = 0;
      nodes.forEach(function (n, j) { if (n.getBoundingClientRect().top <= line) k = j; });
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4 &&
          nodes[nodes.length - 1].getBoundingClientRect().top < window.innerHeight) k = nodes.length - 1;
      setCurrent(k);
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', update);
    setCurrent(0);
    setTimeout(update, 0);
    return wrap;
  }

  /* ---------- 05: 대표 영상 대신 두 덩어리(parts) ----------
     parts: [ { title, sub, video, poster, tabs: [...] }   ← 영상 + 탭
              { title, sub, compare: { before, after, labels, ratio }, link: { url, thumb, label } } ] ← 비교 + 링크 카드 */
  function workPart(part, k, p, src, hint) {
    var sec = el('section', 'wp');
    var head = el('header', 'vd-sec__head wp__head');
    head.appendChild(el('span', 'vd-sec__no', String(k + 1).padStart(2, '0')));
    head.appendChild(el('h2', 'wp__title', part.title));
    if (part.sub) head.appendChild(el('span', 'vd-sec__sub', part.sub));
    sec.appendChild(head);

    if (part.images) {
      // 이미지 2장 크게 나란히(휴대폰은 위아래) → 아래에 영상 링크 카드. 눌러서 크게 보기
      var cols = el('div', 'wp__pair');
      var add = zoomGroup();
      part.images.forEach(function (it, k) {
        if (typeof it === 'string') it = { file: it };
        var alt = it.caption || part.title + ' ' + (k + 1);
        var fig = el('figure', 'wd-card');
        var btn = el('button', 'wd-zoom');
        btn.type = 'button';
        btn.setAttribute('aria-label', alt + ' 크게 보기');
        var box = UI.mediaBox('wd-media', src(it.file), alt, hint(it.file));
        box.style.aspectRatio = ratioCss(part.ratio);
        btn.appendChild(box);
        fig.appendChild(btn);
        if (it.caption) fig.appendChild(el('figcaption', 'wd-cap', it.caption));
        add(btn, box, src(it.file), alt, it.caption);
        cols.appendChild(fig);
      });
    } else if (part.compare) {
      var cols = el('div', 'wp__cols');
      var left = el('div', 'wp__main');
      var cp = part.compare;
      var lb = cp.labels || ['Before', 'After'];
      left.appendChild(compareSlider({ file: cp.before, label: lb[0] }, { file: cp.after, label: lb[1] }, cp.ratio || '16:9',
        part.title + ' ' + lb[0] + ' / ' + lb[1] + ' 비교 슬라이더', src, hint));
      cols.appendChild(left);
    }
    if (part.images || part.compare) {
      if (part.link) {
        var lk = part.link;
        var a = el(lk.url ? 'a' : 'div', 'wp__link');
        if (lk.url) { a.href = lk.url; a.target = '_blank'; a.rel = 'noopener'; }
        var th = el('div', 'wp__thumb');
        if (lk.thumb) th.appendChild(UI.mediaBox('wd-poster', src(lk.thumb), lk.label || '', hint(lk.thumb)));
        var pl = el('span', 'wd-play wd-play--small');
        pl.setAttribute('aria-hidden', 'true');
        pl.innerHTML = PLAY_SVG;
        th.appendChild(pl);
        a.appendChild(th);
        a.appendChild(el('span', 'wp__linktext', (lk.label || '영상 보기') + (lk.url ? ' ↗' : '')));
        cols.appendChild(a);
      }
      sec.appendChild(cols);
    } else {
      var media = el('div', 'wd-hero wp__hero');
      var frame = el('div', 'wd-hero__frame');
      heroVideo(frame, part.video, part.poster ? src(part.poster) : '', part.poster ? hint(part.poster) : '', part.title);
      media.appendChild(frame);
      sec.appendChild(media);
      if (part.tabs && part.tabs.length) {
        var tw = workTabs(part.tabs, { title: part.title }, src, hint);
        tw.classList.add('wp__tabs');
        sec.appendChild(tw);
      }
    }
    return sec;
  }

  function navLink(p, dir, label) {
    var a = el('a', 'project__nav-link project__nav-link--' + dir);
    a.href = 'project.html?id=' + encodeURIComponent(p.id);
    a.appendChild(el('span', 'project__nav-label', label));
    a.appendChild(el('span', 'project__nav-title', p.title));
    return a;
  }

  /* =========================================================
     About 페이지
     ========================================================= */
  // My Services 아이콘 (직접 그린 선 아이콘, About 페이지에서 써요)
  var SERVICE_ICONS = {
    // 통통 튀는 공 + 움직임 자국
    animation: '<circle cx="17" cy="7.5" r="3"/><path d="M3.5 19.5c1.6-6 4.2-9.5 9-11.2" stroke-dasharray="1.6 2.6"/><path d="M3 20.5h18"/><path d="M20.8 3.2l1-1M21.5 6.5h1.2"/>',
    // 작은 콘티 칸 3개 + 넘기는 화살표
    storyboard: '<rect x="2.8" y="4.5" width="8.2" height="6.2" rx="1.6"/><rect x="13" y="4.5" width="8.2" height="6.2" rx="1.6"/><rect x="2.8" y="13.3" width="8.2" height="6.2" rx="1.6"/><path d="M14 16.4h6M18 14.2l2.2 2.2-2.2 2.2"/>',
    // 팔레트 + 물감 방울
    visual: '<path d="M12 3.5c-4.8 0-8.5 3.6-8.5 8 0 4.3 3.4 8 7.6 8 1.3 0 1.9-.9 1.5-2-.4-1.2.3-2.4 1.6-2.4h2.1c2.3 0 4.2-1.8 4.2-4.1 0-4.2-3.8-7.5-8.5-7.5Z"/><circle cx="8" cy="11" r="1.2"/><circle cx="11" cy="7.6" r="1.2"/><circle cx="15.3" cy="8.4" r="1.2"/>',
    // 연필 + 반짝이
    illustration: '<path d="M4.5 19.5l1-4.2 9.8-9.8 3.2 3.2-9.8 9.8-4.2 1Z"/><path d="M13.6 7.2l3.2 3.2"/><path d="M19.5 14.5v4M17.5 16.5h4"/>',
  };

  function aboutPage() {
    var A = SITE.about || {};
    document.title = (A.title || 'About') + ' — ' + SITE.name;

    setText('[data-about-label]', A.title || 'About');
    UI.paragraphs($('[data-about-intro]'), A.intro);

    // My Services (자기소개 아래, Experience 위)
    setText('[data-services-title]', SITE.servicesTitle || 'My Services');
    var grid = $('[data-services]');
    (SITE.services || []).forEach(function (s) {
      var card = el('div', 'service');
      var icon = el('div', 'service__icon');
      icon.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' + (SERVICE_ICONS[s.icon] || SERVICE_ICONS.illustration) + '</svg>';
      card.appendChild(icon);
      card.appendChild(el('h3', 'service__title', s.title));
      if (s.text) card.appendChild(el('p', 'service__text', s.text));
      grid.appendChild(card);
    });

    // 사진 3장 (프로필 사진은 CSS 로 자동 흑백)
    var photos = A.photos || {};
    [['profile', '프로필 사진'], ['selfPortrait', '내가 그린 나'], ['working', '작업하는 모습']].forEach(function (ph) {
      var slot = $('[data-photo="' + ph[0] + '"]');
      if (!slot) return;
      var src = photos[ph[0]];
      slot.appendChild(UI.mediaBox('about-photo__img', src, ph[1], src ? src.split('/').pop() : ''));
    });

    // 경력 + 학력 (같은 모양: 굵은 첫 줄 → 아래에 "진한 글자 · 회색 글자" 한 줄)
    function fillList(list, items) {
      items.forEach(function (x) {
        var li = el('li', 'exp__item');
        li.appendChild(el('span', 'exp__head', x.head));
        var sub = el('p', 'exp__sub');
        if (x.strong) sub.appendChild(el('span', 'exp__role', x.strong));
        if (x.strong && x.soft) sub.appendChild(el('span', 'exp__dot', ' · '));
        if (x.soft) sub.appendChild(el('span', 'exp__company', x.soft));
        if (x.strong || x.soft) li.appendChild(sub);
        list.appendChild(li);
      });
    }
    // 경력: 대표 작업(굵게) → 직무 · 회사
    setText('[data-exp-title]', A.experienceTitle || 'Experience');
    fillList($('[data-exp-list]'), (A.experience || []).map(function (x) {
      return x.note ? { head: x.note, strong: x.role, soft: x.company }
                    : { head: x.role, soft: x.company };
    }));
    // 학력: 학교 이름(굵게) → 학위 · 전공
    setText('[data-edu-title]', A.educationTitle || 'Education');
    fillList($('[data-edu-list]'), (A.education || []).map(function (x) {
      return { head: x.school, soft: x.degree };
    }));
    setupResume($('[data-resume]'));

  }

  /* =========================================================
     Contact 페이지
     ========================================================= */
  function contactPage() {
    var C = SITE.contact || {};
    document.title = (C.title || 'Contact') + ' — ' + SITE.name;

    // 제목 + 작은 문구 + 이메일
    setText('[data-contact-title]', C.title || 'Contact');
    setText('[data-contact-intro]', C.intro);
    $('[data-contact-intro]').hidden = !C.intro;
    var mail = $('[data-contact-email]');
    mail.textContent = SITE.email;
    mail.href = 'mailto:' + SITE.email;

    // 맨 아래 작은 링크
    document.querySelectorAll('[data-contact-social]').forEach(function (a) {
      var url = UI.fullUrl(SITE[a.getAttribute('data-contact-social')]);
      if (url) a.href = url; else a.hidden = true;
    });
    setupResume($('[data-resume]'));

    contactForm(C);
  }

  /* ---------- Contact 입력 양식 (Web3Forms 로 보내기) ---------- */
  function contactForm(C) {
    var form = $('[data-contact-form]');
    var status = $('[data-form-status]');
    var button = $('button[type=submit]', form);
    var openedAt = Date.now();
    var FIELDS = ['name', 'email', 'message'];
    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    FIELDS.forEach(function (key) {
      var t = C[key] || {};
      $('[data-label=' + key + ']').textContent = t.label || key;
      form.elements[key].placeholder = t.placeholder || '';
      // 다시 고쳐 쓰면 안내를 지워요
      form.elements[key].addEventListener('input', function () { showError(key, ''); });
    });
    setText('[data-submit-label]', C.submit || '보내기');
    if (UI.redrawInk) UI.redrawInk();

    function showError(key, text) {
      var input = form.elements[key];
      $('[data-error=' + key + ']').textContent = text;
      input.classList.toggle('is-invalid', !!text);
      if (text) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
    }

    function setStatus(state, text) {
      status.className = 'form-status' + (state ? ' is-' + state : '');
      status.textContent = '';
      // 문구 속 {email} 자리에 누를 수 있는 이메일 주소를 넣어요
      var parts = (text || '').split('{email}');
      parts.forEach(function (part, i) {
        if (i > 0) {
          var a = el('a', '', SITE.email);
          a.href = 'mailto:' + SITE.email;
          status.appendChild(a);
        }
        status.appendChild(document.createTextNode(part));
      });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (button.disabled) return;

      // 1) 세 칸이 잘 채워졌는지 확인
      var values = {}, firstBad = null;
      FIELDS.forEach(function (key) {
        var v = form.elements[key].value.trim();
        values[key] = v;
        var bad = !v || (key === 'email' && !EMAIL_RE.test(v));
        showError(key, bad ? ((C[key] || {}).error || 'Please check this field.') : '');
        if (bad && !firstBad) firstBad = form.elements[key];
      });
      if (firstBad) { setStatus('', ''); firstBad.focus(); return; }

      // 2) 스팸 방지: 함정 칸이 체크됐거나, 페이지를 연 지 2초도 안 돼서 누르면 보내지 않아요
      if (form.elements.botcheck.checked || Date.now() - openedAt < 2000) {
        setStatus('success', C.success);
        return;
      }

      // 3) Web3Forms 로 보내기
      button.disabled = true;
      setStatus('sending', C.sending || '보내는 중…');
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: C.formKey,
          subject: (C.mailSubject || 'New message from portfolio') + ' — ' + values.name,
          from_name: values.name,
          name: values.name,
          email: values.email,
          message: values.message,
          botcheck: false,
        }),
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (!data || !data.success) throw new Error('failed');
          setStatus('success', C.success);
          form.reset();
        })
        .catch(function () {
          setStatus('error', C.error);
        })
        .then(function () { button.disabled = false; });
    });
  }

  /* ---------- 지금 페이지에 맞는 내용 채우기 (맨 마지막에 실행) ---------- */
  if (page === 'home') homePage();
  if (page === 'project') projectPage();
  if (page === 'about') aboutPage();
  if (page === 'contact') contactPage();
})();
