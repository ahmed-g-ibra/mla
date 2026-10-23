import type { Locale } from '@/data/products';

export type FaqEntry = {
  id: string;
  q: Record<Locale, string>;
  a: Record<Locale, string>;
};

/**
 * These answers are the site's promises. They are deliberately consistent with
 * the shipping and returns pages — if one changes, change all of them, because
 * they are also published as FAQPage structured data and a contradiction is
 * visible in search results.
 */
export const faq: FaqEntry[] = [
  {
    id: 'authentic',
    q: {
      en: 'Are these genuine ancient artefacts?',
      ar: 'هل هذه قطع أثرية أصلية؟',
    },
    a: {
      en: 'No, and nobody can legally sell you one. Exporting genuine Egyptian antiquities has been a criminal offence since 1983. Every piece here is a faithful reproduction, made in Egypt by hand, from the same materials and often from moulds measured off museum originals. That is the living craft, and it is the part that was never buried.',
      ar: 'لا، ولا يستطيع أحد أن يبيعك قطعة أصلية بشكل قانوني. فتصدير الآثار المصرية الحقيقية جريمة يعاقب عليها القانون منذ عام ١٩٨٣. كل قطعة هنا نسخة أمينة، مصنوعة في مصر يدويًا، من الخامات نفسها، وكثير منها من قوالب مأخوذة عن أصول متحفية. تلك هي الحرفة الحيّة، وهي الجزء الذي لم يُدفن قط.',
    },
  },
  {
    id: 'where-made',
    q: { en: 'Where are the pieces made?', ar: 'أين تُصنع القطع؟' },
    a: {
      en: 'In workshops around Cairo and Luxor, by families who have been casting, carving and painting for three and four generations. Resin pieces are cast and finished by hand. Stone pieces are cut from Egyptian alabaster, soapstone and basalt, so the veining is never the same twice.',
      ar: 'في ورش حول القاهرة والأقصر، على يد عائلات تسبك وتنحت وتطلي منذ ثلاثة أجيال وأربعة. تُسبك القطع الراتنجية وتُشطَّب يدويًا. أما القطع الحجرية فتُنحت من المرمر المصري والحجر الصابوني والبازلت، ولذلك لا يتكرّر التعريق مرتين.',
    },
  },
  {
    id: 'shipping-where',
    q: {
      en: 'Which countries do you ship to, and how long does it take?',
      ar: 'إلى أي الدول تشحنون، وكم تستغرق المدة؟',
    },
    a: {
      en: 'All six GCC states. Oman and the UAE usually arrive in two to four working days, Saudi Arabia, Qatar and Bahrain in three to five, Kuwait in four to six. We confirm the expected date with you when we confirm the order.',
      ar: 'إلى دول مجلس التعاون الست جميعها. تصل الطلبات إلى عُمان والإمارات عادةً خلال يومين إلى أربعة أيام عمل، وإلى السعودية وقطر والبحرين خلال ثلاثة إلى خمسة، وإلى الكويت خلال أربعة إلى ستة. ونؤكّد لك الموعد المتوقع عند تأكيد الطلب.',
    },
  },
  {
    id: 'shipping-cost',
    q: {
      en: 'What does delivery cost, and are taxes included?',
      ar: 'كم تكلفة التوصيل، وهل الضرائب مشمولة؟',
    },
    a: {
      en: 'Delivery across the GCC is free. Prices shown include Omani VAT at 5%. For deliveries outside Oman we cover any customs duty ourselves — the price you see is the price you pay, with nothing collected at the door.',
      ar: 'التوصيل داخل دول الخليج مجاني. والأسعار المعروضة تشمل ضريبة القيمة المضافة العُمانية بنسبة ٥٪. أما الشحنات خارج عُمان فنتحمّل نحن أي رسوم جمركية — السعر الذي تراه هو ما تدفعه، ولا يُطلب منك شيء عند الاستلام.',
    },
  },
  {
    id: 'payment',
    q: { en: 'How do I pay?', ar: 'كيف أدفع؟' },
    a: {
      en: 'Nothing is charged on this website. You send your order through WhatsApp, we confirm stock and the delivery date, and we agree payment with you directly from there. Card payment on the site is coming.',
      ar: 'لا يُخصم أي مبلغ عبر هذا الموقع. ترسل طلبك عبر واتساب، فنؤكّد لك التوفّر وموعد التسليم، ثم نتفق معك على طريقة الدفع مباشرة. والدفع بالبطاقة عبر الموقع قادم قريبًا.',
    },
  },
  {
    id: 'returns',
    q: { en: 'Can I return a piece?', ar: 'هل يمكنني إرجاع قطعة؟' },
    a: {
      en: 'Yes — fourteen days from delivery, in its original packing, for any reason at all. We arrange the collection ourselves and refund to the method you paid by. Your rights under Omani consumer protection law apply on top of this and are not affected by it.',
      ar: 'نعم — خلال أربعة عشر يومًا من الاستلام، بالتغليف الأصلي، ولأي سبب كان. ونتولّى نحن ترتيب الاستلام ونعيد المبلغ بالطريقة التي دفعت بها. وتبقى حقوقك بموجب قانون حماية المستهلك العُماني قائمة فوق ذلك ولا تتأثر به.',
    },
  },
  {
    id: 'damage',
    q: {
      en: 'What if it arrives broken?',
      ar: 'ماذا لو وصلت القطعة مكسورة؟',
    },
    a: {
      en: 'We replace it. Send us a photograph on WhatsApp within forty-eight hours of delivery and we ship a replacement at our cost. Stone, basalt and alabaster pieces travel in a fitted wooden crate for exactly this reason.',
      ar: 'نستبدلها. أرسل لنا صورة عبر واتساب خلال ثمانٍ وأربعين ساعة من الاستلام ونشحن لك بديلًا على نفقتنا. وتُشحن قطع الحجر والبازلت والمرمر في قفص خشبي مُفصّل لهذا السبب بالذات.',
    },
  },
  {
    id: 'variation',
    q: {
      en: 'Will my piece look exactly like the photograph?',
      ar: 'هل ستكون قطعتي مطابقة تمامًا للصورة؟',
    },
    a: {
      en: 'Close, but not identical, and that is the point. Every piece is finished by hand, so patina depth and paint detail vary slightly. Stone pieces vary more, because the veining is the stone’s own. Dimensions are accurate to about half a centimetre.',
      ar: 'قريبة منها، لا مطابقة، وهذا هو المقصود. فكل قطعة تُشطَّب يدويًا، ولذلك يختلف عمق الزنجار وتفاصيل الطلاء اختلافًا يسيرًا. وتختلف القطع الحجرية أكثر، لأن التعريق من الحجر نفسه. أما المقاسات فدقيقة في حدود نصف سنتيمتر.',
    },
  },
  {
    id: 'gift',
    q: {
      en: 'Can a piece be sent as a gift?',
      ar: 'هل يمكن إرسال القطعة كهدية؟',
    },
    a: {
      en: 'Yes. Tell us when you send your order and we will leave the invoice out, wrap the piece for giving, and include a handwritten card with whatever message you want on it.',
      ar: 'نعم. أخبرنا عند إرسال طلبك، فنُخرج الفاتورة من الطرد، ونغلّف القطعة تغليف هدايا، ونُرفق بطاقة مكتوبة بخط اليد بالرسالة التي تريدها.',
    },
  },
  {
    id: 'bulk',
    q: {
      en: 'Do you supply corporate gifts or larger orders?',
      ar: 'هل توفّرون هدايا الشركات أو الطلبات الكبيرة؟',
    },
    a: {
      en: 'Yes, and it is worth asking early. Corporate orders are quoted individually, engraving and bespoke packaging are possible, and larger runs need four to six weeks because the workshops cast to order.',
      ar: 'نعم، ويُستحسن السؤال مبكرًا. تُسعَّر طلبات الشركات بشكل منفصل، ويمكن إضافة النقش والتغليف الخاص، وتحتاج الكميات الكبيرة من أربعة إلى ستة أسابيع لأن الورش تسبك حسب الطلب.',
    },
  },
];
