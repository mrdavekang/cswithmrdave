'use strict';
const B=(en,ms,zh)=>({en,ms,zh});
const L={
 title:B('Build a helpdesk adviser','Bina penasihat meja bantuan','编写服务台建议程序'),
 wagba:B('Build and test a Python program that takes input, calculates time and gives two different pieces of advice.','Bina dan uji atur cara Python yang menerima input, mengira masa dan memberi dua nasihat berbeza.','编写并测试 Python 程序：获取输入、计算时间，并给出两种不同的建议。'),
 knowledge:B('Recognise input(), int(), variables, constants and conditions.','Kenali input(), int(), pemboleh ubah, pemalar dan syarat.','认识 input()、int()、变量、常量和条件。'),
 skills:B('Arrange code, edit Python and run both decision paths.','Susun kod, sunting Python dan jalankan kedua-dua laluan keputusan.','排列代码、修改 Python，并运行两条判断路径。'),
 understanding:B('Explain a calculation and why a condition chooses an output.','Jelaskan pengiraan dan sebab syarat memilih sesuatu output.','解释计算，以及条件为什么选择某个输出。'),
 K:B('Knowledge','Pengetahuan','知识'),S:B('Skills','Kemahiran','技能'),U:B('Understanding','Pemahaman','理解'),
 next:B('Next page','Halaman seterusnya','下一页'),back:B('Back','Kembali','返回'),choose:B('Choose…','Pilih…','请选择…'),run:B('Run','Jalankan','运行'),stop:B('Stop','Hentikan','停止'),download:B('Download .py','Muat turun .py','下载 .py'),check:B('Check my answer','Semak jawapan saya','检查答案'),
 console:B('Console','Konsol','控制台'),ready:B('Press Run to start. Answer each question here when it appears.','Tekan Jalankan. Jawab setiap soalan di sini apabila muncul.','点击运行。问题出现时，直接在这里回答。'),
 saved:B('Saved on this browser','Disimpan dalam pelayar ini','已保存在此浏览器'),saveError:B('Saving is unavailable. Download a backup before leaving.','Tidak dapat menyimpan. Muat turun sandaran sebelum keluar.','无法保存。离开前请下载备份。'),
 independent:B('I can do this on my own','Saya boleh buat sendiri','我能独立完成'),support:B('I can do this with help','Saya boleh buat dengan bantuan','我能借助帮助完成'),need:B('I need help to start','Saya perlukan bantuan untuk mula','我需要帮助才能开始'),untried:B('I have not tried yet','Saya belum mencuba','我还没尝试'),
 new:B('New learning','Pembelajaran baharu','新学习'),consolidating:B('Consolidating','Mengukuhkan','巩固'),treading:B('Treading water','Terlalu mudah','原地踏步'),drowning:B('Drowning / need help','Buntu / perlukan bantuan','遇到困难／需要帮助'),
 pdf:B('Save as PDF','Simpan sebagai PDF','保存为 PDF'),backup:B('Save full backup','Simpan sandaran penuh','保存完整备份'),restore:B('Load backup','Muatkan sandaran','加载备份'),report:B('Readable report','Laporan boleh dibaca','可阅读报告'),
 sample:B('Worked example','Contoh lengkap','完整示例'),try:B('Your turn','Giliran anda','轮到你了'),parsons:B('Arrange the code','Susun kod','排列代码'),practice:B('Programming practice','Latihan pengaturcaraan','编程练习'),
 noEvidence:B('Not attempted yet','Belum dicuba','尚未尝试'),teacher:B('Teacher preview','Pratonton guru','教师预览'),
};
const PHASES=[
 ['new',B('It is new and takes effort. I am making progress.','Ini baharu dan memerlukan usaha. Saya semakin maju.','内容是新的，需要努力，但我正在进步。')],
 ['consolidating',B('I know the idea. Practice is making me more secure.','Saya tahu idea ini. Latihan mengukuhkan saya.','我已知道这个概念，练习让我更熟练。')],
 ['treading',B('This is already easy. I need a harder version.','Ini sudah mudah. Saya perlukan versi lebih sukar.','这已经很容易，我需要更有挑战的版本。')],
 ['drowning',B('I am stuck. I need someone to show one small step.','Saya buntu. Saya perlukan tunjuk ajar satu langkah kecil.','我卡住了，需要有人示范一个小步骤。')]
];
const Q=(id,area,prompt,code,options,answer,why)=>({id,area,prompt,code,options,answer,why});

const PAGES=[],GROUPS={},CHECKS=[],STARTER=[],PLENARY=[],PARSONS={},PROGRAMS={},GUIDED_TASKS={},PIT_TOPICS={};
function puzzle(id,page,title,instruction,blocks,hint){PARSONS[id]={id,page,title,instruction,blocks,hint,start:blocks.map((_,i)=>(i+blocks.length-1)%blocks.length)};}
function program(id,page,title,task,starter,guided,solution,tests){PROGRAMS[id]={id,page,title,task,starter,guided,solution,tests};}
