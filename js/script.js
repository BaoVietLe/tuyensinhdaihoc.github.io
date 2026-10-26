(function(){
  var $=function(s,r){return(r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};

  // Header: nền xanh khi cuộn
  var hdr=$('#hdr');
  function onScroll(){
    hdr.classList.toggle('is-stuck',window.scrollY>60);
    $('#top-btn').style.visibility=window.scrollY>400?'visible':'hidden';
  }
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();

  // Menu mobile
  var tg=$('.nav__toggle'),ul=$('.nav ul');
  tg.addEventListener('click',function(){
    var o=ul.classList.toggle('is-open');tg.setAttribute('aria-expanded',o);
  });
  $$('.nav ul a').forEach(function(a){a.addEventListener('click',function(){ul.classList.remove('is-open')})});

  // Carousel: mũi tên cuộn ngang
  $$('.carousel').forEach(function(c){
    var t=$('.carousel__track',c);
    var step=function(d){t.scrollBy({left:d*(t.clientWidth*0.8),behavior:'smooth'})};
    var p=$('.arrow--prev',c),n=$('.arrow--next',c);
    if(p)p.addEventListener('click',function(){step(-1)});
    if(n)n.addEventListener('click',function(){step(1)});
  });

  // Tab lọc đối tác (Tất cả / Hiệp hội / Viện / Liên đoàn)
  $$('[data-tabs]').forEach(function(box){
    var items=$$(box.getAttribute('data-tabs'));
    $$('.tab',box).forEach(function(b){
      b.addEventListener('click',function(){
        $$('.tab',box).forEach(function(x){x.classList.remove('is-active')});
        b.classList.add('is-active');
        var k=b.dataset.k;
        items.forEach(function(i){i.classList.toggle('is-hidden',k!=='all'&&i.dataset.k!==k)});
      });
    });
  });

  // Chương trình đào tạo: tab cơ sở + tìm kiếm
  var rows=$$('#tbl tbody tr[data-c]'),groups=$$('#tbl tr.group'),campus='hcm',q=$('#q');
  function render(){
    var kw=q.value.trim().toLowerCase();
    rows.forEach(function(r){
      var ok=r.dataset.c===campus&&(!kw||r.textContent.toLowerCase().indexOf(kw)>-1);
      r.style.display=ok?'':'none';
    });
    groups.forEach(function(g){
      var n=g.nextElementSibling,has=false;
      while(n&&!n.classList.contains('group')){if(n.style.display!=='none')has=true;n=n.nextElementSibling}
      g.style.display=has?'':'none';
    });
  }
  $$('[data-campus]').forEach(function(b){
    b.addEventListener('click',function(){
      $$('[data-campus]').forEach(function(x){x.classList.remove('is-active')});
      b.classList.add('is-active');campus=b.dataset.campus;render();
    });
  });
  q.addEventListener('input',render);render();

  // Popup riêng "Xem điều kiện xét tuyển" (thẻ <dialog>)
  var modal=$('#cond-modal');
  $('#open-cond').addEventListener('click',function(){modal.showModal()});
  $('#close-cond').addEventListener('click',function(){modal.close()});
  $('#ok-cond').addEventListener('click',function(){modal.close()});
  modal.addEventListener('click',function(e){if(e.target===modal)modal.close()}); // bấm ra ngoài để đóng

  // Tab chuyển nội dung (Tin tuyển sinh / Tin hướng nghiệp)
  $$('[data-panel]').forEach(function(b){
    b.addEventListener('click',function(){
      var bar=b.parentNode;
      $$('[data-panel]',bar).forEach(function(x){
        var on=x===b;
        x.classList.toggle('is-active',on);x.setAttribute('aria-selected',on);
        $('#'+x.dataset.panel).hidden=!on;
      });
    });
  });

  // Form đăng ký
  var f=$('#reg'),err=$('.err',f);
  f.addEventListener('submit',function(e){
    e.preventDefault();
    var bad=$$('[required]',f).some(function(i){return!i.value.trim()||!i.checkValidity()});
    err.textContent=bad?'Vui lòng nhập đủ Họ tên, Email và Điện thoại hợp lệ.':'Đã gửi đăng ký. UEH sẽ liên hệ bạn sớm.';
  });

  // Form tìm kiếm FAQ (chưa nối backend)
  $('#faq-form').addEventListener('submit',function(e){e.preventDefault()});

  // Lên đầu trang
  $('#top-btn').addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'})});
})();
