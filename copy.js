// 복사 버튼: data-copy="원문 요소 id". 원문은 <script type="text/plain">에 둔다.
(function () {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  document.body.append(toast);
  let timer;
  function say(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(timer);
    timer = setTimeout(() => toast.classList.remove('show'), 2400);
  }

  // 휴대폰 브라우저마다 지원이 달라 clipboard API가 안 되면 예전 방식으로 한 번 더 시도한다.
  function legacyCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.top = '-1000px';
    document.body.append(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    ta.remove();
    return ok;
  }

  async function copy(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try { await navigator.clipboard.writeText(text); return true; } catch (e) { /* 아래로 */ }
    }
    return legacyCopy(text);
  }

  // 긴 원문 펼치기
  document.querySelectorAll('[data-expand]').forEach(b => {
    const box = document.getElementById(b.dataset.expand);
    b.addEventListener('click', () => {
      const open = box.classList.toggle('open');
      b.textContent = open ? '접기' : '전체 보기';
    });
  });

  document.querySelectorAll('[data-copy]').forEach(btn => {
    const text = document.getElementById(btn.dataset.copy).textContent.trim();
    const lbl = btn.querySelector('.lbl');
    const label = lbl.textContent;
    const view = document.querySelector('[data-view="' + btn.dataset.copy + '"]');
    if (view) view.textContent = text;

    btn.addEventListener('click', async () => {
      if (await copy(text)) {
        btn.classList.add('done');
        lbl.textContent = '복사했어요';
        say('복사했어요. ChatGPT 입력창에 붙여 넣으세요.');
        setTimeout(() => { btn.classList.remove('done'); lbl.textContent = label; }, 2500);
      } else {
        say('복사가 안 됐어요. 위 글을 길게 눌러 복사해 주세요.');
        if (view) view.classList.add('open');
      }
    });
  });

  document.querySelectorAll('a[download]').forEach(a => {
    a.addEventListener('click', () => say('내려받는 중이에요. 저장을 눌러 주세요.'));
  });
})();
