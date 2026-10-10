// js/data.js

const appConfig = {
    profiles: {
        afcat: {
            id: 'afcat',
            name: 'Jayakumar',
            exam: 'AFCAT',
            theme: 'afcat-theme',
            subjects: ['english', 'general_awareness', 'numerical_ability', 'reasoning']
        },
        tnpsc: {
            id: 'tnpsc',
            name: 'Swathisri B A',
            exam: 'TNPSC Group 4',
            theme: 'tnpsc-theme',
            subjects: ['tamil', 'general_studies', 'aptitude']
        }
    },
    materials: {
        afcat: [
            { id: 'm1', title: 'AFCAT Study Material', path: 'study-materials/AFCAT/AFCAT Study Material.pdf' },
            { id: 'm2', title: 'AFCAT Syllabus', path: 'study-materials/AFCAT/AFCAT Syllabus.pdf' }
        ],
        tnpsc: [
            { id: 'm3', title: 'TNPSC SYLLABUS', path: 'study-materials/TNPSC/TNPSC SYLLABUS.pdf' },
            { id: 'm4', title: 'இந்திய ஆட்சியியல் (Indian Polity)', path: 'study-materials/TNPSC/இந்திய ஆட்சியியல் _1st_chapter.pdf' },
            { id: 'm5', title: 'இந்திய பொருளாதாரம் (Indian Economy)', path: 'study-materials/TNPSC/இந்திய பொருளாதாரம் _1st_chapter.pdf' },
            { id: 'm6', title: 'இந்திய வரலாறும் பண்பாடும் (Indian History)', path: 'study-materials/TNPSC/இந்திய வரலாறும் பண்பாடும்_1st_chapter.pdf' },
            { id: 'm7', title: 'இந்தியாவின் சுதந்திரப் போராட்டம் (Freedom Struggle)', path: 'study-materials/TNPSC/இந்தியாவின் சுதந்திரப் போராட்டம்_1st_chapter.pdf' },
            { id: 'm8', title: 'தமிழகத்தில் வளர்ச்சி நிர்வாகம்', path: 'study-materials/TNPSC/தமிழகத்தில் வளர்ச்சி நிர்வாகம்_1st_chapter.pdf' },
            { id: 'm9', title: 'தமிழ்நாட்டின் வரலாறு, கலாச்சாரம்...', path: 'study-materials/TNPSC/தமிழ்நாட்டின் வரலாறு, கலாச்சாரம், பாரம்பரியம் மற்றும் சமூக - அரசியல் இயக்கங்கள்_1st_chapter.pdf' },
            { id: 'm10', title: 'திறனறிவும் மனக்கணக்கு நுண்ணறிவும் (Aptitude)', path: 'study-materials/TNPSC/திறனறிவும் மனக்கணக்கு நுண்ணறிவும் _1st_chapter.pdf' },
            { id: 'm11', title: 'புவியியல் (Geography)', path: 'study-materials/TNPSC/புவியியல்  _1st_chapter.pdf' },
            { id: 'm12', title: 'பொது தமிழ் (General Tamil)', path: 'study-materials/TNPSC/பொது தமிழ் _1st_chapter.pdf' }
        ]
    },
    syllabus: {
        afcat: [
            {
                unit: 'English',
                id: 'english',
                topics: ['Comprehension', 'Error Detection', 'Sentence Completion', 'Synonyms and Antonyms', 'Testing of Vocabulary', 'Idioms and Phrases']
            },
            {
                unit: 'General Awareness',
                id: 'general_awareness',
                topics: ['History', 'Geography', 'Civics', 'Politics', 'Current Affairs', 'Environment', 'Basic Science', 'Defense', 'Art', 'Culture', 'Sports']
            },
            {
                unit: 'Numerical Ability',
                id: 'numerical_ability',
                topics: ['Decimal Fraction', 'Time and Work', 'Average', 'Profit & Loss', 'Percentage', 'Ratio & Proportion', 'Simple Interest', 'Time & Distance']
            },
            {
                unit: 'Reasoning and Military Aptitude',
                id: 'reasoning',
                topics: ['Verbal Skills and Spatial Ability']
            }
        ],
        tnpsc: [
            {
                unit: 'Part A: Tamil Eligibility-cum-Scoring Test (பொதுத் தமிழ்)',
                id: 'tamil',
                topics: ['இலக்கணம் (Grammar)', 'இலக்கியம் (Literature)', 'தமிழ் அறிஞர்களும் தமிழ்த் தொண்டும் (Tamil Authors and their Works)']
            },
            {
                unit: 'Part B: General Studies (பொது அறிவு)',
                id: 'general_studies',
                topics: ['General Science', 'Current Events', 'Geography of India', 'History and Culture of India', 'Indian Polity', 'Indian Economy', 'Indian National Movement', 'History, Culture, Heritage and Socio-Political Movements in Tamil Nadu', 'Development Administration in Tamil Nadu']
            },
            {
                unit: 'Aptitude and Mental Ability (திறனறிவும் மனக்கணக்கு நுண்ணறிவும்)',
                id: 'aptitude',
                topics: ['Simplification', 'Percentage', 'Highest Common Factor (HCF)', 'Lowest Common Multiple (LCM)', 'Ratio and Proportion', 'Simple interest', 'Compound interest', 'Area', 'Volume', 'Time and Work', 'Logical Reasoning', 'Puzzles-Dice', 'Visual Reasoning', 'Alpha numeric Reasoning', 'Number Series']
            }
        ]
    },
    gkFacts: []
};
