import multer from 'multer'
import path from 'path'
import fs from 'fs-extra';
import { v4 as uuidv4 } from 'uuid';

// Settings
const storage = multer.diskStorage({
    destination: async (_req, _file, cb) => {
        
        debugger
        
        // Create the destination folder if it doesn't exist
        const destination = path.join('uploads');
        await fs.ensureDir(destination);
        cb(null, destination);
      },
    filename: (_req, file, cb) => {
        cb(null, uuidv4() + path.extname(file.originalname))
    }
});



export default multer({storage});