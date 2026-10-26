(function(){
  var $=function(s,r){return(r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};

  // Header: nền xanh khi cuộn
  var hdr=$('#hdr');
  function onScroll(){
    hdr.classList.toggle('is-stuck',window.scrollY>60);
    var tb=$('#top-btn');if(tb)tb.style.visibility=window.scrollY>400?'visible':'hidden';
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

  // Đối tác: tab lọc + chỉ hiện 3 khối đầu, "Xem thêm" để mở rộng
  var PARTNER_FIRST=3,pBtn=$('#p-more');
  $$('[data-tabs]').forEach(function(box){
    var items=$$(box.getAttribute('data-tabs')),key='all',open=false;
    function apply(){
      var n=0;
      items.forEach(function(i){
        var m=key==='all'||i.dataset.k===key;
        var show=m&&(open||n<PARTNER_FIRST);
        if(m)n++;
        i.classList.toggle('is-hidden',!show);
      });
      pBtn.hidden=n<=PARTNER_FIRST;
      pBtn.classList.toggle('is-open',open);
      $('span',pBtn).textContent=open?'THU GỌN':'XEM THÊM';
    }
    $$('.tab',box).forEach(function(b){
      b.addEventListener('click',function(){
        $$('.tab',box).forEach(function(x){x.classList.remove('is-active')});
        b.classList.add('is-active');
        key=b.dataset.k;open=false;apply();
      });
    });
    pBtn.addEventListener('click',function(){open=!open;apply()});
    apply();
  });

  // (chỉ chạy ở trang chủ)
  if($('#programs')){
  // Chương trình đào tạo: tab cơ sở + tìm kiếm + xem thêm lĩnh vực
  var FIELD_LIMIT=3,tab='ksa',expanded=false,q=$('#q'),moreBtn=$('#more-fields');
  var panels={ksa:$('#tabContentKsa'),ksv:$('#tabContentKsv')};
  var campusOf={ksa:'hcm',ksv:'vl'};

  function filterTable(t,kw,exp){
    var gi=-1,cur=null,reg=null,grps=[],regs=[],total=0;
    $$('tbody tr',t).forEach(function(r){
      if(r.classList.contains('main-region-heading')){reg={el:r,n:0};regs.push(reg);return}
      if(r.classList.contains('section-heading')){gi++;cur={el:r,n:0,reg:reg};grps.push(cur);return}
      var ok=(!kw||r.textContent.toLowerCase().indexOf(kw)>-1)&&(exp||gi<FIELD_LIMIT);
      r.style.display=ok?'':'none';
      if(ok){total++;if(cur)cur.n++}
    });
    grps.forEach(function(g){g.el.style.display=g.n?'':'none';if(g.n&&g.reg)g.reg.n++});
    regs.forEach(function(g){g.el.style.display=g.n?'':'none'});
    return total;
  }
  function render(){
    var kw=q.value.trim().toLowerCase(),exp=expanded||!!kw;
    Object.keys(panels).forEach(function(k){panels[k].classList.toggle('active',k===tab)});
    var p=panels[tab];
    p.classList.toggle('is-collapsed',!exp);
    $$('table',p).forEach(function(t){
      var n=filterTable(t,kw,exp);
      if(t.classList.contains('isb-table')){$('.isb-block-wrapper',p).style.display=n?'':'none'}
    });
    moreBtn.hidden=!!kw;
    moreBtn.classList.toggle('is-open',expanded);
    $('span',moreBtn).textContent=expanded?'THU GỌN':'XEM THÊM LĨNH VỰC';
  }
  $$('#programs [data-tab]').forEach(function(b){
    b.addEventListener('click',function(){
      $$('#programs [data-tab]').forEach(function(x){x.classList.remove('is-active')});
      b.classList.add('is-active');tab=b.dataset.tab;render();
    });
  });
  moreBtn.addEventListener('click',function(){
    expanded=!expanded;render();
    if(!expanded)$('#programs').scrollIntoView({behavior:'smooth'});
  });
  q.addEventListener('input',render);render();

  // Popup "Xem điều kiện xét tuyển" (thẻ <dialog>), đổi nội dung theo tab đang chọn
  var modal=$('#cond-modal');
  var campusName={hcm:'Học tại TP. Hồ Chí Minh (KSA)',vl:'Học tại Vĩnh Long – UEH Mekong (KSV)'};
  $('#open-cond').addEventListener('click',function(){
    var campus=campusOf[tab];
    $$('.cond',modal).forEach(function(b){b.hidden=b.dataset.campus!==campus});
    $('#cond-campus').textContent=campusName[campus];
    modal.showModal();
  });
  $('#close-cond').addEventListener('click',function(){modal.close()});
  $('#ok-cond').addEventListener('click',function(){modal.close()});
  modal.addEventListener('click',function(e){if(e.target===modal)modal.close()}); // bấm ra ngoài để đóng

  }

  // Video giới thiệu: nút tạm dừng / phát (điều khiển YouTube qua postMessage)
  var vFrame=$('#uehYoutubePlayer'),vBtn=$('#videoPlayPauseBtn'),vIcon=$('#videoCtrlIcon'),vPlaying=true;
  function ytCmd(fn){if(vFrame&&vFrame.contentWindow)vFrame.contentWindow.postMessage(JSON.stringify({event:'command',func:fn,args:''}),'*')}
  if(vBtn){vBtn.addEventListener('click',function(){
    vPlaying=!vPlaying;ytCmd(vPlaying?'playVideo':'pauseVideo');
    vIcon.className='fa-solid '+(vPlaying?'fa-pause':'fa-play');
    vBtn.classList.toggle('is-paused',!vPlaying);
    vBtn.setAttribute('aria-label',vPlaying?'Tạm dừng video':'Phát video');
  })}

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
  var f=$('#reg'),err=f&&$('.err',f);
  if(f)f.addEventListener('submit',function(e){
    e.preventDefault();
    var bad=$$('[required]',f).some(function(i){return!i.value.trim()||!i.checkValidity()});
    err.textContent=bad?'Vui lòng nhập đủ Họ tên, Email và Điện thoại hợp lệ.':'Đã gửi đăng ký. UEH sẽ liên hệ bạn sớm.';
  });

  // Form tìm kiếm FAQ (chưa nối backend)
  var fq=$('#faq-form');if(fq)fq.addEventListener('submit',function(e){e.preventDefault()});

  // Lên đầu trang
  if($('#top-btn'))$('#top-btn').addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'})});
})();
