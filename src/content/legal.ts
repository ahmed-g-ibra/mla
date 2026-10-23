import type { Locale } from '@/data/products';

export type LegalSection = { h: Record<Locale, string>; p: Record<Locale, string> };
export type LegalDocument = {
  slug: 'terms' | 'privacy' | 'returns';
  title: Record<Locale, string>;
  lead: Record<Locale, string>;
  sections: LegalSection[];
};

/**
 * Written for an Omani seller shipping across the GCC.
 *
 * These are a working draft, not legal advice: they describe what this site
 * actually does, in plain language, so a customer and a payment processor can
 * both see the terms. Have a lawyer in Oman read them before you trade, and
 * fill in the registration details in store-config.ts — they are rendered into
 * these pages and read as PLACEHOLDER until you do.
 */
export const legalUpdated = '2026-10-23';

export const legalDocuments: LegalDocument[] = [
  {
    slug: 'terms',
    title: { en: 'Terms of Sale', ar: 'شروط البيع' },
    lead: {
      en: 'The terms you agree to when you order from MLA. We have kept them short and in plain words, because terms nobody reads protect nobody.',
      ar: 'الشروط التي توافق عليها عند الطلب من MLA. أبقيناها قصيرة وبكلمات واضحة، لأن الشروط التي لا يقرأها أحد لا تحمي أحدًا.',
    },
    sections: [
      {
        h: { en: 'Who you are buying from', ar: 'ممن تشتري' },
        p: {
          en: 'MLA is a trading name of {legalName}, registered in the Sultanate of Oman under commercial registration {crNumber}, VAT number {vatNumber}, at {address}. You can reach a person on WhatsApp at {whatsapp} or by email at {email}, {supportHours}.',
          ar: 'MLA اسم تجاري لـ {legalName}، المسجَّلة في سلطنة عُمان بالسجل التجاري رقم {crNumber}، والرقم الضريبي {vatNumber}، وعنوانها {address}. يمكنك التواصل مع شخص عبر واتساب على {whatsapp} أو بالبريد الإلكتروني {email}، {supportHours}.',
        },
      },
      {
        h: { en: 'How an order is made', ar: 'كيف يتم الطلب' },
        p: {
          en: 'Adding pieces to your basket and sending them to us on WhatsApp is an offer to buy, not a completed sale. The sale is made when we reply confirming the pieces, the price and the delivery date. Until we do, nothing is owed by either of us. No payment is taken on this website.',
          ar: 'إضافة القطع إلى سلّتك وإرسالها إلينا عبر واتساب عرضٌ بالشراء، لا بيعٌ مكتمل. ويتم البيع حين نردّ مؤكّدين القطع والسعر وموعد التسليم. وإلى أن نفعل، لا شيء مستحق على أي من الطرفين. ولا يُخصم أي مبلغ عبر هذا الموقع.',
        },
      },
      {
        h: { en: 'Prices and tax', ar: 'الأسعار والضريبة' },
        p: {
          en: 'Prices are held in US dollars and shown converted to your currency. Five of the six GCC currencies are pegged to the dollar by their central banks, so those conversions are exact; the Kuwaiti dinar moves slightly and is refreshed manually. Prices include Omani VAT at 5%. Delivery across the GCC is free and we absorb any customs duty, so nothing further is collected on delivery. If a price is obviously wrong, we will tell you before confirming rather than hold you to it.',
          ar: 'تُحفظ الأسعار بالدولار الأمريكي وتُعرض محوَّلة إلى عملتك. وخمس من عملات الخليج الست مربوطة بالدولار من قِبل بنوكها المركزية، فتكون هذه التحويلات دقيقة؛ أما الدينار الكويتي فيتحرك قليلًا ويُحدَّث يدويًا. وتشمل الأسعار ضريبة القيمة المضافة العُمانية بنسبة ٥٪. والتوصيل داخل دول الخليج مجاني، ونتحمّل نحن أي رسوم جمركية، فلا يُحصَّل منك شيء عند التسليم. وإن كان السعر خاطئًا بشكل بيّن، أخبرناك قبل التأكيد بدل إلزامك به.',
        },
      },
      {
        h: { en: 'What you are buying', ar: 'ما الذي تشتريه' },
        p: {
          en: 'Every piece is a reproduction made in Egypt, not an antiquity. We say this plainly because the trade in genuine Egyptian antiquities is a criminal matter and we want no confusion about it. Pieces are finished by hand, so colour and patina vary between examples, and stone pieces vary more because the veining is the stone’s own. Dimensions are accurate to about half a centimetre.',
          ar: 'كل قطعة نسخة مصنوعة في مصر، لا قطعة أثرية. نقول ذلك صراحةً لأن الاتجار بالآثار المصرية الحقيقية مسألة جنائية ولا نريد أي التباس حولها. وتُشطَّب القطع يدويًا، فيختلف اللون والزنجار بين نسخة وأخرى، وتختلف القطع الحجرية أكثر لأن التعريق من الحجر نفسه. والمقاسات دقيقة في حدود نصف سنتيمتر.',
        },
      },
      {
        h: { en: 'Delivery', ar: 'التسليم' },
        p: {
          en: 'We deliver to all six GCC states. The times on our shipping page are working-day estimates from the day we confirm your order, not guarantees, and we will tell you if something is running late rather than let you wonder. Risk in the goods passes to you on delivery.',
          ar: 'نوصّل إلى دول مجلس التعاون الست جميعها. والمدد المذكورة في صفحة الشحن تقديرات بأيام العمل تبدأ من يوم تأكيد طلبك، وليست ضمانات، وسنخبرك إن تأخّر شيء بدل أن نتركك في انتظار. وتنتقل إليك تبعة الهلاك عند التسليم.',
        },
      },
      {
        h: { en: 'Returns and faults', ar: 'الإرجاع والعيوب' },
        p: {
          en: 'You may return anything within fourteen days of delivery, in its original packing, for any reason. Breakages in transit are replaced, not refunded, if you tell us within forty-eight hours. Our returns page sets this out in full. None of this limits your rights under the Omani Consumer Protection Law, which apply whatever this document says.',
          ar: 'يمكنك إرجاع أي قطعة خلال أربعة عشر يومًا من الاستلام، بالتغليف الأصلي، ولأي سبب. ويُستبدل ما يتكسّر في الطريق ولا يُردّ ثمنه، إن أخبرتنا خلال ثمانٍ وأربعين ساعة. وتوضّح صفحة الإرجاع ذلك بالتفصيل. ولا يحدّ شيء من هذا من حقوقك بموجب قانون حماية المستهلك العُماني، التي تسري مهما ورد في هذه الوثيقة.',
        },
      },
      {
        h: { en: 'Law and disputes', ar: 'القانون والنزاعات' },
        p: {
          en: 'These terms are governed by the law of the Sultanate of Oman, and the courts of Oman have jurisdiction. If something goes wrong, message us first — almost everything is settled that way, and faster.',
          ar: 'تخضع هذه الشروط لقانون سلطنة عُمان، والاختصاص لمحاكم عُمان. وإن حدث خطأ، فراسلنا أولًا — فكل شيء تقريبًا يُحَلّ بهذه الطريقة، وأسرع.',
        },
      },
    ],
  },
  {
    slug: 'privacy',
    title: { en: 'Privacy', ar: 'الخصوصية' },
    lead: {
      en: 'What we collect, which is very little, and what we do with it.',
      ar: 'ما الذي نجمعه، وهو قليل جدًا، وماذا نفعل به.',
    },
    sections: [
      {
        h: { en: 'This site stores nothing about you', ar: 'هذا الموقع لا يخزّن عنك شيئًا' },
        p: {
          en: 'There is no account to create, no newsletter sign-up and no contact form. Your basket, your chosen language and your chosen currency are kept in your own browser and never reach us. Clearing your browser data erases them completely.',
          ar: 'لا يوجد حساب تُنشئه، ولا اشتراك في نشرة بريدية، ولا نموذج تواصل. وتُحفظ سلّتك ولغتك وعملتك المختارة في متصفحك أنت ولا تصل إلينا أبدًا. ومسح بيانات المتصفح يمحوها تمامًا.',
        },
      },
      {
        h: { en: 'What we learn when you order', ar: 'ما نعرفه عند الطلب' },
        p: {
          en: 'When you send an order on WhatsApp we receive your phone number, your message, and whatever delivery details you give us. We use them to fulfil your order and to answer you, and we keep them as long as Omani tax and commercial record-keeping requires. We do not sell them, rent them, or send you marketing you did not ask for.',
          ar: 'عند إرسال طلب عبر واتساب نستلم رقم هاتفك ورسالتك وما تعطينا إياه من بيانات التسليم. ونستخدمها لتنفيذ طلبك والردّ عليك، ونحتفظ بها للمدة التي تفرضها متطلبات السجلات الضريبية والتجارية في عُمان. ولا نبيعها ولا نؤجّرها ولا نرسل إليك دعاية لم تطلبها.',
        },
      },
      {
        h: { en: 'Cookies and measurement', ar: 'ملفات الارتباط والقياس' },
        p: {
          en: 'We set no advertising cookies and run no third-party trackers. We measure page views and loading speed through Vercel Analytics, which counts visits without cookies and without building a profile of you, which is why this site has no cookie banner to dismiss.',
          ar: 'لا نضع ملفات ارتباط إعلانية ولا نشغّل أي أدوات تتبّع خارجية. ونقيس مرات مشاهدة الصفحات وسرعة التحميل عبر Vercel Analytics، الذي يحصي الزيارات دون ملفات ارتباط ودون بناء ملف تعريفي عنك، ولهذا لا يوجد في هذا الموقع شريط ملفات ارتباط تضطر إلى إغلاقه.',
        },
      },
      {
        h: { en: 'Who else sees anything', ar: 'من غيرنا يرى شيئًا' },
        p: {
          en: 'Three parties, each for one job: Vercel hosts the site, WhatsApp carries your messages under Meta’s own privacy terms, and the courier gets the name, address and phone number needed to deliver to you. Nobody else.',
          ar: 'ثلاث جهات، لكل منها مهمة واحدة: Vercel تستضيف الموقع، وواتساب ينقل رسائلك وفق شروط خصوصية Meta الخاصة به، وشركة الشحن تحصل على الاسم والعنوان ورقم الهاتف اللازمة للتوصيل إليك. ولا أحد غير ذلك.',
        },
      },
      {
        h: { en: 'Asking us to delete it', ar: 'أن تطلب منّا الحذف' },
        p: {
          en: 'Message us and ask. We will tell you what we hold and delete whatever we are not legally required to keep for tax records.',
          ar: 'راسلنا واطلب ذلك. سنخبرك بما لدينا ونحذف كل ما لا يُلزمنا القانون بحفظه للسجلات الضريبية.',
        },
      },
    ],
  },
  {
    slug: 'returns',
    title: { en: 'Returns & Refunds', ar: 'الإرجاع والاسترداد' },
    lead: {
      en: 'Fourteen days, any reason, we pay the collection. The detail is below.',
      ar: 'أربعة عشر يومًا، لأي سبب، ونتحمّل نحن تكلفة الاستلام. والتفاصيل أدناه.',
    },
    sections: [
      {
        h: { en: 'Changing your mind', ar: 'إن غيّرت رأيك' },
        p: {
          en: 'You have fourteen days from the day the piece reaches you. It needs to come back in the condition it arrived in, in its original packing, which is why we would rather you kept the box until you are sure. Tell us on WhatsApp and we arrange the collection and pay for it.',
          ar: 'أمامك أربعة عشر يومًا من يوم وصول القطعة إليك. ويلزم أن تعود بالحالة التي وصلت بها وبتغليفها الأصلي، ولهذا نفضّل أن تحتفظ بالصندوق حتى تطمئن. أخبرنا عبر واتساب فنرتّب الاستلام ونتحمّل تكلفته.',
        },
      },
      {
        h: { en: 'Damage in transit', ar: 'التلف أثناء الشحن' },
        p: {
          en: 'Photograph it and send us the picture within forty-eight hours of delivery. We ship a replacement at our cost and collect the damaged piece at the same time. We replace rather than refund here, because these are made to order and we would rather you had the piece.',
          ar: 'صوّرها وأرسل لنا الصورة خلال ثمانٍ وأربعين ساعة من الاستلام. نشحن بديلًا على نفقتنا ونستلم القطعة التالفة في الوقت نفسه. ونستبدل هنا بدل أن نردّ المبلغ، لأن هذه القطع تُصنع حسب الطلب ونفضّل أن تحصل على القطعة.',
        },
      },
      {
        h: { en: 'Faults that show up later', ar: 'العيوب التي تظهر لاحقًا' },
        p: {
          en: 'Paint that lifts, a joint that fails, a base that was never true — tell us and we will put it right by repair, replacement or refund. Hand-finished variation in patina or colour is not a fault; it is why the piece is not a factory object.',
          ar: 'طلاء ينزع، أو وصلة تنفصل، أو قاعدة غير مستوية من الأصل — أخبرنا ونصلح الأمر بالإصلاح أو الاستبدال أو ردّ المبلغ. أما اختلاف الزنجار أو اللون الناتج عن التشطيب اليدوي فليس عيبًا؛ بل هو سبب كون القطعة ليست منتجًا مصنعيًا.',
        },
      },
      {
        h: { en: 'How the money comes back', ar: 'كيف يعود المبلغ' },
        p: {
          en: 'To the method you paid by, within fourteen days of the piece reaching us. If you paid by bank transfer we will ask you to confirm the account before sending anything, for both our sakes.',
          ar: 'بالطريقة التي دفعت بها، خلال أربعة عشر يومًا من وصول القطعة إلينا. وإن كنت قد دفعت بتحويل بنكي فسنطلب منك تأكيد الحساب قبل إرسال أي مبلغ، حمايةً للطرفين.',
        },
      },
      {
        h: { en: 'The two things we cannot take back', ar: 'الأمران اللذان لا يمكننا استرجاعهما' },
        p: {
          en: 'Pieces engraved or made bespoke to your specification, and pieces damaged after delivery. Everything else is returnable. Your statutory rights under Omani consumer protection law sit above this policy and are not reduced by it.',
          ar: 'القطع المنقوشة أو المصنوعة خصيصًا حسب طلبك، والقطع التي تلفت بعد التسليم. وما عدا ذلك قابل للإرجاع. وحقوقك القانونية بموجب قانون حماية المستهلك العُماني فوق هذه السياسة ولا تنتقص منها.',
        },
      },
    ],
  },
];

export const legalBySlug = (slug: string) =>
  legalDocuments.find((d) => d.slug === slug);
