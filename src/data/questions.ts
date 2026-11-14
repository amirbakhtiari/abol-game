export interface EvasiveOption {
  id: string;
  label: string;
}

export interface QuestionStep {
  id: number;
  chapterTitle: string;
  question: string;
  positiveLabel: string;
  evasiveOptions: EvasiveOption[];
  taunts: string[];
  visualTheme: 'goldfish' | 'tea';
}

export const QUESTIONS: QuestionStep[] = [
  {
    id: 1,
    chapterTitle: 'شروع داستان',
    question: 'سلام میخوای بدونی من کی ام ؟!',
    positiveLabel: 'اره',
    evasiveOptions: [{ id: 'no-1', label: 'نه' }],
    taunts: [
      'اوه! دکمه «نه» در رفت!',
      'کنجکاو نیستی مگه؟ یه بار «اره» رو بزن!',
      'به این راحتی نمیشه «نه» گفت!',
      'این دکمه فراریه، گیر نمیاد!',
    ],
    visualTheme: 'goldfish',
  },
  {
    id: 2,
    chapterTitle: 'معرفی نویسنده',
    question: 'آفرین ، من نویسنده ی کتاب " ماهی قرمز توی آکواریوم هستم" تمایل داری بیشتر صحبت کنیم ؟',
    positiveLabel: 'اره',
    evasiveOptions: [{ id: 'no-2', label: 'نه' }],
    taunts: [
      'ماهی قرمزمون دلش میشکنه ها!',
      'مگه میشه با نویسنده کتاب حرف نزد؟',
      'دوباره پرید اونور صفحه!',
      'فقط «اره» سر جاش منتظرته!',
    ],
    visualTheme: 'goldfish',
  },
  {
    id: 3,
    chapterTitle: 'انتخاب مسیر گفتگو',
    question: 'خب مثل اینکه توام بدت نیومده صحبت کنیم ، کدوم روشو انتخاب میکنی برای صحبت ؟',
    positiveLabel: 'بله لامصب',
    evasiveOptions: [
      { id: 'chat-3', label: 'چتی' },
      { id: 'phone-3', label: 'تلفنی' },
      { id: 'insta-3', label: 'اینستاگرام' },
    ],
    taunts: [
      'این گزینه فعلاً در دسترس نیست!',
      'انگار فقط «بله لامصب» سر جاش مونده!',
      'ببین کدوم دکمه فرار نمیکنه!',
      'همه راه‌ها به «بله لامصب» ختم میشه!',
    ],
    visualTheme: 'goldfish',
  },
  {
    id: 4,
    chapterTitle: 'پیشنهاد ویژه',
    question: 'ولی من تمایلی ندارم تو بله بات صحبت کنم شمارتو میدی ؟',
    positiveLabel: 'اره',
    evasiveOptions: [{ id: 'no-4', label: 'نه' }],
    taunts: [
      'دکمه «نه» رفت مرخصی!',
      'خجالت نکش، روی «اره» کلیک کن!',
      'هر چی دنبالش بری، سریع‌تر فرار میکنه!',
      'تلاشت ستودنیه ولی «اره» تنها راهه!',
    ],
    visualTheme: 'goldfish',
  },
  {
    id: 5,
    chapterTitle: 'قرار دمنوش',
    question: 'مهم نیست خودم خطتو دارم ، اول زنگ بزنم یه دمنوش برات بگیرم بعدش زنگ بزنم بت اوکی ؟',
    positiveLabel: 'اوکی',
    evasiveOptions: [{ id: 'noki-5', label: 'نوکی' }],
    taunts: [
      'دمنوش گرم رو مگه میشه رد کرد؟',
      '«نوکی» دیگه چیه! در رفت!',
      'دمنوش داره سرد میشه، «اوکی» رو بزن!',
      '«نوکی» رسماً از صفحه فرار کرد!',
    ],
    visualTheme: 'tea',
  },
];

export const toPersianDigits = (value: number): string => {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(value).replace(/\d/g, (digit) => persianDigits[Number(digit)] ?? digit);
};
