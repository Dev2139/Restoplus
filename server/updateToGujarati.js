require('dotenv').config();
const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');

const translations = {
  "Masala Dosa": {
    name: "મસાલા ઢોંસા",
    description: "ક્રિસ્પી રાઇસ અને દાળની ક્રેપ, મસાલેદાર બટાકાના સ્ટફિંગ સાથે, સાંભર અને ચટણી સાથે.",
    category: "મુખ્ય ભોજન"
  },
  "Punjabi Samosa": {
    name: "પંજાબી સમોસા",
    description: "બટાકા અને વટાણાના મસાલાવાળી ફ્લેકી પેસ્ટ્રી, આમલીની ચટણી સાથે.",
    category: "સ્ટાર્ટર્સ"
  },
  "Maharaja Thali": {
    name: "મહારાજા થાળી",
    description: "દાળ, પનીર સબ્જી, શાક, ચોખા, રોટલી, પાપડ અને મીઠાઈવાળી ભવ્ય થાળી.",
    category: "મુખ્ય ભોજન"
  },
  "Kadai Paneer": {
    name: "કઢાઈ પનીર",
    description: "મસાલેદાર ટામેટાની ગ્રેવીમાં કેપ્સિકમ અને તાજા મસાલા સાથે રાંધેલું પનીર.",
    category: "મુખ્ય ભોજન"
  },
  "Dal Tadka": {
    name: "દાળ તડકા",
    description: "ઘી, જીરું, લસણ અને સૂકા લાલ મરચાંનો વઘાર કરેલી પીળી દાળ.",
    category: "મુખ્ય ભોજન"
  },
  "Tandoori Roti": {
    name: "તંદૂરી રોટી",
    description: "માટીના તંદૂરમાં શેકેલી પારંપરિક ઘઉંની રોટી.",
    category: "રોટી / બ્રેડ"
  },
  "Gulab Jamun": {
    name: "ગુલાબ જાંબુ",
    description: "એલચીના સ્વાદવાળી ખાંડની ચાસણીમાં પલાળેલા તળેલા મીઠા બોલ્સ.",
    category: "મીઠાઈ"
  },
  "Masala Chai": {
    name: "મસાલા ચા",
    description: "દૂધ અને એલચી, આદુ જેવા સુગંધિત મસાલાઓ સાથે ઉકાળેલી ક્લાસિક ભારતીય ચા.",
    category: "પીણાં"
  },
  "Sweet Lassi": {
    name: "મીઠી લસ્સી",
    description: "ઘટ્ટ અને મલાઈદાર દહીંનું પીણું, ગુલાબ જળના સ્વાદ સાથે મીઠી.",
    category: "પીણાં"
  },
  "Paneer Tikka Masala": {
    name: "પનીર ટીક્કા મસાલા",
    description: "રીચ અને ક્રીમી ટામેટાની ગ્રેવીમાં રાંધેલા શેકેલા પનીરના ટુકડા.",
    category: "મુખ્ય ભોજન"
  },
  "Vegetable Biryani": {
    name: "વેજીટેબલ બિરયાની",
    description: "મિશ્ર શાકભાજી અને પારંપરિક મસાલા સાથે રાંધેલા સુગંધિત બાસમતી ચોખા, રાયતા સાથે.",
    category: "મુખ્ય ભોજન"
  },
  "Aloo Gobi": {
    name: "આલૂ ગોભી",
    description: "બટાકા, ફ્લાવર અને ભારતીય મસાલાથી બનેલું ક્લાસિક સૂકું શાક.",
    category: "મુખ્ય ભોજન"
  },
  "Butter Naan": {
    name: "બટર નાન",
    description: "નરમ અને ફૂલેલી બ્રેડ, જેના પર પુષ્કળ માખણ લગાવેલું હોય છે.",
    category: "રોટી / બ્રેડ"
  },
  "Rasgulla": {
    name: "રસગુલ્લા",
    description: "આછી ખાંડની ચાસણીમાં પલાળેલા નરમ અને સ્પંજી મીઠા દડા.",
    category: "મીઠાઈ"
  },
  "Fresh Lime Soda": {
    name: "ફ્રેશ લાઈમ સોડા",
    description: "તાજા લીંબુનો રસ, સોડા અને મીઠા/ખારા સ્વાદ સાથે બનેલું તાજગી આપતું પીણું.",
    category: "પીણાં"
  },
  "Masala Papad": {
    name: "મસાલા પાપડ",
    description: "ઝીણી સમારેલી ડુંગળી, ટામેટાં અને ચટપટા મસાલા સાથે શેકેલો ક્રિસ્પી પાપડ.",
    category: "સ્ટાર્ટર્સ"
  },
  "Jeera Rice": {
    name: "જીરા રાઇસ",
    description: "જીરું અને ઘીનો વઘાર કરેલા સુગંધિત બાસમતી ચોખા.",
    category: "મુખ્ય ભોજન"
  },
  "Chole Bhature": {
    name: "છોલે ભટુરે",
    description: "મસાલેદાર ચણાનું શાક અને બે ફૂલેલા ભટુરે.",
    category: "મુખ્ય ભોજન"
  },
  "Palak Paneer": {
    name: "પાલક પનીર",
    description: "હળવા મસાલેદાર પાલકની ગ્રેવીમાં રાંધેલા નરમ પનીરના ટુકડા.",
    category: "મુખ્ય ભોજન"
  }
};

const updateToGujarati = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB.');

    const items = await MenuItem.find({});
    let updatedCount = 0;

    for (let item of items) {
      const translation = translations[item.name];
      if (translation) {
        item.name = translation.name;
        item.description = translation.description;
        item.category = translation.category;
        await item.save();
        updatedCount++;
      }
    }

    console.log(`Updated ${updatedCount} items to Gujarati.`);
    process.exit(0);
  } catch (error) {
    console.error('Error updating menu:', error);
    process.exit(1);
  }
};

updateToGujarati();
