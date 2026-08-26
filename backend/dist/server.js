"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const sharp_1 = __importDefault(require("sharp"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("./lib/db"));
const app = (0, express_1.default)();
const port = process.env.PORT || 4000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('GridAI Backend is running. Frontend should be accessed at http://localhost:3000');
});
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
// Auth Routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }
        const existingUser = await db_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with this email' });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await db_1.default.user.create({
            data: { name, email, password: hashedPassword }
        });
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
    }
    catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        const user = await db_1.default.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const isValid = await bcrypt_1.default.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Setup Multer for memory storage since we process on the fly
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});
// Basic heuristic layout recommendation engine
app.post('/api/recommend-layout', upload.array('images', 50), async (req, res) => {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            res.status(400).json({ error: 'No images provided' });
            return;
        }
        let portraitCount = 0;
        let landscapeCount = 0;
        // Analyze basic dimensions
        for (const file of files) {
            const metadata = await (0, sharp_1.default)(file.buffer).metadata();
            if (metadata.width && metadata.height) {
                if (metadata.height > metadata.width)
                    portraitCount++;
                else
                    landscapeCount++;
            }
        }
        // Heuristics for layout
        let recommendedLayout = 'grid';
        if (files.length === 2 && portraitCount === 2)
            recommendedLayout = 'split-v';
        else if (files.length === 2 && landscapeCount === 2)
            recommendedLayout = 'split-h';
        else if (files.length >= 3 && portraitCount > landscapeCount)
            recommendedLayout = 'masonry';
        else if (files.length === 3)
            recommendedLayout = 'asymmetric';
        res.json({ recommendedLayout, portraitCount, landscapeCount });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to process images' });
    }
});
app.post('/api/export', async (req, res) => {
    // In a real implementation, this would use sharp.composite() to stitch images
    // For now, it returns a success message to indicate the API is wired up.
    res.json({ message: 'Export initiated', url: 'https://placeholder.com/collage.png' });
});
app.listen(port, () => {
    console.log(`Backend server running on http://localhost:${port}`);
});
