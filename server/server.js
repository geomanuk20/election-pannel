const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Global Request Logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

const PORT = process.env.PORT || 5005;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/election_140';

app.get('/api/test', (req, res) => {
    res.send("Server is REACHABLE!");
});


const electionSchema = new mongoose.Schema({
    _id: { type: String, default: 'main_scorecard' },
    totalSeats: { type: Number, default: 140 },
    columnHeader: { type: String, default: 'മണ്ഡലം' },
    rotateTime: { type: Number, default: 20 },
    ldf: { type: Number, default: 0 },
    udf: { type: Number, default: 0 },
    nda: { type: Number, default: 0 },
    others: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now }
});

const ElectionData = mongoose.model('ElectionData', electionSchema);

const District = mongoose.model('District', new mongoose.Schema({
    name: { type: String, required: true },
    englishName: { type: String, default: '' },
    lead: { type: String, enum: ['LDF', 'UDF', 'NDA', 'OTH', 'NONE'], default: 'NONE' },
    order: { type: Number, default: 0 }
}));

const DATA_ID = 'main_scorecard';

async function initializeData() {
    try {
        const data = await ElectionData.findOne({ _id: DATA_ID });
        if (!data) {
            await ElectionData.create({
                _id: DATA_ID,
                totalSeats: 140,
                columnHeader: 'മണ്ഡലം',
                rotateTime: 20,
                ldf: 0,
                udf: 0,
                nda: 0,
                others: 0
            });
            console.log('Initial election data created');
        }

        // Seed/Update 140 Kerala Assembly Constituencies
        const keralaConstituencies = [
            { name: 'മഞ്ചേശ്വരം', englishName: 'Manjeshwaram', lead: 'NONE', order: 1 },
            { name: 'കാസർകോട്', englishName: 'Kasaragod', lead: 'NONE', order: 2 },
            { name: 'ഉദമ', englishName: 'Udma', lead: 'NONE', order: 3 },
            { name: 'കാഞ്ഞങ്ങാട്', englishName: 'Kanhangad', lead: 'NONE', order: 4 },
            { name: 'തൃക്കരിപ്പൂർ', englishName: 'Trikaripur', lead: 'NONE', order: 5 },
            { name: 'പയ്യന്നൂർ', englishName: 'Payyanur', lead: 'NONE', order: 6 },
            { name: 'കല്ല്യാശ്ശേരി', englishName: 'Kalliasseri', lead: 'NONE', order: 7 },
            { name: 'തളിപ്പറമ്പ്', englishName: 'Taliparamba', lead: 'NONE', order: 8 },
            { name: 'ഇരിക്കൂർ', englishName: 'Irikkur', lead: 'NONE', order: 9 },
            { name: 'അഴീക്കോട്', englishName: 'Azhikode', lead: 'NONE', order: 10 },
            { name: 'കണ്ണൂർ', englishName: 'Kannur', lead: 'NONE', order: 11 },
            { name: 'ധർമ്മടം', englishName: 'Dharmadom', lead: 'NONE', order: 12 },
            { name: 'തലശ്ശേരി', englishName: 'Thalassery', lead: 'NONE', order: 13 },
            { name: 'കുത്തുപറമ്പ്', englishName: 'Kuthuparamba', lead: 'NONE', order: 14 },
            { name: 'മട്ടന്നൂർ', englishName: 'Mattannur', lead: 'NONE', order: 15 },
            { name: 'പേരാവൂർ', englishName: 'Peravoor', lead: 'NONE', order: 16 },
            { name: 'മാനന്തവാടി', englishName: 'Mananthavady', lead: 'NONE', order: 17 },
            { name: 'സുൽത്താൻബത്തേരി', englishName: 'Sulthan Bathery', lead: 'NONE', order: 18 },
            { name: 'കൽപ്പറ്റ', englishName: 'Kalpetta', lead: 'NONE', order: 19 },
            { name: 'വടകര', englishName: 'Vatakara', lead: 'NONE', order: 20 },
            { name: 'കുറ്റ്യാടി', englishName: 'Kuttiadi', lead: 'NONE', order: 21 },
            { name: 'നാദാപുരം', englishName: 'Nadapuram', lead: 'NONE', order: 22 },
            { name: 'കൊയിലാണ്ടി', englishName: 'Koyilandy', lead: 'NONE', order: 23 },
            { name: 'പേരാമ്പ്ര', englishName: 'Perambra', lead: 'NONE', order: 24 },
            { name: 'ബാലുശ്ശേരി (എസ്സി)', englishName: 'Balussery SC', lead: 'NONE', order: 25 },
            { name: 'എലത്തൂർ', englishName: 'Elathur', lead: 'NONE', order: 26 },
            { name: 'കോഴിക്കോട് നോർത്ത്', englishName: 'Kozhikode North', lead: 'NONE', order: 27 },
            { name: 'കോഴിക്കോട് സൗത്ത്', englishName: 'Kozhikode South', lead: 'NONE', order: 28 },
            { name: 'ബേപ്പൂർ', englishName: 'Beypore', lead: 'NONE', order: 29 },
            { name: 'കുന്നമംഗലം', englishName: 'Kunnamangalam', lead: 'NONE', order: 30 },
            { name: 'കൊടുവള്ളി', englishName: 'Koduvally', lead: 'NONE', order: 31 },
            { name: 'തിരുവമ്പാടി', englishName: 'Thiruvambady', lead: 'NONE', order: 32 },
            { name: 'കൊണ്ടോട്ടി', englishName: 'Kondotty', lead: 'NONE', order: 33 },
            { name: 'ഏറനാട്', englishName: 'Ernad', lead: 'NONE', order: 34 },
            { name: 'നിലമ്പൂർ', englishName: 'Nilambur', lead: 'NONE', order: 35 },
            { name: 'വണ്ടൂർ', englishName: 'Wandoor', lead: 'NONE', order: 36 },
            { name: 'മഞ്ചേരി', englishName: 'Manjeri', lead: 'NONE', order: 37 },
            { name: 'പെരിന്തൽമണ്ണ', englishName: 'Perinthalmanna', lead: 'NONE', order: 38 },
            { name: 'മങ്കട', englishName: 'Mankada', lead: 'NONE', order: 39 },
            { name: 'മലപ്പുറം', englishName: 'Malappuram', lead: 'NONE', order: 40 },
            { name: 'വേങ്ങര', englishName: 'Vengara', lead: 'NONE', order: 41 },
            { name: 'വള്ളിക്കുന്ന്', englishName: 'Vallikkunnu', lead: 'NONE', order: 42 },
            { name: 'തിരൂരങ്ങാടി', englishName: 'Tirurangadi', lead: 'NONE', order: 43 },
            { name: 'താനൂർ', englishName: 'Tanur', lead: 'NONE', order: 44 },
            { name: 'തിരൂർ', englishName: 'Tirur', lead: 'NONE', order: 45 },
            { name: 'കോട്ടക്കൽ', englishName: 'Kottakkal', lead: 'NONE', order: 46 },
            { name: 'തവനൂർ', englishName: 'Tavanur', lead: 'NONE', order: 47 },
            { name: 'പൊന്നാനി', englishName: 'Ponnani', lead: 'NONE', order: 48 },
            { name: 'തൃത്താല', englishName: 'Thrithala', lead: 'NONE', order: 49 },
            { name: 'പട്ടാമ്പി', englishName: 'Pattambi', lead: 'NONE', order: 50 },
            { name: 'ഷൊർണൂർ', englishName: 'Shoranur', lead: 'NONE', order: 51 },
            { name: 'ഒറ്റപ്പാലം', englishName: 'Ottapalam', lead: 'NONE', order: 52 },
            { name: 'കോങ്ങാട്', englishName: 'Kongad', lead: 'NONE', order: 53 },
            { name: 'മണ്ണാർക്കാട്', englishName: 'Mannarkkad', lead: 'NONE', order: 54 },
            { name: 'മലമ്പുഴ', englishName: 'Malampuzha', lead: 'NONE', order: 55 },
            { name: 'പാലക്കാട്', englishName: 'Palakkad', lead: 'NONE', order: 56 },
            { name: 'തരൂർ', englishName: 'Tarur', lead: 'NONE', order: 57 },
            { name: 'ചിറ്റൂർ', englishName: 'Chittur', lead: 'NONE', order: 58 },
            { name: 'നെന്മാറ', englishName: 'Nenmara', lead: 'NONE', order: 59 },
            { name: 'ആലത്തൂർ', englishName: 'Alathur', lead: 'NONE', order: 60 },
            { name: 'ചേലക്കര', englishName: 'Chelakkara', lead: 'NONE', order: 61 },
            { name: 'കുന്നംകുളം', englishName: 'Kunnamkulam', lead: 'NONE', order: 62 },
            { name: 'ഗുരുവായൂർ', englishName: 'Guruvayur', lead: 'NONE', order: 63 },
            { name: 'മണലൂർ', englishName: 'Manalur', lead: 'NONE', order: 64 },
            { name: 'വടക്കാഞ്ചേരി', englishName: 'Wadakkanchery', lead: 'NONE', order: 65 },
            { name: 'ഒല്ലൂർ', englishName: 'Ollur', lead: 'NONE', order: 66 },
            { name: 'തൃശൂർ', englishName: 'Thrissur', lead: 'NONE', order: 67 },
            { name: 'നാട്ടിക', englishName: 'Nattika', lead: 'NONE', order: 68 },
            { name: 'കൈപ്പമംഗലം', englishName: 'Kaipamangalam', lead: 'NONE', order: 69 },
            { name: 'ഇരിങ്ങാലക്കുട', englishName: 'Irinjalakuda', lead: 'NONE', order: 70 },
            { name: 'പുതുക്കാട്', englishName: 'Pudukkad', lead: 'NONE', order: 71 },
            { name: 'ചാലക്കുടി', englishName: 'Chalakudy', lead: 'NONE', order: 72 },
            { name: 'കൊടുങ്ങല്ലൂർ', englishName: 'Kodungallur', lead: 'NONE', order: 73 },
            { name: 'പെരുമ്പാവൂർ', englishName: 'Perumbavoor', lead: 'NONE', order: 74 },
            { name: 'അങ്കമാലി', englishName: 'Angamaly', lead: 'NONE', order: 75 },
            { name: 'ആലുവ', englishName: 'Aluva', lead: 'NONE', order: 76 },
            { name: 'കളമശ്ശേരി', englishName: 'Kalamassery', lead: 'NONE', order: 77 },
            { name: 'പറവൂർ', englishName: 'Paravur', lead: 'NONE', order: 78 },
            { name: 'വൈപ്പിൻ', englishName: 'Vypin', lead: 'NONE', order: 79 },
            { name: 'കൊച്ചി', englishName: 'Kochi', lead: 'NONE', order: 80 },
            { name: 'തൃപ്പൂണിത്തുറ', englishName: 'Tripunithura', lead: 'NONE', order: 81 },
            { name: 'എറണാകുളം', englishName: 'Ernakulam', lead: 'NONE', order: 82 },
            { name: 'തൃക്കാക്കര', englishName: 'Thrikkakara', lead: 'NONE', order: 83 },
            { name: 'കുന്നത്തുനാട്', englishName: 'Kunnathunad', lead: 'NONE', order: 84 },
            { name: 'പിറവം', englishName: 'Piravom', lead: 'NONE', order: 85 },
            { name: 'മൂവാറ്റുപുഴ', englishName: 'Muvattupuzha', lead: 'NONE', order: 86 },
            { name: 'കോതമംഗലം', englishName: 'Kothamangalam', lead: 'NONE', order: 87 },
            { name: 'ദേവികുളം', englishName: 'Devikulam', lead: 'NONE', order: 88 },
            { name: 'ഉടുമ്പൻചോല', englishName: 'Udumbanchola', lead: 'NONE', order: 89 },
            { name: 'തൊടുപുഴ', englishName: 'Thodupuzha', lead: 'NONE', order: 90 },
            { name: 'ഇടുക്കി', englishName: 'Idukki', lead: 'NONE', order: 91 },
            { name: 'പീരുമേട്', englishName: 'Peerumade', lead: 'NONE', order: 92 },
            { name: 'പാലാ', englishName: 'Pala', lead: 'NONE', order: 93 },
            { name: 'കടുത്തുരുത്തി', englishName: 'Kaduthuruthy', lead: 'NONE', order: 94 },
            { name: 'വൈക്കം', englishName: 'Vaikom', lead: 'NONE', order: 95 },
            { name: 'ഏറ്റുമാനൂർ', englishName: 'Ettumanoor', lead: 'NONE', order: 96 },
            { name: 'കോട്ടയം', englishName: 'Kottayam', lead: 'NONE', order: 97 },
            { name: 'പുതുപ്പള്ളി', englishName: 'Puthuppally', lead: 'NONE', order: 98 },
            { name: 'ചങ്ങനാശ്ശേരി', englishName: 'Changanassery', lead: 'NONE', order: 99 },
            { name: 'കാഞ്ഞിരപ്പള്ളി', englishName: 'Kanjirappally', lead: 'NONE', order: 100 },
            { name: 'പൂഞ്ഞാർ', englishName: 'Poonjar', lead: 'NONE', order: 101 },
            { name: 'അരൂർ', englishName: 'Aroor', lead: 'NONE', order: 102 },
            { name: 'ചേർത്തല', englishName: 'Cherthala', lead: 'NONE', order: 103 },
            { name: 'ആലപ്പുഴ', englishName: 'Alappuzha', lead: 'NONE', order: 104 },
            { name: 'അമ്പലപ്പുഴ', englishName: 'Ambalappuzha', lead: 'NONE', order: 105 },
            { name: 'കുട്ടനാട്', englishName: 'Kuttanad', lead: 'NONE', order: 106 },
            { name: 'ഹരിപ്പാട്', englishName: 'Haripad', lead: 'NONE', order: 107 },
            { name: 'കായംകുളം', englishName: 'Kayamkulam', lead: 'NONE', order: 108 },
            { name: 'മാവേലിക്കര', englishName: 'Mavelikara', lead: 'NONE', order: 109 },
            { name: 'ചെങ്ങന്നൂർ', englishName: 'Chengannur', lead: 'NONE', order: 110 },
            { name: 'തിരുവല്ല', englishName: 'Thiruvalla', lead: 'NONE', order: 111 },
            { name: 'റാന്നി', englishName: 'Ranni', lead: 'NONE', order: 112 },
            { name: 'ആറന്മുള', englishName: 'Aranmula', lead: 'NONE', order: 113 },
            { name: 'കോന്നി', englishName: 'Konni', lead: 'NONE', order: 114 },
            { name: 'അടൂർ', englishName: 'Adoor', lead: 'NONE', order: 115 },
            { name: 'കരുനാഗപ്പള്ളി', englishName: 'Karunagappally', lead: 'NONE', order: 116 },
            { name: 'ചവറ', englishName: 'Chavara', lead: 'NONE', order: 117 },
            { name: 'കുന്നത്തൂർ', englishName: 'Kunnathur', lead: 'NONE', order: 118 },
            { name: 'കൊട്ടാരക്കര', englishName: 'Kottarakkara', lead: 'NONE', order: 119 },
            { name: 'പത്തനാപുരം', englishName: 'Pathanapuram', lead: 'NONE', order: 120 },
            { name: 'പുനലൂർ', englishName: 'Punalur', lead: 'NONE', order: 121 },
            { name: 'ചടയമംഗലം', englishName: 'Chadayamangalam', lead: 'NONE', order: 122 },
            { name: 'കുണ്ടറ', englishName: 'Kundara', lead: 'NONE', order: 123 },
            { name: 'കൊല്ലം', englishName: 'Kollam', lead: 'NONE', order: 124 },
            { name: 'ഇരവിപുരം', englishName: 'Eravipuram', lead: 'NONE', order: 125 },
            { name: 'ചാത്തന്നൂർ', englishName: 'Chathannoor', lead: 'NONE', order: 126 },
            { name: 'വർക്കല', englishName: 'Varkala', lead: 'NONE', order: 127 },
            { name: 'ആറ്റിങ്ങൽ', englishName: 'Attingal', lead: 'NONE', order: 128 },
            { name: 'ചിറയിൻകീഴ്', englishName: 'Chirayinkeezhu', lead: 'NONE', order: 129 },
            { name: 'നെടുമങ്ങാട്', englishName: 'Nedumangad', lead: 'NONE', order: 130 },
            { name: 'വാമനപുരം', englishName: 'Vamanapuram', lead: 'NONE', order: 131 },
            { name: 'കഴക്കൂട്ടം', englishName: 'Kazhakkoottam', lead: 'NONE', order: 132 },
            { name: 'വട്ടിയൂർക്കാവ്', englishName: 'Vattiyoorkavu', lead: 'NONE', order: 133 },
            { name: 'തിരുവനന്തപുരം', englishName: 'Thiruvananthapuram', lead: 'NONE', order: 134 },
            { name: 'നേമം', englishName: 'Nemom', lead: 'NONE', order: 135 },
            { name: 'അരുവിക്കര', englishName: 'Aruvikkara', lead: 'NONE', order: 136 },
            { name: 'പാറശ്ശാല', englishName: 'Parassala', lead: 'NONE', order: 137 },
            { name: 'കാട്ടാക്കട', englishName: 'Kattakkada', lead: 'NONE', order: 138 },
            { name: 'കോവളം', englishName: 'Kovalam', lead: 'NONE', order: 139 },
            { name: 'നെയ്യാറ്റിൻകര', englishName: 'Neyyattinkara', lead: 'NONE', order: 140 }
        ];

        // Wipe and re-seed
        await District.deleteMany({});
        await District.insertMany(keralaConstituencies);
        console.log('Database reset: 140 Kerala constituencies added.');
    } catch (err) {
        console.error('Initialization error:', err);
    }
};

app.get('/api/data', async (req, res) => {
    try {
        const data = await ElectionData.findById(DATA_ID);
        if (!data) {
            return res.json({
                totalSeats: 140,
                ldf: 0,
                udf: 0,
                nda: 0,
                others: 0
            });
        }
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/config', async (req, res) => {
    console.log('POST /api/config - Update:', req.body);
    try {
        // Only update fields provided in the body
        const updateData = { ...req.body, lastUpdated: Date.now() };

        const data = await ElectionData.findByIdAndUpdate(
            DATA_ID,
            updateData,
            { new: true, upsert: true }
        );
        console.log('Config updated successfully');
        res.json(data);
    } catch (err) {
        console.error('POST /api/config error:', err.message);
        res.status(500).json({ message: err.message });
    }
});

// District CRUD Routes
app.get('/api/districts', async (req, res) => {
    console.log('GET /api/districts requested');
    try {
        const districts = await District.find().sort('order');
        console.log(`Found ${districts.length} districts`);
        res.json(districts);
    } catch (err) {
        console.error('GET Districts Error:', err.message);
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/districts', async (req, res) => {
    console.log('POST /api/districts - New district:', req.body);
    try {
        const district = new District(req.body);
        await district.save();
        console.log('District saved successfully');
        res.status(201).json(district);
    } catch (err) {
        console.error('POST District Error:', err.message);
        res.status(400).json({ message: err.message });
    }
});

app.patch('/api/districts/:id', async (req, res) => {
    console.log(`PATCH /api/districts/${req.params.id} - Update:`, req.body);
    try {
        const district = await District.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!district) {
            console.log('District not found for update');
            return res.status(404).json({ message: 'District not found' });
        }
        console.log('District updated successfully');
        res.json(district);
    } catch (err) {
        console.error('PATCH District Error:', err.message);
        res.status(400).json({ message: err.message });
    }
});

app.delete('/api/districts/:id', async (req, res) => {
    console.log(`DELETE /api/districts/${req.params.id} requested`);
    try {
        const result = await District.findByIdAndDelete(req.params.id);
        if (!result) {
            console.log('District not found for deletion');
            return res.status(404).json({ message: 'District not found' });
        }
        console.log('District deleted successfully');
        res.json({ message: 'District deleted' });
    } catch (err) {
        console.error('DELETE District Error:', err.message);
        res.status(500).json({ message: err.message });
    }
});
// Serve Static Files for Frontend
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

app.get('/*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
        if (err) {
            // Fallback for API or errors
            res.status(404).send("Frontend not found. Please ensure 'npm run build' was successful.");
        }
    });
});

// Connect to DB first, then start server
console.log('Connecting to MongoDB...');
mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 30000, // Wait 30 seconds for connection
    connectTimeoutMS: 30000
})
.then(async () => {
    console.log('✅ MongoDB connected successfully');
    await initializeData();
    
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
})
.catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('TIP: Ensure your MongoDB service is running or check your MONGO_URI in .env');
    // Still start server but with error state if needed, or exit
    process.exit(1);
});
