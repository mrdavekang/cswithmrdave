'use strict';
const B=(en,ms,zh)=>({en,ms,zh});
const LESSON={
 title:B('Improve the helpdesk adviser','Perbaiki penasihat meja bantuan','改进服务台建议程序'),
 wagba:B('Improve the helpdesk program so it handles unsuitable input, makes a nested decision, and passes planned tests.','Perbaiki atur cara meja bantuan supaya ia mengendalikan input yang tidak sesuai, membuat keputusan bersarang dan lulus ujian terancang.','改进服务台程序，使它能处理不合适的输入、作出嵌套判断，并通过计划好的测试。'),
 knowledge:B('Know what invalid input, nested selection, and normal, boundary and erroneous test data mean.','Ketahui maksud input tidak sah, pilihan bersarang serta data ujian normal, sempadan dan ralat.','知道无效输入、嵌套选择，以及正常、边界和错误测试数据的含义。'),
 skills:B('Validate two inputs, indent an inner if/else, run tests, and rewrite an error message.','Sahkan dua input, indenkankan if/else di dalam, jalankan ujian dan tulis semula mesej ralat.','验证两个输入、缩进内层 if/else、运行测试，并改写错误提示。'),
 understanding:B('Explain why validation happens before calculation, when the inner decision is skipped, and how a test exposes a problem.','Jelaskan mengapa pengesahan dibuat sebelum pengiraan, bila keputusan di dalam dilangkau dan bagaimana ujian mendedahkan masalah.','解释为何先验证再计算、何时跳过内层判断，以及测试如何发现问题。'),
};
const PAGES=[
 ['read',B('Read first','Baca dahulu','先阅读'),'START'],
 ['starter',B('Do Now','Mula sekarang','课前练习'),'START'],
 ['types',B('Types of Learning','Jenis Pembelajaran','学习类型'),'START'],
 ['main1',B('Main Task 1 · Improve the program','Tugasan Utama 1 · Perbaiki atur cara','主要任务 1 · 改进程序'),'MAIN 1'],
 ['main2',B('Main Task 2 · Test and improve','Tugasan Utama 2 · Uji dan perbaiki','主要任务 2 · 测试与改进'),'MAIN 2'],
 ['challenge',B('Further challenge','Cabaran lanjutan','进阶挑战'),'EXTEND'],
 ['pit',B('Learning Pit Stop','Hentian Pembelajaran','学习停靠站'),'REFLECT'],
 ['plenary',B('Plenary and PDF','Rumusan dan PDF','总结与 PDF'),'REFLECT']
];
const GROUPS={START:B('Get ready','Bersedia','做好准备'),'MAIN 1':B('Build','Bina','编写'),'MAIN 2':B('Test and improve','Uji dan perbaiki','测试与改进'),EXTEND:B('Use extra time','Gunakan masa tambahan','利用剩余时间'),REFLECT:B('Reflect and submit','Refleksi dan hantar','反思并提交')};
const STARTER=[
 {id:'k1',area:'K',prompt:B('Which entry is unsuitable when the program asks for a whole number of people?','Input manakah tidak sesuai apabila atur cara meminta bilangan orang dalam nombor bulat?','程序要求输入人数的整数时，哪项输入不合适？'),options:[B('3','3','3'),B('0','0','0'),B('three','three','three')],answer:2,why:B('“three” is text, so int() cannot convert it to a whole number.','“three” ialah teks, jadi int() tidak boleh menukarnya kepada nombor bulat.','“three”是文字，int() 无法把它转换成整数。')},
 {id:'k2',area:'K',prompt:B('For 2 people ahead, each person including Sam needs 4 minutes. Which is the boundary when Sam has exactly enough time?','Ada 2 orang di depan; setiap orang termasuk Sam memerlukan 4 minit. Yang manakah masa sempadan yang cukup tepat?','前面有 2 人，每人（包括 Sam）需 4 分钟。刚好够用的边界时间是多少？'),options:[B('11 minutes','11 minit','11 分钟'),B('12 minutes','12 minit','12 分钟'),B('13 minutes','13 minit','13 分钟')],answer:1,why:B('(2 + 1) × 4 = 12 minutes. Testing 11, 12 and 13 checks either side of the boundary.','(2 + 1) × 4 = 12 minit. Menguji 11, 12 dan 13 memeriksa kedua-dua sisi sempadan.','(2 + 1) × 4 = 12 分钟。测试 11、12、13 可检查边界两侧。')},
 {id:'s1',area:'S',prompt:B('Which condition catches a negative answer in either input?','Syarat manakah mengesan jawapan negatif pada mana-mana input?','哪个条件能找出任意一个输入中的负数？'),options:[B('people_ahead < 0 or minutes_available < 0','people_ahead < 0 or minutes_available < 0','people_ahead < 0 or minutes_available < 0'),B('people_ahead > 0 and minutes_available > 0','people_ahead > 0 and minutes_available > 0','people_ahead > 0 and minutes_available > 0'),B('people_ahead == minutes_available','people_ahead == minutes_available','people_ahead == minutes_available')],answer:0,why:B('The rule must catch a negative value in either field.','Peraturan mesti mengesan nilai negatif dalam mana-mana medan.','规则必须找出任意一个字段中的负数。')},
 {id:'s2',area:'S',prompt:B('After valid numbers are stored, which line calculates Sam’s total helpdesk time?','Selepas nombor sah disimpan, baris manakah mengira jumlah masa meja bantuan Sam?','保存有效数字后，哪一行计算 Sam 的总服务台时间？'),options:[B('total_minutes = people_ahead * 4','total_minutes = people_ahead * 4','total_minutes = people_ahead * 4'),B('total_minutes = (people_ahead + 1) * MINUTES_PER_PERSON','total_minutes = (people_ahead + 1) * MINUTES_PER_PERSON','total_minutes = (people_ahead + 1) * MINUTES_PER_PERSON'),B('total_minutes = minutes_available + 1','total_minutes = minutes_available + 1','total_minutes = minutes_available + 1')],answer:1,why:B('Add Sam to the people ahead, then multiply by the fixed minutes per person.','Tambah Sam kepada orang di depan, kemudian darab dengan minit tetap setiap orang.','将 Sam 算在前面的人数中，再乘以每人的固定分钟数。')},
 {id:'u1',area:'U',prompt:B('Why check the input before calculating the time?','Mengapa semak input sebelum mengira masa?','为什么要先检查输入，再计算时间？'),options:[B('So invalid answers do not produce a misleading estimate','Supaya jawapan tidak sah tidak menghasilkan anggaran yang mengelirukan','避免无效答案产生误导性的估计'),B('So the program always prints 0','Supaya atur cara sentiasa memaparkan 0','让程序总是输出 0'),B('So the program skips every decision','Supaya atur cara melangkau semua keputusan','让程序跳过所有判断')],answer:0,why:B('If an input is unsuitable, the program should explain how to correct it and make no estimate.','Jika input tidak sesuai, atur cara perlu menerangkan cara membetulkannya dan tidak membuat anggaran.','如果输入不合适，程序应说明如何修正，而且不要作出估计。')},
 {id:'u2',area:'U',prompt:B('When should the inner “enough time?” decision run?','Bilakah keputusan di dalam “masa mencukupi?” perlu dijalankan?','什么时候才应运行内层“时间够吗？”判断？'),options:[B('After both inputs are valid','Selepas kedua-dua input sah','两个输入都有效之后'),B('Even when an input is blank','Walaupun satu input kosong','即使某个输入为空'),B('Before asking any questions','Sebelum bertanya apa-apa soalan','提问之前')],answer:0,why:B('The inner decision uses the calculated time, which only exists for valid inputs.','Keputusan di dalam menggunakan masa yang dikira, yang hanya wujud untuk input sah.','内层判断使用计算出的时间；只有输入有效时才应计算。')}
];
const TESTS=[
 {id:'normal_now',kind:B('Normal','Normal','正常'),people:'2',minutes:'20',expected:B('12 minutes; ask now','12 minit; tanya sekarang','12 分钟；现在询问'),route:'now'},
 {id:'normal_later',kind:B('Normal','Normal','正常'),people:'4',minutes:'15',expected:B('20 minutes; arrange another time','20 minit; atur masa lain','20 分钟；另约时间'),route:'later'},
 {id:'below',kind:B('Boundary −1','Sempadan −1','边界 −1'),people:'2',minutes:'11',expected:B('12 minutes; arrange another time','12 minit; atur masa lain','12 分钟；另约时间'),route:'later'},
 {id:'equal',kind:B('Boundary','Sempadan','边界'),people:'2',minutes:'12',expected:B('12 minutes; ask now','12 minit; tanya sekarang','12 分钟；现在询问'),route:'now'},
 {id:'above',kind:B('Boundary +1','Sempadan +1','边界 +1'),people:'2',minutes:'13',expected:B('12 minutes; ask now','12 minit; tanya sekarang','12 分钟；现在询问'),route:'now'},
 {id:'zero',kind:B('Valid zero','Sifar sah','有效的零'),people:'0',minutes:'4',expected:B('4 minutes; ask now','4 minit; tanya sekarang','4 分钟；现在询问'),route:'now'},
 {id:'negative',kind:B('Erroneous','Ralat','错误'),people:'-1',minutes:'20',expected:B('Correction message; no estimate','Mesej pembetulan; tiada anggaran','纠正提示；不作估计'),route:'invalid'},
 {id:'word',kind:B('Erroneous','Ralat','错误'),people:'two',minutes:'20',expected:B('Correction message; no estimate','Mesej pembetulan; tiada anggaran','纠正提示；不作估计'),route:'invalid'},
 {id:'blank',kind:B('Erroneous','Ralat','错误'),people:'[press Enter]',minutes:'20',expected:B('Correction message; no estimate','Mesej pembetulan; tiada anggaran','纠正提示；不作估计'),route:'invalid'},
 {id:'negative_time',kind:B('Erroneous','Ralat','错误'),people:'2',minutes:'-1',expected:B('Correction message; no estimate','Mesej pembetulan; tiada anggaran','纠正提示；不作估计'),route:'invalid'}
];
const SCAFFOLD=`MINUTES_PER_PERSON = 4

people_text = input("People ahead of Sam: ")
available_text = input("Minutes available: ")

try:
    if people_text.strip() == "" or available_text.strip() == "":
        print("Bad input")
    else:
        people_ahead = int(people_text)
        minutes_available = int(available_text)

        # TODO 1: replace False to catch a negative input.
        if False:
            print("Bad input")
        else:
            # TODO 2: calculate the total, including Sam.
            total_minutes = 0
            print("Estimated total:", total_minutes, "minutes")

            # TODO 3: replace False with the time comparison.
            if False:
                print("Sam can ask the helpdesk now.")
            else:
                print("Sam should arrange another time.")
except ValueError:
    print("Bad input")
`;
const SOLUTION=`MINUTES_PER_PERSON = 4

people_text = input("People ahead of Sam: ")
available_text = input("Minutes available: ")

try:
    if people_text.strip() == "" or available_text.strip() == "":
        print("Enter a whole number. The answer cannot be blank.")
    else:
        people_ahead = int(people_text)
        minutes_available = int(available_text)

        if people_ahead < 0 or minutes_available < 0:
            print("Enter zero or more. The number cannot be negative.")
        else:
            total_minutes = (people_ahead + 1) * MINUTES_PER_PERSON
            print("Estimated total:", total_minutes, "minutes")

            if total_minutes <= minutes_available:
                print("Sam can ask the helpdesk now.")
            else:
                print("Sam should arrange another time.")
except ValueError:
    print("Enter a whole number, such as 0 or 3.")
`;
