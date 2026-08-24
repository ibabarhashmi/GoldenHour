import type { en } from "./en.ts";

export const hi: Record<keyof typeof en, string> = {
  // chrome
  "app.name": "GoldenHour",
  "app.tagline": "साइबर ठगी के लिए पहली प्रतिक्रिया",
  "mock.banner":
    "डेमो संस्करण. शिकायत दर्ज करना और खाते मॉक हैं; हेल्पलाइन नंबर असली हैं, स्रोत के साथ.",
  "offline.banner": "आप ऑफ़लाइन हैं. आपका केस इसी फ़ोन में सुरक्षित है.",
  "start.over": "फिर से शुरू करें",
  "start.over.confirm": "यह केस हटाकर फिर से शुरू करें?",
  "lang.toggle": "English",
  "lang.switched": "भाषा बदलकर हिंदी की गई",
  "footer.note":
    "अगर समस्या तुरंत सुलझानी है, तो अभी 1930 या 112 पर कॉल करें. यह ऐप इनकी जगह नहीं लेता.",
  "skip.to.content": "मुख्य सामग्री पर जाएँ",
  "journey.label": "केस की प्रगति",
  "journey.step.start": "शुरूआत",
  "journey.step.describe": "बताएँ",
  "journey.step.act": "कार्रवाई",
  "journey.step.file": "दर्ज करें",

  // landing
  "landing.badge": "राष्ट्रीय साइबर अपराध हेल्पलाइन · 1930",
  "landing.stat.always": "हमेशा सक्रिय",
  "landing.stat.free": "निःशुल्क कॉल",
  "landing.stat.langs": "दोनों भाषाएँ",
  "landing.headline": "मेरे साथ ठगी हुई है",
  "landing.sub":
    "एक शांत स्क्रीन. एक ऐसी घड़ी जिसे आप अभी हरा सकते हैं. तीन कदम जो सचमुच पैसे वापस दिलाते हैं.",
  "landing.cta.self": "मेरे साथ ठगी हुई है",
  "landing.cta.other": "मैं किसी और की मदद कर रहे हैं",
  "landing.how.title": "यहाँ क्या होता है",
  "landing.how.1":
    "आप बताते हैं कब हुआ. गोल्डन ऑवर की घड़ी बहना शुरू करती है.",
  "landing.how.2":
    "तीन क्रमबद्ध कदम दिखते हैं: 1930 पर कॉल, बैंक से फ्रीज़, NCRP पर शिकायत.",
  "landing.how.3":
    "पोर्टल का सबसे कठिन फ़ील्ड तीन टैप में अपने आप लिखा जाता है.",
  "landing.about.link": "क्या मॉक है, क्या असली",
  "landing.login.required": "इस डेमो में पहले साइन-इन करना है.",

  // login
  "login.title": "GoldenHour में साइन इन करें",
  "login.subtitle": "केवल डेमो खाते. कुछ भी सर्वर पर सुरक्षित नहीं होता.",
  "login.creds.title": "जज क्रेडेंशियल",
  "login.creds.body": "नीचे कोई भी खाता चलेगा. सभी का पासवर्ड एक ही है.",
  "login.email": "ईमेल",
  "login.password": "पासवर्ड",
  "login.submit": "साइन इन",
  "login.submitting": "साइन इन हो रहा है…",
  "login.error": "यह ईमेल या पासवर्ड किसी डेमो खाते से नहीं मिलता.",
  "login.error.network":
    "साइन-इन सेवा तक पहुँच नहीं मिल रही. अगर आपने अभी ऐप रीस्टार्ट या रीबिल्ड किया है, तो इस पेज को हार्ड-रिफ्रेश करें (Cmd+Shift+R) और फिर कोशिश करें.",
  "login.privacy":
    "पासवर्ड हैशिंग का खेल नहीं: यह मॉक लॉगिन है, और हम खुलकर कहते हैं.",

  // start
  "start.title": "पैसा कब आपके खाते से निकला?",
  "start.subtitle":
    "आपका उत्तर घड़ी तय करता है. थोड़ी गलती से कुछ नहीं टूटता.",
  "start.justnow": "अभी-अभी",
  "start.withinhour": "पिछले एक घंटे में",
  "start.earlier": "उससे पहले",
  "start.time": "घटना की तारीख और समय",
  "start.future.error": "यह समय भविष्य में है. जब हुआ वही समय चुनें.",
  "start.tooold.error": "एक साल से पुराना. सीधे cybercrime.gov.in पर शिकायत करें.",
  "start.continue": "मेरा केस शुरू करें",
  "start.note":
    "शिकायत भेजने का विकल्प चुनने तक कुछ भी इस फ़ोन से बाहर नहीं जाता.",

  // triage
  "triage.title": "सादे शब्दों में बताएं — क्या हुआ?",
  "triage.subtitle":
    "कोई टाइल चुनें, या नीचे अपने शब्दों में लिखें. हम आपका उत्तर सरकारी श्रेणी से जोड़ते हैं.",
  "triage.freetext.title": "अपने शब्दों में बताएं",
  "triage.freetext.placeholder":
    "जैसे- किसी ने कॉल कर कहा कि मेरा KYC बंद होगा और मैंने बताया गया OTP साझा कर दिया…",
  "triage.classify": "समझें कि क्या हुआ",
  "triage.classifying": "पढ़ा जा रहा है…",
  "triage.classify.fail":
    "हमें पक्के तौर पर समझ नहीं आया. कृपया टाइल से चुनें — गलत श्रेणी आपके केस को नुकसान पहुँचाती है.",
  "triage.matched": "यह दर्ज होगा इस रूप में",
  "triage.tiles.title": "या सबसे मिलता-जुलता चुनें",

  // plan
  "plan.title": "आपकी योजना",
  "plan.band.left": "गोल्डन ऑवर बचा है",
  "plan.band.passed.title": "पहला घंटा बीत गया.",
  "plan.band.passed.body":
    "ये कदम फिर भी मायने रखते हैं — बैंक आगे के खातों को दिनों तक फ्रीज़ कर सकते हैं.",
  "plan.odds.fast":
    "इतनी जल्दी रिपोर्ट पर बड़ी हिस्सेदारी पीड़ितों का पैसा समय पर फ्रीज़ हो जाता है — बेंगलुरु के एक साइबर अधिकारी ने इसे आधे से अधिक बताया है.",
  "plan.odds.golden":
    "आप अभी उस खिड़की में हैं जिसे ज़्यादातर पुलिस गोल्डन ऑवर कहती है. पैसा आगे बढ़ने पर फ्रीज़ कठिन होता है.",
  "plan.odds.passed":
    "पहला घंटा बीत गया. वसूली कठिन है पर खत्म नहीं — पैसा अक्सर दिनों तक म्यूल खातों में पड़ा रहता है.",
  "plan.first": "सबसे पहले यह करें",
  "plan.then": "फिर यह करें",
  "plan.final": "और यह करें",
  "plan.done": "हो गया",
  "plan.pending": "बाकी",
  "plan.markdone": "हो गया, चिह्नित करें",
  "plan.card.call.title": "1930 पर कॉल करें",
  "plan.card.call.desc":
    "राष्ट्रीय साइबर हेल्पलाइन मिनटों में पैसा लेने वाला खाता फ्रीज़ करवा सकती है. आपकी बातचीत हमने लिख दी है.",
  "plan.card.bank.title": "बैंक से पैसा रोकें",
  "plan.card.bank.desc":
    "RBI के सीमित-दायित्व नियम चालू करने वाले सटीक शब्दों के साथ लेन-देन विवादित करें.",
  "plan.card.ncrp.title": "NCRP पर दर्ज करें",
  "plan.card.ncrp.desc":
    "अनिवार्य 200-अक्षर विवरण अपने आप लिखा जाएगा. हम असली फ़ॉर्म का प्रतिबिंब हैं.",

  // call page
  "call.title": "1930 पर कॉल — आपकी बातचीत",
  "call.subtitle":
    "जैसा लिखा है वैसा ही पढ़ें. नंबर बड़े दिखते हैं ताकि आप बता सकें.",
  "call.tel": "अभी 1930 पर कॉल करें",
  "call.readaloud": "यह बोलकर सुनाएं",
  "call.readaloud.stop": "पढ़ना रोकें",
  "call.copy": "स्क्रिप्ट कॉपी करें",
  "call.copied": "कॉपी हो गया",
  "call.section.intro": "शुरू इससे करें",
  "call.section.what": "बताएं कि क्या हुआ",
  "call.section.details": "ये विवरण दें",
  "call.section.ask": "इस अनुरोध के साथ खत्म करें",
  "call.tip.title": "कॉल के दौरान",
  "call.tip.1":
    "CFCFRMS प्रक्रिया के तहत पैसा लेने वाला खाता फ्रीज़ करने को कहें.",
  "call.tip.2": "जो आगे करने को कहा जाए, उसे नोट करें.",
  "call.tip.3":
    "लाइन व्यस्त हो तो दोहराते रहें और साथ-साथ बैंक वाला कदम उठाएँ — दोनों ज़रूरी हैं.",
  "call.no.voice":
    "इस डिवाइस पर हिंदी में बोलकर सुनाना उपलब्ध नहीं है. कृपया पाठ पढ़ें.",
  "call.back": "योजना पर वापस",

  // bank page
  "bank.title": "बैंक से पैसा रोकें",
  "bank.pick": "पैसा किस बैंक या ऐप से निकला?",
  "bank.script.title": "आपकी विवाद-बातचीत",
  "bank.rbi.title": "ये शब्द क्यों मायने रखते हैं",
  "bank.rbi.body":
    "RBI के सीमित-दायित्व नियमों में जल्दी रिपोर्ट करने पर अनधिकृत लेन-देन में आपकी ज़िम्मेदारी अक्सर शून्य से तीन दिन के भीतर तय होती है. \"अनधिकृत\" कहना और \"शून्य दायित्व\" लागू करने का अनुरोध करना आपका केस पहले मिनट से सही राह पर रखता है.",
  "bank.verified.title": "सत्यापित संपर्क विवरण",
  "bank.verified.body":
    "नीचे के नंबर और ईमेल हर संस्था की अपनी वेबसाइट से लिए गए हैं — कुछ भी साझा करने से पहले आधिकारिक स्रोत लिंक खोलकर ज़रूर जाँचें.",
  "bank.group.bank": "बैंक",
  "bank.group.wallet": "वॉलेट और पेमेंट ऐप",
  "bank.group.card": "कार्ड नेटवर्क",
  "bank.fraud.label": "धोखाधड़ी की रिपोर्ट करें",
  "bank.general.label": "सामान्य ग्राहक सेवा",
  "bank.email.label": "ईमेल",
  "bank.source.label": "आधिकारिक स्रोत",
  "bank.universal.title": "हमेशा काम आने वाले नंबर",
  "bank.email.title": "लिखित रूप में भी भेजें",
  "bank.email.body":
    "यही शब्द आज ही अपने बैंक के ग्रीवांस ईमेल पर भेजें. लिखित रिकॉर्ड उनकी जवाबी घड़ी शुरू करता है.",
  "bank.none": "अपनी स्क्रिप्ट देखने के लिए बैंक चुनें.",
  "bank.markdone": "मैंने बैंक को बता दिया",
  "bank.back": "योजना पर वापस",

  // report / composer
  "report.title": "NCRP पर दर्ज करें",
  "report.composer.title": "विवरण तैयार करें",
  "report.composer.sub": "तीन टैप. पोर्टल का सबसे कठिन फ़ील्ड अपने आप लिखा जाएगा.",
  "report.q.how": "शुरुआत कैसे हुई?",
  "report.q.what": "क्या हुआ?",
  "report.q.approved": "क्या यह आपने स्वीकृत किया?",
  "report.how.clicked_link": "मैंने लिंक खोला",
  "report.how.shared_otp": "मैंने OTP साझा किया",
  "report.how.call_impersonation": "किसी ने कॉल किया",
  "report.how.used_app": "मैंने ऐप स्थापित की",
  "report.how.qr_request": "मैंने QR स्कैन किया",
  "report.what.money_debited": "राशि कट गई",
  "report.what.card_used": "मेरा कार्ड इस्तेमाल हुआ",
  "report.what.account_emptied": "खाता खाली हो गया",
  "report.approved.not_approved": "नहीं",
  "report.approved.tricked_approve": "धोखे से स्वीकृत करवाई गई",
  "report.charcount": "{n} अक्षर — न्यूनतम 200",
  "report.charcount.ok": "{n} अक्षर — मान्य",
  "report.preview": "आपका विवरण",
  "report.improve": "शब्द बेहतर करें",
  "report.improving": "सुधारा जा रहा है…",
  "report.polished.note": "AI से शब्द बेहतर हुए. तथ्य वही हैं.",
  "report.amount.label": "कितनी राशि गई (Rs)",
  "report.utr.label": "UTR / लेन-देन संदर्भ (12 अंक)",
  "report.handle.label": "दूसरे पक्ष की UPI ID, फ़ोन या ईमेल",
  "report.open.form": "फ़ॉर्म पर आगे बढ़ें",
  "report.form.title": "शिकायत फ़ॉर्म",
  "report.tab.incident": "घटना विवरण",
  "report.tab.suspect": "संदिग्ध विवरण",
  "report.tab.complainant": "शिकायतकर्ता विवरण",
  "report.tab.preview": "पूर्वावलोकन और दर्ज करें",
  "report.field.category": "श्रेणी",
  "report.field.subcategory": "उपश्रेणी",
  "report.field.prefilled": "यह हमने आपके उत्तर से भरा है.",
  "report.field.date": "घटना की तारीख",
  "report.field.time": "घटना का समय",
  "report.field.state": "राज्य",
  "report.field.district": "ज़िला",
  "report.field.description": "शिकायत का विवरण",
  "report.field.description.help":
    "न्यूनतम 200 अक्षर. केवल अक्षर, अंक, अल्पविराम, पूर्ण विराम और योजक चिह्न — असली पोर्टल का यही नियम है.",
  "report.field.suspect.name": "संदिग्ध का नाम",
  "report.field.suspect.handle": "इस्तेमाल फ़ोन / UPI ID / ईमेल",
  "report.field.suspect.website": "वेबसाइट या ऐप लिंक",
  "report.field.suspect.account": "लाभार्थी खाता संख्या (पता हो तो)",
  "report.field.name": "आपका पूरा नाम",
  "report.field.mobile": "मोबाइल नंबर",
  "report.field.email": "ईमेल",
  "report.field.behalf": "किसके लिए",
  "report.behalf.self": "अपने लिए",
  "report.behalf.other": "किसी और के लिए",
  "report.field.idtype": "पहचान प्रकार",
  "report.field.idnumber": "पहचान संख्या",
  "report.id.synthetic":
    "नमूना मान, जानबूझकर अवैध सिद्ध होने वाला. किसी भी डेमो में असली ID न डालें.",
  "report.upload.evidence": "साक्ष्य अपलोड करें (JPEG/PNG, अधिकतम 10 MB)",
  "report.upload.id": "पहचान अपलोड करें (JPEG/PNG, अधिकतम 5 MB)",
  "report.upload.note":
    "फ़ाइल पोर्टल की असली सीमाओं पर जाँची जाती है, फिर हटा दी जाती है. कहीं अपलोड नहीं होती.",
  "report.declaration":
    "मेरी जानकारी के अनुसार दी गई जानकारी सत्य है, यह घोषणा करता/करती हूँ.",
  "report.submit": "शिकायत दर्ज करें",
  "report.nav.back": "पीछे",
  "report.nav.next": "आगे",
  "report.submitting": "दर्ज हो रहा है…",
  "report.success.title": "शिकायत दर्ज हो गई",
  "report.success.body":
    "यह पावती संख्या संभाल कर रखें. आगे हर फ़ॉलो-अप इसी से होता है.",
  "report.ack": "पावती संख्या",
  "report.success.next": "मेरा केस देखें",
  "report.err.description.short":
    "विवरण में कम से कम 200 अक्षर चाहिए. ऊपर बची जानकारी भरें.",
  "report.err.description.chars":
    "विवरण से विशेष चिह्न हटाएँ — पोर्टल उन्हें अस्वीकार करता है.",
  "report.err.utr": "UTR ठीक 12 अंकों का हो, या खाली छूट जाए.",
  "report.err.amount": "राशि रुपयों में, बिना चिह्न के भरें.",
  "report.err.mobile": "मोबाइल नंबर 10 अंकों का होना चाहिए.",
  "report.err.required": "आगे बढ़ने के लिए यह फ़ील्ड भरें.",
  "report.err.server": "दर्ज नहीं हो सका. कनेक्शन जाँचकर फिर कोशिश करें.",

  // case tracker
  "case.title": "केस",
  "case.filed": "NCRP पर दर्ज",
  "case.notfiled": "अभी दर्ज नहीं",
  "case.expectations.title": "अब क्या होगा — सच-सच",
  "case.expectations.1":
    "NCRP पर शिकायत FIR की गारंटी नहीं है. यह समीक्षा के लिए राज्य साइबर सेल जाती है.",
  "case.expectations.2":
    "ज़्यादातर फ्रीज़ राशि अदालती आदेश से लौटती है, झट से नहीं. हफ़्ते लगते हैं, मिनट नहीं.",
  "case.expectations.3":
    "हफ़्तों खामोशी सामान्य है. नीचे की तारीखें बताती हैं कि खामोशी कब आगे बढ़ाने का कारण बनती है.",
  "case.timeline.title": "समय-रेखा",
  "case.actions.title": "आपके तीन कदम",
  "case.escalation.title": "आगे बढ़ाने की सीढ़ी",
  "case.escalation.sub":
    "घटना की तारीख से गणना की गई. हर पंक्ति एक असली तारीख पर देय होती है.",
  "case.status.done": "हो गया",
  "case.status.pending": "बाकी",
  "case.status.due": "देय",
  "case.status.upcoming": "आने वाला",

  // compare
  "compare.title": "पहले और अब",
  "compare.sub":
    "बाएँ: आज पीड़ित सामना करता है. दाएँ: GoldenHour. दोनों का समय स्वयं लें.",
  "compare.before.title": "आज: NCRP का ठंडा आरंभ",
  "compare.after.title": "GoldenHour",
  "compare.timer.start": "घड़ी चालू",
  "compare.timer.stop": "रोकें",
  "compare.timer.reset": "रीसेट",
  "compare.verdict":
    "अगर दायाँ कॉलम तीन गुना तेज़ नहीं है, तो हम fail हैं और और सरल होना चाहिए.",
  "compare.before.tab": "टैब {n}: {tab}",
  "compare.after.step": "कदम {n}",

  // about
  "about.title": "क्या असली है, क्या मॉक",
  "about.intro":
    "यह डेमो भारत की राष्ट्रीय साइबर अपराध रिपोर्टिंग पोर्टल और 1930 हेल्पलाइन के इर्द-गिर्द बना है. हम हर शॉर्टकट खुलकर बताते हैं.",
  "about.real.title": "आज असली",
  "about.real.1":
    "पूरा प्रोडक्ट लॉजिक: NCRP की सात वित्तीय-धोखाधड़ी उपश्रेणियों तक ट्राइएज, विवरण रचयिता, पोर्टल की सीमाओं जैसे सत्यापन नियम, एस्केलेशन तिथि-गणित, द्विभाषी सामग्री.",
  "about.real.2":
    "इस पूरे कोड में असली फ़ोन नंबर केवल 1930 और 112 हैं. बिल्ड चेकलिस्ट का एक grep इसे लागू रखता है.",
  "about.mock.title": "मॉक",
  "about.mock.1": "लॉगिन खाते (तीन सीडेड डेमो उपयोगकर्ता).",
  "about.mock.2":
    "शिकायत दर्जी नहीं जाती; NCRP तक कुछ नहीं जाता; पावती संख्या 99 से शुरू होती है.",
  "about.mock.4":
    "सभी पहचानकर्ता: आधार जैसे नंबर बनाने से ही UIDAI Verhoeff चेकसम में फेल होते हैं, और यूनिट टेस्ट इसकी पुष्टि करता है.",
  "about.mock.5": "फ़ाइल अपलोड जाँचे जाते हैं और तुरंत हटा दिए जाते हैं. कोई स्टोरेज नहीं.",
  "about.data.title": "आपका डेटा कहाँ रहता है",
  "about.data.1":
    "केस की स्थिति आपके ब्राउज़र के localStorage में है. कोई डेटाबेस नहीं, क्योंकि सर्वरलेस फ़ंक्शन मेमोरी साझा नहीं करते — और क्योंकि एक क्षणिक केस फ़ाइल एक ही व्यक्ति, एक ही डिवाइस की होती है.",
  "about.data.2":
    "इसका एक और फ़ायदा: पहली बार खुलने के बाद ऐप ऑफ़लाइन भी चलता है, जो रात 11 बजे मोबाइल डेटा पर मायने रखता है.",
  "about.ai.title": "AI कहाँ है",
  "about.ai.1":
    "API key के बिना भी सब कुछ चलता है. विवरण लिखना नियम-आधारित है. key होने पर मॉडल 2.5 सेकंड की समय-सीमा में शब्द सुधार सकता है; स्वीकार करना आपका फ़ैसला है.",
  "about.ai.2":
    "मुक्त-पाठ ट्राइएज पहले कीवर्ड मैप से होता है. अस्पष्ट होने पर ही मॉडल से पूछा जाता है, और कम विश्वास पर अंदाज़ा लगाने से इनकार कर दिया जाता है.",
  "about.scale.title": "बड़े पैमाने पर सुरक्षित कैसे",
  "about.scale.1":
    "उत्पादन रास्ता एक: cybercrime.gov.in पर प्री-फ़ॉर्म ट्राइएज परत के रूप में — पीड़ित श्रेणी, विवरण और संदर्भ पहले से संरचित लेकर NCRP पहुँचे.",
  "about.scale.2":
    "उत्पादन रास्ता दो: 1930 व्यस्त होने पर SMS फ़ॉलबैक, यह योजना लिंक के रूप में भेजते हुए. कर्नाटक में संकीर्ण रूप पहले से चलता है.",
  "about.scale.3":
    "DPDP के अनुरूप डेटा न्यूनीकरण: सर्वर पर कुछ नहीं रखा जाता, लॉग में कोई PII नहीं, मॉडल कॉल में केवल सिंथेटिक स्लॉट जाते हैं.",
  "about.scale.4":
    "GoldenHour कभी पैसा नहीं छूता, संदिग्ध का नाम नहीं लेता, वसूली का वादा नहीं करता, और केवल आधिकारिक मार्गों पर भेजता है.",
  "about.odds.disclaimer":
    "वसूली प्रतिशत स्रोत और केस के अनुसार बदलते हैं. हम जानबूझकर सटीक आँकड़े नहीं बताते.",

  // errors / states
  "state.empty.title": "अभी कोई केस नहीं",
  "state.empty.body": "शुरुआत से शुरू करें — दस सेकंड लगते हैं.",
  "state.empty.cta": "केस शुरू करें",
  "state.wrongid.title": "यह केस इस डिवाइस पर नहीं है",
  "state.wrongid.body":
    "केस फ़ाइल उसी ब्राउज़र में रहती है जिसने बनाई. मूल फ़ोन पर ऐप खोलें, या नया शुरू करें.",
};
