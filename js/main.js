const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const nav=$('.nav'),hero=$('#hero');
function onScroll(){
  const past=scrollY>hero.offsetHeight-nav.offsetHeight;
  nav.classList.toggle('solid',past);nav.classList.toggle('top',!past);
  let cur='';$$('main section[id]').forEach(s=>{if(scrollY>=s.offsetTop-nav.offsetHeight-10)cur=s.id});
  $$('.nav-links a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+cur));
}
addEventListener('scroll',onScroll,{passive:true});onScroll();
// Render dữ liệu lặp
const render=(id,arr,fn)=>$(id).innerHTML=arr.map(fn).join('');
render('#kp',['Vì sao tôi là người tôi chọn tại UEH','Học đón đầu tương lai, nâng lực công nghệ và bền vững','Học thật, làm thật, đa dạng loại hình đào tạo','Bắt đầu hành trình "Tôi là người tôi chọn"','Học tập không giới hạn, gắn với đa ngành, đa lĩnh vực'],(t,i)=>`<div class="col-6 col-md"><div class="card-soft"><span class="num">${i+1}</span><p>${t}</p><span class="arrow">↗</span></div></div>`);
const pc=['#F5B820','#F26F33','#056B75','#2a2a2a','#D62839','#7BAE3C','#F58A1F','#1f3c88'];
render('#prog',['Chương trình Chuẩn','Tiếng Anh Bán Phần','Tiếng Anh Toàn Phần','Asia Co-op','Tài năng UEH-ISB','Song ngành Tích hợp','Song bằng Quốc tế','Trao đổi & Liên kết Quốc tế'],(t,i)=>`<div class="col-6 col-md-3"><div class="prog" style="background:${pc[i]}">${t}<span class="arrow">↗</span></div></div>`);
render('#assoc',['Hiệp hội Kế toán Công chứng Úc (CPA)','Viện CFA Hoa Kỳ','Viện kế toán công chứng Anh và xứ Wales (ICAEW)'],t=>`<div class="col-md-4"><div class="tile"><div class="img-ph"></div><span>${t}</span></div></div>`);
render('#career',['Chương trình Học kỳ doanh nghiệp','Tham quan doanh nghiệp','UEH Career Fair','Cổng thông tin việc làm UEH'],t=>`<div class="col-md-4"><div class="tile"><div class="img-ph"></div><span>${t}</span></div></div>`);
render('#steps',['Thấu hiểu bản thân, lựa chọn ngành','Tìm hiểu chương trình đào tạo','Chọn phương thức xét tuyển'],(t,i)=>`<div class="col-md-4"><small>Bước ${i+1}</small><div class="card-soft mt-2"><div class="img-ph" style="min-height:150px"></div><p class="mt-2">${t}</p></div></div>`);
render('#news',[1,2,3],()=>`<div class="col-md-4 d-flex gap-h"><div class="img-ph" style="width:110px;min-height:80px"></div><p class="h4" style="font-style:normal">UEH thông báo nộp phiếu điểm thi môn Vẽ mỹ thuật đối với thí sinh sử dụng kỳ thi xét tuyển khóa 52</p></div>`);
// Tabs / filter
$$('[data-tabs]').forEach(g=>g.addEventListener('click',e=>{const b=e.target.closest('[data-t]');if(!b)return;e.preventDefault();$$('[data-t]',g).forEach(x=>x.classList.toggle('on',x===b))}));
// Lọc bảng
$('#q').addEventListener('input',e=>$$('#tb tr.row').forEach(r=>r.hidden=!r.textContent.toLowerCase().includes(e.target.value.toLowerCase())));
$('#frm').addEventListener('submit',e=>{e.preventDefault();alert('Cảm ơn bạn đã đăng ký tư vấn!')});
